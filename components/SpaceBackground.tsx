"use client";

import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

function generateStars(count: number): Star[] {
  // Use deterministic pseudo-random to avoid hydration mismatch
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 2654435761;
    stars.push({
      id: i,
      x: ((seed * 1234567) % 10000) / 100,
      y: ((seed * 7654321) % 10000) / 100,
      size: (((seed * 9999991) % 100) / 100) * 2.5 + 0.5,
      duration: (((seed * 1111111) % 100) / 100) * 4 + 2,
      delay: (((seed * 3333333) % 100) / 100) * 5,
    });
  }
  return stars;
}

function generateShootingStars(count: number): ShootingStar[] {
  const stars: ShootingStar[] = [];
  for (let i = 0; i < count; i++) {
    const seed = (i + 500) * 2654435761;
    stars.push({
      id: i,
      x: ((seed * 1234567) % 8000) / 100,
      y: ((seed * 7654321) % 4000) / 100,
      duration: (((seed * 9999991) % 100) / 100) * 1.5 + 0.8,
      delay: (((seed * 1111111) % 100) / 100) * 20 + 3,
    });
  }
  return stars;
}

export function SpaceBackground() {
  const stars = useMemo(() => generateStars(120), []);
  const shootingStars = useMemo(() => generateShootingStars(5), []);

  return (
    <div className="space-bg" aria-hidden="true">
      {/* Static stars */}
      <div className="stars-layer">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              "--twinkle-duration": `${star.duration}s`,
              "--twinkle-delay": `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Shooting stars */}
      <div className="stars-layer">
        {shootingStars.map((s) => (
          <div
            key={s.id}
            className="shooting-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              "--shoot-duration": `${s.duration}s`,
              "--shoot-delay": `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Planet silhouette - decorative */}
      <div
        style={{
          position: "absolute",
          bottom: "-15vw",
          right: "-10vw",
          width: "40vw",
          height: "40vw",
          maxWidth: 300,
          maxHeight: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(109,40,217,0.12), rgba(29,78,216,0.06) 60%, transparent 80%)",
          border: "1px solid rgba(109,40,217,0.1)",
          pointerEvents: "none",
        }}
      />

      {/* Second planet - top left */}
      <div
        style={{
          position: "absolute",
          top: "-8vw",
          left: "-8vw",
          width: "25vw",
          height: "25vw",
          maxWidth: 180,
          maxHeight: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle at 60% 40%, rgba(236,72,153,0.08), rgba(109,40,217,0.05) 60%, transparent 80%)",
          border: "1px solid rgba(236,72,153,0.08)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
