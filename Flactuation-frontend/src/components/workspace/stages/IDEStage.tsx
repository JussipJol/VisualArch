import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useWorkspaceStore } from '../../../stores/workspace.store';
import { api } from '../../../api/client';

interface FileItem { path: string; language: string }

const langToMonaco: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  css: 'css',
  html: 'html',
  json: 'json',
  markdown: 'markdown',
  dotenv: 'plaintext',
  text: 'plaintext',
};

const getIcon = (path: string) => {
  if (path.endsWith('.jsx') || path.endsWith('.tsx')) return '⚛';
  if (path.endsWith('.js') || path.endsWith('.ts')) return '◈';
  if (path.endsWith('.css')) return '◻';
  if (path.endsWith('.json')) return '{}';
  if (path.endsWith('.md')) return '§';
  if (path.endsWith('.html')) return '⊞';
  return '·';
};

export const IDEStage = ({ projectId }: { projectId: string }) => {
  const { codeFiles, codeId, setCode } = useWorkspaceStore();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [saveSuccess, setSaveSuccess] = useState(false);
>>>>>>> 48106fb (update project)
  const [downloading, setDownloading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (codeFiles.length === 0) {
      api.get(`/projects/${projectId}/code`).then(({ data }) => {
        if (data.files && data.files.length > 0) {
          setCode(data.files, data.codeId?.toString() || '');
          setSelectedFile(data.files[0]);
        }
      }).catch(() => {});
    } else if (!selectedFile && codeFiles.length > 0) {
      setSelectedFile(codeFiles[0]);
    }
  }, [projectId, codeFiles.length]);

  useEffect(() => {
    if (!selectedFile) return;
    setLoading(true);
    api.get(`/projects/${projectId}/code/file?path=${encodeURIComponent(selectedFile.path)}`).then(({ data }) => {
      setFileContent(data.file?.content || '// File content not available');
    }).catch(() => {
      setFileContent('// Error loading file');
    }).finally(() => setLoading(false));
  }, [selectedFile?.path, projectId]);

<<<<<<< HEAD
=======
  const handleSave = async () => {
    if (!selectedFile || loading) return;
    setLoading(true);
    try {
      const { data } = await api.put(`/projects/${projectId}/code/file`, {
        path: selectedFile.path,
        content: fileContent,
      });
      if (data.success) {
        // Update global store with NEW version ID
        // This triggers PreviewStage reload
        setCode(data.files, data.codeId);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('[IDE] Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

>>>>>>> 48106fb (update project)
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/projects/${projectId}/code/zip`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'project.zip'; a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ }
    finally { setDownloading(false); }
  };

  const filteredFiles = codeFiles.filter(f => f.path.toLowerCase().includes(search.toLowerCase()));

  // Group files by directory
  const groups: Record<string, FileItem[]> = {};
  for (const f of filteredFiles) {
    const parts = f.path.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '/';
    if (!groups[dir]) groups[dir] = [];
    groups[dir].push(f);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 3 }}>// IDE</span>
        <div style={{ flex: 1 }} />
        {codeFiles.length > 0 && (
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>{codeFiles.length} FILES</span>
        )}
<<<<<<< HEAD
=======
        <button
          onClick={handleSave}
          disabled={!selectedFile || loading}
          style={{
            background: saveSuccess ? 'rgba(16,185,129,0.1)' : 'transparent',
            border: `1px solid ${saveSuccess ? '#10b981' : '#3b82f6'}`,
            color: saveSuccess ? '#10b981' : '#3b82f6',
            padding: '8px 20px',
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: 1,
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'SAVING...' : saveSuccess ? '✓ SAVED!' : 'SAVE CHANGES'}
        </button>
>>>>>>> 48106fb (update project)
        <button onClick={handleDownload} disabled={codeFiles.length === 0 || downloading} style={{ background: downloading ? 'transparent' : '#fff', color: '#000', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 20px', cursor: codeFiles.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, opacity: codeFiles.length === 0 ? 0.3 : 1, transition: 'all 0.2s' }}>
          {downloading ? 'DOWNLOADING...' : '↓ DOWNLOAD ZIP'}
        </button>
      </div>

      {codeFiles.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', letterSpacing: 4 }}>// NO CODE GENERATED</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>Go to Preview stage and generate your project</div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* File tree */}
          <div style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search files..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '6px 10px', fontFamily: 'inherit', fontSize: '0.7rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {Object.entries(groups).map(([dir, files]) => (
                <div key={dir}>
                  {dir !== '/' && (
                    <div style={{ padding: '6px 12px 2px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 2, textTransform: 'uppercase' }}>
                      {dir}
                    </div>
                  )}
                  {files.map(f => {
                    const filename = f.path.split('/').pop() || f.path;
                    const isSelected = selectedFile?.path === f.path;
                    return (
                      <div key={f.path} onClick={() => setSelectedFile(f)} style={{ padding: '7px 12px 7px 16px', cursor: 'pointer', background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent', borderLeft: `2px solid ${isSelected ? '#fff' : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.1s' }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{getIcon(f.path)}</span>
                        <span style={{ fontSize: '0.75rem', color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{filename}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selectedFile && (
              <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{getIcon(selectedFile.path)}</span>
                <span>{selectedFile.path}</span>
                <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }}>{selectedFile.language}</span>
              </div>
            )}
            {loading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', letterSpacing: 2 }}>LOADING...</div>
            ) : (
              <Editor
                height="100%"
                language={langToMonaco[selectedFile?.language || ''] || 'plaintext'}
                value={fileContent}
<<<<<<< HEAD
                theme="vs-dark"
                options={{
                  readOnly: true,
=======
                onChange={(val) => setFileContent(val || '')}
                theme="vs-dark"
                options={{
                  readOnly: false,
>>>>>>> 48106fb (update project)
                  fontSize: 13,
                  fontFamily: '"Space Mono", "Consolas", monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  padding: { top: 12 },
<<<<<<< HEAD
=======
                  automaticLayout: true,
>>>>>>> 48106fb (update project)
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
