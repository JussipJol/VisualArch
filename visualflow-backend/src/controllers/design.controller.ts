import { Response } from 'express';
import { config } from '../config/env';
import { AuthRequest, AIModule } from '../types';
import { Project } from '../models/Project.model';
import { CanvasIteration } from '../models/CanvasIteration.model';
import { parseJSON } from '../services/groq.service';
import { DESIGN_SYSTEM_PROMPT } from '../prompts/design.prompts';
import { buildContext, updateMemory } from '../services/memory.service';
import { aiOrchestrator } from '../services/ai/orchestrator.service';

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
<<<<<<< HEAD
  res.setHeader('Access-Control-Allow-Origin', config.clientUrl);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
=======
>>>>>>> 48106fb (update project)

  res.write(`data: ${JSON.stringify({ type: 'status', message: 'Analyzing architectural blueprint...' })}\n\n`);

  try {
    await Project.findByIdAndUpdate(projectId, { isGenerating: true });

    const context = await buildContext(projectId);
    const canvas = await CanvasIteration.findOne({ projectId }).sort({ version: -1 });
    
    // Create an architectural summary for the designer
    const nodesSummary = canvas?.nodes.map(n => 
      `${n.label} (${n.tech}): ${n.description}. ${n.databaseMetadata ? 'Has complex DB schema.' : ''}`
    ).join('\n') || 'Generic web app';

    const userMessage = `PROJECT: ${project.name}\n\nARCHITECTURE BLUEPRINT:\n${nodesSummary}\n\nCONTEXT:\n${context}\n\nTask: Generate a high-fidelity Design System and Wireframe JSON. Ensure colors and components match the architectural complexity.`;

    res.write(`data: ${JSON.stringify({ type: 'status', message: 'Designing colored Figma-fidelity layout...' })}\n\n`);

    const fullContent = await aiOrchestrator.executeTask(
      AIModule.DESIGNER,
      { system: DESIGN_SYSTEM_PROMPT, user: userMessage },
      { jsonMode: true }
    );

    let designData: object;
    try {
      designData = parseJSON(fullContent) as object;
    } catch (err) {
      console.error('[Design] Parse error:', err);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to parse high-fidelity design' })}\n\n`);
      res.end();
      return;
    }

    // Persist to DB
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
