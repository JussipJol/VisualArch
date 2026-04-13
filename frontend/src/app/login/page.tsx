'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, user, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-secondary text-sm mt-2">Sign in to your VisualArch workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field w-full"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input-field w-full pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-60 transition-all">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent hover:underline">Sign up free</Link>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-surface border border-white/5 text-xs text-text-secondary text-center">
          Demo: <span className="text-accent">demo@visualarch.ai</span> / <span className="text-accent">demo123456</span>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          background: #16213E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          color: #EAEEFF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #5E81F4; box-shadow: 0 0 0 3px rgba(94,129,244,0.15); }
        .input-field::placeholder { color: #8B8FA8; }
      `}</style>
    </div>
  );
}
