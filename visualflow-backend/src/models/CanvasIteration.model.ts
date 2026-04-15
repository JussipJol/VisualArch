import mongoose, { Schema } from 'mongoose';
import { ICanvasIteration } from '../types';

const NodeSchema = new Schema({
  id: String,
  type: {
    type: String,
    enum: ['service', 'database', 'queue', 'client', 'api',
           'cdn', 'gateway', 'auth', 'worker', 'cache',
           'storage', 'monitoring', 'external'],
  },
  label: String,
  tech: String,
  description: String,
  responsibilities: [String],
  endpoints: [String],
  dependencies: [String],
  scale: { type: String, enum: ['horizontal', 'vertical', 'fixed'], default: 'horizontal' },
  replicas: { type: Number, default: 1 },
  status: { type: String, enum: ['stable', 'new', 'modified'], default: 'new' },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
}, { _id: false });

const EdgeSchema = new Schema({
  id: String,
  source: String,
  target: String,
  type: { type: String, enum: ['sync', 'async', 'bidirectional'], default: 'sync' },
  label: { type: String, default: '' },
  dataFlow: { type: String, default: '' },
}, { _id: false });

const CanvasIterationSchema = new Schema<ICanvasIteration>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  prompt: { type: String, required: true },
  nodes: [NodeSchema],
  edges: [EdgeSchema],
  mode: { type: String, enum: ['standard', 'tree', 'spider'], default: 'standard' },
  version: { type: Number, default: 1 },
}, { timestamps: true });

CanvasIterationSchema.index({ projectId: 1, version: -1 });

export const CanvasIteration = mongoose.model<ICanvasIteration>('CanvasIteration', CanvasIterationSchema);
