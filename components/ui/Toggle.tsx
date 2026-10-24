"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function Toggle({ checked, onChange, disabled = false, className, label }: ToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {label && (
        <span className="text-sm font-medium font-inter text-[var(--color-text)]">
          {label}
        </span>
      )}
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
        )}
        style={{
          background: (!disabled && checked) ? "var(--color-accent)" : "var(--color-border)",
          boxShadow:  (!disabled && checked) ? "0 0 8px rgb(var(--accent) / 0.4)" : "none",
        }}
      >
        <span
          className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{
            transform: checked ? "translateX(22px)" : "translateX(4px)",
          }}
        />
      </button>
    </label>
  );
}
