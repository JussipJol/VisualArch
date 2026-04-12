"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  LayoutGrid,
  FolderOpen,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

// ── Types ────────────────────────────────────────────────────
interface Workspace {
  workspace_id: string;
  name: string;
  context_theme: string;
  settings: {
    primary_color: string;
    framework: string;
  };
  created_at: string;
}

interface UserData {
  user_id: string;
  email: string;
  username: string;
  type: string;
  has_workspace: boolean;
}

type LoadState = "loading" | "loaded" | "error";

// ── Skeleton ─────────────────────────────────────────────────
function WorkspaceSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "#16213E",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-8 w-full rounded-xl" />
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center"
        style={{
          background: "rgba(94,129,244,0.08)",
          border: "1px solid rgba(94,129,244,0.15)",
        }}
      >
        <FolderOpen size={32} className="text-accent opacity-60" />
      </div>
      <h3
        className="text-xl font-semibold text-text-primary mb-2"
        style={{ fontFamily: "var(--font-geist), sans-serif" }}
      >
        Пока нет воркспейсов
      </h3>
      <p className="text-text-muted text-sm mb-8 max-w-xs">
        Создайте первый воркспейс — пространство для ваших AI-проектов
      </p>
      <Button
        variant="primary"
        size="lg"
        icon={<Plus size={18} />}
        onClick={onNew}
      >
        Создать воркспейс
      </Button>
    </motion.div>
  );
}

// ── Workspace Card ───────────────────────────────────────────
function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const router = useRouter();

  const formattedDate = new Date(workspace.created_at).toLocaleDateString(
    "ru-RU",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <motion.div
      className="relative group rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "#16213E",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      whileHover={{
        borderColor: "rgba(94, 129, 244, 0.3)",
        boxShadow: "0 8px 32px rgba(94, 129, 244, 0.1)",
      }}
      onClick={() => router.push(`/workspace/${workspace.workspace_id}`)}
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full"
        style={{
          background: `linear-gradient(90deg, ${workspace.settings.primary_color}, transparent)`,
          opacity: 0.6,
        }}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-text-primary truncate text-base"
            style={{ fontFamily: "var(--font-geist), sans-serif" }}
          >
            {workspace.name}
          </h3>
          <p className="text-xs text-text-muted mt-1 line-clamp-2">
            {workspace.context_theme || "Без описания"}
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `${workspace.settings.primary_color}20`,
          }}
        >
          <Sparkles size={14} style={{ color: workspace.settings.primary_color }} />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(94,129,244,0.1)",
            color: "#A0B4FF",
            border: "1px solid rgba(94,129,244,0.15)",
          }}
        >
          {workspace.settings.framework}
        </span>
        <span className="text-[10px] text-text-muted">{formattedDate}</span>
      </div>
    </motion.div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [query, setQuery] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [creating, setCreating] = useState(false);

  // Fetch user + workspaces
  const fetchData = useCallback(async () => {
    try {
      setLoadState("loading");

      const [userRes, wsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/workspaces"),
      ]);

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      if (wsRes.ok) {
        const wsData = await wsRes.json();
        setWorkspaces(wsData.workspaces || []);
      }

      setLoadState("loaded");
    } catch {
      setLoadState("error");
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    if (!query.trim()) return workspaces;
    return workspaces.filter((ws) =>
      ws.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [workspaces, query]);

  const handleNewWorkspace = () => {
    router.push("/onboarding");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Доброй ночи";
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1A2E" }}>
      <Navbar
        variant="auth"
        userName={user?.username || ""}
        userEmail={user?.email || ""}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-3xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-geist), sans-serif" }}
            >
              {greeting()}, {user?.username || "..."} 👋
            </h1>
            <p className="text-text-muted mt-1.5 text-sm">
              {workspaces.length > 0
                ? `У вас ${workspaces.length} ${
                    workspaces.length === 1
                      ? "воркспейс"
                      : workspaces.length < 5
                      ? "воркспейса"
                      : "воркспейсов"
                  }`
                : "Создайте первый воркспейс"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                id="dashboard-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск..."
                className="pl-9 pr-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted/60 outline-none w-48 sm:w-60 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(94,129,244,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            <Button
              variant="primary"
              size="md"
              loading={creating}
              icon={<Plus size={16} />}
              onClick={handleNewWorkspace}
            >
              Новый
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        {loadState === "loading" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <WorkspaceSkeleton key={i} />
            ))}
          </div>
        ) : loadState === "error" ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-text-muted">Не удалось загрузить данные</p>
            <Button variant="outline" size="sm" onClick={fetchData}>
              Повторить
            </Button>
          </div>
        ) : filtered.length === 0 && query ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LayoutGrid
              size={32}
              className="mx-auto text-text-muted/30 mb-3"
            />
            <p className="text-text-muted">
              Не найдено по запросу{" "}
              <span className="text-text-primary">&quot;{query}&quot;</span>
            </p>
          </motion.div>
        ) : workspaces.length === 0 ? (
          <EmptyState onNew={handleNewWorkspace} />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((ws, i) => (
                <motion.div
                  key={ws.workspace_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  layout
                >
                  <WorkspaceCard workspace={ws} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
