"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    const applyTheme = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/user");
        const user = await res.json();
        if (user?.theme) {
          document.documentElement.setAttribute("data-theme", user.theme);
          localStorage.setItem("meroverse-theme", user.theme);
        }
      } catch {
        // fallback to localStorage
        const saved = localStorage.getItem("meroverse-theme");
        if (saved) document.documentElement.setAttribute("data-theme", saved);
      }
    };

    // Apply from localStorage first (instant)
    const saved = localStorage.getItem("meroverse-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    applyTheme();
  }, [session]);

  return <>{children}</>;
}
