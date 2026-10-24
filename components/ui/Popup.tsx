"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Overlay } from "./Overlay";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Popup({ open, onClose, title, children, footer, className }: PopupProps) {
  if (!open) return null;

  return (
    <Overlay open={open} onClose={onClose}>
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
          "w-[calc(100%-32px)] max-w-sm rounded-[24px] overflow-hidden",
          className,
        )}
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          {title && (
            <h2 className="text-base font-bold font-unbounded text-[var(--color-text)]">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto flex items-center justify-center size-8 rounded-full transition-colors"
            style={{ background: "var(--color-surface-2)" }}
          >
            <X size={16} color="var(--color-muted)" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-4 text-sm font-inter text-[var(--color-text)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="px-5 pt-3 pb-5 flex flex-col gap-2"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </Overlay>
  );
}
