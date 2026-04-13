'use client';

import React from 'react';
import { FileText, Plus, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  workspaceId: string;
}

export function ADRMode({ workspaceId }: Props) {
  return (
    <div className="h-full p-8 overflow-y-auto bg-bg no-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Decision Records</h2>
            <p className="text-sm text-text-secondary mt-1">Audit trail of significant architectural decisions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all hover:shadow-glow-accent">
            <Plus className="w-4 h-4" /> Create ADR
          </button>
        </div>

        <div className="grid gap-4">
          <div className="group p-5 rounded-2xl bg-surface border border-white/5 hover:border-success/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-success transition-colors">ADR-001: Scalable Event Sourcing</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-success font-medium uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Accepted
                    </span>
                    <span className="text-[10px] text-text-secondary opacity-40">·</span>
                    <span className="text-[10px] text-text-secondary">Mar 12, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
              We decided to implement an event-driven architecture using Kafka for cross-service communication to ensure high availability and data consistency.
            </p>
          </div>

          <div className="group p-5 rounded-2xl bg-surface border border-white/5 hover:border-warning/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-warning transition-colors">ADR-002: JWT-based Authentication</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-warning font-medium uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> Proposed
                    </span>
                    <span className="text-[10px] text-text-secondary opacity-40">·</span>
                    <span className="text-[10px] text-text-secondary">Apr 01, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
              Introduction of refresh token rotation and HttpOnly cookies to mitigate XSS and session hijacking in the frontend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
