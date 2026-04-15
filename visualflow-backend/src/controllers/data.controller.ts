import { Response } from 'express';
import { AuthRequest } from '../types';
import { Project } from '../models/Project.model';
import { CanvasIteration } from '../models/CanvasIteration.model';
import { groqComplete, parseJSON } from '../services/groq.service';
import { generateData, generateSQLSchema } from '../services/mockaroo.service';
import { updateMemory } from '../services/memory.service';

const dataStore = new Map<string, { schema: object; data: Record<string, unknown[]>; sqlSchema: string }>();

export const generateDataset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: projectId } = req.params;
    const { count = 100 } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const canvas = await CanvasIteration.findOne({ projectId }).sort({ version: -1 });
    const nodesSummary = canvas?.nodes.map(n => `${n.type}: ${n.label}`).join(', ') || 'User, Product';

    // Ask Groq to generate DB schema
    const schemaRaw = await groqComplete(
      `You are a database architect. Generate a JSON database schema for the given entities.
Return ONLY valid JSON:
{
  "entities": [
    {
      "name": "User",
      "fields": [
        { "name": "id", "type": "uuid", "required": true, "unique": true },
        { "name": "email", "type": "email", "required": true, "unique": true },
        { "name": "name", "type": "name", "required": true }
      ]
    }
  ]
}
Field types: uuid, string, email, number, boolean, date, name, phone, url, text`,
      `Architecture nodes: ${nodesSummary}\nProject: ${project.name}\n\nGenerate appropriate DB entities with realistic fields.`,
      'llama-3.3-70b-versatile'
    );

    let schema: { entities: Array<{ name: string; fields: Array<{ name: string; type: string; required: boolean; unique?: boolean }> }> };
    try {
      schema = parseJSON(schemaRaw) as typeof schema;
    } catch {
      schema = {
        entities: [
          { name: 'User', fields: [{ name: 'id', type: 'uuid', required: true, unique: true }, { name: 'email', type: 'email', required: true }, { name: 'name', type: 'name', required: true }, { name: 'createdAt', type: 'date', required: true }] },
          { name: 'Project', fields: [{ name: 'id', type: 'uuid', required: true, unique: true }, { name: 'name', type: 'string', required: true }, { name: 'description', type: 'text', required: false }, { name: 'createdAt', type: 'date', required: true }] },
        ],
      };
    }

    const data = generateData(schema.entities, Math.min(count, 200));
    const sqlSchema = generateSQLSchema(schema.entities);

    dataStore.set(projectId, { schema, data, sqlSchema });
    await Project.findByIdAndUpdate(projectId, { currentStage: 'data' });
    await updateMemory(projectId, { incrementIteration: true });

    res.json({ schema, sqlSchema, preview: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.slice(0, 5)])), totalRecords: count });
  } catch (err) {
    console.error('[Data] Error:', err);
    res.status(500).json({ error: 'Data generation failed' });
  }
};

export const getData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const stored = dataStore.get(req.params.id);
    res.json({ schema: stored?.schema || null, sqlSchema: stored?.sqlSchema || null, preview: stored ? Object.fromEntries(Object.entries(stored.data).map(([k, v]) => [k, v.slice(0, 10)])) : null });
  } catch {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export const downloadData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user!.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const stored = dataStore.get(req.params.id);
    if (!stored) {
      res.status(404).json({ error: 'No data generated yet' });
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/\s/g, '_')}_data.json"`);
    res.json(stored.data);
  } catch {
    res.status(500).json({ error: 'Download failed' });
  }
};
