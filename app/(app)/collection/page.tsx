"use client";

import Link from "next/link";
import { COLLECTION_LABELS } from "@/lib/pack-odds";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChevronRight, Layers } from "lucide-react";

const COLLECTIONS = ["BLACK_VS_WHITE"] as const;

export default function CollectionPage() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Collections" subtitle="Toutes les séries de cartes" />

      <div className="px-4 py-4 space-y-3">
        {COLLECTIONS.map((col) => (
          <Link key={col} href={`/collection/${col}`}>
            <div
              className="flex items-center justify-between p-4 rounded-2xl transition-all active:scale-98"
              style={{
                background: "rgba(10,12,30,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(109,40,217,0.3)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(109,40,217,0.3), rgba(29,78,216,0.2))",
                    border: "1px solid rgba(109,40,217,0.4)",
                  }}
                >
                  <Layers size={18} style={{ color: "#c084fc" }} />
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{
                      background: "linear-gradient(135deg, #e2e8f9, #c084fc)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {COLLECTION_LABELS[col] ?? col}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    Arc 1 du Meroverse
                  </p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: "rgba(192,132,252,0.5)" }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
