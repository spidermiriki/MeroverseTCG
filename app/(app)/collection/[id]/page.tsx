"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { CardItem } from "@/components/cards/CardItem";
import { CardSilhouette } from "@/components/cards/CardSilhouette";
import { CardModal } from "@/components/cards/CardModal";
import { COLLECTION_LABELS } from "@/lib/pack-odds";

interface CardData {
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
  owned: boolean;
  visible: boolean;
  quantity?: number;
}

interface UserCardData extends CardData {
  quantity: number;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params.id as string;

  const [cards, setCards] = useState<CardData[]>([]);
  const [userCards, setUserCards] = useState<Record<string, UserCardData>>({});
  const [stats, setStats] = useState({ total: 0, owned: 0 });
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/collection?collection=${collectionId}`);
    const data = await res.json();
    setCards(data.cards ?? []);
    setStats(data.stats ?? { total: 0, owned: 0 });

    // Also fetch user's quantity for each card
    const userRes = await fetch(`/api/user/cards?collection=${collectionId}`);
    if (userRes.ok) {
      const userData = await userRes.json();
      const map: Record<string, UserCardData> = {};
      for (const uc of userData) {
        map[uc.cardId] = uc;
      }
      setUserCards(map);
    }
    setLoading(false);
  }, [collectionId]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleSell = async (cardId: string) => {
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId }),
    });
    if (res.ok) {
      setSelectedCard(null);
      fetchCollection();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#c084fc", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const progressPct = stats.total > 0 ? Math.round((stats.owned / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 py-3"
        style={{
          background: "rgba(2,2,10,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(109,40,217,0.2)",
        }}
      >
        <h1
          className="text-base font-black tracking-wide"
          style={{
            background: "linear-gradient(135deg, #e2e8f9, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {COLLECTION_LABELS[collectionId] ?? collectionId}
        </h1>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--color-text-muted)" }}>
            <span>{stats.owned} / {stats.total} cartes</span>
            <span style={{ color: "#c084fc" }}>{progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(109,40,217,0.15)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #6d28d9, #c084fc)", boxShadow: "0 0 8px rgba(192,132,252,0.5)" }}
            />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="px-4 py-4">
        <div className="flex flex-wrap gap-3 justify-start">
          {cards.map((card) => {
            if (!card.visible) return null;

            if (card.owned) {
              const uc = userCards[card.id];
              return (
                <CardItem
                  key={card.id}
                  card={card}
                  owned
                  quantity={uc?.quantity}
                  onClick={() => setSelectedCard({ ...card, quantity: uc?.quantity } as CardData)}
                  size="sm"
                />
              );
            }

            return (
              <CardSilhouette
                key={card.id}
                number={card.number}
                size="sm"
              />
            );
          })}
        </div>
      </div>

      {/* Card detail modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          quantity={(selectedCard as CardData & { quantity?: number }).quantity}
          onClose={() => setSelectedCard(null)}
          onSell={() => handleSell(selectedCard.id)}
          showSell
        />
      )}
    </div>
  );
}
