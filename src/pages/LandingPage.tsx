import { useState, useEffect } from 'react';
import { Fluctuation2DMain } from '../components/Fluctuation2DMain';
import { IDEAnimation } from '../components/IDEAnimation';
import { AnimatedConceptText } from '../components/AnimatedConceptText';
import { PreloaderBlock } from '../components/PreloaderBlock';
import { FeatureWheelSection } from '../components/FeatureWheelSection';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflowY: 'auto', overflowX: 'hidden', background: '#000000', scrollBehavior: 'smooth' }}>
      
      {/* SECTION 1: HERO */}
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      
      {/* Preloader Overlay */}
      <div 
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#000000', zIndex: 9999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          opacity: loading ? 1 : 0, 
          pointerEvents: loading ? 'auto' : 'none',
          transition: 'opacity 1s ease-in-out'
        }}
      >
        <div style={{ marginBottom: '40px' }}>
          <img src="/icon/logo.png" alt="FLACTUATION Logo" style={{ width: '280px', filter: 'drop-shadow(0 0 20px rgba(255,20,147,0.4))' }} onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
        <PreloaderBlock />
      </div>

      {/* MAIN PAGE */}
      <div 
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10,
          pointerEvents: 'auto', fontFamily: '"Arial Black", "Montserrat", sans-serif'
        }}
      >
        <Fluctuation2DMain />

        <div style={{ position: 'absolute', top: 40, left: 50, fontFamily: '"Space Mono", "Consolas", monospace', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', zIndex: 10, pointerEvents: 'none', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          <div>[SYS_INIT] NEURAL_CORE: <span style={{ color: '#00ffcc', textShadow: '0 0 10px #00ffcc' }}>ONLINE</span></div>
          <div style={{ marginTop: 8 }}>MODEL_V: <span style={{ color: '#ff1493', textShadow: '0 0 10px #ff1493' }}>FLACT_QUANTUM_1.0</span></div>
        </div>

        <div style={{ position: 'absolute', bottom: 40, right: 50, fontFamily: '"Space Mono", "Consolas", monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textAlign: 'right', zIndex: 10, pointerEvents: 'none' }}>
          <div>TENSOR_STREAM // ROOT_ACCESS</div>
          <div style={{ marginTop: 8 }}>LATENCY_MS: 0.008</div>
        </div>

        <div style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            pointerEvents: 'none', display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', alignItems: 'center' 
          }}
        >
          <div style={{ pointerEvents: 'auto', textAlign: 'center', position: 'relative' }}>
            
            {/* Logo above subtitle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img src="/icon/logo.png" alt="Logo" style={{ height: '60px', opacity: 0.9 }} onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>

            {/* Tech Subtitle */}
            <div style={{ marginBottom: '25px', fontFamily: '"Space Mono", "Consolas", monospace', color: 'rgba(255,255,255,0.6)', letterSpacing: '8px', fontSize: '1rem', textTransform: 'uppercase' }}>
              {t('hero.subtitle')}
            </div>

            <h1 style={{ 
                color: '#ffffff', 
                fontSize: '8rem', 
                margin: '0', 
                fontWeight: 900, 
                letterSpacing: '-0.05em',
                textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,20,147,0.3)',
                WebkitBoxReflect: 'below -12px linear-gradient(transparent, transparent 40%, rgba(255,255,255,0.4))'
              }}>
              FLACTUATION
            </h1>

          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div style={{ 
          position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', 
          display: 'flex', gap: '20px', justifyContent: 'center', zIndex: 20
        }}>
          <button style={{ 
              padding: '12px 36px', 
              background: '#ffffff', color: '#000000', 
              border: '1px solid #ffffff', borderRadius: '50px', fontSize: '0.9rem', 
              cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px',
              boxShadow: '0 4px 15px rgba(255,255,255,0.1)',
              transition: 'all 0.4s ease', fontFamily: '"Space Mono", "Consolas", monospace'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,255,255,0.1)'; }}
          >
            {t('hero.joinBtn')}
          </button>
          <button style={{ 
              padding: '12px 36px', 
              background: 'rgba(255,255,255,0.0)', color: 'rgba(255,255,255,0.5)', 
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.9rem', 
              cursor: 'pointer', fontWeight: 600, backdropFilter: 'blur(10px)', textTransform: 'uppercase', letterSpacing: '2px',
              transition: 'all 0.4s ease', fontFamily: '"Space Mono", "Consolas", monospace'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.0)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          >
            {t('hero.learnBtn')}
          </button>
        </div>
      </div>
    </div>

      {/* SECTION 2: PLATFORM CONCEPT */}
      <div style={{ 
        minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', 
        padding: '100px 50px', boxSizing: 'border-box', position: 'relative', zIndex: 20,
        background: 'transparent'
      }}>
        <div style={{ display: 'flex', gap: '60px', maxWidth: '1400px', margin: '0 auto', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 500px' }}>
            <IDEAnimation />
          </div>

          <div style={{ flex: '1 1 400px' }}>
            <AnimatedConceptText />
          </div>
          
        </div>
      </div>

      <FeatureWheelSection />
    </div>
  );
};
