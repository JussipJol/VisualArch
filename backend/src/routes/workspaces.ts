import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { authenticateJWT, requireWorkspaceMember } from '../middleware/auth';
import { requireOwner } from '../middleware/rbac';
import { generationService } from '../services/generation.service';
import { creditsService, CREDITS_COSTS } from '../services/credits.service';
import { Workspace, ArchitectureHistory, ArchitectureData, ADR } from '../types';
import { p } from '../utils/params';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { ADRModel } from '../models/schemas/ADR.schema';
import { NotificationModel } from '../models/schemas/Notification.schema';
import { UserModel } from '../models/schemas/User.schema';

const router = Router();

// GET /api/workspaces
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaces = await WorkspaceModel.find({
    $or: [{ ownerId: userId }, { 'collaborators.userId': userId }]
  }).sort({ updatedAt: -1 });

  const result = workspaces.map(ws => ({
    id: ws.id,
    name: ws.name,
    description: ws.description,
    techStack: ws.techStack,
    architectureScore: ws.architectureScore,
    visibility: ws.visibility,
    collaborators: ws.collaborators.length,
    nodeCount: ws.architectureData.nodes.length,
    updatedAt: ws.updatedAt,
    createdAt: ws.createdAt,
  }));

  return res.json({ data: result, total: result.length });
});

// POST /api/workspaces
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const schema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    prompt: z.string().default(''),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  // Atomic check and deduct credits
  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.CREATE_WORKSPACE, {
    action: 'create_workspace',
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits', required: CREDITS_COSTS.CREATE_WORKSPACE });
  }

  const workspace = new WorkspaceModel({
    ownerId: userId,
    name: parsed.data.name,
    description: parsed.data.description,
    prompt: parsed.data.prompt,
    architectureData: { nodes: [], edges: [], techStack: [], layoutDirection: 'TB' },
    collaborators: [],
    visibility: 'private',
    forkCount: 0,
    architectureScore: 0,
  });

  await workspace.save();
  return res.status(201).json({ data: workspace });
});

// GET /api/workspaces/:id
router.get('/:id', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  return res.json({ data: req.workspace });
});

// PATCH /api/workspaces/:id/design
router.patch('/:id/design', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const { designData } = req.body;
  
  const workspace = await WorkspaceModel.findByIdAndUpdate(
    req.params.id,
    { $set: { designData, updatedAt: new Date() } },
    { new: true }
  );

  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
  return res.json({ data: workspace });
});

// PATCH /api/workspaces/:id
router.patch('/:id', authenticateJWT, requireWorkspaceMember('owner'), async (req: Request, res: Response) => {
  const { name, description, visibility } = req.body;
  const update: Record<string, unknown> = {};

  if (name) update.name = name;
  if (description !== undefined) update.description = description;
  if (visibility) update.visibility = visibility;

  const workspace = await WorkspaceModel.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
  return res.json({ data: workspace });
});

// DELETE /api/workspaces/:id
router.delete('/:id', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  await WorkspaceModel.findByIdAndDelete(req.params.id);
  await ADRModel.deleteMany({ workspaceId: req.params.id });
  return res.status(204).send();
});

// POST /api/workspaces/:id/generate (JSON response)
router.post('/:id/generate', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;
  const { prompt, designCanvasData } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  // Calculate credits cost
  const estimatedNodeCount = 6; // estimated
  const creditsCost = creditsService.calculateGenerationCost(estimatedNodeCount);

  const deducted = creditsService.deductCredits(userId, creditsCost, {
    action: 'generate',
    workspaceId: workspace.id,
    prompt: prompt.substring(0, 100),
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits', required: creditsCost });
  }

  try {
    const result = await generationService.generate({
      prompt,
      designData: workspace.designData,
      previousArchitecture: workspace.architectureData.nodes.length > 0
        ? workspace.architectureData : undefined,
    });

    // Update workspace
    workspace.prompt = prompt;
    workspace.architectureData = result.architectureData;
    workspace.techStack = result.architectureData.techStack;
    workspace.architectureScore = result.criticFeedback.score;
    workspace.lastCriticRun = new Date();
    workspace.updatedAt = new Date();
    store.saveWorkspace(workspace);

    // Save to history
    const iteration = store.getHistory(workspace.id).length + 1;
    const historyEntry: ArchitectureHistory = {
      id: uuidv4(),
      workspaceId: workspace.id,
      iteration,
      prompt,
      architectureData: result.architectureData,
      criticFeedback: result.criticFeedback,
      architectureScore: result.criticFeedback.score,
      creditsSpent: result.creditsUsed,
      modelUsed: result.modelUsed,
      createdAt: new Date(),
    };
    store.addHistory(workspace.id, historyEntry);

    return res.json({
      data: {
        architectureData: result.architectureData,
        criticFeedback: result.criticFeedback,
        architectureScore: result.criticFeedback.score,
        creditsUsed: result.creditsUsed,
        totalTimeMs: result.totalTimeMs,
      },
    });
  } catch (error) {
    // Refund credits on failure
    await creditsService.addCredits(userId, creditsCost, 'earn', { reason: 'generation_failed_refund' });
    console.error('[Generation] Error:', error);
    return res.status(500).json({ error: 'Generation failed. Credits refunded.' });
  }
});

