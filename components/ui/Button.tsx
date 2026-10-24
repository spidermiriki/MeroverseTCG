"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "accent" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const SIZE: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-base",
};

const VARIANT: Record<ButtonVariant, string> = {
  accent: "btn-accent",
  ghost:  "btn-ghost",
  gold:   "btn-gold",
};

export function Button({
  variant = "accent",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold font-inter",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
