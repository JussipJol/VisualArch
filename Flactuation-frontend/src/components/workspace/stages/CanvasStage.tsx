import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useWorkspaceStore } from '../../../stores/workspace.store';
import type { CanvasNode, CanvasEdge } from '../../../stores/workspace.store';
import { api } from '../../../api/client';
import { useSSE } from '../../../hooks/useSSE';

const NODE_W = 160;
const NODE_H = 70;

const typeColor: Record<string, string> = {
  service: '#00ffcc',
  database: '#7c3aed',
  queue: '#f59e0b',
  client: '#3b82f6',
  api: '#ff1493',
};

const typeIcon: Record<string, string> = {
  service: '⬡',
  database: '◈',
  queue: '⊞',
  client: '◻',
  api: '⬧',
};

const SUGGESTIONS = [
  { 
    label: 'Enterprise SaaS', 
    prompt: 'Architect a high-scale Enterprise SaaS Platform. Requirements: Multi-tenant database architecture (PostgreSQL row-level security), Next.js 15 frontend with advanced analytics dashboards and SSR optimization. Backend: High-concurrency Go microservices. Auth: Enterprise-grade JWT with RBAC and SSO (SAML/Okta) support. Billing: Complex Stripe integration for per-seat and usage-based billing. Infrastructure: Kubernetes-ready with Prometheus/Grafana monitoring and full CI/CD pipeline.' 
  },
  { 
    label: 'Full E-commerce', 
    prompt: 'Design a comprehensive Full-scale E-commerce Ecosystem. Core Modules: 1. Advanced Auth (JWT/OAuth2/MFA). 2. Dynamic Product Catalog with variant management. 3. Real-time Shopping Cart (Redis). 4. Secure Order Management system with lifecycle tracking. 5. Global Payments: Stripe integration with Checkout/Webhooks. 6. Notifications: SendGrid for transactional emails. 7. Search: Elasticsearch for fuzzy/facet search. 8. Performance: Integrated CDN strategy for global media delivery. Stack: React, Node.js, MongoDB, Redis.' 
  },
  { 
    label: 'AI Chat System', 
    prompt: 'Build a next-gen Scalable AI Chat Platform. Infrastructure: Node.js WebSocket cluster (Socket.io) with sticky sessions. Features: Global presence, real-time typing indicators, and message read receipts. Data: MongoDB cluster for infinite message history and multi-device sync, Redis PubSub for cross-server routing. AI: Direct streaming from Gemini 1.5 Pro and Llama 3.3 with project-aware memory context. Security: End-to-end encryption (E2EE), media moderation, and rate limiting.' 
  },
  { 
    label: 'Analytics Pipeline', 
    prompt: 'Implement a high-throughput Regional Data Intelligence Pipeline. Ingestion: Distributed scrapers and IoT feeders streaming into Apache Kafka with schema registry. Processing: Spark Streaming for real-time data cleaning, transformation, and sentiment analysis. Analytics: ClickHouse OLAP storage for sub-second analytical queries. UI: Custom D3.js real-time analytics dashboard with auto-updating metrics and trend forecasting. Full observability: ELK stack (Elasticsearch, Logstash, Kibana) and OpenTelemetry.' 
  }
];

interface ViewState { x: number; y: number; scale: number }

