"use client";

import { useState } from "react";
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
  fillWidth?: boolean;
}

const FLOAT_DELAYS = ["", "card-float-delay-1", "card-float-delay-2"];

// RGB channels pour construire les box-shadow avec différentes opacités
const RARITY_RGB: Record<string, string> = {
  COMMUN:      "148,163,184",
  RARE:        "96,165,250",
  EPIQUE:      "192,132,252",
  MYTHIQUE:    "251,146,60",
  LEGENDAIRE:  "251,191,36",
  CHROMATIQUE: "244,114,182",
  RAINBOW:     "255,240,255",
};

function glowShadow(rgb: string, intense: boolean) {
  const hi = intense ? 1 : 0.55;
  const mid = intense ? 0.5 : 0.22;
  const lo  = intense ? 0.25 : 0.10;
  return [
    `0 0 10px 3px rgba(${rgb},${hi})`,
    `0 0 28px 8px rgba(${rgb},${mid})`,
    `0 0 55px 16px rgba(${rgb},${lo})`,
  ].join(", ");
}

export function CardItem({ card, owned = false, quantity, onClick, size = "md", fillWidth = false }: CardItemProps) {
  const [hovered, setHovered] = useState(false);

  const widths  = { sm: 96, md: 128, lg: 160 };
  const w       = fillWidth ? "100%" : widths[size];
  const delay   = FLOAT_DELAYS[card.number % 3];
  const rgb     = RARITY_RGB[card.rarity] ?? RARITY_RGB.COMMUN;

  return (
    <div
      className={cn("card-float", delay, !owned && "opacity-50 grayscale")}
      style={{ position: "relative", width: w, flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Carte — le box-shadow coloré crée le halo autour */}
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer"
        style={{
          transform: hovered ? "translateY(-7px) scale(1.04)" : "translateY(0) scale(1)",
          transition: "transform 0.3s ease, box-shadow 0.35s ease",
          boxShadow: glowShadow(rgb, hovered),
        }}
      >
        {/* Badge quantité */}
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

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.imageUrl}
          alt={card.name}
          style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block" }}
        />

        {/* Overlay holographique */}
        <div className={cn("card-holo-overlay", hovered && "active")} />
      </div>
    </div>
  );
}
