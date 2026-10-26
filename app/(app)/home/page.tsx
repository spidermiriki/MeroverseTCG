"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, MessageCircle, Gift, Settings, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { PackOpeningModal } from "@/components/packs/PackOpeningModal";
import { getAvailableEnergy, getNextEnergyTime, MAX_ENERGY } from "@/lib/pack-odds";
import { cn, formatEnergyTimer } from "@/lib/utils";

interface Pack {
  id: string;
  name: string;
  collection: string;
  price: number;
  imageUrl: string;
  cardsCount: number;
}

interface UserData {
  coins: number;
  energyCount: number;
  lastEnergyTick: string;
  level: number;
  avatarUrl: string | null;
  username: string;
}

interface Card {
  id: string;
  number: number;
  name: string;
  rarity: string;
  imageUrl: string;
}

export default function HomePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pack, setPack] = useState<Pack | null>(null);
  const [ownedCount, setOwnedCount] = useState<number>(0);
  const [drawnCards, setDrawnCards] = useState<Card[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Tick every second for live timer re-render
  const [, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fetchData = useCallback(async () => {
    const [userRes, packsRes, collectionRes] = await Promise.all([
      fetch("/api/user"),
      fetch("/api/packs"),
      fetch("/api/collection"),
    ]);
    setUserData(await userRes.json());
    const pd = await packsRes.json();
    setPack(pd.packs?.[0] ?? null);
    const cd = await collectionRes.json();
    setOwnedCount(cd.stats?.owned ?? 0);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const lastTick = userData ? new Date(userData.lastEnergyTick) : new Date();
  const energy = userData ? getAvailableEnergy(userData.energyCount, lastTick) : 0;
  const nextEnergyTime = userData ? getNextEnergyTime(userData.energyCount, lastTick) : null;
  const isMaxEnergy = energy >= MAX_ENERGY;
  const hasFree = energy > 0;
  const canAfford = userData && pack ? userData.coins >= pack.price : false;

  const openPack = async () => {
    if (!pack || loading) return;
    const isFree = hasFree;
    if (!isFree && !canAfford) { setError("Pas assez de pièces ou d'énergie."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/packs/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pack.id, isFree }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else { setDrawnCards(data.cards); await fetchData(); }
    } catch { setError("Erreur réseau."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh-96px)] px-6 pt-6 pb-4 gap-6">
      {/* Barre du joueur */}
      <div className="flex items-center justify-between shrink-0">
        {/* Pièces */}
        <div
          style={{ backdropFilter: "blur(7px)", background: "rgba(18,33,41,0.78)", border: "1px solid #223944", borderRadius: 100 }}
          className="flex items-center gap-2 pl-[10px] pr-2 py-[6px]"
        >
          <Image src="/brand/piece.png" alt="" width={24} height={23} className="object-contain shrink-0" />
          <span className="font-unbounded font-semibold text-[13px] text-mv-text whitespace-nowrap">
            {userData ? userData.coins.toLocaleString("fr-FR") : "—"}
          </span>
          <Link href="/shop">
            <div className="w-[26px] h-[26px] rounded-full bg-mv-accent flex items-center justify-center shrink-0">
              <Plus size={14} color="white" />
            </div>
          </Link>
        </div>

        {/* Avatar centré */}
        <div className="flex flex-col items-center gap-[6px]">
          <div style={{ border: "3px solid #ea4316", borderRadius: 32 }} className="size-16 overflow-hidden relative">
            <Avatar src={userData?.avatarUrl} name={userData?.username} size="lg" className="border-0" />
          </div>
          <span className="font-inter font-semibold text-[11px] text-mv-muted">
            {userData ? `${userData.username} lv.${userData.level}` : "—"}
          </span>
        </div>

        {/* Raccourcis */}
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <div
              style={{ backdropFilter: "blur(7px)", background: "rgba(18,33,41,0.78)", border: "1px solid #223944" }}
              className="size-11 rounded-[22px] flex items-center justify-center"
            >
              <MessageCircle size={20} className="text-mv-muted" />
            </div>
          </Link>
          <Link href="/gifts">
            <div className="relative size-11 flex items-center justify-center">
              <div
                style={{ backdropFilter: "blur(7px)", background: "rgba(18,33,41,0.78)", border: "1px solid #223944" }}
                className="size-11 rounded-[22px] flex items-center justify-center"
              >
                <Gift size={20} className="text-mv-muted" />
              </div>
              <div className="absolute top-[6px] right-[6px] size-[8px] rounded-full bg-mv-accent border-2 border-[#0a1419]" />
            </div>
          </Link>
          <Link href="/settings">
            <div
              style={{ backdropFilter: "blur(7px)", background: "rgba(18,33,41,0.78)", border: "1px solid #223944" }}
              className="size-11 rounded-[22px] flex items-center justify-center"
            >
              <Settings size={20} className="text-mv-muted" />
            </div>
          </Link>
        </div>
      </div>

      {/* Titre MEROVERSE */}
      <h1
        className="font-unbounded font-bold text-[40px] tracking-[-0.4px] text-center shrink-0 leading-[1.1]"
        style={{ textShadow: "0px 0px 24px rgba(249,35,47,0.35)" }}
      >
        <span className="text-mv-text">MERO</span>
        <span className="text-mv-accent">VERSE</span>
      </h1>

      {/* Vitrine booster */}
      <div
        className="flex-1 flex flex-col items-center justify-between overflow-hidden rounded-[20px] pt-[22px] pb-4 px-4 border relative"
        style={{
          background: "linear-gradient(57deg, rgba(234,67,22,0) 0%, rgba(234,67,22,0) 50%, rgba(234,67,22,0.55) 82%, rgba(249,35,47,0.9) 100%), linear-gradient(90deg, rgba(18,33,41,0.78), rgba(18,33,41,0.78))",
          borderColor: "#223944",
          backdropFilter: "blur(7px)",
        }}
      >
        {/* Lueurs bicolores */}
        <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none">
          <div style={{ position: "absolute", background: "rgba(234,67,22,0.9)", filter: "blur(11px)", width: 113, height: 344, top: 82, left: -10, borderRadius: 16 }} />
          <div style={{ position: "absolute", background: "rgba(109,220,253,0.85)", filter: "blur(11px)", width: 113, height: 344, top: 82, left: 92, borderRadius: 16 }} />
          <div style={{ position: "absolute", width: 205, height: 295, left: -107, top: 106 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/halo-noir-orange.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ position: "absolute", width: 205, height: 295, left: 98, top: 106 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/halo-blanc-cyan.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>

        {/* Booster (cliquable) */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          {pack ? (
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onClick={openPack}
              className={cn("cursor-pointer select-none", loading && "opacity-60 pointer-events-none")}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: 195, height: 328, borderRadius: 8,
                  boxShadow: "0 0 10px rgba(255,255,255,0.35), 0 14px 24px rgba(0,0,0,0.45)",
                }}
              >
                {/* Use img for jfif support */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pack.imageUrl}
                  alt={pack.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </motion.div>
          ) : (
            <p className="text-mv-muted text-sm">Aucun booster disponible</p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 text-center mb-2 z-10 relative">{error}</p>
        )}

        {/* Minuteurs */}
        <div className="flex items-center gap-2 w-full z-10 shrink-0 relative">
          {/* Énergie */}
          <div
            className="flex-1 flex items-center justify-center gap-[6px] px-[10px] py-[9px] rounded-full"
            style={{ background: "rgba(24,43,52,0.78)", backdropFilter: "blur(7px)" }}
          >
            <div style={{ boxShadow: "0 0 6px rgba(109,220,253,0.7)" }}>
              <Image src="/brand/eclair.png" alt="" width={12} height={19} className="object-contain" />
            </div>
            <span className="font-inter font-semibold text-[11px] text-mv-text whitespace-nowrap">
              {isMaxEnergy ? "Énergie au max" : `Énergie ${energy}/${MAX_ENERGY}`}
            </span>
          </div>

          {/* Recharge (masqué si max énergie) */}
          {!isMaxEnergy && nextEnergyTime && (
            <div
              className="flex-1 flex items-center justify-center gap-[6px] px-[10px] py-[9px] rounded-full"
              style={{ background: "rgba(24,43,52,0.78)", backdropFilter: "blur(7px)" }}
            >
              <Clock size={14} className="text-mv-muted shrink-0" />
              <span className="font-inter font-semibold text-[11px] text-mv-text whitespace-nowrap">
                {formatEnergyTimer(nextEnergyTime)}
              </span>
            </div>
          )}

          {/* Badge collection */}
          <div
            className="size-10 rounded-[20px] flex items-center justify-center shrink-0 border-2 border-[#0a1419]"
            style={{ background: "#6ddcfd" }}
          >
            <span className="font-extrabold text-[11px] text-[#1d3545]">{ownedCount}</span>
          </div>
        </div>
      </div>

      {drawnCards && (
        <PackOpeningModal cards={drawnCards} onClose={() => setDrawnCards(null)} />
      )}
    </div>
  );
}
