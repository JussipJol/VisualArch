import mongoose, { Schema, Document } from 'mongoose';
import { ArchitectureHistory } from '../../types';

export interface HistoryDocument extends Omit<ArchitectureHistory, 'id'>, Document {}

const HistorySchema: Schema = new Schema({
  workspaceId: { type: String, required: true, index: true },
  iteration: { type: Number, required: true },
  prompt: { type: String, required: true },
  architectureData: { type: Object, required: true },
  criticFeedback: { type: Object },
  architectureScore: { type: Number, required: true },
  creditsSpent: { type: Number, required: true },
  modelUsed: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Virtual for ID
HistorySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

HistorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const HistoryModel = mongoose.model<HistoryDocument>('History', HistorySchema);
