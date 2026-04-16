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
  const { chatMessages, addMessage, currentStage, isGenerating, canvasNodes, canvasMode } = useWorkspaceStore();
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

    // Only modify canvas if we're on the canvas stage
    if (currentStage !== 'canvas') {
      await new Promise(r => setTimeout(r, 400));
      addMessage({ role: 'assistant', content: `I can modify your architecture on the Canvas stage. Switch to Canvas to make structural changes, or use the stage tools directly for ${currentStage}.` });
      setStreaming(false);
      return;
    }

    let full = '';
    await stream(`/projects/${projectId}/canvas/generate`, { prompt: msg, mode: canvasMode }, {
      onChunk: (chunk) => {
        full += chunk;
        setStreamBuffer(full);
      },
      onDone: (data) => {
        const iter = data.iteration as { nodes: unknown[] } | undefined;
        if (iter?.nodes) {
          addMessage({ role: 'assistant', content: `Architecture updated with ${iter.nodes.length} nodes.` });
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {chatMessages.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', lineHeight: 1.6 }}>
            Describe your system and I'll generate the architecture, design, data, and code.
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '85%', padding: '10px 14px', background: msg.role === 'user' ? 'rgba(255,255,255,0.07)' : 'rgba(0,255,204,0.06)', border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,204,0.15)'}`, fontSize: '0.8rem', lineHeight: 1.55, color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.75)' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {streamBuffer && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ maxWidth: '85%', padding: '10px 14px', background: 'rgba(0,255,204,0.06)', border: '1px solid rgba(0,255,204,0.15)', fontSize: '0.8rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.75)' }}>
              {streamBuffer}
              <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>▋</span>
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

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask AI..."
          disabled={streaming || isGenerating}
          style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 12px', fontFamily: 'inherit', fontSize: '0.8rem', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = 'rgba(0,255,204,0.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        <button onClick={() => handleSend()} disabled={!input.trim() || streaming || isGenerating} style={{ background: '#00ffcc', color: '#000', border: 'none', padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700, opacity: (!input.trim() || streaming || isGenerating) ? 0.4 : 1, transition: 'all 0.2s' }}>
          →
        </button>
      </div>
    </div>
  );
};
