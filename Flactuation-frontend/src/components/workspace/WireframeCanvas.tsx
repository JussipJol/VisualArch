import React, { useRef } from 'react';

export interface WfElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  content?: string;
}

interface DragState {
  mode: 'move' | 'resize';
  elementId: string;
  startMX: number;
  startMY: number;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  handle?: string;
}

export const CANVAS_W = 1280;
export const CANVAS_H = 800;

const TYPE_STYLE: Record<string, { bg: string; border: string; dashed?: boolean }> = {
  navbar:    { bg: '#ebebeb', border: '#b0b0b0' },
  sidebar:   { bg: '#efefef', border: '#b8b8b8' },
  card:      { bg: '#f4f4f4', border: '#c8c8c8' },
  button:    { bg: '#d8d8d8', border: '#a0a0a0' },
  input:     { bg: '#ffffff', border: '#b0b0b0' },
  text:      { bg: 'transparent', border: '#d0d0d0', dashed: true },
  image:     { bg: '#e2e2e2', border: '#aaaaaa' },
  table:     { bg: '#f6f6f6', border: '#c0c0c0' },
  chart:     { bg: '#eef1f5', border: '#b8b8b8' },
  list:      { bg: '#f6f6f6', border: '#c0c0c0' },
  form:      { bg: '#fafafa', border: '#c0c0c0' },
  hero:      { bg: '#e4e4e4', border: '#aaaaaa' },
  footer:    { bg: '#ebebeb', border: '#b0b0b0' },
  container: { bg: 'rgba(0,0,0,0.015)', border: '#c8c8c8', dashed: true },
  badge:     { bg: '#d8d8d8', border: '#aaaaaa' },
  modal:     { bg: '#fafafa', border: '#888888' },
};

const getStyle = (type: string) => TYPE_STYLE[type] ?? { bg: '#f0f0f0', border: '#c0c0c0' };

// Deterministic hash so patterns don't change on re-render
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  return h;
};

const CHART_BARS = [0.42, 0.68, 0.55, 0.82, 0.61, 0.74, 0.50, 0.70];

