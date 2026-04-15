import { Response } from 'express';
import { config } from '../config/env';
import { AuthRequest } from '../types';
import { Project } from '../models/Project.model';
import { CanvasIteration } from '../models/CanvasIteration.model';
import { GeneratedCode } from '../models/GeneratedCode.model';
import { generateProjectCode } from '../services/codeGen.service';
import { createProjectZip } from '../services/zip.service';
import { updateMemory } from '../services/memory.service';

export const generateCode = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: projectId } = req.params;
  const { prompt = '' } = req.body;

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

  const startTime = Date.now();

  try {
    await Project.findByIdAndUpdate(projectId, { isGenerating: true });

    const canvas = await CanvasIteration.findOne({ projectId }).sort({ version: -1 });
    const nodes = canvas?.nodes || [];

    const onProgress = (stage: string, file?: string, chunk?: string) => {
      const messages: Record<string, string> = {
        planning: 'Planning project structure...',
        frontend: `Generating frontend: ${file || ''}`,
        backend: `Generating backend: ${file || ''}`,
        config: 'Creating configuration files...',
        readme: 'Writing documentation...',
      };
      res.write(`data: ${JSON.stringify({ 
        type: 'progress', 
        stage, 
        message: messages[stage] || stage, 
        file,
        chunk 
      })}\n\n`);
    };

    const files = await generateProjectCode(projectId, nodes, prompt || project.name, onProgress);
    const generationTime = Date.now() - startTime;

    // Get existing version
    const lastCode = await GeneratedCode.findOne({ projectId }).sort({ version: -1 });
    const version = (lastCode?.version || 0) + 1;

    const codeDoc = await GeneratedCode.create({
      projectId,
      version,
      files,
      promptUsed: prompt || project.name,
      generationTime,
    });

    await Project.findByIdAndUpdate(projectId, { currentStage: 'ide', isGenerating: false });
    await updateMemory(projectId, { incrementIteration: true });

    res.write(`data: ${JSON.stringify({ 
      type: 'done', 
      codeId: codeDoc._id.toString(), 
      files: files.map(f => ({ path: f.path, language: f.language })),
      version: codeDoc.version, 
      generationTime 
    })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[Code] Error:', err);
    await Project.findByIdAndUpdate(projectId, { isGenerating: false });
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Code generation failed' })}\n\n`);
    res.end();
  }
};

export const getCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const code = await GeneratedCode.findOne({ projectId: req.params.id }).sort({ version: -1 });
    if (!code) {
      res.json({ files: [], version: 0 });
      return;
    }
    res.json({ files: code.files.map(f => ({ path: f.path, language: f.language })), version: code.version, codeId: code._id });
  } catch {
    res.status(500).json({ error: 'Failed to fetch code' });
  }
};

export const getFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { path: filePath } = req.query;
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const code = await GeneratedCode.findOne({ projectId: req.params.id }).sort({ version: -1 });
    const file = code?.files.find(f => f.path === filePath);
    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    res.json({ file });
  } catch {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};

export const downloadZip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const code = await GeneratedCode.findOne({ projectId: req.params.id }).sort({ version: -1 });
    if (!code || code.files.length === 0) {
      res.status(404).json({ error: 'No generated code found' });
      return;
    }
    const zipBuffer = await createProjectZip(code.files);
    const filename = `${project.name.replace(/\s/g, '_')}_v${code.version}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(zipBuffer);
  } catch {
    res.status(500).json({ error: 'ZIP generation failed' });
  }
};

export const getFullCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const code = await GeneratedCode.findOne({ projectId: req.params.id }).sort({ version: -1 });
    if (!code) {
      res.json({ files: [], version: 0 });
      return;
    }
    // Return all files with their contents
    res.json({
      files: code.files,
      version: code.version,
      codeId: code._id
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch full code' });
  }
};
