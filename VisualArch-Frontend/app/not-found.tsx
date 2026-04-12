"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(94,129,244,0.08) 0%, transparent 70%)",
          top: "10%",
          left: "20%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
          bottom: "10%",
          right: "20%",
        }}
      />

      <motion.div
        className="flex flex-col items-center gap-6 relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo className="mb-2" />

        <div className="relative">
          <span
            className="text-[8rem] font-bold leading-none select-none"
            style={{
              fontFamily: "var(--font-geist), sans-serif",
              background: "linear-gradient(135deg, rgba(94,129,244,0.3), rgba(167,139,250,0.3))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>
        </div>

        <h1
          className="text-2xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-geist), sans-serif" }}
        >
          Страница не найдена
        </h1>
        <p className="text-text-muted max-w-sm">
          Похоже, этой страницы не существует. Возможно, она была перемещена или удалена.
        </p>

        <div className="flex gap-3 mt-2">
          <Link href="/">
            <Button variant="primary" size="md" icon={<Home size={16} />}>
              На главную
            </Button>
          </Link>
          <Button variant="ghost" size="md" icon={<ArrowLeft size={16} />} onClick={() => window.history.back()}>
            Назад
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
