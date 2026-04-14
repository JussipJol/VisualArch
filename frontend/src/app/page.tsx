'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, Shield, Users, Code2, ArrowRight, Star, GitFork,
  Brain, Eye, GitBranch, ChevronRight, Play,
} from 'lucide-react';

const MOCK_GENERATION_STEPS = [
  '🔍 Retrieving project memory...',
  '🧠 Planner analyzing requirements...',
  '⚡ Generating API Gateway component...',
  '⚡ Generating Auth Service...',
  '⚡ Generating Product Service...',
  '🔮 Critic reviewing architecture...',
  '✅ Score: 87/100 — Architecture ready!',
];

const FEATURES = [
  { icon: Brain, label: 'Persistent Memory', color: 'text-purple', desc: 'AI remembers all past decisions and patterns' },
  { icon: Eye, label: 'Architecture Critic', color: 'text-warning', desc: 'Automatic anti-pattern detection & fixes' },
  { icon: Users, label: 'Real-time Collab', color: 'text-accent', desc: 'Multiplayer workspace with live cursors' },
  { icon: GitBranch, label: 'CI/CD Generator', color: 'text-success', desc: 'One-click GitHub Actions + Docker setup' },
  { icon: Code2, label: 'Test Scaffolding', color: 'text-accent-2', desc: 'Unit, integration & E2E tests per node' },
  { icon: Star, label: 'Marketplace', color: 'text-danger', desc: 'Share & sell architecture templates' },
];

const STATS = [
  { label: 'Workspaces Created', value: '24,817' },
  { label: 'Components Generated', value: '412K+' },
  { label: 'Architecture Score Avg', value: '82/100' },
  { label: 'Hours Saved', value: '180K+' },
];

const PRICING = [
  {
    name: 'Free', price: '$0', credits: '100 credits/mo', color: 'border-surface-2',
    features: ['3 workspaces', 'Basic generation', 'Public templates', 'Community support'],
    cta: 'Get Started',
  },
  {
    name: 'Pro', price: '$19', credits: '2,000 credits/mo', color: 'border-accent', badge: 'Most Popular',
    features: ['Unlimited workspaces', 'AI Critic + Memory', 'Collaboration (5 users)', 'Priority AI', 'CI/CD export', 'History rollback'],
    cta: 'Start Pro',
  },
  {
    name: 'Team', price: '$49', credits: '10,000 credits/mo', color: 'border-accent-2',
    features: ['20 team members', 'Admin dashboard', 'SSO ready', 'Plugin marketplace', 'Architecture DSL', 'SLA 99.9%'],
    cta: 'Start Team',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [demoStep, setDemoStep] = useState(-1);
  const [prompt, setPrompt] = useState('');
  const [isRunningDemo, setIsRunningDemo] = useState(false);

  const runDemo = async () => {
    if (!prompt.trim()) return;
    setIsRunningDemo(true);
    setDemoStep(0);
    for (let i = 0; i < MOCK_GENERATION_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      setDemoStep(i);
    }
    setIsRunningDemo(false);
  };

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-text-primary">VisualArch AI</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">v3.0</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          <Link href="/marketplace" className="hover:text-text-primary transition-colors">Marketplace</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Log in</Link>
          <Link href="/register" className="btn-primary text-sm">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>New: Architecture Memory + Real-time Collaboration</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Living Architecture</span>
            <br />
            <span className="text-text-primary">Platform</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            AI that designs, codes, reviews and evolves your software architecture. From prompt to production-ready system in minutes.
          </p>

          {/* Interactive demo prompt */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-2 p-2 rounded-xl bg-surface border border-white/10 shadow-card">
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runDemo()}
                placeholder="e.g. Build a microservices e-commerce platform with Next.js and MongoDB..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none"
              />
              <button
                onClick={runDemo}
                disabled={isRunningDemo || !prompt.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                {isRunningDemo ? 'Generating...' : 'Try Demo'}
              </button>
            </div>

            {/* Demo output */}
            {demoStep >= 0 && (
              <div className="mt-3 p-4 rounded-xl bg-surface border border-white/10 text-left text-sm font-mono space-y-1">
                {MOCK_GENERATION_STEPS.slice(0, demoStep + 1).map((step, i) => (
                  <div
                    key={i}
                    className={`${i === demoStep && isRunningDemo ? 'text-accent streaming' : 'text-text-secondary'} transition-all`}
                  >
                    {step}
                  </div>
                ))}
                {!isRunningDemo && demoStep === MOCK_GENERATION_STEPS.length - 1 && (
                  <Link href="/register" className="mt-2 flex items-center gap-1 text-accent hover:underline">
                    See full architecture → <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all text-base">
              View Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">14 Killer Features</h2>
            <p className="text-text-secondary text-lg">Everything you need to go from idea to production architecture</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, label, color, desc }) => (
              <div key={label} className="p-6 rounded-card bg-surface border border-white/5 hover:border-accent/20 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{label}</h3>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-text-secondary">Start free, scale as you grow. Credits never expire.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map(plan => (
              <div key={plan.name} className={`relative p-6 rounded-card bg-surface border-2 ${plan.color} transition-all hover:shadow-glow-accent`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm text-text-secondary mb-1">{plan.name}</div>
                  <div className="text-4xl font-bold text-text-primary">{plan.price}<span className="text-lg text-text-secondary">/mo</span></div>
                  <div className="text-sm text-accent mt-1">{plan.credits}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <ChevronRight className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded-btn text-sm font-medium transition-all ${plan.name === 'Pro' ? 'bg-accent text-white hover:bg-accent/90' : 'border border-white/10 text-text-primary hover:border-accent/30'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to build smarter?</h2>
          <p className="text-text-secondary mb-8">Join thousands of developers using AI to design production-ready architectures</p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
            Start for free — no credit card required <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="text-sm text-text-secondary">VisualArch AI v3.0 · L99 ULTRA Edition</span>
          </div>
          <div className="flex gap-6 text-sm text-text-secondary">
            <Link href="/marketplace" className="hover:text-text-primary transition-colors">Marketplace</Link>
            <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .btn-primary {
          background: linear-gradient(135deg, #5E81F4, #4B6CD9);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(94,129,244,0.4);
        }
      `}</style>
    </div>
  );
}
