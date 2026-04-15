import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkspaceStore } from '../stores/workspace.store';
import { useAuthStore } from '../stores/auth.store';
import { api } from '../api/client';
import { StageBar } from '../components/workspace/StageBar';
import { AIChatPanel } from '../components/workspace/AIChatPanel';
import { PreviewStage } from '../components/workspace/stages/PreviewStage';
// ── Feature modules ──────────────────────────────────────────────────────────
import { CanvasStage } from '../modules/canvas/CanvasStage';
import { DesignStage } from '../modules/design/DesignStage';
import { IDEStage }    from '../modules/ide/IDEStage';

export const WorkspacePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { project, currentStage, setProject, reset, isGenerating } = useWorkspaceStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reset();
    if (!id) return;
    api.get(`/projects/${id}`).then(({ data }) => {
      setProject(data.project);
      setLoading(false);
    }).catch(() => {
      setError('Project not found');
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', letterSpacing: 4 }}>
        LOADING...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: '"Space Mono", monospace' }}>
        <div style={{ color: '#ff1493', fontSize: '0.8rem', letterSpacing: 2 }}>{error}</div>
        <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>← BACK TO DASHBOARD</Link>
      </div>
    );
  }

  const renderStage = () => {
    if (!id) return null;
    switch (currentStage) {
      case 'canvas': return <CanvasStage projectId={id} />;
      case 'design': return <DesignStage projectId={id} />;
      case 'preview': return <PreviewStage projectId={id} />;
      case 'ide': return <IDEStage projectId={id} />;
      default: return <CanvasStage projectId={id} />;
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', color: '#fff', fontFamily: '"Space Mono", monospace', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 52, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, gap: 16 }}>
        <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: 2, transition: 'color 0.2s', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
          ← DASHBOARD
        </Link>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)' }} />
        <span style={{ fontSize: '0.85rem', fontFamily: '"Montserrat", sans-serif', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {project?.name || ''}
        </span>
        {isGenerating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ffcc', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '0.65rem', color: '#00ffcc', letterSpacing: 2 }}>GENERATING</span>
          </div>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>{user?.email}</span>
      </div>

      {/* Stage Bar */}
      {id && <StageBar projectId={id} />}

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Stage content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderStage()}
        </div>
        {/* AI Chat Panel */}
        <div style={{ width: 300, flexShrink: 0 }}>
          {id && <AIChatPanel projectId={id} />}
        </div>
      </div>
    </div>
  );
};
