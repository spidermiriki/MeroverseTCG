"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OverlayProps {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  blur?: boolean;
  className?: string;
}

export function Overlay({ open, onClose, children, blur = true, className }: OverlayProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-40",
        blur && "backdrop-blur-sm",
        className,
      )}
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      {children && (
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      )}
    </div>
  );
}
