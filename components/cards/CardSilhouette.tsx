"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardSilhouetteProps {
  number: number;
  size?: "sm" | "md" | "lg";
  isHidden?: boolean; // completely hidden (secret not revealed)
}

export function CardSilhouette({ number, size = "md", isHidden = false }: CardSilhouetteProps) {
  const sizes = {
    sm: "w-24",
    md: "w-32",
    lg: "w-40",
  };

  if (isHidden) return null;

  return (
    <div
      className={cn(sizes[size], "relative rounded-xl border-2 overflow-hidden")}
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
    >
      {/* Dark placeholder image area */}
      <div
        className="flex items-center justify-center"
        style={{ aspectRatio: "2/3", background: "rgba(0,0,0,0.5)" }}
      >
        <Lock size={24} style={{ color: "var(--color-text-muted)" }} />
      </div>

      {/* Number */}
      <div className="p-1.5">
        <p className="text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>
          ???
        </p>
        <p className="text-[9px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          #{String(number).padStart(3, "0")}
        </p>
      </div>
    </div>
  );
}
