import mongoose, { Schema, Document } from 'mongoose';
import { Template } from '../../types';

export interface ITemplateDocument extends Omit<Template, 'id'>, Document {}

const TemplateSchema = new Schema<ITemplateDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  techStack: [{ type: String }],
  architectureData: {
    nodes: [Schema.Types.Mixed],
    edges: [Schema.Types.Mixed],
    techStack: [{ type: String }],
    layoutDirection: { type: String, default: 'TB' },
  },
  authorId: { type: String, required: true, index: true },
  authorName: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  useCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true, index: true },
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

TemplateSchema.index({ title: 'text', description: 'text' });

export const TemplateModel = mongoose.model<ITemplateDocument>('Template', TemplateSchema);
