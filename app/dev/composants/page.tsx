"use client";

import { useState } from "react";
import { Home, Star, Bell } from "lucide-react";
import {
  Button,
  Pill,
  Chip,
  SegmentedControl,
  Toggle,
  SectionLabel,
  Avatar,
  Overlay,
  Popup,
  BottomSheet,
  EmptyState,
  CardFrame,
  RARITY_COLOR,
  RARITY_LABEL,
} from "@/components/ui";
import type { Rarity } from "@/components/ui";
import { ThemeProvider, type Theme } from "@/components/theme-provider";

const THEMES: { value: Theme; label: string }[] = [
  { value: "black-vs-white", label: "Black vs White" },
  { value: "classique",      label: "Classique" },
  { value: "gary",           label: "Gary" },
  { value: "ginsa",          label: "Ginsa" },
];

const RARITIES: Rarity[] = [
  "COMMUN", "RARE", "EPIQUE", "MYTHIQUE", "LEGENDAIRE", "CHROMATIQUE", "RAINBOW",
];

export default function ComposantsDevPage() {
  const [theme, setTheme] = useState<Theme>("black-vs-white");
  const [seg, setSeg] = useState("one");
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme={theme}>
      <div
        className="min-h-screen font-inter pb-8"
        style={{ background: "var(--color-background)", color: "var(--color-text)" }}
      >
        {/* Page title */}
        <div className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
          style={{ background: "var(--color-tab-bar)", borderBottom: "1px solid var(--color-border)" }}>
          <h1 className="text-base font-black font-unbounded text-gradient-accent">
            Dev · Composants
          </h1>
          <span className="text-xs font-inter" style={{ color: "var(--color-muted)" }}>
            admin only
          </span>
        </div>

        {/* Theme switcher */}
        <div className="px-4 pt-4 pb-2 flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTheme(t.value);
                document.documentElement.setAttribute("data-theme", t.value);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold font-inter transition-all"
              style={{
                background: theme === t.value ? "var(--color-accent)" : "var(--color-surface)",
                color: theme === t.value ? "#fff" : "var(--color-muted)",
                border: "1px solid var(--color-border)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── BUTTONS ── */}
        <SectionLabel>Buttons</SectionLabel>
        <div className="px-4 flex flex-wrap gap-3">
          <Button variant="accent" size="sm">Accent SM</Button>
          <Button variant="accent" size="md">Accent MD</Button>
          <Button variant="accent" size="lg">Accent LG</Button>
          <Button variant="ghost"  size="md">Ghost</Button>
          <Button variant="gold"   size="md">Gold</Button>
          <Button variant="accent" size="md" disabled>Disabled</Button>
        </div>

        {/* ── PILLS ── */}
        <SectionLabel>Pills</SectionLabel>
        <div className="px-4 flex flex-wrap gap-2">
          <Pill active>Actif</Pill>
          <Pill>Inactif</Pill>
          <Pill>Commun</Pill>
          <Pill>Rare</Pill>
        </div>

        {/* ── CHIPS ── */}
        <SectionLabel>Chips</SectionLabel>
        <div className="px-4 flex flex-wrap gap-2">
          <Chip color="accent">Accent</Chip>
          <Chip color="success">Success</Chip>
          <Chip color="danger">Danger</Chip>
          <Chip color="muted">Muted</Chip>
        </div>

        {/* ── SEGMENTED CONTROL ── */}
        <SectionLabel>Segmented Control</SectionLabel>
        <div className="px-4">
          <SegmentedControl
            options={[
              { label: "Un",   value: "one"   },
              { label: "Deux", value: "two"   },
              { label: "Trois", value: "three" },
            ]}
            value={seg}
            onChange={setSeg}
          />
        </div>

        {/* ── TOGGLE ── */}
        <SectionLabel>Toggle</SectionLabel>
        <div className="px-4 flex flex-col gap-3">
          <Toggle checked={toggle1} onChange={setToggle1} label="Son activé" />
          <Toggle checked={toggle2} onChange={setToggle2} label="Notifications" />
          <Toggle checked={true} onChange={() => {}} disabled label="Désactivé" />
        </div>

        {/* ── AVATARS ── */}
        <SectionLabel>Avatar</SectionLabel>
        <div className="px-4 flex items-end gap-3">
          <Avatar name="Gary" size="xs" />
          <Avatar name="Ginsa" size="sm" />
          <Avatar name="Meganou" size="md" />
          <Avatar name="Tunay" size="lg" />
          <Avatar src="/placeholder-avatar.png" name="Photo" size="md" />
        </div>

        {/* ── SECTION LABEL ── */}
        <SectionLabel right="Voir tout">Section avec action</SectionLabel>
        <div className="px-4">
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Contenu de la section…
          </p>
        </div>

        {/* ── OVERLAY / POPUP / BOTTOM SHEET ── */}
        <SectionLabel>Overlay · Popup · BottomSheet</SectionLabel>
        <div className="px-4 flex flex-wrap gap-3">
          <Button variant="ghost" size="sm" onClick={() => setPopupOpen(true)}>
            Ouvrir Popup
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSheetOpen(true)}>
            Ouvrir BottomSheet
          </Button>
        </div>

        <Popup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          title="Confirmation"
          footer={
            <>
              <Button variant="accent" size="md" onClick={() => setPopupOpen(false)}>
                Confirmer
              </Button>
              <Button variant="ghost" size="md" onClick={() => setPopupOpen(false)}>
                Annuler
              </Button>
            </>
          }
        >
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Es-tu sûr de vouloir effectuer cette action ?
          </p>
        </Popup>

        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Options"
        >
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="accent" size="md" onClick={() => setSheetOpen(false)}>
              Action principale
            </Button>
            <Button variant="ghost" size="md" onClick={() => setSheetOpen(false)}>
              Action secondaire
            </Button>
          </div>
        </BottomSheet>

        {/* ── EMPTY STATE ── */}
        <SectionLabel>Empty State</SectionLabel>
        <EmptyState
          icon={<Star size={24} />}
          title="Aucune carte"
          description="Tu n'as pas encore de cartes dans ta collection."
          action={<Button variant="accent" size="sm">Ouvrir un booster</Button>}
        />

        {/* ── CARD FRAMES ── */}
        <SectionLabel>Card Frames (toutes raretés)</SectionLabel>
        <div className="px-4 grid grid-cols-3 gap-3">
          {RARITIES.map((rarity) => (
            <CardFrame key={rarity} rarity={rarity} holo>
              <div
                className="aspect-[3/4] flex flex-col items-center justify-center gap-1 p-2"
                style={{ background: "var(--color-surface-2)" }}
              >
                <span
                  className="text-[10px] font-bold font-unbounded text-center leading-tight"
                  style={{ color: RARITY_COLOR[rarity] }}
                >
                  {RARITY_LABEL[rarity]}
                </span>
                <div
                  className="size-6 rounded-full"
                  style={{ background: RARITY_COLOR[rarity], opacity: 0.7 }}
                />
              </div>
            </CardFrame>
          ))}
        </div>

        <div className="h-8" />
      </div>
    </ThemeProvider>
  );
}
