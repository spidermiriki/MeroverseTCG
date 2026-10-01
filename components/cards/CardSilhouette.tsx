"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardSilhouetteProps {
  number: number;
  size?: "sm" | "md" | "lg";
  fillWidth?: boolean;
  isHidden?: boolean;
}

export function CardSilhouette({ number, size = "md", fillWidth = false, isHidden = false }: CardSilhouetteProps) {
  const sizes = { sm: "w-24", md: "w-32", lg: "w-40" };

  if (isHidden) return null;

  return (
    <div
      className={cn(fillWidth ? "w-full" : sizes[size], "relative rounded-xl overflow-hidden")}
      style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="flex flex-col items-center justify-center gap-1"
        style={{ aspectRatio: "5/7", background: "rgba(0,0,0,0.45)" }}
      >
        <Lock size={20} style={{ color: "rgba(255,255,255,0.2)" }} />
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: 0.5 }}>
          #{String(number).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
