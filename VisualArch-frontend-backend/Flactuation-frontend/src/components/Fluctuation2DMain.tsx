import { useEffect, useRef } from 'react';

export const Fluctuation2DMain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    
    function resize() { 
      canvas.width = wrap.offsetWidth; 
      canvas.height = wrap.offsetHeight; 
    }
    resize();
    window.addEventListener('resize', resize);
    
    let t = 0;
    let mouse = { x: -9999, y: -9999, inside: false };
    
    const handleMouseMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = true;
    };
    
    const handleMouseLeave = () => { mouse.inside = false; mouse.x = -9999; };
    
    const handleTouchMove = (e: TouchEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
      mouse.inside = true;
    };
    const handleTouchEnd = () => { mouse.inside = false; mouse.x = -9999; };

    wrap.addEventListener('mousemove', handleMouseMove);
    wrap.addEventListener('mouseleave', handleMouseLeave);
    wrap.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrap.addEventListener('touchend', handleTouchEnd);

    function buildR(W: number, H: number, time: number, phaseShift: number) {
      const top=[], bot=[], ctr=[];
      const baseY = H * 0.50;
      const flow = time * 0.7;

      for (let x = 0; x <= W; x += 2) {
        const xn = x / W;
        const edgeFade = Math.pow(Math.sin(xn * Math.PI), 0.6);

        let cy = baseY
          + Math.sin(xn * Math.PI * 1.8 + flow + phaseShift) * 45 * edgeFade
          + Math.sin(xn * Math.PI * 0.9 + flow * 0.55 + phaseShift * 0.7) * 22 * edgeFade
          + Math.sin(xn * Math.PI * 3.0 + flow * 1.8 + phaseShift * 1.4) * 8 * edgeFade;

        const th = Math.max(4, (20 + 8 * Math.abs(Math.sin(xn * Math.PI * 1.8 + flow + phaseShift))) * (0.4 + 0.6 * edgeFade));
        top.push([x, cy - th]);
        bot.push([x, cy + th]);
        ctr.push([x, cy]);
      }
      return { top, bot, ctr };
    }

    function drawRibbon(top: any[], bot: any[], ctr: any[], colorPink: string, colorGreen: string, W: number, H: number) {
      const n = top.length;
      if (!n) return;
      let minY=Infinity, maxY=-Infinity;
      for (let i=0;i<n;i++) { minY=Math.min(minY,top[i][1]); maxY=Math.max(maxY,bot[i][1]); }

      function path(exp: number) {
        ctx.beginPath();
        ctx.moveTo(top[0][0], top[0][1]-exp);
        for (let i=1;i<n;i++) ctx.lineTo(top[i][0], top[i][1]-exp);
        for (let i=n-1;i>=0;i--) ctx.lineTo(bot[i][0], bot[i][1]+exp);
        ctx.closePath();
      }

      ctx.save();
      path(30);
      ctx.clip();
      const gO = ctx.createLinearGradient(0,0,W,0);
      gO.addColorStop(0,    `rgba(${colorPink},0)`);
      gO.addColorStop(0.04, `rgba(${colorPink},0.18)`);
      gO.addColorStop(0.45, `rgba(${colorPink},0.15)`);
      gO.addColorStop(0.55, `rgba(${colorGreen},0.15)`);
      gO.addColorStop(0.96, `rgba(${colorGreen},0.18)`);
      gO.addColorStop(1,    `rgba(${colorGreen},0)`);
      path(30); ctx.fillStyle = gO; ctx.fill();
      ctx.restore();

      ctx.save();
      path(0); ctx.clip();
      const gH = ctx.createLinearGradient(0,0,W,0);
      gH.addColorStop(0,    `rgba(${colorPink},0)`);
      gH.addColorStop(0.03, `rgba(${colorPink},0.88)`);
      gH.addColorStop(0.44, `rgba(${colorPink},0.82)`);
      gH.addColorStop(0.50, `rgba(175,145,45,0.78)`);
      gH.addColorStop(0.56, `rgba(${colorGreen},0.82)`);
      gH.addColorStop(0.97, `rgba(${colorGreen},0.88)`);
      gH.addColorStop(1,    `rgba(${colorGreen},0)`);
      path(0); ctx.fillStyle = gH; ctx.fill();

      const gV = ctx.createLinearGradient(0, minY-10, 0, maxY+10);
      gV.addColorStop(0,    'rgba(0,0,0,0.95)');
      gV.addColorStop(0.20, 'rgba(0,0,0,0.28)');
      gV.addColorStop(0.38, 'rgba(0,0,0,0)');
      gV.addColorStop(0.62, 'rgba(0,0,0,0)');
      gV.addColorStop(0.80, 'rgba(0,0,0,0.28)');
      gV.addColorStop(1,    'rgba(0,0,0,0.95)');
      path(0); ctx.fillStyle = gV; ctx.fill();
      ctx.restore();

      ctx.save();
      const gC = ctx.createLinearGradient(0,0,W,0);
      gC.addColorStop(0,    `rgba(${colorPink},0)`);
      gC.addColorStop(0.03, `rgba(${colorPink},1)`);
      gC.addColorStop(0.45, `rgba(${colorPink},0.9)`);
      gC.addColorStop(0.55, `rgba(${colorGreen},0.9)`);
      gC.addColorStop(0.97, `rgba(${colorGreen},1)`);
      gC.addColorStop(1,    `rgba(${colorGreen},0)`);
      ctx.beginPath();
      ctx.moveTo(ctr[0][0], ctr[0][1]);
      for (let i=1;i<n;i++) ctx.lineTo(ctr[i][0], ctr[i][1]);
      ctx.strokeStyle = gC;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = `rgba(${colorPink},0.8)`;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }

    function drawReflection(top: any[], bot: any[], ctr: any[], mirrorY: number, colorPink: string, colorGreen: string, W: number, H: number) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, mirrorY, W, H-mirrorY); ctx.clip();
      const n = top.length;
      const mt = bot.map(([x,y]) => [x, mirrorY*2-y]);
      const mb = top.map(([x,y]) => [x, mirrorY*2-y]);
      const mc = ctr.map(([x,y]) => [x, mirrorY*2-y]);
      function mPath() {
        ctx.beginPath();
        ctx.moveTo(mt[0][0],mt[0][1]);
        for (let i=1;i<n;i++) ctx.lineTo(mt[i][0],mt[i][1]);
        for (let i=n-1;i>=0;i--) ctx.lineTo(mb[i][0],mb[i][1]);
        ctx.closePath();
      }
      mPath();
      const rg = ctx.createLinearGradient(0,0,W,0);
      rg.addColorStop(0,    `rgba(${colorPink},0)`);
      rg.addColorStop(0.04, `rgba(${colorPink},0.22)`);
      rg.addColorStop(0.45, `rgba(${colorPink},0.17)`);
      rg.addColorStop(0.55, `rgba(${colorGreen},0.17)`);
      rg.addColorStop(0.96, `rgba(${colorGreen},0.22)`);
      rg.addColorStop(1,    `rgba(${colorGreen},0)`);
      ctx.fillStyle = rg; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(mc[0][0],mc[0][1]);
      for (let i=1;i<mc.length;i++) ctx.lineTo(mc[i][0],mc[i][1]);
      const rc = ctx.createLinearGradient(0,0,W,0);
      rc.addColorStop(0,    `rgba(${colorPink},0)`);
      rc.addColorStop(0.04, `rgba(${colorPink},0.35)`);
      rc.addColorStop(0.96, `rgba(${colorGreen},0.35)`);
      rc.addColorStop(1,    `rgba(${colorGreen},0)`);
      ctx.strokeStyle = rc; ctx.lineWidth = 1; ctx.stroke();
      const fade = ctx.createLinearGradient(0, mirrorY, 0, H);
      fade.addColorStop(0,    'rgba(0,0,0,0)');
      fade.addColorStop(0.28, 'rgba(0,0,0,0.60)');
      fade.addColorStop(0.65, 'rgba(0,0,0,0.93)');
      fade.addColorStop(1,    'rgba(0,0,0,1)');
      ctx.fillStyle = fade; ctx.fillRect(0, mirrorY, W, H-mirrorY);
      ctx.restore();
    }

    function drawHorizon(W: number, H: number) {
      const y = H * 0.558;
      const g = ctx.createLinearGradient(0,0,W,0);
      g.addColorStop(0,    'rgba(255,225,185,0)');
      g.addColorStop(0.02, 'rgba(255,235,200,0.85)');
      g.addColorStop(0.18, 'rgba(230,190,155,0.50)');
      g.addColorStop(0.50, 'rgba(210,175,195,0.32)');
      g.addColorStop(0.82, 'rgba(185,215,145,0.50)');
      g.addColorStop(0.98, 'rgba(200,230,155,0.80)');
      g.addColorStop(1,    'rgba(200,230,155,0)');
      ctx.save();
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y);
      ctx.strokeStyle = g; ctx.lineWidth = 0.9;
      ctx.shadowColor = 'rgba(240,215,170,0.5)'; ctx.shadowBlur = 5;
      ctx.globalAlpha = 0.9; ctx.stroke();
      ctx.restore();
    }

    function drawCursor(W: number, H: number) {
      if (!mouse.inside) return;
      ctx.save();
      const r1 = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 48);
      r1.addColorStop(0,   'rgba(255,180,240,0.18)');
      r1.addColorStop(0.4, 'rgba(220,120,200,0.08)');
      r1.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = r1;
      ctx.fillRect(mouse.x-48, mouse.y-48, 96, 96);
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,200,245,0.85)';
      ctx.shadowColor = 'rgba(255,150,230,1)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      const mirrorY = H * 0.558;

      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = '#000000'; ctx.fillRect(0,0,W,H);

      const bg = ctx.createRadialGradient(W*0.5, H*0.46, 0, W*0.5, H*0.46, W*0.44);
      bg.addColorStop(0,    'rgba(65,10,38,0.55)');
      bg.addColorStop(0.55, 'rgba(22,4,13,0.22)');
      bg.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

      const r1 = buildR(W, H, t, 0);
      const r2 = buildR(W, H, t, Math.PI);

      drawRibbon(r1.top, r1.bot, r1.ctr, '215,22,148', '148,188,18', W, H);
      drawRibbon(r2.top, r2.bot, r2.ctr, '142,190,16', '210,20,142', W, H);
      drawReflection(r1.top, r1.bot, r1.ctr, mirrorY, '205,18,138', '138,178,15', W, H);
      drawReflection(r2.top, r2.bot, r2.ctr, mirrorY, '132,180,12', '200,15,130', W, H);
      drawHorizon(W, H);

      t += 0.008;
      animId = requestAnimationFrame(draw);
    }

    draw();
    
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (wrap) {
        wrap.removeEventListener('mousemove', handleMouseMove);
        wrap.removeEventListener('mouseleave', handleMouseLeave);
        wrap.removeEventListener('touchmove', handleTouchMove);
        wrap.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100vw', height: '100vh', background: 'transparent', position: 'absolute', top: 0, left: 0, overflow: 'hidden', cursor: 'auto' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};
