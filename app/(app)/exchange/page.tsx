"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, ArrowLeftRight } from "lucide-react";
import { CardItem } from "@/components/cards/CardItem";
import { RARITY_LABELS, RARITY_COLORS, type Rarity } from "@/lib/pack-odds";
import { formatRelativeTime } from "@/lib/utils";

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

interface Offer {
  id: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  offerer:   { id: string; username: string };
  recipient: { id: string; username: string };
  offeredCard:   Card;
  requestedCard: Card | null;
}

type Tab = "browse" | "create";

const STATUS_LABEL: Record<string, string> = {
  EN_ATTENTE: "En attente",
  VU:         "Vu",
  ACCEPTE:    "Accepté",
  REFUSE:     "Refusé",
  ANNULE:     "Annulé",
  EXPIRE:     "Expiré",
};

export default function ExchangePage() {
  const { data: session } = useSession();
  const [tab, setTab]     = useState<Tab>("browse");
  const [offers, setOffers]   = useState<Offer[]>([]);
  const [myCards, setMyCards]   = useState<(Card & { quantity: number })[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  // Create form state
  const [selectedOfferedCard,   setSelectedOfferedCard]   = useState("");
  const [selectedRequestedCard, setSelectedRequestedCard] = useState("");
  const [recipientUsername,     setRecipientUsername]     = useState("");

  const fetchData = useCallback(async () => {
    const [offersRes, myCardsRes, allCardsRes] = await Promise.all([
      fetch("/api/exchange"),
      fetch("/api/user/cards"),
      fetch("/api/cards"),
    ]);
    if (offersRes.ok)   setOffers(await offersRes.json());
    if (myCardsRes.ok)  setMyCards(await myCardsRes.json());
    if (allCardsRes.ok) setAllCards(await allCardsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createOffer = async () => {
    if (!selectedOfferedCard) return setError("Sélectionnez une carte à proposer.");
    if (!recipientUsername.trim()) return setError("Entrez le nom d'utilisateur du destinataire.");
    setLoading(true);
    setError("");
    const res = await fetch("/api/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offeredCardId:   selectedOfferedCard,
        requestedCardId: selectedRequestedCard || undefined,
        recipientUsername: recipientUsername.trim(),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setSuccess("Offre envoyée !");
      setTab("browse");
      setSelectedOfferedCard("");
      setSelectedRequestedCard("");
      setRecipientUsername("");
      fetchData();
    }
    setLoading(false);
  };

  const confirmOffer = async (offerId: string) => {
    setLoading(true);
    const res = await fetch(`/api/exchange/${offerId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
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

        <div className="flex px-4 pb-3 gap-2">
          {(["browse", "create"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t ? "var(--color-primary)" : "var(--color-surface-2)",
                color:      tab === t ? "#fff" : "var(--color-text-muted)",
              }}
            >
              {t === "browse" ? "Mes échanges" : "Créer une offre"}
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
              color:      error ? "var(--color-danger)"  : "var(--color-success)",
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
                Aucune offre d&apos;échange en cours.
              </p>
            )}
            {offers.map((offer) => {
              const isMyOffer = offer.offerer.id === session?.user?.id;
              const rarity    = offer.offeredCard.rarity as Rarity;
              const canConfirm = !isMyOffer && (offer.status === "EN_ATTENTE" || offer.status === "VU");
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
                            background: "rgba(59,130,246,0.15)",
                            color:      "var(--color-secondary)",
                          }}
                        >
                          <ArrowLeftRight size={10} className="inline mr-1" />
                          {STATUS_LABEL[offer.status] ?? offer.status}
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
                        {isMyOffer
                          ? `→ ${offer.recipient.username}`
                          : `de ${offer.offerer.username}`}
                      </p>

                      {offer.requestedCard && (
                        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                          Demande:{" "}
                          <span style={{ color: "var(--color-text)" }}>{offer.requestedCard.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {canConfirm && (
                    <div className="mt-3">
                      <button
                        onClick={() => confirmOffer(offer.id)}
                        disabled={loading}
                        className="w-full py-2 rounded-xl text-sm font-semibold"
                        style={{ background: "var(--color-primary)", color: "#fff" }}
                      >
                        Confirmer l&apos;échange
                      </button>
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
            {/* Recipient */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>
                Destinataire (nom d&apos;utilisateur)
              </p>
              <input
                type="text"
                placeholder="ex: Victor"
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{
                  background:   "var(--color-surface-2)",
                  borderColor:  "var(--color-border)",
                  color:        "var(--color-text)",
                }}
              />
            </div>

            {/* Card to offer */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>
                Carte à proposer
              </p>
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
                      {card.name}{" "}
                      <span style={{ color: RARITY_COLORS[card.rarity as Rarity] }}>
                        ({RARITY_LABELS[card.rarity as Rarity]})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Requested card (optional) */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>
                Carte demandée en retour <span style={{ fontWeight: 400 }}>(optionnel)</span>
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="requestedCard"
                    value=""
                    checked={selectedRequestedCard === ""}
                    onChange={() => setSelectedRequestedCard("")}
                    className="accent-purple-500"
                  />
                  <span className="text-sm italic" style={{ color: "var(--color-text-muted)" }}>
                    Aucune (cadeau)
                  </span>
                </label>
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
                      {card.name}{" "}
                      <span style={{ color: RARITY_COLORS[card.rarity as Rarity] }}>
                        ({RARITY_LABELS[card.rarity as Rarity]})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={createOffer}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold"
              style={{ background: "var(--color-primary)", color: "#fff", opacity: loading ? 0.6 : 1 }}
            >
              Envoyer l&apos;offre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
