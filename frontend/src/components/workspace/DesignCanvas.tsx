'use client';

import React, { useEffect } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, Editor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useWorkspaceStore } from '@/lib/store/workspace';

interface Props {
  workspaceId: string;
  initialData?: any;
}

export function DesignCanvas({ workspaceId, initialData }: Props) {
  const { saveDesignCanvas } = useWorkspaceStore();

  const handleMount = (editor: Editor) => {
    // Load initial data if present
    if (initialData) {
      try {
        editor.store.loadSnapshot(initialData);
      } catch (err) {
        console.error('Failed to load design snapshot:', err);
      }
    }

    // Debounced auto-save
    let timeoutId: NodeJS.Timeout;
    
    const unlisten = editor.store.listen(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        saveDesignCanvas(workspaceId, snapshot);
      }, 2000); // 2-second debounce for design canvas
    });

    return () => {
      unlisten();
      clearTimeout(timeoutId);
    };
  };

  return (
    <div className="h-full w-full relative bg-bg tldraw-custom">
      <Tldraw
        onMount={handleMount}
        inferDarkMode
        options={{
          maxImageDimension: 1024,
        }}
        hideUi={false} // We can customize this later if we want a cleaner "Cockpit" look
      />
      
      <style jsx global>{`
        .tldraw-custom .tl-canvas {
          background-color: transparent !important;
        }
        .tldraw-custom .tl-ui {
          --tl-background: #0a0a0b !important;
          --tl-text: #ffffff !important;
          --tl-accent: #6d28d9 !important;
        }
      `}</style>
    </div>
  );
}
