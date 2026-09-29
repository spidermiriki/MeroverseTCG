"use client";

import { Lock, Zap, Coins } from "lucide-react";
import { formatTimeUntil } from "@/lib/utils";

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
  canOpenFree: boolean;
  nextFreeTime: Date | null;
  melocoins: number;
  onOpenFree: () => void;
  onOpenPaid: () => void;
  loading: boolean;
}

export function PackCard({
  pack,
  canOpenFree,
  nextFreeTime,
  melocoins,
  onOpenFree,
  onOpenPaid,
  loading,
}: PackCardProps) {
  const canAfford = melocoins >= pack.price;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,12,30,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(109,40,217,0.3)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 60px rgba(109,40,217,0.08) inset",
      }}
    >
      {/* Pack visual area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: 220,
          background: "radial-gradient(ellipse 80% 80% at 50% 60%, rgba(109,40,217,0.15) 0%, transparent 70%)",
        }}
      >
        {/* Atmospheric glow behind pack */}
        <div
          className="absolute w-40 h-40 rounded-full blur-3xl"
          style={{ background: "rgba(109,40,217,0.2)" }}
        />

        {/* Pack image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pack.imageUrl}
          alt={pack.name}
          style={{
            position: "relative",
            zIndex: 1,
            width: 120,
            height: 168,
            objectFit: "contain",
            filter: "drop-shadow(0 8px 24px rgba(109,40,217,0.6)) drop-shadow(0 0 40px rgba(109,40,217,0.3))",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
                background: "rgba(192,132,252,0.6)",
                boxShadow: "0 0 4px rgba(192,132,252,0.8)",
                animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: "rgba(109,40,217,0.2)" }}
      >
        <h3
          className="font-black text-base tracking-wide"
          style={{
            background: "linear-gradient(135deg, #e2e8f9, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {pack.name}
        </h3>
        {pack.description && (
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            {pack.description}
          </p>
        )}
        <p className="text-xs mt-1 font-semibold" style={{ color: "rgba(192,132,252,0.6)" }}>
          ✦ {pack.cardsCount} cartes par booster
        </p>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 space-y-2">
        {/* Free pack */}
        <button
          onClick={onOpenFree}
          disabled={!canOpenFree || loading}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-97"
          style={
            canOpenFree
              ? {
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(5,150,105,0.4)",
                  opacity: loading ? 0.6 : 1,
                }
              : {
                  background: "rgba(109,40,217,0.08)",
                  color: "var(--color-text-muted)",
                  border: "1px solid rgba(109,40,217,0.15)",
                }
          }
        >
          {canOpenFree ? (
            <>
              <Zap size={16} />
              Booster gratuit
            </>
          ) : (
            <>
              <Lock size={14} />
              {nextFreeTime ? formatTimeUntil(nextFreeTime) : "Indisponible"}
            </>
          )}
        </button>

        {/* Paid pack */}
        <button
          onClick={onOpenPaid}
          disabled={!canAfford || loading}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-97"
          style={
            canAfford
              ? {
                  background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(109,40,217,0.4)",
                  opacity: loading ? 0.6 : 1,
                }
              : {
                  background: "rgba(109,40,217,0.08)",
                  color: "var(--color-text-muted)",
                  border: "1px solid rgba(109,40,217,0.15)",
                }
          }
        >
          <Coins size={14} />
          <span>{pack.price} Melocoins</span>
        </button>
      </div>
    </div>
  );
}
