"use client";

import { useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const RARITY_RGB: Record<string, string> = {
  COMMUN:      "148,163,184",
  RARE:        "96,165,250",
  EPIQUE:      "192,132,252",
  MYTHIQUE:    "251,146,60",
  LEGENDAIRE:  "251,191,36",
  CHROMATIQUE: "244,114,182",
  RAINBOW:     "255,240,255",
};

function glowShadow(rgb: string) {
  return [
    `0 0 18px 6px rgba(${rgb},0.9)`,
    `0 0 50px 18px rgba(${rgb},0.45)`,
    `0 0 100px 40px rgba(${rgb},0.2)`,
  ].join(", ");
}

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
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function CardModal({
  card,
  quantity,
  onClose,
  onSell,
  showSell,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: CardModalProps) {
  const rgb = RARITY_RGB[card.rarity] ?? RARITY_RGB.COMMUN;
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > 60 && hasPrev && onPrev) onPrev();
    if (delta < -60 && hasNext && onNext) onNext();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all active:scale-90"
        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
      >
        <X size={20} />
      </button>

      {/* Prev arrow */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* Card + info */}
      <div
        className="flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card image with glow */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ width: "min(210px, 56vw)", boxShadow: glowShadow(rgb) }}
        >
          {/* Quantity badge */}
          {quantity !== undefined && quantity > 1 && (
            <div
              className="absolute top-2 right-2 z-10 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(109,40,217,0.5)",
              }}
            >
              x{quantity}
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.imageUrl}
            alt={card.name}
            style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block" }}
          />

          {/* Holo overlay */}
          <div className="card-holo-overlay active" />
        </div>

        {/* Name + number */}
        <div className="text-center">
          <p className="font-bold text-white text-base leading-tight">{card.name}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            #{String(card.number).padStart(3, "0")}
          </p>
        </div>

        {/* Sell button */}
        {showSell && onSell && quantity !== undefined && quantity > 0 && (
          <button
            onClick={onSell}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-97"
            style={{
              background: "rgba(239,68,68,0.12)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            Vendre cette carte
          </button>
        )}
      </div>

      {/* Next arrow */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext?.(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
        >
          <ChevronRight size={26} />
        </button>
      )}
    </div>
  );
}
