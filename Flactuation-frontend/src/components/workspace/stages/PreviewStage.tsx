import React, { useEffect, useState, useRef } from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react';
import { useWorkspaceStore } from '../../../stores/workspace.store';
import { api } from '../../../api/client';
import { useSSE } from '../../../hooks/useSSE';

// Files that are NOT frontend React — skip them from the sandbox
const SKIP_PREFIXES = ['/server/', '/backend/'];
const SKIP_EXACT = ['/README.md', '/docker-compose.yml'];

const DEFAULT_SANDPACK_FILES: Record<string, string> = {
  '/index.html': `<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
  '/src/main.jsx': `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);`,
  '/src/App.jsx': `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui', background: '#0f172a', minHeight: '100vh', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#6366f1', marginBottom: 12, fontSize: '2rem' }}>VisualFlow AI</h1>
        <p style={{ color: '#94a3b8' }}>Generate your code using the Generate button above →</p>
      </div>
    </div>
  );
}`,
  '/package.json': JSON.stringify({
    scripts: {
      dev: "vite"
    },
    dependencies: {
      react: "^18.3.1",
      "react-dom": "^18.3.1"
    }
  })
};

/** Normalize an AI-generated file path for Sandpack compatibility */
function normalizePath(rawPath: string): string | null {
  let p = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

  // Skip any server/backend files — Sandpack runs in-browser, not Node.js
  for (const skip of SKIP_PREFIXES) {
    if (p.startsWith(skip)) return null;
  }
  for (const exact of SKIP_EXACT) {
    if (p === exact) return null;
  }

  // Strip "frontend/" prefix if present (legacy generated code)
  if (p.startsWith('/frontend/')) p = p.replace('/frontend/', '/');

  // Rename .tsx → .jsx and .ts → .js so Sandpack bundler can process them
  if (p.endsWith('.tsx')) p = p.replace(/\.tsx$/, '.jsx');
  if (p.endsWith('.ts') && !p.endsWith('.d.ts')) p = p.replace(/\.ts$/, '.js');

  return p;
}

export const PreviewStage = ({ projectId }: { projectId: string }) => {
  const { codeFiles, codeId, setCode, isGenerating, setGenerating } = useWorkspaceStore();
  const { stream } = useSSE();
  const [sandpackFiles, setSandpackFiles] = useState<Record<string, string>>(DEFAULT_SANDPACK_FILES);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [hasCode, setHasCode] = useState(false);
  const loadedCodeId = useRef<string | null>(null);

  const loadAllFiles = async (id?: string) => {
    const codeIdToUse = id || codeId;
    if (!codeIdToUse || loadedCodeId.current === codeIdToUse) return;

    try {
      const { data } = await api.get(`/projects/${projectId}/code/full`);
      if (!data.files || data.files.length === 0) return;

      const fileContents: Record<string, string> = {};

      for (const f of data.files) {
        const normalizedPath = normalizePath(f.path);
        if (!normalizedPath || !f.content) continue;
        fileContents[normalizedPath] = f.content;
      }

      if (Object.keys(fileContents).length > 0) {
        // Replace defaults entirely with AI-generated files
        setSandpackFiles(fileContents);
        setHasCode(true);
        loadedCodeId.current = codeIdToUse;
      }
    } catch (err) {
      console.error('[Preview] Failed to bulk-load files:', err);
    }
  };

  // On mount: try to load existing code for this project
  useEffect(() => {
    const init = async () => {
      if (codeId) {
        await loadAllFiles();
      } else {
        try {
          const { data } = await api.get(`/projects/${projectId}/code`);
          if (data.files && data.files.length > 0) {
            setCode(data.files, data.codeId?.toString() || '');
            await loadAllFiles(data.codeId?.toString());
          }
        } catch { /* no code yet, show default */ }
      }
    };
    init();
  }, [projectId, codeId]);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenerating(true, 'preview');
    setProgress([]);
    setStatus('Initializing...');
    loadedCodeId.current = null; // force reload after generation

    await stream(`/projects/${projectId}/code/generate`, { prompt: '' }, {
      onProgress: (stage, file) => {
        const msg = file ? `${stage}: ${file}` : stage;
        setProgress(p => [...p.slice(-8), msg]);
        setStatus(msg);
      },
      onChunk: () => {},
      onStatus: msg => setStatus(msg),
      onDone: async (data: any) => {
        setStatus('Loading preview...');
        if (data.files) {
          setCode(data.files, data.codeId || '');
          // Explicitly call loadAllFiles to ensure the new version is fetched
          await loadAllFiles(data.codeId);
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
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: hasCode ? '#10b981' : '#f59e0b' }} />
          <span style={{ fontSize: '0.65rem', color: hasCode ? '#10b981' : '#f59e0b', letterSpacing: 1, fontWeight: 600 }}>
            {hasCode ? 'LIVE PREVIEW' : 'NO CODE GENERATED'}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => {
            loadedCodeId.current = null;
            loadAllFiles(codeId || undefined);
          }}
          disabled={isGenerating || !codeId}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#aaa', padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.65rem', letterSpacing: 1.5, marginRight: 8 }}
          title="Force reload all files from server"
        >
          RE-SYNC FILES
        </button>
        <button
          onClick={() => setShowCode(!showCode)}
          style={{ background: showCode ? 'rgba(59,130,246,0.1)' : 'transparent', border: `1px solid ${showCode ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, color: showCode ? '#60a5fa' : 'rgba(255,255,255,0.4)', padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: 2, transition: 'all 0.2s' }}>
          {showCode ? 'HIDE SOURCE' : 'VIEW SOURCE'}
        </button>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ background: isGenerating ? 'transparent' : '#3b82f6', color: '#fff', border: `1px solid ${isGenerating ? 'rgba(59,130,246,0.3)' : '#3b82f6'}`, padding: '8px 20px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, opacity: isGenerating ? 0.6 : 1, transition: 'all 0.2s' }}>
          {isGenerating ? 'GENERATING...' : 'GENERATE'}
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

      {/* Status bar */}
      {status && (
        <div style={{ padding: '4px 20px', background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.12)', fontSize: '0.65rem', color: '#818cf8', letterSpacing: 1 }}>
          {status}
        </div>
      )}

      {/* Sandpack */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <SandpackProvider
          template="vite-react"
          files={sandpackFiles}
          theme="dark"
          options={{
            mainFile: '/src/App.jsx',
            externalResources: [
              'https://cdn.tailwindcss.com',
              'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            ],
          }}
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
