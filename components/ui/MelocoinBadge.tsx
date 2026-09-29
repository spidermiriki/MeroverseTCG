"use client";

import { Coins } from "lucide-react";
import { formatMelocoins } from "@/lib/utils";

export function MelocoinBadge({ amount }: { amount: number }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: "rgba(245,158,11,0.12)",
        border: "1px solid rgba(245,158,11,0.3)",
        boxShadow: "0 0 12px rgba(245,158,11,0.15)",
      }}
    >
      <Coins size={13} style={{ color: "#fbbf24" }} />
      <span className="text-sm font-bold" style={{ color: "#fbbf24" }}>
        {formatMelocoins(amount)}
      </span>
    </div>
  );
}