const ElementFill = ({ el }: { el: WfElement }) => {
  const { type, width: w, height: h, id } = el;

  if (type === 'image') {
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <line x1={0} y1={0} x2={w} y2={h} stroke="#aaa" strokeWidth={1.5} />
        <line x1={w} y1={0} x2={0} y2={h} stroke="#aaa" strokeWidth={1.5} />
        <rect x={w / 2 - 16} y={h / 2 - 12} width={32} height={24} rx={3} fill="none" stroke="#aaa" strokeWidth={1.5} />
      </svg>
    );
  }

  if (type === 'chart') {
    const barCount = Math.min(8, Math.max(3, Math.floor(w / 60)));
    const barW = (w - 32) / barCount - 6;
    const maxH = h - 36;
    const seed = hash(id);
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {/* Axes */}
        <line x1={20} y1={10} x2={20} y2={h - 20} stroke="#bbb" strokeWidth={1} />
        <line x1={20} y1={h - 20} x2={w - 10} y2={h - 20} stroke="#bbb" strokeWidth={1} />
        {Array.from({ length: barCount }).map((_, i) => {
          const barH = CHART_BARS[(seed + i) % CHART_BARS.length] * maxH;
          return (
            <rect
              key={i}
              x={24 + i * (barW + 6)}
              y={h - 20 - barH}
              width={barW}
              height={barH}
              fill="#c8cdd6"
              rx={2}
            />
          );
        })}
        {/* Trend line */}
        <polyline
          fill="none"
          stroke="#9ca3af"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          points={Array.from({ length: barCount }).map((_, i) => {
            const bh = CHART_BARS[(seed + i) % CHART_BARS.length] * maxH;
            const cx = 24 + i * (barW + 6) + barW / 2;
            return `${cx},${h - 20 - bh}`;
          }).join(' ')}
        />
      </svg>
    );
  }

  if (type === 'table') {
    const rows = Math.max(2, Math.floor(h / 28));
    const cols = Math.max(2, Math.floor(w / 100));
    const rowH = h / rows;
    const colW = w / cols;
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {/* Header row */}
        <rect x={0} y={0} width={w} height={rowH} fill="rgba(0,0,0,0.06)" />
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line key={`r${i}`} x1={0} y1={i * rowH} x2={w} y2={i * rowH} stroke="#ccc" strokeWidth={0.75} />
        ))}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line key={`c${i}`} x1={i * colW} y1={0} x2={i * colW} y2={h} stroke="#ccc" strokeWidth={0.75} />
        ))}
        {/* Placeholder text lines */}
        {Array.from({ length: cols }).map((_, ci) =>
          Array.from({ length: Math.min(rows - 1, 5) }).map((_, ri) => (
            <rect
              key={`t${ci}${ri}`}
              x={ci * colW + 8}
              y={(ri + 1) * rowH + 8}
              width={colW * 0.6}
              height={6}
              fill="#d0d0d0"
              rx={2}
            />
          ))
        )}
      </svg>
    );
  }

  if (type === 'list') {
    const lineCount = Math.min(8, Math.max(2, Math.floor(h / 28)));
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: lineCount }).map((_, i) => (
          <g key={i}>
            <circle cx={14} cy={14 + i * 28} r={4} fill="#bbb" />
            <rect x={26} y={10 + i * 28} width={w * 0.55} height={8} fill="#d0d0d0" rx={2} />
            <rect x={26} y={22 + i * 28} width={w * 0.35} height={6} fill="#ddd" rx={2} />
          </g>
        ))}
      </svg>
    );
  }

  if (type === 'input') {
    return (
      <>
        <div style={{ position: 'absolute', bottom: 1, left: 8, right: 8, height: 1, background: '#bbb' }} />
        <svg width={16} height={16} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}>
          <path d="M3 8h10M8 3v10" stroke="#666" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </>
    );
  }

  if (type === 'navbar') {
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {/* Logo placeholder */}
        <rect x={16} y={h / 2 - 10} width={60} height={20} fill="#d0d0d0" rx={3} />
        {/* Nav links */}
        {[140, 210, 280, 350].map((x, i) => (
          <rect key={i} x={x} y={h / 2 - 8} width={50} height={16} fill="#d8d8d8" rx={2} />
        ))}
        {/* Avatar */}
        <circle cx={w - 30} cy={h / 2} r={14} fill="#d0d0d0" />
      </svg>
    );
  }

  if (type === 'sidebar') {
    const itemCount = Math.min(8, Math.max(3, Math.floor(h / 52)));
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <g key={i}>
            <rect x={16} y={16 + i * 52} width={16} height={16} fill="#c8c8c8" rx={3} />
            <rect x={40} y={20 + i * 52} width={w * 0.5} height={10} fill="#d0d0d0" rx={2} />
          </g>
        ))}
        <line x1={w - 1} y1={0} x2={w - 1} y2={h} stroke="#c8c8c8" strokeWidth={1} />
      </svg>
    );
  }

  if (type === 'hero') {
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <rect x={w / 2 - 120} y={h * 0.3} width={240} height={28} fill="#d0d0d0" rx={4} />
        <rect x={w / 2 - 80} y={h * 0.3 + 44} width={160} height={16} fill="#ddd" rx={3} />
        <rect x={w / 2 - 60} y={h * 0.3 + 80} width={120} height={36} fill="#c0c0c0" rx={4} />
      </svg>
    );
  }

  if (type === 'form') {
    const fieldCount = Math.min(5, Math.max(2, Math.floor(h / 60)));
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: fieldCount }).map((_, i) => (
          <g key={i}>
            <rect x={16} y={16 + i * 60} width={w * 0.35} height={10} fill="#d8d8d8" rx={2} />
            <rect x={16} y={32 + i * 60} width={w - 32} height={20} fill="none" stroke="#c0c0c0" strokeWidth={1} rx={3} />
          </g>
        ))}
        <rect x={16} y={h - 44} width={100} height={32} fill="#c0c0c0" rx={4} />
      </svg>
    );
  }

  if (type === 'card') {
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <rect x={16} y={14} width={w * 0.45} height={10} fill="#d8d8d8" rx={2} />
        <rect x={16} y={38} width={w * 0.55} height={24} fill="#c8c8c8" rx={3} />
        <rect x={16} y={h - 30} width={w * 0.4} height={10} fill="#ddd" rx={2} />
      </svg>
    );
  }

  if (type === 'button') {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '60%', height: 2, background: '#bbb', borderRadius: 1 }} />
      </div>
    );
  }

  if (type === 'modal') {
    return (
      <>
        {/* Modal header */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, borderBottom: '1px solid #e0e0e0', background: '#f2f2f2' }} />
        {/* Close button */}
        <svg width={16} height={16} style={{ position: 'absolute', top: 14, right: 14 }}>
          <path d="M3 3l10 10M13 3L3 13" stroke="#bbb" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </>
    );
  }

  return null;
};

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
type HandleDir = typeof HANDLES[number];

const HANDLE_POS: Record<HandleDir, [number, number]> = {
  nw: [0, 0], n: [0.5, 0], ne: [1, 0],
  e: [1, 0.5],
  se: [1, 1], s: [0.5, 1], sw: [0, 1],
  w: [0, 0.5],
};

const HANDLE_CURSOR: Record<HandleDir, string> = {
  nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
  e: 'e-resize',
  se: 'se-resize', s: 's-resize', sw: 'sw-resize',
  w: 'w-resize',
};

