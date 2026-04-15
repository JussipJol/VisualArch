import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const AnimatedConceptText = () => {
  const { t } = useLanguage();

  // Inject Isometric Stack styles and animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes floatPlate {
        0%, 100% { transform: translate(-50%, -50%) translateZ(var(--z-offset)); }
        50% { transform: translate(-50%, -50%) translateZ(calc(var(--z-offset) + 15px)); }
      }

      @keyframes beamSlide {
        0% { transform: translateX(-50%) translateY(250px); opacity: 0; }
        20% { opacity: 0.8; }
        80% { opacity: 0.8; }
        100% { transform: translateX(-50%) translateY(-350px); opacity: 0; }
      }

      @keyframes plateHighlight {
        0%, 100% { border-color: rgba(255,255,255,0.05); background: rgba(255,255,255,0.012); box-shadow: none; }
        10%, 30% { border-color: rgba(0,255,204,0.6); background: rgba(0,255,204,0.05); box-shadow: 0 0 40px rgba(0,255,204,0.2); }
      }

      @keyframes innerLabelAppear {
        0%, 100% { opacity: 0.3; transform: rotateZ(45deg) rotateX(-60deg) scale(0.9); filter: blur(2px); }
        10%, 30% { opacity: 1; transform: rotateZ(45deg) rotateX(-60deg) scale(1); filter: blur(0); }
      }

      .stack-container {
        position: relative;
        width: 100%;
        height: 700px;
        perspective: 1500px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 60px 0 0;
      }

      .stack-scene {
        position: relative;
        width: 320px;
        height: 320px;
        transform: rotateX(60deg) rotateZ(-45deg);
        transform-style: preserve-3d;
        margin-top: 140px; /* Shifted down significantly to clear any titles */
      }

      .tech-plate {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 240px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.015);
        backdrop-filter: blur(15px);
        transform-style: preserve-3d;
        transition: all 0.5s ease;
        animation: floatPlate 4s ease-in-out infinite, plateHighlight 10s infinite;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: inset 0 0 30px rgba(255,255,255,0.02);
      }

      .plate-1 { --z-offset: 0px; animation-delay: 0s, 0s; }
      .plate-2 { --z-offset: 100px; animation-delay: 0.5s, 2s; }
      .plate-3 { --z-offset: 200px; animation-delay: 1s, 4s; }
      .plate-4 { --z-offset: 300px; animation-delay: 1.5s, 6s; }
      .plate-5 { --z-offset: 400px; animation-delay: 2s, 8s; }

      .tech-label-inner {
        font-family: "Space Mono", monospace;
        font-size: 1.5rem;
        font-weight: 800;
        color: #fff;
        pointer-events: none;
        white-space: nowrap;
        text-shadow: 0 5px 20px rgba(0,0,0,0.9);
        z-index: 150;
        text-transform: uppercase;
        letter-spacing: 2px;
        /* Counter-rotate to stay vertical/flat to viewer */
        transform: rotateZ(45deg) rotateX(-60deg);
        animation: innerLabelAppear 10s infinite;
      }

      .plate-1 .tech-label-inner { animation-delay: 0s; }
      .plate-2 .tech-label-inner { animation-delay: 2s; }
      .plate-3 .tech-label-inner { animation-delay: 4s; }
      .plate-4 .tech-label-inner { animation-delay: 6s; }
      .plate-5 .tech-label-inner { animation-delay: 8s; }

      .data-beam {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 140px;
        background: linear-gradient(to top, transparent, #00ffcc, transparent);
        box-shadow: 0 0 20px #00ffcc;
        transform: translateX(-50%);
        z-index: 100;
        animation: beamSlide 3s linear infinite;
      }

      @media (max-width: 800px) {
         .stack-container { scale: 0.55; height: 500px; margin-top: 20px; }
         .tech-label-inner { font-size: 1.2rem; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div style={{ 
      color: '#fff', 
      textAlign: 'center', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      paddingTop: '100px' // Significantly lowered
    }}>
      
      <div className="anim-reveal-1" style={{ width: '100%' }}>
        <h2 style={{ 
          fontSize: '3.4rem', 
          fontWeight: 400, 
          lineHeight: '1.2',
          marginBottom: '25px', 
          letterSpacing: '-2px',
          fontFamily: '"Montserrat", "inter", sans-serif'
        }}>
          {t('concept.title1')} <br/>
          <span style={{ 
            fontWeight: 700, 
            fontFamily: '"Playfair Display", "Georgia", serif',
            fontSize: '4.2rem',
            color: '#fff',
            display: 'block',
            marginTop: '10px'
          }}>
            {t('concept.title2')}
          </span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', maxWidth: '450px', margin: '0 auto', fontFamily: '"Space Mono", monospace', lineHeight: '1.8' }}>
          {t('concept.desc')}
        </p>
      </div>

      <div className="stack-container anim-reveal-1">
        <div className="stack-scene">
          {/* Vertical Beam */}
          <div className="data-beam" style={{ animationDelay: '0s' }} />
          <div className="data-beam" style={{ animationDelay: '1.5s' }} />

          {/* Plates with nested labels for absolute 1:1 alignment */}
          <div className="tech-plate plate-1">
            <div className="tech-label-inner">{t('concept.node1')}</div>
          </div>
          <div className="tech-plate plate-2">
            <div className="tech-label-inner">{t('concept.node2')}</div>
          </div>
          <div className="tech-plate plate-3">
            <div className="tech-label-inner">{t('concept.node3')}</div>
          </div>
          <div className="tech-plate plate-4">
            <div className="tech-label-inner">{t('concept.node4')}</div>
          </div>
          <div className="tech-plate plate-5">
            <div className="tech-label-inner">{t('concept.node5')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
