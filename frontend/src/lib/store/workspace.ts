import { create } from 'zustand';
import { api } from '@/lib/api';

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface ArchNode {
  id: string;
  label: string;
  layer: string;
  description: string;
  status: 'stable' | 'modified' | 'new';
  position: { x: number; y: number };
  files?: CodeFile[];
  testFiles?: CodeFile[];
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ArchitectureData {
  nodes: ArchNode[];
  edges: ArchEdge[];
  techStack: string[];
  layoutDirection: 'TB' | 'LR';
}

export interface CriticIssue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  nodeId?: string;
  suggestion: string;
}

export interface CriticFeedback {
  score: number;
  issues: CriticIssue[];
  timestamp: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  techStack: string[];
  architectureData: ArchitectureData;
  architectureScore: number;
  visibility: 'private' | 'team' | 'public';
  collaborators: number;
  nodeCount: number;
  designState?: any;
  updatedAt: string;
  createdAt: string;
}

export type GenerationStage = 'idle' | 'memory' | 'planning' | 'coding' | 'critique' | 'complete' | 'error';

export interface GenerationProgress {
  stage: GenerationStage;
  currentNode?: string;
  totalNodes?: number;
  completedNodes?: number;
  score?: number;
  issues?: number;
  message?: string;
  critiqued?: boolean;
  criticIssues?: CriticIssue[];
}

export interface GenerationResult {
  architectureData: ArchitectureData;
  criticFeedback: CriticFeedback | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  selectedNode: ArchNode | null;
  generating: boolean;
  generationProgress: GenerationProgress;
  loading: boolean;
  error: string | null;
  pendingCodeChanges: Record<string, string>;

  fetchWorkspaces: () => Promise<void>;
  fetchWorkspace: (id: string) => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  generateArchitecture: (
    workspaceId: string,
    prompt: string,
    onProgress?: (p: GenerationProgress) => void
  ) => Promise<GenerationResult | null>;
  setSelectedNode: (node: ArchNode | null) => void;
  updatePendingFile: (path: string, content: string) => void;
  saveDesignState: (workspaceId: string, designState: any) => Promise<void>;
  resetDesignState: (workspaceId: string) => Promise<void>;
  finalizeDesign: (workspaceId: string, designState: any) => Promise<void>;
  syncCodeToArchitecture: (workspaceId: string) => Promise<void>;
  clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  selectedNode: null,
  generating: false,
  generationProgress: { stage: 'idle' },
  loading: false,
  error: null,
  pendingCodeChanges: {},

  fetchWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<{ data: Workspace[] }>('/api/workspaces');
      set({ workspaces: res.data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load workspaces', loading: false });
    }
  },

  fetchWorkspace: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get<{ data: Workspace }>(`/api/workspaces/${id}`);
      set({ currentWorkspace: res.data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load workspace', loading: false });
    }
  },

  createWorkspace: async (name, description) => {
    const res = await api.post<{ data: Workspace }>('/api/workspaces', { name, description });
    set(state => ({ workspaces: [res.data, ...state.workspaces] }));
    return res.data;
  },

  deleteWorkspace: async (id) => {
    await api.delete(`/api/workspaces/${id}`);
    set(state => ({ workspaces: state.workspaces.filter(w => w.id !== id) }));
  },

