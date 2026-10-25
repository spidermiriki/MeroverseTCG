"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Gift,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { SpaceBackground } from "@/components/SpaceBackground";
import { MeroverseAvatar } from "@/components/brand/MeroverseAvatar";

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=]/.test(password)) score++;
  return score;
}

const SEGMENT_COLORS = ["#f9232f", "#ea4316", "#ffc83d", "#22394a"];
const STRENGTH_LABELS = ["", "Faible", "Correct", "Bien", "Fort"];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      setError("Tu dois accepter les règles du Meroverse.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      login: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      router.push("/login");
      return;
    }

    router.push("/home");
  };

  return (
    <div className="relative min-h-screen bg-mv-bg overflow-hidden flex flex-col">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col items-center pt-[68px] px-6 pb-10">
        {/* Avatar */}
        <MeroverseAvatar size="md" />

        {/* Titre MEROVERSE */}
        <h1
          className="font-unbounded font-bold text-[30px] tracking-[-0.3px] text-center mt-4"
          style={{ textShadow: "0px 0px 24px rgba(249,35,47,0.35)" }}
        >
          <span className="text-mv-text">MERO</span>
          <span className="text-mv-accent">VERSE</span>
        </h1>

        {/* Accroche */}
        <div className="w-full max-w-[382px] mt-6">
          <h2 className="font-unbounded font-bold text-[20px] text-mv-text mb-1">
            Crée ton compte
          </h2>
          <p className="text-[12px] font-inter text-mv-muted">
            Rejoins la bande et ouvre ton premier booster.
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[382px] flex flex-col gap-[14px] mt-[14px]"
        >
          {/* Pseudo */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold font-inter text-mv-muted">
              Pseudo
            </label>
            <div className="flex items-center gap-[10px] p-[14px] rounded-[14px] border border-mv-border bg-mv-surface">
              <User size={17} className="text-mv-muted shrink-0" />
              <input
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                placeholder="ton_pseudo"
                className="flex-1 bg-transparent text-[14px] font-semibold font-inter text-mv-text outline-none placeholder:text-mv-muted/50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold font-inter text-mv-muted">
              Adresse e-mail
            </label>
            <div className="flex items-center gap-[10px] p-[14px] rounded-[14px] border border-mv-border bg-mv-surface">
              <Mail size={17} className="text-mv-muted shrink-0" />
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ton@email.com"
                className="flex-1 bg-transparent text-[14px] font-semibold font-inter text-mv-text outline-none placeholder:text-mv-muted/50"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold font-inter text-mv-muted">
              Mot de passe
            </label>
            <div
              className="flex items-center gap-[10px] p-[14px] rounded-[14px] bg-mv-surface"
              style={{
                border: form.password
                  ? "1.5px solid rgba(234,67,22,0.8)"
                  : "1px solid #22394a",
              }}
            >
              <Lock size={17} className="text-mv-muted shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                className="flex-1 bg-transparent text-[14px] font-semibold font-inter text-mv-text outline-none placeholder:text-mv-muted/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-mv-muted shrink-0"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Indicateur force */}
            {form.password && (
              <div className="flex items-center gap-[6px]">
                {SEGMENT_COLORS.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-[4px] rounded-[2px]"
                    style={{
                      background: i < strength ? color : "#22394a",
                    }}
                  />
                ))}
                <span
                  className="text-[10px] font-semibold font-inter shrink-0"
                  style={{
                    color: strength > 0 ? SEGMENT_COLORS[strength - 1] : "#22394a",
                  }}
                >
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Conditions */}
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={() => setAccepted(!accepted)}
              className="w-[20px] h-[20px] rounded-[6px] shrink-0 flex items-center justify-center transition-colors"
              style={{
                background: accepted ? "var(--color-accent)" : "#22394a",
              }}
              aria-pressed={accepted}
              aria-label="Accepter les règles"
            >
              {accepted && <Check size={12} color="white" strokeWidth={3} />}
            </button>
            <span className="text-[12px] font-inter text-mv-muted">
              {"J'accepte les règles du Meroverse"}
            </span>
          </div>

          {/* Cadeau de bienvenue */}
          <div
            className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[14px] border"
            style={{
              background: "rgba(255,200,61,0.1)",
              borderColor: "rgba(255,200,61,0.45)",
            }}
          >
            <Gift size={17} style={{ color: "#ffc83d" }} className="shrink-0" />
            <span
              className="text-[12px] font-semibold font-inter"
              style={{ color: "#ffc83d" }}
            >
              {"Un booster offert à l'inscription"}
            </span>
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-[12px] font-inter text-red-400 text-center">
              {error}
            </p>
          )}

          {/* Bouton créer */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[17px] rounded-[18px] flex items-center justify-center gap-[10px] font-unbounded font-semibold text-[14px] text-white disabled:opacity-60"
            style={{
              background: "linear-gradient(to right, #ea4316, #f9232f)",
              boxShadow: "0px 10px 12px rgba(234,67,22,0.45)",
            }}
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <>
                Créer mon compte
                <ArrowRight size={17} />
              </>
            )}
          </button>

          {/* Lien connexion */}
          <div className="flex items-center justify-center gap-[5px] text-[12px] font-inter">
            <span className="text-mv-muted">Déjà un compte ?</span>
            <Link href="/login" className="font-bold text-mv-accent">
                Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
