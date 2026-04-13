'use client';

import { useState } from 'react';
import { AlertTriangle, Info, XCircle, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';

interface Issue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  nodeId?: string;
  suggestion: string;
}

interface Props {
  issues: Issue[];
  score: number;
  onFix?: (issue: Issue) => void;
}

const SEVERITY_CONFIG = {
  critical: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10 border-danger/20', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', label: 'Warning' },
  info: { icon: Info, color: 'text-accent-2', bg: 'bg-accent-2/10 border-accent-2/20', label: 'Info' },
};

export function CriticFeedbackPanel({ issues, score, onFix }: Props) {
  const [expanded, setExpanded] = useState<number[]>([0]);
  const [isOpen, setIsOpen] = useState(true);

  const critical = issues.filter(i => i.severity === 'critical').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;

  const toggleExpand = (i: number) =>
    setExpanded(e => e.includes(i) ? e.filter(x => x !== i) : [...e, i]);

  return (
    <div className="rounded-xl bg-surface border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-2/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">Architecture Critic</span>
          {critical > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-danger/20 text-danger text-xs">{critical} critical</span>
          )}
          {warnings > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-warning/20 text-warning text-xs">{warnings} warnings</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Score: {score}/100</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
        </div>
      </button>

      {isOpen && (
        <div className="divide-y divide-white/5">
          {issues.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text-secondary">
              ✅ No issues found — great architecture!
            </div>
          ) : (
            issues.map((issue, i) => {
              const cfg = SEVERITY_CONFIG[issue.severity];
              const Icon = cfg.icon;
              const isExpanded = expanded.includes(i);

              return (
                <div key={i} className={`p-3 border-l-2 ${issue.severity === 'critical' ? 'border-danger' : issue.severity === 'warning' ? 'border-warning' : 'border-accent-2'}`}>
                  <button className="w-full flex items-start gap-2 text-left" onClick={() => toggleExpand(i)}>
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary">{issue.title}</div>
                      {!isExpanded && (
                        <div className="text-xs text-text-secondary truncate mt-0.5">{issue.description}</div>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-text-secondary mt-0.5" /> : <ChevronDown className="w-3.5 h-3.5 text-text-secondary mt-0.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 ml-6 space-y-2 animate-fade-in">
                      <p className="text-xs text-text-secondary">{issue.description}</p>
                      <div className={`p-2 rounded-lg border text-xs ${cfg.bg}`}>
                        <span className="font-medium">💡 Fix: </span>
                        <span className="text-text-secondary">{issue.suggestion}</span>
                      </div>
                      {onFix && (
                        <button
                          onClick={() => onFix(issue)}
                          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          <Wand2 className="w-3 h-3" /> Auto-fix with AI
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
