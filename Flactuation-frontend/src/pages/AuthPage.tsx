import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export const AuthPage = ({ mode }: { mode: 'login' | 'register' }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login, register, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); return; }
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor: '#000000', color: '#fff', fontFamily: '"Space Mono", monospace' }}>

      {/* LEFT: Branding */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <Link to="/">
            <img src="/icon/logo.png" alt="FLACTUATION" style={{ width: '150px', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))', cursor: 'pointer', transition: 'filter 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(255,255,255,0.4))'}
              onMouseLeave={e => e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'}
            />
          </Link>
          <div style={{ marginTop: '30px', fontSize: '0.8rem', letterSpacing: '4px', color: 'rgba(255,255,255,0.3)' }}>
            V-ENGINE // AUTH
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%', position: 'relative' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>

          <h2 style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '2.5rem', fontWeight: 300, marginBottom: '10px' }}>
            {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '40px', lineHeight: '1.6' }}>
            {isLogin ? t('auth.loginSub') : t('auth.registerSub')}
          </p>

          {error && (
            <div style={{ marginBottom: 20, padding: '12px 16px', border: '1px solid rgba(255,20,147,0.3)', color: '#ff1493', fontSize: '0.8rem', background: 'rgba(255,20,147,0.05)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {!isLogin && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            )}

            <input
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />

            <input
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '16px', backgroundColor: loading ? 'rgba(255,255,255,0.7)' : '#fff', color: '#000', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px', transition: 'all 0.3s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#fff'; }}
            >
              {loading ? 'PROCESSING...' : isLogin ? t('auth.loginBtn') : t('auth.registerBtn')}
            </button>
          </form>

          <div style={{ margin: '40px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>{t('auth.continueWith')}</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            {[
<<<<<<< HEAD
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg> },
              { icon: <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/></svg> },
            ].map((btn, i) => (
              <button key={i} style={{ flex: 1, padding: '12px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}
=======
              { id: 'github', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
              { id: 'google', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg> },
              { id: 'discord', icon: <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/></svg> },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => {
                  window.location.href = `http://localhost:3001/api/auth/${btn.id}`;
                }}
                style={{ flex: 1, padding: '12px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}
>>>>>>> 48106fb (update project)
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                {btn.icon}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '40px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <Link to={isLogin ? '/register' : '/login'} style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
              {isLogin ? t('auth.registerBtn') : t('auth.loginBtn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
