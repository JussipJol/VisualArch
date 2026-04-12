"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-[3px]",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizeMap[size],
        className
      )}
      style={{
        borderColor: "rgba(167, 139, 250, 0.2)",
        borderTopColor: "#5E81F4",
        borderRightColor: "#A78BFA",
      }}
    />
  );
}
