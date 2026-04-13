'use client';

import React, { useState, useEffect } from 'react';
import { ArchNode, CodeFile, useWorkspaceStore } from '@/lib/store/workspace';
import { MonacoEditor } from './MonacoEditor';
import { Folder, FileJson, FileCode, CheckCircle2, Save, Wand2, Loader2, RefreshCw } from 'lucide-react';
import { useToastStore } from '@/lib/store/toast';

interface Props {
  node: ArchNode | null;
  workspace: any;
}

export function IDEMode({ node, workspace }: Props) {
  const { pendingCodeChanges, updatePendingFile, syncCodeToArchitecture, generating, generationProgress } = useWorkspaceStore();
  const { addToast } = useToastStore();
  
  const [activeNodeId, setActiveNodeId] = useState<string | null>(node?.id ?? null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const activeNode = workspace?.architectureData.nodes.find((n: ArchNode) => n.id === (activeNodeId ?? node?.id));
  const files = activeNode?.files ?? [];
  const activeFile = files[activeFileIndex];

  const hasUnsavedChanges = Object.keys(pendingCodeChanges).length > 0;

  const handleSync = async () => {
    if (generating || !hasUnsavedChanges) return;
    await syncCodeToArchitecture(workspace.id);
    addToast('Architecture synchronized with code changes!', 'success');
  };

  // Use local state for immediate editor feedback
  const [localContent, setLocalContent] = useState<string | null>(null);

  const handleCodeChange = (value: string) => {
    if (!activeFile) return;
    setLocalContent(value);
    
    // Debounce the store update
    const timeoutId = setTimeout(() => {
      updatePendingFile(activeFile.path, value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  // Get current content (local if editing, else from pending or original)
  const currentContent = localContent ?? (activeFile ? (pendingCodeChanges[activeFile.path] ?? activeFile.content) : '');

  // Reset local content when switching files
  useEffect(() => {
    setLocalContent(null);
  }, [activeFile?.path]);

  return (
    <div className="h-full flex bg-bg overflow-hidden">
      {/* Sidebar: File Explorer */}
      <div className="w-64 border-r border-white/5 bg-surface flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Folder className="w-3 h-3" /> Explorer
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {workspace?.architectureData.nodes.map((n: ArchNode) => (
            <div key={n.id} className="space-y-1">
              <button 
                onClick={() => setActiveNodeId(n.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${activeNodeId === n.id ? 'bg-accent/10 text-accent font-medium' : 'text-text-primary hover:bg-white/5'}`}
              >
                <div className={`w-1 h-3 rounded-full ${n.status === 'new' ? 'bg-success' : 'bg-accent'}`} />
                <span className="truncate">{n.label}</span>
              </button>
              
              {activeNodeId === n.id && (
                <div className="ml-4 space-y-0.5 border-l border-white/5 pl-2">
                  {n.files?.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFileIndex(i)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[11px] transition-all ${activeNodeId === n.id && activeFileIndex === i ? 'text-text-primary bg-white/5' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                      {f.name.endsWith('.json') ? <FileJson className="w-3 h-3 text-warning" /> : <FileCode className="w-3 h-3 text-accent" />}
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                  {n.testFiles?.map((f, i) => (
                    <button
                      key={`t-${i}`}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-[11px] text-text-secondary/50 hover:text-text-primary transition-all"
                    >
                      <CheckCircle2 className="w-3 h-3 text-success/50" />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeFile ? (
          <>
            {/* Tab Bar & Submit Header */}
            <div className="flex items-center justify-between h-10 border-b border-white/5 bg-surface pr-4">
              <div className="flex-1 flex items-center overflow-x-auto no-scrollbar h-full">
                {files.map((f, i) => {
                  const isDirty = !!pendingCodeChanges[f.path];
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveFileIndex(i)}
                      className={`
                        flex items-center gap-2 px-4 h-full text-xs transition-all border-r border-white/5
                        ${i === activeFileIndex ? 'bg-bg text-text-primary border-b-2 border-b-accent' : 'text-text-secondary hover:bg-white/5'}
                      `}
                    >
                      <span className="truncate max-w-[120px]">{f.name}</span>
                      {isDirty && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                {hasUnsavedChanges && !generating && (
                  <span className="text-[10px] text-accent font-medium uppercase tracking-wider animate-pulse">Unsaved Edits</span>
                )}
                <button
                  onClick={handleSync}
                  disabled={!hasUnsavedChanges || generating}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                    ${hasUnsavedChanges && !generating 
                      ? 'bg-accent text-white shadow-glow-accent' 
                      : 'bg-white/5 text-text-secondary opacity-50 cursor-not-allowed'}
                  `}
                >
                  {generating ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  {generating ? 'Syncing...' : 'Sync Arch'}
                </button>
              </div>
            </div>
            
            {/* Editor Area */}
            <div className="flex-1 relative">
              <MonacoEditor 
                content={currentContent} 
                language={activeFile.language || 'typescript'} 
                onChange={handleCodeChange}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/5 flex items-center justify-center opacity-20">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">No file selected</p>
              <p className="text-xs mt-1">Select a component and file from the explorer to view the generated source code.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-using Code2 icon placeholder since IDEMode will be renamed or exported correctly
const Code2 = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);
