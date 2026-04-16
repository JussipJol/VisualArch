import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { api } from '../api/client';
import { localProjects } from '../api/localProjects';
import { ConfirmModal } from '../components/ConfirmModal';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { SystemStatus } from '../components/dashboard/SystemStatus';
import { StarterTemplates } from '../components/dashboard/StarterTemplates';

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

// Сколько ghost-карточек показывать минимально (заполняем до кратного 3)
const GHOST_MIN = 3;

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
  const [backendOffline, setBackendOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ping] = useState(() => Math.floor(Math.random() * 20) + 5);

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      const local = localProjects.getAll();
      const merged = [...local, ...data.projects];
      setProjects(merged);
      setBackendOffline(false);
    } catch (err: unknown) {
      const isNetworkError = (err as { code?: string })?.code === 'ERR_NETWORK'
        || (err as { message?: string })?.message?.includes('Network Error');
      if (isNetworkError) {
        setProjects(localProjects.getAll());
        setBackendOffline(true);
      } else {
        setError('Failed to load projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newName.trim()) return;

    if (backendOffline) {
      const project = localProjects.create(newName, newDesc);
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      navigate(`/workspace/${project._id}`);
      return;
    }

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
    setConfirmDelete(id);
  };

  const doDelete = async (id: string) => {
    if (localProjects.isLocalId(id)) {
      localProjects.delete(id);
      setProjects(p => p.filter(x => x._id !== id));
      return;
    }
    await api.delete(`/projects/${id}`).catch(() => {});
    setProjects(p => p.filter(x => x._id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Отфильтрованные проекты по поисковому запросу
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  // Ghost cards: заполняем пустые слоты до минимума
  const ghostCount = Math.max(0, GHOST_MIN - filteredProjects.length);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: '"Space Mono", monospace',
      overflowY: 'auto',
      position: 'relative',
    }}>

      {/* ── Фоновая сетка с fade-to-black к низу ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)',
      }} />

      {/* ── Эффект фонарика от курсора ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle 35vw at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 40%, transparent 70%)`,
          transition: 'background 0.05s linear',
        }}
      />

      {/* ── Все модалки ── */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && doDelete(confirmDelete)}
        title="Удалить проект?"
        message="Это действие необратимо. Проект будет удалён навсегда."
        confirmLabel="Удалить"
        danger
      />
      <ConfirmModal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Выйти из аккаунта?"
        message="Вы будете перенаправлены на главную страницу."
        confirmLabel="Выйти"
      />

      {/* ── Top bar ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/icon/logo.png" alt="logo" style={{ height: 32 }} onError={e => e.currentTarget.style.display = 'none'} />
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', letterSpacing: 4 }}>DASHBOARD</span>
          {backendOffline && (
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,165,0,0.8)', letterSpacing: 2, border: '1px solid rgba(255,165,0,0.3)', padding: '2px 8px' }}>
              OFFLINE MODE
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} ref={userMenuRef}>
          {/* User dropdown menu */}
          <div style={{ position: 'relative' }}>
            <button
              id="user-menu-trigger"
              onClick={() => setIsUserMenuOpen(v => !v)}
              style={{
                background: 'transparent',
                border: `1px solid ${isUserMenuOpen ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)'}`,
                color: isUserMenuOpen ? '#fff' : 'rgba(255,255,255,0.55)',
                padding: '8px 16px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.72rem',
                letterSpacing: 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => { if (!isUserMenuOpen) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!isUserMenuOpen) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
            >
              <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || 'ACCOUNT'}
              </span>
              <span style={{ fontSize: '0.6rem', opacity: 0.7, transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
            </button>

            {/* Dropdown panel */}
            {isUserMenuOpen && (
              <div
                id="user-menu-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: 200,
                  background: 'rgba(8,8,8,0.97)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(16px)',
                  zIndex: 999,
                  overflow: 'hidden',
                  animation: 'dropdownFadeIn 0.15s ease',
                }}
              >
                {/* User info header */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 2 }}>SIGNED IN AS</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                </div>

                {/* Main Menu link */}
                <Link
                  id="user-menu-home"
                  to="/"
                  onClick={() => setIsUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.72rem',
                    letterSpacing: 1,
                    transition: 'all 0.15s',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <span style={{ opacity: 0.5 }}>←</span> ГЛАВНОЕ МЕНЮ
                </Link>

                {/* Logout button */}
                <button
                  id="user-menu-logout"
                  onClick={() => { setIsUserMenuOpen(false); setConfirmLogout(true); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,80,80,0.7)',
                    fontSize: '0.72rem',
                    letterSpacing: 1,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,30,30,0.08)'; e.currentTarget.style.color = 'rgba(255,100,100,1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,80,80,0.7)'; }}
                >
                  <span style={{ opacity: 0.6 }}>⏻</span> ВЫЙТИ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Основной контент ── */}
      <div style={{ padding: '40px 48px 60px', maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
          {/* Левая (основная) колонка */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 4, marginBottom: 8 }}>
              // YOUR PROJECTS
            </div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 300, fontFamily: '"Montserrat", sans-serif' }}>
              {user?.name || 'Workspace'}
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '14px 32px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'inherit', letterSpacing: 2, textTransform: 'uppercase', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            + NEW PROJECT
          </button>
        </div>

        {/* ── Search bar ── */}
        <div style={{ position: 'relative', marginBottom: 36 }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', pointerEvents: 'none',
            letterSpacing: 2, whiteSpace: 'nowrap', userSelect: 'none',
          }}>[ / ]</span>
          <div style={{
            position: 'absolute', left: 52, top: 0, bottom: 0,
            width: '1px', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 66px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              letterSpacing: 0.5,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem',
              }}
            >×</button>
          )}
        </div>

        {error && (
          <div style={{ color: '#ff1493', fontSize: '0.8rem', marginBottom: 24, padding: '12px 16px', border: '1px solid rgba(255,20,147,0.3)' }}>
            {error}
          </div>
        )}

        {/* ── Projects grid ── */}
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', letterSpacing: 3 }}>LOADING...</div>
        ) : (
          <>
            {filteredProjects.length === 0 && searchQuery && (
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', letterSpacing: 2, marginBottom: 24 }}>
                // NO RESULTS FOR "{searchQuery.toUpperCase()}"
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>

              {/* Real project cards */}
              {filteredProjects.map(p => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/workspace/${p._id}`)}
                  style={{
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'rgba(255,255,255,0.03)',
                    padding: 24, cursor: 'pointer',
                    transition: 'all 0.2s', position: 'relative',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  {/* Stage badge + delete */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: '0.6rem', color: stageColor[p.currentStage] || '#fff', letterSpacing: 3, border: `1px solid ${stageColor[p.currentStage] || '#fff'}33`, padding: '3px 10px' }}>
                      {stageLabel[p.currentStage] || p.currentStage?.toUpperCase()}
                    </span>
                    <button
                      onClick={e => deleteProject(p._id, e)}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ff1493'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                    >×</button>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}>
                    {p.name}
                  </h3>
                  {p.description && (
                    <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                      {p.description}
                    </p>
                  )}
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
                    {new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}

              {/* Ghost cards — пустые слоты */}
              {!searchQuery && Array.from({ length: ghostCount }).map((_, i) => (
                <div
                  key={`ghost-${i}`}
                  onClick={() => setShowModal(true)}
                  style={{
                    border: '1px dashed rgba(255,255,255,0.18)',
                    background: 'transparent',
                    padding: 24,
                    cursor: 'pointer',
                    opacity: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 140,
                    transition: 'opacity 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.8'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.35)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.5'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)'; }}
                >
                  <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>+</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: 2 }}>EMPTY SLOT</div>
                </div>
              ))}

            </div>
          </>
        )}

        <StarterTemplates onSelect={() => setShowModal(true)} />

          </div>{/* // Конец левой колонки */}

          {/* Правая колонка */}
          <ActivityFeed />

        </div>{/* // Конец flex-контейнера */}

        <SystemStatus />
      </div>

      {/* ── Create project modal ── */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.12)', padding: 48, width: '100%', maxWidth: 480 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 24 }}>// NEW PROJECT</div>
            <h2 style={{ margin: '0 0 32px', fontFamily: '"Montserrat", sans-serif', fontWeight: 300, fontSize: '1.8rem' }}>Create Project</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                autoFocus
                placeholder="Project name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createProject()}
                style={{ width: '100%', padding: '14px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <input
                placeholder="Description (optional)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                style={{ width: '100%', padding: '14px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' }}>
                  CANCEL
                </button>
                <button onClick={createProject} disabled={creating || !newName.trim()} style={{ flex: 1, padding: '14px', background: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, opacity: (!newName.trim() || creating) ? 0.5 : 1 }}>
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
