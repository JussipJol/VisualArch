'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Play, Layers, Code2, PenTool, FileText,
  Users, RefreshCw, Download, Share2, Brain,
} from 'lucide-react';
import {
  useWorkspaceStore, ArchNode, CriticIssue, CriticFeedback,
} from '@/lib/store/workspace';
import { useAuthStore } from '@/lib/store/auth';
import { ArchitectureCanvas } from '@/components/canvas/ArchitectureCanvas';
import { CriticFeedbackPanel } from '@/components/ai-assistant/CriticFeedbackPanel';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';
import { PromptSuggestions } from '@/components/ai-assistant/PromptSuggestions';
import { IDEMode } from '@/components/workspace/IDEMode';
import { ADRMode } from '@/components/workspace/ADRMode';
import { DesignMode } from '@/components/workspace/DesignMode';
import { useToastStore } from '@/lib/store/toast';

type Mode = 'canvas' | 'ide' | 'design' | 'adr';

const MODES: { id: Mode; icon: typeof Layers; label: string }[] = [
  { id: 'canvas', icon: Layers,   label: 'Canvas' },
  { id: 'ide',    icon: Code2,    label: 'IDE' },
  { id: 'design', icon: PenTool,  label: 'Design' },
  { id: 'adr',    icon: FileText, label: 'ADR' },
];

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id     = params.id as string;

  const { user }                          = useAuthStore();
  const { addToast }                      = useToastStore();
  const {
    currentWorkspace, selectedNode,
    generating, generationProgress,
    fetchWorkspace, generateArchitecture, setSelectedNode,
  } = useWorkspaceStore();

  const [mode, setMode]             = useState<Mode>('canvas');
  const [prompt, setPrompt]         = useState('');
  const [criticData, setCriticData] = useState<CriticFeedback | null>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchWorkspace(id);
  }, [id, user]);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;

    try {
      const result = await generateArchitecture(id, prompt);

      if (result) {
        // Populate critic panel from the generation result
        if (result.criticFeedback) {
          setCriticData(result.criticFeedback);
        }
        addToast('Architecture generated successfully', 'success');
        setPrompt('');

        // Auto-switch to canvas after generation so the user sees the result
        setMode('canvas');
      } else {
        const { generationProgress } = useWorkspaceStore.getState();
        const msg = generationProgress.message ?? 'Generation failed. Please try again.';
        addToast(msg, 'error');
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Generation failed. Please check your AI quota.', 'error');
    }
  };

  const score = criticData?.score ?? currentWorkspace?.architectureScore ?? 0;

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${mode === modeId
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Score badge */}
        {score > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2">
            <ArchitectureScoreGauge score={score} size="sm" />
            <span className="text-xs text-text-secondary">Score</span>
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all" title="Collaborators">
            <Users className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <Link
            href={`/workspace/${id}/export`}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all"
            title="Export CI/CD"
          >
            <Download className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main area */}
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
            {mode === 'ide'    && <IDEMode node={selectedNode} workspace={currentWorkspace} />}
            {mode === 'design' && <DesignMode />}
            {mode === 'adr'    && <ADRMode workspaceId={id} />}
          </div>

          {/* Prompt bar */}
          <div className="border-t border-white/5 bg-surface p-4 flex-shrink-0">
            {/* Generation progress */}
            {generating && (
              <div className="mb-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 text-sm text-accent">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{generationProgress.message ?? 'Generating...'}</span>
                </div>
                {generationProgress.totalNodes && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{
                          width: `${((generationProgress.completedNodes ?? 0) / generationProgress.totalNodes) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">
                      {generationProgress.completedNodes ?? 0}/{generationProgress.totalNodes}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Smart prompt suggestions (shown when canvas is empty) */}
            {!generating && (currentWorkspace?.architectureData.nodes.length ?? 0) === 0 && (
              <PromptSuggestions onSelect={setPrompt} />
            )}

            {/* Input row */}
            <div className="flex gap-2">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Describe what to build or change… (Enter to generate, Shift+Enter for newline)"
                className="flex-1 bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent/40 resize-none"
                rows={2}
                disabled={generating}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-all flex items-center gap-2 self-end"
              >
                <Play className="w-4 h-4" />
                {generating ? 'Generating…' : 'Generate'}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-text-secondary">
                {currentWorkspace?.architectureData.nodes.length ?? 0} nodes
                {currentWorkspace?.techStack.length
                  ? ` · ${currentWorkspace.techStack.slice(0, 3).join(', ')}`
                  : ''}
              </span>
              <span className="text-xs text-text-secondary">~10 credits per generation</span>
            </div>
          </div>
        </div>

        {/* ── Right panel ──────────────────────────────────────────────── */}
        <aside className="w-80 border-l border-white/5 bg-surface flex flex-col overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-text-primary">AI Assistant</h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Selected node info */}
            {selectedNode && (
              <div className="p-3 rounded-xl bg-surface-2 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    selectedNode.status === 'new'      ? 'bg-success' :
                    selectedNode.status === 'modified' ? 'bg-warning' : 'bg-text-secondary'
                  }`} />
                  <span className="text-sm font-medium text-text-primary truncate">{selectedNode.label}</span>
                  <span className="ml-auto text-xs text-text-secondary bg-surface px-2 py-0.5 rounded flex-shrink-0">
                    {selectedNode.layer}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-2 line-clamp-2">{selectedNode.description}</p>
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
                <div className="flex-1 text-xs text-text-secondary space-y-1">
                  <div className="flex justify-between">
                    <span>Security</span>
                    <span className="text-success">{Math.min(score+5, 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scalability</span>
                    <span className="text-warning">{Math.max(score-10, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cohesion</span>
                    <span className="text-accent">{score}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Critic feedback */}
            {criticData && criticData.issues.length > 0 && (
              <CriticFeedbackPanel
                issues={criticData.issues}
                score={criticData.score}
                onFix={(issue) => setPrompt(`Fix: ${issue.suggestion}`)}
              />
            )}

            {/* Architecture memory */}
            <div className="p-3 rounded-xl bg-purple/10 border border-purple/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-3.5 h-3.5 text-purple" />
                <span className="text-xs font-medium text-purple">Architecture Memory</span>
              </div>
              <p className="text-xs text-text-secondary">
                {(currentWorkspace?.architectureData.nodes.length ?? 0) > 0
                  ? 'AI learns from your architecture patterns and past decisions.'
                  : 'Generate an architecture to start building project memory.'}
              </p>
            </div>

            {/* Smart next-step suggestions (shown after generation) */}
            {criticData && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Next Steps</p>
                {getNextStepSuggestions(criticData).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(s)}
                    className="w-full text-left p-2.5 rounded-lg bg-surface-2 border border-white/5 text-xs text-text-secondary hover:text-text-primary hover:border-accent/30 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNextStepSuggestions(criticData: CriticFeedback): string[] {
  const suggestions: string[] = [];

  const criticals = criticData.issues.filter(i => i.severity === 'critical');
  const warnings  = criticData.issues.filter(i => i.severity === 'warning');

  if (criticals.length > 0) {
    suggestions.push(`Fix critical issue: ${criticals[0].suggestion}`);
  }
  if (warnings.length > 0) {
    suggestions.push(`Address warning: ${warnings[0].suggestion}`);
  }

  // Generic progression suggestions
  if (suggestions.length < 3) suggestions.push('Add monitoring and observability with Sentry + structured logging');
  if (suggestions.length < 3) suggestions.push('Generate CI/CD pipeline and Dockerfile for production deployment');
  if (suggestions.length < 3) suggestions.push('Add Redis caching layer to improve response times');

  return suggestions.slice(0, 3);
}
