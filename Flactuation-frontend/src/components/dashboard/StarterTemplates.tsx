import React from 'react';

const TEMPLATES = [
  { id: 'saas', icon: '[ ]', title: 'SaaS Landing' },
  { id: 'ecommerce', icon: '[ ]', title: 'E-commerce' },
  { id: 'dashboard', icon: '[ ]', title: 'Dashboard' },
  { id: 'portfolio', icon: '[ ]', title: 'Portfolio' },
];

export const StarterTemplates = ({ onSelect }: { onSelect?: (id: string) => void }) => {
  return (
    <div style={{ marginTop: 64 }}>
      <div style={{
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 4,
        marginBottom: 24,
        fontFamily: '"Space Mono", monospace',
      }}>
        // STARTER KITS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {TEMPLATES.map(temp => (
          <div
            key={temp.id}
            onClick={() => onSelect && onSelect(temp.id)}
            style={{
              padding: '24px 20px',
              border: '1px dashed rgba(255,255,255,0.15)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: 0.7,
            }}
            onMouseEnter={e => {
              const tgt = e.currentTarget as HTMLDivElement;
              tgt.style.opacity = '1';
              tgt.style.borderColor = 'rgba(0,255,204,0.4)';
              tgt.style.background = 'rgba(0,255,204,0.03)';
              const icon = tgt.querySelector('.icon') as HTMLSpanElement;
              if (icon) icon.style.color = '#00ffcc';
            }}
            onMouseLeave={e => {
              const tgt = e.currentTarget as HTMLDivElement;
              tgt.style.opacity = '0.7';
              tgt.style.borderColor = 'rgba(255,255,255,0.15)';
              tgt.style.background = 'transparent';
              const icon = tgt.querySelector('.icon') as HTMLSpanElement;
              if (icon) icon.style.color = 'rgba(255,255,255,0.4)';
            }}
          >
            <span
              className="icon"
              style={{
                fontSize: '1rem',
                fontFamily: '"Space Mono", monospace',
                color: 'rgba(255,255,255,0.4)',
                transition: 'color 0.2s',
              }}
            >
              {temp.icon}
            </span>
            <span style={{
              fontSize: '0.85rem',
              fontFamily: '"Space Mono", monospace',
              color: 'rgba(255,255,255,0.8)',
            }}>
              {temp.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