interface Props {
  elements: WfElement[];
  selectedId: string | null;
  scale: number;
  onSelect: (id: string | null) => void;
  onChange: (elements: WfElement[]) => void;
  onLabelEdit: (id: string) => void;
}

export const WireframeCanvas = ({ elements, selectedId, scale, onSelect, onChange, onLabelEdit }: Props) => {
  const dragRef = useRef<DragState | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const canvasCoords = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const onElementDown = (e: React.MouseEvent, el: WfElement) => {
    e.stopPropagation();
    onSelect(el.id);
    const { x, y } = canvasCoords(e);
    dragRef.current = {
      mode: 'move',
      elementId: el.id,
      startMX: x, startMY: y,
      startX: el.x, startY: el.y,
      startW: el.width, startH: el.height,
    };
  };

  const onHandleDown = (e: React.MouseEvent, el: WfElement, dir: HandleDir) => {
    e.stopPropagation();
    const { x, y } = canvasCoords(e);
    dragRef.current = {
      mode: 'resize',
      elementId: el.id,
      handle: dir,
      startMX: x, startMY: y,
      startX: el.x, startY: el.y,
      startW: el.width, startH: el.height,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const { x, y } = canvasCoords(e);
    const dx = x - d.startMX;
    const dy = y - d.startMY;

    onChange(elements.map(el => {
      if (el.id !== d.elementId) return el;
      if (d.mode === 'move') {
        return {
          ...el,
          x: Math.round(Math.max(0, Math.min(CANVAS_W - el.width, d.startX + dx))),
          y: Math.round(Math.max(0, Math.min(CANVAS_H - el.height, d.startY + dy))),
        };
      }
      // resize
      let { x: ex, y: ey, width: ew, height: eh } = { x: d.startX, y: d.startY, width: d.startW, height: d.startH };
      const h = d.handle!;
      if (h.includes('e')) ew = Math.max(40, d.startW + dx);
      if (h.includes('w')) { ew = Math.max(40, d.startW - dx); ex = d.startX + (d.startW - ew); }
      if (h.includes('s')) eh = Math.max(20, d.startH + dy);
      if (h.includes('n')) { eh = Math.max(20, d.startH - dy); ey = d.startY + (d.startH - eh); }
      return { ...el, x: Math.round(ex), y: Math.round(ey), width: Math.round(ew), height: Math.round(eh) };
    }));
  };

  const stopDrag = () => { dragRef.current = null; };

  return (
    <div
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onClick={() => onSelect(null)}
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        background: '#ffffff',
        position: 'relative',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Dot grid */}
      <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <pattern id="wf-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.8" fill="rgba(0,0,0,0.12)" />
          </pattern>
        </defs>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#wf-dots)" />
      </svg>

      {/* Ruler guides at 0 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 1, background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />

      {elements.map(el => {
        const s = getStyle(el.type);
        const isSelected = el.id === selectedId;
        const fontSize = Math.max(9, Math.min(13, el.height * 0.16, el.width * 0.1));

        return (
          <div
            key={el.id}
            onMouseDown={(e) => onElementDown(e, el)}
            onDoubleClick={(e) => { e.stopPropagation(); onLabelEdit(el.id); }}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              background: s.bg,
              border: `${isSelected ? 2 : 1}px ${s.dashed ? 'dashed' : 'solid'} ${isSelected ? '#3b82f6' : s.border}`,
              boxSizing: 'border-box',
              cursor: dragRef.current?.mode === 'move' ? 'grabbing' : 'grab',
              overflow: 'hidden',
              boxShadow: isSelected ? '0 0 0 2px rgba(59,130,246,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <ElementFill el={el} />

            {/* Type tag */}
            <div style={{
              position: 'absolute',
              top: 3,
              left: 5,
              fontSize: 8,
              color: '#aaa',
              fontFamily: 'monospace',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              pointerEvents: 'none',
              lineHeight: 1,
            }}>
              {el.type}
            </div>

            {/* Center label */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize,
              color: '#666',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 500,
              textAlign: 'center',
              pointerEvents: 'none',
              padding: '14px 8px 4px',
              lineHeight: 1.3,
            }}>
              {el.label}
            </div>

            {/* Resize handles */}
            {isSelected && HANDLES.map(dir => {
              const [fx, fy] = HANDLE_POS[dir];
              return (
                <div
                  key={dir}
                  onMouseDown={(e) => { e.stopPropagation(); onHandleDown(e, el, dir); }}
                  style={{
                    position: 'absolute',
                    left: fx * el.width - 5,
                    top: fy * el.height - 5,
                    width: 10,
                    height: 10,
                    background: '#fff',
                    border: '2px solid #3b82f6',
                    borderRadius: 2,
                    cursor: HANDLE_CURSOR[dir],
                    zIndex: 10,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
