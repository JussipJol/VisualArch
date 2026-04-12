"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

const STEP_SLUGS = ["architect", "canvas", "review", "export"];

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const progress = (project.currentStep / project.totalSteps) * 100;
  const stepSlug = STEP_SLUGS[project.currentStep - 1] || "architect";
  const formattedDate = new Date(project.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    onDelete?.(project.id);
  };

  return (
    <AnimatePresence>
      {!deleting && (
        <motion.div
          layout
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "relative group rounded-2xl p-5 flex flex-col gap-4 cursor-default",
            "border transition-all duration-300",
            "hover:-translate-y-0.5"
          )}
          style={{
            background: "#16213E",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          whileHover={{
            borderColor: "rgba(94, 129, 244, 0.3)",
            boxShadow: "0 8px 32px rgba(94, 129, 244, 0.1)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-text-primary truncate"
                style={{ fontFamily: "var(--font-geist), sans-serif" }}
              >
                {project.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted">
                <Calendar size={11} />
                <span>Создан {formattedDate}</span>
              </div>
            </div>
            <button
              className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <Badge variant="accent">
            Шаг {project.currentStep} из {project.totalSteps} · {project.stepName}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            icon={<ArrowRight size={14} />}
            iconPosition="right"
            className="w-full"
            onClick={() => window.location.href = `/project/${project.id}/${stepSlug}`}
          >
            Продолжить
          </Button>

          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #5E81F4, #A78BFA)",
              }}
            />
          </div>

          <AnimatePresence>
            {showConfirm && (
              <motion.div
                className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-6"
                style={{ background: "rgba(13, 13, 27, 0.97)", backdropFilter: "blur(8px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm text-center text-text-primary">
                  Удалить проект{" "}
                  <span className="font-semibold">&quot;{project.name}&quot;</span>?<br />
                  <span className="text-text-muted text-xs">Это действие нельзя отменить</span>
                </p>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    loading={deleting}
                    onClick={handleDelete}
                  >
                    Удалить
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "#16213E", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-6 w-1/3 rounded-full" />
      <div className="skeleton h-8 w-full rounded-xl" />
    </div>
  );
}
