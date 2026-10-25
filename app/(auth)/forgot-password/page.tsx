"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { SpaceBackground } from "@/components/SpaceBackground";
import { MeroverseAvatar } from "@/components/brand/MeroverseAvatar";

function PageHeader() {
  return (
    <div className="flex flex-col items-center">
      <MeroverseAvatar size="lg" />
      <h1
        className="font-unbounded font-bold text-[34px] tracking-[-0.34px] text-center mt-6"
        style={{ textShadow: "0px 0px 24px rgba(249,35,47,0.35)" }}
      >
        <span className="text-mv-text">MERO</span>
        <span className="text-mv-accent">VERSE</span>
      </h1>
    </div>
  );
}

// 4a — Saisie de l'e-mail
function StepEmail({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: envoyer le lien de réinitialisation par e-mail
    console.log("TODO: send reset email to", email);
    setTimeout(() => {
      setLoading(false);
      onNext(email);
    }, 800);
  };

  return (
    <div className="w-full max-w-[382px]">
      <h2 className="font-unbounded font-bold text-[20px] text-mv-text mt-10 mb-2">
        Mot de passe oublié ?
      </h2>
      <p className="text-[13px] font-inter text-mv-muted mb-6 leading-relaxed">
        {"Pas de panique. Entre l'e-mail de ton compte, on t'envoie un lien pour en choisir un nouveau."}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[11px] font-semibold font-inter text-mv-muted">
            Adresse e-mail
          </label>
          <div className="flex items-center gap-[10px] p-[14px] rounded-[14px] border border-mv-border bg-mv-surface">
            <Mail size={17} className="text-mv-muted shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="flex-1 bg-transparent text-[14px] font-semibold font-inter text-mv-text outline-none placeholder:text-mv-muted/50"
            />
          </div>
        </div>

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
              Envoyer le lien
              <ArrowRight size={17} />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-[5px] text-[12px] font-inter">
          <span className="text-mv-muted">{"Tu t'en souviens ?"}</span>
          <Link href="/login" className="font-bold text-mv-accent">
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}

// 4b — Lien envoyé
function StepSent({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 0) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const maskedEmail = email.replace(
    /^(.{1})(.+?)(@.+)$/,
    (_match: string, first: string, mid: string, domain: string) =>
      first + "•".repeat(Math.min(mid.length, 3)) + domain
  );

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const countdownStr = `${mins}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="w-full max-w-[382px]">
      <h2 className="font-unbounded font-bold text-[20px] text-mv-text mt-10 mb-2">
        Lien envoyé !
      </h2>
      <p className="text-[13px] font-inter text-mv-muted mb-6 leading-relaxed">
        Regarde dans ta boîte mail (et tes spams tsais bien).
      </p>
      <div className="flex flex-col gap-[14px]">
        {/* Carte de confirmation */}
        <div
          className="flex flex-col items-center gap-[10px] px-[18px] py-[22px] rounded-[20px] border"
          style={{
            background: "rgba(18,33,41,0.78)",
            borderColor: "rgba(109,220,253,0.35)",
          }}
        >
          <div
            className="w-[64px] h-[64px] rounded-[32px] flex items-center justify-center border"
            style={{
              background: "rgba(109,220,253,0.12)",
              borderColor: "rgba(109,220,253,0.6)",
              boxShadow: "0 0 24px rgba(109,220,253,0.45)",
            }}
          >
            <Mail size={28} style={{ color: "rgba(109,220,253,0.9)" }} />
          </div>
          <p className="text-[14px] font-semibold font-inter text-mv-text">
            Envoyé à {maskedEmail}
          </p>
          <p className="text-[12px] font-inter text-mv-muted">
            Le lien est valable 30 minutes.
          </p>
        </div>

        {/* Bouton ouvrir la boîte mail — TODO */}
        <button
          type="button"
          onClick={() => {
            // TODO: ouvrir le client mail
            console.log("TODO: open mail client");
          }}
          className="w-full py-[17px] rounded-[18px] flex items-center justify-center gap-[10px] font-unbounded font-semibold text-[14px] text-white"
          style={{
            background: "linear-gradient(to right, #ea4316, #f9232f)",
            boxShadow: "0px 10px 12px rgba(234,67,22,0.45)",
          }}
        >
          Ouvrir ma boîte mail
          <ArrowRight size={17} />
        </button>

        {/* Compte à rebours */}
        <div className="flex items-center justify-center gap-[6px]">
          <RefreshCw size={13} className="text-mv-muted" />
          <span className="text-[12px] font-semibold font-inter text-mv-muted">
            {countdown > 0
              ? `Renvoyer le lien dans ${countdownStr}`
              : "Renvoyer le lien"}
          </span>
        </div>

        {/* Modifier l'adresse */}
        <div className="flex items-center justify-center gap-[5px] text-[12px] font-inter">
          <span className="text-mv-muted">Mauvaise adresse ?</span>
          <button
            type="button"
            onClick={onBack}
            className="font-bold text-mv-accent"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}

// 4c — Nouveau mot de passe (TODO: système de token non implémenté)
function StepNewPassword() {
  return (
    <div className="w-full max-w-[382px]">
      <h2 className="font-unbounded font-bold text-[20px] text-mv-text mt-10 mb-2">
        Nouveau mot de passe
      </h2>

      <div
        className="flex flex-col gap-[12px] px-[18px] py-[22px] rounded-[20px] border mt-6"
        style={{
          background: "rgba(18,33,41,0.78)",
          borderColor: "rgba(143,169,181,0.25)",
        }}
      >
        <p className="text-[14px] font-semibold font-inter text-mv-text leading-snug">
          La réinitialisation arrive bientôt.
        </p>
        <p className="text-[13px] font-inter text-mv-muted leading-relaxed">
          En attendant, demande à Homero de réinitialiser ton mot de passe.
        </p>
      </div>

      <Link
        href="/login"
        className="mt-6 w-full py-[17px] rounded-[18px] flex items-center justify-center gap-[10px] font-unbounded font-semibold text-[14px] text-white"
        style={{
          background: "linear-gradient(to right, #ea4316, #f9232f)",
          boxShadow: "0px 10px 12px rgba(234,67,22,0.45)",
        }}
      >
        Retour à la connexion
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}

type Step = "email" | "sent" | "new-password";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  return (
    <div className="relative min-h-screen bg-mv-bg overflow-hidden flex flex-col">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col items-center pt-[92px] px-6 pb-10">
        <PageHeader />

        {step === "email" && (
          <StepEmail
            onNext={(e) => {
              setEmail(e);
              setStep("sent");
            }}
          />
        )}
        {step === "sent" && (
          <StepSent email={email} onBack={() => setStep("email")} />
        )}
        {step === "new-password" && <StepNewPassword />}
      </div>
    </div>
  );
}
