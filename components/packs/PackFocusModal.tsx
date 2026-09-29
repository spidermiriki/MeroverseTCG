"use client";

import { motion } from "framer-motion";
import { X, Zap, Lock, Coins } from "lucide-react";
import { PackVisual } from "./PackVisual";
import { formatTimeUntil } from "@/lib/utils";
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

interface PackFocusModalProps {
  pack: Pack;
  freePackCount: number;
  nextFreeTime: Date | null;
  melocoins: number;
  onOpenFree: () => void;
  onOpenPaid: () => void;
  onClose: () => void;
  loading: boolean;
}

export function PackFocusModal({
  pack,
  freePackCount,
  nextFreeTime,
  melocoins,
  onOpenFree,
  onOpenPaid,
  onClose,
  loading,
}: PackFocusModalProps) {
  const canAfford = melocoins >= pack.price;
  const hasFree = freePackCount > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 20px 36px",
        background: "linear-gradient(170deg, #040110 0%, #080224 45%, #050115 100%)",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          height: "90vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Close button */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 1 }}>
        <button
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid rgba(109,40,217,0.3)",
            background: "rgba(8,4,24,0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(192,132,252,0.65)",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Floating pack */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            filter: [
              "drop-shadow(0 24px 64px rgba(109,40,217,0.65))",
              "drop-shadow(0 0 80px rgba(109,40,217,0.28))",
            ].join(" "),
          }}
        >
          <PackVisual imageUrl={pack.imageUrl} name={pack.name} width={210} />
        </motion.div>
      </div>

      {/* Bottom section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Pack name */}
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#fff",
              textShadow: "0 0 20px rgba(192,132,252,0.7), 0 2px 6px rgba(0,0,0,1)",
              marginBottom: 4,
            }}
          >
            {pack.name}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(192,132,252,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {pack.cardsCount} cartes par ouverture
          </p>
        </div>

        {/* Accumulation counter */}
        <div
          style={{
            background: "rgba(8,4,24,0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(109,40,217,0.22)",
            borderRadius: 16,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={13} style={{ color: hasFree ? "#a3e635" : "rgba(192,132,252,0.35)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: hasFree ? "#a3e635" : "rgba(192,132,252,0.45)" }}>
                Boosters accumulés
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 900, color: hasFree ? "#a3e635" : "rgba(192,132,252,0.35)" }}>
              {freePackCount}<span style={{ fontWeight: 400, fontSize: 12, opacity: 0.6 }}>/{MAX_FREE_PACKS}</span>
            </span>
          </div>

          {/* Progress segments */}
          <div style={{ display: "flex", gap: 3 }}>
            {[...Array(MAX_FREE_PACKS)].map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: 3,
                  background: i < freePackCount
                    ? `linear-gradient(90deg, #7c3aed ${i * 10}%, #a3e635 100%)`
                    : "rgba(109,40,217,0.14)",
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>

          {!hasFree && nextFreeTime && (
            <p style={{ fontSize: 11, color: "rgba(192,132,252,0.38)", textAlign: "center", marginTop: 2 }}>
              Prochain booster dans {formatTimeUntil(nextFreeTime)}
            </p>
          )}
          {freePackCount === MAX_FREE_PACKS && (
            <p style={{ fontSize: 11, color: "#a3e635", textAlign: "center", marginTop: 2, opacity: 0.7 }}>
              Stock plein — ouvre vite !
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Free / countdown button */}
          <button
            onClick={onOpenFree}
            disabled={!hasFree || loading}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 16,
              border: "none",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.03em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: hasFree && !loading ? "pointer" : "default",
              transition: "opacity 0.2s",
              ...(hasFree
                ? {
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(5,150,105,0.45), 0 0 0 1px rgba(5,150,105,0.25)",
                    opacity: loading ? 0.6 : 1,
                  }
                : {
                    background: "rgba(109,40,217,0.07)",
                    color: "rgba(192,132,252,0.35)",
                    border: "1px solid rgba(109,40,217,0.14)",
                  }),
            }}
          >
            {hasFree ? (
              <><Zap size={16} /> Ouvrir gratuitement</>
            ) : (
              <><Lock size={14} /> {nextFreeTime ? formatTimeUntil(nextFreeTime) : "Aucun booster"}</>
            )}
          </button>

          {/* Paid button */}
          <button
            onClick={onOpenPaid}
            disabled={!canAfford || loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 16,
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: canAfford && !loading ? "pointer" : "default",
              transition: "opacity 0.2s",
              ...(canAfford
                ? {
                    background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(109,40,217,0.4)",
                    opacity: loading ? 0.6 : 1,
                  }
                : {
                    background: "rgba(109,40,217,0.07)",
                    color: "rgba(192,132,252,0.35)",
                    border: "1px solid rgba(109,40,217,0.14)",
                  }),
            }}
          >
            <Coins size={14} />
            <span>{pack.price} Melocoins</span>
            {!canAfford && (
              <span style={{ fontSize: 11, opacity: 0.5 }}>· insuffisant</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
