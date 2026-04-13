import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

const AppContent = () => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <Router>
      {/* Global Header */}
      <div style={{
        position: 'absolute', top: 40, right: 50, zIndex: 999,
        display: 'flex', gap: '20px', alignItems: 'center'
      }}>
        {/* Language Toggle */}
        <div 
          onClick={toggleLang}
          style={{ 
            display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: '20px', padding: '2px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
            width: '60px', height: '28px', position: 'relative', marginRight: '20px'
          }}>
          <div style={{ 
            position: 'absolute', width: '26px', height: '24px', backgroundColor: '#fff', borderRadius: '15px',
            top: '1px', left: lang === 'en' ? '2px' : '30px', transition: 'left 0.3s cubic-bezier(0.8, 0, 0.2, 1)',
            zIndex: 1
          }} />
          <div style={{ zIndex: 2, display: 'flex', width: '100%', justifyContent: 'space-around', fontSize: '0.65rem', fontWeight: 900, fontFamily: '"Space Mono", monospace' }}>
            <span style={{ color: lang === 'en' ? '#000' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }}>EN</span>
            <span style={{ color: lang === 'ru' ? '#000' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }}>RU</span>
          </div>
        </div>

        <Link to="/login" style={{ 
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, fontFamily: '"Space Mono", "Consolas", monospace', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.4s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          {t('nav.login')}
        </Link>
        <Link to="/register" style={{ 
          background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.2)', textDecoration: 'none',
          color: '#ffffff', padding: '10px 24px', borderRadius: '30px', 
          fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, fontFamily: '"Space Mono", "Consolas", monospace', letterSpacing: '1px', textTransform: 'uppercase',
          backdropFilter: 'blur(10px)', transition: 'all 0.4s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
        >
          {t('nav.register')}
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
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
