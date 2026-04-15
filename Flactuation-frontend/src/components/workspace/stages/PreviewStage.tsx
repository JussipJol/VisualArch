import React, { useEffect, useState } from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react';
import { useWorkspaceStore } from '../../../stores/workspace.store';
import { api } from '../../../api/client';
import { useSSE } from '../../../hooks/useSSE';

interface CodeFile { path: string; content: string; language: string }

const DEFAULT_FILES: Record<string, string> = {
  '/App.jsx': `export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <h1 style={{ color: '#6366f1' }}>VisualFlow AI</h1>
      <p style={{ color: '#94a3b8' }}>Generate your code in the IDE stage →</p>
    </div>
  );
}`,
  '/index.js': `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
};

export const PreviewStage = ({ projectId }: { projectId: string }) => {
  const { codeFiles, codeId, setCode, isGenerating, setGenerating } = useWorkspaceStore();
  const { stream } = useSSE();
  const [sandpackFiles, setSandpackFiles] = useState<Record<string, string>>(DEFAULT_FILES);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Try to load existing code
    if (codeId) {
      loadAllFiles();
    } else {
      api.get(`/projects/${projectId}/code`).then(async ({ data }) => {
        if (data.files && data.files.length > 0) {
          setCode(data.files, data.codeId?.toString() || '');
          await loadAllFiles(data.codeId?.toString());
        }
      }).catch(() => {});
    }
  }, [projectId]);

  const loadAllFiles = async (id?: string) => {
    const codeIdToUse = id || codeId;
    if (!codeIdToUse && codeFiles.length === 0) return;

    try {
      const fileContents: Record<string, string> = {};
      // Load more files for a better preview experience
      for (const f of codeFiles.slice(0, 30)) {
        try {
          const { data } = await api.get(`/projects/${projectId}/code/file?path=${encodeURIComponent(f.path)}`);
          if (data.file?.content) {
            // Normalize path for Sandpack (needs leading /)
            const sandpackPath = f.path.startsWith('/') ? f.path : `/${f.path}`;
            fileContents[sandpackPath] = data.file.content;
          }
        } catch { /* skip */ }
      }
      if (Object.keys(fileContents).length > 0) {
        setSandpackFiles(prev => ({ ...prev, ...fileContents }));
      }
    } catch { /* use defaults */ }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenerating(true, 'preview');
    setProgress([]);
    setStatus('Initializing...');

    await stream(`/projects/${projectId}/code/generate`, { prompt: '' }, {
      onProgress: (stage, file) => {
        const msg = file ? `${stage}: ${file}` : stage;
        setProgress(p => [...p.slice(-8), msg]);
        setStatus(msg);
      },
      onChunk: () => {},
      onStatus: msg => setStatus(msg),
      onDone: async (data: any) => {
        setStatus('Syncing workspace...');
        if (data.files) {
          setCode(data.files, data.codeId || '');
          // Trigger file loader for background preview enrichment
          loadAllFiles(data.codeId);
        } else {
          // Fallback to manual fetch if message was partial
          const { data: codeData } = await api.get(`/projects/${projectId}/code`);
          if (codeData.files) setCode(codeData.files, codeData.codeId?.toString() || '');
        }
        setStatus('');
        setGenerating(false);
      },
      onError: msg => { setStatus(`Error: ${msg}`); setGenerating(false); },
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, background: '#0a0a0a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: '0.65rem', color: '#10b981', letterSpacing: 1, fontWeight: 600 }}>LOCALHOST:5173</span>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowCode(!showCode)} style={{ background: showCode ? 'rgba(59,130,246,0.1)' : 'transparent', border: `1px solid ${showCode ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, color: showCode ? '#60a5fa' : 'rgba(255,255,255,0.4)', padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: 2, transition: 'all 0.2s' }}>
          {showCode ? 'HIDE SOURCE' : 'VIEW SOURCE'}
        </button>
        <button onClick={handleGenerate} disabled={isGenerating} style={{ background: isGenerating ? 'transparent' : '#3b82f6', color: '#fff', border: `1px solid ${isGenerating ? 'rgba(59,130,246,0.3)' : '#3b82f6'}`, padding: '8px 20px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, opacity: isGenerating ? 0.6 : 1, transition: 'all 0.2s' }}>
          {isGenerating ? 'GENERATING...' : 'FORCE REFRESH'}
        </button>
      </div>

      {/* Progress log */}
      {isGenerating && progress.length > 0 && (
        <div style={{ padding: '8px 20px', background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid rgba(59,130,246,0.15)', maxHeight: 80, overflowY: 'auto' }}>
          {progress.map((p, i) => (
            <div key={i} style={{ fontSize: '0.65rem', color: i === progress.length - 1 ? '#60a5fa' : 'rgba(255,255,255,0.25)', letterSpacing: 1, lineHeight: '1.6' }}>{p}</div>
          ))}
        </div>
      )}

      {/* Sandpack */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <SandpackProvider
          template="react"
          files={sandpackFiles}
          theme="dark"
          options={{ externalResources: ['https://cdn.tailwindcss.com'] }}
        >
          <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0 }}>
            {showCode && <SandpackCodeEditor style={{ height: '100%' }} showLineNumbers showInlineErrors />}
            <SandpackPreview style={{ height: '100%' }} showNavigator />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};
