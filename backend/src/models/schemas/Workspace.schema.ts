import mongoose, { Schema, Document } from 'mongoose';
import { Workspace, ArchitectureData, WorkspaceCollaborator } from '../../types';

export interface IWorkspaceDocument extends Omit<Workspace, 'id'>, Document {}

const CollaboratorSchema = new Schema<WorkspaceCollaborator>({
  userId: { type: String, required: true },
  role: { type: String, enum: ['owner', 'editor', 'viewer'], required: true },
  invitedBy: { type: String, required: true },
  acceptedAt: { type: Date },
}, { _id: false });

const WorkspaceSchema = new Schema<IWorkspaceDocument>({
  ownerId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  prompt: { type: String, default: '' },
  techStack: [{ type: String }],
  architectureData: {
    nodes: [Schema.Types.Mixed],
    edges: [Schema.Types.Mixed],
    techStack: [{ type: String }],
    layoutDirection: { type: String, enum: ['TB', 'LR'], default: 'TB' },
  },
  collaborators: [CollaboratorSchema],
  visibility: { type: String, enum: ['private', 'team', 'public'], default: 'private' },
  forkCount: { type: Number, default: 0 },
  architectureScore: { type: Number, default: 0 },
  lastCriticRun: { type: Date },
  archspecYaml: { type: String },
  designState: { type: Schema.Types.Mixed },
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

// Indices for common queries
WorkspaceSchema.index({ ownerId: 1, createdAt: -1 });
WorkspaceSchema.index({ visibility: 1 });
WorkspaceSchema.index({ 'collaborators.userId': 1 });

export const WorkspaceModel = mongoose.model<IWorkspaceDocument>('Workspace', WorkspaceSchema);
