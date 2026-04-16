import { Response } from 'express';
import { config } from '../config/env';
import { AuthRequest } from '../types';
import { Project } from '../models/Project.model';
import { CanvasIteration } from '../models/CanvasIteration.model';
import { groqComplete, parseJSON } from '../services/groq.service';
import { DESIGN_SYSTEM_PROMPT } from '../prompts/design.prompts';
import { buildContext, updateMemory } from '../services/memory.service';

// Simple in-memory store for design data (in production use a model)
// Removed in-memory designStore to fix the root persistence issue

export const generateDesign = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: projectId } = req.params;

  const project = await Project.findOne({ _id: projectId, userId: req.user!.userId });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  if (project.isGenerating) {
    res.status(409).json({ error: 'Generation already in progress' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', config.clientUrl);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.write(`data: ${JSON.stringify({ type: 'status', message: 'Analyzing architecture...' })}\n\n`);

  try {
    await Project.findByIdAndUpdate(projectId, { isGenerating: true });

    const context = await buildContext(projectId);
    const canvas = await CanvasIteration.findOne({ projectId }).sort({ version: -1 });
    const nodesSummary = canvas?.nodes.map(n => `${n.type}: ${n.label} (${n.tech})`).join(', ') || 'Generic web app';

    const userMessage = `Project: ${project.name}\nArchitecture: ${nodesSummary}\nGenerate wireframe JSON for this project.`;

    res.write(`data: ${JSON.stringify({ type: 'status', message: 'Generating wireframe layout...' })}\n\n`);

    const FALLBACK_WIREFRAME = {
      screens: [
        {
          id: 'screen-1',
          name: 'Dashboard',
          path: '/dashboard',
          elements: [
            { id: 'el-1', type: 'navbar',  x: 0,   y: 0,   width: 1280, height: 60,  label: 'Navigation Bar',  content: 'Logo | Links | Avatar' },
            { id: 'el-2', type: 'sidebar', x: 0,   y: 60,  width: 220,  height: 740, label: 'Sidebar Menu',    content: 'Home\nProjects\nSettings' },
            { id: 'el-3', type: 'card',    x: 240, y: 80,  width: 260,  height: 130, label: 'Stats Card',      content: 'Total Users' },
            { id: 'el-4', type: 'card',    x: 520, y: 80,  width: 260,  height: 130, label: 'Revenue Card',    content: '$12,450' },
            { id: 'el-5', type: 'chart',   x: 240, y: 230, width: 540,  height: 240, label: 'Analytics Chart', content: 'Monthly trend' },
            { id: 'el-6', type: 'table',   x: 240, y: 490, width: 800,  height: 230, label: 'Data Table',      content: 'Name | Status | Date | Actions' },
            { id: 'el-7', type: 'footer',  x: 0,   y: 720, width: 1280, height: 80,  label: 'Footer',          content: '© 2025' },
          ],
        },
      ],
    };

    let designData: object;
    try {
      const fullContent = await groqComplete(DESIGN_SYSTEM_PROMPT, userMessage, 'llama-3.1-8b-instant', true);
      designData = parseJSON(fullContent) as object;
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        console.warn('[Design] Rate limit hit — using fallback wireframe');
        res.write(`data: ${JSON.stringify({ type: 'status', message: 'AI limit reached — loading default wireframe...' })}\n\n`);
      } else {
        console.error('[Design] Generation/parse error:', err);
      }
      designData = FALLBACK_WIREFRAME;
    }

    // Persist to DB instead of memory
    await Project.findByIdAndUpdate(projectId, { 
      currentStage: 'design', 
      isGenerating: false,
      designSystem: designData 
    });
    await updateMemory(projectId, { incrementIteration: true });

    res.write(`data: ${JSON.stringify({ type: 'done', design: designData })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[Design] Fatal Error:', err);
    await Project.findByIdAndUpdate(projectId, { isGenerating: false });
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Design generation failed' })}\n\n`);
    res.end();
  }
};

export const getDesign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    // Pull from DB
    res.json({ design: project.designSystem || null });
  } catch {
    res.status(500).json({ error: 'Failed to fetch design' });
  }
};
