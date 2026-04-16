import mongoose, { Schema } from 'mongoose';
import { IProjectMemory } from '../types';

const ProjectMemorySchema = new Schema<IProjectMemory>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
  summary: { type: String, default: '' },
  decisions: [{
    topic: String,
    decision: String,
    reasoning: String,
    timestamp: { type: Date, default: Date.now },
  }],
  patterns: [{
    name: String,
    description: String,
    frequency: { type: Number, default: 1 },
  }],
  stack: {
    frontend: { type: String, default: '' },
    backend: { type: String, default: '' },
    database: { type: String, default: '' },
    detected: [String],
  },
  iterationCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export const ProjectMemory = mongoose.model<IProjectMemory>('ProjectMemory', ProjectMemorySchema);
