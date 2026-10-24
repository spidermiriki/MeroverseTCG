"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Pill({ children, active = false, onClick, className }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold font-inter transition-all duration-200",
        active
          ? "btn-accent"
          : "bg-transparent border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-bright)]",
        className,
      )}
    >
      {children}
    </button>
  );
}
