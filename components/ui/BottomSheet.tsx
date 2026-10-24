"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Overlay } from "./Overlay";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  return (
    <>
      <Overlay open={open} onClose={onClose} />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] overflow-hidden",
          "max-h-[85dvh] flex flex-col",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
          className,
        )}
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 -16px 48px rgba(0,0,0,0.5)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="h-1 w-10 rounded-full"
            style={{ background: "var(--color-border-bright)" }}
          />
        </div>

        {/* Title */}
        {title && (
          <div className="px-5 pt-2 pb-3">
            <h2 className="text-base font-bold font-unbounded text-[var(--color-text)]">
              {title}
            </h2>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {children}
        </div>
      </div>
    </>
  );
}
