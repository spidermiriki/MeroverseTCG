"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LayoutGrid, Home, Users, ArrowLeftRight } from "lucide-react";

const NAV_ITEMS = [
  { href: "/shop",       icon: ShoppingBag,    label: "Boutique",     center: false },
  { href: "/collection", icon: LayoutGrid,      label: "Collection",   center: false },
  { href: "/home",       icon: Home,            label: "Accueil",      center: true  },
  { href: "/group",      icon: Users,           label: "Groupe insta", center: false },
  { href: "/exchange",   icon: ArrowLeftRight,  label: "Échange",      center: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Barre principale */}
      <div
        style={{
          background: "rgba(14,26,32,0.88)",
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(7px)",
          borderTop: "1px solid #223944",
          boxShadow: "0 -10px 15px 0 rgba(0,0,0,0.5)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      >
        <div className="flex items-end justify-around max-w-lg mx-auto px-3 pt-2 pb-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label, center }) => {
            const isActive = pathname.startsWith(href);

            if (center) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-[5px] relative -translate-y-3"
                >
                  {/* Bouton rond surélevé */}
                  <div
                    style={{
                      background: "#ea4316",
                      boxShadow: "0 8px 18px rgba(234,67,22,0.35)",
                      border: "4px solid #0e1a20",
                    }}
                    className="flex items-center justify-center rounded-[28px] size-14"
                  >
                    <Icon
                      size={24}
                      strokeWidth={2}
                      color="#fff"
                    />
                  </div>
                  <span
                    className="text-[10.5px] font-bold font-inter leading-none"
                    style={{ color: "#ea4316" }}
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
                className="flex flex-col items-center gap-[5px] flex-1 pt-1.5 relative"
              >
                <div className="flex items-center justify-center h-8 w-10">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    style={{
                      color: isActive ? "#ea4316" : "#8fa9b5",
                      transition: "color 0.2s ease",
                    }}
                  />
                </div>
                <span
                  className="text-[10.5px] leading-none font-inter"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#ea4316" : "#8fa9b5",
                    transition: "color 0.2s ease",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Indicateur bas */}
        <div className="flex justify-center pb-1">
          <div className="h-[5px] w-[134px] rounded-full bg-mv-text" />
        </div>
      </div>
    </nav>
  );
}
