import { Router, Request, Response } from 'express';
import { authenticateJWT, requireWorkspaceMember } from '../middleware/auth';
import { requireOwner } from '../middleware/rbac';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { HistoryModel } from '../models/schemas/History.schema';

const router = Router({ mergeParams: true });

// ─── GET /api/workspaces/:id/history ─────────────────────────────────────────
router.get('/:id/history', authenticateJWT, requireWorkspaceMember('viewer'), async (req: Request, res: Response) => {
  const page  = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip  = (page - 1) * limit;

  const [history, total] = await Promise.all([
    HistoryModel.find({ workspaceId: req.params.id })
      .sort({ iteration: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    HistoryModel.countDocuments({ workspaceId: req.params.id }),
  ]);

  return res.json({
    data: history.map(h => ({
      id: h._id,
      iteration: h.iteration,
      prompt: h.prompt,
      architectureScore: h.architectureScore,
      creditsSpent: h.creditsSpent,
      nodeCount: h.architectureData?.nodes?.length ?? 0,
      modelUsed: h.modelUsed,
      createdAt: h.createdAt,
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// ─── GET /api/workspaces/:id/history/:snapshotId ──────────────────────────────
router.get('/:id/history/:snapshotId', authenticateJWT, requireWorkspaceMember('viewer'), async (req: Request, res: Response) => {
  const snapshot = await HistoryModel.findOne({
    _id: req.params.snapshotId,
    workspaceId: req.params.id,
  }).lean();

  if (!snapshot) return res.status(404).json({ error: 'Snapshot not found' });
  return res.json({ data: snapshot });
});

// ─── POST /api/workspaces/:id/rollback/:snapshotId ───────────────────────────
router.post('/:id/rollback/:snapshotId', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const snapshot = await HistoryModel.findOne({
    _id: req.params.snapshotId,
    workspaceId: req.params.id,
  }).lean();

  if (!snapshot) {
    return res.status(404).json({ error: 'Snapshot not found' });
  }

  const updated = await WorkspaceModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        architectureData: snapshot.architectureData,
        techStack: snapshot.architectureData?.techStack ?? [],
        architectureScore: snapshot.architectureScore,
        prompt: snapshot.prompt,
        updatedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: 'Workspace not found' });

  return res.json({
    data: updated,
    message: `Rolled back to iteration #${snapshot.iteration}`,
  });
});

export default router;
