import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const FeatureWheelSection = () => {
  const [activeFeature, setActiveFeature] = useState('value-1');
  const { t } = useLanguage();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --accent: #ffffff;
        --panel-bg: #000000;
        --wheel-bg: #050505;
        --text-active: #ffffff;
        --text-idle: rgba(255, 255, 255, 0.2);
      }

      .wheel-selector {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hint-pop {
        position: absolute;
        top: -40px;
        font-family: "Space Mono", monospace;
        font-weight: 600;
        font-size: 0.7rem;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.4);
        text-transform: uppercase;
        animation: pulseHint 2s infinite ease-in-out;
        pointer-events: none;
      }

      @keyframes pulseHint {
        0%, 100% { opacity: 0.5; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(-3px); }
      }

      .radio-input {
        position: relative;
        height: 320px;
        width: 340px;
        background: #000000;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px; /* More tech-like squircle */
        overflow: hidden;
        display: flex;
        align-items: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.02);
      }

      .radio-input::after {
        content: "";
        position: absolute;
        right: -150px;
        width: 400px;
        height: 400px;
        background: repeating-conic-gradient(
          from 0deg,
          #050505 0deg 10deg,
          #0a0a0a 10deg 20deg
        );
        border-radius: 50%;
        z-index: 1;
        opacity: 0.8;
      }

      .radio-input::before {
        content: "";
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background: var(--accent);
        border-radius: 50%;
        z-index: 30;
        box-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent);
        pointer-events: none;
      }

      .radio-input input {
        display: none;
      }

      .glass-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.08) 0%,
          rgba(255, 255, 255, 0) 40%,
          rgba(0, 0, 0, 0.8) 100%
        );
        z-index: 25;
        pointer-events: none;
      }

      .wheel-label {
        position: absolute;
        left: 45px;
        display: flex;
        flex-direction: column;
        transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        transform-origin: 320px center;
        transform: rotate(var(--angle));
        filter: blur(2px);
        opacity: 0.1;
        z-index: 5;
      }

      .wheel-label .num {
        font-family: "Space Mono", monospace;
        font-weight: 600;
        font-size: 0.8rem;
        color: rgba(255,255,255,0.4);
        margin-bottom: -5px;
        letter-spacing: 1px;
      }

      .wheel-label .label {
        font-family: "Montserrat", sans-serif;
        font-weight: 900;
        font-size: 2.8rem;
        color: #fff;
        letter-spacing: -2px;
        text-transform: uppercase;
      }

      /* Dynamically overridden by inline styles but default fallbacks shown here */
      .radio-input:has(#value-1:checked) .wheel-label { transform: rotate(calc(var(--angle) + 30deg)); }
      .radio-input:has(#value-2:checked) .wheel-label { transform: rotate(calc(var(--angle) - 0deg)); }
      .radio-input:has(#value-3:checked) .wheel-label { transform: rotate(calc(var(--angle) - 30deg)); }

      /* The specific active element overrides the rotation exactly to 0 */
      .radio-input input:checked + .wheel-label {
        opacity: 1;
        filter: blur(0);
        transform: rotate(0deg) !important;
        z-index: 10;
        margin-left: 10px;
      }

      .radio-input input:checked + .wheel-label .label {
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
      }

      .next-trigger {
        position: absolute;
        inset: 0;
        z-index: -1;
        cursor: pointer;
      }
      
      .stagger-text {
        animation: textFadeIn 0.5s ease both;
      }
      
      @keyframes textFadeIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @keyframes watermarkFadeIn {
        from { opacity: 0; transform: translate(-50%, -40%) scale(0.95); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getRotationOffset = () => {
    if (activeFeature === 'value-1') return 30;
    if (activeFeature === 'value-2') return 0;
    if (activeFeature === 'value-3') return -30;
    return 0;
  };

  const currentOffset = getRotationOffset();

  return (
    <div style={{ 
      minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', 
      padding: '100px 50px', boxSizing: 'border-box', position: 'relative', zIndex: 30,
      background: '#000000', overflow: 'hidden'
    }}>

      {/* Subtle Grid Background with radial fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
        zIndex: 1, pointerEvents: 'none'
      }} />

      {/* Giant Watermark Numeral */}
      <div key={`watermark-${activeFeature}`} style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontSize: '40vw', fontFamily: '"Montserrat", sans-serif', fontWeight: 900,
        color: 'rgba(255,255,255,0.015)', pointerEvents: 'none', userSelect: 'none', zIndex: 2,
        animation: 'watermarkFadeIn 0.8s ease-out forwards'
      }}>
        {activeFeature === 'value-1' ? '01' : activeFeature === 'value-2' ? '02' : '03'}
      </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', width: '100%', alignItems: 'center', flexWrap: 'wrap-reverse', gap: '100px', justifyContent: 'space-between', zIndex: 10, position: 'relative' }}>
        
        {/* Texts with futuristic twist */}
        <div style={{ flex: '1 1 500px', display: 'flex', maxWidth: '600px' }}>
          
          {/* Tech Status Line (The twist!) */}
          <div style={{ position: 'relative', width: '2px', background: 'rgba(255,255,255,0.05)', marginRight: '50px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              position: 'absolute', 
              top: activeFeature === 'value-1' ? '0%' : activeFeature === 'value-2' ? '50%' : '100%', 
              left: '-1px', width: '4px', height: '40px', 
              background: '#ffffff', 
              boxShadow: '0 0 15px rgba(255,255,255,0.8)',
              transition: 'all 0.6s cubic-bezier(0.8, 0, 0.2, 1)',
              transform: 'translateY(-50%)' 
            }} />
          </div>

          <div key={activeFeature} className="stagger-text" style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Space Mono", monospace', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '15px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {t('wheel.num') + (activeFeature === 'value-1' ? '01' : activeFeature === 'value-2' ? '02' : '03')}
            </div>
            <h3 style={{ 
              fontFamily: '"Montserrat", sans-serif', fontSize: '2.5rem', fontWeight: 200, 
              color: '#fff', marginBottom: '24px', letterSpacing: '-1.5px', lineHeight: '1.2' 
            }}>
              {t(`wheel.features.${activeFeature}.title`)}
            </h3>
            <p style={{ 
              fontFamily: '"Space Mono", monospace', fontSize: '1.05rem', 
              color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', fontWeight: 400 
            }}>
               {t(`wheel.features.${activeFeature}.desc`)}
            </p>
          </div>
        </div>

        {/* Wheel Widget */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div className="wheel-selector">
            <div className="hint-pop">{t('wheel.hint')}</div>
            <div className="radio-input">
              {/* Cycling trigger: 1->2->3->1 */}
              <label 
                className="next-trigger" 
                style={{ zIndex: 100 }}
                onClick={() => {
                  if (activeFeature === 'value-1') setActiveFeature('value-2');
                  else if (activeFeature === 'value-2') setActiveFeature('value-3');
                  else setActiveFeature('value-1');
                }}
              ></label>
              
              <div className="glass-overlay"></div>
              
              {/* Radio 1 */}
              <input value="value-1" name="value-radio" id="value-1" type="radio" checked={activeFeature === 'value-1'} readOnly />
              <label className="wheel-label" htmlFor="value-1" style={{ '--angle': '0deg', transform: activeFeature !== 'value-1' ? `rotate(${0 + currentOffset}deg)` : 'rotate(0deg)' } as any}>
                <span className="num">01</span>
                <span className="label">PROMPT</span>
              </label>
              
              {/* Radio 2 */}
              <input value="value-2" name="value-radio" id="value-2" type="radio" checked={activeFeature === 'value-2'} readOnly />
              <label className="wheel-label" htmlFor="value-2" style={{ '--angle': '30deg', transform: activeFeature !== 'value-2' ? `rotate(${30 + currentOffset}deg)` : 'rotate(0deg)' } as any}>
                <span className="num">02</span>
                <span className="label">MEMORY</span>
              </label>
              
              {/* Radio 3 */}
              <input value="value-3" name="value-radio" id="value-3" type="radio" checked={activeFeature === 'value-3'} readOnly />
              <label className="wheel-label" htmlFor="value-3" style={{ '--angle': '60deg', transform: activeFeature !== 'value-3' ? `rotate(${60 + currentOffset}deg)` : 'rotate(0deg)' } as any}>
                <span className="num">03</span>
                <span className="label">DEPLOY</span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
