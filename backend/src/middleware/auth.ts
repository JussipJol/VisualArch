import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, WorkspaceRole } from '../types';
import { store } from '../models/store';

const JWT_SECRET = process.env.JWT_SECRET ?? 'visualarch_jwt_secret_dev_2025';

import { WorkspaceModel } from '../models/schemas/Workspace.schema';

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireWorkspaceMember(minRole: WorkspaceRole = 'viewer') {
  const roleHierarchy: Record<WorkspaceRole, number> = {
    viewer: 1, editor: 2, owner: 3,
  };

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const workspace = await WorkspaceModel.findById(id);
    if (!workspace) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    const isOwner = workspace.ownerId === userId;
    const collaborator = workspace.collaborators.find(c => c.userId === userId);
    const userRole: WorkspaceRole = isOwner ? 'owner' : (collaborator?.role ?? 'viewer');

    if (roleHierarchy[userRole] < roleHierarchy[minRole]) {
      // Allow viewers to view public workspaces
      if (workspace.visibility === 'public' && minRole === 'viewer') {
        req.workspace = workspace.toObject();
        next();
        return;
      }
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    req.workspace = workspace.toObject();
    next();
  };
}

export function requireCredits(amount: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const user = store.findUserById(userId);
    if (!user || user.creditsBalance < amount) {
      res.status(402).json({
        error: 'Insufficient credits',
        required: amount,
        available: user?.creditsBalance ?? 0,
      });
      return;
    }
    next();
  };
}