// POST /api/workspaces/:id/generate/stream (SSE)
router.post('/:id/generate/stream', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const creditsCost = creditsService.calculateGenerationCost(6);
  const deducted = await creditsService.deductCredits(userId, creditsCost, {
    action: 'generate_stream',
    workspaceId: workspace.id,
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits' });
  }

  // SSE setup
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const abortController = new AbortController();
  req.on('close', () => {
    console.log(`[SSE] Client disconnected, aborting generation for workspace ${workspace.id}`);
    abortController.abort();
  });

  const sendEvent = (event: string, data: Record<string, unknown>) => {
    if (res.writableEnded) return;
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Heartbeat
  const heartbeat = setInterval(() => {
    sendEvent('heartbeat', { timestamp: new Date().toISOString() });
  }, 15000);

  try {
    const result = await generationService.generate({
      prompt,
      designData: workspace.designData,
      previousArchitecture: workspace.architectureData.nodes.length > 0
        ? workspace.architectureData : undefined,
      useStream: true,
      onEvent: sendEvent,
      signal: abortController.signal,
    });

    // Update workspace
    workspace.prompt = prompt;
    workspace.architectureData = result.architectureData;
    workspace.techStack = result.architectureData.techStack;
    workspace.architectureScore = result.criticFeedback.score;
    workspace.lastCriticRun = new Date();
    await WorkspaceModel.findByIdAndUpdate(workspace.id, { $set: workspace });

    clearInterval(heartbeat);
    if (!res.writableEnded) res.end();
  } catch (error: any) {
    clearInterval(heartbeat);
    if (error.name === 'AbortError') {
      console.log('[SSE] Task aborted successfully');
    } else {
      await creditsService.addCredits(userId, creditsCost, 'earn', { reason: 'stream_generation_failed_refund' });
      sendEvent('error', { message: 'Generation failed', stage: 'unknown', retry_available: true });
    }
    if (!res.writableEnded) res.end();
  }

  return;
});

// GET /api/workspaces/:id/history
router.get('/:id/history', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  const history = store.getHistory(p(req.params.id));
  return res.json({ data: history.map(h => ({
    id: h.id,
    iteration: h.iteration,
    prompt: h.prompt,
    architectureScore: h.architectureScore,
    creditsSpent: h.creditsSpent,
    nodeCount: h.architectureData.nodes.length,
    createdAt: h.createdAt,
  }))});
});

// POST /api/workspaces/:id/rollback/:snapshot_id
router.post('/:id/rollback/:snapshot_id', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  // Logic simplified: Rollback would require a History collection or versioning. 
  // For now, we stub it as we are moving to MongoDB and didn't implement HistoryModel yet.
  return res.status(501).json({ error: 'Rollback not yet implemented in MongoDB version' });
});

// GET /api/workspaces/:id/archspec
router.get('/:id/archspec', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  const ws = req.workspace!;
  const archspec = generateArchSpec(ws);
  return res.json({ data: archspec });
});

function generateArchSpec(ws: Workspace): string {
  const lines = [
    `# ArchSpec DSL - Generated by VisualArch AI`,
    `# Workspace: ${ws.name}`,
    ``,
    `name: "${ws.name}"`,
    `description: "${ws.description ?? ''}"`,
    `version: "1.0.0"`,
    ``,
    `tech_stack:`,
    ...ws.techStack.map(t => `  - ${t}`),
    ``,
    `services:`,
    ...ws.architectureData.nodes.map(n => `  - id: ${n.id}\n    label: "${n.label}"\n    layer: "${n.layer}"\n    description: "${n.description}"`),
    ``,
    `connections:`,
    ...ws.architectureData.edges.map(e => `  - from: ${e.source}\n    to: ${e.target}\n    type: ${e.label ?? 'http'}`),
  ];
  return lines.join('\n');
}

