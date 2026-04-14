import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, WorkspaceRole } from '../types';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { UserModel } from '../models/schemas/User.schema';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET not found in environment. Auth middleware will fail.');
}

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

    // toObject() strips virtuals (including the default `id` getter), so add it manually
    const wsPlain = workspace.toObject() as any;
    wsPlain.id = workspace._id.toString();
    req.workspace = wsPlain;
    next();
  };
}

export function requireCredits(amount: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const user = await UserModel.findById(userId);
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
