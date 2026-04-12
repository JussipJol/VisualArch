"use client";

import { useEffect, useState, useRef } from "react";

export function Preloader() {
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(false);
  const fullText = "VisualArch AI";
  const shown = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("preloader_shown")) {
      setPhase("done");
      return;
    }
    shown.current = true;
    document.body.style.overflow = "hidden";

    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(typeInterval);
        setProgress(true);
      }
    }, 70);

    const hideTimer = setTimeout(() => {
      setPhase("fade");
      setTimeout(() => {
        setPhase("done");
        sessionStorage.setItem("preloader_shown", "1");
        document.body.style.overflow = "unset";
      }, 450);
    }, 2400);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#1A1A2E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        opacity: phase === "fade" ? 0 : 1,
        transform: phase === "fade" ? "scale(0.97)" : "scale(1)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
        pointerEvents: phase === "fade" ? "none" : "all",
      }}
    >
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(94,129,244,0.1) 0%, transparent 70%)",
        top: "15%", left: "15%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
        bottom: "15%", right: "15%", pointerEvents: "none",
      }} />

      <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="pl-top" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5CE6FF" />
            <stop offset="100%" stopColor="#7B9EF8" />
          </linearGradient>
          <linearGradient id="pl-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B9EF8" />
            <stop offset="100%" stopColor="#8B7CF6" />
          </linearGradient>
          <linearGradient id="pl-cube" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5CE6FF" />
            <stop offset="100%" stopColor="#7B6EF8" />
          </linearGradient>
          <filter id="pl-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter="url(#pl-glow)" style={{ animation: "plAppear 0.6s ease forwards", opacity: 0 }}>
          <line x1="28" y1="8" x2="52" y2="8" stroke="url(#pl-top)" strokeWidth="4" strokeLinecap="round" />
          <line x1="52" y1="8" x2="72" y2="40" stroke="url(#pl-top)" strokeWidth="4" strokeLinecap="round" />
          <line x1="72" y1="40" x2="52" y2="72" stroke="url(#pl-left)" strokeWidth="4" strokeLinecap="round" />
          <line x1="52" y1="72" x2="28" y2="72" stroke="url(#pl-top)" strokeWidth="4" strokeLinecap="round" />
          <line x1="28" y1="72" x2="8" y2="40" stroke="url(#pl-left)" strokeWidth="4" strokeLinecap="round" />
          <line x1="8" y1="40" x2="28" y2="8" stroke="url(#pl-left)" strokeWidth="4" strokeLinecap="round" />
          <line x1="8" y1="40" x2="40" y2="22" stroke="url(#pl-top)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="8" y1="40" x2="40" y2="58" stroke="url(#pl-left)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="72" y1="40" x2="40" y2="22" stroke="url(#pl-top)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="72" y1="40" x2="40" y2="58" stroke="url(#pl-left)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
          <rect x="31" y="31" width="18" height="18" rx="4" fill="url(#pl-cube)" />
          <rect x="34" y="34" width="12" height="12" rx="2.5" fill="white" fillOpacity="0.85" />
        </g>
      </svg>

      <div style={{ height: 40, display: "flex", alignItems: "center" }}>
        <span style={{
          fontFamily: "var(--font-geist), sans-serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          background: "linear-gradient(135deg, #F0F4FF, #A78BFA)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.02em",
        }}>
          {text}
        </span>
        <span style={{
          display: "inline-block",
          width: 2,
          height: 28,
          marginLeft: 3,
          background: "#5E81F4",
          animation: "cursorBlink 0.8s step-end infinite",
          verticalAlign: "middle",
        }} />
      </div>

      <div style={{
        width: 200,
        height: 2,
        borderRadius: 1,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
        opacity: progress ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}>
        <div style={{
          height: "100%",
          borderRadius: 1,
          background: "linear-gradient(90deg, #5E81F4, #A78BFA)",
          boxShadow: "0 0 10px rgba(94,129,244,0.8)",
          width: progress ? "100%" : "0%",
          transition: "width 1.2s ease-in-out",
        }} />
      </div>

      <style>{`
        @keyframes plAppear {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
