"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

import { GoogleIcon, GithubIcon, DiscordIcon } from "@/components/shared/icons";
import { UnicornBackground } from "@/components/UnicornBackground";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "error" | "success";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  // ── Build sync URL so OAuth users get their va_token cookie ──
  const syncUrl = (dest: string) =>
    `/api/auth/sync?redirect=${encodeURIComponent(dest)}`;

  // ── Email / Password login (JWT cookie flow) ─────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        setFormState("error");
        return;
      }

      setFormState("success");
      setTimeout(() => {
        router.push(redirect || "/dashboard");
      }, 400);
    } catch {
      setError("Не удалось подключиться к серверу");
      setFormState("error");
    }
  };

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";
  const isDisabled = isLoading || isSuccess;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#1A1A2E" }}>
      {/* Back to home */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 20 }}>
        <BackButton href="/" label="На главную" />
      </div>
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col items-center justify-center">
        <UnicornBackground className="absolute inset-0 z-0" overlayOpacity={0.5} />
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }} className="mb-8">
            <Logo size={48} />
          </motion.div>
          <motion.h2
            className="text-3xl font-bold text-white leading-snug mb-6"
            style={{ fontFamily: "var(--font-geist), sans-serif" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
          >
            Опиши идею —<br />
            <span style={{ background: "linear-gradient(135deg, #5E81F4, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              получи кодовую базу
            </span>
          </motion.h2>
          <motion.div className="flex items-center justify-center gap-8 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
            {[{ icon: "🧠", label: "AI Architect" }, { icon: "🎨", label: "Canvas" }, { icon: "⚡", label: "Live Code" }].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-white/50 font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="md:hidden mb-8 flex justify-center"><Logo /></div>

          <div className="rounded-2xl p-8" style={{ background: "rgba(22, 33, 62, 0.8)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ fontFamily: "var(--font-geist), sans-serif" }}>С возвращением</h1>
            <p className="text-sm text-text-muted mb-6">Войдите, чтобы продолжить</p>

            {/* ── OAuth buttons ── */}
            <div className="flex flex-col gap-2.5 mb-6">
              <Button variant="outline" size="md" className="w-full" icon={<GoogleIcon size={16} />}
                onClick={() => signIn("google", { callbackUrl: syncUrl(redirect || "/dashboard") })}>
                Войти через Google
              </Button>
              <Button variant="outline" size="md" className="w-full" icon={<GithubIcon size={16} />}
                onClick={() => signIn("github", { callbackUrl: syncUrl(redirect || "/dashboard") })}>
                Войти через GitHub
              </Button>
              <Button variant="outline" size="md" className="w-full" icon={<DiscordIcon size={16} />}
                onClick={() => signIn("discord", { callbackUrl: syncUrl(redirect || "/dashboard") })}>
                Войти через Discord
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs text-text-muted">или войдите по email</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {formState === "error" && (
              <motion.div className="flex items-center gap-2.5 p-3 rounded-xl mb-5 text-sm text-red-300"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <AlertCircle size={14} className="flex-shrink-0" />{error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-muted">Email</label>
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" disabled={isDisabled}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50")}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.borderColor = "#5E81F4"; e.target.style.boxShadow = "0 0 0 3px rgba(94,129,244,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-text-muted">Пароль</label>
                  <a href="#" className="text-xs text-text-muted hover:text-accent transition-colors">Забыли пароль?</a>
                </div>
                <div className="relative">
                  <input id="login-password" type={showPwd ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={isDisabled}
                    className={cn("w-full px-4 py-2.5 pr-10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50")}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={(e) => { e.target.style.borderColor = "#5E81F4"; e.target.style.boxShadow = "0 0 0 3px rgba(94,129,244,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" loading={isLoading}
                className={cn("w-full mt-2 transition-all duration-300", isSuccess && "!bg-emerald-600")}
                style={isSuccess ? { background: "#059669", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" } : undefined}
                icon={isSuccess ? <Check size={16} /> : undefined}>
                {isSuccess ? "Входим..." : isLoading ? "Входим..." : "Войти"}
              </Button>
            </form>

            <p className="text-center text-sm text-text-muted mt-6">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-accent hover:text-accent-glow transition-colors font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D1117]" />}>
      <LoginContent />
    </Suspense>
  );
}
