import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const AnimatedConceptText = () => {
  const { t } = useLanguage();

  // Inject strict minimalist keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes subtleReveal {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* Sequential node illumination over a 9 second loop */
      @keyframes traverseHighlighter1 {
        0%, 100% { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.01); }
        15%, 33% { border-color: rgba(255,255,255,0.6); color: rgba(255,255,255,1); background: rgba(255,255,255,0.05); }
      }
      @keyframes traverseHighlighter2 {
        0%, 33%, 100% { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.01); }
        48%, 66% { border-color: rgba(255,255,255,0.6); color: rgba(255,255,255,1); background: rgba(255,255,255,0.05); }
      }
      @keyframes traverseHighlighter3 {
        0%, 66%, 100% { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.01); }
        81%, 95% { border-color: rgba(255,255,255,0.6); color: rgba(255,255,255,1); background: rgba(255,255,255,0.05); }
      }

      .minimal-node {
        padding: 14px 28px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 4px;
        background: rgba(255,255,255,0.01);
        font-family: "Space Mono", "Consolas", monospace;
        letter-spacing: 1px;
        font-size: 0.95rem;
        transition: all 0.4s ease;
      }

      /* Staggered reveal for diplomatic high-end feel */
      .anim-reveal-1 { animation: subtleReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s both; }
      .anim-reveal-2 { animation: subtleReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s both; }
      .anim-reveal-3 { animation: subtleReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s both; }
      .anim-reveal-4 { animation: subtleReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.55s both; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ color: '#fff', fontFamily: '"inter", "Montserrat", sans-serif', maxWidth: '600px' }}>
      
      <div className="anim-reveal-1">
        <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '20px', letterSpacing: '-2px', color: '#fff' }}>
          {t('concept.title1')} <br/><span style={{ fontWeight: 600, color: '#fff' }}>{t('concept.title2')}</span>
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', maxWidth: '400px', fontWeight: 400, fontFamily: '"Space Mono", monospace' }}>
          {t('concept.desc')}
        </p>
      </div>
      
      {/* Sleek Pipeline Interface */}
      <div className="anim-reveal-3" style={{ 
        display: 'flex', 
        gap: '16px', 
        alignItems: 'center', 
        marginBottom: '48px',
        marginTop: '48px',
        flexWrap: 'wrap' 
      }}>
        <div className="minimal-node" style={{ animation: 'traverseHighlighter1 4.5s ease-in-out infinite' }}>
          <span style={{ position: 'relative', zIndex: 2 }}>{t('concept.node1')}</span>
        </div>
        
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>→</div>
        
        <div className="minimal-node" style={{ animation: 'traverseHighlighter2 4.5s ease-in-out infinite' }}>
           <span style={{ position: 'relative', zIndex: 2 }}>{t('concept.node2')}</span>
        </div>
        
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>→</div>
        
        <div className="minimal-node" style={{ animation: 'traverseHighlighter3 4.5s ease-in-out infinite' }}>
           <span style={{ position: 'relative', zIndex: 2 }}>{t('concept.node3')}</span>
        </div>
      </div>
      
      <p className="anim-reveal-4" style={{ 
        marginTop: '30px', 
        fontSize: '1.1rem', 
        color: 'rgba(255,255,255,0.5)', 
        lineHeight: '1.8', 
        fontWeight: 400, 
        fontFamily: '"Space Mono", monospace' 
      }}>
        {t('concept.desc2')}
      </p>
    </div>
  );
};
