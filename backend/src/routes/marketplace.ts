import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { creditsService } from '../services/credits.service';
import { p } from '../utils/params';
import { Template, Workspace } from '../types';
import { TemplateModel } from '../models/schemas/Template.schema';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { UserModel } from '../models/schemas/User.schema';

const router = Router();

// GET /api/templates
router.get('/', async (req: Request, res: Response) => {
  const { category, techStack, premium, q } = req.query;

  const query: any = { isPublic: true };

  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  if (techStack) {
    const stacks = String(techStack).split(',');
    query.techStack = { $in: stacks };
  }

  if (premium !== undefined) {
    query.isPremium = premium === 'true';
  }

  if (q) {
    const searchString = String(q);
    query.$or = [
      { title: { $regex: searchString, $options: 'i' } },
      { description: { $regex: searchString, $options: 'i' } }
    ];
  }

  const templates = await TemplateModel.find(query).sort({ useCount: -1 });

  return res.json({
    data: templates.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category,
      techStack: t.techStack,
      authorName: t.authorName,
      isPremium: t.isPremium,
      price: t.price,
      useCount: t.useCount,
      rating: t.rating,
      nodeCount: t.architectureData.nodes.length,
      createdAt: t.createdAt,
    })),
    total: templates.length,
  });
});

// GET /api/templates/:id
router.get('/:id', async (req: Request, res: Response) => {
  const template = await TemplateModel.findById(p(req.params.id));
  if (!template) return res.status(404).json({ error: 'Template not found' });

  return res.json({ data: template });
});

// POST /api/templates - publish workspace as template
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await UserModel.findById(userId);
  const { workspaceId, title, description, category, isPremium, price } = req.body;

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace || workspace.ownerId !== userId) {
    return res.status(403).json({ error: 'Workspace not found or access denied' });
  }

  const template = new TemplateModel({
    title: title ?? workspace.name,
    description: description ?? workspace.description ?? '',
    category: category ?? 'General',
    techStack: workspace.techStack,
    architectureData: workspace.architectureData,
    authorId: userId,
    authorName: user?.name ?? 'Unknown',
    isPremium: isPremium ?? false,
    price: isPremium ? (price ?? 10) : 0,
    useCount: 0,
    rating: 0,
    isPublic: true,
  });

  await template.save();

  // Make workspace public
  workspace.visibility = 'public';
  await workspace.save();

  return res.status(201).json({ data: template });
});

// POST /api/templates/:id/use - create workspace from template
router.post('/:id/use', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const template = await TemplateModel.findById(p(req.params.id));

  if (!template) return res.status(404).json({ error: 'Template not found' });

  if (template.isPremium) {
    const deducted = await creditsService.deductCredits(userId, template.price, {
      action: 'use_premium_template',
      templateId: template.id,
    });

    if (!deducted) {
      const user = await UserModel.findById(userId);
      return res.status(402).json({
        error: 'Insufficient credits',
        required: template.price,
        available: user?.creditsBalance ?? 0,
      });
    }

    // Pay author
    if (template.authorId !== 'system') {
      await creditsService.addCredits(template.authorId, Math.floor(template.price * 0.7), 'earn', {
        reason: 'template_used',
        templateId: template.id,
        userId,
      });
    }
  }

  // Update template use count
  await TemplateModel.findByIdAndUpdate(template.id, { $inc: { useCount: 1 } });

  // Create new workspace from template
  const workspace = new WorkspaceModel({
    ownerId: userId,
    name: `${template.title} (from template)`,
    description: template.description,
    prompt: `Created from template: ${template.title}`,
    techStack: template.techStack,
    architectureData: template.architectureData,
    collaborators: [],
    visibility: 'private',
    forkCount: 0,
    architectureScore: 75,
  });

  await workspace.save();

  return res.status(201).json({ data: workspace });
});

export default router;
