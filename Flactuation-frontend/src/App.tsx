import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { JoinPage } from './pages/JoinPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';
import { useAuthStore } from './stores/auth.store';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuthStore();
  if (!token && !user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { user, token, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <div style={{
              position: 'absolute', top: 40, right: 50, zIndex: 999,
              display: 'flex', gap: '20px', alignItems: 'center'
            }}>
              <div
                onClick={toggleLang}
                style={{
                  display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px', padding: '2px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
                  width: '60px', height: '28px', position: 'relative', marginRight: '20px'
                }}>
                <div style={{
                  position: 'absolute', width: '26px', height: '24px', backgroundColor: '#fff', borderRadius: '15px',
                  top: '1px', left: lang === 'en' ? '2px' : '30px', transition: 'left 0.3s cubic-bezier(0.8, 0, 0.2, 1)', zIndex: 1
                }} />
                <div style={{ zIndex: 2, display: 'flex', width: '100%', justifyContent: 'space-around', fontSize: '0.65rem', fontWeight: 900, fontFamily: '"Space Mono", monospace' }}>
                  <span style={{ color: lang === 'en' ? '#000' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }}>EN</span>
                  <span style={{ color: lang === 'ru' ? '#000' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }}>RU</span>
                </div>
              </div>

              {token ? (
                <Link to="/dashboard" style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none',
                  color: '#ffffff', padding: '10px 24px', borderRadius: '30px',
                  fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, fontFamily: '"Space Mono", monospace',
                  letterSpacing: '1px', textTransform: 'uppercase', backdropFilter: 'blur(10px)', transition: 'all 0.4s ease',
                }}>DASHBOARD</Link>
              ) : (
                <>
                  <Link to="/login" style={{
                    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                    fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, fontFamily: '"Space Mono", monospace',
                    letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.4s ease'
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none',
                    color: '#ffffff', padding: '10px 24px', borderRadius: '30px',
                    fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, fontFamily: '"Space Mono", monospace',
                    letterSpacing: '1px', textTransform: 'uppercase', backdropFilter: 'blur(10px)', transition: 'all 0.4s ease',
                  }}>
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
            <LandingPage />
          </>
        } />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/join/:token" element={<JoinPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/workspace/:id" element={<PrivateRoute><WorkspacePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;