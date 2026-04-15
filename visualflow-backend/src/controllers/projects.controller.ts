import { Response } from 'express';
import { Project } from '../models/Project.model';
import { ProjectMemory } from '../models/ProjectMemory.model';
import { AuthRequest } from '../types';
import { Types } from 'mongoose';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Return projects the user owns OR is a collaborator on
    const projects = await Project.find({
      $or: [
        { userId: req.user!.userId },
        { 'collaborators.userId': new Types.ObjectId(req.user!.userId) },
      ]
    }).sort({ updatedAt: -1 });
    res.json({ projects });
  } catch {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Project name is required' });
      return;
    }
    const project = await Project.create({
      userId: req.user!.userId,
      name,
      description: description || '',
    });
    // Initialize memory
    await ProjectMemory.create({ projectId: project._id });
    res.status(201).json({ project });
  } catch {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user!.userId },
        { 'collaborators.userId': new Types.ObjectId(req.user!.userId) },
      ],
    });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ project });
  } catch {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, currentStage, designSystem } = req.body;
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { userId: req.user!.userId },
          { 'collaborators.userId': new Types.ObjectId(req.user!.userId) },
        ],
      },
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(currentStage && { currentStage }),
        ...(designSystem !== undefined && { designSystem }),
      },
      { new: true }
    );
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ project });
  } catch {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// PATCH — partial update (same implementation, alias for design system saves)
export const patchProject = updateProject;

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    // Cascade delete
    await ProjectMemory.deleteOne({ projectId: new Types.ObjectId(req.params.id) });
    res.json({ message: 'Project deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
