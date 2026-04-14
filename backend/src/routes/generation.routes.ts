import { Router, Request, Response } from 'express';
import { authenticateJWT, requireWorkspaceMember } from '../middleware/auth';
import { generationService } from '../services/generation.service';
import { creditsService, CREDITS_COSTS } from '../services/credits.service';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { HistoryModel } from '../models/schemas/History.schema';
import { NotificationModel } from '../models/schemas/Notification.schema';
import { Workspace, ArchitectureData } from '../types';

const router = Router({ mergeParams: true });

// ─── POST /api/workspaces/:id/generate ───────────────────────────────────────
// Non-streaming generation (returns full result as JSON)
router.post('/:id/generate', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId    = req.user!.userId;
  const workspace = req.workspace!;
  const { prompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const creditsCost = creditsService.calculateGenerationCost(6);
  const deducted    = await creditsService.deductCredits(userId, creditsCost, {
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
        ? workspace.architectureData as ArchitectureData
        : undefined,
    });

    await WorkspaceModel.findByIdAndUpdate(workspace.id, {
      $set: {
        prompt,
        architectureData: result.architectureData,
        techStack: result.architectureData.techStack,
        architectureScore: result.criticFeedback.score,
        lastCriticRun: new Date(),
        updatedAt: new Date(),
      },
    });

    const historyCount = await HistoryModel.countDocuments({ workspaceId: workspace.id });
    await new HistoryModel({
      workspaceId: workspace.id,
      iteration: historyCount + 1,
      prompt,
      architectureData: result.architectureData,
      criticFeedback: result.criticFeedback,
      architectureScore: result.criticFeedback.score,
      creditsSpent: result.creditsUsed,
      modelUsed: result.modelUsed,
    }).save();

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
    await creditsService.addCredits(userId, creditsCost, 'earn', { reason: 'generation_failed_refund' });
    console.error('[Generation] Error:', error);
    return res.status(500).json({ error: 'Generation failed. Credits refunded.' });
  }
});

// ─── POST /api/workspaces/:id/generate/stream ─────────────────────────────────
// SSE streaming generation
router.post('/:id/generate/stream', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId    = req.user!.userId;
  const workspace = req.workspace!;
  const { prompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const creditsCost = creditsService.calculateGenerationCost(6);
  const deducted    = await creditsService.deductCredits(userId, creditsCost, {
    action: 'generate_stream',
    workspaceId: workspace.id,
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const abortController = new AbortController();
  req.on('close', () => abortController.abort());

  const sendEvent = (event: string, data: Record<string, unknown>) => {
    if (res.writableEnded) return;
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const heartbeat = setInterval(() => {
    if (!res.writableEnded) sendEvent('heartbeat', { timestamp: new Date().toISOString() });
  }, 15_000);

  try {
    const result = await generationService.generate({
      prompt,
      designData: workspace.designData,
      previousArchitecture: workspace.architectureData.nodes.length > 0
        ? workspace.architectureData as ArchitectureData
        : undefined,
      useStream: true,
      onEvent: sendEvent,
      signal: abortController.signal,
    });

    // Persist workspace
    await WorkspaceModel.findByIdAndUpdate(workspace.id, {
      $set: {
        prompt,
        architectureData: result.architectureData,
        techStack: result.architectureData.techStack,
        architectureScore: result.criticFeedback.score,
        lastCriticRun: new Date(),
        updatedAt: new Date(),
      },
    });

    // Save history entry
    const historyCount = await HistoryModel.countDocuments({ workspaceId: workspace.id });
    await new HistoryModel({
      workspaceId: workspace.id,
      iteration: historyCount + 1,
      prompt,
      architectureData: result.architectureData,
      criticFeedback: result.criticFeedback,
      architectureScore: result.criticFeedback.score,
      creditsSpent: result.creditsUsed,
      modelUsed: result.modelUsed,
    }).save();

    // Send complete event WITH criticFeedback so frontend can display issues
    sendEvent('complete', {
      architecture_data: result.architectureData,
      critic_feedback: result.criticFeedback,
      credits_used: result.creditsUsed,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('[SSE] Task aborted by client');
    } else {
      await creditsService.addCredits(userId, creditsCost, 'earn', { reason: 'stream_generation_failed_refund' });
      sendEvent('error', { message: 'Generation failed. Credits refunded.', retry_available: true });
    }
  } finally {
    clearInterval(heartbeat);
    if (!res.writableEnded) res.end();
  }

  return;
});

// ─── POST /api/workspaces/:id/critique ────────────────────────────────────────
router.post('/:id/critique', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId    = req.user!.userId;
  const workspace = req.workspace!;

  if ((workspace.architectureData as ArchitectureData).nodes.length === 0) {
    return res.status(400).json({ error: 'No architecture to critique. Generate first.' });
  }

  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.CRITIQUE, { action: 'critique' });
  if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

  const { nodes, edges } = workspace.architectureData as ArchitectureData;
  const score = Math.min(50 + nodes.length * 5 + edges.length * 2, 100);

  return res.json({
    data: {
      score,
      issues: [
        { severity: 'info',    title: 'Good separation of concerns', description: 'Services are well-defined', suggestion: 'Maintain this structure as you scale' },
        { severity: 'warning', title: 'Consider a circuit breaker', description: 'Cascading failures are possible', suggestion: 'Add resilience4j or implement retry+fallback patterns' },
      ],
      timestamp: new Date(),
    },
  });
});

// ─── POST /api/workspaces/:id/sync ────────────────────────────────────────────
router.post('/:id/sync', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId      = req.user!.userId;
  const workspaceId = req.params.id;
  const { modifiedFiles } = req.body;

  if (!modifiedFiles || !Array.isArray(modifiedFiles)) {
    return res.status(400).json({ error: 'modifiedFiles array is required' });
  }

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
      workspace.architectureData as unknown as ArchitectureData,
      modifiedFiles
    );

    await WorkspaceModel.findByIdAndUpdate(workspaceId, {
      $set: { architectureData: result.architectureData, updatedAt: new Date() },
    });

    await NotificationModel.create({
      userId,
      type: 'generation_done',
      payload: { workspaceId, report: result.report },
    });

    return res.json({ data: result.architectureData, report: result.report });
  } catch (err) {
    console.error('[Sync] Reconciliation failed:', err);
    await creditsService.addCredits(userId, CREDITS_COSTS.SYNC_RECONCILE, 'earn', { reason: 'sync_failed_refund' });
    return res.status(500).json({ error: 'Failed to synchronize architecture. Credits refunded.' });
  }
});

export default router;
