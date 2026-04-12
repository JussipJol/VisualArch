"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  FileCode,
  X,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Download,
  Search,
  Package,
} from "lucide-react";
import { useArchitectureStore, type NodeData } from "@/store/useArchitectureStore";
import SyntaxHighlighter from "./SyntaxHighlighter";

// ── Dynamic color from string hash ──────────────────────────
function layerColor(layer: string): { bg: string; border: string; text: string } {
  let hash = 0;
  for (let i = 0; i < layer.length; i++) {
    hash = layer.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return {
    bg: `hsla(${hue}, 70%, 55%, 0.08)`,
    border: `hsla(${hue}, 70%, 55%, 0.30)`,
    text: `hsla(${hue}, 80%, 72%, 1)`,
  };
}

// ── Build folder tree from flat file paths ───────────────────
interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: TreeNode[];
  layer?: string;
  nodeLabel?: string;
}

function buildTree(
  files: { path: string; nodeLabel: string; layer: string }[]
): TreeNode[] {
  const root: TreeNode = { name: "", path: "", isDir: true, children: [] };

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const fullPath = parts.slice(0, i + 1).join("/");

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: fullPath,
          isDir: !isLast,
          children: [],
          ...(isLast ? { layer: file.layer, nodeLabel: file.nodeLabel } : {}),
        };
        current.children.push(child);
      }
      current = child;
    }
  }

  // Sort: dirs first, then alphabetical
  function sortTree(nodes: TreeNode[]) {
    nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sortTree(n.children));
  }
  sortTree(root.children);

  return root.children;
}

