"use client";

import { useState, useEffect, useCallback } from "react";
import { PackCard } from "@/components/packs/PackCard";
import { PackOpeningModal } from "@/components/packs/PackOpeningModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { MelocoinBadge } from "@/components/ui/MelocoinBadge";
import { canOpenFreePack, getNextFreePackTime } from "@/lib/pack-odds";

interface Pack {
  id: string;
  name: string;
  collection: string;
  price: number;
  imageUrl: string;
  cardsCount: number;
  description?: string | null;
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
      if (!res.ok) setError(data.error);
      else {
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
  const freePackAvailable = canOpenFreePack(lastFreePack);
  const nextFreeTime = getNextFreePackTime(lastFreePack);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Boosters"
        subtitle="Ouvre des packs et complète ta collection"
        right={userData ? <MelocoinBadge amount={userData.melocoins} /> : undefined}
      />

      <div className="px-4 py-4 space-y-4">
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
          >
            {error}
          </div>
        )}

        {packs.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--color-text-muted)" }}>
            <p className="text-2xl mb-2">✦</p>
            <p>Aucun booster disponible.</p>
          </div>
        )}

        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            canOpenFree={freePackAvailable}
            nextFreeTime={nextFreeTime}
            melocoins={userData?.melocoins ?? 0}
            onOpenFree={() => openPack(pack.id, true)}
            onOpenPaid={() => openPack(pack.id, false)}
            loading={loading}
          />
        ))}
      </div>

      {drawnCards && (
        <PackOpeningModal cards={drawnCards} onClose={() => setDrawnCards(null)} />
      )}
    </div>
  );
}
