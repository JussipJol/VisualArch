'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Play, Layers, Code2, PenTool, FileText,
  Users, Zap, RefreshCw, Download, Share2, ChevronRight,
} from 'lucide-react';
import { useWorkspaceStore, ArchNode } from '@/lib/store/workspace';
import { useAuthStore } from '@/lib/store/auth';
import { ArchitectureCanvas } from '@/components/canvas/ArchitectureCanvas';
import { CriticFeedbackPanel } from '@/components/ai-assistant/CriticFeedbackPanel';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';
import { PromptSuggestions } from '@/components/ai-assistant/PromptSuggestions';
import { IDEMode } from '@/components/workspace/IDEMode';
import { ADRMode } from '@/components/workspace/ADRMode';
import { useToastStore } from '@/lib/store/toast';

type Mode = 'canvas' | 'ide' | 'adr';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user } = useAuthStore();
  const {
    currentWorkspace, selectedNode, generating, generationProgress,
    fetchWorkspace, generateArchitecture, setSelectedNode, loading,
  } = useWorkspaceStore();
  
  const { addToast } = useToastStore();

  const [mode, setMode] = useState<Mode>('canvas');
  const [prompt, setPrompt] = useState('');
  const [criticIssues, setCriticIssues] = useState<any[]>([]);
  const [showRightPanel, setShowRightPanel] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchWorkspace(id);
  }, [id, user]);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    try {
      const result = await generateArchitecture(id, prompt);
      if (result) {
        addToast('Architecture recalibrated successfully', 'success');
        // Extract critic issues from result if present (the LLM adapter returns them now)
        if (result.criticFeedback?.issues) {
          setCriticIssues(result.criticFeedback.issues);
        }
        setPrompt('');
      }
    } catch (err) {
      addToast('Generation engine failure. Please check your AI quota.', 'error');
    }
  };

  const score = currentWorkspace?.architectureScore ?? 0;

  const MODES: { id: Mode; icon: any; label: string }[] = [
    { id: 'canvas', icon: Layers, label: 'Canvas' },
    { id: 'ide', icon: Code2, label: 'IDE' },
    { id: 'adr', icon: FileText, label: 'ADR' },
  ];

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      {/* Topbar */}
      <header className="h-14 flex items-center gap-4 px-4 border-b border-white/5 bg-surface flex-shrink-0">
        <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="h-5 w-px bg-white/10" />

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-text-primary truncate">
            {currentWorkspace?.name ?? 'Loading...'}
          </h1>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2">
          {MODES.map(({ id: modeId, icon: Icon, label }) => (
            <button
              key={modeId}
              onClick={() => setMode(modeId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === modeId ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Score */}
        {score > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2">
            <ArchitectureScoreGauge score={score} size="sm" />
            <span className="text-xs text-text-secondary">Score</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all">
            <Users className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <Link href={`/workspace/${id}/export`}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all">
            <Download className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main canvas area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas / IDE / Design / ADR */}
          <div className="flex-1 overflow-hidden">
            {mode === 'canvas' && (
              <ArchitectureCanvas
                nodes={currentWorkspace?.architectureData.nodes ?? []}
                edges={currentWorkspace?.architectureData.edges ?? []}
                onNodeClick={setSelectedNode}
                generating={generating}
                generationProgress={generationProgress}
              />
            )}
            {mode === 'ide' && <IDEMode node={selectedNode} workspace={currentWorkspace} />}
            {mode === 'adr' && <ADRMode workspaceId={id} />}
          </div>

          {/* Prompt bar */}
          <div className="border-t border-white/5 bg-surface p-4">
            {/* Generation progress */}
            {generating && (
              <div className="mb-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 text-sm text-accent">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="streaming">{generationProgress.message ?? 'Generating...'}</span>
                </div>
                {generationProgress.totalNodes && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${((generationProgress.completedNodes ?? 0) / generationProgress.totalNodes) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">
                      {generationProgress.completedNodes}/{generationProgress.totalNodes}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Prompt suggestions */}
            {!generating && currentWorkspace?.architectureData.nodes.length === 0 && (
              <PromptSuggestions onSelect={setPrompt} />
            )}

            <div className="flex gap-2">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                placeholder="Describe what to build or change... (Enter to generate, Shift+Enter for newline)"
                className="flex-1 bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent/40 resize-none"
                rows={2}
                disabled={generating}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-all hover:shadow-glow-accent flex items-center gap-2 self-end"
              >
                <Play className="w-4 h-4" />
                {generating ? 'Generating' : 'Generate'}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-text-secondary">
                {currentWorkspace?.architectureData.nodes.length ?? 0} nodes · {currentWorkspace?.techStack.join(', ') || 'No tech stack yet'}
              </span>
              <span className="text-xs text-text-secondary">
                Cost: ~10 credits
              </span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        {showRightPanel && (
          <aside className="w-80 border-l border-white/5 bg-surface flex flex-col overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-text-primary">AI Assistant</h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Selected node info */}
              {selectedNode && (
                <div className="p-3 rounded-xl bg-surface-2 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${selectedNode.status === 'new' ? 'bg-success' : selectedNode.status === 'modified' ? 'bg-warning' : 'bg-text-secondary'}`} />
                    <span className="text-sm font-medium text-text-primary">{selectedNode.label}</span>
                    <span className="ml-auto text-xs text-text-secondary bg-surface px-2 py-0.5 rounded">{selectedNode.layer}</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">{selectedNode.description}</p>
                  <div className="flex gap-2 text-xs text-text-secondary">
                    <span>{selectedNode.files?.length ?? 0} files</span>
                    <span>·</span>
                    <span>{selectedNode.testFiles?.length ?? 0} tests</span>
                  </div>
                </div>
              )}

              {/* Architecture score */}
              {score > 0 && (
                <div className="p-3 rounded-xl bg-surface-2 border border-white/5 flex items-center gap-3">
                  <ArchitectureScoreGauge score={score} size="md" showLabel />
                  <div className="flex-1">
                    <div className="text-xs text-text-secondary space-y-1">
                      <div className="flex justify-between"><span>Security</span><span className="text-success">{Math.min(score + 5, 100)}</span></div>
                      <div className="flex justify-between"><span>Scalability</span><span className="text-warning">{Math.max(score - 10, 0)}</span></div>
                      <div className="flex justify-between"><span>Cohesion</span><span className="text-accent">{score}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Critic feedback */}
              {criticIssues.length > 0 && (
                <CriticFeedbackPanel
                  issues={criticIssues}
                  score={score}
                  onFix={(issue) => setPrompt(`Fix: ${issue.suggestion}`)}
                />
              )}

              {/* Memory panel */}
              <div className="p-3 rounded-xl bg-purple/10 border border-purple/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-purple">🧠 Architecture Memory</span>
                </div>
                <p className="text-xs text-text-secondary">
                  {currentWorkspace?.architectureData.nodes.length
                    ? 'AI is learning from your architecture patterns and past decisions.'
                    : 'Generate an architecture to start building project memory.'}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
