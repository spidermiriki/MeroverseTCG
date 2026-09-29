// Rarity weights for pack opening
export const RARITY_WEIGHTS = {
  COMMUN: 60,
  RARE: 25,
  EPIQUE: 10,
  MYTHIQUE: 4,
  LEGENDAIRE: 0.5,
  CHROMATIQUE: 0.5,
} as const;

export type Rarity = keyof typeof RARITY_WEIGHTS;

export const RARITY_COLORS: Record<Rarity, string> = {
  COMMUN: "#9ca3af",
  RARE: "#3b82f6",
  EPIQUE: "#a855f7",
  MYTHIQUE: "#f97316",
  LEGENDAIRE: "#eab308",
  CHROMATIQUE: "#ec4899",
};

export const RARITY_LABELS: Record<Rarity, string> = {
  COMMUN: "Commun",
  RARE: "Rare",
  EPIQUE: "Épique",
  MYTHIQUE: "Mythique",
  LEGENDAIRE: "Légendaire",
  CHROMATIQUE: "Chromatique",
};

export function rollRarity(): Rarity {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    random -= weight;
    if (random <= 0) return rarity as Rarity;
  }

  return "COMMUN";
}

export const FREE_PACK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
export const MAX_FREE_PACKS = 10;

export function getAvailablePackCount(lastFreePack: Date | null): number {
  if (!lastFreePack) return MAX_FREE_PACKS;
  const elapsed = Date.now() - lastFreePack.getTime();
  return Math.min(MAX_FREE_PACKS, Math.floor(elapsed / FREE_PACK_INTERVAL_MS));
}

export function canOpenFreePack(lastFreePack: Date | null): boolean {
  return getAvailablePackCount(lastFreePack) > 0;
}

export function getNextFreePackTime(lastFreePack: Date | null): Date | null {
  if (!lastFreePack) return null;
  const count = getAvailablePackCount(lastFreePack);
  if (count >= MAX_FREE_PACKS) return null; // already full
  // Next pack = base + (count + 1) hours
  return new Date(lastFreePack.getTime() + (count + 1) * FREE_PACK_INTERVAL_MS);
}

export const COLLECTION_LABELS: Record<string, string> = {
  BLACK_VS_WHITE: "Black vs White",
};

export const RACE_LABELS: Record<string, string> = {
  BLANC: "Blanc",
  NOIR: "Noir",
  MEXICAIN: "Mexicain",
  ZOULOU: "Zoulou",
};

export const PLANET_LABELS: Record<string, string> = {
  LA_LOUVIERE: "La Louvière",
  FEMME: "Planète Femme",
};
