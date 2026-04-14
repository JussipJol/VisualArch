'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Check } from 'lucide-react';
import { api } from '@/lib/api';

const PLATFORMS = [
  { id: 'vercel-railway', label: 'Vercel + Railway', desc: 'Frontend on Vercel, API on Railway' },
  { id: 'digitalocean', label: 'DigitalOcean App Platform', desc: 'Full stack on DO' },
  { id: 'fly-io', label: 'Fly.io', desc: 'Global edge deployment' },
  { id: 'aws', label: 'AWS (Amplify + ECS)', desc: 'Enterprise AWS stack' },
];

export default function ExportPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [platform, setPlatform] = useState('vercel-railway');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState(1);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post<{ data: any }>(`/api/workspaces/${id}/export`, { platform });
      setResult(res.data);
      setStep(3);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to workspace
        </button>

        <h1 className="text-2xl font-bold text-text-primary mb-2">CI/CD Pipeline Generator</h1>
        <p className="text-text-secondary mb-8">Generate a complete deployment configuration for your architecture</p>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-accent text-white' : 'bg-surface border border-white/10 text-text-secondary'}`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm ${step >= s ? 'text-text-primary' : 'text-text-secondary'}`}>
                {s === 1 ? 'Platform' : s === 2 ? 'Configure' : 'Download'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Step 1: Platform selection */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary mb-4">Select Target Platform</h2>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${platform === p.id ? 'border-accent bg-accent/10' : 'border-white/10 bg-surface hover:border-white/20'}`}>
                <div className="font-medium text-text-primary text-sm">{p.label}</div>
                <div className="text-xs text-text-secondary mt-0.5">{p.desc}</div>
              </button>
            ))}
            <button onClick={() => setStep(2)} className="mt-4 w-full py-3 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 transition-colors">
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-text-primary mb-4">Configuration</h2>
            <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Branch strategy</label>
                <select className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary outline-none">
                  <option>main → production, develop → staging</option>
                  <option>main only → production</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Generated files</label>
                <div className="space-y-1">
                  {['.github/workflows/ci.yml', 'Dockerfile', 'docker-compose.yml', '.env.example', 'README.md'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-text-secondary">
                      <Check className="w-3 h-3 text-success" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary text-sm transition-colors">
                ← Back
              </button>
              <button onClick={handleGenerate} disabled={generating} className="flex-1 py-3 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-60 transition-colors">
                {generating ? 'Generating...' : 'Generate (−15 credits)'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-text-primary mb-4">✅ CI/CD Config Ready</h2>
            <div className="p-4 rounded-xl bg-surface border border-white/10">
              <div className="text-xs text-text-secondary mb-2 font-mono">github/workflows/ci.yml</div>
              <pre className="text-xs text-text-secondary font-mono overflow-auto max-h-64 whitespace-pre-wrap">{result.cicdYaml?.slice(0, 800)}...</pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([result.cicdYaml], { type: 'text/yaml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'ci.yml'; a.click();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-btn bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Download className="w-4 h-4" /> Download ci.yml
              </button>
              <button onClick={() => router.back()} className="flex-1 py-3 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary text-sm transition-colors">
                Back to workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
