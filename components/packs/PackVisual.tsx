"use client";

import { useRef, useEffect } from "react";

interface PackVisualProps {
  imageUrl: string;
  name: string;
  width?: number;
  animated?: boolean;
}

export function PackVisual({
  imageUrl,
  name,
  width = 160,
  animated = true,
}: PackVisualProps) {
  const radius = Math.round(width * 0.04);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) return;
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (shimmerRef.current) {
        shimmerRef.current.style.background = `radial-gradient(ellipse 70% 55% at ${x}% ${y}%, rgba(255,255,255,0.18) 0%, rgba(192,132,252,0.08) 35%, transparent 65%)`;
        shimmerRef.current.style.opacity = "1";
      }
    };

    const handleLeave = () => {
      if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [animated]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width,
        flexShrink: 0,
        borderRadius: radius,
        overflow: "hidden",
        userSelect: "none",
        lineHeight: 0, // remove inline gap below img
        boxShadow: [
          `0 0 0 1px rgba(109,40,217,0.5)`,
          `0 0 30px rgba(109,40,217,0.25)`,
          `4px 12px 32px rgba(0,0,0,0.8)`,
        ].join(", "),
      }}
    >
      {/* Image at natural proportions — design fully baked in */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={name}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
      />

      {/* Foil shimmer on hover */}
      <div
        ref={shimmerRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          transition: "opacity 0.15s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}
