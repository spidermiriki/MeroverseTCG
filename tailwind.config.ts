import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fond & surfaces (fixes)
        "mv-bg":        "#0a1419",
        "mv-surface":   "rgba(18,33,41,0.78)",
        "mv-surface-2": "rgba(24,43,52,0.78)",
        "mv-tab-bar":   "rgba(14,26,32,0.88)",
        "mv-border":    "#223944",
        // Texte (fixes)
        "mv-text":      "#eef7fa",
        "mv-muted":     "#8fa9b5",
        "mv-dark":      "#1d3545",
        // Accents — pointent vers les CSS vars de thème
        // Supports bg-mv-accent, bg-mv-accent/50, text-mv-accent, etc.
        "mv-accent":  "rgb(var(--accent)  / <alpha-value>)",
        "mv-accent2": "rgb(var(--accent-2) / <alpha-value>)",
        "mv-accent3": "rgb(var(--accent-3) / <alpha-value>)",
        // Raretés (fixes)
        "rarity-commun":      "#94a3b8",
        "rarity-rare":        "#60a5fa",
        "rarity-epique":      "#c084fc",
        "rarity-mythique":    "#fb923c",
        "rarity-legendaire":  "#fbbf24",
        "rarity-chromatique": "#f472b6",
        "rarity-rainbow":     "#ffffff",
      },
      fontFamily: {
        unbounded: ["var(--font-unbounded)", "sans-serif"],
        inter:     ["var(--font-inter)",     "sans-serif"],
        sans:      ["var(--font-inter)",     "system-ui", "sans-serif"],
      },
      borderRadius: {
        "mv-card": "20px",
        "mv-pill": "100px",
        "mv-tab":  "28px",
      },
      boxShadow: {
        "mv-tab-bar": "0 -10px 15px 0 rgba(0,0,0,0.5)",
        "mv-active":  "0 8px 18px 0 rgba(234,67,22,0.35)",
        "mv-glass":   "0 18px 40px 0 rgba(165,189,205,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
