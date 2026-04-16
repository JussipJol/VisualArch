import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useWorkspaceStore } from '../../../stores/workspace.store';
import { useSSE } from '../../../hooks/useSSE';
import { api } from '../../../api/client';
import { WireframeCanvas, CANVAS_W, CANVAS_H } from '../WireframeCanvas';
import type { WfElement } from '../WireframeCanvas';

interface WireframeScreen {
  id: string;
  name: string;
  path: string;
  elements: WfElement[];
}

interface WireframeData {
  screens: WireframeScreen[];
}

const ELEMENT_TYPES = [
  'navbar', 'sidebar', 'card', 'button', 'input',
  'text', 'image', 'table', 'chart', 'list',
  'form', 'hero', 'footer', 'container', 'badge', 'modal',
] as const;

const TYPE_DEFAULTS: Record<string, { width: number; height: number }> = {
  navbar:    { width: 1280, height: 60 },
  sidebar:   { width: 220,  height: 400 },
  card:      { width: 260,  height: 130 },
  button:    { width: 130,  height: 42 },
  input:     { width: 280,  height: 44 },
  text:      { width: 320,  height: 48 },
  image:     { width: 320,  height: 200 },
  table:     { width: 600,  height: 200 },
  chart:     { width: 400,  height: 220 },
  list:      { width: 260,  height: 200 },
  form:      { width: 360,  height: 280 },
  hero:      { width: 1000, height: 360 },
  footer:    { width: 1280, height: 80 },
  container: { width: 400,  height: 300 },
  badge:     { width: 80,   height: 28 },
  modal:     { width: 520,  height: 380 },
};

let nextId = Date.now();
const uid = () => `el-${++nextId}`;

const DEFAULT_THEME = {
  primary: '#6366F1',
  accent: '#00f2ff',
  background: '#020617',
  surface: 'rgba(30,41,59,0.7)',
  text: '#F8FAFC',
  borderRadius: 12,
  fontFamily: 'Inter',
};

