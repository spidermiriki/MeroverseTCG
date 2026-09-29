"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, Lock, Coins } from "lucide-react";
import { PackVisual } from "@/components/packs/PackVisual";
import { PackOpeningModal } from "@/components/packs/PackOpeningModal";
import { MelocoinBadge } from "@/components/ui/MelocoinBadge";
import { getAvailablePackCount, getNextFreePackTime, MAX_FREE_PACKS } from "@/lib/pack-odds";
import { formatTimeUntil } from "@/lib/utils";

interface Pack {
  id: string;
  name: string;
  collection: string;
  price: number;
  imageUrl: string;
  cardsCount: number;
}

interface UserData {
  melocoins: number;
  lastFreePack: string | null;
}

interface Card {
  id: string;
  number: number;
  name: string;
  rarity: string;
  imageUrl: string;
}

export default function HomePage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [drawnCards, setDrawnCards] = useState<Card[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    const [packsRes, userRes] = await Promise.all([
      fetch("/api/packs"),
      fetch("/api/user"),
    ]);
    const packsData = await packsRes.json();
    const userData = await userRes.json();
    setPacks(packsData.packs ?? []);
    setUserData(userData);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openPack = async (packId: string, isFree: boolean) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/packs/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, isFree }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setDrawnCards(data.cards);
        await fetchData();
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const lastFreePack = userData?.lastFreePack ? new Date(userData.lastFreePack) : null;
  const freePackCount = getAvailablePackCount(lastFreePack);
  const nextFreeTime = getNextFreePackTime(lastFreePack);
  const hasFree = freePackCount > 0;
  const pack = packs[0] ?? null;
  const canAfford = userData ? userData.melocoins >= (pack?.price ?? 0) : false;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#e2e8f9",
              letterSpacing: "0.02em",
            }}
          >
            Boosters
          </h1>
          <p style={{ fontSize: 12, color: "rgba(192,132,252,0.5)", marginTop: 1 }}>
            Ouvre des packs et complète ta collection
          </p>
        </div>
        {userData && <MelocoinBadge amount={userData.melocoins} />}
      </div>

      {/* ── Center: pack showcase ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px 96px",
          position: "relative",
        }}
      >
        {pack ? (
          <>
            {/* Soft dark ambient surface behind everything */}
            <div
              style={{
                position: "absolute",
                width: "85vw",
                height: "70vw",
                maxWidth: 380,
                maxHeight: 320,
                borderRadius: "50%",
                background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 72%)",
                pointerEvents: "none",
              }}
            />

            {/* Floating pack */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                filter: [
                  "drop-shadow(0 28px 56px rgba(109,40,217,0.7))",
                  "drop-shadow(0 0 80px rgba(109,40,217,0.25))",
                ].join(" "),
                cursor: "default",
                position: "relative",
                zIndex: 1,
              }}
            >
              <PackVisual imageUrl={pack.imageUrl} name={pack.name} width={220} />
            </motion.div>

            {/* Progress bar */}
            <div
              style={{
                display: "flex",
                gap: 4,
                width: 220,
                marginTop: 24,
                position: "relative",
                zIndex: 1,
              }}
            >
              {[...Array(MAX_FREE_PACKS)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: 3,
                    background: i < freePackCount
                      ? "linear-gradient(90deg, #7c3aed, #a3e635)"
                      : "rgba(109,40,217,0.15)",
                    transition: "background 0.4s ease",
                  }}
                />
              ))}
            </div>

            {/* Lightning row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 12,
                position: "relative",
                zIndex: 1,
              }}
            >
              {hasFree ? (
                <>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[...Array(Math.min(freePackCount, 10))].map((_, i) => (
                      <Zap
                        key={i}
                        size={13}
                        style={{
                          color: i < 3 ? "#a3e635" : i < 7 ? "#7c3aed" : "#c084fc",
                          opacity: 0.85,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(163,230,53,0.8)",
                    }}
                  >
                    {freePackCount}/{MAX_FREE_PACKS}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: 12, color: "rgba(192,132,252,0.38)" }}>
                  {nextFreeTime ? `Prochain dans ${formatTimeUntil(nextFreeTime)}` : "Aucun booster"}
                </span>
              )}
            </div>

            {/* Collection label */}
            <p
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "rgba(192,132,252,0.35)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                position: "relative",
                zIndex: 1,
              }}
            >
              {pack.cardsCount} cartes · Black vs White
            </p>
          </>
        ) : (
          <p style={{ color: "rgba(192,132,252,0.3)", fontSize: 14 }}>
            Aucun booster disponible
          </p>
        )}
      </div>

      {/* ── Bottom: action buttons ── */}
      {pack && (
        <div
          style={{
            position: "fixed",
            bottom: 80, // above bottom nav
            left: 0,
            right: 0,
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 10,
          }}
        >
          {error && (
            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#f87171",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                padding: "6px 12px",
              }}
            >
              {error}
            </p>
          )}

          {/* Free button */}
          <button
            onClick={() => openPack(pack.id, true)}
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
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              ...(hasFree
                ? {
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(5,150,105,0.45), 0 0 0 1px rgba(5,150,105,0.25)",
                    opacity: loading ? 0.6 : 1,
                  }
                : {
                    background: "rgba(8,4,24,0.7)",
                    color: "rgba(192,132,252,0.35)",
                    border: "1px solid rgba(109,40,217,0.15)",
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
            onClick={() => openPack(pack.id, false)}
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
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              ...(canAfford
                ? {
                    background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(109,40,217,0.4)",
                    opacity: loading ? 0.6 : 1,
                  }
                : {
                    background: "rgba(8,4,24,0.7)",
                    color: "rgba(192,132,252,0.35)",
                    border: "1px solid rgba(109,40,217,0.15)",
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
      )}

      {drawnCards && (
        <PackOpeningModal cards={drawnCards} onClose={() => setDrawnCards(null)} />
      )}
    </div>
  );
}
