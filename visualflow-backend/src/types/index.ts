import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
<<<<<<< HEAD
  passwordHash: string;
  name: string;
=======
  passwordHash?: string;
  name: string;
  githubId?: string;
  discordId?: string;
  googleId?: string;
>>>>>>> 48106fb (update project)
  plan: 'free' | 'pro';
  createdAt: Date;
}

export interface IProject extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  currentStage: 'canvas' | 'design' | 'preview' | 'ide';
  stack: {
    frontend: string;
    backend: string;
    database: string;
  };
<<<<<<< HEAD
=======
  collaborators: Array<{
    userId: Types.ObjectId;
    role: 'editor' | 'viewer';
  }>;
  isGenerating: boolean;
  designSystem: any;
>>>>>>> 48106fb (update project)
  createdAt: Date;
  updatedAt: Date;
}

export { AIModule } from '../services/ai/ai.types';

export interface ICanvasNode {
  id: string;
  type: 'service' | 'database' | 'queue' | 'client' | 'api'
      | 'cdn' | 'gateway' | 'auth' | 'worker' | 'cache'
      | 'storage' | 'monitoring' | 'external';
  label: string;
  tech: string;
  description: string;
  responsibilities?: string[];
  endpoints?: string[];
  databaseMetadata?: {
    engine: 'mongodb' | 'postgresql' | 'redis';
    collections?: Array<{
      name: string;
      fields: Array<{ name: string; type: string; required: boolean; relation?: string }>;
    }>;
  };
  status: 'stable' | 'new' | 'modified';
  x: number;
  y: number;
}

// ... rest of the file ...
export interface DesignSystem {
  screens: Array<{ 
    id: string;
    name: string; 
    description: string; 
    path: string;
    elements: Array<any>;
  }>;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    background: string;
    text: string;
    borderRadius: number;
    fontFamily: string;
  };
}

export interface ICanvasEdge {
  id: string;
  source: string;
  target: string;
  type: 'sync' | 'async' | 'bidirectional';
  label: string;
  dataFlow?: string;
}

export interface ICanvasIteration extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  prompt: string;
  nodes: ICanvasNode[];
  edges: ICanvasEdge[];
  mode: 'standard' | 'tree' | 'spider';
  version: number;
  createdAt: Date;
}

export interface IProjectMemory extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  summary: string;
  decisions: Array<{
    topic: string;
    decision: string;
    reasoning: string;
    timestamp: Date;
  }>;
  patterns: Array<{
    name: string;
    description: string;
    frequency: number;
  }>;
  stack: {
    frontend: string;
    backend: string;
    database: string;
    detected: string[];
  };
  iterationCount: number;
  lastUpdated: Date;
}

export interface IGeneratedCode extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  version: number;
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  promptUsed: string;
  generationTime: number;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

<<<<<<< HEAD
export interface DesignSystem {
  screens: Array<{ name: string; description: string; path: string }>;
  components: Array<{
    name: string;
    description: string;
    variants: string[];
    code: string;
  }>;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  typography: {
    fontFamily: string;
    scale: Record<string, string>;
  };
  spacing: Record<string, string>;
}
=======

>>>>>>> 48106fb (update project)

export interface DBSchema {
  entities: Array<{
    name: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      unique?: boolean;
    }>;
  }>;
  sqlSchema: string;
  mongooseSchemas: Record<string, string>;
}
