"use client";

import { RARITY_LABELS, RARITY_COLORS, type Rarity } from "@/lib/pack-odds";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  number: number;
  name: string;
  character: string;
  rarity: string;
  collection: string;
  imageUrl: string;
  description?: string | null;
  race: string;
  planet: string;
}

interface CardItemProps {
  card: Card;
  owned?: boolean;
  quantity?: number;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function CardItem({ card, owned = false, quantity, onClick, size = "md" }: CardItemProps) {
  const rarity = card.rarity as Rarity;
  const rarityColor = RARITY_COLORS[rarity];
  const rarityClass = `card-rarity-${rarity.toLowerCase()}`;

  const widths = { sm: 96, md: 128, lg: 160 };
  const w = widths[size];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all active:scale-95",
        rarityClass,
        !owned && "opacity-50 grayscale"
      )}
      style={{
        width: w,
        flexShrink: 0,
        background: "rgba(10,12,30,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Quantity badge */}
      {owned && quantity && quantity > 1 && (
        <div
          className="absolute top-1 right-1 z-10 text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(109,40,217,0.5)",
          }}
        >
          x{quantity}
        </div>
      )}

      {/* Card image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.imageUrl}
        alt={card.name}
        style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
      />

      {/* Card info */}
      <div className="p-1.5" style={{ background: "rgba(5,5,20,0.6)" }}>
        <p className="text-xs font-bold leading-tight truncate" style={{ color: "var(--color-text)" }}>
          {card.name}
        </p>
        <p className="text-[10px] mt-0.5 font-semibold" style={{ color: rarityColor }}>
          {RARITY_LABELS[rarity]}
        </p>
        <p className="text-[9px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          #{String(card.number).padStart(3, "0")}
        </p>
      </div>
    </div>
  );
}
