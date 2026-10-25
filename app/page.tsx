"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MeroverseAvatar } from "@/components/brand/MeroverseAvatar";

export default function SplashPage() {
  const router = useRouter();
  const { status } = useSession();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Wait for session + minimum 1s, animate progress bar in parallel
  useEffect(() => {
    if (status === "loading") return;
    const minDelay = new Promise<void>((r) => setTimeout(r, 1000));
    minDelay.then(() => setReady(true));
  }, [status]);

  useEffect(() => {
    if (!ready) return;
    if (status === "authenticated") router.replace("/home");
    else router.replace("/login");
  }, [ready, status, router]);

  // Animate progress bar to ~90% during loading, complete when ready
  useEffect(() => {
    const start = Date.now();
    const target = ready ? 100 : 85;
    const duration = ready ? 200 : 1800;
    let rafId: number;

    const animate = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      setProgress(Math.round(target * t));
      if (t < 1) rafId = requestAnimationFrame(animate);
      else setProgress(target);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [ready]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(114.77deg, #1a2340 25%, #0d1426 52.5%, #2a0e12 75%)",
      }}
    >
      {/* Video du générique — fichier /brand/generique.mp4 à ajouter */}
      <video
        src="/brand/generique.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />

      {/* Spacer pour centrer la vidéo/fond */}
      <div className="flex-1" />

      {/* Gradient overlay bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[360px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(5,9,12,0.92) 70%, #05090c 100%)",
        }}
      />

      {/* Contenu bas */}
      <div className="relative z-10 flex flex-col items-center gap-4 pb-16 pt-4">
        <MeroverseAvatar size="sm" />

        <p className="text-[13px] font-semibold font-inter text-white/85">
          @meroverse
        </p>

        {/* Barre de chargement */}
        <div className="w-[200px] flex flex-col items-center gap-2">
          <div
            className="w-full h-[6px] rounded-full overflow-hidden"
            style={{ background: "#122129" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress * 2}px`,
                background: "linear-gradient(to right, #ea4316, #f9232f)",
                boxShadow: "0 0 8px rgba(234,67,22,0.8)",
                transition: "width 50ms linear",
              }}
            />
          </div>
          <p className="text-[11px] font-inter text-[#8fa9b5]">
            Chargement du Meroverse… {progress} %
          </p>
        </div>

        <p className="text-[10px] font-inter text-[#4d6878] mt-2">v0.1 bêta</p>
      </div>
    </div>
  );
}
