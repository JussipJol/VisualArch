'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store/workspace';
import { Loader2, AlertCircle } from 'lucide-react';

// Dynamically import CraftDesigner with SSR disabled (uses local storage/browser APIs)
const CraftDesigner = dynamic(() => import('./designer/CraftDesigner').then(mod => mod.CraftDesigner), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-bg text-text-secondary">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
      <p className="text-sm font-medium animate-pulse uppercase tracking-widest">Initialising Craft Studio...</p>
    </div>
  ),
});

// --- Error Boundary ---
class DesignerErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[DesignerError]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-bg text-center space-y-4">
          <div className="p-4 rounded-full bg-error/10 text-error">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Designer Encountered an Error</h2>
          <p className="text-sm text-text-secondary max-w-md">
            The Craft.js engine crashed due to a state conflict or a React rendering error.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset();
              }}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold shadow-glow-accent"
            >
              Reset Canvas
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/5 text-text-primary rounded-lg text-sm font-medium hover:bg-white/10"
            >
              Refresh Workspace
            </button>
          </div>
          {this.state.error && (
            <pre className="mt-8 p-4 bg-white/5 rounded-xl text-[10px] text-error/80 font-mono text-left max-w-2xl overflow-auto border border-white/5">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export function DesignMode() {
  const { currentWorkspace, resetDesignState } = useWorkspaceStore();

  if (!currentWorkspace) {
    return (
      <div className="h-full flex items-center justify-center bg-bg text-text-secondary">
        <p className="text-sm">Select a workspace to start designing</p>
      </div>
    );
  }

  const handleReset = async () => {
    try {
      await resetDesignState(currentWorkspace.id);
      window.location.reload();
    } catch (err) {
      console.error('Reset failed:', err);
      // Fallback: forcefully clear and reload if API fails
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden">
      <DesignerErrorBoundary onReset={handleReset}>
        <CraftDesigner
          workspaceId={currentWorkspace.id}
          initialState={currentWorkspace.designState}
          architectureData={currentWorkspace.architectureData}
        />
      </DesignerErrorBoundary>
    </div>
  );
}
