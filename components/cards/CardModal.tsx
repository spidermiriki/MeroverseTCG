"use client";

import { X, Sparkles } from "lucide-react";
import { RARITY_LABELS, RARITY_COLORS, RACE_LABELS, PLANET_LABELS, type Rarity } from "@/lib/pack-odds";

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
  isSecret: boolean;
}

interface CardModalProps {
  card: Card;
  quantity?: number;
  onClose: () => void;
  onSell?: () => void;
  showSell?: boolean;
}

export function CardModal({ card, quantity, onClose, onSell, showSell }: CardModalProps) {
  const rarity = card.rarity as Rarity;
  const rarityColor = RARITY_COLORS[rarity];
  const rarityClass = `card-rarity-${rarity.toLowerCase()}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "rgba(8,10,28,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(109,40,217,0.4)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(109,40,217,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "rgba(109,40,217,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: rarityColor }} />
            <h2 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
              {card.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-all"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-4 p-4">
          {/* Card image */}
          <div
            className={`flex-shrink-0 rounded-xl border-2 overflow-hidden ${rarityClass}`}
            style={{ width: 120 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.imageUrl}
              alt={card.name}
              style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2.5">
            {[
              { label: "Rareté", value: RARITY_LABELS[rarity], color: rarityColor },
              { label: "Race", value: RACE_LABELS[card.race] ?? card.race },
              { label: "Planète", value: PLANET_LABELS[card.planet] ?? card.planet },
              { label: "Numéro", value: `#${String(card.number).padStart(3, "0")}` },
              ...(quantity !== undefined && quantity > 1 ? [{ label: "En stock", value: `x${quantity}` }] : []),
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--color-text-muted)" }}>
                  {label}
                </p>
                <p className="font-bold text-sm mt-0.5" style={{ color: color ?? "var(--color-text)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {card.description && (
          <p
            className="px-4 pb-3 text-xs italic leading-relaxed"
            style={{ color: "var(--color-text-muted)", borderTop: "1px solid rgba(109,40,217,0.15)", paddingTop: 12 }}
          >
            &ldquo;{card.description}&rdquo;
          </p>
        )}

        {showSell && onSell && quantity && quantity > 0 && (
          <div className="p-4 pt-0">
            <button
              onClick={onSell}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-97"
              style={{
                background: "rgba(239,68,68,0.12)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              Vendre cette carte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
