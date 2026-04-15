// ─── Module: Canvas Stage ─────────────────────────────────────────────────────
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores/workspace.store';
import type { CanvasNode, CanvasEdge } from '../../stores/workspace.store';
import { api } from '../../api/client';
import { useSSE } from '../../hooks/useSSE';

// ── Node dimensions ──────────────────────────────────────────────────────────
const NODE_W = 200;
const NODE_H = 130;

// ── 12-type colour palette ───────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  client:     '#60a5fa',
  cdn:        '#34d399',
  gateway:    '#00ffcc',
  auth:       '#f472b6',
  service:    '#00e5ff',
  worker:     '#fbbf24',
  cache:      '#fb923c',
  queue:      '#f59e0b',
  database:   '#7c3aed',
  storage:    '#8b5cf6',
  monitoring: '#9ca3af',
  external:   '#ff1493',
  api:        '#ff1493', // legacy
};

const TYPE_ICON: Record<string, string> = {
  client:     '◻',
  cdn:        '◈',
  gateway:    '⬡',
  auth:       '⊞',
  service:    '⬡',
  worker:     '⚙',
  cache:      '⊛',
  queue:      '≡',
  database:   '◈',
  storage:    '⊟',
  monitoring: '◎',
  external:   '⬧',
  api:        '⬧',
};

// ── Suggestions ──────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { label: 'SaaS Platform',   prompt: 'Modern SaaS with Next.js, Go microservices, PostgreSQL, Redis caching, Stripe billing, email notifications, and background job processing' },
  { label: 'E-commerce',      prompt: 'Full e-commerce: Auth, Product Catalog, Cart, Order, Payment (Stripe), Notification (SendGrid), Search (Elasticsearch), CDN for media' },
  { label: 'Real-time Chat',  prompt: 'Real-time chat app with WebSockets, message persistence, Redis PubSub, media upload (S3), push notifications, user presence tracking' },
  { label: 'Data Pipeline',   prompt: 'ETL data pipeline: Web Scraper → Kafka → Spark Stream processor → ClickHouse analytics → Grafana monitoring, with S3 cold storage' },
];

interface ViewState { x: number; y: number; scale: number }

// ── Tooltip state ─────────────────────────────────────────────────────────────
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  node: CanvasNode | null;
}

