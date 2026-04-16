import { ProjectMemory } from '../models/ProjectMemory.model';
import { CanvasIteration } from '../models/CanvasIteration.model';
import { Types } from 'mongoose';

export const getOrCreateMemory = async (projectId: string) => {
  let memory = await ProjectMemory.findOne({ projectId: new Types.ObjectId(projectId) });
  if (!memory) {
    memory = await ProjectMemory.create({ projectId: new Types.ObjectId(projectId) });
  }
  return memory;
};

export const buildContext = async (projectId: string): Promise<string> => {
  const memory = await getOrCreateMemory(projectId);
  const recentIterations = await CanvasIteration.find({ projectId })
    .sort({ version: -1 })
    .limit(5)
    .lean();

  const lastIteration = recentIterations[0];
  const entities = lastIteration?.nodes
    .filter(n => n.type === 'database' || n.label.toLowerCase().includes('service'))
    .map(n => n.label)
    .join(', ') || 'None defined yet';

  return `Project Context:
Stack: ${memory.stack.frontend || 'React'} + ${memory.stack.backend || 'Node.js'} + ${memory.stack.database || 'MongoDB'}
Entities: ${entities}
Decisions: ${memory.decisions.slice(-3).map(d => `${d.topic}: ${d.decision}`).join('; ') || 'None'}
Patterns: ${memory.patterns.slice(-3).map(p => p.name).join(', ') || 'None'}
Iterations: ${memory.iterationCount}
Summary: ${memory.summary || 'New project'}`;
};

export const updateMemory = async (
  projectId: string,
  update: {
    stack?: { frontend?: string; backend?: string; database?: string; detected?: string[] };
    decision?: { topic: string; decision: string; reasoning: string };
    incrementIteration?: boolean;
  }
) => {
  const memory = await getOrCreateMemory(projectId);

  if (update.stack) {
    if (update.stack.frontend) memory.stack.frontend = update.stack.frontend;
    if (update.stack.backend) memory.stack.backend = update.stack.backend;
    if (update.stack.database) memory.stack.database = update.stack.database;
    if (update.stack.detected) memory.stack.detected.push(...update.stack.detected);
  }

  if (update.decision) {
    memory.decisions.push({ ...update.decision, timestamp: new Date() });
    if (memory.decisions.length > 20) {
      memory.decisions = memory.decisions.slice(-20);
    }
  }

  if (update.incrementIteration) {
    memory.iterationCount += 1;
  }

  memory.lastUpdated = new Date();
  await memory.save();
  return memory;
};
