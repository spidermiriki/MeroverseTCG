"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { LogOut, Volume2, VolumeX, Palette, User, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const THEMES = [
  { id: "dark",   label: "Cosmos",  bg: "#02020a", accent: "#6d28d9", desc: "Espace profond" },
  { id: "violet", label: "Nébula",  bg: "#06020f", accent: "#a855f7", desc: "Nébuleuse violette" },
  { id: "gold",   label: "Solaire", bg: "#050300", accent: "#d97706", desc: "Étoile dorée" },
  { id: "light",  label: "Lunaire", bg: "#f0f4ff", accent: "#6d28d9", desc: "Lumière froide" },
];

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(10,12,30,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(109,40,217,0.25)",
      }}
    >
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("meroverse-theme");
    if (saved) setCurrentTheme(saved);

    fetch("/api/user").then(r => r.json()).then(u => {
      if (u?.theme) setCurrentTheme(u.theme);
      if (u?.soundEnabled !== undefined) setSoundEnabled(u.soundEnabled);
    });
  }, []);

  const applyTheme = (id: string) => {
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("meroverse-theme", id);
    setCurrentTheme(id);
  };

  const save = async () => {
    setSaving(true);
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: currentTheme, soundEnabled }),
    });
    setSuccess("Paramètres sauvegardés ✦");
    setTimeout(() => setSuccess(""), 2500);
    setSaving(false);
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Paramètres" />

      <div className="px-4 py-4 space-y-5">
        {success && (
          <div
            className="px-4 py-3 rounded-xl text-sm text-center font-semibold"
            style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            {success}
          </div>
        )}

        {/* Account */}
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <User size={13} style={{ color: "var(--color-text-muted)" }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Compte</p>
          </div>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(109,40,217,0.4), rgba(29,78,216,0.3))",
                  border: "1px solid rgba(109,40,217,0.5)",
                }}
              >
                <Sparkles size={16} style={{ color: "#c084fc" }} />
              </div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text)" }}>{session?.user?.name}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{session?.user?.email}</p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Themes */}
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Palette size={13} style={{ color: "var(--color-text-muted)" }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Thème cosmique</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme.id)}
                  className="relative rounded-2xl p-4 flex flex-col gap-2 transition-all text-left overflow-hidden"
                  style={{
                    background: theme.bg,
                    border: `2px solid ${isSelected ? theme.accent : "rgba(109,40,217,0.15)"}`,
                    boxShadow: isSelected ? `0 0 16px ${theme.accent}44` : "none",
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: theme.accent, color: "#fff" }}
                    >
                      ✓
                    </div>
                  )}
                  <div className="w-7 h-7 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 10px ${theme.accent}66` }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: theme.id === "light" ? "#0f172a" : "#e2e8f9" }}>
                      {theme.label}
                    </p>
                    <p className="text-xs" style={{ color: theme.id === "light" ? "#475569" : "#7b8aad" }}>
                      {theme.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sound */}
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Volume2 size={13} style={{ color: "var(--color-text-muted)" }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Audio</p>
          </div>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled
                  ? <Volume2 size={20} style={{ color: "#c084fc" }} />
                  : <VolumeX size={20} style={{ color: "var(--color-text-muted)" }} />
                }
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>Sons du jeu</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {soundEnabled ? "Activés" : "Désactivés"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-12 h-6 rounded-full relative transition-all"
                style={{ background: soundEnabled ? "linear-gradient(135deg, #6d28d9, #1d4ed8)" : "rgba(109,40,217,0.15)" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
                  style={{ left: soundEnabled ? "calc(100% - 22px)" : "2px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                />
              </button>
            </div>
          </GlassCard>
        </section>

        {/* Save */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-97"
          style={{
            background: "linear-gradient(135deg, #6d28d9, #1d4ed8)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(109,40,217,0.4)",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Sauvegarde..." : "Sauvegarder ✦"}
        </button>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-97"
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <LogOut size={15} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