export const CanvasStage = ({ projectId }: { projectId: string }) => {
  const {
    canvasNodes, canvasEdges, canvasMode,
    setCanvas, setCanvasMode, setGenerating, setStage,
    isGenerating, project,
  } = useWorkspaceStore();
  const { stream } = useSSE();

  const svgRef  = useRef<SVGSVGElement>(null);
  const [view, setView]           = useState<ViewState>({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging]   = useState<{ nodeId: string; ox: number; oy: number } | null>(null);
  const [panning, setPanning]     = useState<{ sx: number; sy: number; vx: number; vy: number } | null>(null);
  const [selected, setSelected]   = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<CanvasNode | null>(null);
  const [tooltip, setTooltip]     = useState<TooltipState>({ visible: false, x: 0, y: 0, node: null });
  const [status, setStatus]       = useState('');
  const [prompt, setPrompt]       = useState('');

  // Load existing canvas on mount
  useEffect(() => {
    api.get(`/projects/${projectId}/canvas`).then(({ data }) => {
      if (data.iteration) setCanvas(data.iteration.nodes, data.iteration.edges);
    }).catch(() => {});
  }, [projectId]);

  // ── Wheel zoom — must be non-passive to call preventDefault ─────────────────
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setView(v => {
        const ns = Math.max(0.15, Math.min(3, v.scale * factor));
        return { scale: ns, x: mx - (mx - v.x) * (ns / v.scale), y: my - (my - v.y) * (ns / v.scale) };
      });
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // ── Generate ────────────────────────────────────────────────────────────────
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

          setStatus('Architecture ready! Advancing to Design...');
          await new Promise(r => setTimeout(r, 900));

          setStatus('');
          setPrompt('');
          setGenerating(false);
          // Pipeline step 1 complete — move to Design stage.
          // Design tokens (colors, screens, components) will inform code generation in step 2.
          setStage('design');
        },
        onError: (msg) => { setStatus(`Error: ${msg}`); setGenerating(false); },
      });
    } catch {
      setStatus('Connection lost');
      setGenerating(false);
    }
  };

  // ── Coordinate helpers ───────────────────────────────────────────────────────
  const toSVG = useCallback((cx: number, cy: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: (cx - rect.left - view.x) / view.scale,
      y: (cy - rect.top  - view.y) / view.scale,
    };
  }, [view]);

  // ── Mouse events ─────────────────────────────────────────────────────────────
  const onSVGMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target === svgRef.current || (target.tagName === 'rect' && !target.dataset.nodeid)) {
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

  const onNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelected(nodeId);
    const p = toSVG(e.clientX, e.clientY);
    const node = canvasNodes.find(n => n.id === nodeId);
    if (node) setDragging({ nodeId, ox: p.x - node.x, oy: p.y - node.y });
  };

  const onNodeDoubleClick = (nodeId: string) => {
    const node = canvasNodes.find(n => n.id === nodeId);
    if (node) setEditingNode({ ...node });
  };

  const onNodeMouseEnter = (e: React.MouseEvent, node: CanvasNode) => {
    const rect = svgRef.current!.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top - 8,
      node,
    });
  };

  const onNodeMouseLeave = () => setTooltip(t => ({ ...t, visible: false }));

  // ── Edit / delete helpers ────────────────────────────────────────────────────
  const handleUpdateNode = (updated: CanvasNode) => {
    setCanvas(canvasNodes.map(n => n.id === updated.id ? updated : n), canvasEdges);
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

  // ── Edge renderer ─────────────────────────────────────────────────────────────
  const renderEdge = (edge: CanvasEdge) => {
    const src = canvasNodes.find(n => n.id === edge.source);
    const tgt = canvasNodes.find(n => n.id === edge.target);
    if (!src || !tgt) return null;

    const x1 = src.x + NODE_W / 2;
    const y1 = src.y + NODE_H;
    const x2 = tgt.x + NODE_W / 2;
    const y2 = tgt.y;
    const cy = (y1 + y2) / 2;

    const strokeColor =
      edge.type === 'async'         ? '#f59e0b'
      : edge.type === 'bidirectional' ? '#7c3aed'
      : 'rgba(255,255,255,0.2)';

    return (
      <g key={edge.id}>
        <path
          d={`M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeDasharray={edge.type === 'async' ? '6 3' : undefined}
        />
        {/* arrowhead */}
        <polygon points={`${x2},${y2} ${x2-5},${y2-9} ${x2+5},${y2-9}`} fill={strokeColor} />
        {/* label */}
        {edge.label && (
          <text
            x={(x1 + x2) / 2} y={cy - 6}
            fill="rgba(255,255,255,0.35)" fontSize={9}
            textAnchor="middle" fontFamily="'Space Mono', monospace"
          >
            {edge.label}
          </text>
        )}
        {/* dataFlow secondary label */}
        {edge.dataFlow && (
          <text
            x={(x1 + x2) / 2} y={cy + 8}
            fill="rgba(255,255,255,0.18)" fontSize={8}
            textAnchor="middle" fontFamily="monospace"
          >
            {edge.dataFlow.length > 38 ? edge.dataFlow.slice(0, 36) + '…' : edge.dataFlow}
          </text>
        )}
      </g>
    );
  };

  // ── Node renderer ─────────────────────────────────────────────────────────────
  const renderNode = (node: CanvasNode) => {
    const color      = TYPE_COLOR[node.type] || '#fff';
    const icon       = TYPE_ICON[node.type]  || '◻';
    const isSelected = selected === node.id;
    const resp       = node.responsibilities?.slice(0, 2) ?? [];

    return (
      <g
        key={node.id}
        transform={`translate(${node.x},${node.y})`}
        onMouseDown={e => onNodeMouseDown(e, node.id)}
        onDoubleClick={() => onNodeDoubleClick(node.id)}
        onMouseEnter={e => onNodeMouseEnter(e, node)}
        onMouseLeave={onNodeMouseLeave}
        style={{ cursor: 'grab' }}
      >
        {/* Main card */}
        <rect
          width={NODE_W} height={NODE_H}
          fill="rgba(0,0,0,0.88)"
          stroke={isSelected ? color : 'rgba(255,255,255,0.1)'}
          strokeWidth={isSelected ? 2 : 1}
          rx={3}
        />
        {/* Top accent bar */}
        <rect width={NODE_W} height={3} fill={color} rx={1} />

        {/* Type badge */}
        <rect x={6} y={10} width={node.type.length * 5.8 + 8} height={13} fill={`${color}22`} rx={2} />
        <text x={10} y={20} fill={color} fontSize={7.5} fontFamily="'Space Mono', monospace" letterSpacing={1}>
          {node.type.toUpperCase()}
        </text>

        {/* Type icon (top-right) */}
        <text x={NODE_W - 16} y={21} fill={color} fontSize={11} fontFamily="monospace" opacity={0.5}>{icon}</text>

        {/* Label */}
        <text x={8} y={38} fill="#fff" fontSize={11.5} fontFamily="'Space Mono', monospace" fontWeight={600}>
          {node.label.length > 20 ? node.label.slice(0, 18) + '..' : node.label}
        </text>

        {/* Tech */}
        <text x={8} y={51} fill={color} fontSize={8.5} fontFamily="'Space Mono', monospace" opacity={0.75}>
          {node.tech?.slice(0, 27)}
        </text>

        {/* Divider */}
        <line x1={8} y1={57} x2={NODE_W - 8} y2={57} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />

        {/* Responsibilities */}
        {resp[0] && (
          <text x={8} y={69} fill="rgba(255,255,255,0.42)" fontSize={8} fontFamily="monospace">
            · {resp[0].length > 29 ? resp[0].slice(0, 27) + '…' : resp[0]}
          </text>
        )}
        {resp[1] && (
          <text x={8} y={80} fill="rgba(255,255,255,0.32)" fontSize={8} fontFamily="monospace">
            · {resp[1].length > 29 ? resp[1].slice(0, 27) + '…' : resp[1]}
          </text>
        )}

        {/* Divider 2 */}
        <line x1={8} y1={86} x2={NODE_W - 8} y2={86} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />

        {/* Scale / replicas */}
        {node.scale && (
          <text x={8} y={97} fill={color} fontSize={7.5} fontFamily="monospace" opacity={0.55}>
            {node.scale === 'horizontal' ? '↔' : node.scale === 'vertical' ? '↕' : '⊡'}
            {' '}{node.scale}{node.replicas && node.replicas > 1 ? ` ×${node.replicas}` : ''}
          </text>
        )}

        {/* Endpoint count badge */}
        {node.endpoints && node.endpoints.length > 0 && (
          <>
            <rect x={NODE_W - 36} y={90} width={29} height={12} fill={`${color}18`} rx={2} />
            <text x={NODE_W - 31} y={100} fill={color} fontSize={7.5} fontFamily="monospace" opacity={0.7}>
              {node.endpoints.length} EP
            </text>
          </>
        )}

        {/* Status dot */}
        <circle
          cx={NODE_W - 8} cy={NODE_H - 8} r={3.5}
          fill={node.status === 'stable' ? '#00ffcc' : node.status === 'modified' ? '#f59e0b' : '#ff1493'}
        />

        {/* Selection glow */}
        {isSelected && (
          <rect
            width={NODE_W} height={NODE_H}
            fill="none"
            stroke={color}
            strokeWidth={1}
            rx={3}
            opacity={0.3}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
      </g>
    );
  };

  // ── Tooltip renderer ──────────────────────────────────────────────────────────
  const renderTooltip = () => {
    if (!tooltip.visible || !tooltip.node) return null;
    const node = tooltip.node;
    const color = TYPE_COLOR[node.type] || '#fff';
    const lines: string[] = [
      node.description || '',
      ...(node.responsibilities?.slice(0, 4) ?? []),
      ...(node.endpoints?.slice(0, 3) ?? []),
    ].filter(Boolean);

    return (
      <div style={{
        position: 'absolute',
        left: tooltip.x, top: tooltip.y,
        background: 'rgba(5,5,5,0.97)',
        border: `1px solid ${color}40`,
        padding: '10px 14px',
        maxWidth: 320,
        zIndex: 200,
        pointerEvents: 'none',
        boxShadow: `0 4px 24px rgba(0,0,0,0.7), 0 0 1px ${color}60`,
      }}>
        <div style={{ fontSize: 9, color, letterSpacing: 2, marginBottom: 6 }}>
          {node.type.toUpperCase()} · {node.label}
        </div>
        {lines.map((l, i) => (
          <div key={i} style={{
            fontSize: 9, color: i === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.4)',
            marginBottom: 3, fontFamily: 'monospace', lineHeight: 1.5,
          }}>
            {i === 0 ? l : `· ${l}`}
          </div>
        ))}
        {node.dependencies && node.dependencies.length > 0 && (
          <div style={{ marginTop: 6, fontSize: 8, color: color, opacity: 0.6 }}>
            depends on: {node.dependencies.join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {(['standard', 'tree', 'spider'] as const).map(m => (
          <button
            key={m}
            onClick={() => setCanvasMode(m)}
            style={{
              background: canvasMode === m ? 'rgba(0,255,204,0.1)' : 'transparent',
              border: `1px solid ${canvasMode === m ? '#00ffcc' : 'rgba(255,255,255,0.1)'}`,
              color: canvasMode === m ? '#00ffcc' : 'rgba(255,255,255,0.35)',
              padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', transition: 'all 0.2s',
            }}>
            {m}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Node / edge count */}
        {canvasNodes.length > 0 && (
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5 }}>
            {canvasNodes.length} NODES · {canvasEdges.length} EDGES
          </span>
        )}

        <button
          onClick={() => setView({ x: 0, y: 0, scale: 1 })}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem' }}>
          RESET VIEW
        </button>

        {canvasNodes.length > 0 && (
          <button
            onClick={saveCanvas}
            style={{ background: 'transparent', border: '1px solid rgba(0,255,204,0.3)', color: '#00ffcc', padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: 1 }}>
            SAVE
          </button>
        )}
      </div>

      {/* ── SVG Canvas ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Empty state */}
        {canvasNodes.length === 0 && !isGenerating && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, pointerEvents: 'none' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.12)', letterSpacing: 4 }}>// CANVAS EMPTY</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>Describe your system below →</div>
          </div>
        )}

        {/* Status banner */}
        {status && (
          <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.92)', border: '1px solid rgba(0,255,204,0.3)', color: '#00ffcc', padding: '8px 22px', fontSize: '0.72rem', letterSpacing: 2, zIndex: 10, whiteSpace: 'nowrap' }}>
            {status}
          </div>
        )}

        <svg
          ref={svgRef}
          width="100%" height="100%"
          style={{ display: 'block', cursor: panning ? 'grabbing' : 'default' }}
          onMouseDown={onSVGMouseDown}
          onMouseMove={onSVGMouseMove}
          onMouseUp={onSVGMouseUp}
          onMouseLeave={onSVGMouseUp}
        >
          {/* Grid dots */}
          <defs>
            <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse" x={view.x % 40} y={view.y % 40}>
              <circle cx={1} cy={1} r={1} fill="rgba(255,255,255,0.035)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <g transform={`translate(${view.x},${view.y}) scale(${view.scale})`}>
            {/* Tier background labels */}
            {canvasNodes.length > 0 && [
              { y: 40,  label: 'CLIENT' },
              { y: 160, label: 'CDN / EXTERNAL' },
              { y: 280, label: 'GATEWAY' },
              { y: 400, label: 'SERVICES' },
              { y: 520, label: 'WORKERS' },
              { y: 640, label: 'CACHE / QUEUE' },
              { y: 760, label: 'DATA' },
              { y: 880, label: 'MONITORING' },
            ].map(t => (
              <text key={t.y} x={-10} y={t.y + 16} fill="rgba(255,255,255,0.04)" fontSize={9} fontFamily="monospace" letterSpacing={3} textAnchor="end">
                {t.label}
              </text>
            ))}

            {/* Edges first, nodes on top */}
            {canvasEdges.map(renderEdge)}
            {canvasNodes.map(renderNode)}
          </g>
        </svg>

        {/* Hover tooltip */}
        {renderTooltip()}

        {/* ── Node Editor Modal ── */}
        {editingNode && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', width: 420, maxHeight: '80vh', overflowY: 'auto', padding: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 20 }}>// EDIT NODE</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Label */}
                <Field label="LABEL">
                  <input value={editingNode.label} onChange={e => setEditingNode({ ...editingNode, label: e.target.value })} style={inputStyle} />
                </Field>

                {/* Tech */}
                <Field label="TECHNOLOGY">
                  <input value={editingNode.tech} onChange={e => setEditingNode({ ...editingNode, tech: e.target.value })} style={inputStyle} />
                </Field>

                {/* Description */}
                <Field label="DESCRIPTION">
                  <input value={editingNode.description} onChange={e => setEditingNode({ ...editingNode, description: e.target.value })} style={inputStyle} />
                </Field>

                {/* Type */}
                <Field label="TYPE">
                  <select value={editingNode.type} onChange={e => setEditingNode({ ...editingNode, type: e.target.value as CanvasNode['type'] })} style={inputStyle}>
                    {Object.keys(TYPE_COLOR).filter(t => t !== 'api').map(t => (
                      <option key={t} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                </Field>

                {/* Scale */}
                <Field label="SCALE">
                  <select value={editingNode.scale || 'horizontal'} onChange={e => setEditingNode({ ...editingNode, scale: e.target.value as CanvasNode['scale'] })} style={inputStyle}>
                    <option value="horizontal">HORIZONTAL</option>
                    <option value="vertical">VERTICAL</option>
                    <option value="fixed">FIXED</option>
                  </select>
                </Field>

                {/* Replicas */}
                <Field label="REPLICAS">
                  <input type="number" min={1} value={editingNode.replicas ?? 1} onChange={e => setEditingNode({ ...editingNode, replicas: parseInt(e.target.value) || 1 })} style={inputStyle} />
                </Field>

                {/* Responsibilities */}
                <Field label="RESPONSIBILITIES">
                  <textarea
                    value={(editingNode.responsibilities ?? []).join('\n')}
                    onChange={e => setEditingNode({ ...editingNode, responsibilities: e.target.value.split('\n').filter(Boolean) })}
                    rows={4}
                    placeholder="One per line…"
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </Field>

                {/* Endpoints */}
                <Field label="ENDPOINTS">
                  <textarea
                    value={(editingNode.endpoints ?? []).join('\n')}
                    onChange={e => setEditingNode({ ...editingNode, endpoints: e.target.value.split('\n').filter(Boolean) })}
                    rows={3}
                    placeholder="One per line…"
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                <button onClick={() => handleDeleteNode(editingNode.id)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,20,147,0.4)', color: '#ff1493', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>DELETE</button>
                <div style={{ flex: 1 }} />
                <button onClick={() => setEditingNode(null)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '0.72rem' }}>CANCEL</button>
                <button onClick={() => handleUpdateNode(editingNode)} style={{ padding: '10px 22px', background: '#00ffcc', border: 'none', color: '#000', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>SAVE</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Prompt Bar ── */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#050505', flexShrink: 0 }}>

        {/* Suggestions (only when canvas is empty) */}
        {canvasNodes.length === 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s.prompt)}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)', padding: '6px 14px', borderRadius: 3, cursor: 'pointer', fontSize: '0.68rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(0,255,204,0.35)'; b.style.color = '#00ffcc'; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(255,255,255,0.07)'; b.style.color = 'rgba(255,255,255,0.35)'; }}
              >
                + {s.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="Describe your architecture… (e.g. e-commerce with auth, products, cart, payment, email notifications)"
            disabled={isGenerating}
            style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', fontFamily: 'inherit', fontSize: '0.84rem', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,255,204,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{
              background: isGenerating ? 'transparent' : '#00ffcc',
              color: isGenerating ? 'rgba(0,255,204,0.5)' : '#000',
              border: `1px solid ${isGenerating ? 'rgba(0,255,204,0.3)' : '#00ffcc'}`,
              padding: '12px 26px', cursor: isGenerating ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700,
              letterSpacing: 1, transition: 'all 0.2s', opacity: isGenerating ? 0.6 : 1,
            }}
          >
            {isGenerating ? 'GENERATING…' : 'GENERATE'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Small helpers ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  padding: '8px 12px',
  fontSize: '0.83rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', letterSpacing: 2, marginBottom: 6 }}>
      {label}
    </label>
    {children}
  </div>
);
