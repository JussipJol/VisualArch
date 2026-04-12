"use client";

import { useState } from "react";
import { X, Layers, FileIcon, BookOpen, Code2, FileCode } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useArchitectureStore } from "@/store/useArchitectureStore";
import { layerColor, LayerIcon } from "./TaskNode";
import SyntaxHighlighter from "./SyntaxHighlighter";

export default function CockpitCodePanel() {
  const nodes = useArchitectureStore((s) => s.nodes);
  const selectedNodeId = useArchitectureStore((s) => s.selectedNodeId);
  const setSelectedNode = useArchitectureStore((s) => s.setSelectedNode);

  const [activeTab, setActiveTab] = useState<"explain" | "files">("explain");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) return null;

  const colors = layerColor(node.data.layer);
  const files = node.data.files || [];
  const activeFile = files.find((f) => f.path === selectedFile);
  const fileContent = activeFile?.content || "";

  return (
    <div
      style={{
        width: "480px",
        minWidth: "480px",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(13,17,23,0.98)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 20,
              background: colors.badge,
              marginBottom: 10,
            }}
          >
            <LayerIcon layer={node.data.layer} size={11} color={colors.text} />
            <span style={{ fontSize: 10, fontWeight: 600, color: colors.text, letterSpacing: "0.05em" }}>
              {node.data.layer.toUpperCase().replace(/-/g, " ")}
            </span>
          </div>
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 16,
              fontWeight: 700,
              color: "#F0F4FF",
              fontFamily: "var(--font-geist), sans-serif",
            }}
          >
            {node.data.label}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
            {node.data.description}
          </p>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: 8,
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 20px",
          gap: 20,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setActiveTab("explain")}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "explain" ? `2px solid ${colors.text}` : "2px solid transparent",
            padding: "16px 0",
            color: activeTab === "explain" ? "#F0F4FF" : "rgba(255,255,255,0.4)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <BookOpen size={14} />
          Спецификация
        </button>
        <button
          onClick={() => {
            setActiveTab("files");
            if (!selectedFile && files.length > 0) setSelectedFile(files[0].path);
          }}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "files" ? `2px solid ${colors.text}` : "2px solid transparent",
            padding: "16px 0",
            color: activeTab === "files" ? "#F0F4FF" : "rgba(255,255,255,0.4)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Code2 size={14} />
          Код
          <span
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "2px 6px",
              borderRadius: 10,
              fontSize: 10,
              marginLeft: 4,
            }}
          >
            {files.length}
          </span>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {activeTab === "explain" ? (
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
            }}
            className="markdown-body"
          >
            {node.data.explain ? (
              <ReactMarkdown>{node.data.explain}</ReactMarkdown>
            ) : (
              <p>Описание отсутствует.</p>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {files.length > 0 ? (
              <>
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    flexShrink: 0,
                  }}
                >
                  {files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file.path)}
                      style={{
                        padding: "6px 12px",
                        background:
                          selectedFile === file.path ? colors.bg : "transparent",
                        border:
                          selectedFile === file.path
                            ? `1px solid ${colors.border}`
                            : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 6,
                        color:
                          selectedFile === file.path ? colors.text : "rgba(255,255,255,0.5)",
                        fontSize: 12,
                        fontFamily: "var(--font-mono)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <FileIcon size={12} />
                      {file.path.split("/").pop()}
                    </button>
                  ))}
                </div>

                {/* Code with syntax highlighting */}
                <div style={{ flex: 1, overflow: "auto" }}>
                  <SyntaxHighlighter
                    code={fileContent || "// Empty file"}
                    filePath={selectedFile || "file.ts"}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                <FileCode size={32} style={{ marginBottom: 16, opacity: 0.5 }} />
                <p>Нет сгенерированных файлов</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
