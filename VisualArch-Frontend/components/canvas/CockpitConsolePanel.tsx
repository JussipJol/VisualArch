"use client";

import { useEffect, useRef } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { useArchitectureStore } from "@/store/useArchitectureStore";

export default function CockpitConsolePanel() {
  const logs = useArchitectureStore((s) => s.logs);
  const isGenerating = useArchitectureStore((s) => s.isGenerating);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isGenerating]);

  return (
    <div
      style={{
        height: "140px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "#080B10",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "6px 16px",
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Terminal size={12} color="rgba(255,255,255,0.4)" />
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)" }}>
            AI_CONSOLE
          </span>
        </div>
        {isGenerating && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#5E81F4",
                boxShadow: "0 0 8px #5E81F4",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span style={{ fontSize: 10, color: "#5E81F4", fontFamily: "var(--font-mono)" }}>
              Исполнение...
            </span>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: "12px 16px",
          overflowY: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "#8B949E",
          lineHeight: 1.6,
        }}
      >
        {logs.length === 0 && !isGenerating && (
          <div style={{ color: "rgba(255,255,255,0.2)" }}>Готов к работе. Опишите архитектуру.</div>
        )}

        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: 4, display: "flex", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.2)", userSelect: "none" }}>{`>`}</span>
            <span style={{ color: log.startsWith("[ERROR]") ? "#FCA5A5" : log.startsWith("[READY]") ? "#6EE7B7" : "#C9D1D9" }}>
              {log}
            </span>
          </div>
        ))}

        {isGenerating && (
          <div style={{ display: "flex", gap: 8, marginTop: 4, opacity: 0.7 }}>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>{`>`}</span>
            <span style={{ color: "#A0B4FF", animation: "blink 1s step-end infinite" }}>_</span>
          </div>
        )}
        <style>
          {`
            @keyframes blink { 50% { opacity: 0; } }
            @keyframes pulse { 50% { opacity: 0.5; } }
          `}
        </style>
      </div>
    </div>
  );
}
