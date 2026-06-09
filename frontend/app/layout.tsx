import type { Metadata } from "next";
import { Inter, Playfair_Display, Syne } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mémoires du Vietnam",
  description: "Un atlas culturel et historique du Vietnam — trois régions, mille ans d'histoire.",
  icons: {
    icon: "/boby.svg",
    shortcut: "/boby.svg",
  },
  openGraph: {
    title: "Mémoires du Vietnam",
    description: "Culture, histoire et traditions vietnamiennes.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-navy text-lavande font-sans">
        <NavBar />

        <main className="pt-[72px]">
          {children}
        </main>

        <footer className="relative border-t border-violet/20 overflow-hidden">
          <div className="absolute inset-0 pattern-grid opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 py-16">
            <div className="grid md:grid-cols-3 gap-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img src="/boby.svg" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
                  <span className="font-display font-bold text-lavande text-sm uppercase tracking-wide">Mémoires du Vietnam</span>
                </div>
                <p className="text-lavande/40 text-sm leading-relaxed max-w-xs">
                  Un atlas numérique de la culture, l'histoire et les traditions vietnamiennes.
                </p>
              </div>
              {/* Nav */}
              <div>
                <p className="text-rose/60 text-xs tracking-[0.2em] uppercase font-sans mb-4">Navigation</p>
                <div className="flex flex-col gap-2">
                  {[["Accueil", "/"], ["Régions", "/regions"], ["Histoire", "/histoire"]].map(([label, href]) => (
                    <a key={href} href={href} className="text-lavande/50 text-sm hover:text-rose transition-colors font-sans">{label}</a>
                  ))}
                </div>
              </div>
              {/* Project */}
              <div>
                <p className="text-rose/60 text-xs tracking-[0.2em] uppercase font-sans mb-4">Projet</p>
                <p className="text-lavande/40 text-sm">Lucas · Mathis · Lison · Lilly</p>
                <p className="text-lavande/30 text-xs mt-2">MMI 2026 — Next.js · Directus</p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-violet/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-lavande/20 text-xs tracking-widest uppercase">
                © 2026 Lucas · Mathis · Lison · Lilly — Vietnam
              </p>
              <div className="flex gap-1">
                {["#0C0A40","#512DB9","#F22222","#F28DB2","#E7D5F2"].map((c) => (
                  <span key={c} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
