"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 p-1 rounded-[14px]",
        className,
      )}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative px-4 py-1.5 rounded-[10px] text-sm font-semibold font-inter transition-all duration-200",
              isActive
                ? "text-white"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
            )}
            style={
              isActive
                ? {
                    background: "var(--color-accent)",
                    boxShadow: "0 2px 8px rgb(var(--accent) / 0.35)",
                  }
                : undefined
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
