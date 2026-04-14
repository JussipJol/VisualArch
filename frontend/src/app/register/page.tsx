'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, user, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await register(email, password, name);
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
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-text-secondary text-sm mt-2">Start with 100 free AI credits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Full name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="input-field w-full" placeholder="Alex Smith" />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field w-full" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="input-field w-full pr-10" placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                {PASSWORD_RULES.map(rule => (
                  <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? 'text-success' : 'text-text-secondary'}`}>
                    <Check className="w-3 h-3" /> {rule.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-60 transition-all">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-xs text-text-secondary text-center">
          By registering you agree to our Terms of Service and Privacy Policy
        </p>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </div>
      </div>

      <style jsx global>{`
        .input-field { background: #16213E; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #EAEEFF; font-size: 14px; outline: none; transition: border-color 0.2s; width: 100%; }
        .input-field:focus { border-color: #5E81F4; box-shadow: 0 0 0 3px rgba(94,129,244,0.15); }
        .input-field::placeholder { color: #8B8FA8; }
      `}</style>
    </div>
  );
}
