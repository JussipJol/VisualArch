"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles = {
  primary:
    "bg-accent text-white hover:bg-accent/90 hover:-translate-y-0.5 shadow-lg hover:shadow-accent/25 hover:shadow-xl transition-all duration-200",
  ghost:
    "bg-transparent text-text-muted hover:text-text-primary hover:bg-white/5 transition-all duration-200",
  outline:
    "bg-transparent border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent hover:-translate-y-0.5 transition-all duration-200",
  destructive:
    "bg-red-600 text-white hover:bg-red-500 hover:-translate-y-0.5 transition-all duration-200",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium cursor-pointer select-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        style={
          variant === "primary"
            ? {
                background: "linear-gradient(135deg, #5E81F4 0%, #7C6FF7 100%)",
                boxShadow: "0 4px 24px rgba(94, 129, 244, 0.3)",
              }
            : undefined
        }
        {...props}
      >
        {loading ? (
          <LoadingSpinner size="sm" className="mr-1" />
        ) : (
          icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
