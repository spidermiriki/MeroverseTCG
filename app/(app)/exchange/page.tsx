"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, ArrowLeftRight, Gavel } from "lucide-react";
import { CardItem } from "@/components/cards/CardItem";
import { RARITY_LABELS, RARITY_COLORS, type Rarity } from "@/lib/pack-odds";
import { formatMelocoins, formatRelativeTime } from "@/lib/utils";

interface Card {
  id: string;
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
}

interface Bid {
  id: string;
  amount: number;
  status: string;
  bidder: { id: string; username: string };
}

interface Offer {
  id: string;
  type: "CARD_FOR_CARD" | "AUCTION";
  status: string;
  minimumPrice?: number | null;
  createdAt: string;
  offerer: { id: string; username: string };
  offeredCard: Card;
  requestedCard?: Card | null;
  bids: Bid[];
}

type Tab = "browse" | "create";

export default function ExchangePage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("browse");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [myCards, setMyCards] = useState<(Card & { quantity: number })[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create offer form
  const [offerType, setOfferType] = useState<"CARD_FOR_CARD" | "AUCTION">("AUCTION");
  const [selectedOfferedCard, setSelectedOfferedCard] = useState<string>("");
  const [selectedRequestedCard, setSelectedRequestedCard] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(10);

  const fetchData = useCallback(async () => {
    const [offersRes, myCardsRes, allCardsRes] = await Promise.all([
      fetch("/api/exchange"),
      fetch("/api/user/cards"),
      fetch("/api/cards"),
    ]);
    if (offersRes.ok) setOffers(await offersRes.json());
    if (myCardsRes.ok) setMyCards(await myCardsRes.json());
    if (allCardsRes.ok) setAllCards(await allCardsRes.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createOffer = async () => {
    if (!selectedOfferedCard) return setError("Sélectionnez une carte à proposer.");
    if (offerType === "CARD_FOR_CARD" && !selectedRequestedCard) return setError("Sélectionnez une carte demandée.");
    setLoading(true);
    setError("");
    const res = await fetch("/api/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offeredCardId: selectedOfferedCard,
        type: offerType,
        requestedCardId: offerType === "CARD_FOR_CARD" ? selectedRequestedCard : undefined,
        minimumPrice: offerType === "AUCTION" ? minPrice : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess("Offre créée !");
      setTab("browse");
      fetchData();
    }
    setLoading(false);
  };

  const placeBid = async (offerId: string, amount: number) => {
    setLoading(true);
    const res = await fetch(`/api/exchange/${offerId}/bid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    else { setSuccess("Enchère placée !"); fetchData(); }
    setLoading(false);
  };

  const confirmOffer = async (offerId: string, bidId?: string) => {
    setLoading(true);
    const res = await fetch(`/api/exchange/${offerId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bidId }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    else { setSuccess(data.message); fetchData(); }
    setLoading(false);
  };

  const myOwnedCards = myCards.filter((c) => c.quantity > 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-black" style={{ color: "var(--color-text)" }}>Échanges</h1>
          <button
            onClick={() => setTab(tab === "create" ? "browse" : "create")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            <Plus size={16} /> Créer
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {(["browse", "create"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t ? "var(--color-primary)" : "var(--color-surface-2)",
                color: tab === t ? "#fff" : "var(--color-text-muted)",
              }}
            >
              {t === "browse" ? "Parcourir" : "Créer une offre"}
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

        {/* Browse offers */}
        {tab === "browse" && (
          <div className="space-y-3">
            {offers.length === 0 && (
              <p className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                Aucune offre d&apos;échange pour le moment.
              </p>
            )}
            {offers.map((offer) => {
              const isMyOffer = offer.offerer.id === session?.user?.id;
              const rarity = offer.offeredCard.rarity as Rarity;
              return (
                <div
                  key={offer.id}
                  className="rounded-2xl border p-4"
                  style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 flex-shrink-0">
                      <CardItem card={offer.offeredCard} owned size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: offer.type === "AUCTION" ? "rgba(234,179,8,0.15)" : "rgba(59,130,246,0.15)",
                            color: offer.type === "AUCTION" ? "var(--color-accent)" : "var(--color-secondary)",
                          }}
                        >
                          {offer.type === "AUCTION" ? <><Gavel size={10} className="inline" /> Enchère</> : <><ArrowLeftRight size={10} className="inline" /> Échange</>}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                          {formatRelativeTime(new Date(offer.createdAt))}
                        </span>
                      </div>

                      <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
                        {offer.offeredCard.name}
                      </p>
                      <p className="text-xs" style={{ color: RARITY_COLORS[rarity] }}>
                        {RARITY_LABELS[rarity]}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        par {offer.offerer.username}
                      </p>

                      {offer.type === "AUCTION" && (
                        <p className="text-xs mt-1 font-semibold" style={{ color: "var(--color-accent)" }}>
                          Min: {formatMelocoins(offer.minimumPrice ?? 0)} Melocoins
                          {offer.bids.length > 0 && ` · Meilleure offre: ${formatMelocoins(offer.bids[0].amount)}`}
                        </p>
                      )}

                      {offer.type === "CARD_FOR_CARD" && offer.requestedCard && (
                        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                          Demande: <span style={{ color: "var(--color-text)" }}>{offer.requestedCard.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!isMyOffer && (
                    <div className="mt-3 flex gap-2">
                      {offer.type === "AUCTION" && (
                        <BidInput
                          minimum={offer.minimumPrice ?? 0}
                          onBid={(amount) => placeBid(offer.id, amount)}
                          disabled={loading}
                        />
                      )}
                      {offer.type === "CARD_FOR_CARD" && (
                        <button
                          onClick={() => confirmOffer(offer.id)}
                          disabled={loading}
                          className="flex-1 py-2 rounded-xl text-sm font-semibold"
                          style={{ background: "var(--color-primary)", color: "#fff" }}
                        >
                          Confirmer l&apos;échange
                        </button>
                      )}
                    </div>
                  )}

                  {/* My offer: accept a bid */}
                  {isMyOffer && offer.type === "AUCTION" && offer.bids.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>
                        Offres reçues:
                      </p>
                      {offer.bids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: "var(--color-text)" }}>
                            {bid.bidder.username}: {formatMelocoins(bid.amount)} Melocoins
                          </span>
                          {bid.status === "PENDING" && (
                            <button
                              onClick={() => confirmOffer(offer.id, bid.id)}
                              disabled={loading}
                              className="px-3 py-1 rounded-lg text-xs font-semibold"
                              style={{ background: "var(--color-success)", color: "#fff" }}
                            >
                              Accepter
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Create offer */}
        {tab === "create" && (
          <div className="space-y-4">
            {/* Offer type */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>Type d&apos;offre</p>
              <div className="flex gap-2">
                {(["AUCTION", "CARD_FOR_CARD"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOfferType(t)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    style={{
                      background: offerType === t ? "var(--color-primary)" : "var(--color-surface-2)",
                      color: offerType === t ? "#fff" : "var(--color-text-muted)",
                    }}
                  >
                    {t === "AUCTION" ? <><Gavel size={14} /> Enchère</> : <><ArrowLeftRight size={14} /> Échange</>}
                  </button>
                ))}
              </div>
            </div>

            {/* Card to offer */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>Carte à proposer</p>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {myOwnedCards.map((card) => (
                  <label key={card.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="offeredCard"
                      value={card.id}
                      checked={selectedOfferedCard === card.id}
                      onChange={() => setSelectedOfferedCard(card.id)}
                      className="accent-purple-500"
                    />
                    <span className="text-sm" style={{ color: "var(--color-text)" }}>
                      {card.name} <span style={{ color: RARITY_COLORS[card.rarity as Rarity] }}>({RARITY_LABELS[card.rarity as Rarity]})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Auction: minimum price */}
            {offerType === "AUCTION" && (
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>Prix minimum (Melocoins)</p>
                <input
                  type="number"
                  min={1}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{
                    background: "var(--color-surface-2)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            )}

            {/* Card for card: requested card */}
            {offerType === "CARD_FOR_CARD" && (
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>Carte demandée en retour</p>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {allCards.map((card) => (
                    <label key={card.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="requestedCard"
                        value={card.id}
                        checked={selectedRequestedCard === card.id}
                        onChange={() => setSelectedRequestedCard(card.id)}
                        className="accent-purple-500"
                      />
                      <span className="text-sm" style={{ color: "var(--color-text)" }}>
                        {card.name} <span style={{ color: RARITY_COLORS[card.rarity as Rarity] }}>({RARITY_LABELS[card.rarity as Rarity]})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={createOffer}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold"
              style={{ background: "var(--color-primary)", color: "#fff", opacity: loading ? 0.6 : 1 }}
            >
              Publier l&apos;offre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BidInput({ minimum, onBid, disabled }: { minimum: number; onBid: (amount: number) => void; disabled: boolean }) {
  const [amount, setAmount] = useState(minimum);
  return (
    <div className="flex gap-2 flex-1">
      <input
        type="number"
        min={minimum}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="flex-1 px-2 py-1.5 rounded-xl text-sm border outline-none"
        style={{
          background: "var(--color-surface-2)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      />
      <button
        onClick={() => onBid(amount)}
        disabled={disabled || amount < minimum}
        className="px-3 py-1.5 rounded-xl text-sm font-semibold"
        style={{ background: "var(--color-accent)", color: "#000" }}
      >
        Enchérir
      </button>
    </div>
  );
}
