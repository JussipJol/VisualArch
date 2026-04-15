import mongoose, { Schema } from 'mongoose';
import { IProject } from '../types';

const ProjectSchema = new Schema<IProject>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  currentStage: {
    type: String,
    enum: ['canvas', 'design', 'preview', 'ide'],
    default: 'canvas'
  },
  stack: {
    frontend: { type: String, default: '' },
    backend: { type: String, default: '' },
    database: { type: String, default: '' },
  },
  collaborators: {
    type: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['editor', 'viewer'], default: 'editor' },
    }],
    default: [],
  },
  isGenerating: { type: Boolean, default: false },
  designSystem: { type: Object, default: null },
}, { timestamps: true });

ProjectSchema.index({ userId: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
