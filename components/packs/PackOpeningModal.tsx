"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { RARITY_LABELS, RARITY_COLORS, type Rarity } from "@/lib/pack-odds";

interface Card {
  id: string;
  number: number;
  name: string;
  rarity: string;
  imageUrl: string;
}

interface PackOpeningModalProps {
  cards: Card[];
  onClose: () => void;
}

export function PackOpeningModal({ cards, onClose }: PackOpeningModalProps) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [allRevealed, setAllRevealed] = useState(false);

  const revealNext = () => {
    if (revealed.length < cards.length) {
      const next = [...revealed, revealed.length];
      setRevealed(next);
      if (next.length === cards.length) setAllRevealed(true);
    }
  };

  const revealAll = () => {
    setRevealed(cards.map((_, i) => i));
    setAllRevealed(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{ background: "rgba(0,0,10,0.97)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles size={20} style={{ color: "#c084fc" }} />
        <h2
          className="text-xl font-black tracking-widest uppercase"
          style={{
            background: "linear-gradient(135deg, #c084fc, #818cf8, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Ouverture du Booster
        </h2>
        <Sparkles size={20} style={{ color: "#f472b6" }} />
      </div>

      {/* Single card reveal view */}
      {!allRevealed && (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-6 rounded-full transition-all duration-500"
                style={{
                  background: revealed.includes(i)
                    ? "linear-gradient(90deg, #6d28d9, #c084fc)"
                    : "rgba(109,40,217,0.2)",
                  boxShadow: revealed.includes(i) ? "0 0 6px rgba(192,132,252,0.6)" : "none",
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {revealed.length > 0 ? (
              <motion.div
                key={revealed.length - 1}
                initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex flex-col items-center gap-3"
              >
                {(() => {
                  const card = cards[revealed.length - 1];
                  const rarity = card.rarity as Rarity;
                  const rarityColor = RARITY_COLORS[rarity];
                  return (
                    <div className="flex flex-col items-center gap-3">
                      {/* Glow behind card */}
                      <div className="relative">
                        <div
                          className="absolute inset-0 rounded-2xl blur-xl"
                          style={{ background: rarityColor, opacity: 0.3, transform: "scale(1.1)" }}
                        />
                        <div
                          className={`relative rounded-2xl border-2 overflow-hidden card-rarity-${rarity.toLowerCase()}`}
                          style={{ width: 160, background: "rgba(10,12,30,0.9)" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
                          />
                          <div className="p-2 text-center" style={{ background: "rgba(5,5,20,0.7)" }}>
                            <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{card.name}</p>
                            <p className="text-xs font-semibold" style={{ color: rarityColor }}>{RARITY_LABELS[rarity]}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="rounded-2xl flex items-center justify-center"
                style={{
                  width: 160,
                  aspectRatio: "2/3",
                  background: "rgba(109,40,217,0.08)",
                  border: "2px dashed rgba(109,40,217,0.3)",
                }}
              >
                <div className="text-center">
                  <Sparkles size={24} style={{ color: "rgba(192,132,252,0.4)", margin: "0 auto 8px" }} />
                  <p className="text-xs" style={{ color: "rgba(192,132,252,0.4)" }}>Révélez vos cartes</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 w-full">
            <button
              onClick={revealNext}
              className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(109,40,217,0.5)",
              }}
            >
              Révéler <ChevronRight size={18} />
            </button>
            <button
              onClick={revealAll}
              className="py-3 px-4 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(109,40,217,0.12)",
                color: "var(--color-text-muted)",
                border: "1px solid rgba(109,40,217,0.2)",
              }}
            >
              Tout voir
            </button>
          </div>
        </div>
      )}

      {/* All cards revealed grid */}
      {allRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="grid grid-cols-3 gap-3 mb-6">
            {cards.map((card, i) => {
              const rarity = card.rarity as Rarity;
              const rarityColor = RARITY_COLORS[rarity];
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0, rotateY: -90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                >
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-xl blur-md"
                      style={{ background: rarityColor, opacity: 0.2 }}
                    />
                    <div
                      className={`relative rounded-xl border-2 overflow-hidden card-rarity-${rarity.toLowerCase()}`}
                      style={{ background: "rgba(10,12,30,0.9)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
                      />
                      <div className="p-1" style={{ background: "rgba(5,5,20,0.7)" }}>
                        <p className="text-[10px] font-bold truncate" style={{ color: "var(--color-text)" }}>{card.name}</p>
                        <p className="text-[9px] font-semibold" style={{ color: rarityColor }}>{RARITY_LABELS[rarity]}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(109,40,217,0.5)",
            }}
          >
            Ajouter à ma collection ✦
          </button>
        </motion.div>
      )}
    </div>
  );
}
