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
  style?: {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    color?: string;
    isGlass?: boolean;
    opacity?: number;
  };
}

interface WfTheme {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  borderRadius: number;
  fontFamily: string;
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

const getBaseStyle = (type: string, theme: WfTheme) => {
  const styles: Record<string, { bg: string; border: string; borderStyle?: string }> = {
    navbar:    { bg: 'rgba(15,23,42,0.8)', border: 'rgba(255,255,255,0.1)' },
    sidebar:   { bg: 'rgba(15,23,42,0.9)', border: 'rgba(255,255,255,0.1)' },
    card:      { bg: theme.surface, border: 'rgba(255,255,255,0.1)' },
    button:    { bg: theme.primary, border: 'transparent' },
    input:     { bg: 'rgba(0,0,0,0.2)', border: 'rgba(255,255,255,0.1)' },
    text:      { bg: 'transparent', border: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' },
    image:     { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.1)' },
    table:     { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.08)' },
    chart:     { bg: 'transparent', border: 'transparent' },
    modal:     { bg: '#1e293b', border: theme.accent },
    hero:      { bg: 'transparent', border: 'transparent' },
  };
  return styles[type] ?? { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
};

// Deterministic hash so patterns don't change on re-render
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  return h;
};

const CHART_BARS = [0.42, 0.68, 0.55, 0.82, 0.61, 0.74, 0.50, 0.70];

const ElementFill = ({ el, theme }: { el: WfElement, theme: WfTheme }) => {
  const { type, width: w, height: h, id, style } = el;
  const accent = style?.color || theme.accent;

  if (type === 'image') {
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <line x1={0} y1={0} x2={w} y2={h} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <line x1={w} y1={0} x2={0} y2={h} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <rect x={w / 2 - 16} y={h / 2 - 12} width={32} height={24} rx={3} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
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
        {Array.from({ length: barCount }).map((_, i) => {
          const barH = CHART_BARS[(seed + i) % CHART_BARS.length] * maxH;
          return (
            <rect
              key={i}
              x={24 + i * (barW + 6)}
              y={h - 20 - barH}
              width={barW}
              height={barH}
              fill={i % 2 === 0 ? accent : theme.primary}
              opacity={0.6}
              rx={4}
            />
          );
        })}
        <path
          d={Array.from({ length: barCount }).map((_, i) => {
            const bh = CHART_BARS[(seed + i) % CHART_BARS.length] * maxH;
            const cx = 24 + i * (barW + 6) + barW / 2;
            return `${i === 0 ? 'M' : 'L'} ${cx} ${h - 20 - bh}`;
          }).join(' ')}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          filter="drop-shadow(0 0 4px rgba(0,242,255,0.3))"
        />
      </svg>
    );
  }

  if (type === 'table') {
    const rows = Math.max(2, Math.floor(h / 32));
    const rowH = h / rows;
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <rect x={0} y={0} width={w} height={rowH} fill="rgba(255,255,255,0.05)" />
        {Array.from({ length: rows }).map((_, i) => (
          <line key={i} x1={0} y1={i * rowH} x2={w} y2={i * rowH} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        ))}
        {Array.from({ length: Math.min(rows - 1, 6) }).map((_, ri) => (
          <rect key={ri} x={16} y={(ri + 1) * rowH + 12} width={w * 0.4} height={8} fill="rgba(255,255,255,0.1)" rx={2} />
        ))}
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
        <rect x={20} y={h/2 - 10} width={20} height={20} fill={accent} rx={4} />
        {[100, 180, 260].map((x, i) => (
          <rect key={i} x={x} y={h/2 - 4} width={50} height={8} fill="rgba(255,255,255,0.2)" rx={2} />
        ))}
        <circle cx={w - 30} cy={h/2} r={12} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" />
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
        <rect x={20} y={20} width={w * 0.4} height={12} fill="rgba(255,255,255,0.15)" rx={2} />
        <rect x={20} y={44} width={w - 40} height={8} fill="rgba(255,255,255,0.05)" rx={2} />
        <rect x={20} y={58} width={w - 80} height={8} fill="rgba(255,255,255,0.05)" rx={2} />
        <rect x={20} y={h - 36} width={100} height={24} fill="rgba(255,255,255,0.08)" rx={4} />
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
  theme: WfTheme;
  onSelect: (id: string | null) => void;
  onChange: (elements: WfElement[]) => void;
  onLabelEdit: (id: string) => void;
}

export const WireframeCanvas = ({ elements, selectedId, scale, theme, onSelect, onChange, onLabelEdit }: Props) => {
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
        background: theme.background,
        position: 'relative',
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}
    >
      {/* Dot grid */}
      <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <pattern id="wf-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#wf-dots)" />
      </svg>

      {/* Ruler guides at 0 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 1, background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />

      {elements.map(el => {
        const s = getBaseStyle(el.type, theme);
        const isSelected = el.id === selectedId;
        const fontSize = Math.max(9, Math.min(13, el.height * 0.16, el.width * 0.1));
        const isGlass = el.style?.isGlass !== false;
        const customColor = el.style?.color;

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
              background: isGlass ? (el.type === 'button' ? (customColor || theme.primary) : theme.surface) : (customColor || s.bg),
              border: `${isSelected ? 2 : 1}px ${s.borderStyle || 'solid'} ${isSelected ? theme.accent : (customColor || s.border)}`,
              borderRadius: theme.borderRadius,
              boxSizing: 'border-box',
              cursor: dragRef.current?.mode === 'move' ? 'grabbing' : 'grab',
              overflow: 'hidden',
              boxShadow: isSelected ? `0 0 20px ${theme.accent}44` : '0 4px 12px rgba(0,0,0,0.2)',
              backdropFilter: isGlass ? 'blur(8px)' : 'none',
              zIndex: isSelected ? 50 : 1,
            }}
          >
            <ElementFill el={el} theme={theme} />

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
              color: el.type === 'button' ? '#fff' : theme.text,
              fontFamily: theme.fontFamily,
              fontWeight: 600,
              textAlign: 'center',
              pointerEvents: 'none',
              padding: '14px 8px 4px',
              lineHeight: 1.3,
              textShadow: el.type === 'button' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
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
