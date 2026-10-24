"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LayoutGrid, Home, Users, ArrowLeftRight } from "lucide-react";

const NAV_ITEMS = [
  { href: "/shop",       icon: ShoppingBag,   label: "Boutique"     },
  { href: "/collection", icon: LayoutGrid,     label: "Collection"   },
  { href: "/home",       icon: Home,           label: "Accueil"      },
  { href: "/group",      icon: Users,          label: "Groupe insta" },
  { href: "/exchange",   icon: ArrowLeftRight, label: "Échange"      },
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
          background: "var(--color-tab-bar)",
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(7px)",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "0 -10px 15px 0 rgba(0,0,0,0.5)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        {/* Le bouton surélevé suit l'onglet actif — align-end pour que les items
            s'alignent sur la ligne de base de la barre, l'actif débordant vers le haut */}
        <div className="flex items-end justify-around max-w-lg mx-auto px-3 pt-3 pb-1.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname.startsWith(href);

            if (isActive) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-[5px] flex-1 -translate-y-3"
                >
                  <div
                    style={{
                      background: "var(--color-accent)",
                      boxShadow: "0 8px 18px rgb(var(--accent) / 0.40)",
                      border: "4px solid #0e1a20",
                    }}
                    className="flex items-center justify-center rounded-[28px] size-14"
                  >
                    <Icon size={24} strokeWidth={2} color="#fff" />
                  </div>
                  <span
                    className="text-[10.5px] font-bold font-inter leading-none"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-[5px] flex-1 pb-1"
              >
                <div className="flex items-center justify-center h-8 w-10">
                  <Icon size={22} strokeWidth={1.8} color="var(--color-muted)" />
                </div>
                <span
                  className="text-[10.5px] font-medium font-inter leading-none"
                  style={{ color: "var(--color-muted)" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Indicateur bas (home indicator iOS) */}
        <div className="flex justify-center pb-1.5">
          <div
            className="h-[5px] w-[134px] rounded-full"
            style={{ background: "var(--color-text)" }}
          />
        </div>
      </div>
    </nav>
  );
}
