"use client";

import { useState, useEffect, useCallback } from "react";
import { Coins } from "lucide-react";
import { formatMelocoins } from "@/lib/utils";

const COIN_PACKAGES = [
  { id: "small",  amount: 100,  label: "100 Coins",  price: "1€" },
  { id: "medium", amount: 300,  label: "300 Coins",  price: "2.50€" },
  { id: "large",  amount: 700,  label: "700 Coins",  price: "5€" },
  { id: "xl",     amount: 1500, label: "1500 Coins", price: "10€" },
];

export default function ShopPage() {
  const [coins, setCoins] = useState(0);
  const [success, setSuccess] = useState("");

  const fetchUser = useCallback(async () => {
    const res = await fetch("/api/user");
    if (res.ok) {
      const u = await res.json();
      setCoins(u.coins ?? 0);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleBuy = (pkg: typeof COIN_PACKAGES[0]) => {
    setSuccess(`Achat de ${pkg.label} (${pkg.price}) — Paiement à implémenter avec Stripe.`);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <div
        className="sticky top-0 z-10 border-b"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-black" style={{ color: "var(--color-text)" }}>Boutique</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "var(--color-surface-2)" }}>
            <Coins size={14} style={{ color: "var(--color-accent)" }} />
            <span className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
              {formatMelocoins(coins)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {success && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(34,197,94,0.1)", color: "var(--color-success)" }}
          >
            {success}
          </div>
        )}

        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Les Coins servent à ouvrir des boosters et participer aux enchères.
        </p>

        {COIN_PACKAGES.map((pkg) => (
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
    </div>
  );
}
