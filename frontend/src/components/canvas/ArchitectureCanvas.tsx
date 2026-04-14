'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  Edge,
  Node,
  ConnectionLineType,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArchNode, ArchEdge, GenerationProgress } from '@/lib/store/workspace';
import { RefreshCw } from 'lucide-react';
import ArchitectureNode from './ArchitectureNode';

interface Props {
  nodes: ArchNode[];
  edges: ArchEdge[];
  onNodeClick: (node: ArchNode) => void;
  generating: boolean;
  generationProgress: GenerationProgress;
}

const nodeTypes = {
  archNode: ArchitectureNode,
};

export function ArchitectureCanvas({ nodes: initialNodes, edges: initialEdges, onNodeClick, generating, generationProgress }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync with incoming props
  useEffect(() => {
    const flowNodes: Node[] = initialNodes.map(n => ({
      id: n.id,
      type: 'archNode',
      position: n.position,
      data: n,
    }));

    const flowEdges: Edge[] = initialEdges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'rgba(94,129,244,0.4)', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(94,129,244,0.6)',
      },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeInternalClick = useCallback((_: React.MouseEvent, node: Node) => {
    onNodeClick(node.data);
  }, [onNodeClick]);

  if (initialNodes.length === 0 && !generating) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-text-secondary">
        <div className="w-24 h-24 rounded-2xl bg-surface border border-white/10 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="18" height="12" rx="3" stroke="#5E81F4" strokeWidth="1.5" fill="rgba(94,129,244,0.1)" />
            <rect x="26" y="4" width="18" height="12" rx="3" stroke="#22D3EE" strokeWidth="1.5" fill="rgba(34,211,238,0.1)" />
            <rect x="14" y="32" width="20" height="12" rx="3" stroke="#4ADE80" strokeWidth="1.5" fill="rgba(74,222,128,0.1)" />
            <line x1="13" y1="16" x2="24" y2="32" stroke="#5E81F4" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="35" y1="16" x2="24" y2="32" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3,2" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">No architecture yet</p>
          <p className="text-xs mt-1 max-w-xs">Describe your system in the prompt below and click Generate to create your architecture</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <svg width="120" height="120" className="animate-spin-slow" style={{ animationDuration: '4s' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(94,129,244,0.1)" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#5E81F4" strokeWidth="8"
              strokeDasharray="80 240" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-accent streaming">{generationProgress.message ?? 'Generating architecture...'}</p>
          {generationProgress.totalNodes && (
            <p className="text-xs text-text-secondary mt-1">
              {generationProgress.completedNodes ?? 0} / {generationProgress.totalNodes} components
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-bg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeInternalClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="architecture-canvas"
      >
        <Background color="#333" gap={20} size={1} />
        <Controls className="!bg-surface !border-white/10 fill-white" />
        <MiniMap 
          nodeColor={(node) => {
            const data = node.data as ArchNode;
            return data.layer === 'Frontend' ? '#5E81F4' : '#22D3EE';
          }}
          maskColor="rgba(0, 0, 0, 0.3)"
          className="!bg-surface/50 !border-white/10 rounded-lg overflow-hidden backdrop-blur-sm"
        />
      </ReactFlow>

      <style jsx global>{`
        .react-flow__edge-path {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }

        @keyframes dashdraw {
          from {
            stroke-dashoffset: 10;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .react-flow__controls-button {
          background: rgba(255, 255, 255, 0.05) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          fill: #8B8FA8 !important;
        }

        .react-flow__controls-button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .react-flow__attribution {
          display: none;
        }
      `}</style>
    </div>
  );
}
