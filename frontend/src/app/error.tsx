'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl bg-error/10 border border-error/20 flex items-center justify-center mx-auto mb-8 shadow-glow-error">
          <AlertTriangle className="w-10 h-10 text-error" />
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">System Fault Detected</h1>
        <p className="text-text-secondary mb-8 text-sm leading-relaxed">
          The architecture engine encountered an unexpected runtime error. Your progress has been saved, but the current view needs to recalibrate.
        </p>

        <div className="grid gap-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent/90 transition-all hover:shadow-glow-accent"
          >
            <RefreshCw className="w-4 h-4" /> Reset Environment
          </button>
          
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-surface border border-white/5 text-text-primary font-semibold hover:bg-surface-2 transition-all"
          >
            <Home className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] text-text-secondary font-mono opacity-40">
            Fault Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
