"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className,
      )}
    >
      {icon && (
        <div
          className="flex items-center justify-center size-16 rounded-full"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <span className="text-2xl" style={{ color: "var(--color-muted)" }}>
            {icon}
          </span>
        </div>
      )}
      <div className="space-y-1.5">
        <p className="text-base font-bold font-unbounded text-[var(--color-text)]">
          {title}
        </p>
        {description && (
          <p className="text-sm font-inter text-[var(--color-muted)] max-w-[240px]">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
