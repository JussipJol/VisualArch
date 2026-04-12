import { create } from "zustand";
import {
  type Node,
  type Edge,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type EdgeChange,
  type Connection,
} from "reactflow";
import dagre from "dagre";

export interface NodeData {
  label: string;
  description: string;
  layer: string;                                   // Dynamic — AI decides
  files?: { path: string; content: string }[];
  explain?: string;
}

export interface ArchitectureData {
  nodes: Node<NodeData>[];
  edges: Edge[];
  iteration: number;
  full_context_summary: string;
  tech_stack?: string[];
  file_tree?: string[];
  layout_direction?: "TB" | "BT" | "LR" | "RL" | "Planetary";
  last_prompt?: string;
  generated_at?: string;
}

interface ArchitectureStore {
  // ── Data ──
  nodes: Node<NodeData>[];
  edges: Edge[];
  iteration: number;
  fullContextSummary: string;
  techStack: string[];
  fileTree: string[];
  layoutDirection: "TB" | "BT" | "LR" | "RL" | "Planetary";

  // ── UI state ──
  selectedNodeId: string | null;
  isGenerating: boolean;
  logs: string[];
  viewMode: "canvas" | "ide";
  activeFilePath: string | null;
  openFileTabs: string[];

  // ── Actions ──
  setArchitecture: (data: ArchitectureData) => void;
  setSelectedNode: (id: string | null) => void;
  setGenerating: (v: boolean) => void;
  addLog: (msg: string) => void;
  clearLogs: () => void;
  reset: () => void;
  setViewMode: (mode: "canvas" | "ide") => void;
  setLayoutDirection: (dir: "TB" | "BT" | "LR" | "RL" | "Planetary") => void;
  openFile: (path: string) => void;
  closeFileTab: (path: string) => void;

  // ── React Flow ──
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // ── Computed helpers ──
  getAllFiles: () => { path: string; content: string; nodeLabel: string; layer: string }[];
  getStats: () => { totalNodes: number; totalFiles: number; totalLines: number; layers: string[] };
}

// ── Auto-Layout Helper ──
const nodeWidth = 280;
const nodeHeight = 100;

function getLayoutedElements(nodes: Node<NodeData>[], edges: Edge[], direction = "LR") {
  if (direction === "Planetary") {
    // Planetary Layout Logic
    const newNodes = [...nodes];
    const layers = [...new Set(newNodes.map((n) => n.data.layer))];
    const center = { x: 500, y: 500 };
    
    layers.forEach((layerName, layerIdx) => {
      const layerNodes = newNodes.filter((n) => n.data.layer === layerName);
      // Determine radius based on layer depth
      const radius = layerIdx === 0 && layerNodes.length === 1 ? 0 : 380 + layerIdx * 350;
      
      layerNodes.forEach((node, i) => {
        if (radius === 0) {
          node.position = { x: center.x - nodeWidth / 2, y: center.y - nodeHeight / 2 };
        } else {
          const angle = (i / layerNodes.length) * 2 * Math.PI;
          node.position = {
            x: center.x + radius * Math.cos(angle) - nodeWidth / 2,
            y: center.y + radius * Math.sin(angle) - nodeHeight / 2,
          };
        }
        // Let React Flow draw straight lines
        node.targetPosition = undefined as any;
        node.sourcePosition = undefined as any;
      });
    });
    
    return { nodes: newNodes as Node<NodeData>[], edges };
  }

  // --- Fallback to Dagre ---
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      // Optional: fix target/source handles if layout direction is known
      targetPosition: direction === "LR" ? "left" : "top",
      sourcePosition: direction === "LR" ? "right" : "bottom",
    };
  });

  return { nodes: newNodes as Node<NodeData>[], edges };
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
  nodes: [],
  edges: [],
  iteration: 0,
  fullContextSummary: "",
  techStack: [],
  fileTree: [],
  layoutDirection: "LR",
  selectedNodeId: null,
  isGenerating: false,
  logs: [],
  viewMode: "canvas",
  activeFilePath: null,
  openFileTabs: [],

  setArchitecture: (data) => {
    const direction = data.layout_direction || "LR";
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(data.nodes, data.edges, direction);
    
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges,
      iteration: data.iteration,
      fullContextSummary: data.full_context_summary,
      techStack: data.tech_stack || [],
      fileTree: data.file_tree || [],
      layoutDirection: direction,
    });
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setGenerating: (v) => set({ isGenerating: v }),
  addLog: (msg) => set((s) => ({ logs: [...s.logs, msg] })),
  clearLogs: () => set({ logs: [] }),

  reset: () =>
    set({
      nodes: [],
      edges: [],
      iteration: 0,
      fullContextSummary: "",
      techStack: [],
      fileTree: [],
      selectedNodeId: null,
      isGenerating: false,
      logs: [],
      viewMode: "canvas",
      activeFilePath: null,
      openFileTabs: [],
    }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setLayoutDirection: (dir) => {
    const { nodes, edges } = get();
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(nodes, edges, dir);
    set({ layoutDirection: dir, nodes: newNodes, edges: newEdges });
  },

  openFile: (path) =>
    set((s) => ({
      activeFilePath: path,
      openFileTabs: s.openFileTabs.includes(path) ? s.openFileTabs : [...s.openFileTabs, path],
    })),

  closeFileTab: (path) =>
    set((s) => {
      const tabs = s.openFileTabs.filter((t) => t !== path);
      return {
        openFileTabs: tabs,
        activeFilePath: s.activeFilePath === path ? (tabs[tabs.length - 1] || null) : s.activeFilePath,
      };
    }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<NodeData>[] });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  },

  // ── Collect ALL files from ALL nodes ──
  getAllFiles: () => {
    const nodes = get().nodes;
    const files: { path: string; content: string; nodeLabel: string; layer: string }[] = [];
    for (const node of nodes) {
      for (const file of node.data.files || []) {
        files.push({
          path: file.path,
          content: file.content,
          nodeLabel: node.data.label,
          layer: node.data.layer,
        });
      }
    }
    return files.sort((a, b) => a.path.localeCompare(b.path));
  },

  getStats: () => {
    const nodes = get().nodes;
    const files = get().getAllFiles();
    const totalLines = files.reduce((sum, f) => sum + (f.content?.split("\n").length || 0), 0);
    const layers = [...new Set(nodes.map((n) => n.data.layer))];
    return { totalNodes: nodes.length, totalFiles: files.length, totalLines, layers };
  },
}));
