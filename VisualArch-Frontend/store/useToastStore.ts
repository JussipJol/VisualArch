import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Omit<Toast, "id">) => string;
  remove: (id: string) => void;
  clear: () => void;
  // Helpers
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  add: (toast) => {
    const id = Math.random().toString(36).slice(2);
    const duration = toast.duration ?? 4000;

    set((s) => ({
      toasts: [...s.toasts.slice(-2), { ...toast, id, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => get().remove(id), duration);
    }

    return id;
  },

  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),

  success: (title, message) => get().add({ type: "success", title, message }),
  error:   (title, message) => get().add({ type: "error",   title, message }),
  warning: (title, message) => get().add({ type: "warning", title, message }),
  info:    (title, message) => get().add({ type: "info",    title, message }),
}));
