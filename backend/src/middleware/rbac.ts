import { p } from '../utils/params';
import { Request, Response, NextFunction } from 'express';
import { store } from '../models/store';

export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const userId = req.user?.userId;
  const workspace = req.workspace ?? store.findWorkspaceById(p(req.params.id));

  if (!workspace) {
    res.status(404).json({ error: 'Workspace not found' });
    return;
  }

  if (workspace.ownerId !== userId) {
    res.status(403).json({ error: 'Only workspace owner can perform this action' });
    return;
  }

  req.workspace = workspace;
  next();
}

export function requireEditor(req: Request, res: Response, next: NextFunction): void {
  const userId = req.user?.userId;
  const workspace = req.workspace ?? store.findWorkspaceById(p(req.params.id));

  if (!workspace) {
    res.status(404).json({ error: 'Workspace not found' });
    return;
  }

  const isOwner = workspace.ownerId === userId;
  const collaborator = workspace.collaborators.find(c => c.userId === userId);
  const isEditor = isOwner || collaborator?.role === 'editor';

  if (!isEditor) {
    res.status(403).json({ error: 'Editor or Owner access required' });
    return;
  }

  req.workspace = workspace;
  next();
}

export function requireSystemAdmin(req: Request, res: Response, next: NextFunction): void {
  // In production, check for admin flag on JWT
  // For dev, allow a special header
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN && process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}
