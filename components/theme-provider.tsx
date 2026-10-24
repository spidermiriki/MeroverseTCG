"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export type Theme = "black-vs-white" | "classique" | "gary" | "ginsa";

/** Thème de la collection en cours — valeur par défaut pour tous les joueurs */
export const COLLECTION_THEME: Theme = "black-vs-white";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: COLLECTION_THEME, setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Thème initial venant du serveur (évite le flash au premier rendu) */
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = COLLECTION_THEME }: ThemeProviderProps) {
  const { data: session } = useSession();
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Applique le thème immédiatement depuis localStorage (no-FOUC)
  useEffect(() => {
    const saved = localStorage.getItem("mv-theme") as Theme | null;
    const initial = saved ?? defaultTheme;
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronise avec la DB quand la session est disponible
  useEffect(() => {
    if (!session?.user?.id) return;

    fetch("/api/user")
      .then((r) => r.json())
      .then((user) => {
        if (user?.theme && user.theme !== theme) {
          const t = user.theme as Theme;
          setThemeState(t);
          document.documentElement.setAttribute("data-theme", t);
          localStorage.setItem("mv-theme", t);
        }
      })
      .catch(() => {/* localStorage déjà appliqué */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  function setTheme(t: Theme) {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("mv-theme", t);
    // Persist en DB (fire-and-forget)
    fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: t }),
    }).catch(() => {});
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
