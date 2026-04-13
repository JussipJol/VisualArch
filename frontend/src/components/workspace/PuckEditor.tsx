'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { config, initialPuckData } from "./puck.config";
import { useWorkspaceStore } from '@/lib/store/workspace';
import { Wand2, RefreshCw } from 'lucide-react';

interface Props {
  workspaceId: string;
  initialData?: any;
}

export default function PuckEditor({ workspaceId, initialData }: Props) {
  const { saveDesignCanvas, generateArchitecture, generating } = useWorkspaceStore();
  
  // Validate and memoize initial data to prevent unnecessary re-renders
  const [internalData, setInternalData] = useState<Data>(() => {
    if (initialData && initialData.content && Array.isArray(initialData.content)) {
      return initialData;
    }
    return initialPuckData;
  });

  // Debounced Autosave
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only save if it's different from initial
      if (JSON.stringify(internalData) !== JSON.stringify(initialData)) {
        saveDesignCanvas(workspaceId, internalData);
      }
    }, 2000); // 2-second debounce for design data

    return () => clearTimeout(timeoutId);
  }, [internalData, workspaceId, initialData, saveDesignCanvas]);

  const handleGenerate = async () => {
    if (generating) return;
    const { currentWorkspace, generateArchitecture } = useWorkspaceStore.getState();
    const prompt = currentWorkspace?.prompt || "Generate system architecture based on this frontend design prototype.";
    await generateArchitecture(workspaceId, prompt); 
  };

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden relative puck-wrapper">
      <Puck
        config={config}
        data={internalData}
        onPublish={async (newData) => {
          await saveDesignCanvas(workspaceId, newData);
        }}
        onChange={(newData) => {
          setInternalData(newData);
        }}
        overrides={{
          header: ({ actions, children }) => (
            <div className="flex items-center justify-between p-2 bg-surface border-b border-white/5 h-12">
              <div className="flex items-center gap-4 px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Frontend Prototype</span>
                  <span className="text-[11px] text-text-secondary">Puck Builder v0.17</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-bold transition-all hover:bg-accent/90"
                >
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  {generating ? 'Architecting...' : 'Sync Arch'}
                </button>
                {actions}
              </div>
            </div>
          ),
        }}
      />

      <style jsx global>{`
        .puck-wrapper .Puck {
          --puck-color-background-screen: #0a0a0b;
          --puck-color-background-edge: #141415;
          --puck-color-background-sidebar: #141415;
          --puck-color-background-header: #141415;
          --puck-color-text: #ffffff;
          --puck-color-text-light: #a1a1aa;
          --puck-color-accent: #6d28d9;
          --puck-font-family: inherit;
        }
        .puck-wrapper [class*="Header"] {
          background: #141415 !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .puck-wrapper [class*="Sidebar"] {
          background: #141415 !important;
          border-left: 1px solid rgba(255,255,255,0.05) !important;
          border-right: 1px solid rgba(255,255,255,0.05) !important;
        }
      `}</style>
    </div>
  );
}
