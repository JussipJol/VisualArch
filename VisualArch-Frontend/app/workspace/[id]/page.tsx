"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  RefreshCw,
  ArrowLeft,
  LayoutGrid,
  Clock,
  AlertCircle,
  Loader2,
  Code2,
  Layers,
  Download,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { useArchitectureStore } from "@/store/useArchitectureStore";

const ArchitectureCanvas = dynamic(() => import("@/components/canvas/ArchitectureCanvas"), { ssr: false });
const CockpitCodePanel = dynamic(() => import("@/components/canvas/CockpitCodePanel"), { ssr: false });
const CockpitConsolePanel = dynamic(() => import("@/components/canvas/CockpitConsolePanel"), { ssr: false });
const FullCodeIDE = dynamic(() => import("@/components/canvas/FullCodeIDE"), { ssr: false });

interface Workspace {
  workspace_id: string;
  name: string;
  context_theme: string;
  settings: { primary_color: string; framework: string };
  architecture_data?: {
    nodes: unknown[];
    edges: unknown[];
    iteration: number;
    full_context_summary: string;
    tech_stack?: string[];
    file_tree?: string[];
    last_prompt?: string;
    generated_at?: string;
  };
}

export default function WorkspacePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const workspaceId = params.id;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [genError, setGenError] = useState("");

  const {
    setArchitecture,
    setGenerating,
    isGenerating,
    nodes,
    edges,
    iteration,
    techStack,
    reset,
    addLog,
    clearLogs,
    viewMode,
    setViewMode,
    layoutDirection,
    setLayoutDirection,
  } = useArchitectureStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Fetch workspace ───────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Not found");
        setWorkspace(data.workspace);

        if (data.workspace.architecture_data?.nodes?.length > 0) {
          setArchitecture(data.workspace.architecture_data as Parameters<typeof setArchitecture>[0]);
        }
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => reset();
  }, [workspaceId, setArchitecture, reset]);

  // ── Auto-resize textarea ──────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  }, [prompt]);

  const abortRef = useRef<AbortController | null>(null);

  // ── Generate via SSE stream ───────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setGenerating(true);
    setGenError("");
    clearLogs();
    abortRef.current = new AbortController();

    try {
      addLog("Начинаю планирование архитектуры...");
      addLog(`Промпт: "${prompt.trim().slice(0, 80)}${prompt.trim().length > 80 ? "..." : ""}"`);

      const res = await fetch(`/api/workspaces/${workspaceId}/generate/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_prompt: prompt.trim() }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        const msg = (data as { error?: string })?.error || "Ошибка генерации";
        addLog(`[ERROR] ${msg}`);
        setGenError(msg);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const chunk of lines) {
          const eventMatch = chunk.match(/^event: (\w+)/m);
          const dataMatch  = chunk.match(/^data: (.+)/m);
          if (!dataMatch) continue;

          const eventType = eventMatch?.[1] ?? "message";
          let payload: Record<string, unknown> = {};
          try { payload = JSON.parse(dataMatch[1]); } catch { continue; }

          switch (eventType) {
            case "planning_start":
              addLog(`[AI] Планирование архитектуры (итерация ${payload.iteration})...`);
              break;
            case "planning_done":
              addLog(`[AI] Готово: ${payload.node_count} компонентов · стек: ${(payload.tech_stack as string[] || []).slice(0, 3).join(", ")}`);
              break;
            case "coding_start":
              addLog(`[AI] Генерирую код для ${payload.total} компонентов...`);
              break;
            case "coding_node":
              addLog(`  → [${Number(payload.index) + 1}/${payload.total}] ${payload.label} (${payload.layer})`);
              break;
            case "node_done":
              addLog(`  ✓ ${payload.label} — ${payload.file_count} файлов`);
              break;
            case "complete": {
              const arch = payload.architecture_data as Parameters<typeof setArchitecture>[0];
              addLog(`[READY] ${arch.nodes.length} компонентов · ${arch.tech_stack?.length || 0} технологий · ${arch.file_tree?.length || 0} файлов`);
              setArchitecture(arch);
              setPrompt("");
              break;
            }
            case "error": {
              const msg = String(payload.message ?? "Ошибка генерации");
              addLog(`[ERROR] ${msg}`);
              setGenError(msg);
              break;
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Ошибка сервера";
      addLog(`[ERROR] ${msg}`);
      setGenError(msg);
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // ── Export architecture ───────────────────────────────────
  const handleExport = () => {
    const allFiles = useArchitectureStore.getState().getAllFiles();
    const stats = useArchitectureStore.getState().getStats();
    const data = {
      workspace: workspace?.name,
      iteration,
      tech_stack: techStack,
      stats,
      nodes: nodes.map((n) => ({
        id: n.id,
        label: n.data.label,
        layer: n.data.layer,
        description: n.data.description,
        files: n.data.files?.map((f) => ({ path: f.path, content: f.content })) || [],
      })),
      edges: edges.map((e) => ({ source: e.source, target: e.target, label: (e as { label?: string }).label })),
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workspace?.name || "architecture"}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── States ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0D1117" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm text-text-muted">Загрузка воркспейса...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0D1117" }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-text-primary font-semibold">Воркспейс не найден</p>
          <p className="text-sm text-text-muted">{fetchError}</p>
          <button onClick={() => router.push("/dashboard")} className="text-sm text-accent hover:text-accent-glow transition-colors">
            ← Вернуться к дашборду
          </button>
        </div>
      </div>
    );
  }

  const hasArchitecture = nodes.length > 0;

  return (
    <div className="flex flex-col" style={{ backgroundColor: "#0D1117", minHeight: "100vh", paddingTop: 64 }}>
      <Navbar variant="app" />

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          background: "rgba(13,17,23,0.95)",
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={16} />
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LayoutGrid size={13} color="rgba(255,255,255,0.4)" />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#F0F4FF",
                fontFamily: "var(--font-geist), sans-serif",
              }}
            >
              {workspace.name}
            </span>
            <span
              style={{
                padding: "1px 8px",
                borderRadius: 12,
                background: "rgba(94,129,244,0.15)",
                border: "1px solid rgba(94,129,244,0.3)",
                fontSize: 10,
                fontWeight: 600,
                color: "#A0B4FF",
              }}
            >
              {workspace.settings.framework}
            </span>
          </div>
          {workspace.context_theme && (
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              {workspace.context_theme}
            </p>
          )}
        </div>

        {/* Tech stack badges */}
        {techStack.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#6EE7B7",
                }}
              >
                {tech}
              </span>
            ))}
            {techStack.length > 4 && (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", alignSelf: "center" }}>
                +{techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* View mode toggle + actions */}
        {hasArchitecture && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            
            {/* ── Layout Switcher ── */}
            {viewMode === "canvas" && (
              <div
                style={{
                  display: "flex",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                {[
                  { id: "LR", label: "Baseline" },
                  { id: "TB", label: "Tree" },
                  { id: "Planetary", label: "Planetary" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayoutDirection(l.id as any)}
                    style={{
                      padding: "4px 12px",
                      background: layoutDirection === l.id ? "rgba(94,129,244,0.15)" : "transparent",
                      color: layoutDirection === l.id ? "#A0B4FF" : "rgba(255,255,255,0.4)",
                      border: "none",
                      borderRight: l.id === "Planetary" ? "none" : "1px solid rgba(255,255,255,0.1)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}

            {/* Canvas / IDE toggle */}
            <div
              style={{
                display: "flex",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setViewMode("canvas")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  background: viewMode === "canvas" ? "rgba(94,129,244,0.15)" : "transparent",
                  border: "none",
                  color: viewMode === "canvas" ? "#A0B4FF" : "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Layers size={13} />
                Canvas
              </button>
              <button
                onClick={() => setViewMode("ide")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  background: viewMode === "ide" ? "rgba(94,129,244,0.15)" : "transparent",
                  border: "none",
                  color: viewMode === "ide" ? "#A0B4FF" : "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Code2 size={13} />
                Full Code
              </button>
            </div>

            {/* Export */}
            <button
              onClick={handleExport}
              title="Экспорт архитектуры"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 8px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}
            >
              <Download size={13} />
            </button>
          </div>
        )}

        {/* Iteration badge */}
        {iteration > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 20,
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.25)",
            }}
          >
            <RefreshCw size={10} color="#C4B5FD" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#C4B5FD" }}>
              Итерация {iteration}
            </span>
          </motion.div>
        )}
      </div>

      {/* ── Main area ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Central content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {viewMode === "canvas" ? (
            <>
              {/* Canvas (Left) */}
              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                {hasArchitecture ? (
                  <ArchitectureCanvas />
                ) : (
                  /* Empty state */
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 16,
                      padding: 40,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ textAlign: "center" }}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background: "rgba(94,129,244,0.1)",
                          border: "1px solid rgba(94,129,244,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                        }}
                      >
                        <Sparkles size={24} color="#5E81F4" />
                      </div>
                      <h2
                        style={{
                          margin: "0 0 8px",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#F0F4FF",
                          fontFamily: "var(--font-geist), sans-serif",
                        }}
                      >
                        Architect Intelligence
                      </h2>
                      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: 420 }}>
                        Опишите, что нужно спроектировать. AI создаст архитектуру с кодом, файловой структурой и спецификацией.
                      </p>
                    </motion.div>

                    {/* Hint tiles */}
                    <motion.div
                      style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 8, maxWidth: 600 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {[
                        "SaaS платформа с аналитическим дашбордом и подпиской",
                        "Real-time collaboration app как Figma",
                        "E-commerce с корзиной, оплатой и админ-панелью",
                        "AI-powered контент-платформа с генерацией и модерацией",
                        "Мессенджер с группами, звонками и файлами",
                        "CRM система с воронкой продаж и отчётами",
                      ].map((hint) => (
                        <button
                          key={hint}
                          onClick={() => setPrompt(hint)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            fontSize: 12,
                            color: "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.background = "rgba(94,129,244,0.12)";
                            (e.target as HTMLButtonElement).style.color = "#A0B4FF";
                            (e.target as HTMLButtonElement).style.borderColor = "rgba(94,129,244,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                            (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
                            (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                          }}
                        >
                          {hint}
                        </button>
                      ))}
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Code Panel (Right) */}
              {hasArchitecture && <CockpitCodePanel />}
            </>
          ) : (
            /* ── IDE Mode ── */
            <FullCodeIDE />
          )}
        </div>

        {/* AI Console */}
        {(hasArchitecture || isGenerating) && <CockpitConsolePanel />}

        {/* ── Prompt bar ──────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            padding: "12px 20px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(13,17,23,0.98)",
          }}
        >
          {genError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                marginBottom: 10,
                fontSize: 12,
                color: "#FCA5A5",
              }}
            >
              <AlertCircle size={13} />
              {genError}
            </motion.div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "10px 12px",
            }}
          >
            <Sparkles size={16} color="rgba(94,129,244,0.7)" style={{ flexShrink: 0, marginBottom: 2 }} />
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasArchitecture
                  ? viewMode === "ide"
                    ? "Доработать код: добавь авторизацию, измени API..."
                    : `Итерация ${iteration + 1}: уточните или расширьте архитектуру...`
                  : "Опишите архитектуру проекта (Ctrl+Enter для генерации)..."
              }
              disabled={isGenerating}
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: 13,
                color: "#F0F4FF",
                lineHeight: 1.6,
                fontFamily: "var(--font-inter), sans-serif",
                maxHeight: 160,
                overflowY: "auto",
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "none",
                background:
                  !prompt.trim() || isGenerating
                    ? "rgba(94,129,244,0.2)"
                    : "linear-gradient(135deg, #5E81F4, #A78BFA)",
                cursor: !prompt.trim() || isGenerating ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                boxShadow: prompt.trim() && !isGenerating ? "0 4px 16px rgba(94,129,244,0.35)" : "none",
              }}
            >
              {isGenerating ? (
                <Loader2 size={16} color="rgba(255,255,255,0.5)" className="animate-spin" />
              ) : (
                <Send size={15} color={!prompt.trim() ? "rgba(255,255,255,0.3)" : "white"} />
              )}
            </button>
          </div>

          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
              Ctrl+Enter для генерации · {viewMode === "ide" ? "IDE mode" : "Canvas mode"}
            </span>
            {workspace.architecture_data?.generated_at && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                <Clock size={9} />
                {new Date(workspace.architecture_data.generated_at).toLocaleString("ru-RU")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
