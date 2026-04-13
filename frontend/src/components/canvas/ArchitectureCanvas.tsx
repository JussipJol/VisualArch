'use client';

import { useCallback, useMemo } from 'react';
import { ArchNode, ArchEdge, GenerationProgress } from '@/lib/store/workspace';
import { RefreshCw } from 'lucide-react';

// We use a lightweight canvas since ReactFlow requires specific setup
// In production this would use: import ReactFlow, { ... } from 'reactflow'

interface Props {
  nodes: ArchNode[];
  edges: ArchEdge[];
  onNodeClick: (node: ArchNode) => void;
  generating: boolean;
  generationProgress: GenerationProgress;
}

const LAYER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Frontend:      { bg: 'rgba(94,129,244,0.12)', border: '#5E81F4', text: '#5E81F4' },
  Backend:       { bg: 'rgba(34,211,238,0.12)', border: '#22D3EE', text: '#22D3EE' },
  Gateway:       { bg: 'rgba(167,139,250,0.12)', border: '#A78BFA', text: '#A78BFA' },
  Services:      { bg: 'rgba(74,222,128,0.12)', border: '#4ADE80', text: '#4ADE80' },
  Database:      { bg: 'rgba(251,191,36,0.12)', border: '#FACC15', text: '#FACC15' },
  Cache:         { bg: 'rgba(248,113,113,0.12)', border: '#F87171', text: '#F87171' },
  Auth:          { bg: 'rgba(167,139,250,0.12)', border: '#A78BFA', text: '#A78BFA' },
  Infrastructure:{ bg: 'rgba(139,143,168,0.12)', border: '#8B8FA8', text: '#8B8FA8' },
  Realtime:      { bg: 'rgba(34,211,238,0.12)', border: '#22D3EE', text: '#22D3EE' },
  Payments:      { bg: 'rgba(74,222,128,0.12)', border: '#4ADE80', text: '#4ADE80' },
};

const STATUS_COLORS: Record<string, string> = {
  new:      '#4ADE80',
  modified: '#FACC15',
  stable:   '#5E81F4',
};

export function ArchitectureCanvas({ nodes, edges, onNodeClick, generating, generationProgress }: Props) {
  const svgWidth = 900;
  const svgHeight = 520;

  // Group nodes by layer for display
  const layers = useMemo(() => {
    const map = new Map<string, ArchNode[]>();
    nodes.forEach(n => {
      const arr = map.get(n.layer) ?? [];
      arr.push(n);
      map.set(n.layer, arr);
    });
    return map;
  }, [nodes]);

  if (nodes.length === 0 && !generating) {
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
    <div className="h-full overflow-auto bg-bg relative" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        className="min-w-full min-h-full"
        style={{ minWidth: `${svgWidth}px`, minHeight: `${svgHeight}px` }}
      >
        {/* Render edges */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(94,129,244,0.6)" />
          </marker>
        </defs>

        {edges.map(edge => {
          const src = nodes.find(n => n.id === edge.source);
          const tgt = nodes.find(n => n.id === edge.target);
          if (!src || !tgt) return null;

          const x1 = src.position.x + 80;
          const y1 = src.position.y + 35;
          const x2 = tgt.position.x + 80;
          const y2 = tgt.position.y + 5;
          const cpY = (y1 + y2) / 2;

          return (
            <g key={edge.id}>
              <path
                d={`M${x1},${y1} C${x1},${cpY} ${x2},${cpY} ${x2},${y2}`}
                fill="none"
                stroke="rgba(94,129,244,0.4)"
                strokeWidth="1.5"
                strokeDasharray="5,3"
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} fill="rgba(139,143,168,0.8)" fontSize="9" textAnchor="middle">
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Render nodes */}
        {nodes.map(node => {
          const colors = LAYER_COLORS[node.layer] ?? LAYER_COLORS.Backend;
          const statusColor = STATUS_COLORS[node.status] ?? '#8B8FA8';
          const x = node.position.x;
          const y = node.position.y;
          const w = 160;
          const h = 70;

          return (
            <g
              key={node.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onNodeClick(node)}
            >
              {/* Glow */}
              <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx="10"
                fill={colors.bg} opacity="0.5" />

              {/* Card */}
              <rect x={x} y={y} width={w} height={h} rx="8"
                fill={colors.bg}
                stroke={colors.border}
                strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 2px 8px ${colors.border}30)` }}
              />

              {/* Status dot */}
              <circle cx={x + w - 12} cy={y + 12} r="4" fill={statusColor} />

              {/* Label */}
              <text x={x + 12} y={y + 22} fill={colors.text} fontSize="11" fontWeight="600">
                {node.label}
              </text>

              {/* Layer badge */}
              <text x={x + 12} y={y + 38} fill="rgba(139,143,168,0.7)" fontSize="9">
                {node.layer}
              </text>

              {/* Description */}
              <foreignObject x={x + 8} y={y + 44} width={w - 16} height={22}>
                <div style={{ fontSize: '8px', color: 'rgba(139,143,168,0.6)', lineHeight: '1.3', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {node.description}
                </div>
              </foreignObject>

              {/* Files count */}
              {node.files && node.files.length > 0 && (
                <text x={x + 12} y={y + h - 8} fill="rgba(139,143,168,0.5)" fontSize="8">
                  {node.files.length} files · {node.testFiles?.length ?? 0} tests
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Mini-map overlay */}
      <div className="absolute bottom-4 right-4 w-32 h-20 rounded-lg bg-surface/80 border border-white/10 overflow-hidden backdrop-blur-sm">
        <svg width="128" height="80" className="opacity-60">
          {nodes.map(node => {
            const colors = LAYER_COLORS[node.layer] ?? LAYER_COLORS.Backend;
            return (
              <rect
                key={node.id}
                x={(node.position.x / svgWidth) * 128}
                y={(node.position.y / svgHeight) * 80}
                width="18" height="10" rx="2"
                fill={colors.border}
                opacity="0.7"
              />
            );
          })}
        </svg>
        <div className="absolute bottom-1 left-1 text-xs text-text-secondary opacity-60">
          {nodes.length} nodes
        </div>
      </div>
    </div>
  );
}
