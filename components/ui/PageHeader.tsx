"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  right?: ReactNode;
  subtitle?: string;
}

export function PageHeader({ title, right, subtitle }: PageHeaderProps) {
  return (
    <div
      className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
      style={{
        background: "rgba(2,2,10,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(109,40,217,0.2)",
      }}
    >
      <div>
        <h1
          className="text-lg font-black tracking-wide"
          style={{
            background: "linear-gradient(135deg, #e2e8f9 0%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{subtitle}</p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