export const CanvasStage = ({ projectId }: { projectId: string }) => {
  const { canvasNodes, canvasEdges, canvasMode, setCanvas, setCanvasMode, setGenerating, setStage, isGenerating, project } = useWorkspaceStore();
  const { stream } = useSSE();

  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<ViewState>({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState<{ nodeId: string; ox: number; oy: number } | null>(null);
  const [panning, setPanning] = useState<{ sx: number; sy: number; vx: number; vy: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<CanvasNode | null>(null);
  const [status, setStatus] = useState('');
  const [prompt, setPrompt] = useState('');

  // Load existing canvas on mount
  useEffect(() => {
    api.get(`/projects/${projectId}/canvas`).then(({ data }) => {
      if (data.iteration) {
        setCanvas(data.iteration.nodes, data.iteration.edges);
      }
    }).catch(() => {});
  }, [projectId]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setGenerating(true, 'canvas');
    setStatus('Connecting...');

    try {
      await stream(`/projects/${projectId}/canvas/generate`, { prompt, mode: canvasMode }, {
        onStatus: (msg) => setStatus(msg),
        onChunk: () => {},
        onDone: async (data) => {
          const iter = data.iteration as { nodes: CanvasNode[]; edges: CanvasEdge[] };
          if (iter?.nodes) setCanvas(iter.nodes, iter.edges || []);
          
          setStatus('Architecture ready. Initializing code generation...');
          
          // One-shot: Trigger code generation immediately
          await stream(`/projects/${projectId}/code/generate`, { prompt: prompt || project?.name }, {
            onStatus: (msg) => setStatus(msg),
            onProgress: (stage, file) => setStatus(`${stage}: ${file || 'processing'}`),
            onDone: () => {
              setStatus('');
              setPrompt('');
              setGenerating(false);
              // Switch to preview stage to show the result
              setStage('preview');
            },
            onError: (msg) => { setStatus(`Code Error: ${msg}`); setGenerating(false); },
          });
        },
        onError: (msg) => { setStatus(`Canvas Error: ${msg}`); setGenerating(false); },
      });
    } catch (err) {
      setStatus('Connection lost');
      setGenerating(false);
    }
  };

  // Coordinate transform
  const toSVG = useCallback((cx: number, cy: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: (cx - rect.left - view.x) / view.scale,
      y: (cy - rect.top - view.y) / view.scale,
    };
  }, [view]);

  const onSVGMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current || (e.target as SVGElement).tagName === 'rect' && !(e.target as SVGElement).dataset.nodeid) {
      setPanning({ sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y });
      setSelected(null);
    }
  };

  const onSVGMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragging) {
      const p = toSVG(e.clientX, e.clientY);
      setCanvas(
        canvasNodes.map(n => n.id === dragging.nodeId ? { ...n, x: p.x - dragging.ox, y: p.y - dragging.oy } : n),
        canvasEdges
      );
    } else if (panning) {
      setView(v => ({ ...v, x: panning.vx + (e.clientX - panning.sx), y: panning.vy + (e.clientY - panning.sy) }));
    }
  };

  const onSVGMouseUp = () => { setDragging(null); setPanning(null); };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = svgRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setView(v => {
      const ns = Math.max(0.2, Math.min(3, v.scale * factor));
      return { scale: ns, x: mx - (mx - v.x) * (ns / v.scale), y: my - (my - v.y) * (ns / v.scale) };
    });
  };

  const onNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelected(nodeId);
    const p = toSVG(e.clientX, e.clientY);
    const node = canvasNodes.find(n => n.id === nodeId);
    if (node) {
      setDragging({ nodeId, ox: p.x - node.x, oy: p.y - node.y });
    }
  };

  const onNodeDoubleClick = (nodeId: string) => {
    const node = canvasNodes.find(n => n.id === nodeId);
    if (node) setEditingNode({ ...node });
  };

  const handleUpdateNode = (updated: CanvasNode) => {
    setCanvas(
      canvasNodes.map(n => n.id === updated.id ? updated : n),
      canvasEdges
    );
    setEditingNode(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    setCanvas(
      canvasNodes.filter(n => n.id !== nodeId),
      canvasEdges.filter(e => e.source !== nodeId && e.target !== nodeId)
    );
    setEditingNode(null);
  };

  const saveCanvas = () => {
    api.put(`/projects/${projectId}/canvas`, { nodes: canvasNodes, edges: canvasEdges, mode: canvasMode }).catch(() => {});
  };

  const renderEdge = (edge: CanvasEdge) => {
    const src = canvasNodes.find(n => n.id === edge.source);
    const tgt = canvasNodes.find(n => n.id === edge.target);
    if (!src || !tgt) return null;

    const x1 = src.x + NODE_W / 2;
    const y1 = src.y + NODE_H;
    const x2 = tgt.x + NODE_W / 2;
    const y2 = tgt.y;
    const cy = (y1 + y2) / 2;

    const strokeColor = edge.type === 'async' ? '#f59e0b' : edge.type === 'bidirectional' ? '#7c3aed' : 'rgba(255,255,255,0.25)';

    return (
      <g key={edge.id}>
        <path d={`M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}`} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeDasharray={edge.type === 'async' ? '6 3' : undefined} />
        {/* arrowhead */}
        <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 8} ${x2 + 5},${y2 - 8}`} fill={strokeColor} />
        {edge.label && (
          <text x={(x1 + x2) / 2} y={cy - 6} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle" fontFamily="Space Mono">{edge.label}</text>
        )}
      </g>
    );
  };

  const renderNode = (node: CanvasNode) => {
    const color = typeColor[node.type] || '#fff';
    const isSelected = selected === node.id;
    return (
      <g 
        key={node.id} 
        transform={`translate(${node.x},${node.y})`} 
        onMouseDown={e => onNodeMouseDown(e, node.id)}
        onDoubleClick={() => onNodeDoubleClick(node.id)}
        style={{ cursor: 'grab' }}
      >
        <rect width={NODE_W} height={NODE_H} fill="rgba(0,0,0,0.8)" stroke={isSelected ? color : 'rgba(255,255,255,0.12)'} strokeWidth={isSelected ? 1.5 : 1} rx={2} />
        {/* colored left accent */}
        <rect width={3} height={NODE_H} fill={color} rx={1} />
        {/* icon */}
        <text x={18} y={24} fill={color} fontSize={14} fontFamily="monospace">{typeIcon[node.type] || '◻'}</text>
        {/* label */}
        <text x={18} y={42} fill="#fff" fontSize={11} fontFamily="'Space Mono', monospace" fontWeight={600}>{node.label.length > 18 ? node.label.slice(0, 16) + '..' : node.label}</text>
        {/* tech */}
        <text x={18} y={57} fill={color} fontSize={9} fontFamily="'Space Mono', monospace" opacity={0.7}>{node.tech?.slice(0, 22)}</text>
        {/* status dot */}
        <circle cx={NODE_W - 10} cy={10} r={3} fill={node.status === 'stable' ? '#00ffcc' : node.status === 'modified' ? '#f59e0b' : '#ff1493'} />
      </g>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {(['standard', 'tree', 'spider'] as const).map(m => (
          <button key={m} onClick={() => setCanvasMode(m)} style={{ background: canvasMode === m ? 'rgba(0,255,204,0.1)' : 'transparent', border: `1px solid ${canvasMode === m ? '#00ffcc' : 'rgba(255,255,255,0.1)'}`, color: canvasMode === m ? '#00ffcc' : 'rgba(255,255,255,0.4)', padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', transition: 'all 0.2s' }}>
            {m}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setView({ x: 0, y: 0, scale: 1 })} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem' }}>RESET VIEW</button>
        {canvasNodes.length > 0 && (
          <button onClick={saveCanvas} style={{ background: 'transparent', border: '1px solid rgba(0,255,204,0.3)', color: '#00ffcc', padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: 1 }}>SAVE</button>
        )}
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 2 }}>{canvasNodes.length} NODES</span>
      </div>

      {/* SVG Canvas */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {canvasNodes.length === 0 && !isGenerating && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, pointerEvents: 'none' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', letterSpacing: 4 }}>// CANVAS EMPTY</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.25)' }}>Describe your system in the chat →</div>
          </div>
        )}
        {status && (
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(0,255,204,0.3)', color: '#00ffcc', padding: '8px 20px', fontSize: '0.75rem', letterSpacing: 2, zIndex: 10 }}>
            {status}
          </div>
        )}
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ display: 'block', cursor: panning ? 'grabbing' : 'default' }}
          onMouseDown={onSVGMouseDown}
          onMouseMove={onSVGMouseMove}
          onMouseUp={onSVGMouseUp}
          onMouseLeave={onSVGMouseUp}
          onWheel={onWheel}
        >
          {/* Grid dots */}
          <defs>
            <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse" x={view.x % 40} y={view.y % 40}>
              <circle cx={1} cy={1} r={1} fill="rgba(255,255,255,0.04)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <g transform={`translate(${view.x},${view.y}) scale(${view.scale})`}>
            {/* Edges first */}
            {canvasEdges.map(renderEdge)}
            {/* Nodes on top */}
            {canvasNodes.map(renderNode)}
          </g>
        </svg>

        {/* Node Editor Modal */}
        {editingNode && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', width: 360, padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 16 }}>// EDIT NODE</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>LABEL</label>
                  <input value={editingNode.label} onChange={e => setEditingNode({...editingNode, label: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>TECHNOLOGY</label>
                  <input value={editingNode.tech} onChange={e => setEditingNode({...editingNode, tech: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>TYPE</label>
                  <select value={editingNode.type} onChange={e => setEditingNode({...editingNode, type: e.target.value as any})} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }}>
                    {Object.keys(typeColor).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button onClick={() => handleDeleteNode(editingNode.id)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,20,147,0.3)', color: '#ff1493', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>DELETE</button>
                <div style={{ flex: 1 }} />
                <button onClick={() => setEditingNode(null)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.75rem' }}>CANCEL</button>
                <button onClick={() => handleUpdateNode(editingNode)} style={{ padding: '10px 20px', background: '#00ffcc', border: 'none', color: '#000', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>SAVE CHANGES</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prompt & Suggestions bar */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#050505', flexShrink: 0 }}>
        {canvasNodes.length === 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i} 
                onClick={() => { setPrompt(s.prompt); }}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.07)', 
                  color: 'rgba(255, 255, 255, 0.35)', 
                  padding: '6px 14px', 
                  borderRadius: '3px', 
                  cursor: 'pointer', 
                  fontSize: '0.68rem', 
                  transition: '0.2s' 
                }}
                onMouseEnter={e => { 
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,255,204,0.3)'; 
                  (e.currentTarget as HTMLButtonElement).style.color = '#00ffcc'; 
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,204,0.05)';
                }}
                onMouseLeave={e => { 
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.07)'; 
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255, 255, 255, 0.35)'; 
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.02)';
                }}
              >
                + {s.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="Describe your architecture... (e.g. e-commerce with auth, products, cart, payment)"
            disabled={isGenerating}
            style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,255,204,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{ background: isGenerating ? 'transparent' : '#00ffcc', color: '#000', border: `1px solid ${isGenerating ? 'rgba(0,255,204,0.3)' : '#00ffcc'}`, padding: '12px 24px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, transition: 'all 0.2s', opacity: isGenerating ? 0.5 : 1 }}
          >
            {isGenerating ? 'GENERATING...' : 'GENERATE'}
          </button>
        </div>
      </div>
    </div>
  );
};
