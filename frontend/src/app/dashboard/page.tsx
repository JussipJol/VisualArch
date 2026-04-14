'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Zap, Bell, Settings, LogOut, GitFork, Users,
  Clock, TrendingUp, ShoppingBag, Search, Filter,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useWorkspaceStore } from '@/lib/store/workspace';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';
import { CreditsWidget } from '@/components/charts/CreditsWidget';

export default function DashboardPage() {
  const router = useRouter();
  const { user, fetchMe, logout } = useAuthStore();
  const { workspaces, fetchWorkspaces, createWorkspace, deleteWorkspace, loading } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'mine' | 'shared' | 'marketplace'>('mine');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMe();
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (!user && !loading) router.push('/login');
  }, [user, loading]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const ws = await createWorkspace(newName, newDesc);
      setShowNewModal(false);
      setNewName(''); setNewDesc('');
      router.push(`/workspace/${ws.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const filtered = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(search.toLowerCase())
  );

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-danger';

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-white/5 flex flex-col z-40">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">VisualArch AI</div>
              <div className="text-xs text-text-secondary">v3.0 ULTRA</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: Zap, label: 'Workspaces', href: '/dashboard', active: true },
            { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
            { icon: Settings, label: 'Settings', href: '/settings' },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          {/* Credits widget */}
          <CreditsWidget balance={user?.creditsBalance ?? 0} plan={user?.plan ?? 'free'} />
          <div className="mt-3 flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary truncate">{user?.name}</div>
              <div className="text-xs text-text-secondary truncate">{user?.plan} plan</div>
            </div>
            <button onClick={handleLogout} className="text-text-secondary hover:text-danger transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Good morning, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-text-secondary mt-1 text-sm">{workspaces.length} workspaces · {user?.creditsBalance} credits remaining</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-surface border border-white/5 text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent" />
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-btn bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all hover:shadow-glow-accent"
            >
              <Plus className="w-4 h-4" /> New Workspace
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-surface border border-white/5 w-fit mb-6">
          {(['mine', 'shared', 'marketplace'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}>
              {tab === 'mine' ? 'My Workspaces' : tab === 'shared' ? 'Shared with Me' : 'Marketplace'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-white/5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent/40"
          />
        </div>

        {/* Workspace grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-44 rounded-card bg-surface animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No workspaces yet</h3>
            <p className="text-text-secondary mb-6 text-sm">Create your first workspace and let AI design your architecture</p>
            <button onClick={() => setShowNewModal(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Create workspace
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(ws => (
              <div key={ws.id} className="group p-5 rounded-card bg-surface border border-white/5 hover:border-accent/20 transition-all cursor-pointer"
                onClick={() => router.push(`/workspace/${ws.id}`)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{ws.name}</h3>
                    {ws.description && <p className="text-xs text-text-secondary mt-0.5 truncate">{ws.description}</p>}
                  </div>
                  <ArchitectureScoreGauge score={ws.architectureScore} size="sm" />
                </div>

                {ws.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ws.techStack.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-surface-2 text-xs text-text-secondary">{t}</span>
                    ))}
                    {ws.techStack.length > 3 && <span className="text-xs text-text-secondary">+{ws.techStack.length - 3}</span>}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {ws.nodeCount ?? 0} nodes</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ws.collaborators ?? 0}</span>
                  <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" /> {new Date(ws.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {/* New workspace card */}
            <button onClick={() => setShowNewModal(true)}
              className="p-5 rounded-card border-2 border-dashed border-white/10 hover:border-accent/30 transition-all flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-accent min-h-[160px]">
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">New Workspace</span>
            </button>
          </div>
        )}
      </main>

      {/* New workspace modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowNewModal(false)}>
          <div className="w-full max-w-md p-6 rounded-card bg-surface border border-white/10 shadow-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Create New Workspace</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Workspace name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} required
                  placeholder="My Awesome Project" className="input-field w-full" autoFocus />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Description (optional)</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                  placeholder="Brief project description..." className="input-field w-full" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 rounded-btn bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-60 transition-all">
                  {creating ? 'Creating...' : 'Create (−5 credits)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .btn-primary { background: #5E81F4; color: white; padding: 10px 20px; border-radius: 10px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; font-size: 14px; }
        .btn-primary:hover { background: rgba(94,129,244,0.9); box-shadow: 0 0 20px rgba(94,129,244,0.3); }
        .input-field { background: #1E2A45; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #EAEEFF; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #5E81F4; }
        .input-field::placeholder { color: #8B8FA8; }
      `}</style>
    </div>
  );
}
