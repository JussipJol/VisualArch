import { Request, Response, NextFunction } from 'express';
import { requireWorkspaceMember } from './auth';

export const requireOwner = requireWorkspaceMember('owner');

export const requireEditor = requireWorkspaceMember('editor');

export function requireSystemAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN && process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}