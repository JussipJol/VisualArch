import { create } from 'zustand';

export type Stage = 'canvas' | 'design' | 'preview' | 'ide';

export interface CanvasNode {
  id: string;
  type: 'service' | 'database' | 'queue' | 'client' | 'api';
  label: string;
  tech: string;
  description: string;
  status: 'stable' | 'new' | 'modified';
  x: number;
  y: number;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type: 'sync' | 'async' | 'bidirectional';
  label: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  currentStage: Stage;
  stack: { frontend: string; backend: string; database: string };
  createdAt: string;
  updatedAt: string;
}

export interface CodeFile {
  path: string;
  language: string;
}

interface WorkspaceState {
  project: Project | null;
  currentStage: Stage;
  canvasNodes: CanvasNode[];
  canvasEdges: CanvasEdge[];
  canvasMode: 'standard' | 'tree' | 'spider';
  design: Record<string, unknown> | null;
  codeFiles: CodeFile[];
  codeId: string | null;
  chatMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isGenerating: boolean;
  generatingStage: string;

  setProject: (p: Project) => void;
  setStage: (s: Stage) => void;
  setCanvas: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  setCanvasMode: (m: 'standard' | 'tree' | 'spider') => void;
  setDesign: (d: Record<string, unknown>) => void;
  setCode: (files: CodeFile[], codeId: string) => void;
  addMessage: (msg: { role: 'user' | 'assistant'; content: string }) => void;
  setGenerating: (v: boolean, stage?: string) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  project: null,
  currentStage: 'canvas',
  canvasNodes: [],
  canvasEdges: [],
  canvasMode: 'standard',
  design: null,
  codeFiles: [],
  codeId: null,
  chatMessages: [],
  isGenerating: false,
  generatingStage: '',

  setProject: (p) => set({ project: p, currentStage: p.currentStage }),
  setStage: (s) => set({ currentStage: s }),
  setCanvas: (nodes, edges) => set({ canvasNodes: nodes, canvasEdges: edges }),
  setCanvasMode: (m) => set({ canvasMode: m }),
  setDesign: (d) => set({ design: d }),
  setCode: (files, codeId) => set({ codeFiles: files, codeId }),
  addMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setGenerating: (v, stage = '') => set({ isGenerating: v, generatingStage: stage }),
  reset: () => set({ project: null, currentStage: 'canvas', canvasNodes: [], canvasEdges: [], design: null, codeFiles: [], chatMessages: [] }),
}));
