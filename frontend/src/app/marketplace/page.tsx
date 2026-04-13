'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, GitFork, ArrowRight, Zap, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  authorName: string;
  isPremium: boolean;
  price: number;
  useCount: number;
  rating: number;
  nodeCount: number;
  createdAt: string;
}

const CATEGORIES = ['All', 'E-commerce', 'SaaS', 'Microservices', 'Realtime', 'Mobile', 'AI/ML'];

export default function MarketplacePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        if (search) params.set('q', search);
        const res = await api.get<{ data: Template[] }>(`/api/templates?${params}`);
        setTemplates(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, category]);

  const handleUse = async (templateId: string) => {
    try {
      const res = await api.post<{ data: { id: string } }>(`/api/templates/${templateId}/use`);
      router.push(`/workspace/${res.data.id}`);
    } catch (err: any) {
      alert(err.message ?? 'Failed to use template');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-white/5 bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/dashboard" className="text-text-secondary text-sm hover:text-text-primary mb-2 inline-block">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-text-primary">Architecture Marketplace</h1>
              <p className="text-text-secondary text-sm mt-1">Discover and use production-ready architecture templates</p>
            </div>
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-btn bg-accent text-white text-sm hover:bg-accent/90 transition-colors">
              <Zap className="w-4 h-4" /> Publish Template
            </Link>
          </div>

          {/* Search + filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search architectures..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-white/10 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent/40"
              />
            </div>
            <div className="flex gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'bg-accent text-white' : 'bg-surface border border-white/10 text-text-secondary hover:text-text-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-card bg-surface animate-pulse" />)}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">
            <p>No templates found. Be the first to publish one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <div key={t.id} className="group p-5 rounded-card bg-surface border border-white/5 hover:border-accent/20 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text-primary truncate">{t.title}</h3>
                      {t.isPremium && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs bg-warning/20 text-warning">PRO</span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{t.category} · by {t.authorName}</p>
                  </div>
                  <ArchitectureScoreGauge score={75 + Math.floor(Math.random() * 25)} size="sm" />
                </div>

                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{t.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {t.techStack.slice(0, 4).map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded-full bg-surface-2 text-xs text-text-secondary">{tech}</span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning" /> {t.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {t.useCount.toLocaleString()}
                  </span>
                  <span>{t.nodeCount} nodes</span>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleUse(t.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent text-white text-sm hover:bg-accent/90 transition-colors"
                  >
                    {t.isPremium ? `Use (${t.price} credits)` : 'Use Free'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