// POST /api/workspaces/:id/fork
router.post('/:id/fork', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const sourceWs = store.findWorkspaceById(p(req.params.id));

  if (!sourceWs) return res.status(404).json({ error: 'Workspace not found' });
  if (sourceWs.visibility !== 'public') {
    return res.status(403).json({ error: 'Can only fork public workspaces' });
  }

  const forked = new WorkspaceModel({
    ...sourceWs,
    _id: undefined, // Let mongoose generate a new ID
    id: undefined,
    ownerId: userId,
    name: `${sourceWs.name} (Fork)`,
    collaborators: [],
    visibility: 'private',
    forkCount: 0,
  });

  await forked.save();

  // Increment source fork count
  await WorkspaceModel.findByIdAndUpdate(sourceWs._id ?? sourceWs.id, { $inc: { forkCount: 1 } });

  // Earn credits for sharing
  await creditsService.addCredits(sourceWs.ownerId, 20, 'earn', {
    reason: 'workspace_forked',
    forkedBy: userId,
  });

  return res.status(201).json({ data: forked });
});

// POST /api/workspaces/:id/collaborators
router.post('/:id/collaborators', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const { email, role } = req.body;
  const workspace = req.workspace!;
  const ownerId = req.user!.userId;

  const invitee = store.findUserByEmail(email);
  if (!invitee) return res.status(404).json({ error: 'User not found' });
  if (invitee.id === workspace.ownerId) return res.status(400).json({ error: 'Cannot invite yourself' });

  const existing = workspace.collaborators.find(c => c.userId === invitee.id);
  if (existing) return res.status(409).json({ error: 'User already a collaborator' });

  workspace.collaborators.push({
    userId: invitee.id,
    role: role ?? 'viewer',
    invitedBy: ownerId,
    acceptedAt: new Date(),
  });
  
  await WorkspaceModel.findByIdAndUpdate(workspace.id, { 
    $set: { collaborators: workspace.collaborators } 
  });

  // Bonus credits for inviting
  await creditsService.addCredits(ownerId, 20, 'earn', {
    reason: 'invited_collaborator',
    inviteeId: invitee.id,
  });

  // Create notification for invitee
  const notif = new NotificationModel({
    userId: invitee.id,
    type: 'collab_invite',
    payload: { workspaceId: workspace.id, workspaceName: workspace.name, role },
  });
  await notif.save();

  return res.status(201).json({ message: 'Collaborator added', collaborators: workspace.collaborators });
});

// PATCH /api/workspaces/:id/collaborators/:userId
router.patch('/:id/collaborators/:userId', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, (req: Request, res: Response) => {
  const { role } = req.body;
  const workspace = req.workspace!;
  const collab = workspace.collaborators.find(c => c.userId === p(req.params.userId));

  if (!collab) return res.status(404).json({ error: 'Collaborator not found' });
  collab.role = role;
  store.saveWorkspace(workspace);

  return res.json({ message: 'Role updated', collaborators: workspace.collaborators });
});

// DELETE /api/workspaces/:id/collaborators/:userId
router.delete('/:id/collaborators/:userId', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, (req: Request, res: Response) => {
  const workspace = req.workspace!;
  workspace.collaborators = workspace.collaborators.filter(c => c.userId !== p(req.params.userId));
  store.saveWorkspace(workspace);

  return res.json({ message: 'Collaborator removed' });
});

// GET /api/workspaces/:id/adrs
router.get('/:id/adrs', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  return res.json({ data: store.getADRsByWorkspace(p(req.params.id)) });
});

// POST /api/workspaces/:id/adrs
router.post('/:id/adrs', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = store.findUserById(userId);
  const { nodeId, title, context, decision, consequences, alternatives, generateWithAI } = req.body;

  let adrData = { title, decision, consequences, alternatives: alternatives ?? [] };

  if (generateWithAI) {
    const creditsCost = CREDITS_COSTS.ADR_AI;
    const deducted = await creditsService.deductCredits(userId, creditsCost, { action: 'adr_ai' });
    if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

    const generated = await generationService.generateADR(p(req.params.id), title ?? 'Component', context ?? '');
    adrData = generated;
  }

  const adr = new ADRModel({
    workspaceId: p(req.params.id),
    nodeId,
    title: adrData.title,
    context: context ?? '',
    decision: adrData.decision,
    consequences: adrData.consequences,
    alternatives: adrData.alternatives,
    status: 'proposed',
    createdBy: userId,
  });

  await adr.save();

  // Create notification for owner
  const notif = new NotificationModel({
    userId: req.workspace!.ownerId,
    type: 'adr_created',
    payload: { adrId: adr.id, title: adr.title, workspaceId: p(req.params.id) },
  });
  await notif.save();

  return res.status(201).json({ data: adr });
});

