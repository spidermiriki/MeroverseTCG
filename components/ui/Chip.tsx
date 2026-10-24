"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChipProps {
  children: ReactNode;
  color?: "accent" | "success" | "danger" | "muted";
  className?: string;
}

const COLOR: Record<NonNullable<ChipProps["color"]>, string> = {
  accent:  "bg-mv-accent/15 text-[var(--color-accent)]  border border-mv-accent/30",
  success: "bg-green-500/15   text-green-400              border border-green-500/30",
  danger:  "bg-red-500/15     text-red-400                border border-red-500/30",
  muted:   "bg-white/5        text-[var(--color-muted)]   border border-white/10",
};

export function Chip({ children, color = "muted", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-inter",
        COLOR[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
