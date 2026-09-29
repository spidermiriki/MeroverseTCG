"use client";

import { ChevronRight, Zap } from "lucide-react";
import { PackVisual } from "./PackVisual";
import { MAX_FREE_PACKS } from "@/lib/pack-odds";

interface Pack {
  id: string;
  name: string;
  collection: string;
  price: number;
  imageUrl: string;
  cardsCount: number;
  description?: string | null;
}

interface PackCardProps {
  pack: Pack;
  freePackCount: number;
  onClick: () => void;
}

export function PackCard({ pack, freePackCount, onClick }: PackCardProps) {
  const hasFree = freePackCount > 0;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 14px 10px 10px",
        borderRadius: 20,
        border: "1px solid rgba(109,40,217,0.25)",
        background: "rgba(8,4,24,0.65)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Small pack visual */}
      <div style={{ flexShrink: 0 }}>
        <PackVisual imageUrl={pack.imageUrl} name={pack.name} width={68} animated={false} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "#e2e8f9",
            marginBottom: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {pack.name}
        </p>
        <p style={{
          fontSize: 11,
          color: "rgba(192,132,252,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 8,
        }}>
          {pack.cardsCount} cartes · {pack.price} Melocoins
        </p>

        {/* Accumulation progress bar */}
        <div style={{ display: "flex", gap: 2 }}>
          {[...Array(MAX_FREE_PACKS)].map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: i < freePackCount
                  ? "linear-gradient(90deg, #7c3aed, #a3e635)"
                  : "rgba(109,40,217,0.15)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: free count badge + chevron */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        {hasFree ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 20,
              background: "rgba(5,150,105,0.15)",
              border: "1px solid rgba(5,150,105,0.3)",
            }}
          >
            <Zap size={10} style={{ color: "#a3e635" }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#a3e635" }}>{freePackCount}</span>
          </div>
        ) : (
          <div style={{ width: 20, height: 20 }} />
        )}
        <ChevronRight size={16} style={{ color: "rgba(109,40,217,0.45)" }} />
      </div>
    </button>
  );
}
