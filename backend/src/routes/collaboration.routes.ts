import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateJWT, requireWorkspaceMember } from '../middleware/auth';
import { requireOwner } from '../middleware/rbac';
import { creditsService } from '../services/credits.service';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { CommentModel } from '../models/schemas/Comment.schema';
import { NotificationModel } from '../models/schemas/Notification.schema';
import { UserModel } from '../models/schemas/User.schema';

const router = Router({ mergeParams: true });

// ─── Collaborators ────────────────────────────────────────────────────────────

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['editor', 'viewer']).default('viewer'),
});

// POST /api/workspaces/:id/collaborators
router.post('/:id/collaborators', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const { email, role } = parsed.data;
  const workspace = req.workspace!;
  const ownerId   = req.user!.userId;

  const invitee = await UserModel.findOne({ email });
  if (!invitee) return res.status(404).json({ error: 'User not found' });
  if (invitee.id === workspace.ownerId) return res.status(400).json({ error: 'Cannot invite yourself' });

  const alreadyMember = workspace.collaborators.some(c => c.userId === invitee.id);
  if (alreadyMember) return res.status(409).json({ error: 'User is already a collaborator' });

  workspace.collaborators.push({
    userId: invitee.id,
    role,
    invitedBy: ownerId,
    acceptedAt: new Date(),
  });

  await WorkspaceModel.findByIdAndUpdate(workspace.id, {
    $set: { collaborators: workspace.collaborators },
  });

  await creditsService.addCredits(ownerId, 20, 'earn', {
    reason: 'invited_collaborator',
    inviteeId: invitee.id,
  });

  await new NotificationModel({
    userId: invitee.id,
    type: 'collab_invite',
    payload: { workspaceId: workspace.id, workspaceName: workspace.name, role },
  }).save();

  return res.status(201).json({ message: 'Collaborator added', collaborators: workspace.collaborators });
});

// PATCH /api/workspaces/:id/collaborators/:userId
router.patch('/:id/collaborators/:userId', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const { role } = req.body;
  if (!['editor', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "editor" or "viewer"' });
  }

  const workspace = req.workspace!;
  const collab    = workspace.collaborators.find(c => c.userId === req.params.userId);
  if (!collab) return res.status(404).json({ error: 'Collaborator not found' });

  collab.role = role;
  await WorkspaceModel.findByIdAndUpdate(workspace.id, {
    $set: { collaborators: workspace.collaborators },
  });

  return res.json({ message: 'Role updated', collaborators: workspace.collaborators });
});

// DELETE /api/workspaces/:id/collaborators/:userId
router.delete('/:id/collaborators/:userId', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const workspace = req.workspace!;
  workspace.collaborators = workspace.collaborators.filter(c => c.userId !== req.params.userId);

  await WorkspaceModel.findByIdAndUpdate(workspace.id, {
    $set: { collaborators: workspace.collaborators },
  });

  return res.json({ message: 'Collaborator removed' });
});

// ─── Comments ─────────────────────────────────────────────────────────────────

// GET /api/workspaces/:id/nodes/:nodeId/comments
router.get('/:id/nodes/:nodeId/comments', authenticateJWT, requireWorkspaceMember('viewer'), async (req: Request, res: Response) => {
  const comments = await CommentModel.find({
    workspaceId: req.params.id,
    nodeId: req.params.nodeId,
  }).sort({ createdAt: 1 });

  return res.json({ data: comments });
});

// POST /api/workspaces/:id/nodes/:nodeId/comments
router.post('/:id/nodes/:nodeId/comments', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { text } = req.body;

  if (!text?.trim()) return res.status(400).json({ error: 'Comment text is required' });

  const user = await UserModel.findById(userId).select('name').lean();

  const comment = await new CommentModel({
    workspaceId: req.params.id,
    nodeId: req.params.nodeId,
    authorId: userId,
    authorName: user?.name ?? 'Unknown',
    text: text.trim(),
    resolved: false,
  }).save();

  return res.status(201).json({ data: comment });
});

// PATCH /api/workspaces/:id/comments/:commentId/resolve
router.patch('/:id/comments/:commentId/resolve', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const comment = await CommentModel.findOneAndUpdate(
    { _id: req.params.commentId, workspaceId: req.params.id },
    { $set: { resolved: true } },
    { new: true }
  );

  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  return res.json({ data: comment });
});

export default router;
