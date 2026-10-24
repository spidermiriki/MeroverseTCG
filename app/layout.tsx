import type { Metadata, Viewport } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MeroverseTCG",
  description: "Collectionnez les cartes du Meroverse",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a1419",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${unbounded.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
