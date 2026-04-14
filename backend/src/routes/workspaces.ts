import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateJWT, requireWorkspaceMember } from '../middleware/auth';
import { requireOwner } from '../middleware/rbac';
import { creditsService, CREDITS_COSTS } from '../services/credits.service';
import { generationService } from '../services/generation.service';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { ADRModel } from '../models/schemas/ADR.schema';
import { HistoryModel } from '../models/schemas/History.schema';
import { CommentModel } from '../models/schemas/Comment.schema';
import { NotificationModel } from '../models/schemas/Notification.schema';
import { p } from '../utils/params';
import { UserModel } from '../models/schemas/User.schema';
import { ArchitectureData } from '../types';

// Sub-route modules
import generationRoutes   from './generation.routes';
import collaborationRoutes from './collaboration.routes';
import historyRoutes      from './history.routes';
import exportRoutes       from './export.routes';

const router = Router();

// ─── Mount sub-routers ───────────────────────────────────────────────────────
// NOTE: ordering matters — more-specific paths first

router.use('/', generationRoutes);    // /generate, /generate/stream, /critique, /sync
router.use('/', historyRoutes);       // /history, /rollback
router.use('/', collaborationRoutes); // /collaborators, /nodes/:nodeId/comments
router.use('/', exportRoutes);        // /export, /archspec, /fork

// ─── GET /api/workspaces ─────────────────────────────────────────────────────
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId     = req.user!.userId;
  const workspaces = await WorkspaceModel.find({
    $or: [{ ownerId: userId }, { 'collaborators.userId': userId }],
  }).sort({ updatedAt: -1 }).lean();

  const result = workspaces.map(ws => ({
    id: ws._id,
    name: ws.name,
    description: ws.description,
    techStack: ws.techStack,
    architectureScore: ws.architectureScore,
    visibility: ws.visibility,
    collaborators: ws.collaborators.length,
    nodeCount: ws.architectureData?.nodes?.length ?? 0,
    updatedAt: ws.updatedAt,
    createdAt: ws.createdAt,
  }));

  return res.json({ data: result, total: result.length });
});

// ─── POST /api/workspaces ─────────────────────────────────────────────────────
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const schema = z.object({
    name:        z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    prompt:      z.string().max(2000).default(''),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.CREATE_WORKSPACE, {
    action: 'create_workspace',
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits', required: CREDITS_COSTS.CREATE_WORKSPACE });
  }

  const workspace = await new WorkspaceModel({
    ownerId: userId,
    name: parsed.data.name,
    description: parsed.data.description,
    prompt: parsed.data.prompt,
    architectureData: { nodes: [], edges: [], techStack: [], layoutDirection: 'TB' },
    collaborators: [],
    visibility: 'private',
    forkCount: 0,
    architectureScore: 0,
  }).save();

  return res.status(201).json({ data: workspace });
});

// ─── GET /api/workspaces/:id ──────────────────────────────────────────────────
router.get('/:id', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  return res.json({ data: req.workspace });
});

// ─── PATCH /api/workspaces/:id/design ────────────────────────────────────────
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

// ─── PATCH /api/workspaces/:id ────────────────────────────────────────────────
router.patch('/:id', authenticateJWT, requireWorkspaceMember('owner'), async (req: Request, res: Response) => {
  const schema = z.object({
    name:        z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    visibility:  z.enum(['private', 'team', 'public']).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const update: Record<string, any> = { ...parsed.data, updatedAt: new Date() };
  const workspace = await WorkspaceModel.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
  return res.json({ data: workspace });
});

// ─── DELETE /api/workspaces/:id ───────────────────────────────────────────────
router.delete('/:id', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const workspaceId = req.params.id;

  // Cascade delete all related documents
  await Promise.all([
    WorkspaceModel.findByIdAndDelete(workspaceId),
    ADRModel.deleteMany({ workspaceId }),
    HistoryModel.deleteMany({ workspaceId }),
    CommentModel.deleteMany({ workspaceId }),
  ]);

  return res.status(204).send();
});

// ─── ADR routes ───────────────────────────────────────────────────────────────

// GET /api/workspaces/:id/adrs
router.get('/:id/adrs', authenticateJWT, requireWorkspaceMember('viewer'), async (req: Request, res: Response) => {
  const adrs = await ADRModel.find({ workspaceId: req.params.id }).lean();
  return res.json({ data: adrs });
});

// POST /api/workspaces/:id/adrs
router.post('/:id/adrs', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { nodeId, title, context, decision, consequences, alternatives, generateWithAI } = req.body;

  let adrData = { title, decision, consequences, alternatives: alternatives ?? [] };

  if (generateWithAI) {
    const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.ADR_AI, { action: 'adr_ai' });
    if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

    const generated = await generationService.generateADR(
      p(req.params.id),
      title ?? 'Component',
      context ?? ''
    );
    adrData = generated as any;
  }

  if (!adrData.title) {
    return res.status(400).json({ error: 'ADR title is required' });
  }

  const adr = await new ADRModel({
    workspaceId: p(req.params.id),
    nodeId,
    title: adrData.title,
    context: context ?? '',
    decision: adrData.decision ?? '',
    consequences: adrData.consequences ?? '',
    alternatives: adrData.alternatives ?? [],
    status: 'proposed',
    createdBy: userId,
  }).save();

  await new NotificationModel({
    userId: req.workspace!.ownerId,
    type: 'adr_created',
    payload: { adrId: adr.id, title: adr.title, workspaceId: p(req.params.id) },
  }).save();

  return res.status(201).json({ data: adr });
});

// PATCH /api/workspaces/:id/adrs/:adrId
router.patch('/:id/adrs/:adrId', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const { title, context, decision, consequences, alternatives, status } = req.body;

  const adr = await ADRModel.findOneAndUpdate(
    { _id: req.params.adrId, workspaceId: req.params.id },
    {
      $set: {
        ...(title        && { title }),
        ...(context      && { context }),
        ...(decision     && { decision }),
        ...(consequences && { consequences }),
        ...(alternatives && { alternatives }),
        ...(status       && { status }),
        updatedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!adr) return res.status(404).json({ error: 'ADR not found' });
  return res.json({ data: adr });
});

export default router;
