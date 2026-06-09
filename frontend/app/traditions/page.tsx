import { getAllTraditions, getAllCategories, DIRECTUS_URL } from "@/lib/directus";
import type { Metadata } from "next";
import ParallaxHero from "@/components/ParallaxHero";
import ScrollReveal from "@/components/ScrollReveal";
import TraditionsGrid from "@/components/TraditionsGrid";

export const metadata: Metadata = {
  title: "Traditions — Mémoires du Vietnam",
  description: "Gastronomie, musique, fêtes et artisanat — les traditions qui font l'âme du Vietnam.",
};

export default async function TraditionsPage() {
  const [traditions, categories] = await Promise.all([
    getAllTraditions(),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <ParallaxHero
        bgUrl="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1800&q=80"
        overlay="from-navy via-navy/75 to-navy/20"
        className="min-h-[60vh] flex items-end pb-16 px-8 md:px-16"
        lanternes
        lanternesLeft
      >
        <div className="max-w-5xl pt-32">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-lavande/50" />
              <span className="text-lavande/60 text-xs tracking-[0.35em] uppercase font-display font-semibold">
                Culture & Art de vivre
              </span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-lavande leading-[0.95] mb-5">
              Traditions<br />
              <span className="text-gradient">vietnamiennes</span>
            </h1>
            <p className="text-lavande/50 text-lg max-w-lg leading-relaxed">
              Gastronomie légendaire, musique millénaire, fêtes éclatantes — l'âme du Vietnam dans ses gestes quotidiens.
            </p>
          </ScrollReveal>

          {/* Catégories pills */}
          {categories.length > 0 && (
            <ScrollReveal delay={200} className="mt-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1.5 text-xs font-display font-semibold tracking-[0.15em] uppercase"
                  style={{
                    backgroundColor: cat.couleur + "22",
                    color: cat.couleur,
                    border: `1px solid ${cat.couleur}44`,
                  }}
                >
                  {cat.nom}
                </span>
              ))}
            </ScrollReveal>
          )}
        </div>
      </ParallaxHero>

      {/* ── GRID INTERACTIVE ─────────────────────────────────────────────────── */}
      <section className="relative py-20 px-8 md:px-16 overflow-hidden section-lavande">
        <div className="absolute inset-0 pattern-dots opacity-60" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-rose/5 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <TraditionsGrid traditions={traditions} categories={categories} directusUrl={DIRECTUS_URL} />
        </div>
      </section>
    </div>
  );
}
