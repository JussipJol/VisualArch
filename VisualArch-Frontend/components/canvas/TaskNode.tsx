"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { useArchitectureStore, type NodeData } from "@/store/useArchitectureStore";
import {
  Monitor,
  Server,
  Database,
  Cloud,
  Shield,
  BarChart3,
  Zap,
  Globe,
  Package,
  Workflow,
} from "lucide-react";

// ── Generate colors from layer name hash ────────────────────
function layerColor(layer: string): {
  bg: string;
  border: string;
  badge: string;
  text: string;
  hue: number;
} {
  let hash = 0;
  for (let i = 0; i < layer.length; i++) {
    hash = layer.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return {
    bg: `hsla(${hue}, 70%, 55%, 0.08)`,
    border: `hsla(${hue}, 70%, 55%, 0.30)`,
    badge: `hsla(${hue}, 70%, 55%, 0.15)`,
    text: `hsla(${hue}, 80%, 72%, 1)`,
    hue,
  };
}

// ── Pick icon based on common layer keywords ────────────────
function LayerIcon({ layer, size = 11, color }: { layer: string; size?: number; color: string }) {
  const l = layer.toLowerCase();
  if (l.includes("front") || l.includes("ui") || l.includes("page") || l.includes("dashboard"))
    return <Monitor size={size} color={color} />;
  if (l.includes("auth") || l.includes("security") || l.includes("permission"))
    return <Shield size={size} color={color} />;
  if (l.includes("data") || l.includes("db") || l.includes("storage") || l.includes("model"))
    return <Database size={size} color={color} />;
  if (l.includes("api") || l.includes("gateway") || l.includes("endpoint") || l.includes("route"))
    return <Globe size={size} color={color} />;
  if (l.includes("infra") || l.includes("deploy") || l.includes("docker") || l.includes("ci"))
    return <Cloud size={size} color={color} />;
  if (l.includes("analytic") || l.includes("metric") || l.includes("chart") || l.includes("report"))
    return <BarChart3 size={size} color={color} />;
  if (l.includes("real") || l.includes("socket") || l.includes("stream") || l.includes("event"))
    return <Zap size={size} color={color} />;
  if (l.includes("service") || l.includes("worker") || l.includes("job") || l.includes("queue"))
    return <Workflow size={size} color={color} />;
  if (l.includes("server") || l.includes("backend") || l.includes("logic"))
    return <Server size={size} color={color} />;
  return <Package size={size} color={color} />;
}

function TaskNode({ data, id, selected }: NodeProps<NodeData>) {
  const colors = layerColor(data.layer);
  const setSelectedNode = useArchitectureStore((s) => s.setSelectedNode);
  const selectedNodeId = useArchitectureStore((s) => s.selectedNodeId);
  const isActive = selectedNodeId === id;

  const filesCount = data.files?.length || 0;
  const linesCount = data.files?.reduce((sum, f) => sum + (f.content?.split("\n").length || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
      onClick={() => setSelectedNode(isActive ? null : id)}
      style={{
        width: 210,
        padding: "14px 16px",
        borderRadius: 14,
        background: colors.bg,
        border: `1.5px solid ${isActive || selected ? colors.text : colors.border}`,
        boxShadow: isActive
          ? `0 0 0 2px ${colors.text}40, 0 8px 32px rgba(0,0,0,0.3)`
          : "0 4px 16px rgba(0,0,0,0.2)",
        cursor: "pointer",
        transition: "box-shadow 0.2s, border-color 0.2s",
        backdropFilter: "blur(8px)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0.4 }} />

      {/* Layer badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "2px 8px",
          borderRadius: 20,
          background: colors.badge,
          marginBottom: 8,
        }}
      >
        <LayerIcon layer={data.layer} size={10} color={colors.text} />
        <span style={{ fontSize: 10, fontWeight: 600, color: colors.text, letterSpacing: "0.05em" }}>
          {data.layer.toUpperCase().replace(/-/g, " ")}
        </span>
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#F0F4FF",
          marginBottom: 4,
          fontFamily: "var(--font-geist), sans-serif",
          lineHeight: 1.3,
        }}
      >
        {data.label}
      </div>

      {/* Description */}
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
        {data.description}
      </div>

      {/* Stats */}
      {filesCount > 0 && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            gap: 10,
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          <span>📄 {filesCount} файлов</span>
          <span>⌇ {linesCount} строк</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.4 }} />
    </motion.div>
  );
}

export default memo(TaskNode);

// Export for use in other components
export { layerColor, LayerIcon };
