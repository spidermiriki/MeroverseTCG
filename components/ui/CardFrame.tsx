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
  holo?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* Raretés avec bordure solide (classes CSS) */
const SOLID_CLASS: Partial<Record<Rarity, string>> = {
  COMMUN:   "card-rarity-commun",
  RARE:     "card-rarity-rare",
  EPIQUE:   "card-rarity-epique",
  MYTHIQUE: "card-rarity-mythique",
};

/* Raretés premium — bordure gradient via wrapper (padding 2px + background gradient)
   Technique : outer div = gradient background, inner div = rounded + overflow-hidden
   → seul moyen d'avoir gradient border + border-radius sans filter sur le contenu */
const GRADIENT_BG: Partial<Record<Rarity, string>> = {
  LEGENDAIRE:  "linear-gradient(135deg, #fff1b8 0%, #ffc83d 50%, #b8730a 100%)",
  CHROMATIQUE: "linear-gradient(135deg, #ff6ad5 0%, #b14dff 100%)",
  RAINBOW:     "conic-gradient(from 180deg at 50% 50%, #ff0000 0deg, #ff7700 45deg, #ffff00 90deg, #00ff88 135deg, #00ddff 180deg, #0055ff 225deg, #9900ff 270deg, #ff0077 315deg, #ff0000 360deg)",
};

const GLOW_CLASS: Partial<Record<Rarity, string>> = {
  LEGENDAIRE:  "card-glow-legendaire",
  CHROMATIQUE: "card-glow-chromatique",
  RAINBOW:     "card-glow-rainbow",
};

const FLOAT_RARITIES = new Set<Rarity>(["LEGENDAIRE", "CHROMATIQUE", "RAINBOW"]);

export function CardFrame({ rarity, children, holo = false, className, style }: CardFrameProps) {
  const shouldFloat = FLOAT_RARITIES.has(rarity);
  const gradientBg  = GRADIENT_BG[rarity];

  if (gradientBg) {
    /* Premium : wrapper gradient + inner overflow-hidden */
    return (
      <div
        className={cn(
          "relative shrink-0",
          shouldFloat && "card-float",
          GLOW_CLASS[rarity],
          className,
        )}
        style={{
          padding:      "2px",
          borderRadius: "22px",
          background:   gradientBg,
          ...style,
        }}
      >
        <div className="relative rounded-mv-card overflow-hidden w-full h-full">
          {children}
          <div className={cn("card-holo-overlay", holo && "active")} />
        </div>
      </div>
    );
  }

  /* Commun → Mythique : bordure solide via classe CSS */
  return (
    <div
      className={cn(
        "relative rounded-mv-card border-2 overflow-hidden",
        SOLID_CLASS[rarity],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export const RARITY_COLOR: Record<Rarity, string> = {
  COMMUN:      "#94a3b8",
  RARE:        "#60a5fa",
  EPIQUE:      "#c084fc",
  MYTHIQUE:    "#fb923c",
  LEGENDAIRE:  "#ffc83d",
  CHROMATIQUE: "#ff6ad5",
  RAINBOW:     "#ffffff",
};

export const RARITY_LABEL: Record<Rarity, string> = {
  COMMUN:      "Commun",
  RARE:        "Rare",
  EPIQUE:      "Épique",
  MYTHIQUE:    "Mythique",
  LEGENDAIRE:  "Légendaire",
  CHROMATIQUE: "Chromatique",
  RAINBOW:     "Rainbow",
};
