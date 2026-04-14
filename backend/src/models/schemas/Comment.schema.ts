import mongoose, { Schema, Document } from 'mongoose';
import { Comment } from '../../types';

export interface CommentDocument extends Omit<Comment, 'id'>, Document {}

const CommentSchema: Schema = new Schema({
  workspaceId: { type: String, required: true, index: true },
  nodeId: { type: String },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  text: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  threadId: { type: String },
}, {
  timestamps: { createdAt: true, updatedAt: true },
});

// Virtual for ID
CommentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CommentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const CommentModel = mongoose.model<CommentDocument>('Comment', CommentSchema);
