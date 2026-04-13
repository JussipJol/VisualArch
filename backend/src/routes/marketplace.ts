import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../models/store';
import { authenticateJWT } from '../middleware/auth';
import { creditsService } from '../services/credits.service';
import { p } from '../utils/params';
import { Template, Workspace } from '../types';

const router = Router();

// GET /api/templates
router.get('/', (req: Request, res: Response) => {
  const { category, techStack, premium, q } = req.query;

  let templates = store.getAllTemplates();

  if (category) {
    templates = templates.filter(t => t.category.toLowerCase() === String(category).toLowerCase());
  }

  if (techStack) {
    const stacks = String(techStack).split(',');
    templates = templates.filter(t => stacks.some(s => t.techStack.includes(s)));
  }

  if (premium !== undefined) {
    templates = templates.filter(t => t.isPremium === (premium === 'true'));
  }

  if (q) {
    const query = String(q).toLowerCase();
    templates = templates.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    );
  }

  // Sort by use count
  templates.sort((a, b) => b.useCount - a.useCount);

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
router.get('/:id', (req: Request, res: Response) => {
  const template = store.findTemplateById(p(req.params.id));
  if (!template) return res.status(404).json({ error: 'Template not found' });

  return res.json({ data: template });
});

// POST /api/templates - publish workspace as template
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = store.findUserById(userId);
  const { workspaceId, title, description, category, isPremium, price } = req.body;

  const workspace = store.findWorkspaceById(workspaceId);
  if (!workspace || workspace.ownerId !== userId) {
    return res.status(403).json({ error: 'Workspace not found or access denied' });
  }

  const template: Template = {
    id: uuidv4(),
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
    createdAt: new Date(),
  };

  store.saveTemplate(template);

  // Make workspace public
  workspace.visibility = 'public';
  store.saveWorkspace(workspace);

  return res.status(201).json({ data: template });
});

// POST /api/templates/:id/use - create workspace from template
router.post('/:id/use', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const template = store.findTemplateById(p(req.params.id));

  if (!template) return res.status(404).json({ error: 'Template not found' });

  if (template.isPremium) {
    const deducted = creditsService.deductCredits(userId, template.price, {
      action: 'use_premium_template',
      templateId: template.id,
    });

    if (!deducted) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: template.price,
        available: store.findUserById(userId)?.creditsBalance ?? 0,
      });
    }

    // Pay author
    if (template.authorId !== 'system') {
      creditsService.addCredits(template.authorId, Math.floor(template.price * 0.7), 'earn', {
        reason: 'template_used',
        templateId: template.id,
        userId,
      });
    }
  }

  // Update template use count
  template.useCount += 1;
  store.saveTemplate(template);

  // Create new workspace from template
  const workspace: Workspace = {
    id: uuidv4(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  store.saveWorkspace(workspace);

  return res.status(201).json({ data: workspace });
});

export default router;
