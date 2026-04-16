import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { hydrate } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=' + (error || 'unknown'));
      return;
    }

    localStorage.setItem('accessToken', token);
    hydrate().then(() => navigate('/dashboard'));
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#000', color: '#fff',
      fontFamily: '"Space Mono", monospace', fontSize: '0.9rem',
      letterSpacing: '2px'
    }}>
      AUTHENTICATING...
    </div>
  );
};