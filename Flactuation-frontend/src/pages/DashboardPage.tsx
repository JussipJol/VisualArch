import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { api } from '../api/client';

interface Project {
  _id: string;
  name: string;
  description: string;
  currentStage: string;
  updatedAt: string;
}

const stageColor: Record<string, string> = {
  canvas: '#00ffcc',
  design: '#7c3aed',
  preview: '#3b82f6',
  ide: '#ff1493',
};

const stageLabel: Record<string, string> = {
  canvas: 'CANVAS',
  design: 'DESIGN',
  preview: 'PREVIEW',
  ide: 'IDE',
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.projects);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post('/projects', { name: newName, description: newDesc });
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      navigate(`/workspace/${data.project._id}`);
    } catch {
      setError('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`).catch(() => {});
    setProjects(p => p.filter(x => x._id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#000', color: '#fff', fontFamily: '"Space Mono", monospace', overflowY: 'auto' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/icon/logo.png" alt="logo" style={{ height: 32 }} onError={e => e.currentTarget.style.display = 'none'} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 3 }}>DASHBOARD</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', padding: '8px 20px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', letterSpacing: 1, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
            LOGOUT
          </button>
        </div>
      </div>

      <div style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 8 }}>// YOUR PROJECTS</div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 300, fontFamily: '"Montserrat", sans-serif' }}>
              {user?.name || 'Workspace'}
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '14px 32px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'inherit', letterSpacing: 2, textTransform: 'uppercase', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            + NEW PROJECT
          </button>
        </div>

        {error && <div style={{ color: '#ff1493', fontSize: '0.8rem', marginBottom: 24, padding: '12px 16px', border: '1px solid rgba(255,20,147,0.3)' }}>{error}</div>}

        {/* Projects grid */}
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: 2 }}>LOADING...</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 4, marginBottom: 16 }}>NO PROJECTS YET</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Create your first project to get started</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {projects.map(p => (
              <div
                key={p._id}
                onClick={() => navigate(`/workspace/${p._id}`)}
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: 28, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
              >
                {/* Stage badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: '0.65rem', color: stageColor[p.currentStage] || '#fff', letterSpacing: 3, border: `1px solid ${stageColor[p.currentStage]}33`, padding: '3px 10px' }}>
                    {stageLabel[p.currentStage] || p.currentStage.toUpperCase()}
                  </span>
                  <button
                    onClick={e => deleteProject(p._id, e)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff1493'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                  >×</button>
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}>{p.name}</h3>
                {p.description && <p style={{ margin: '0 0 20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{p.description}</p>}

                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>
                  {new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.12)', padding: 48, width: '100%', maxWidth: 480 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 24 }}>// NEW PROJECT</div>
            <h2 style={{ margin: '0 0 32px', fontFamily: '"Montserrat", sans-serif', fontWeight: 300, fontSize: '1.8rem' }}>Create Project</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                autoFocus
                placeholder="Project name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createProject()}
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <input
                placeholder="Description (optional)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                  CANCEL
                </button>
                <button onClick={createProject} disabled={creating || !newName.trim()} style={{ flex: 1, padding: '14px', background: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 700, letterSpacing: 1, opacity: (!newName.trim() || creating) ? 0.5 : 1 }}>
                  {creating ? 'CREATING...' : 'CREATE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
