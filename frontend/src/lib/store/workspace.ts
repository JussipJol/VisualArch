import { create } from 'zustand';
import { api } from '@/lib/api';

export interface ArchNode {
  id: string;
  label: string;
  layer: string;
  description: string;
  status: 'stable' | 'modified' | 'new';
  position: { x: number; y: number };
  files?: { name: string; path: string; content: string; language: string }[];
  testFiles?: { name: string; path: string; content: string; language: string }[];
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
  updatedAt: string;
  createdAt: string;
}

export type GenerationStage = 'idle' | 'memory' | 'planning' | 'coding' | 'critique' | 'complete' | 'error';

interface GenerationProgress {
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

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  selectedNode: ArchNode | null;
  generating: boolean;
  generationProgress: GenerationProgress;
  loading: boolean;
  error: string | null;
  pendingCodeChanges: Record<string, string>; // path -> content

  fetchWorkspaces: () => Promise<void>;
  fetchWorkspace: (id: string) => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  generateArchitecture: (workspaceId: string, prompt: string, onProgress?: (p: GenerationProgress) => void) => Promise<ArchitectureData | null>;
  setSelectedNode: (node: ArchNode | null) => void;
  updatePendingFile: (path: string, content: string) => void;
  saveDesignCanvas: (workspaceId: string, designData: any) => Promise<void>;
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

    try {
      let result: ArchitectureData | null = null;

      for await (const { event, data } of api.stream(`/api/workspaces/${workspaceId}/generate/stream`, { prompt })) {
        switch (event) {
          case 'memory_retrieved':
            set({ generationProgress: { stage: 'memory', message: `Found ${(data as { count: number }).count} relevant past decisions` } });
            break;
          case 'planning_start':
            set({ generationProgress: { stage: 'planning', message: 'AI is architecting the system...' } });
            break;
          case 'planning_done':
            set({ generationProgress: { stage: 'coding', message: `Plan ready: ${(data as { node_count: number }).node_count} components`, totalNodes: (data as { node_count: number }).node_count } });
            break;
          case 'coding_node':
            set({ generationProgress: {
              stage: 'coding',
              currentNode: (data as { label: string }).label,
              completedNodes: (data as { index: number }).index,
              totalNodes: (data as { total: number }).total,
              message: `Generating ${(data as { label: string }).label}...`,
            }});
            break;
          case 'critique_start':
            set({ generationProgress: { stage: 'critique', message: 'Architecture Critic reviewing...' } });
            break;
          case 'critique_done':
            set({ generationProgress: { stage: 'critique', score: (data as { score: number }).score, issues: (data as { issues_count: number }).issues_count, critiqued: true } });
            break;
          case 'complete':
            result = (data as { architecture_data: ArchitectureData }).architecture_data;
            set({ generationProgress: { stage: 'complete', score: undefined }, generating: false });
            if (result) {
              set(state => ({
                currentWorkspace: state.currentWorkspace
                  ? { ...state.currentWorkspace, architectureData: result! }
                  : null,
              }));
            }
            break;
          case 'error':
            set({ generating: false, generationProgress: { stage: 'error', message: (data as { message: string }).message } });
            break;
        }
        onProgress?.(get().generationProgress);
      }
      return result;
    } catch (err) {
      set({ generating: false, generationProgress: { stage: 'error', message: err instanceof Error ? err.message : 'Generation failed' } });
      return null;
    }
  },
  
  saveDesignCanvas: async (workspaceId, designData) => {
    try {
      await api.patch(`/api/workspaces/${workspaceId}/design`, { designData });
      set(state => ({
        currentWorkspace: state.currentWorkspace 
          ? { ...state.currentWorkspace, designData }
          : null
      }));
    } catch (err) {
      console.error('Failed to save design canvas:', err);
    }
  },

  setSelectedNode: (node) => set({ selectedNode: node }),
  
  updatePendingFile: (path, content) => set(state => ({
    pendingCodeChanges: { ...state.pendingCodeChanges, [path]: content }
  })),

  syncCodeToArchitecture: async (workspaceId) => {
    const { pendingCodeChanges, currentWorkspace } = get();
    if (!currentWorkspace || Object.keys(pendingCodeChanges).length === 0) return;

    set({ generating: true, generationProgress: { stage: 'planning', message: 'Reconciling code with architecture...' } });

    try {
      // Send modified files + current architecture for AI analysis
      const res = await api.post<{ data: ArchitectureData }>(`/api/workspaces/${workspaceId}/sync`, {
        modifiedFiles: Object.entries(pendingCodeChanges).map(([path, content]) => ({ path, content })),
      });

      set(state => ({
        currentWorkspace: state.currentWorkspace 
          ? { ...state.currentWorkspace, architectureData: res.data }
          : null,
        pendingCodeChanges: {}, // Clear after sync
        generating: false,
        generationProgress: { stage: 'complete', message: 'Architecture synchronized!' }
      }));
    } catch (err) {
      set({ 
        generating: false, 
        generationProgress: { stage: 'error', message: err instanceof Error ? err.message : 'Sync failed' } 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
