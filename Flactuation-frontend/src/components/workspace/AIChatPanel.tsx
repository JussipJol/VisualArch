import React, { useRef, useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../stores/workspace.store';
import { useSSE } from '../../hooks/useSSE';

const SUGGESTIONS: Record<string, string[]> = {
  canvas: [
    'Add Redis caching layer',
    'Include authentication service',
    'Add message queue for async tasks',
  ],
  design: [
    'Generate design system',
    'Create dark theme variant',
    'Add mobile breakpoints',
  ],
  data: [
    'Generate test dataset',
    'Add 200 records',
    'Export as SQL',
  ],
  preview: [
    'Generate full stack preview',
    'Add CRUD operations',
    'Include authentication flow',
  ],
  ide: [
    'Download project ZIP',
    'Show project structure',
    'Add README documentation',
  ],
};

export const AIChatPanel = ({ projectId }: { projectId: string }) => {
  const { chatMessages, addMessage, currentStage, isGenerating, canvasNodes } = useWorkspaceStore();
  const { stream } = useSSE();
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, streamBuffer]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || streaming || isGenerating) return;
    setInput('');
    addMessage({ role: 'user', content: msg });
    setStreaming(true);
    setStreamBuffer('');

    const systemContext = `You are the VisualFlow AI assistant. Current stage: ${currentStage}. Canvas has ${canvasNodes.length} nodes. Help the user with their project.`;

    let full = '';
    await stream(`/projects/${projectId}/canvas/generate`, { prompt: msg, mode: 'standard' }, {
      onChunk: (chunk) => {
        full += chunk;
        setStreamBuffer(full);
      },
      onDone: (data) => {
        const iter = data.iteration as { nodes: unknown[] } | undefined;
        if (iter?.nodes) {
          addMessage({ role: 'assistant', content: `Generated ${iter.nodes.length} nodes for your architecture.` });
        } else {
          addMessage({ role: 'assistant', content: full || 'Architecture updated.' });
        }
        setStreamBuffer('');
        setStreaming(false);
      },
      onError: (err) => {
        addMessage({ role: 'assistant', content: `Error: ${err}` });
        setStreamBuffer('');
        setStreaming(false);
      },
    });
  };

  const suggestions = SUGGESTIONS[currentStage] || [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: 4, marginBottom: 4 }}>// AI ASSISTANT</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ffcc', boxShadow: '0 0 6px #00ffcc' }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>FLACT_MODEL_v1</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {chatMessages.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.72rem', lineHeight: 1.8, fontFamily: '"Space Mono", monospace' }}>
            <span style={{ color: 'rgba(0,255,204,0.4)' }}>$</span> waiting for input...
            <br />
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>// Describe your system and I{'"'}ll generate{"\n"}the architecture, design, data, and code.</span>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ fontSize: '0.58rem', color: 'rgba(0,255,204,0.4)', letterSpacing: 2, marginBottom: 3 }}>FLACT_MODEL_v1</div>
            )}
            <div style={{
              maxWidth: '88%',
              padding: msg.role === 'user' ? '9px 13px' : '10px 14px',
              background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.09)' : 'rgba(0,255,204,0.12)'}`,
              borderLeft: msg.role === 'assistant' ? '2px solid rgba(0,255,204,0.4)' : undefined,
              fontSize: '0.78rem',
              lineHeight: 1.65,
              color: msg.role === 'user' ? 'rgba(255,255,255,0.75)' : 'rgba(200,255,240,0.8)',
              fontFamily: msg.role === 'assistant' ? '"Space Mono", monospace' : 'inherit',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {streamBuffer && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.58rem', color: 'rgba(0,255,204,0.4)', letterSpacing: 2, marginBottom: 3 }}>FLACT_MODEL_v1</div>
            <div style={{ maxWidth: '88%', padding: '10px 14px', background: 'transparent', border: '1px solid rgba(0,255,204,0.12)', borderLeft: '2px solid rgba(0,255,204,0.4)', fontSize: '0.78rem', lineHeight: 1.65, color: 'rgba(200,255,240,0.8)', fontFamily: '"Space Mono", monospace' }}>
              {streamBuffer}
              <span style={{ opacity: 0.7, animation: 'blink 1s infinite' }}>▋</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Smart Suggestions */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 3, marginBottom: 8 }}>SUGGESTIONS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => handleSend(s)} disabled={streaming || isGenerating} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', padding: '7px 10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', textAlign: 'left', transition: 'all 0.15s', opacity: (streaming || isGenerating) ? 0.4 : 1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,255,204,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#00ffcc'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}>
              → {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input — terminal style */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', transition: 'border-color 0.2s' }}
          onFocus={() => {}}
        >
          <span style={{ padding: '10px 10px 10px 12px', color: 'rgba(0,255,204,0.6)', fontSize: '0.8rem', fontFamily: '"Space Mono", monospace', userSelect: 'none', flexShrink: 0 }}>$</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="ask ai..."
            disabled={streaming || isGenerating}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '10px 0', fontFamily: '"Space Mono", monospace', fontSize: '0.78rem', outline: 'none', letterSpacing: 0.3 }}
            onFocus={e => { (e.target.parentElement as HTMLDivElement).style.borderColor = 'rgba(0,255,204,0.4)'; }}
            onBlur={e => { (e.target.parentElement as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || streaming || isGenerating}
            style={{ background: 'transparent', color: input.trim() && !streaming && !isGenerating ? '#00ffcc' : 'rgba(255,255,255,0.2)', border: 'none', padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 700, transition: 'color 0.2s', flexShrink: 0 }}
          >
            ↵
          </button>
        </div>
      </div>
    </div>
  );
};
