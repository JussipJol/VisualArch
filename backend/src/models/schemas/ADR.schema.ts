import mongoose, { Schema, Document } from 'mongoose';
import { ADR, ADRStatus } from '../../types';

export interface IADRDocument extends Omit<ADR, 'id'>, Document {}

const ADRSchema = new Schema<IADRDocument>({
  workspaceId: { type: String, required: true, index: true },
  nodeId: { type: String },
  title: { type: String, required: true },
  context: { type: String, required: true },
  decision: { type: String, required: true },
  consequences: { type: String, required: true },
  alternatives: [{ type: String }],
  status: { type: String, enum: ['proposed', 'accepted', 'deprecated'], default: 'proposed' },
  createdBy: { type: String, required: true },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const ADRModel = mongoose.model<IADRDocument>('ADR', ADRSchema);
