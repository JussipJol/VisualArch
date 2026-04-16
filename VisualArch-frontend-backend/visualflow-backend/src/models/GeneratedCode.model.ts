import mongoose, { Schema } from 'mongoose';
import { IGeneratedCode } from '../types';

const GeneratedCodeSchema = new Schema<IGeneratedCode>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  version: { type: Number, default: 1 },
  files: [{
    path: String,
    content: String,
    language: String,
  }],
  promptUsed: { type: String, default: '' },
  generationTime: { type: Number, default: 0 },
}, { timestamps: true });

GeneratedCodeSchema.index({ projectId: 1, version: -1 });

export const GeneratedCode = mongoose.model<IGeneratedCode>('GeneratedCode', GeneratedCodeSchema);
