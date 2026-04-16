import { useEffect, useState } from 'react';

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ищем прокручиваемый контейнер (landing page использует div, не window)
    const scroller = document.querySelector('[data-scroll-container]') as HTMLElement | null;
    const target = scroller || window;

    const onScroll = () => {
      const y = scroller ? scroller.scrollTop : window.scrollY;
      setVisible(y > 300);
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    const scroller = document.querySelector('[data-scroll-container]') as HTMLElement | null;
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Наверх"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 9998,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
        (e.currentTarget as HTMLButtonElement).style.color = '#fff';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
      }}
    >
      {/* Стрелка вверх */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};
