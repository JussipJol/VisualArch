import { useState, useEffect, useRef } from 'react';

const codeSnippet = `// Initialization Sequence
function initializeGlobalState() {
  console.log("[SYS]: Syncing Canvas, IDE, and Design modes...");
  
  const workspace = new WorkspaceMaster();
  
  // Binding universal modes
  workspace.connectHooks([
    useCanvas({ autoSync: true }),
    useIDE({ syntax: 'dynamic' }),
    useDesignSystem({ theme: 'dark-neon' })
  ]);

  workspace.on('state_change', (payload) => {
    /* Seamless UI update across all architectures */
    /* Real-time sync protocol engaged */
    Renderer.commitToAll(payload);
  });

  return workspace.start();
}

// Executing Core Engine...
const engine = initializeGlobalState();
if (engine.status === 'OK') {
  console.log("[SYSTEM]: V-Engine Active.");
  console.log("[SYSTEM]: Zero latency achieved.");
  console.log("[SYSTEM]: Idea-to-Code pipeline seamless.");
}
`;

export const IDEAnimation = () => {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  useEffect(() => {
    let currentIndex = 0;
    
    // Inject keyframes for the blinking cursor
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
      @keyframes blinker {
        50% { opacity: 0; }
      }
    `;
    document.head.appendChild(styleSheet);

    const interval = setInterval(() => {
      setText(codeSnippet.slice(0, currentIndex));
      currentIndex++;
      
      if (currentIndex > codeSnippet.length + 50) { // Stay on screen a bit
         currentIndex = 0; // Restart animation
      }
    }, 25); // typing speed
    
    return () => {
      clearInterval(interval);
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={{
      background: '#0d0d12', 
      border: '1px solid rgba(0, 255, 204, 0.2)', 
      borderRadius: '8px',
      overflow: 'hidden', 
      boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0,255,204,0.05)',
      fontFamily: '"Space Mono", "Consolas", monospace',
      height: '480px', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Window Controls Header */}
      <div style={{ background: '#15151a', padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
         <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
         <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
         <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
         <div style={{ marginLeft: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '1px' }}>
           workspace.ts — V-Engine
         </div>
      </div>
      
      {/* IDE Editor Area */}
      <div ref={scrollRef} style={{ padding: '24px', color: '#00ffcc', fontSize: '0.95rem', lineHeight: '1.6', overflowY: 'auto', flex: 1, textAlign: 'left' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {text}
          <span style={{ 
            animation: 'blinker 1s step-end infinite', 
            borderRight: '8px solid rgba(255, 20, 147, 0.8)',
            display: 'inline-block',
            height: '1.1rem',
            verticalAlign: 'bottom',
            marginLeft: '2px'
          }}></span>
        </pre>
      </div>
    </div>
  );
}
