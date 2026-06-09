import { getAllPersonnages } from "@/lib/directus";
import { DIRECTUS_URL } from "@/lib/directus";
import { assetUrl } from "@/types";
import { localPersonnage, bgImage } from "@/lib/localImages";
import type { Metadata } from "next";
import ParallaxHero from "@/components/ParallaxHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Personnages — Mémoires du Vietnam",
  description: "Hồ Chí Minh, Võ Nguyên Giáp, Nguyễn Du — les figures qui ont façonné le Vietnam.",
};

const ROLE_CONFIG: Record<string, { color: string; bg: string }> = {
  "Leader politique": { color: "#0C0A40", bg: "#F22222" },
  "Général":          { color: "#E7D5F2", bg: "#512DB9" },
  "Poète":            { color: "#0C0A40", bg: "#F28DB2" },
  "Philosophe":       { color: "#0C0A40", bg: "#E7D5F2" },
  "Résistant":        { color: "#E7D5F2", bg: "#6B5844" },
};

export default async function PersonnagesPage() {
  const personnages = await getAllPersonnages();

  const roleSet: Record<string, boolean> = {};
  personnages.forEach((p) => { roleSet[p.role] = true; });
  const roles = Object.keys(roleSet);

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <ParallaxHero
        bgUrl="https://images.unsplash.com/photo-1599707254554-027aeb4deacd?w=1800&q=80"
        overlay="from-navy via-navy/80 to-navy/20"
        className="min-h-[60vh] flex items-end pb-16 px-8 md:px-16"
        lanternes
      >
        <div className="max-w-5xl pt-32">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-rose" />
              <span className="text-rose text-xs tracking-[0.35em] uppercase font-display font-semibold">
                Figures historiques
              </span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-lavande leading-[0.95] mb-5">
              Ceux qui ont<br />
              <span className="text-gradient">forgé le Vietnam</span>
            </h1>
            <p className="text-lavande/50 text-lg max-w-xl leading-relaxed">
              Héros, poètes, généraux, résistants — les personnages qui ont traversé l'histoire et façonné l'identité vietnamienne.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150} className="mt-8 flex flex-wrap gap-2">
            {roles.map((role) => {
              const cfg = ROLE_CONFIG[role] || { color: "#E7D5F2", bg: "#512DB9" };
              return (
                <span
                  key={role}
                  className="text-[10px] tracking-[0.15em] uppercase font-display font-bold px-3 py-1.5"
                  style={{ backgroundColor: cfg.bg + "33", color: cfg.bg, border: `1px solid ${cfg.bg}44` }}
                >
                  {role}
                </span>
              );
            })}
          </ScrollReveal>
        </div>
      </ParallaxHero>

      {/* ── GRILLE PERSONNAGES ───────────────────────────────────────────────── */}
      <section className="relative py-20 px-8 md:px-16 overflow-hidden section-lavande">
        <div className="absolute inset-0 pattern-grid opacity-40" />
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-violet/5 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {personnages.length === 0 ? (
            <div className="glass p-10 text-center">
              <p className="text-lavande/30 text-sm">Aucun personnage trouvé — configure les permissions Directus.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {personnages.map((p, i) => {
                const portraitUrl = assetUrl(p.portrait, DIRECTUS_URL) || localPersonnage(p.slug);
                const cfg = ROLE_CONFIG[p.role] || { color: "#E7D5F2", bg: "#512DB9" };

                return (
                  <ScrollReveal key={p.id} direction="up" delay={i * 100}>
                    <div className="group card-border flex flex-col h-full">
                      {/* Portrait banner */}
                      <div className="relative overflow-hidden h-48">
                        {portraitUrl ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                            style={{ backgroundImage: bgImage(portraitUrl) }}
                          />
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${cfg.bg}33, #0C0A40)` }}
                          >
                            {/* Initiales */}
                            <span className="font-display font-black text-5xl text-lavande/20">
                              {p.nom.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />

                        {/* Role badge */}
                        <div className="absolute top-4 left-4">
                          <span
                            className="text-[9px] tracking-[0.2em] uppercase font-display font-bold px-2 py-1"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {p.role}
                          </span>
                        </div>

                        {/* Dates */}
                        <div className="absolute bottom-4 right-4">
                          <span className="text-lavande/40 text-xs font-sans tabular-nums">{p.dates_vie}</span>
                        </div>
                      </div>

                      {/* Corps */}
                      <div className="surface surface-hover flex-1 p-6">
                        {/* Ligne couleur */}
                        <div
                          className="h-px mb-4 w-8 transition-all duration-500 group-hover:w-full"
                          style={{ backgroundColor: cfg.bg }}
                        />

                        <h3 className="font-display font-bold text-lg text-lavande mb-3 leading-tight group-hover:text-rose transition-colors">
                          {p.nom}
                        </h3>

                        {p.description && (
                          <p className="text-lavande/45 text-xs leading-relaxed line-clamp-4">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CITATION ─────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-8 md:px-16 overflow-hidden section-rose">
        <div className="absolute inset-0 bg-gradient-to-r from-violet/10 via-transparent to-rouge/8" />
        <div className="absolute inset-0 pattern-wave opacity-30" />
        <ScrollReveal className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="font-display font-black text-7xl text-violet/30 leading-none block mb-4">"</span>
          <blockquote className="font-serif text-xl md:text-2xl text-lavande/70 italic leading-relaxed mb-6">
            Rien de plus précieux que l'indépendance et la liberté.
          </blockquote>
          <cite className="text-rose text-xs tracking-[0.25em] uppercase font-display font-semibold not-italic">
            — Hồ Chí Minh
          </cite>
        </ScrollReveal>
      </section>
    </div>
  );
}
