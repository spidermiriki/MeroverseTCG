"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function SectionLabel({ children, right, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center justify-between px-4 pt-5 pb-2", className)}>
      <span
        className="text-xs font-bold font-unbounded uppercase tracking-widest"
        style={{ color: "var(--color-muted)" }}
      >
        {children}
      </span>
      {right && (
        <span className="text-xs font-medium font-inter" style={{ color: "var(--color-accent)" }}>
          {right}
        </span>
      )}
    </div>
  );
}
