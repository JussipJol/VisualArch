"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Palette,
  Code2,
  Layers,
  Check,
  AlertCircle,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";

const FRAMEWORKS = [
  { value: "Next.js", label: "Next.js", icon: "▲" },
  { value: "React", label: "React", icon: "⚛️" },
  { value: "Vue", label: "Vue.js", icon: "💚" },
  { value: "Svelte", label: "Svelte", icon: "🔥" },
  { value: "Angular", label: "Angular", icon: "🅰️" },
  { value: "Other", label: "Другое", icon: "⚙️" },
];

const COLORS = [
  "#5E81F4",
  "#A78BFA",
  "#F472B6",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#EF4444",
  "#8B5CF6",
];

type FormState = "idle" | "loading" | "error" | "success";

export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [contextTheme, setContextTheme] = useState("");
  const [framework, setFramework] = useState("Next.js");
  const [primaryColor, setPrimaryColor] = useState("#5E81F4");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Введите название воркспейса");
      setFormState("error");
      return;
    }

    setFormState("loading");
    setError("");

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          context_theme: contextTheme.trim(),
          settings: {
            primary_color: primaryColor,
            framework,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка создания воркспейса");
        setFormState("error");
        return;
      }

      setFormState("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch {
      setError("Не удалось подключиться к серверу");
      setFormState("error");
    }
  };

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";
  const isDisabled = isLoading || isSuccess;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      {/* Back button */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 20 }}>
        <BackButton href="/dashboard" label="На дашбоард" />
      </div>
      {/* Background ambient effects */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(94,129,244,0.08) 0%, transparent 70%)",
          top: "-15%",
          left: "-10%",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
          bottom: "-10%",
          right: "-5%",
        }}
      />

      <motion.div
        className="w-full max-w-lg relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-4 flex justify-center"
          >
            <Logo size={36} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(94,129,244,0.1)",
                border: "1px solid rgba(94,129,244,0.2)",
              }}
            >
              <Sparkles size={12} className="text-accent" />
              <span className="text-xs font-medium text-accent">Добро пожаловать!</span>
            </div>
            <h1
              className="text-2xl font-bold text-text-primary mb-2"
              style={{ fontFamily: "var(--font-geist), sans-serif" }}
            >
              Создайте ваш первый Workspace
            </h1>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              Workspace — это пространство для ваших проектов. Задайте контекст, и AI будет учитывать его при генерации.
            </p>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(22, 33, 62, 0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AnimatePresence>
            {formState === "error" && (
              <motion.div
                className="flex items-center gap-2.5 p-3 rounded-xl mb-5 text-sm text-red-300"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Workspace Name */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-text-muted">
                <Layers size={12} />
                Название воркспейса
              </label>
              <input
                id="onboarding-workspace-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome App"
                disabled={isDisabled}
                className="w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5E81F4";
                  e.target.style.boxShadow = "0 0 0 3px rgba(94,129,244,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Context / Theme */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-text-muted">
                <Sparkles size={12} />
                Контекст проекта
                <span className="text-text-muted/50">(необязательно)</span>
              </label>
              <textarea
                id="onboarding-context"
                value={contextTheme}
                onChange={(e) => setContextTheme(e.target.value)}
                placeholder="Например: E-commerce платформа для продажи обуви, с фокусом на минимализм и скорость"
                disabled={isDisabled}
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50 resize-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5E81F4";
                  e.target.style.boxShadow = "0 0 0 3px rgba(94,129,244,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Framework Selector */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-medium text-text-muted">
                <Code2 size={12} />
                Основной фреймворк
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FRAMEWORKS.map((fw) => (
                  <button
                    key={fw.value}
                    type="button"
                    onClick={() => setFramework(fw.value)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                      "disabled:opacity-50"
                    )}
                    style={{
                      background:
                        framework === fw.value
                          ? "rgba(94,129,244,0.15)"
                          : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        framework === fw.value
                          ? "rgba(94,129,244,0.4)"
                          : "rgba(255,255,255,0.08)"
                      }`,
                      color:
                        framework === fw.value
                          ? "#A0B4FF"
                          : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <span>{fw.icon}</span>
                    {fw.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-medium text-text-muted">
                <Palette size={12} />
                Основной цвет проекта
              </label>
              <div className="flex items-center gap-2.5">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setPrimaryColor(color)}
                    disabled={isDisabled}
                    className="relative w-8 h-8 rounded-full transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: color,
                      boxShadow:
                        primaryColor === color
                          ? `0 0 0 2px #1A1A2E, 0 0 0 4px ${color}`
                          : "none",
                      transform:
                        primaryColor === color ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {primaryColor === color && (
                      <Check
                        size={14}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              icon={
                isSuccess ? (
                  <Check size={18} />
                ) : (
                  <ArrowRight size={18} />
                )
              }
              iconPosition="right"
              className={cn(
                "w-full mt-2 transition-all duration-300",
                isSuccess && "!bg-emerald-600"
              )}
              style={
                isSuccess
                  ? {
                      background: "#059669",
                      boxShadow: "0 4px 20px rgba(5,150,105,0.3)",
                    }
                  : undefined
              }
            >
              {isSuccess
                ? "Готово!"
                : isLoading
                ? "Создаём..."
                : "Создать Workspace"}
            </Button>
          </form>
        </motion.div>

        {/* Skip */}
        <motion.p
          className="text-center text-xs text-text-muted/60 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Вы сможете настроить всё позже в настройках
        </motion.p>
      </motion.div>
    </div>
  );
}
