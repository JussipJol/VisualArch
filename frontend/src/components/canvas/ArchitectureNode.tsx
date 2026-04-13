import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ArchNode } from '@/lib/store/workspace';

const LAYER_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Frontend:      { bg: 'rgba(94,129,244,0.12)', border: '#5E81F4', text: '#5E81F4', glow: 'rgba(94,129,244,0.3)' },
  Backend:       { bg: 'rgba(34,211,238,0.12)', border: '#22D3EE', text: '#22D3EE', glow: 'rgba(34,211,238,0.3)' },
  Gateway:       { bg: 'rgba(167,139,250,0.12)', border: '#A78BFA', text: '#A78BFA', glow: 'rgba(167,139,250,0.3)' },
  Services:      { bg: 'rgba(74,222,128,0.12)', border: '#4ADE80', text: '#4ADE80', glow: 'rgba(74,222,128,0.3)' },
  Database:      { bg: 'rgba(251,191,36,0.12)', border: '#FACC15', text: '#FACC15', glow: 'rgba(251,191,36,0.3)' },
  Cache:         { bg: 'rgba(248,113,113,0.12)', border: '#F87171', text: '#F87171', glow: 'rgba(248,113,113,0.3)' },
  Auth:          { bg: 'rgba(167,139,250,0.12)', border: '#A78BFA', text: '#A78BFA', glow: 'rgba(167,139,250,0.3)' },
  Infrastructure:{ bg: 'rgba(139,143,168,0.12)', border: '#8B8FA8', text: '#8B8FA8', glow: 'rgba(139,143,168,0.3)' },
};

const STATUS_COLORS: Record<string, string> = {
  new:      '#4ADE80',
  modified: '#FACC15',
  stable:   '#5E81F4',
};

const ArchitectureNode = ({ data, selected }: NodeProps<ArchNode>) => {
  const colors = LAYER_COLORS[data.layer] ?? LAYER_COLORS.Backend;
  const statusColor = STATUS_COLORS[data.status] ?? '#8B8FA8';

  return (
    <div 
      className={`
        px-4 py-3 rounded-xl border-2 transition-all duration-300 min-w-[180px]
        ${selected ? 'scale-105 shadow-lg relative z-10' : 'hover:border-white/20'}
      `}
      style={{ 
        backgroundColor: 'rgba(13, 14, 21, 0.9)',
        borderColor: selected ? colors.border : 'rgba(255, 255, 255, 0.08)',
        boxShadow: selected ? `0 0 20px ${colors.glow}` : 'none'
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.border }}>
          {data.layer}
        </span>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
      </div>

      <h3 className="text-sm font-semibold text-white mb-1">{data.label}</h3>
      <p className="text-[10px] text-text-secondary leading-normal line-clamp-2">
        {data.description}
      </p>

      {data.files && data.files.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/5 flex gap-2 items-center opacity-60">
          <span className="text-[9px] text-text-secondary">
            {data.files.length} files
          </span>
          <span className="text-[9px] text-text-secondary">·</span>
          <span className="text-[9px] text-text-secondary">
            {data.testFiles?.length ?? 0} tests
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
    </div>
  );
};

export default memo(ArchitectureNode);
