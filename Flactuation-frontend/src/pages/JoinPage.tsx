import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/auth.store';

export const JoinPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'preview' | 'joining' | 'success' | 'error'>('loading');
  const [projectName, setProjectName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Invalid invite link');
      return;
    }
    // Try to decode the token to preview the project (without joining)
    // We just set status to 'preview' and wait for user to click
    setStatus('preview');
  }, [token]);

  const handleJoin = async () => {
    if (!token) return;
    if (!user) {
      // Save token to sessionStorage and redirect to login
      sessionStorage.setItem('pendingInviteToken', token);
      navigate('/login');
      return;
    }
    setStatus('joining');
    try {
      const { data } = await api.post('/invite/join', { token });
      setProjectId(data.project._id);
      setProjectName(data.project.name);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.response?.data?.error || 'Failed to join. The link may have expired.');
    }
  };

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Space Mono", monospace',
    color: '#fff',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    padding: '48px 56px',
    maxWidth: 480,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    textAlign: 'center',
  };

  if (status === 'loading') {
    return (
      <div style={containerStyle}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: 4 }}>LOADING...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, borderColor: 'rgba(255,20,147,0.2)' }}>
          <div style={{ fontSize: '1.5rem' }}>⛔</div>
          <div style={{ fontSize: '0.8rem', letterSpacing: 3, color: '#ff1493' }}>INVALID INVITE</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.6 }}>{errorMsg}</p>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', letterSpacing: 2 }}>
            GO HOME
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, borderColor: 'rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: '2rem' }}>✅</div>
          <div style={{ fontSize: '0.8rem', letterSpacing: 3, color: '#10b981' }}>JOINED SUCCESSFULLY</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            You now have access to <strong style={{ color: '#fff' }}>{projectName}</strong>
          </p>
          <button
            onClick={() => navigate(`/workspace/${projectId}`)}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, transition: 'all 0.2s' }}
          >
            OPEN WORKSPACE →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Logo / Brand */}
        <div style={{ fontSize: '0.65rem', letterSpacing: 4, color: 'rgba(255,255,255,0.25)', marginBottom: -8 }}>
          VISUALFLOW
        </div>

        {/* Icon */}
        <div style={{ fontSize: '2.5rem' }}>🔗</div>

        <div>
          <div style={{ fontSize: '0.8rem', letterSpacing: 3, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            WORKSPACE INVITATION
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.8, margin: 0 }}>
            You've been invited to collaborate on a VisualFlow workspace.
            {!user && (
              <><br />You'll need to log in first.</>
            )}
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
          <button
            onClick={handleJoin}
            disabled={status === 'joining'}
            style={{
              width: '100%',
              background: status === 'joining' ? 'transparent' : '#fff',
              color: status === 'joining' ? 'rgba(255,255,255,0.4)' : '#000',
              border: `1px solid ${status === 'joining' ? 'rgba(255,255,255,0.2)' : '#fff'}`,
              padding: '16px',
              cursor: status === 'joining' ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: 2,
              transition: 'all 0.2s',
            }}
          >
            {status === 'joining' ? 'JOINING...' : user ? 'ACCEPT & OPEN WORKSPACE' : 'LOG IN TO ACCEPT'}
          </button>
        </div>

        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>
          This invite link expires in 7 days
        </div>
      </div>
    </div>
  );
};
