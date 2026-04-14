import React from 'react';
import { Editor, Frame, Element, useEditor, useNode } from '@craftjs/core';
import { Toolbox } from './Toolbox';
import { SettingsPanel } from './SettingsPanel';
import { Container, Text, Hero, Section, Button } from './UserComponents';
import { useWorkspaceStore } from '@/lib/store/workspace';
import { Wand2, Save, Undo, Redo, Play } from 'lucide-react';

interface Props {
  workspaceId: string;
  initialState?: string;
  architectureData?: any;
}

const DEFAULT_STATE = JSON.stringify({
  ROOT: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: { padding: '40px', background: 'transparent' },
    displayName: 'Container',
    custom: {}, parent: null, hidden: false, nodes: ['node-hero', 'node-section'], linkedNodes: {}
  },
  'node-hero': {
    type: { resolvedName: 'Hero' },
    isCanvas: false,
    props: { title: 'Project Designer', subtitle: 'Design your vision visually. Synthesize to code instantly.' },
    displayName: 'Hero',
    custom: {}, parent: 'ROOT', hidden: false, nodes: [], linkedNodes: {}
  },
  'node-section': {
    type: { resolvedName: 'Section' },
    isCanvas: true,
    props: { title: 'Getting Started' },
    displayName: 'Section',
    custom: {}, parent: 'ROOT', hidden: false, nodes: [], linkedNodes: { 'section-body': 'node-body' }
  },
  'node-body': {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: { padding: '20px' },
    displayName: 'Container',
    custom: {}, parent: 'node-section', hidden: false, nodes: ['node-text'], linkedNodes: {}
  },
  'node-text': {
    type: { resolvedName: 'Text' },
    isCanvas: false,
    props: { text: 'Start dragging components from the toolbox to modify this design.', fontSize: 18 },
    displayName: 'Text',
    custom: {}, parent: 'node-body', hidden: false, nodes: [], linkedNodes: {}
  }
});

export const CraftDesigner: React.FC<Props> = ({ workspaceId, initialState, architectureData }) => {
  const { saveDesignState, finalizeDesign, generating } = useWorkspaceStore();
  
  const validateCraftState = (state: any): boolean => {
    try {
      const parsed = typeof state === 'string' ? JSON.parse(state) : state;
      if (!parsed || typeof parsed !== 'object') return false;
      if (!parsed.ROOT || !parsed.ROOT.type) return false;
      return true;
    } catch {
      return false;
    }
  };

  const [json, setJson] = React.useState<string>(() => {
    if (!initialState) return DEFAULT_STATE;
    const isValid = validateCraftState(initialState);
    if (!isValid) {
      console.warn('[Designer] Invalid state detected. Falling back to DEFAULT_STATE.');
      return DEFAULT_STATE;
    }
    return typeof initialState === 'string' ? initialState : JSON.stringify(initialState);
  });

  const handleFinalize = async (editorQuery: any) => {
    const currentState = editorQuery.serialize();
    await finalizeDesign(workspaceId, currentState);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Editor
        resolver={{
          Container,
          Text,
          Hero,
          Section,
          Button
        }}
        onRender={RenderNode}
      >
        {/* Workspace Toolbar */}
        <div className="h-14 border-b border-white/5 bg-surface-1 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               <span className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Live Designer</span>
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2 text-text-secondary">
               <span className="text-[10px] font-medium opacity-60">Mode:</span>
               <span className="text-[10px] font-bold text-white bg-white/5 px-2 py-0.5 rounded uppercase">Ultra-High Fidelity</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <SubmitButton onFinalize={handleFinalize} loading={generating} />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Toolbox */}
          <aside className="w-72 border-r border-white/5 bg-surface-1 z-10 hidden xl:flex flex-col">
            <Toolbox />
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_center,_#1a1b2e_0%,_#0d0e1a_100%)] p-12 relative group">
            <div className="max-w-5xl mx-auto min-h-full bg-surface-1 shadow-2xl rounded-[32px] overflow-hidden border border-white/5 relative">
              <Frame data={json} />
            </div>
          </main>

          {/* Right Sidebar: Properties */}
          <aside className="w-80 border-l border-white/5 bg-surface-1 z-10 hidden lg:flex flex-col">
            <SettingsPanel />
          </aside>
        </div>
      </Editor>
    </div>
  );
};

// --- Sub-components ---

const RenderNode = ({ render }: any) => {
  const { id } = useNode();
  const { actions, query, isActive, isHovered } = useEditor((state, query) => ({
    isActive: query.getEvent('selected').contains(id),
    isHovered: query.getEvent('hovered').contains(id),
  }));

  return (
    <div className={`relative transition-all ${isHovered || isActive ? 'ring-2 ring-accent ring-inset rounded-lg overflow-hidden' : ''}`}>
      {isActive && (
        <div className="absolute top-0 right-0 z-50 bg-accent text-[10px] font-bold text-white px-2 py-0.5 rounded-bl-lg animate-fade-in">
          {query.node(id).get().displayName}
        </div>
      )}
      {render}
    </div>
  );
};

const SubmitButton = ({ onFinalize, loading }: any) => {
  const { query } = useEditor();
  return (
    <button
      onClick={() => onFinalize(query)}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-xs font-bold shadow-glow-accent hover:bg-accent/90 transition-all disabled:opacity-50"
    >
      {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
      {loading ? 'Finalizing...' : 'Submit to AI'}
    </button>
  );
};
