"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore, type Toast, type ToastType } from "@/store/useToastStore";

// ── Icons & colors per type ──────────────────────────────────
const CONFIG: Record<
  ToastType,
  { icon: React.ReactNode; border: string; glow: string; iconColor: string; bg: string }
> = {
  success: {
    icon: <CheckCircle2 size={16} />,
    border: "rgba(16,185,129,0.35)",
    glow:   "0 8px 32px rgba(16,185,129,0.2)",
    iconColor: "#10B981",
    bg: "rgba(16,185,129,0.08)",
  },
  error: {
    icon: <AlertCircle size={16} />,
    border: "rgba(239,68,68,0.35)",
    glow:   "0 8px 32px rgba(239,68,68,0.2)",
    iconColor: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    border: "rgba(245,158,11,0.35)",
    glow:   "0 8px 32px rgba(245,158,11,0.2)",
    iconColor: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
  },
  info: {
    icon: <Info size={16} />,
    border: "rgba(94,129,244,0.35)",
    glow:   "0 8px 32px rgba(94,129,244,0.2)",
    iconColor: "#5E81F4",
    bg: "rgba(94,129,244,0.08)",
  },
};

// ── Single toast item ────────────────────────────────────────
function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove);
  const cfg = CONFIG[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 12, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 14px",
        borderRadius: 14,
        background: `rgba(13,17,23,0.92)`,
        border: `1px solid ${cfg.border}`,
        boxShadow: `${cfg.glow}, inset 0 0 0 1px ${cfg.bg}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        minWidth: 280,
        maxWidth: 360,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left accent strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          borderRadius: "14px 0 0 14px",
          background: cfg.iconColor,
          opacity: 0.7,
        }}
      />

      {/* Icon */}
      <div style={{ color: cfg.iconColor, flexShrink: 0, marginTop: 1 }}>
        {cfg.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#F0F4FF", lineHeight: 1.4 }}>
          {toast.title}
        </p>
        {toast.message && (
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.45 }}>
            {toast.message}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => remove(toast.id)}
        style={{
          flexShrink: 0,
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.3)",
          cursor: "pointer",
          padding: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
          transition: "color 0.15s",
          marginTop: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
      >
        <X size={13} />
      </button>

      {/* Progress bar */}
      {(toast.duration ?? 4000) > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: (toast.duration ?? 4000) / 1000, ease: "linear" }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: cfg.iconColor,
            transformOrigin: "left",
            opacity: 0.4,
          }}
        />
      )}
    </motion.div>
  );
}

// ── Toast container (fixed, bottom-right) ───────────────────
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
