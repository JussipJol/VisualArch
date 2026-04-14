'use client';

import React, { useEffect, useState } from 'react';
import { Puck, Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { config, initialPuckData } from './puck.config';
import { useWorkspaceStore, ArchitectureData } from '@/lib/store/workspace';
import { architectureToDesign } from '@/lib/utils/design-from-architecture';
import { Wand2, RefreshCw, Layers } from 'lucide-react';

interface Props {
  workspaceId: string;
  initialData?: any;
  architectureData?: ArchitectureData;
  workspaceName?: string;
}

export default function PuckEditor({ workspaceId, initialData, architectureData, workspaceName }: Props) {
  const { saveDesignCanvas, generating } = useWorkspaceStore();

  const [internalData, setInternalData] = useState<Data>(() =>
    resolveInitialData(initialData, architectureData, workspaceName)
  );

  // When architecture changes externally (e.g. after a new generation) and
  // no manual design data exists yet, refresh the auto-generated layout.
  useEffect(() => {
    if (!initialData && architectureData?.nodes?.length) {
      setInternalData(architectureToDesign(architectureData, workspaceName ?? ''));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [architectureData?.nodes?.length]);

  // Debounced autosave — only when data actually changed from what was loaded
  useEffect(() => {
    const id = setTimeout(() => {
      if (JSON.stringify(internalData) !== JSON.stringify(initialData)) {
        saveDesignCanvas(workspaceId, internalData);
      }
    }, 2_000);
    return () => clearTimeout(id);
  }, [internalData, workspaceId, initialData, saveDesignCanvas]);

  const handleSyncArch = async () => {
    if (generating) return;
    const { currentWorkspace, generateArchitecture } = useWorkspaceStore.getState();
    const prompt =
      currentWorkspace?.prompt ||
      'Generate system architecture based on this frontend design prototype.';
    await generateArchitecture(workspaceId, prompt);
  };

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden puck-wrapper">
      <Puck
        config={config}
        data={internalData}
        onPublish={async (newData) => {
          await saveDesignCanvas(workspaceId, newData);
        }}
        onChange={(newData) => setInternalData(newData)}
        overrides={{
          header: ({ actions }) => (
            <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-white/5 h-12 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-accent" />
                <div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block leading-none">
                    Frontend Prototype
                  </span>
                  <span className="text-[10px] text-text-secondary">Puck Visual Builder</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncArch}
                  disabled={generating}
                  title="Re-generate architecture from this design"
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-bold transition-all hover:bg-accent/90 disabled:opacity-50"
                >
                  {generating
                    ? <RefreshCw className="w-3 h-3 animate-spin" />
                    : <Wand2 className="w-3 h-3" />}
                  {generating ? 'Architecting...' : 'Sync Arch'}
                </button>
                {actions}
              </div>
            </div>
          ),
        }}
      />

      {/* Dark-theme override for Puck internals */}
      <style jsx global>{`
        .puck-wrapper .Puck {
          --puck-color-background-screen:  #0a0a0b;
          --puck-color-background-edge:    #141415;
          --puck-color-background-sidebar: #141415;
          --puck-color-background-header:  #141415;
          --puck-color-text:               #ffffff;
          --puck-color-text-light:         #a1a1aa;
          --puck-color-accent:             #6d28d9;
          --puck-font-family:              inherit;
        }
        .puck-wrapper [class*="Header"] {
          background: #141415 !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .puck-wrapper [class*="Sidebar"] {
          background: #141415 !important;
          border-left:  1px solid rgba(255,255,255,0.05) !important;
          border-right: 1px solid rgba(255,255,255,0.05) !important;
        }
        .puck-wrapper [class*="LayerTree"],
        .puck-wrapper [class*="ComponentList"] {
          background: #141415 !important;
        }
      `}</style>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveInitialData(
  initialData: any,
  architectureData: ArchitectureData | undefined,
  workspaceName: string | undefined
): Data {
  // 1. If the workspace already has saved design data — use it
  if (initialData?.content && Array.isArray(initialData.content) && initialData.content.length > 0) {
    return initialData as Data;
  }

  // 2. If there's architecture data — auto-generate a meaningful layout
  if (architectureData?.nodes?.length) {
    return architectureToDesign(architectureData, workspaceName ?? '');
  }

  // 3. Fallback: empty canvas
  return initialPuckData;
}
