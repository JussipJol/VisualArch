"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, AlertCircle, CheckCircle2, Building2, User } from "lucide-react";
import { signIn } from "next-auth/react";

import { GoogleIcon, GithubIcon, DiscordIcon } from "@/components/shared/icons";
import { UnicornBackground } from "@/components/UnicornBackground";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "error" | "success";
type AccountType = "individual" | "company";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Минимум 8 символов", ok: password.length >= 8 },
    { label: "Буква верхнего регистра", ok: /[A-Z]/.test(password) },
    { label: "Цифра", ok: /\d/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1 mt-2">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2 text-xs">
          <CheckCircle2 size={11} className={c.ok ? "text-emerald-400" : "text-text-muted/40"} />
          <span className={c.ok ? "text-emerald-400" : "text-text-muted/60"}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  const errors = {
    username: username && username.length < 3 ? "Минимум 3 символа" : "",
    email: email && !validateEmail(email) ? "Введите корректный email" : "",
    password: password && password.length < 8 ? "Пароль должен быть не менее 8 символов" : "",
    confirmPwd: confirmPwd && password !== confirmPwd ? "Пароли не совпадают" : "",
  };

  // ── Email / Password registration (JWT cookie flow) ───────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.username || errors.email || errors.password || errors.confirmPwd) return;
    if (!username || !email || !password || !confirmPwd) return;

    setFormState("loading");
    setError("");

    try {
      const body: Record<string, unknown> = { email, username, password, type: accountType };
      if (accountType === "company") {
        body.company_details = { name: companyName, website: companyWebsite };
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        setFormState("error");
        return;
      }

      setFormState("success");
      setTimeout(() => { router.push("/onboarding"); }, 500);
    } catch {
      setError("Не удалось подключиться к серверу");
      setFormState("error");
    }
  };

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";
  const isDisabled = isLoading || isSuccess;

  const inputStyle = (hasError: boolean) => ({
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
  });
  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#5E81F4";
    e.target.style.boxShadow = "0 0 0 3px rgba(94,129,244,0.12)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
    e.target.style.borderColor = hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#1A1A2E" }}>
      {/* Back to home */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 20 }}>
        <BackButton href="/" label="На главную" />
      </div>
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col items-center justify-center">
        <UnicornBackground className="absolute inset-0 z-0" overlayOpacity={0.5} />
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }} className="mb-8">
            <Logo size={48} />
          </motion.div>
          <motion.h2 className="text-3xl font-bold text-white leading-snug mb-4" style={{ fontFamily: "var(--font-geist), sans-serif" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
            Создай проект за{" "}
            <span style={{ background: "linear-gradient(135deg, #5E81F4, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              5 минут
            </span>
          </motion.h2>
          <motion.p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
            Присоединяйся к тысячам разработчиков, которые уже ускорили свой рабочий процесс
          </motion.p>
          <motion.div className="mt-10 flex flex-col gap-3 text-left"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
            {["Бесплатный аккаунт навсегда", "Без кредитной карты", "Первый проект за 5 минут"].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(94,129,244,0.2)" }}>
                  <Check size={10} className="text-accent" />
                </div>
                <span className="text-white/70">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="md:hidden mb-8 flex justify-center"><Logo /></div>

          <div className="rounded-2xl p-8" style={{ background: "rgba(22, 33, 62, 0.8)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ fontFamily: "var(--font-geist), sans-serif" }}>Создать аккаунт</h1>
            <p className="text-sm text-text-muted mb-6">Присоединяйся к VisualArch AI</p>

            {/* ── OAuth buttons ── */}
            <div className="flex flex-col gap-2.5 mb-6">
              <Button variant="outline" size="md" className="w-full" icon={<GoogleIcon size={16} />}
                onClick={() => signIn("google", { callbackUrl: "/api/auth/sync?redirect=%2Fdashboard" })}>
                Войти через Google
              </Button>
              <Button variant="outline" size="md" className="w-full" icon={<GithubIcon size={16} />}
                onClick={() => signIn("github", { callbackUrl: "/api/auth/sync?redirect=%2Fdashboard" })}>
                Войти через GitHub
              </Button>
              <Button variant="outline" size="md" className="w-full" icon={<DiscordIcon size={16} />}
                onClick={() => signIn("discord", { callbackUrl: "/api/auth/sync?redirect=%2Fdashboard" })}>
                Войти через Discord
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs text-text-muted">или зарегистрируйтесь по email</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {formState === "error" && (
              <motion.div className="flex items-center gap-2.5 p-3 rounded-xl mb-5 text-sm text-red-300"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <AlertCircle size={14} className="flex-shrink-0" />{error}
              </motion.div>
            )}

            {/* ── Email / Password registration form ── */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Account Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-muted">Тип аккаунта</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "individual" as const, icon: <User size={14} />, label: "Личный" },
                    { value: "company" as const, icon: <Building2 size={14} />, label: "Компания" },
                  ].map((option) => (
                    <button key={option.value} type="button" onClick={() => setAccountType(option.value)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: accountType === option.value ? "rgba(94,129,244,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${accountType === option.value ? "rgba(94,129,244,0.4)" : "rgba(255,255,255,0.1)"}`,
                        color: accountType === option.value ? "#A0B4FF" : "rgba(255,255,255,0.5)",
                      }}>
                      {option.icon}{option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Details */}
              <AnimatePresence>
                {accountType === "company" && (
                  <motion.div className="flex flex-col gap-3.5"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-muted">Название компании</label>
                      <input id="register-company-name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="VisualArch Agency" disabled={isDisabled}
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50"
                        style={inputStyle(false)} onFocus={inputFocus} onBlur={(e) => inputBlur(e, false)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-muted">Сайт <span className="text-text-muted/50">(необязательно)</span></label>
                      <input id="register-company-website" type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)}
                        placeholder="https://example.com" disabled={isDisabled}
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50"
                        style={inputStyle(false)} onFocus={inputFocus} onBlur={(e) => inputBlur(e, false)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-muted">Username</label>
                <input id="register-username" type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  placeholder="designer_pro" disabled={isDisabled}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50"
                  style={inputStyle(!!errors.username)} onFocus={inputFocus} onBlur={(e) => inputBlur(e, !!errors.username)} />
                {errors.username && <p className="text-xs text-red-400">{errors.username}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-muted">Email</label>
                <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" disabled={isDisabled}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50"
                  style={inputStyle(!!errors.email)} onFocus={inputFocus} onBlur={(e) => inputBlur(e, !!errors.email)} />
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-muted">Пароль</label>
                <div className="relative">
                  <input id="register-password" type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Минимум 8 символов" disabled={isDisabled}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50"
                    style={inputStyle(!!errors.password)} onFocus={inputFocus} onBlur={(e) => inputBlur(e, !!errors.password)} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-muted">Подтвердите пароль</label>
                <div className="relative">
                  <input id="register-confirm-password" type={showConfirmPwd ? "text" : "password"} value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Повторите пароль" disabled={isDisabled}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 outline-none transition-all duration-200 disabled:opacity-50"
                    style={inputStyle(!!errors.confirmPwd)} onFocus={inputFocus} onBlur={(e) => inputBlur(e, !!errors.confirmPwd)} />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                    {showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPwd && <p className="text-xs text-red-400">{errors.confirmPwd}</p>}
              </div>

              <Button type="submit" variant="primary" size="md" loading={isLoading}
                className={cn("w-full mt-2 transition-all duration-300", isSuccess && "!bg-emerald-600")}
                style={isSuccess ? { background: "#059669", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" } : undefined}
                icon={isSuccess ? <Check size={16} /> : undefined}>
                {isSuccess ? "Аккаунт создан!" : isLoading ? "Создаём..." : "Создать аккаунт"}
              </Button>
            </form>

            <p className="text-center text-sm text-text-muted mt-5">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="text-accent hover:text-accent-glow transition-colors font-medium">Войти</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
