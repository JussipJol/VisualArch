import React from 'react';

export const SystemStatus = () => {
  return (
    <div style={{
      marginTop: 64,
      paddingTop: 32,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    }}>
      <div style={{
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 4,
        fontFamily: '"Space Mono", monospace',
      }}>
        // SYSTEM STATUS & LOGS
      </div>

      <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
        {/* Load Bar */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: '"Space Mono", monospace' }}>
              AI ENGINE LOAD
            </span>
            <span style={{ fontSize: '0.7rem', color: '#00ffcc', fontFamily: '"Space Mono", monospace' }}>
              42%
            </span>
          </div>
          <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '42%',
              background: '#00ffcc',
              boxShadow: '0 0 10px rgba(0,255,204,0.5)'
            }} />
          </div>
        </div>

        {/* Status Terminal */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ffcc', boxShadow: '0 0 6px #00ffcc' }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontFamily: '"Space Mono", monospace' }}>
              NODE_SERVER_01 [ONLINE]
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ffcc', boxShadow: '0 0 6px #00ffcc' }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontFamily: '"Space Mono", monospace' }}>
              WS_BRIDGE [ONLINE]
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontFamily: '"Space Mono", monospace' }}>
              REDIS_CACHE [WARNING - HIGH LOAD]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
