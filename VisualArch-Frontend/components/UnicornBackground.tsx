"use client";

import { cn } from "@/lib/utils";

interface UnicornBackgroundProps {
  className?: string;
  overlayOpacity?: number;
}

export function UnicornBackground({
  className,
  overlayOpacity = 0.15,
}: UnicornBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        data-us-project="vaAcnyv9ZB2Ge0S5n94E"
        style={{ width: "100%", height: "100%" }}
      />

      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `rgba(0,0,0,${overlayOpacity})` }}
        />
      )}
    </div>
  );
}
