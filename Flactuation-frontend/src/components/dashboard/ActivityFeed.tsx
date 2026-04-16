import React from 'react';

const LOGS = [
  { id: 1, time: '10:15 AM', type: 'User', message: 'System login // v1.0' },
  { id: 2, time: '09:31 AM', type: 'AI', message: '5 layers generated for Canvas' },
  { id: 3, time: '11:03 AM', type: 'Deploy', message: 'Project updated' },
  { id: 4, time: '11:45 AM', type: 'System', message: 'Cache cleared successfully' },
];

export const ActivityFeed = () => {
  return (
    <div style={{
      width: 280,
      flexShrink: 0,
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      padding: '0 0 0 32px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 4,
        marginBottom: 24,
        fontFamily: '"Space Mono", monospace',
      }}>
        // RECENT ACTIVITY
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {LOGS.map(log => (
          <div
            key={log.id}
            style={{
              fontSize: '0.72rem',
              fontFamily: '"Space Mono", monospace',
              color: 'rgba(255,255,255,0.6)',
              opacity: 0.6,
              transition: 'opacity 0.2s',
              cursor: 'default',
              lineHeight: 1.5,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>[{log.time}]</span>{' '}
            <span style={{ color: log.type === 'AI' ? '#00ffcc' : 'rgba(255,255,255,0.8)' }}>
              {log.type}:
            </span>{' '}
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};