export const DesignStage = ({ projectId }: { projectId: string }) => {
  const { design, setDesign, isGenerating, setGenerating, setStage, setCode } = useWorkspaceStore();
  const { stream } = useSSE();

  const [status, setStatus] = useState('');
  const [screens, setScreens] = useState<WireframeScreen[]>([]);
  const [activeScreenIdx, setActiveScreenIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scale, setScale] = useState(0.6);
  const [zoom, setZoom] = useState(60);
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const containerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Parse design data from store
  const parseDesign = useCallback((data: Record<string, unknown>) => {
    const d = data as any;
    if (d.screens && Array.isArray(d.screens) && d.screens.length > 0) {
      setScreens(d.screens);
      setActiveScreenIdx(0);
      setSelectedId(null);
    }
    if (d.theme) {
      setTheme({ ...DEFAULT_THEME, ...d.theme });
    }
  }, []);

  useEffect(() => {
    api.get(`/projects/${projectId}/design`).then(({ data }) => {
      if (data.design) {
        setDesign(data.design as Record<string, unknown>);
        parseDesign(data.design as Record<string, unknown>);
      }
    }).catch(() => {});
  }, [projectId]);

  useEffect(() => {
    if (design) parseDesign(design);
  }, [design]);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenerating(true, 'design');
    setStatus('Analyzing architecture...');
    setSelectedId(null);

    await stream(`/projects/${projectId}/design/generate`, {}, {
      onStatus: msg => setStatus(msg),
      onChunk: () => {},
      onDone: data => {
        if (data.design) {
          setDesign(data.design as Record<string, unknown>);
          parseDesign(data.design as Record<string, unknown>);
        }
        setStatus('');
        setGenerating(false);
      },
      onError: msg => { setStatus(`Error: ${msg}`); setGenerating(false); },
    });
  };

  const handleGenerateCode = async () => {
    if (isGenerating) return;
    setGenerating(true, 'code');
    setStatus('Saving design tokens...');

    try {
      // Save the current wireframe as designSystem so codeGen can read it
      const designPayload = { screens, theme: (design as any)?.theme || null };
      await api.patch(`/projects/${projectId}`, { designSystem: designPayload });

      setStatus('Design saved. Generating code...');

      await stream(`/projects/${projectId}/code/generate`, { prompt: '', designSystem: designPayload }, {
        onStatus: msg => setStatus(msg),
        onProgress: (stage, file) => setStatus(`${stage}: ${file || '...'}`),
        onDone: async (data: any) => {
          if (data.files) setCode(data.files, data.codeId || '');
          setStatus('');
          setGenerating(false);
          setStage('preview');
        },
        onError: msg => { setStatus(`Error: ${msg}`); setGenerating(false); },
      });
    } catch (err) {
      setStatus('Failed to save design');
      setGenerating(false);
    }
  };

  const activeScreen = screens[activeScreenIdx] ?? null;

  const updateElements = (elements: WfElement[]) => {
    setScreens(prev => prev.map((s, i) => i === activeScreenIdx ? { ...s, elements } : s));
  };

  const addElement = (type: string) => {
    const defaults = TYPE_DEFAULTS[type] ?? { width: 200, height: 100 };
    const newEl: WfElement = {
      id: uid(),
      type,
      x: Math.round((CANVAS_W / 2 - defaults.width / 2) / 8) * 8,
      y: Math.round((CANVAS_H / 2 - defaults.height / 2) / 8) * 8,
      width: defaults.width,
      height: defaults.height,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };
    updateElements([...(activeScreen?.elements ?? []), newEl]);
    setSelectedId(newEl.id);
  };

  const deleteSelected = () => {
    if (!selectedId || !activeScreen) return;
    updateElements(activeScreen.elements.filter(e => e.id !== selectedId));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selectedId || !activeScreen) return;
    const el = activeScreen.elements.find(e => e.id === selectedId);
    if (!el) return;
    const dup = { ...el, id: uid(), x: el.x + 20, y: el.y + 20 };
    updateElements([...activeScreen.elements, dup]);
    setSelectedId(dup.id);
  };

  const addScreen = () => {
    const newScreen: WireframeScreen = {
      id: `screen-${uid()}`,
      name: `Screen ${screens.length + 1}`,
      path: `/screen-${screens.length + 1}`,
      elements: [],
    };
    setScreens(prev => [...prev, newScreen]);
    setActiveScreenIdx(screens.length);
    setSelectedId(null);
  };

  const deleteScreen = (idx: number) => {
    if (screens.length <= 1) return;
    setScreens(prev => prev.filter((_, i) => i !== idx));
    setActiveScreenIdx(Math.max(0, idx - 1));
    setSelectedId(null);
  };

  const selectedEl = activeScreen?.elements.find(e => e.id === selectedId) ?? null;

  const updateSelectedProp = (key: keyof WfElement, value: string | number) => {
    if (!selectedId || !activeScreen) return;
    updateElements(activeScreen.elements.map(e =>
      e.id === selectedId ? { ...e, [key]: value } : e
    ));
  };

  const applyZoom = (z: number) => {
    const clamped = Math.max(25, Math.min(150, z));
    setZoom(clamped);
    setScale(clamped / 100);
  };

  const isOldFormat = design && 'colorPalette' in design && !('screens' in design && (design.screens as WireframeScreen[])?.[0]?.elements);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Top toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d', flexShrink: 0 }}>

        {/* Zoom controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
          <button onClick={() => applyZoom(zoom - 10)} style={btnSm}>−</button>
          <span style={{ fontSize: 11, color: '#888', minWidth: 34, textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => applyZoom(zoom + 10)} style={btnSm}>+</button>
          <button onClick={() => applyZoom(60)} style={{ ...btnSm, marginLeft: 2, fontSize: 9, letterSpacing: 0.5 }}>FIT</button>
        </div>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

        {/* Add element buttons */}
        {activeScreen && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 1 }}>
            {ELEMENT_TYPES.map(t => (
              <button key={t} onClick={() => addElement(t)} style={btnAdd} title={`Add ${t}`}>
                {t}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
          {selectedEl && (
            <>
              <button onClick={duplicateSelected} style={btnAction}>DUPLICATE</button>
              <button onClick={deleteSelected} style={{ ...btnAction, borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}>DELETE</button>
            </>
          )}
          <button onClick={handleGenerate} disabled={isGenerating} style={btnGenerate}>
            {isGenerating && screens.length === 0 ? 'GENERATING...' : screens.length > 0 ? 'REGENERATE' : 'GENERATE WIREFRAME'}
          </button>
          {screens.length > 0 && (
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              style={{ ...btnGenerate, background: isGenerating ? 'transparent' : '#00ffcc', color: isGenerating ? 'rgba(0,255,204,0.5)' : '#000', borderColor: '#00ffcc', opacity: isGenerating ? 0.5 : 1 }}
            >
              {isGenerating ? 'GENERATING...' : 'GENERATE CODE →'}
            </button>
          )}
        </div>
      </div>

      {/* Status bar */}
      {status && (
        <div style={{ padding: '7px 16px', background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.2)', fontSize: 11, color: '#a78bfa', letterSpacing: 1.5 }}>
          {status}
        </div>
      )}

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: Screens + Layers ── */}
        <div style={{ width: 168, background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

          {/* Screens */}
          <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase' }}>Screens</span>
              <button onClick={addScreen} style={{ ...btnSm, fontSize: 14, padding: '0 4px', lineHeight: 1 }} title="Add screen">+</button>
            </div>
            {screens.map((s, idx) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <button
                  onClick={() => { setActiveScreenIdx(idx); setSelectedId(null); }}
                  style={{
                    flex: 1, textAlign: 'left', background: idx === activeScreenIdx ? 'rgba(59,130,246,0.15)' : 'transparent',
                    border: `1px solid ${idx === activeScreenIdx ? 'rgba(59,130,246,0.4)' : 'transparent'}`,
                    color: idx === activeScreenIdx ? '#93c5fd' : '#777',
                    padding: '5px 8px', cursor: 'pointer', fontSize: 11,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                  }}
                >
                  {s.name}
                </button>
                {screens.length > 1 && (
                  <button onClick={() => deleteScreen(idx)} style={{ ...btnSm, color: '#555', padding: '2px 4px', fontSize: 11 }}>×</button>
                )}
              </div>
            ))}
          </div>

          {/* Layers */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Layers</div>
            {activeScreen?.elements.length === 0 && (
              <div style={{ fontSize: 10, color: '#3a3a3a', textAlign: 'center', marginTop: 20 }}>No elements</div>
            )}
            {[...(activeScreen?.elements ?? [])].reverse().map(el => (
              <button
                key={el.id}
                onClick={() => setSelectedId(el.id === selectedId ? null : el.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: el.id === selectedId ? 'rgba(59,130,246,0.12)' : 'transparent',
                  border: `1px solid ${el.id === selectedId ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                  color: el.id === selectedId ? '#93c5fd' : '#666',
                  padding: '4px 8px', cursor: 'pointer', marginBottom: 2,
                  fontSize: 10, fontFamily: 'inherit',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: '#444', marginRight: 4, fontFamily: 'monospace', fontSize: 9 }}>{el.type}</span>
                {el.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Center: Canvas ── */}
        <div
          ref={containerRef}
          style={{ flex: 1, overflow: 'auto', background: '#1a1a1a', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 40 }}
        >
          {screens.length === 0 ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
              {isOldFormat && (
                <div style={{ padding: '10px 20px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#fbbf24', fontSize: 12, marginBottom: 8, textAlign: 'center', maxWidth: 380 }}>
                  Old design format detected. Regenerate to get an editable wireframe.
                </div>
              )}
              <div style={{ fontSize: 11, color: '#2a2a2a', letterSpacing: 4, textTransform: 'uppercase' }}>No wireframe yet</div>
              <div style={{ fontSize: 13, color: '#444' }}>Click "Generate Wireframe" to create a Figma-like layout from your architecture</div>
              <button onClick={handleGenerate} disabled={isGenerating} style={{ ...btnGenerate, padding: '12px 32px', fontSize: 13 }}>
                {isGenerating ? 'GENERATING...' : 'GENERATE WIREFRAME'}
              </button>
            </div>
          ) : (
            <div style={{
              width: CANVAS_W * scale,
              height: CANVAS_H * scale,
              flexShrink: 0,
              position: 'relative',
              boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
            }}>
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
                {activeScreen && (
                  <WireframeCanvas
                    elements={activeScreen.elements}
                    selectedId={selectedId}
                    scale={scale}
                    theme={theme}
                    onSelect={setSelectedId}
                    onChange={updateElements}
                    onLabelEdit={setEditingId}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Properties panel ── */}
        {selectedEl && (
          <div style={{ width: 220, background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Properties</div>

              {/* Type */}
              <div style={propRow}>
                <label style={propLabel}>Type</label>
                <select
                  value={selectedEl.type}
                  onChange={e => updateSelectedProp('type', e.target.value)}
                  style={propSelect}
                >
                  {ELEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Label */}
              <div style={propRow}>
                <label style={propLabel}>Label</label>
                <input
                  value={selectedEl.label}
                  onChange={e => updateSelectedProp('label', e.target.value)}
                  style={propInput}
                />
              </div>

              {/* Content */}
              <div style={propRow}>
                <label style={propLabel}>Content</label>
                <input
                  value={selectedEl.content ?? ''}
                  onChange={e => updateSelectedProp('content', e.target.value)}
                  style={propInput}
                  placeholder="Description..."
                />
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

              {/* Position */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {(['x', 'y', 'width', 'height'] as const).map(key => (
                  <div key={key}>
                    <label style={{ ...propLabel, display: 'block', marginBottom: 3 }}>{key}</label>
                    <input
                      type="number"
                      value={selectedEl[key] as number}
                      onChange={e => updateSelectedProp(key, parseInt(e.target.value) || 0)}
                      style={{ ...propInput, width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={duplicateSelected} style={{ ...btnAction, width: '100%', textAlign: 'center' }}>DUPLICATE</button>
                <button onClick={deleteSelected} style={{ ...btnAction, width: '100%', textAlign: 'center', borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}>
                  DELETE ELEMENT
                </button>
              </div>
            </div>

            {/* Keyboard hints */}
            <div style={{ padding: '10px 14px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 9, color: '#333', lineHeight: 1.8 }}>
                <div>Drag — move element</div>
                <div>Handles — resize</div>
                <div>Dbl-click — rename</div>
                <div>Del — remove selected</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inline label editor overlay */}
      {editingId && activeScreen && (() => {
        const el = activeScreen.elements.find(e => e.id === editingId);
        if (!el) return null;
        return (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.3)' }}
            onClick={() => setEditingId(null)}
          >
            <div
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#1a1a1a', border: '1px solid rgba(59,130,246,0.4)', padding: '20px 24px', minWidth: 300, boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, marginBottom: 10 }}>RENAME ELEMENT</div>
              <input
                ref={editInputRef}
                autoFocus
                defaultValue={el.label}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) updateElements(activeScreen.elements.map(x => x.id === editingId ? { ...x, label: val } : x));
                    setEditingId(null);
                  }
                  if (e.key === 'Escape') setEditingId(null);
                }}
                style={{ width: '100%', boxSizing: 'border-box', background: '#111', border: '1px solid rgba(59,130,246,0.4)', color: '#e5e5e5', padding: '8px 10px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
              />
              <div style={{ fontSize: 10, color: '#444', marginTop: 8 }}>Press Enter to confirm · Esc to cancel</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// ── Styles ──
const btnSm: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#888',
  padding: '3px 8px',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'inherit',
};

const btnAdd: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#666',
  padding: '3px 8px',
  cursor: 'pointer',
  fontSize: 10,
  letterSpacing: 0.5,
  fontFamily: 'monospace',
  transition: 'all 0.15s',
};

const btnAction: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#aaa',
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: 10,
  letterSpacing: 1,
  fontFamily: 'inherit',
};

const btnGenerate: React.CSSProperties = {
  background: '#3b82f6',
  color: '#fff',
  border: '1px solid #3b82f6',
  padding: '8px 18px',
  cursor: 'pointer',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1,
  fontFamily: 'inherit',
  opacity: 1,
};

const propRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 6,
  gap: 8,
};

const propLabel: React.CSSProperties = {
  fontSize: 10,
  color: '#555',
  width: 46,
  flexShrink: 0,
};

const propInput: React.CSSProperties = {
  flex: 1,
  background: '#111',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#ccc',
  padding: '4px 8px',
  fontSize: 11,
  fontFamily: 'inherit',
  outline: 'none',
};

const propSelect: React.CSSProperties = {
  flex: 1,
  background: '#111',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#ccc',
  padding: '4px 6px',
  fontSize: 11,
  fontFamily: 'inherit',
  outline: 'none',
};
