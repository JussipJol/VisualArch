"use client";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useArchitectureStore, type NodeData } from "@/store/useArchitectureStore";
import TaskNode, { layerColor } from "./TaskNode";

const nodeTypes = { taskNode: TaskNode };

interface ArchitectureCanvasProps {
  initialNodes?: Node<NodeData>[];
  initialEdges?: Edge[];
}

export default function ArchitectureCanvas({
  initialNodes = [],
  initialEdges = [],
}: ArchitectureCanvasProps) {
  const storeNodes = useArchitectureStore((s) => s.nodes);
  const storeEdges = useArchitectureStore((s) => s.edges);
  const onNodesChange = useArchitectureStore((s) => s.onNodesChange);
  const onEdgesChange = useArchitectureStore((s) => s.onEdgesChange);
  const onConnect = useArchitectureStore((s) => s.onConnect);

  const nodes = storeNodes.length > 0 ? storeNodes : initialNodes;
  const edges = storeEdges.length > 0 ? storeEdges : initialEdges;

  const styledEdges = useMemo(
    () =>
      edges.map((e) => {
        const type = (e as any).type || "default";
        let stroke = "rgba(148,163,184,0.4)";
        let strokeDasharray = "none";
        let animated = e.animated || false;

        if (type === "async") {
          stroke = "#F59E0B"; // Orange
          strokeDasharray = "5, 5";
        } else if (type === "db") {
          stroke = "#10B981"; // Emerald
          strokeDasharray = "none";
        } else if (type === "streaming") {
          stroke = "#3B82F6"; // Blue
          strokeDasharray = "5, 5";
          animated = true;
        } else if (type === "sync") {
          stroke = "#6366F1"; // Indigo
          animated = true;
        }

        return {
          ...e,
          animated,
          style: { stroke, strokeWidth: type === "default" ? 1.5 : 2.5, strokeDasharray },
          labelStyle: { fill: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: "bold" },
          labelBgStyle: { fill: "rgba(22,33,62,0.9)", stroke: stroke, strokeWidth: 1 },
          labelBgBorderRadius: 4,
          labelBgPadding: [6, 4],
        };
      }),
    [edges]
  );

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <Controls
          style={{
            background: "rgba(22,33,62,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
          }}
        />
        <MiniMap
          style={{
            background: "rgba(22,33,62,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
          }}
          nodeColor={(node) => {
            const layer = (node.data as NodeData)?.layer || "default";
            return layerColor(layer).text;
          }}
          maskColor="rgba(10,10,20,0.7)"
        />
      </ReactFlow>
    </motion.div>
  );
}