// PATCH /api/workspaces/:id/adrs/:adrId
router.patch('/:id/adrs/:adrId', authenticateJWT, requireWorkspaceMember('editor'), (req: Request, res: Response) => {
  const adr = store.findADRById(p(req.params.adrId));
  if (!adr || adr.workspaceId !== p(req.params.id)) return res.status(404).json({ error: 'ADR not found' });

  const { title, context, decision, consequences, alternatives, status } = req.body;
  if (title) adr.title = title;
  if (context) adr.context = context;
  if (decision) adr.decision = decision;
  if (consequences) adr.consequences = consequences;
  if (alternatives) adr.alternatives = alternatives;
  if (status) adr.status = status;
  adr.updatedAt = new Date();

  store.saveADR(adr);
  return res.json({ data: adr });
});

// GET /api/workspaces/:id/nodes/:nodeId/comments
router.get('/:id/nodes/:nodeId/comments', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  const comments = store.getCommentsByNode(p(req.params.id), p(req.params.nodeId));
  return res.json({ data: comments });
});

// POST /api/workspaces/:id/nodes/:nodeId/comments
router.post('/:id/nodes/:nodeId/comments', authenticateJWT, requireWorkspaceMember('editor'), (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = store.findUserById(userId);
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Comment text is required' });

  const comment = store.addComment({
    id: uuidv4(),
    workspaceId: p(req.params.id),
    nodeId: p(req.params.nodeId),
    authorId: userId,
    authorName: user?.name ?? 'Unknown',
    text,
    resolved: false,
    createdAt: new Date(),
  });

  return res.status(201).json({ data: comment });
});

// PATCH /api/workspaces/:id/comments/:commentId/resolve
router.patch('/:id/comments/:commentId/resolve', authenticateJWT, requireWorkspaceMember('editor'), (req: Request, res: Response) => {
  const comment = store.findCommentById(p(req.params.commentId));
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  comment.resolved = true;
  return res.json({ data: comment });
});

// POST /api/workspaces/:id/export
router.post('/:id/export', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;
  const { platform = 'vercel-railway' } = req.body;

  const creditsCost = CREDITS_COSTS.CICD;
  const deducted = await creditsService.deductCredits(userId, creditsCost, { action: 'cicd_export' });
  if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

  const cicdConfig = await generationService.generateCICDConfig(
    workspace.id,
    workspace.techStack,
    platform,
  );

  return res.json({
    data: {
      cicdYaml: cicdConfig,
      archspecYaml: generateArchSpec(workspace),
      platform,
      message: 'CI/CD configuration generated. Download as ZIP from the export page.',
    },
  });
});

// POST /api/workspaces/:id/critique
router.post('/:id/critique', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;

  if (workspace.architectureData.nodes.length === 0) {
    return res.status(400).json({ error: 'No architecture to critique. Generate first.' });
  }

  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.CRITIQUE, { action: 'critique' });
  if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

  // Simulate critique
  await new Promise(r => setTimeout(r, 1000));

  const { nodes, edges } = workspace.architectureData;
  const score = Math.min(
    50 + nodes.length * 5 + edges.length * 2,
    100
  );

  return res.json({
    data: {
      score,
      issues: [
        { severity: 'info', title: 'Good separation of concerns', description: 'Services are well defined', suggestion: 'Continue maintaining this separation' },
        { severity: 'warning', title: 'Consider adding a circuit breaker', description: 'Cascading failures are possible', suggestion: 'Add resilience4j or similar' },
      ],
      timestamp: new Date(),
    },
  });
});

// POST /api/workspaces/:id/sync
router.post('/:id/sync', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = req.params.id;
  const { modifiedFiles } = req.body;

  if (!modifiedFiles || !Array.isArray(modifiedFiles)) {
    return res.status(400).json({ error: 'Modified files are required' });
  }

  // Deduct credits for sync
  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.SYNC_RECONCILE, {
    action: 'sync_architecture',
    workspaceId,
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits', required: CREDITS_COSTS.SYNC_RECONCILE });
  }

  try {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

    const result = await generationService.reconcileArchitecture(
      workspace.architectureData as any,
      modifiedFiles
    );

    workspace.architectureData = result.architectureData as any;
    workspace.updatedAt = new Date();
    await workspace.save();

    // Create a notification for the user
    await NotificationModel.create({
      userId,
      title: 'Architecture Synchronized',
      message: result.report,
      type: 'info'
    });

    return res.json({ data: result.architectureData, report: result.report });
  } catch (err) {
    console.error('[Sync] Reconciliation failed:', err);
    return res.status(500).json({ error: 'Failed to synchronize architecture' });
  }
});

export default router;
