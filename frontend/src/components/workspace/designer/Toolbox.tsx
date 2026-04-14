import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { Type, Square, Layout, Image, MousePointer2, Plus } from 'lucide-react';
import { Text, Hero, Section, Button, Container } from './UserComponents';

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
           <Plus className="w-3 h-3" /> Insert Library
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* --- Structural --- */}
        <div className="space-y-3">
          <h4 className="text-[10px] text-text-secondary uppercase font-medium">Layout</h4>
          <div className="grid grid-cols-2 gap-2">
            <DraggableItem 
              ref={(ref: any) => connectors.create(ref, <Element is={Container} canvas />)}
              icon={Square}
              label="Block"
            />
            <DraggableItem 
              ref={(ref: any) => connectors.create(ref, <Element is={Section} canvas />)}
              icon={Layout}
              label="Section"
            />
          </div>
        </div>

        {/* --- High Level --- */}
        <div className="space-y-3">
          <h4 className="text-[10px] text-text-secondary uppercase font-medium">Components</h4>
          <div className="space-y-2">
            <DraggableItem 
              ref={(ref: any) => connectors.create(ref, <Element is={Hero} canvas />)}
              icon={Image}
              label="Hero Banner"
              full
            />
            <DraggableItem 
              ref={(ref: any) => connectors.create(ref, <Element is={Text} text="New heading" fontSize={24} fontWeight="bold" canvas />)}
              icon={Type}
              label="Heading"
              full
            />
             <DraggableItem 
              ref={(ref: any) => connectors.create(ref, <Element is={Button} text="Click here" canvas />)}
              icon={MousePointer2}
              label="Action Button"
              full
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-accent/5 border-t border-white/5">
        <p className="text-[10px] text-text-secondary text-center">Drag components onto the canvas to architect your UI.</p>
      </div>
    </div>
  );
};

const DraggableItem = React.forwardRef(({ icon: Icon, label, full }: any, ref: any) => {
  return (
    <div 
      ref={ref}
      className={`
        flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-white/5 
        cursor-grab active:cursor-grabbing hover:border-accent/40 transition-all group
        ${full ? 'w-full' : ''}
      `}
    >
      <div className="p-2 rounded-lg bg-bg group-hover:bg-accent/10 transition-colors">
        <Icon className="w-4 h-4 text-text-secondary group-hover:text-accent" />
      </div>
      <span className="text-xs font-medium text-text-primary">{label}</span>
    </div>
  );
});

DraggableItem.displayName = 'DraggableItem';