  generateArchitecture: async (workspaceId, prompt, onProgress) => {
    set({ generating: true, generationProgress: { stage: 'memory', message: 'Retrieving project memory...' } });

    let architectureData: ArchitectureData | null = null;
    let criticFeedback: CriticFeedback | null     = null;

    try {
      for await (const { event, data } of api.stream(`/api/workspaces/${workspaceId}/generate/stream`, { prompt })) {
        switch (event) {
          case 'memory_retrieved':
            set({ generationProgress: { stage: 'memory', message: `Found ${(data as any).count} relevant past decisions` } });
            break;

          case 'planning_start':
            set({ generationProgress: { stage: 'planning', message: 'AI is architecting the system...' } });
            break;

          case 'planning_done':
            set({ generationProgress: {
              stage: 'coding',
              message: `Plan ready — ${(data as any).node_count} components`,
              totalNodes: (data as any).node_count,
            }});
            break;

          case 'coding_node':
            set({ generationProgress: {
              stage: 'coding',
              currentNode: (data as any).label,
              completedNodes: (data as any).index,
              totalNodes: (data as any).total,
              message: `Generating ${(data as any).label}...`,
            }});
            break;

          case 'critique_start':
            set({ generationProgress: { stage: 'critique', message: 'Architecture Critic reviewing...' } });
            break;

          case 'critique_done':
            set({ generationProgress: {
              stage: 'critique',
              score: (data as any).score,
              issues: (data as any).issues_count,
              critiqued: true,
            }});
            break;

          case 'complete': {
            architectureData = (data as any).architecture_data as ArchitectureData;
            criticFeedback   = (data as any).critic_feedback as CriticFeedback ?? null;

            set(state => ({
              generating: false,
              generationProgress: { stage: 'complete' },
              currentWorkspace: state.currentWorkspace
                ? {
                    ...state.currentWorkspace,
                    architectureData: architectureData!,
                    architectureScore: criticFeedback?.score ?? state.currentWorkspace.architectureScore,
                  }
                : null,
            }));
            break;
          }

          case 'ai_fallback':
            set({ generationProgress: { stage: 'planning', message: 'Using optimised mock engine...' } });
            break;

          case 'error':
            set({
              generating: false,
              generationProgress: { stage: 'error', message: (data as any).message ?? 'Generation failed' },
            });
            break;
        }

        onProgress?.(get().generationProgress);
      }

      return architectureData ? { architectureData, criticFeedback } : null;
    } catch (err) {
      set({
        generating: false,
        generationProgress: { stage: 'error', message: err instanceof Error ? err.message : 'Generation failed' },
      });
      return null;
    }
  },

  saveDesignState: async (workspaceId, designState) => {
    try {
      await api.patch(`/api/workspaces/${workspaceId}/design`, { designState });
      set(state => ({
        currentWorkspace: state.currentWorkspace
          ? { ...state.currentWorkspace, designState }
          : null,
      }));
    } catch (err) {
      console.error('[WorkspaceStore] Failed to save design state:', err);
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        // Handle specifically if desired, but api.ts already clears token
      }
    }
  },

  resetDesignState: async (workspaceId) => {
    set({ loading: true });
    try {
      await api.patch(`/api/workspaces/${workspaceId}/design`, { designState: null });
      set(state => ({
        currentWorkspace: state.currentWorkspace
          ? { ...state.currentWorkspace, designState: null }
          : null,
        loading: false
      }));
    } catch (err) {
      console.error('[WorkspaceStore] Reset failed:', err);
      set({ loading: false });
      throw err;
    }
  },

  finalizeDesign: async (workspaceId, designState) => {
    set({ generating: true, generationProgress: { stage: 'planning', message: 'Analyzing modifications...' } });
    try {
      const res = await api.post<{ data: ArchitectureData }>(`/api/workspaces/${workspaceId}/design/submit`, { designState });
      set(state => ({
        currentWorkspace: state.currentWorkspace
          ? { ...state.currentWorkspace, architectureData: res.data, designState }
          : null,
        generating: false,
        generationProgress: { stage: 'complete', message: 'Full system refactored successfully!' }
      }));
    } catch (err) {
      set({ 
        generating: false, 
        generationProgress: { stage: 'error', message: err instanceof Error ? err.message : 'Finalization failed' } 
      });
    }
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  updatePendingFile: (path, content) => set(state => ({
    pendingCodeChanges: { ...state.pendingCodeChanges, [path]: content },
  })),

  syncCodeToArchitecture: async (workspaceId) => {
    const { pendingCodeChanges, currentWorkspace } = get();
    if (!currentWorkspace || Object.keys(pendingCodeChanges).length === 0) return;

    set({ generating: true, generationProgress: { stage: 'planning', message: 'Reconciling code with architecture...' } });

    try {
      const res = await api.post<{ data: ArchitectureData }>(`/api/workspaces/${workspaceId}/sync`, {
        modifiedFiles: Object.entries(pendingCodeChanges).map(([path, content]) => ({ path, content })),
      });

      set(state => ({
        currentWorkspace: state.currentWorkspace
          ? { ...state.currentWorkspace, architectureData: res.data }
          : null,
        pendingCodeChanges: {},
        generating: false,
        generationProgress: { stage: 'complete', message: 'Architecture synchronized!' },
      }));
    } catch (err) {
      set({
        generating: false,
        generationProgress: { stage: 'error', message: err instanceof Error ? err.message : 'Sync failed' },
      });
    }
  },

  clearError: () => set({ error: null }),
}));
