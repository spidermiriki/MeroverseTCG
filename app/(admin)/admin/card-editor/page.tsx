"use client";

import { useRef, useState } from "react";
import { Download, ImageIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Race    = "BLANC" | "NOIR" | "MEXICAIN" | "ZOULOU";
type Rarity  = "COMMUN" | "RARE" | "EPIQUE" | "MYTHIQUE" | "LEGENDAIRE" | "CHROMATIQUE" | "RAINBOW";
type Gender  = "M" | "F" | "N";

interface Attack {
  cost: string[];
  name: string;
  damage: string;
}

interface CardData {
  name: string;
  race: Race;
  rarity: Rarity;
  gender: Gender;
  hp: number;
  artSrc: string | null;
  characterTypes: string[];
  attacks: [Attack, Attack];
  weaknesses: { type: string; mult: string }[];
  resistances: { type: string; val: string }[];
  collection: string;
  cardNumber: string;
  totalCards: string;
  isSecret: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ENERGY: Record<string, { abbr: string; bg: string; fg: string }> = {
  Feu:        { abbr: "F",  bg: "#CC2200", fg: "#fff" },
  Eau:        { abbr: "E",  bg: "#0075BE", fg: "#fff" },
  Éclair:     { abbr: "⚡", bg: "#F0A000", fg: "#222" },
  Plante:     { abbr: "P",  bg: "#2E7D32", fg: "#fff" },
  Psy:        { abbr: "Ψ",  bg: "#9C27B0", fg: "#fff" },
  Combat:     { abbr: "C",  bg: "#8B4513", fg: "#fff" },
  Obscurité:  { abbr: "O",  bg: "#1A0A3E", fg: "#fff" },
  Métal:      { abbr: "M",  bg: "#757575", fg: "#fff" },
  Incolore:   { abbr: "★",  bg: "#9E9E9E", fg: "#fff" },
  Dragon:     { abbr: "D",  bg: "#4527A0", fg: "#fff" },
  Fée:        { abbr: "✿",  bg: "#E91E8C", fg: "#fff" },
};

const RACE_STYLE: Record<Race, { base: string; glow: string; text: string; sub: string }> = {
  BLANC: {
    base: "linear-gradient(150deg, #d0d0d0 0%, #f0f0f0 30%, #ffffff 50%, #d8d8d8 75%, #b8b8b8 100%)",
    glow: "radial-gradient(ellipse at 68% 80%, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.14) 40%, transparent 65%), radial-gradient(ellipse at 28% 14%, rgba(255,255,255,0.85) 0%, transparent 48%)",
    text: "#0a0a0a", sub: "#3c3c3c",
  },
  NOIR: {
    base: "linear-gradient(150deg, #000000 0%, #0c0c0c 30%, #161616 55%, #080808 80%, #000000 100%)",
    glow: "radial-gradient(ellipse at 35% 18%, rgba(255,255,255,0.25) 0%, rgba(200,200,200,0.08) 38%, transparent 62%)",
    text: "#f0f0f0", sub: "#888888",
  },
  MEXICAIN: {
    base: "linear-gradient(150deg, #082010 0%, #10401a 25%, #1c6826 50%, #0e4c14 75%, #051808 100%)",
    glow: "radial-gradient(ellipse at 45% 20%, rgba(80,220,90,0.42) 0%, rgba(40,150,50,0.2) 44%, transparent 70%)",
    text: "#ddfce8", sub: "#72cc80",
  },
  ZOULOU: {
    base: "linear-gradient(150deg, #150200 0%, #4c0e00 25%, #8a1e00 50%, #5c1000 75%, #180300 100%)",
    glow: "radial-gradient(ellipse at 45% 20%, rgba(255,110,20,0.55) 0%, rgba(200,55,0,0.28) 44%, transparent 70%)",
    text: "#fff4e0", sub: "#ffaa50",
  },
};

const RARITY_BORDER: Record<Rarity, string> = {
  COMMUN:      "#9e9e9e",
  RARE:        "#1565c0",
  EPIQUE:      "#7b1fa2",
  MYTHIQUE:    "#e65100",
  LEGENDAIRE:  "#f9a825",
  CHROMATIQUE: "#c2185b",
  RAINBOW:     "#ffffff", // géré séparément (arc-en-ciel)
};

// Badges pour faiblesse/résistance : sexe et race
const TYPE_BADGE: Record<string, { bg: string; fg: string; symbol: string }> = {
  "♂ Masculin": { bg: "#1565c0", fg: "#fff",    symbol: "♂" },
  "♀ Féminin":  { bg: "#ad1457", fg: "#fff",    symbol: "♀" },
  BLANC:        { bg: "#7aaac8", fg: "#071830",  symbol: "B" },
  NOIR:         { bg: "#1a0840", fg: "#ecdeff",  symbol: "N" },
  MEXICAIN:     { bg: "#1c6826", fg: "#ddfce8",  symbol: "M" },
  ZOULOU:       { bg: "#8a1e00", fg: "#fff4e0",  symbol: "Z" },
};

// ─── Energy Badge (PNG Pokémon TCG) ───────────────────────────────────────────

const ENERGY_FILE: Record<string, string> = {
  Feu:        "fire",
  Eau:        "water",
  Éclair:     "lightning",
  Plante:     "grass",
  Psy:        "psychic",
  Combat:     "fighting",
  Obscurité:  "darkness",
  Métal:      "metal",
  Incolore:   "colorless",
  Dragon:     "dragon",
  Fée:        "fairy",
};

function EnergyBadge({ type, size = 20 }: { type: string; size?: number }) {
  const file = ENERGY_FILE[type];
  const cfg  = ENERGY[type];
  if (!file && !cfg) return null;

  return (
    <span style={{ display: "inline-flex", flexShrink: 0, width: size, height: size, borderRadius: "50%", overflow: "hidden", boxShadow: "0 1px 5px rgba(0,0,0,0.6)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/energy/${file}.png`}
        alt={type}
        width={size}
        height={size}
        style={{ display: "block", width: size, height: size, objectFit: "cover" }}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          el.style.display = "none";
          const parent = el.parentElement;
          if (parent && cfg) {
            parent.style.background = cfg.bg;
            parent.style.display = "flex";
            parent.style.alignItems = "center";
            parent.style.justifyContent = "center";
            parent.style.color = cfg.fg;
            parent.style.fontSize = `${size * 0.42}px`;
            parent.style.fontWeight = "900";
            parent.textContent = cfg.abbr;
          }
        }}
      />
    </span>
  );
}

// Badge universel : énergie, sexe ou race
function TypeBadge({ type, size = 14 }: { type: string; size?: number }) {
  if (ENERGY_FILE[type] || ENERGY[type]) return <EnergyBadge type={type} size={size} />;
  const cfg = TYPE_BADGE[type];
  if (!cfg) return null;
  return (
    <span style={{
      display: "inline-flex", flexShrink: 0, width: size, height: size,
      borderRadius: "50%", background: cfg.bg, color: cfg.fg,
      alignItems: "center", justifyContent: "center",
      fontSize: size * 0.52, fontWeight: 900,
      boxShadow: "0 1px 5px rgba(0,0,0,0.6)", lineHeight: 1,
    }}>
      {cfg.symbol}
    </span>
  );
}

function EnergyPicker({ selected, onToggle }: { selected: string[]; onToggle: (t: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {Object.keys(ENERGY).map((t) => (
        <button key={t} onClick={() => onToggle(t)} title={t} style={{
          background: "none", padding: 0, cursor: "pointer", lineHeight: 0,
          border: selected.includes(t) ? "2.5px solid #fff" : "2.5px solid transparent",
          borderRadius: "50%",
        }}>
          <EnergyBadge type={t} size={22} />
        </button>
      ))}
    </div>
  );
}

// ─── Shared bottom section ─────────────────────────────────────────────────────

function CardBottom({ card, border, textColor, subColor }: {
  card: CardData;
  border: string;
  textColor: string;
  subColor: string;
}) {
  return (
    <div style={{ position: "absolute", bottom: 15, left: 16, right: 16, zIndex: 2 }}>
      <div style={{ height: 1, background: `${border}70`, marginBottom: 4 }} />

      {/* Faiblesses */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", marginBottom: 2, fontSize: 10, color: subColor }}>
        <span style={{ flexShrink: 0 }}>Faiblesse :</span>
        {card.weaknesses.length === 0
          ? <span>—</span>
          : card.weaknesses.map((w, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <TypeBadge type={w.type} size={13} />
              <span style={{ color: textColor, fontWeight: 700 }}>{w.mult}</span>
            </span>
          ))
        }
      </div>

      {/* Résistances */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", marginBottom: 4, fontSize: 10, color: subColor }}>
        <span style={{ flexShrink: 0 }}>Résistance :</span>
        {card.resistances.length === 0
          ? <span>—</span>
          : card.resistances.map((r, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <TypeBadge type={r.type} size={13} />
              <span style={{ color: textColor, fontWeight: 700 }}>{r.val}</span>
            </span>
          ))
        }
      </div>

      <div style={{ height: 1, background: `${border}70`, marginBottom: 3 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          background: "#000", color: "#fff", fontWeight: 700,
          padding: "1px 3px", borderRadius: 2, fontSize: 7,
          letterSpacing: 0.5, textTransform: "uppercase",
          maxWidth: 56, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {(card.collection || "COLL").slice(0, 8)}
        </span>
        <span style={{ fontSize: 10, color: subColor, opacity: 0.8, letterSpacing: 0.4 }}>
          {card.cardNumber.padStart(3, "0")}/{card.totalCards.padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}

// ─── Card Preview ─────────────────────────────────────────────────────────────

function CardPreview({ card, cardRef, artScale, artOffsetX, artOffsetY }: {
  card: CardData;
  cardRef: React.RefObject<HTMLDivElement>;
  artScale: number;
  artOffsetX: number;
  artOffsetY: number;
}) {
  const rs        = RACE_STYLE[card.race];
  const border    = RARITY_BORDER[card.rarity];
  const isFullArt = card.isSecret || card.rarity === "LEGENDAIRE" || card.rarity === "CHROMATIQUE" || card.rarity === "RAINBOW";

  // ── Mode full art (carte secrète / Légendaire / Chromatique) ──
  if (isFullArt) {
    return (
      <>
        <style>{`
          @keyframes borderPulse {
            0%, 100% { opacity: 0.75; box-shadow: inset 0 0 10px ${border}40, 0 0 18px ${border}40; }
            50%       { opacity: 1;   box-shadow: inset 0 0 24px ${border}80, 0 0 34px ${border}70; }
          }
          @keyframes neonPulse {
            0%, 100% { filter: brightness(1)   saturate(1.3); opacity: 0.80; }
            50%       { filter: brightness(1.6) saturate(2);   opacity: 1; }
          }
          @keyframes neonGlow {
            0%, 100% { box-shadow: 0 0 22px 5px #ff149360, 0 0 48px 12px #9c27b030, 0 32px 80px rgba(0,0,0,0.95); }
            50%       { box-shadow: 0 0 36px 10px #ff149390, 0 0 72px 22px #9c27b060, 0 32px 80px rgba(0,0,0,0.95); }
          }
          @keyframes rainbowHue {
            0%   { filter: hue-rotate(0deg)   brightness(1.2); }
            100% { filter: hue-rotate(360deg) brightness(1.2); }
          }
          @keyframes rainbowGlow {
            0%   { box-shadow: 0 0 30px 6px #ff000050, 0 32px 80px rgba(0,0,0,0.95); }
            16%  { box-shadow: 0 0 30px 6px #ff770050, 0 32px 80px rgba(0,0,0,0.95); }
            33%  { box-shadow: 0 0 30px 6px #ffff0050, 0 32px 80px rgba(0,0,0,0.95); }
            50%  { box-shadow: 0 0 30px 6px #00cc0050, 0 32px 80px rgba(0,0,0,0.95); }
            66%  { box-shadow: 0 0 30px 6px #0055ff50, 0 32px 80px rgba(0,0,0,0.95); }
            83%  { box-shadow: 0 0 30px 6px #8b00ff50, 0 32px 80px rgba(0,0,0,0.95); }
            100% { box-shadow: 0 0 30px 6px #ff000050, 0 32px 80px rgba(0,0,0,0.95); }
          }
          @keyframes cardShine {
            0%          { left: -90%; opacity: 0; }
            8%, 92%     { opacity: 0.9; }
            100%        { left: 160%; opacity: 0; }
          }
        `}</style>
        <div ref={cardRef} style={{
          width: 300, height: 420, borderRadius: 16,
          background: "#080808",
          boxShadow: (card.rarity === "RAINBOW" || card.rarity === "CHROMATIQUE")
            ? undefined
            : `0 0 28px 5px ${border}45, 0 32px 80px rgba(0,0,0,0.95)`,
          animation: card.rarity === "RAINBOW"
            ? "rainbowGlow 4s linear infinite"
            : card.rarity === "CHROMATIQUE"
              ? "neonGlow 2.5s ease-in-out infinite"
              : undefined,
          overflow: "hidden", position: "relative",
          fontFamily: "'Segoe UI', system-ui, sans-serif", flexShrink: 0,
        }}>
          {/* Art plein format */}
          {card.artSrc
            ? (/* eslint-disable-next-line @next/next/no-img-element */
              <img src={card.artSrc} alt="" style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "contain", zIndex: 0,
                transform: `scale(${artScale}) translate(${artOffsetX}%, ${artOffsetY}%)`,
                transformOrigin: "center center",
              }} />)
            : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 12, zIndex: 0 }}>Uploader l&apos;art</div>
          }

          {/* Dégradé sombre haut + bas pour lisibilité du texte */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.04) 32%, rgba(0,0,0,0.04) 52%, rgba(0,0,0,0.78) 72%, rgba(0,0,0,0.94) 100%)", zIndex: 1, pointerEvents: "none" }} />

          {/* ─ Holo permanent (toujours visible, présent dans l'export PNG) ─ */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: card.rarity === "RAINBOW"
              ? "linear-gradient(125deg, rgba(255,80,80,0.07) 0%, rgba(255,200,80,0.07) 20%, rgba(80,255,80,0.07) 40%, rgba(80,200,255,0.07) 60%, rgba(180,80,255,0.07) 80%, rgba(255,80,200,0.07) 100%)"
              : card.rarity === "CHROMATIQUE"
                ? "linear-gradient(125deg, rgba(255,20,147,0.10) 0%, rgba(200,50,200,0.07) 35%, rgba(140,0,200,0.09) 65%, rgba(255,20,147,0.10) 100%)"
                : "linear-gradient(125deg, transparent 20%, rgba(255,255,255,0.07) 42%, rgba(220,230,255,0.05) 50%, rgba(255,220,240,0.07) 58%, transparent 80%)",
          }} />

          {/* Reflet animé diagonal (navigateur, hors export) */}
          <div style={{
            position: "absolute", top: "-50%", width: "28%", height: "200%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.13) 50%, transparent)",
            transform: "rotate(18deg)", zIndex: 3, pointerEvents: "none",
            animation: "cardShine 5s ease-in-out infinite",
          }} />

          {/* Nom + Genre + PV */}
          <div style={{ position: "absolute", top: 18, left: 18, right: 18, zIndex: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: "#fff", textShadow: "0 0 10px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,0.9)" }}>
              {card.name || "Nom"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              {card.gender !== "N" && (
                <span style={{ fontSize: 14, fontWeight: 800, color: card.gender === "M" ? "#90caf9" : "#f48fb1", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                  {card.gender === "M" ? "♂" : "♀"}
                </span>
              )}
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>PV</span>
              <span style={{ fontSize: 21, fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: "0 0 8px rgba(0,0,0,1)" }}>{card.hp}</span>
              {card.characterTypes[0] && <EnergyBadge type={card.characterTypes[0]} size={21} />}
            </div>
          </div>

          {/* Types supplémentaires */}
          {card.characterTypes.length > 1 && (
            <div style={{ position: "absolute", top: 48, left: 18, zIndex: 4, display: "flex", gap: 3 }}>
              {card.characterTypes.slice(1).map((t) => <EnergyBadge key={t} type={t} size={17} />)}
            </div>
          )}

          {/* Attaques */}
          <div style={{ position: "absolute", bottom: 68, left: 16, right: 16, zIndex: 4 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {card.attacks.map((atk, i) =>
                (atk.name || atk.damage) ? (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                      {atk.cost.map((t, j) => <EnergyBadge key={j} type={t} size={15} />)}
                      {atk.cost.length === 0 && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>—</span>}
                    </div>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.9)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {atk.name || `Attaque ${i + 1}`}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.9)", flexShrink: 0 }}>{atk.damage}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Contour animé au-dessus de l'image */}
          {card.rarity === "RAINBOW"
            ? /* Arc-en-ciel tournant — RAINBOW uniquement (Tunay) */
              <div style={{
                position: "absolute", inset: 0, zIndex: 10,
                background: "conic-gradient(from 0deg, #ff0000, #ff7700, #ffff00, #00cc00, #00ffff, #0000ff, #8b00ff, #ff0000)",
                WebkitMaskImage: "linear-gradient(black,black), linear-gradient(black,black)",
                WebkitMaskSize: "288px 408px, 100%",
                WebkitMaskPosition: "center, center",
                WebkitMaskRepeat: "no-repeat, no-repeat",
                WebkitMaskComposite: "xor",
                maskImage: "linear-gradient(black,black), linear-gradient(black,black)",
                maskSize: "288px 408px, 100%",
                maskPosition: "center, center",
                maskRepeat: "no-repeat, no-repeat",
                maskComposite: "exclude",
                animation: "rainbowHue 4s linear infinite",
                pointerEvents: "none",
              } as React.CSSProperties}
            />
            : card.rarity === "CHROMATIQUE"
            ? /* Néon rose → mauve avec masque dégradé */
              <div style={{
                position: "absolute", inset: 0, zIndex: 10,
                background: "linear-gradient(135deg, #ff1493 0%, #e040fb 35%, #9c27b0 65%, #ff1493 100%)",
                WebkitMaskImage: "linear-gradient(black,black), linear-gradient(black,black)",
                WebkitMaskSize: "288px 408px, 100%",
                WebkitMaskPosition: "center, center",
                WebkitMaskRepeat: "no-repeat, no-repeat",
                WebkitMaskComposite: "xor",
                maskImage: "linear-gradient(black,black), linear-gradient(black,black)",
                maskSize: "288px 408px, 100%",
                maskPosition: "center, center",
                maskRepeat: "no-repeat, no-repeat",
                maskComposite: "exclude",
                animation: "neonPulse 2.5s ease-in-out infinite",
                pointerEvents: "none",
              } as React.CSSProperties}
            />
            : /* Toutes les autres raretés : bord fin couleur rareté avec pulse */
              <div style={{
                position: "absolute", inset: 0, zIndex: 10,
                borderRadius: 16,
                border: `6px solid ${border}cc`,
                boxSizing: "border-box",
                animation: "borderPulse 2.8s ease-in-out infinite",
                pointerEvents: "none",
              }} />
          }

          <CardBottom card={card} border="rgba(255,255,255,0.5)" textColor="#fff" subColor="rgba(255,255,255,0.65)" />
        </div>
      </>
    );
  }

  // ── Mode normal ──
  return (
    <div ref={cardRef} style={{
      width: 300, height: 420, borderRadius: 16,
      background: rs.base,
      boxShadow: `inset 0 0 0 12px ${border}, 0 0 26px 5px ${border}50, 0 32px 80px rgba(0,0,0,0.9)`,
      overflow: "hidden", position: "relative",
      fontFamily: "'Segoe UI', system-ui, sans-serif", flexShrink: 0,
    }}>
      {/* Halo lumineux spécifique à la race */}
      <div style={{ position: "absolute", inset: 0, background: rs.glow, pointerEvents: "none", zIndex: 0 }} />

      {/* Contenu principal */}
      <div style={{ position: "relative", zIndex: 1, padding: "16px 16px 0" }}>

        {/* Nom + Genre + PV + Type principal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: rs.text, maxWidth: 155, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {card.name || "Nom"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {card.gender !== "N" && (
              <span style={{ fontSize: 14, fontWeight: 800, color: card.gender === "M" ? "#2980d8" : "#d060a0" }}>
                {card.gender === "M" ? "♂" : "♀"}
              </span>
            )}
            <span style={{ fontSize: 10, color: rs.sub, fontWeight: 600, letterSpacing: 0.3 }}>PV</span>
            <span style={{ fontSize: 21, fontWeight: 900, color: rs.text, lineHeight: 1 }}>{card.hp}</span>
            {card.characterTypes[0] && <EnergyBadge type={card.characterTypes[0]} size={21} />}
          </div>
        </div>

        {/* Art — objectFit contain pour voir l'image entière */}
        <div style={{
          height: 155, borderRadius: 8, overflow: "hidden",
          background: "rgba(0,0,0,0.25)", marginBottom: 6,
          border: `1.5px solid ${border}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 2px 12px rgba(0,0,0,0.4)`,
        }}>
          {card.artSrc
            ? (/* eslint-disable-next-line @next/next/no-img-element */
              <img src={card.artSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />)
            : <span style={{ fontSize: 11, color: rs.sub, opacity: 0.45 }}>Art du personnage</span>
          }
        </div>

        {/* Types supplémentaires */}
        {card.characterTypes.length > 1 && (
          <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
            {card.characterTypes.slice(1).map((t) => <EnergyBadge key={t} type={t} size={17} />)}
          </div>
        )}

        <div style={{ height: 1, background: `${border}55`, margin: "2px 0 5px" }} />

        {/* Attaques */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {card.attacks.map((atk, i) =>
            (atk.name || atk.damage) ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  {atk.cost.map((t, j) => <EnergyBadge key={j} type={t} size={15} />)}
                  {atk.cost.length === 0 && <span style={{ fontSize: 10, color: rs.sub }}>—</span>}
                </div>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: rs.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {atk.name || `Attaque ${i + 1}`}
                </span>
                <span style={{ fontSize: 15, fontWeight: 900, color: rs.text, flexShrink: 0 }}>{atk.damage}</span>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Bas de carte — position fixe */}
      <CardBottom card={card} border={border} textColor={rs.text} subColor={rs.sub} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CardEditorPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState<CardData>({
    name: "", race: "BLANC", rarity: "COMMUN", gender: "M", hp: 100,
    artSrc: null, characterTypes: [],
    attacks: [{ cost: [], name: "", damage: "" }, { cost: [], name: "", damage: "" }],
    weaknesses: [], resistances: [],
    collection: "BLACK_VS_WHITE", cardNumber: "001", totalCards: "019",
    isSecret: false,
  });
  const [draftW,     setDraftW]     = useState({ type: "", mult: "×2" });
  const [draftR,     setDraftR]     = useState({ type: "", val: "-30" });
  const [artScale,   setArtScale]   = useState(1.0);
  const [artOffsetX, setArtOffsetX] = useState(0);
  const [artOffsetY, setArtOffsetY] = useState(0);

  const set = (patch: Partial<CardData>) => setCard((c) => ({ ...c, ...patch }));

  const uploadArt = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
      const r = new FileReader();
      r.onload = (ev) => set({ artSrc: ev.target?.result as string });
      r.readAsDataURL(f);
    };
    input.click();
  };

  const updateAttack = (idx: number, patch: Partial<Attack>) => {
    const attacks = card.attacks.map((a, i) => i === idx ? { ...a, ...patch } : a) as [Attack, Attack];
    set({ attacks });
  };

  const toggleAttackCost = (idx: number, type: string) => {
    const cost = card.attacks[idx].cost;
    updateAttack(idx, { cost: cost.includes(type) ? cost.filter((t) => t !== type) : [...cost, type] });
  };

  const toggleType = (type: string) => {
    const types = card.characterTypes;
    set({ characterTypes: types.includes(type) ? types.filter((t) => t !== type) : [...types, type] });
  };

  const addWeakness = () => {
    if (!draftW.type) return;
    set({ weaknesses: [...card.weaknesses, { ...draftW }] });
    setDraftW({ type: "", mult: "×2" });
  };
  const removeWeakness = (i: number) => set({ weaknesses: card.weaknesses.filter((_, j) => j !== i) });

  const addResistance = () => {
    if (!draftR.type) return;
    set({ resistances: [...card.resistances, { ...draftR }] });
    setDraftR({ type: "", val: "-30" });
  };
  const removeResistance = (i: number) => set({ resistances: card.resistances.filter((_, j) => j !== i) });

  const exportPng = async () => {
    if (!cardRef.current) return;
    const domtoimage = (await import("dom-to-image-more")).default;
    const dataUrl = await domtoimage.toPng(cardRef.current, { width: 300, height: 420 });
    const a = document.createElement("a");
    a.download = `${card.name || "carte"}.png`; a.href = dataUrl; a.click();
  };

  const inp: React.CSSProperties = { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.35)", color: "#fff", fontSize: 12, boxSizing: "border-box" };
  const sel: React.CSSProperties = { ...inp, background: "#111" };
  const lbl: React.CSSProperties = { margin: "0 0 5px", fontSize: 10, color: "#777", textTransform: "uppercase", letterSpacing: 0.8 };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#08080f", color: "#fff", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 282, overflowY: "auto", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#c4b5fd" }}>Créateur de carte</h1>

        <div><p style={lbl}>Nom du personnage</p><input value={card.name} onChange={(e) => set({ name: e.target.value })} placeholder="Victor..." style={inp} /></div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div><p style={lbl}>Race</p>
            <select value={card.race} onChange={(e) => set({ race: e.target.value as Race })} style={sel}>
              <option value="BLANC">Blanc</option><option value="NOIR">Noir</option>
              <option value="MEXICAIN">Mexicain</option><option value="ZOULOU">Zoulou</option>
            </select>
          </div>
          <div><p style={lbl}>Rareté</p>
            <select value={card.rarity} onChange={(e) => set({ rarity: e.target.value as Rarity })} style={sel}>
              <option value="COMMUN">Commun</option><option value="RARE">Rare</option>
              <option value="EPIQUE">Épique</option><option value="MYTHIQUE">Mythique</option>
              <option value="LEGENDAIRE">Légendaire</option><option value="CHROMATIQUE">Chromatique</option>
              <option value="RAINBOW">Rainbow ✦</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div><p style={lbl}>Sexe</p>
            <select value={card.gender} onChange={(e) => set({ gender: e.target.value as Gender })} style={sel}>
              <option value="M">♂ Masculin</option><option value="F">♀ Féminin</option><option value="N">Non précisé</option>
            </select>
          </div>
          <div><p style={lbl}>PV</p>
            <input type="number" value={card.hp} min={10} max={999} step={10} onChange={(e) => set({ hp: Number(e.target.value) })} style={inp} />
          </div>
        </div>

        <div><p style={lbl}>Illustration</p>
          <button onClick={uploadArt} style={{ width: "100%", padding: "8px 0", borderRadius: 7, cursor: "pointer", fontSize: 12, background: card.artSrc ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.18)", color: card.artSrc ? "#c4b5fd" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <ImageIcon size={13} /> {card.artSrc ? "Changer l'image" : "Uploader l'art"}
          </button>
        </div>

        {/* Carte secrète toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 10px", borderRadius: 8, background: card.isSecret ? "rgba(249,168,37,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${card.isSecret ? "rgba(249,168,37,0.35)" : "rgba(255,255,255,0.07)"}` }}>
          <input
            type="checkbox"
            checked={card.isSecret}
            onChange={(e) => set({ isSecret: e.target.checked })}
            style={{ accentColor: "#f9a825", width: 14, height: 14, cursor: "pointer" }}
          />
          <div>
            <div style={{ fontSize: 12, color: card.isSecret ? "#f9a825" : "#aaa", fontWeight: 600 }}>Carte secrète (full art)</div>
            <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>L&apos;illustration prend toute la carte</div>
          </div>
        </label>

        {/* Sliders pan/zoom — visibles uniquement en mode full art */}
        {(card.isSecret || card.rarity === "LEGENDAIRE" || card.rarity === "CHROMATIQUE") && (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={lbl}>Position &amp; Zoom (full art)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "#777" }}>Zoom</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>{artScale.toFixed(2)}×</span>
                </div>
                <input type="range" min={0.5} max={3} step={0.05} value={artScale} onChange={(e) => setArtScale(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed", cursor: "pointer" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "#777" }}>Horizontal</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>{artOffsetX > 0 ? "+" : ""}{artOffsetX}%</span>
                </div>
                <input type="range" min={-50} max={50} step={1} value={artOffsetX} onChange={(e) => setArtOffsetX(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed", cursor: "pointer" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "#777" }}>Vertical</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>{artOffsetY > 0 ? "+" : ""}{artOffsetY}%</span>
                </div>
                <input type="range" min={-50} max={50} step={1} value={artOffsetY} onChange={(e) => setArtOffsetY(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed", cursor: "pointer" }} />
              </div>
              <button onClick={() => { setArtScale(1); setArtOffsetX(0); setArtOffsetY(0); }} style={{ padding: "5px 0", borderRadius: 6, border: "none", background: "rgba(255,255,255,0.07)", color: "#aaa", cursor: "pointer", fontSize: 11 }}>
                Réinitialiser
              </button>
            </div>
          </div>
        )}

        <div><p style={lbl}>Type(s) du personnage</p><EnergyPicker selected={card.characterTypes} onToggle={toggleType} /></div>

        {([0, 1] as const).map((i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={lbl}>Attaque {i + 1}</p>
            <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
              <input value={card.attacks[i].name} onChange={(e) => updateAttack(i, { name: e.target.value })} placeholder="Nom de l'attaque" style={{ ...inp, flex: 1 }} />
              <input value={card.attacks[i].damage} onChange={(e) => updateAttack(i, { damage: e.target.value })} placeholder="120" style={{ ...inp, width: 52, textAlign: "center" }} />
            </div>
            <p style={{ ...lbl, margin: "0 0 5px" }}>Coût en énergie</p>
            <EnergyPicker selected={card.attacks[i].cost} onToggle={(t) => toggleAttackCost(i, t)} />
          </div>
        ))}

        {/* ── Faiblesses ── */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={lbl}>Faiblesses</p>
          {card.weaknesses.map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <TypeBadge type={w.type} size={18} />
              <span style={{ flex: 1, fontSize: 11, color: "#ccc" }}>{w.type}</span>
              <span style={{ fontSize: 11, color: "#f9a825", fontWeight: 700, minWidth: 28 }}>{w.mult}</span>
              <button onClick={() => removeWeakness(i)} style={{ background: "rgba(255,50,50,0.15)", border: "none", borderRadius: 4, color: "#ff6b6b", fontSize: 13, cursor: "pointer", padding: "1px 6px", lineHeight: 1.4 }}>×</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
            <select value={draftW.type} onChange={(e) => setDraftW((d) => ({ ...d, type: e.target.value }))} style={{ ...sel, flex: 1, fontSize: 11 }}>
              <option value="">Type...</option>
              <optgroup label="Énergie">{Object.keys(ENERGY).map((t) => <option key={t} value={t}>{t}</option>)}</optgroup>
              <optgroup label="Sexe"><option value="♂ Masculin">♂ Masculin</option><option value="♀ Féminin">♀ Féminin</option></optgroup>
              <optgroup label="Race"><option value="BLANC">Blanc</option><option value="NOIR">Noir</option><option value="MEXICAIN">Mexicain</option><option value="ZOULOU">Zoulou</option></optgroup>
            </select>
            <input value={draftW.mult} onChange={(e) => setDraftW((d) => ({ ...d, mult: e.target.value }))} placeholder="×2" style={{ ...inp, width: 44, textAlign: "center", fontSize: 11 }} />
            <button onClick={addWeakness} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "rgba(124,58,237,0.4)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>+</button>
          </div>
        </div>

        {/* ── Résistances ── */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={lbl}>Résistances</p>
          {card.resistances.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <TypeBadge type={r.type} size={18} />
              <span style={{ flex: 1, fontSize: 11, color: "#ccc" }}>{r.type}</span>
              <span style={{ fontSize: 11, color: "#4fc3f7", fontWeight: 700, minWidth: 28 }}>{r.val}</span>
              <button onClick={() => removeResistance(i)} style={{ background: "rgba(255,50,50,0.15)", border: "none", borderRadius: 4, color: "#ff6b6b", fontSize: 13, cursor: "pointer", padding: "1px 6px", lineHeight: 1.4 }}>×</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
            <select value={draftR.type} onChange={(e) => setDraftR((d) => ({ ...d, type: e.target.value }))} style={{ ...sel, flex: 1, fontSize: 11 }}>
              <option value="">Type...</option>
              <optgroup label="Énergie">{Object.keys(ENERGY).map((t) => <option key={t} value={t}>{t}</option>)}</optgroup>
              <optgroup label="Sexe"><option value="♂ Masculin">♂ Masculin</option><option value="♀ Féminin">♀ Féminin</option></optgroup>
              <optgroup label="Race"><option value="BLANC">Blanc</option><option value="NOIR">Noir</option><option value="MEXICAIN">Mexicain</option><option value="ZOULOU">Zoulou</option></optgroup>
            </select>
            <input value={draftR.val} onChange={(e) => setDraftR((d) => ({ ...d, val: e.target.value }))} placeholder="-30" style={{ ...inp, width: 44, textAlign: "center", fontSize: 11 }} />
            <button onClick={addResistance} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "rgba(124,58,237,0.4)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>+</button>
          </div>
        </div>

        <div><p style={lbl}>Collection &amp; Numéro</p>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input value={card.collection} onChange={(e) => set({ collection: e.target.value })} style={{ ...inp, flex: 1 }} />
            <input value={card.cardNumber} onChange={(e) => set({ cardNumber: e.target.value })} maxLength={3} placeholder="001" style={{ ...inp, width: 42, textAlign: "center" }} />
            <span style={{ color: "#555", fontSize: 12 }}>/</span>
            <input value={card.totalCards} onChange={(e) => set({ totalCards: e.target.value })} maxLength={3} placeholder="019" style={{ ...inp, width: 42, textAlign: "center" }} />
          </div>
        </div>

        <button onClick={exportPng} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontWeight: 700, fontSize: 14, marginTop: 4 }}>
          <Download size={15} /> Exporter PNG
        </button>
      </aside>

      {/* ── Aperçu ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at center,rgba(124,58,237,0.06) 0%,transparent 65%)" }}>
        <CardPreview card={card} cardRef={cardRef} artScale={artScale} artOffsetX={artOffsetX} artOffsetY={artOffsetY} />
      </div>
    </div>
  );
}
