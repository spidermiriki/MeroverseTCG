"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Rarity =
  | "COMMUN"
  | "RARE"
  | "EPIQUE"
  | "MYTHIQUE"
  | "LEGENDAIRE"
  | "CHROMATIQUE"
  | "RAINBOW";

interface CardFrameProps {
  rarity: Rarity;
  children: ReactNode;
  /** Appliquer l'effet holo (Légendaire+) au survol/tap */
  holo?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const RARITY_CLASS: Record<Rarity, string> = {
  COMMUN:      "card-rarity-commun",
  RARE:        "card-rarity-rare",
  EPIQUE:      "card-rarity-epique",
  MYTHIQUE:    "card-rarity-mythique",
  LEGENDAIRE:  "card-rarity-legendaire",
  CHROMATIQUE: "card-rarity-chromatique",
  RAINBOW:     "card-rarity-rainbow",
};

/** Raretés qui flottent */
const FLOAT_RARITIES: Rarity[] = ["LEGENDAIRE", "CHROMATIQUE", "RAINBOW"];

export function CardFrame({
  rarity,
  children,
  holo = false,
  className,
  style,
}: CardFrameProps) {
  const shouldFloat = FLOAT_RARITIES.includes(rarity);

  return (
    <div
      className={cn(
        "relative rounded-mv-card border-2 overflow-hidden",
        RARITY_CLASS[rarity],
        shouldFloat && "card-float",
        className,
      )}
      style={style}
    >
      {children}

      {/* Holo overlay — Légendaire / Chromatique / Rainbow */}
      {(rarity === "LEGENDAIRE" || rarity === "CHROMATIQUE" || rarity === "RAINBOW") && (
        <div className={cn("card-holo-overlay", holo && "active")} />
      )}
    </div>
  );
}

/** Couleur hex associée à chaque rareté (pour labels, badges, etc.) */
export const RARITY_COLOR: Record<Rarity, string> = {
  COMMUN:      "#94a3b8",
  RARE:        "#60a5fa",
  EPIQUE:      "#c084fc",
  MYTHIQUE:    "#fb923c",
  LEGENDAIRE:  "#fbbf24",
  CHROMATIQUE: "#f472b6",
  RAINBOW:     "#ffffff",
};

/** Label court par rareté */
export const RARITY_LABEL: Record<Rarity, string> = {
  COMMUN:      "Commun",
  RARE:        "Rare",
  EPIQUE:      "Épique",
  MYTHIQUE:    "Mythique",
  LEGENDAIRE:  "Légendaire",
  CHROMATIQUE: "Chromatique",
  RAINBOW:     "Rainbow",
};
