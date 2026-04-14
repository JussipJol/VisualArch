'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store/workspace';
import { Loader2 } from 'lucide-react';

// Dynamically import PuckEditor with SSR disabled (Puck uses browser APIs)
const PuckEditor = dynamic(() => import('./PuckEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-bg text-text-secondary">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
      <p className="text-sm font-medium animate-pulse">Initializing Visual Builder...</p>
    </div>
  ),
});

export function DesignMode() {
  const { currentWorkspace } = useWorkspaceStore();

  if (!currentWorkspace) {
    return (
      <div className="h-full flex items-center justify-center bg-bg text-text-secondary">
        <p className="text-sm">Select a workspace to start designing</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden">
      <PuckEditor
        workspaceId={currentWorkspace.id}
        initialData={currentWorkspace.designData}
        architectureData={currentWorkspace.architectureData}
        workspaceName={currentWorkspace.name}
      />
    </div>
  );
}
