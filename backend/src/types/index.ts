// ============================================================
// VisualArch AI - Core Types v3.0
// ============================================================

export type PlanType = 'free' | 'pro' | 'team' | 'enterprise';
export type WorkspaceRole = 'owner' | 'editor' | 'viewer';
export type NodeStatus = 'stable' | 'modified' | 'new';
export type ADRStatus = 'proposed' | 'accepted' | 'deprecated';
export type TransactionType = 'purchase' | 'earn' | 'spend';
export type NotificationType = 'collab_invite' | 'comment_added' | 'generation_done' | 'adr_created';
export type Severity = 'critical' | 'warning' | 'info';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: PlanType;
  creditsBalance: number;
  creditsResetDate: Date;
  refreshTokenHash?: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceCollaborator {
  userId: string;
  role: WorkspaceRole;
  invitedBy: string;
  acceptedAt?: Date;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  layer: string;
  description: string;
  status: NodeStatus;
  position: { x: number; y: number };
  files?: CodeFile[];
  testFiles?: CodeFile[];
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface ArchitectureData {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  techStack: string[];
  layoutDirection: 'TB' | 'LR';
}

export interface CriticIssue {
  severity: Severity;
  title: string;
  description: string;
  nodeId?: string;
  suggestion: string;
}

export interface CriticFeedback {
  score: number;
  issues: CriticIssue[];
  timestamp: Date;
}

export interface PuckBlock {
  type: string;
  props: {
    title?: string;
    text?: string;
    description?: string;
    label?: string;
    variant?: string;
    content?: string;
    level?: number;
    logo?: string;
    features?: { label?: string }[];
    tiers?: { plan?: string }[];
    links?: { label?: string }[];
    [key: string]: unknown;
  };
}

export interface PuckDesignData {
  content: PuckBlock[];
  root?: { props: Record<string, unknown> };
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  prompt: string;
  techStack: string[];
  architectureData: ArchitectureData;
  collaborators: WorkspaceCollaborator[];
  visibility: 'private' | 'team' | 'public';
  forkCount: number;
  architectureScore: number;
  lastCriticRun?: Date;
  archspecYaml?: string;
  designData?: PuckDesignData;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchitectureHistory {
  id: string;
  workspaceId: string;
  iteration: number;
  prompt: string;
  architectureData: ArchitectureData;
  criticFeedback?: CriticFeedback;
  architectureScore: number;
  creditsSpent: number;
  modelUsed: string;
  createdAt: Date;
}

export interface ADR {
  id: string;
  workspaceId: string;
  nodeId?: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  alternatives: string[];
  status: ADRStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  architectureData: ArchitectureData;
  authorId: string;
  authorName: string;
  isPremium: boolean;
  price: number;
  useCount: number;
  rating: number;
  isPublic: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  meta: Record<string, unknown>;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  workspaceId: string;
  nodeId?: string;
  authorId: string;
  authorName: string;
  text: string;
  resolved: boolean;
  threadId?: string;
  createdAt: Date;
}

export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

// Auth request types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GenerateRequest {
  prompt: string;
  designCanvasData?: Record<string, unknown>;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  plan: PlanType;
}

// Express augmentation
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      workspace?: Workspace;
    }
  }
}
