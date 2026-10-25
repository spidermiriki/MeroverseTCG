"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { SpaceBackground } from "@/components/SpaceBackground";
import { MeroverseAvatar } from "@/components/brand/MeroverseAvatar";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ login: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      login: form.login,
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
    <div className="relative min-h-screen bg-mv-bg overflow-hidden flex flex-col">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col items-center pt-[92px] px-6 pb-10">
        {/* Avatar */}
        <MeroverseAvatar size="lg" />

        {/* Titre MEROVERSE */}
        <h1
          className="font-unbounded font-bold text-[34px] tracking-[-0.34px] text-center mt-6"
          style={{ textShadow: "0px 0px 24px rgba(249,35,47,0.35)" }}
        >
          <span className="text-mv-text">MERO</span>
          <span className="text-mv-accent">VERSE</span>
        </h1>

        {/* Accroche */}
        <h2 className="font-unbounded font-bold text-[20px] text-mv-text w-full max-w-[382px] mt-10">
          Content de te revoir
        </h2>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[382px] flex flex-col gap-[14px] mt-[14px]"
        >
          {/* Pseudo ou e-mail */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold font-inter text-mv-muted">
              Pseudo ou e-mail
            </label>
            <div className="flex items-center gap-[10px] p-[14px] rounded-[14px] border border-mv-border bg-mv-surface">
              <User size={17} className="text-mv-muted shrink-0" />
              <input
                type="text"
                autoComplete="username"
                required
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                placeholder="Homelo"
                className="flex-1 bg-transparent text-[14px] font-semibold font-inter text-mv-text outline-none placeholder:text-mv-muted/50"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold font-inter text-mv-muted">
              Mot de passe
            </label>
            <div className="flex items-center gap-[10px] p-[14px] rounded-[14px] border border-mv-border bg-mv-surface">
              <Lock size={17} className="text-mv-muted shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Ton mot de passe"
                className="flex-1 bg-transparent text-[14px] font-inter text-mv-muted/80 outline-none placeholder:text-mv-muted/50"
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
          </div>

          {/* Mot de passe oublié */}
          <div className="flex justify-end -mt-2">
            <Link
              href="/forgot-password"
              className="text-[12px] font-semibold font-inter text-mv-accent"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-[12px] font-inter text-red-400 text-center">
              {error}
            </p>
          )}

          {/* Bouton connexion */}
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
                Se connecter
                <ArrowRight size={17} />
              </>
            )}
          </button>

          {/* Lien inscription */}
          <div className="flex items-center justify-center gap-[5px] text-[12px] font-inter">
            <span className="text-mv-muted">Pas encore de compte ?</span>
            <Link href="/register" className="font-bold text-mv-accent">
              {"S'inscrire"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
