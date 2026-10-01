"use client";

import { PackVisual } from "@/components/packs/PackVisual";

export default function TestPackPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #02020a 0%, #06020f 50%, #03020d 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: 32,
      }}
    >
      <p style={{ color: "rgba(192,132,252,0.5)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Prévisualisation du booster
      </p>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <PackVisual imageUrl="/packs/test.jpg" name="Booster" width={110} />
          <span style={{ color: "rgba(192,132,252,0.4)", fontSize: 11 }}>110px</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <PackVisual imageUrl="/packs/test.jpg" name="Booster" width={148} />
          <span style={{ color: "rgba(192,132,252,0.4)", fontSize: 11 }}>148px (app)</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <PackVisual imageUrl="/packs/test.jpg" name="Booster" width={200} />
          <span style={{ color: "rgba(192,132,252,0.4)", fontSize: 11 }}>200px</span>
        </div>
      </div>

      <p style={{ color: "rgba(109,40,217,0.4)", fontSize: 11 }}>
        Passe la souris pour voir l&apos;effet shimmer · Texte à mettre directement dans l&apos;image
      </p>
    </div>
  );
}
