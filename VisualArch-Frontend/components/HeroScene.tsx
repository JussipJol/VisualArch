"use client";

import { useEffect, useRef } from "react";

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const drawReflection = (
      mainCtx: CanvasRenderingContext2D,
      text: string,
      fontStr: string,
      cx: number,
      baselineY: number,
      fontSize: number,
      pulse: number
    ) => {
      const reflH = Math.ceil(fontSize * 0.75);
      const offCanvas = document.createElement("canvas");
      offCanvas.width = w;
      offCanvas.height = reflH;
      const off = offCanvas.getContext("2d");
      if (!off) return;

      off.font = fontStr;
      off.textAlign = "center";
      off.textBaseline = "bottom";

      const rg = off.createLinearGradient(0, 0, 0, reflH);
      rg.addColorStop(0, "rgba(160,155,185,0.32)");
      rg.addColorStop(0.5, "rgba(110,105,140,0.18)");
      rg.addColorStop(1, "rgba(70,65,100,0.0)");

      off.save();
      off.translate(cx, reflH);
      off.scale(1, -1);
      off.translate(-cx, 0);
      off.fillStyle = rg;
      off.fillText(text, cx, reflH);
      off.restore();

      const mask = off.createLinearGradient(0, 0, 0, reflH);
      mask.addColorStop(0, `rgba(0,0,0,${0.38 * pulse})`);
      mask.addColorStop(0.55, "rgba(0,0,0,0.06)");
      mask.addColorStop(1, "rgba(0,0,0,0)");
      off.globalCompositeOperation = "destination-in";
      off.fillStyle = mask;
      off.fillRect(0, 0, w, reflH);

      mainCtx.drawImage(offCanvas, 0, baselineY + 6);
    };

    const draw = (t: number) => {
      const pulse = 0.88 + Math.sin(t * 0.00085) * 0.12;

      ctx.clearRect(0, 0, w, h);

      const bgGrad = ctx.createRadialGradient(
        w * 0.5, h * 0.38, 0,
        w * 0.5, h * 0.38,
        Math.max(w, h) * 0.9
      );
      bgGrad.addColorStop(0, "#130e1c");
      bgGrad.addColorStop(0.45, "#080610");
      bgGrad.addColorStop(1, "#000000");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const coneGrad = ctx.createRadialGradient(
        w * 0.5, -h * 0.05, 0,
        w * 0.5, h * 0.1,
        Math.min(w, h) * 0.85
      );
      coneGrad.addColorStop(0, `rgba(180, 140, 255, ${0.22 * pulse})`);
      coneGrad.addColorStop(0.25, `rgba(120, 80, 220, ${0.14 * pulse})`);
      coneGrad.addColorStop(0.6, `rgba(60, 30, 140, ${0.06 * pulse})`);
      coneGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coneGrad;
      ctx.fillRect(0, 0, w, h);

      const fontSize = Math.min(w * 0.082, 108);
      const fontStr = `700 ${fontSize}px 'Inter', 'Helvetica Neue', Arial, sans-serif`;
      ctx.font = fontStr;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cx = w / 2;
      const ty = h * 0.45;
      const text = "VisualArch AI";

      const blooms: [string, number][] = [
        [`rgba(130, 100, 255, ${0.08 * pulse})`, 120],
        [`rgba(180, 150, 255, ${0.14 * pulse})`, 60],
        [`rgba(220, 200, 255, ${0.22 * pulse})`, 28],
        [`rgba(255, 255, 255, ${0.35 * pulse})`, 10],
        [`rgba(255, 255, 255, ${0.55 * pulse})`, 3],
      ];
      for (const [color, blur] of blooms) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.fillStyle = color;
        ctx.fillText(text, cx, ty);
        ctx.restore();
      }

      const mg = ctx.createLinearGradient(cx, ty - fontSize * 0.52, cx, ty + fontSize * 0.52);
      mg.addColorStop(0.00, "#ffffff");
      mg.addColorStop(0.12, "#f4f2ff");
      mg.addColorStop(0.30, "#e2dff5");
      mg.addColorStop(0.50, "#c0bcdc");
      mg.addColorStop(0.68, "#8e8aac");
      mg.addColorStop(0.84, "#5e5a7a");
      mg.addColorStop(1.00, "#3c3858");

      ctx.save();
      ctx.shadowColor = `rgba(255,255,255,${0.6 * pulse})`;
      ctx.shadowBlur = 5;
      ctx.fillStyle = mg;
      ctx.fillText(text, cx, ty);
      ctx.restore();

      const lineY = ty + fontSize * 0.56;
      const lw = Math.min(w * 0.65, 720);
      const lg = ctx.createLinearGradient(cx - lw / 2, 0, cx + lw / 2, 0);
      lg.addColorStop(0, "rgba(255,255,255,0)");
      lg.addColorStop(0.25, `rgba(255,255,255,${0.1 * pulse})`);
      lg.addColorStop(0.5, `rgba(255,255,255,${0.28 * pulse})`);
      lg.addColorStop(0.75, `rgba(255,255,255,${0.1 * pulse})`);
      lg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = lg;
      ctx.fillRect(cx - lw / 2, lineY, lw, 1);

      drawReflection(ctx, text, fontStr, cx, lineY, fontSize, pulse);

      rafRef.current = requestAnimationFrame(draw);
    };

    document.fonts.ready.then(() => {
      resize();
      rafRef.current = requestAnimationFrame(draw);
    });
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