// ── Folder/File tree item ────────────────────────────────────
function TreeItem({
  node,
  depth,
  activePath,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  activePath: string | null;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isActive = activePath === node.path;
  const colors = node.layer ? layerColor(node.layer) : null;

  if (node.isDir) {
    return (
      <>
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            width: "100%",
            padding: "3px 8px",
            paddingLeft: 8 + depth * 14,
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "var(--font-mono), monospace",
            textAlign: "left",
          }}
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <FolderOpen size={13} color="#E8A838" style={{ flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {node.name}
          </span>
        </button>
        {open &&
          node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              activePath={activePath}
              onSelect={onSelect}
            />
          ))}
      </>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        width: "100%",
        padding: "3px 8px",
        paddingLeft: 8 + depth * 14,
        background: isActive ? "rgba(94,129,244,0.12)" : "transparent",
        border: "none",
        borderLeft: isActive ? "2px solid #5E81F4" : "2px solid transparent",
        color: isActive ? "#F0F4FF" : "rgba(255,255,255,0.5)",
        fontSize: 12,
        cursor: "pointer",
        fontFamily: "var(--font-mono), monospace",
        textAlign: "left",
        transition: "all 0.15s",
      }}
    >
      <FileCode size={13} color={colors?.text || "rgba(255,255,255,0.4)"} style={{ flexShrink: 0 }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {node.name}
      </span>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function FullCodeIDE() {
  const nodes = useArchitectureStore((s) => s.nodes);
  const activeFilePath = useArchitectureStore((s) => s.activeFilePath);
  const openFileTabs = useArchitectureStore((s) => s.openFileTabs);
  const openFile = useArchitectureStore((s) => s.openFile);
  const closeFileTab = useArchitectureStore((s) => s.closeFileTab);
  const techStack = useArchitectureStore((s) => s.techStack);

  const allFiles = useMemo(() => useArchitectureStore.getState().getAllFiles(), [nodes]);
  const stats = useMemo(() => useArchitectureStore.getState().getStats(), [nodes]);

  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarWidth] = useState(260);

  // Build file tree
  const tree = useMemo(() => buildTree(allFiles), [allFiles]);

  // Active file content
  const activeFile = allFiles.find((f) => f.path === activeFilePath);

  // Filter files for search
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return null;
    return allFiles.filter((f) => f.path.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allFiles, searchQuery]);

  // Copy all code
  const handleCopyAll = () => {
    const allCode = allFiles
      .map((f) => `// ── ${f.path} ──\n${f.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(allCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export as JSON
  const handleExport = () => {
    const data = {
      tech_stack: techStack,
      files: allFiles.map((f) => ({ path: f.path, content: f.content, component: f.nodeLabel, layer: f.layer })),
      stats,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visualarch-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#1E1E1E",
        overflow: "hidden",
      }}
    >
      {/* ── Top toolbar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#252526",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>
            {stats.totalFiles} файлов · {stats.totalLines} строк · {stats.layers.length} слоёв
          </span>
          {techStack.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {techStack.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "1px 6px",
                    borderRadius: 4,
                    background: "rgba(94,129,244,0.1)",
                    border: "1px solid rgba(94,129,244,0.2)",
                    fontSize: 10,
                    color: "#A0B4FF",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={handleCopyAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={12} color="#6EE7B7" /> : <Copy size={12} />}
            {copied ? "Скопировано!" : "Copy All"}
          </button>
          <button
            onClick={handleExport}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            <Download size={12} />
            Export JSON
          </button>
        </div>
      </div>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Sidebar: File tree ──────────────────────────────── */}
        <div
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            background: "#252526",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Search */}
          <div style={{ padding: "8px 8px 4px", flexShrink: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Search size={12} color="rgba(255,255,255,0.3)" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск файлов..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 11,
                  color: "#D4D4D4",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          </div>

          {/* Explorer label */}
          <div style={{ padding: "6px 12px 4px", flexShrink: 0 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
              }}
            >
              EXPLORER
            </span>
          </div>

          {/* Tree */}
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
            {filteredFiles ? (
              filteredFiles.map((f) => (
                <button
                  key={f.path}
                  onClick={() => {
                    openFile(f.path);
                    setSearchQuery("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    width: "100%",
                    padding: "3px 12px",
                    background: activeFilePath === f.path ? "rgba(94,129,244,0.12)" : "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    textAlign: "left",
                  }}
                >
                  <FileCode size={12} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.path}
                  </span>
                </button>
              ))
            ) : (
              tree.map((node) => (
                <TreeItem
                  key={node.path}
                  node={node}
                  depth={0}
                  activePath={activeFilePath}
                  onSelect={openFile}
                />
              ))
            )}
          </div>

          {/* Layer legend */}
          <div
            style={{
              padding: "8px 12px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4, fontWeight: 600 }}>
              LAYERS
            </div>
            {stats.layers.map((layer) => {
              const c = layerColor(layer);
              return (
                <div
                  key={layer}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "2px 0",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: c.text,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 10, color: c.text }}>{layer}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Editor area ─────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* File tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "#252526",
              overflow: "auto",
              flexShrink: 0,
            }}
          >
            {openFileTabs.map((tab) => {
              const file = allFiles.find((f) => f.path === tab);
              const isActive = tab === activeFilePath;
              const c = file ? layerColor(file.layer) : null;
              return (
                <div
                  key={tab}
                  onClick={() => openFile(tab)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: isActive ? "#1E1E1E" : "transparent",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    borderTop: isActive ? "1px solid #5E81F4" : "1px solid transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    color: isActive ? "#F0F4FF" : "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-mono)",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  <FileCode size={12} color={c?.text || "rgba(255,255,255,0.4)"} />
                  {tab.split("/").pop()}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFileTab(tab);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          {activeFile && (
            <div
              style={{
                padding: "4px 16px",
                background: "rgba(30,30,30,0.95)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              <Package size={11} color={layerColor(activeFile.layer).text} />
              <span
                style={{
                  fontSize: 10,
                  color: layerColor(activeFile.layer).text,
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: layerColor(activeFile.layer).bg,
                }}
              >
                {activeFile.nodeLabel}
              </span>
              <ChevronRight size={10} color="rgba(255,255,255,0.2)" />
              {activeFile.path.split("/").map((part, i, arr) => (
                <span key={i} style={{ fontSize: 11, color: i === arr.length - 1 ? "#D4D4D4" : "rgba(255,255,255,0.35)" }}>
                  {part}
                  {i < arr.length - 1 && (
                    <ChevronRight
                      size={10}
                      color="rgba(255,255,255,0.15)"
                      style={{ margin: "0 2px", verticalAlign: "middle" }}
                    />
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Code content */}
          <div style={{ flex: 1, overflow: "auto", background: "#1E1E1E" }}>
            {activeFile ? (
              <SyntaxHighlighter code={activeFile.content || "// Empty file"} filePath={activeFile.path} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.25)",
                  gap: 12,
                }}
              >
                <FileCode size={40} style={{ opacity: 0.3 }} />
                <p style={{ fontSize: 13 }}>Выберите файл из дерева проекта</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
                  {stats.totalFiles} файлов доступно для просмотра
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
