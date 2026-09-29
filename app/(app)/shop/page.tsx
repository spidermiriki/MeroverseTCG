"use client";

import { useState, useEffect, useCallback } from "react";
import { Coins, TrendingDown } from "lucide-react";
import { CardItem } from "@/components/cards/CardItem";
import { RARITY_LABELS, RARITY_COLORS, type Rarity } from "@/lib/pack-odds";
import { formatMelocoins } from "@/lib/utils";

const MELOCOIN_PACKAGES = [
  { id: "small", amount: 100, label: "100 Melocoins", price: "1€" },
  { id: "medium", amount: 300, label: "300 Melocoins", price: "2.50€" },
  { id: "large", amount: 700, label: "700 Melocoins", price: "5€" },
  { id: "xl", amount: 1500, label: "1500 Melocoins", price: "10€" },
];

const SELL_VALUES: Record<string, number> = {
  COMMUN: 5, RARE: 15, EPIQUE: 40, MYTHIQUE: 100, LEGENDAIRE: 300, CHROMATIQUE: 500,
};

interface Card {
  id: string;
  cardId: string;
  number: number;
  name: string;
  rarity: string;
  imageUrl: string;
  collection: string;
  character: string;
  race: string;
  planet: string;
  description?: string | null;
  isSecret: boolean;
  quantity: number;
}

type Tab = "buy" | "sell";

export default function ShopPage() {
  const [tab, setTab] = useState<Tab>("buy");
  const [melocoins, setMelocoins] = useState(0);
  const [myCards, setMyCards] = useState<Card[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const [userRes, cardsRes] = await Promise.all([
      fetch("/api/user"),
      fetch("/api/user/cards"),
    ]);
    if (userRes.ok) {
      const u = await userRes.json();
      setMelocoins(u.melocoins);
    }
    if (cardsRes.ok) {
      setMyCards(await cardsRes.json());
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBuy = (pkg: typeof MELOCOIN_PACKAGES[0]) => {
    // In production: Stripe redirect. For now, show info message.
    setSuccess(`Achat de ${pkg.label} (${pkg.price}) — Paiement à implémenter avec Stripe.`);
  };

  const handleSell = async (cardId: string) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    else {
      setSuccess(`+${data.earned} Melocoins !`);
      fetchData();
    }
    setLoading(false);
  };

  const duplicates = myCards.filter((c) => c.quantity > 1);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-black" style={{ color: "var(--color-text)" }}>Boutique</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "var(--color-surface-2)" }}>
            <Coins size={14} style={{ color: "var(--color-accent)" }} />
            <span className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
              {formatMelocoins(melocoins)}
            </span>
          </div>
        </div>

        <div className="flex px-4 pb-3 gap-2">
          {(["buy", "sell"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className="px-3 py-1.5 rounded-xl text-sm font-medium"
              style={{
                background: tab === t ? "var(--color-primary)" : "var(--color-surface-2)",
                color: tab === t ? "#fff" : "var(--color-text-muted)",
              }}
            >
              {t === "buy" ? "Acheter des Melocoins" : "Vendre des cartes"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {(error || success) && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{
              background: error ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
              color: error ? "var(--color-danger)" : "var(--color-success)",
            }}
          >
            {error || success}
          </div>
        )}

        {/* Buy Melocoins */}
        {tab === "buy" && (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Les Melocoins servent à ouvrir des boosters et participer aux enchères.
            </p>
            {MELOCOIN_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleBuy(pkg)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-98"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(234,179,8,0.15)" }}
                  >
                    <Coins size={20} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{pkg.label}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{pkg.price}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>Acheter</span>
              </button>
            ))}
          </div>
        )}

        {/* Sell cards */}
        {tab === "sell" && (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Vendez vos cartes en double contre des Melocoins.
            </p>

            {duplicates.length === 0 && (
              <p className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                Vous n&apos;avez pas de doublons à vendre.
              </p>
            )}

            {myCards.filter((c) => c.quantity > 0).map((card) => {
              const rarity = card.rarity as Rarity;
              const sellValue = SELL_VALUES[card.rarity] ?? 5;
              return (
                <div
                  key={card.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border"
                  style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                >
                  <div className="w-14 flex-shrink-0">
                    <CardItem card={card} owned size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>{card.name}</p>
                    <p className="text-xs" style={{ color: RARITY_COLORS[rarity] }}>{RARITY_LABELS[rarity]}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>En stock: x{card.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleSell(card.cardId ?? card.id)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
                    style={{ background: "rgba(239,68,68,0.15)", color: "var(--color-danger)" }}
                  >
                    <TrendingDown size={14} />
                    {sellValue}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
