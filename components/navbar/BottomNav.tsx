"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageOpen, LayoutGrid, ArrowLeftRight, ShoppingBag, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", icon: PackageOpen, label: "Boosters" },
  { href: "/collection", icon: LayoutGrid, label: "Collection" },
  { href: "/exchange", icon: ArrowLeftRight, label: "Échange" },
  { href: "/shop", icon: ShoppingBag, label: "Boutique" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        style={{
          background: "rgba(5, 5, 20, 0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid rgba(109,40,217,0.25)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition-all"
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, #c084fc, transparent)",
                      boxShadow: "0 0 8px rgba(192,132,252,0.8)",
                    }}
                  />
                )}
                <div
                  style={{
                    color: isActive ? "#c084fc" : "rgba(123,138,173,0.7)",
                    filter: isActive ? "drop-shadow(0 0 6px rgba(192,132,252,0.6))" : "none",
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span
                  className="text-[10px] font-medium leading-none"
                  style={{ color: isActive ? "#c084fc" : "rgba(123,138,173,0.6)" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
