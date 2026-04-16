import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { Project } from '../models/Project.model';
import { AuthRequest } from '../types';
import { Types } from 'mongoose';

const INVITE_SECRET = config.jwtSecret + '_invite';

/** POST /projects/:id/invite — generates a signed invite link token */
export const generateInviteLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: projectId } = req.params;

    // Only owner can generate invite links
    const project = await Project.findOne({ _id: projectId, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found or access denied' });
      return;
    }

    // Sign a token that expires in 7 days
    const token = jwt.sign(
      { projectId, type: 'invite' },
      INVITE_SECRET,
      { expiresIn: '7d' }
    );

    const inviteUrl = `${req.headers.origin || 'http://localhost:5173'}/join/${token}`;
    res.json({ token, inviteUrl, expiresIn: '7 days' });
  } catch (err) {
    console.error('[Invite] Generate error:', err);
    res.status(500).json({ error: 'Failed to generate invite link' });
  }
};

/** POST /invite/join — accepts an invite using a token */
export const acceptInvite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    // Verify the invite token
    let payload: { projectId: string; type: string };
    try {
      payload = jwt.verify(token, INVITE_SECRET) as { projectId: string; type: string };
    } catch {
      res.status(400).json({ error: 'Invalid or expired invite link' });
      return;
    }

    if (payload.type !== 'invite') {
      res.status(400).json({ error: 'Invalid invite token type' });
      return;
    }

    const { projectId } = payload;
    const userId = new Types.ObjectId(req.user!.userId);

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Check if user is already owner
    if (project.userId.toString() === req.user!.userId) {
      res.json({ project, message: 'You are the owner of this project', alreadyMember: true });
      return;
    }

    // Check if already a collaborator
    const alreadyCollaborator = project.collaborators.some(
      c => c.userId.toString() === req.user!.userId
    );

    if (!alreadyCollaborator) {
      await Project.findByIdAndUpdate(projectId, {
        $push: { collaborators: { userId, role: 'editor' } }
      });
    }

    const updatedProject = await Project.findById(projectId);
    res.json({
      project: updatedProject,
      message: alreadyCollaborator ? 'Already a member of this project' : 'Successfully joined the project',
      alreadyMember: alreadyCollaborator,
    });
  } catch (err) {
    console.error('[Invite] Accept error:', err);
    res.status(500).json({ error: 'Failed to accept invite' });
  }
};

/** GET /projects/:id/collaborators — lists all collaborators */
export const getCollaborators = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user!.userId },
        { 'collaborators.userId': new Types.ObjectId(req.user!.userId) },
      ],
    }).populate('collaborators.userId', 'name email');

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({
      owner: project.userId,
      collaborators: project.collaborators,
    });
  } catch (err) {
    console.error('[Invite] Get collaborators error:', err);
    res.status(500).json({ error: 'Failed to fetch collaborators' });
  }
};
