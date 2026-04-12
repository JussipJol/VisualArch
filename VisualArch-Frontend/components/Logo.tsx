import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "icon-only";
  className?: string;
  size?: number;
}

export function Logo({ variant = "full", className, size = 36 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="va-grad-top" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5CE6FF" />
            <stop offset="100%" stopColor="#7B9EF8" />
          </linearGradient>
          <linearGradient id="va-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B9EF8" />
            <stop offset="100%" stopColor="#8B7CF6" />
          </linearGradient>
          <linearGradient id="va-grad-right" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7EB5FF" />
            <stop offset="100%" stopColor="#9B8DF8" />
          </linearGradient>
          <linearGradient id="va-cube" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5CE6FF" />
            <stop offset="100%" stopColor="#7B6EF8" />
          </linearGradient>
        </defs>

        <line x1="28" y1="8" x2="52" y2="8" stroke="url(#va-grad-top)" strokeWidth="4" strokeLinecap="round" />
        <line x1="52" y1="8" x2="72" y2="40" stroke="url(#va-grad-right)" strokeWidth="4" strokeLinecap="round" />
        <line x1="72" y1="40" x2="52" y2="72" stroke="url(#va-grad-right)" strokeWidth="4" strokeLinecap="round" />
        <line x1="52" y1="72" x2="28" y2="72" stroke="url(#va-grad-top)" strokeWidth="4" strokeLinecap="round" />
        <line x1="28" y1="72" x2="8" y2="40" stroke="url(#va-grad-left)" strokeWidth="4" strokeLinecap="round" />
        <line x1="8" y1="40" x2="28" y2="8" stroke="url(#va-grad-left)" strokeWidth="4" strokeLinecap="round" />

        <line x1="8" y1="40" x2="40" y2="22" stroke="url(#va-grad-top)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
        <line x1="8" y1="40" x2="40" y2="58" stroke="url(#va-grad-left)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />

        <line x1="72" y1="40" x2="40" y2="22" stroke="url(#va-grad-top)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
        <line x1="72" y1="40" x2="40" y2="58" stroke="url(#va-grad-right)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />

        <rect x="31" y="31" width="18" height="18" rx="4" fill="url(#va-cube)" />
        <rect x="34" y="34" width="12" height="12" rx="2.5" fill="white" fillOpacity="0.85" />
      </svg>

      {variant === "full" && (
        <span
          className="font-semibold tracking-tight leading-none"
          style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "1.05rem",
            color: "#F0F4FF",
            letterSpacing: "-0.01em",
          }}
        >
          VisualArch{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #5CE6FF 0%, #8B7CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
        </span>
      )}
    </div>
  );
}
