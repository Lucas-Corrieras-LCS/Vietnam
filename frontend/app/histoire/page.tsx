import { getAllPeriodes } from "@/lib/directus";
import type { Metadata } from "next";
import ParallaxHero from "@/components/ParallaxHero";
import TimelineClient from "@/components/TimelineClient";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Histoire — Mémoires du Vietnam",
  description: "Les grandes périodes de l'histoire vietnamienne — des Hùng à aujourd'hui.",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "Légendaire":  { bg: "#E7D5F2", text: "#0C0A40" },
  "Occupation":  { bg: "#F28DB2", text: "#0C0A40" },
  "Dynastie":    { bg: "#512DB9", text: "#E7D5F2" },
  "Colonisation":{ bg: "#F22222", text: "#fff" },
  "Guerre":      { bg: "#F22222", text: "#fff" },
  "Réforme":     { bg: "#512DB9", text: "#E7D5F2" },
  "Contemporain":{ bg: "#F28DB2", text: "#0C0A40" },
};

export default async function HistoirePage() {
  const periodes = await getAllPeriodes();

  // Grouper les types pour les stats
  const typeCounts = periodes.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <ParallaxHero
        bgUrl="https://images.unsplash.com/photo-1599707254554-027aeb4deacd?w=1800&q=80"
        overlay="from-navy via-navy/85 to-navy/50"
        className="min-h-[70vh] flex items-end pb-20 px-8 md:px-16"
        lanternes
      >
        <div className="max-w-5xl pt-32">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-violet" />
              <span className="text-violet text-xs tracking-[0.35em] uppercase font-display font-semibold">Chronologie</span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-lavande leading-[0.95] mb-5">
              L'Histoire<br />
              <span className="text-gradient">du Vietnam</span>
            </h1>
            <p className="text-lavande/50 text-base md:text-lg max-w-lg leading-relaxed mb-10">
              Plus de 4 000 ans de civilisation — des premières dynasties légendaires à la renaissance contemporaine.
            </p>
          </ScrollReveal>

          {/* Stats types */}
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap gap-3">
              {Object.entries(typeCounts).map(([type, count]) => {
                const colors = TYPE_COLORS[type] || { bg: "#512DB9", text: "#E7D5F2" };
                return (
                  <span
                    key={type}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-display font-bold tracking-widest"
                    style={{ backgroundColor: colors.bg + "25", color: colors.bg, border: `1px solid ${colors.bg}40` }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.bg }}
                    />
                    {type} ({count})
                  </span>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </ParallaxHero>

      {/* ── INTRO ────────────────────────────────────────────────────────────── */}
      <section className="relative py-16 px-8 md:px-16 overflow-hidden section-lavande">
        <div className="absolute inset-0 pattern-grid opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="glass p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="font-display font-bold text-xl text-lavande mb-3">Comment lire cette frise</p>
                <p className="text-lavande/50 text-sm leading-relaxed">
                  Chaque carte représente une période historique. Cliquez dessus pour voir le détail ou accéder à la page complète avec les personnages et régions associés. Les couleurs correspondent aux types de périodes.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:w-64 shrink-0">
                {Object.entries(TYPE_COLORS).map(([type, colors]) => (
                  <span
                    key={type}
                    className="text-[10px] tracking-[0.15em] uppercase font-display font-bold px-2 py-1"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TIMELINE INTERACTIVE ─────────────────────────────────────────────── */}
      <section className="relative py-10 px-8 md:px-16 overflow-hidden section-rose">
        <div className="absolute top-0 left-1/2 w-96 h-96 -translate-x-1/2 rounded-full bg-violet/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-rouge/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <TimelineClient periodes={periodes} />
        </div>
      </section>
    </div>
  );
}
