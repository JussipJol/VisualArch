// ─── Module: Canvas Controller ────────────────────────────────────────────────

import { Response } from 'express';
import { config } from '../../config/env';
import { AuthRequest, ICanvasNode, ICanvasEdge, AIModule } from '../../types';
import { CanvasIteration } from '../../models/CanvasIteration.model';
import { Project } from '../../models/Project.model';
import { parseJSON } from '../../services/groq.service';
import { CANVAS_SYSTEM_PROMPT, CANVAS_UPDATE_PROMPT, autoLayout } from './canvas.prompts';
import { buildContext, updateMemory } from '../../services/memory.service';
import { aiOrchestrator } from '../../services/ai/orchestrator.service';

export const generateCanvas = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: projectId } = req.params;
  const { prompt, mode = 'standard' } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const project = await Project.findOne({ _id: projectId, userId: req.user!.userId });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // SSE setup
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify({ type: 'status', message: 'Initializing AI architect...' })}\n\n`);

  try {
    const context = await buildContext(projectId);
    const lastIteration = await CanvasIteration.findOne({ projectId }).sort({ version: -1 });

    let userMessage = prompt;
    if (lastIteration) {
      const currentStr = JSON.stringify({ nodes: lastIteration.nodes, edges: lastIteration.edges });
      userMessage = CANVAS_UPDATE_PROMPT(currentStr, prompt);
    }

    res.write(`data: ${JSON.stringify({ type: 'status', message: 'Architecting system blueprint...' })}\n\n`);

    const fullContent = await aiOrchestrator.executeTask(
      AIModule.BLUEPRINT,
      { system: CANVAS_SYSTEM_PROMPT + `\n\nProject context:\n${context}`, user: userMessage },
      { jsonMode: true }
    );

    // Parse AI response
    let canvasData: {
      nodes: ICanvasNode[];
      edges: ICanvasEdge[];
      stack?: { frontend: string; backend: string; database: string; infrastructure?: string };
      architecture_notes?: string;
      decisions?: Array<{ topic: string; decision: string; reasoning: string }>;
    };

    try {
      canvasData = parseJSON(fullContent) as typeof canvasData;
    } catch {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to parse AI Blueprint' })}\n\n`);
      res.end();
      return;
    }

    // Apply professional layout based on mode
    canvasData.nodes = autoLayout(canvasData.nodes, mode as any);

    // Sanitize edges to prevent duplicate React keys
    const seenEdgeIds = new Set<string>();
    canvasData.edges = (canvasData.edges || []).map((edge, idx) => {
      let uniqueId = edge.id || `edge_${idx}`;
      if (seenEdgeIds.has(uniqueId)) {
        uniqueId = `${uniqueId}_v${idx}`;
      }
      seenEdgeIds.add(uniqueId);
      return { ...edge, id: uniqueId };
    });

    // Save iteration
    const version = (lastIteration?.version || 0) + 1;
    const iteration = await CanvasIteration.create({
      projectId,
      prompt,
      nodes: canvasData.nodes,
      edges: canvasData.edges || [],
      mode,
      version,
    });

    // Update project memory
    await updateMemory(projectId, {
      stack: canvasData.stack,
      decision: canvasData.decisions?.[0],
      incrementIteration: true,
    });

    await Project.findByIdAndUpdate(projectId, { currentStage: 'canvas' });

    res.write(`data: ${JSON.stringify({
      type: 'done',
      iteration: { ...iteration.toObject(), _id: iteration._id.toString() },
    })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[Canvas] Generation error:', err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Generation failed' })}\n\n`);
    res.end();
  }
};

export const saveCanvas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nodes, edges, mode } = req.body;
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const lastIteration = await CanvasIteration.findOne({ projectId: req.params.id }).sort({ version: -1 });
    const version = (lastIteration?.version || 0) + 1;
    const iteration = await CanvasIteration.create({
      projectId: req.params.id,
      prompt: 'Manual edit',
      nodes,
      edges: edges || [],
      mode: mode || 'standard',
      version,
    });
    res.json({ iteration });
  } catch {
    res.status(500).json({ error: 'Failed to save canvas' });
  }
};

export const getCanvas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const iteration = await CanvasIteration.findOne({ projectId: req.params.id }).sort({ version: -1 });
    res.json({ iteration: iteration || null });
  } catch {
    res.status(500).json({ error: 'Failed to fetch canvas' });
  }
};

export const getCanvasHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const iterations = await CanvasIteration.find({ projectId: req.params.id })
      .sort({ version: -1 })
      .limit(20)
      .select('-nodes -edges');
    res.json({ iterations });
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
