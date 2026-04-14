import React from 'react';
import { useEditor } from '@craftjs/core';
import { Settings, Sliders, Type, Palette, MoreHorizontal } from 'lucide-react';

export const SettingsPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selectedNode: any;

    if (currentNodeId && state.nodes[currentNodeId]) {
      const node = state.nodes[currentNodeId];
      selectedNode = {
        id: currentNodeId,
        name: node.data.displayName || node.data.name,
        settings: node.related && node.related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
        props: node.data.props
      };
    }

    return {
      selected: selectedNode
    };
  });

  return isEnabled && selected ? (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
           <Sliders className="w-3 h-3" /> Properties
        </h3>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold uppercase">
          {selected.name}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* --- Custom Component Settings --- */}
        {selected.settings && React.createElement(selected.settings)}

        {/* --- Generic Props Editor (Simplified) --- */}
        <div className="space-y-6">
          <SectionTitle icon={Type} title="Content & Data" />
          <div className="space-y-4">
             {Object.keys(selected.props).map((key) => {
               if (['children', 'id'].includes(key)) return null;
               
               const value = selected.props[key];
               return (
                 <div key={key} className="space-y-2">
                   <label className="text-[10px] text-text-secondary font-medium uppercase font-mono">{key}</label>
                   {typeof value === 'string' && !value.startsWith('#') && value.length > 20 ? (
                     <textarea
                       className="w-full bg-surface-2 border border-white/5 rounded-lg p-2 text-xs text-text-primary focus:border-accent/40 outline-none resize-none"
                       rows={3}
                       value={value}
                       onChange={(e) => actions.setProp(selected.id, (props: any) => (props[key] = e.target.value))}
                     />
                   ) : (
                     <input
                       type="text"
                       className="w-full bg-surface-2 border border-white/5 rounded-lg p-2 text-xs text-text-primary focus:border-accent/40 outline-none"
                       value={value}
                       onChange={(e) => actions.setProp(selected.id, (props: any) => (props[key] = e.target.value))}
                     />
                   )}
                 </div>
               );
             })}
          </div>

          <SectionTitle icon={Palette} title="Styling" />
          <div className="grid grid-cols-2 gap-4">
             <StyleInput 
               label="Padding" 
               value={selected.props.padding || '0px'} 
               onChange={(val) => actions.setProp(selected.id, (props: any) => (props.padding = val))}
             />
             <StyleInput 
               label="Margin" 
               value={selected.props.margin || '0px'} 
               onChange={(val) => actions.setProp(selected.id, (props: any) => (props.margin = val))}
             />
             <StyleInput 
               label="BG Color" 
               value={selected.props.background || 'transparent'} 
               onChange={(val) => actions.setProp(selected.id, (props: any) => (props.background = val))}
             />
             <StyleInput 
               label="Border Radius" 
               value={selected.props.borderRadius || '0px'} 
               onChange={(val) => actions.setProp(selected.id, (props: any) => (props.borderRadius = val))}
             />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => actions.delete(selected.id)}
          className="w-full py-2 rounded-lg bg-error/10 text-error text-[10px] font-bold uppercase transition-all hover:bg-error hover:text-white"
        >
          Delete Component
        </button>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-secondary">
      <div className="p-3 rounded-2xl bg-white/5 mb-4">
         <Settings className="w-6 h-6 opacity-20" />
      </div>
      <p className="text-xs font-medium">Select a component to edit its properties.</p>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }: any) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-3 h-3 text-accent" />
    <span className="text-[10px] font-black text-text-primary uppercase tracking-tighter">{title}</span>
    <div className="flex-1 h-px bg-white/5" />
  </div>
);

const StyleInput = ({ label, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[9px] text-text-secondary uppercase font-medium">{label}</label>
    <input
      type="text"
      className="w-full bg-surface-2 border border-white/5 p-1.5 rounded-lg text-[10px] text-text-primary focus:border-accent/40 outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
