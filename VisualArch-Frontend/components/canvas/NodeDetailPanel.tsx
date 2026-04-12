"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { X, FileCode, Package } from "lucide-react";
import { useArchitectureStore } from "@/store/useArchitectureStore";
import { layerColor, LayerIcon } from "./TaskNode";

export default function NodeDetailPanel() {
  const nodes = useArchitectureStore((s) => s.nodes);
  const selectedNodeId = useArchitectureStore((s) => s.selectedNodeId);
  const setSelectedNode = useArchitectureStore((s) => s.setSelectedNode);

  const node = nodes.find((n) => n.id === selectedNodeId);
  const colors = node ? layerColor(node.data.layer) : layerColor("default");

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: "100%",
            background: "rgba(16,24,48,0.96)",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 20px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: colors.badge,
                  marginBottom: 8,
                }}
              >
                <LayerIcon layer={node.data.layer} size={10} color={colors.text} />
                <span style={{ fontSize: 10, fontWeight: 600, color: colors.text, letterSpacing: "0.05em" }}>
                  {node.data.layer.toUpperCase().replace(/-/g, " ")}
                </span>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#F0F4FF",
                  fontFamily: "var(--font-geist), sans-serif",
                  lineHeight: 1.3,
                }}
              >
                {node.data.label}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                {node.data.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "none",
                borderRadius: 8,
                padding: 6,
                cursor: "pointer",
                color: "rgba(255,255,255,0.5)",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Files */}
          {node.data.files && node.data.files.length > 0 && (
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <FileCode size={12} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
                  ФАЙЛЫ
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {node.data.files.map((file) => (
                  <div
                    key={file.path}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {file.path}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          {node.data.explain && (
            <div style={{ padding: "14px 20px", flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7,
                }}
                className="markdown-body"
              >
                <ReactMarkdown>{node.data.explain}</ReactMarkdown>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
