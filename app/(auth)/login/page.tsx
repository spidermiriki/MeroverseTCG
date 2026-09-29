"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { SpaceBackground } from "@/components/SpaceBackground";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "register") {
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
    }

    const result = await signIn("credentials", {
      login: mode === "login" ? form.username : form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Identifiants incorrects.");
      setLoading(false);
      return;
    }

    router.push("/home");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Space background */}
      <SpaceBackground />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* Logo */}
        <div className="mb-8 text-center">
          {/* Cosmic emblem */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div
              className="absolute w-24 h-24 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(109,40,217,0.6), transparent 70%)" }}
            />
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center border"
              style={{
                background: "rgba(10,12,30,0.8)",
                borderColor: "rgba(109,40,217,0.6)",
                boxShadow: "0 0 24px rgba(109,40,217,0.5), inset 0 0 20px rgba(109,40,217,0.1)",
              }}
            >
              <Sparkles size={28} style={{ color: "#c084fc" }} />
            </div>
          </div>

          <h1
            className="text-5xl font-black tracking-wider"
            style={{
              background: "linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              letterSpacing: "0.12em",
            }}
          >
            MEROVERSE
          </h1>
          <p
            className="text-xs tracking-widest mt-1 uppercase font-semibold"
            style={{ color: "var(--color-text-muted)", letterSpacing: "0.3em" }}
          >
            Trading Card Game
          </p>
        </div>

        {/* Card */}
        <div
          className="w-full rounded-2xl p-6"
          style={{
            background: "rgba(10,12,30,0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(109,40,217,0.35)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(109,40,217,0.1) inset",
          }}
        >
          {/* Tabs */}
          <div
            className="flex rounded-xl mb-6 overflow-hidden p-1 gap-1"
            style={{ background: "rgba(109,40,217,0.1)" }}
          >
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 text-sm font-semibold transition-all rounded-lg"
                style={{
                  background: mode === m
                    ? "linear-gradient(135deg, #6d28d9, #1d4ed8)"
                    : "transparent",
                  color: mode === m ? "#fff" : "var(--color-text-muted)",
                  boxShadow: mode === m ? "0 2px 12px rgba(109,40,217,0.4)" : "none",
                }}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block tracking-wide uppercase" style={{ color: "var(--color-text-muted)" }}>
                {mode === "login" ? "Identifiant" : "Nom d'utilisateur"}
              </label>
              <input
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(109,40,217,0.08)",
                  border: "1px solid rgba(109,40,217,0.25)",
                  color: "var(--color-text)",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(109,40,217,0.7)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(109,40,217,0.25)"}
                placeholder={mode === "login" ? "gary ou gary@example.com" : "ton_pseudo"}
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="text-xs font-semibold mb-1.5 block tracking-wide uppercase" style={{ color: "var(--color-text-muted)" }}>
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(109,40,217,0.08)",
                    border: "1px solid rgba(109,40,217,0.25)",
                    color: "var(--color-text)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(109,40,217,0.7)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(109,40,217,0.25)"}
                  placeholder="ton@email.com"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold mb-1.5 block tracking-wide uppercase" style={{ color: "var(--color-text-muted)" }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(109,40,217,0.08)",
                    border: "1px solid rgba(109,40,217,0.25)",
                    color: "var(--color-text)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(109,40,217,0.7)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(109,40,217,0.25)"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="text-xs text-center px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 active:scale-97"
              style={{
                background: "linear-gradient(135deg, #6d28d9 0%, #1d4ed8 100%)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(109,40,217,0.5)",
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "login" ? "Entrer dans le Meroverse" : "Rejoindre le Meroverse"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
