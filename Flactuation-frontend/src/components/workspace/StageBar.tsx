import React from 'react';
import { useWorkspaceStore } from '../../stores/workspace.store';
import type { Stage } from '../../stores/workspace.store';
import { api } from '../../api/client';

const STAGES: { id: Stage; label: string; num: string }[] = [
  { id: 'canvas', label: 'Canvas', num: '01' },
  { id: 'design', label: 'Design', num: '02' },
  { id: 'preview', label: 'Preview', num: '03' },
  { id: 'ide', label: 'IDE', num: '04' },
];

const stageAccent: Record<Stage, string> = {
  canvas: '#00ffcc',
  design: '#7c3aed',
  data: '#f59e0b',
  preview: '#3b82f6',
  ide: '#ff1493',
};

export const StageBar = ({ projectId }: { projectId: string }) => {
  const { currentStage, setStage, project, isGenerating } = useWorkspaceStore();

  const handleStageClick = async (stage: Stage) => {
    if (isGenerating) return;
    setStage(stage);
    // Persist to backend
    api.put(`/projects/${projectId}`, { currentStage: stage }).catch(() => {});
  };

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
      {STAGES.map((s, i) => {
        const isActive = currentStage === s.id;
        const accent = stageAccent[s.id];
        return (
          <React.Fragment key={s.id}>
            <button
              onClick={() => handleStageClick(s.id)}
              disabled={isGenerating}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${accent}` : '2px solid transparent',
                color: isActive ? accent : 'rgba(255,255,255,0.3)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.7rem',
                letterSpacing: 1,
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
              onMouseEnter={e => { if (!isActive && !isGenerating) { (e.currentTarget as HTMLButtonElement).style.color = accent; } }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; } }}
            >
              <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>{s.num}</span>
              <span style={{ textTransform: 'uppercase' }}>{s.label}</span>
            </button>
            {i < STAGES.length - 1 && (
              <div style={{ width: 1, background: 'rgba(255,255,255,0.04)', alignSelf: 'stretch', margin: '4px 0' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
