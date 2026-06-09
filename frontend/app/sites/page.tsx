import { getAllSites } from "@/lib/directus";
import { DIRECTUS_URL } from "@/lib/directus";
import { assetUrl } from "@/types";
import { localSite, bgImage } from "@/lib/localImages";
import type { Metadata } from "next";
import type { Site, Region } from "@/types";
import ParallaxHero from "@/components/ParallaxHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Sites patrimoniaux — Mémoires du Vietnam",
  description: "Baie d'Ha Long, Hội An, Mỹ Sơn — les joyaux du patrimoine vietnamien.",
};

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  "UNESCO":        { label: "UNESCO",        color: "#E7D5F2", bg: "#512DB9" },
  "Naturel":       { label: "Nature",        color: "#E7D5F2", bg: "#3D6B52" },
  "Temple":        { label: "Temple",        color: "#0C0A40", bg: "#F28DB2" },
  "Ville ancienne":{ label: "Ville ancienne",color: "#E7D5F2", bg: "#6B5844" },
};

export default async function SitesPage() {
  const sites = await getAllSites();

  const typeGroups = sites.reduce<Record<string, Site[]>>((acc, site) => {
    if (!acc[site.type]) acc[site.type] = [];
    acc[site.type].push(site);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <ParallaxHero
        bgUrl="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1800&q=80"
        overlay="from-navy via-navy/70 to-navy/10"
        className="min-h-[65vh] flex items-end pb-16 px-8 md:px-16"
      >
        <div className="max-w-5xl pt-32">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-violet" />
              <span className="text-violet text-xs tracking-[0.35em] uppercase font-display font-semibold">
                Patrimoine
              </span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-lavande leading-[0.95] mb-5">
              Sites<br />
              <span className="text-gradient">patrimoniaux</span>
            </h1>
            <p className="text-lavande/50 text-lg max-w-lg leading-relaxed">
              Des paysages karstiques d'Ha Long aux temples Cham de Mỹ Sơn — le Vietnam concentre un patrimoine d'une richesse exceptionnelle.
            </p>
          </ScrollReveal>

          {/* Compteur types */}
          <ScrollReveal delay={150} className="mt-8 flex flex-wrap gap-4">
            {Object.entries(typeGroups).map(([type, group]) => {
              const cfg = TYPE_CONFIG[type] || { label: type, color: "#E7D5F2", bg: "#512DB9" };
              return (
                <div key={type} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cfg.bg }}
                  />
                  <span className="text-lavande/50 text-xs font-sans">{cfg.label} ({group.length})</span>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </ParallaxHero>

      {/* ── SITES PAR TYPE ───────────────────────────────────────────────────── */}
      <section className="relative py-20 px-8 md:px-16 overflow-hidden section-rose">
        <div className="absolute inset-0 pattern-diamond opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {sites.length === 0 ? (
            <div className="glass p-10 text-center">
              <p className="text-lavande/30 text-sm">Aucun site trouvé — configure les permissions Directus.</p>
            </div>
          ) : (
            <div className="space-y-20">
              {Object.entries(typeGroups).map(([type, group], gi) => {
                const cfg = TYPE_CONFIG[type] || { label: type, color: "#E7D5F2", bg: "#512DB9" };
                return (
                  <div key={type}>
                    <ScrollReveal>
                      <div className="flex items-center gap-4 mb-8">
                        <span
                          className="text-[10px] tracking-[0.25em] uppercase font-display font-bold px-3 py-1.5"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        <div className="divider flex-1" />
                        <span className="text-lavande/30 text-xs font-sans">{group.length} site{group.length > 1 ? "s" : ""}</span>
                      </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {group.map((site, i) => {
                        const imgUrl = assetUrl(site.image, DIRECTUS_URL) || localSite(site.nom);
                        const region = typeof site.region_id === "object" ? site.region_id as Region : null;

                        return (
                          <ScrollReveal key={site.id} direction="up" delay={i * 100}>
                            <div className="group card-border h-full flex flex-col">
                              {/* Image */}
                              <div className="relative overflow-hidden aspect-video">
                                <div
                                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
                                  style={{
                                    backgroundImage: bgImage(imgUrl),
                                    backgroundColor: cfg.bg + "33",
                                  }}
                                />
                                {!imgUrl && (
                                  <div
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ backgroundColor: cfg.bg + "22" }}
                                  >
                                    <span
                                      className="font-display font-black text-2xl tracking-wider"
                                      style={{ color: cfg.bg, opacity: 0.2 }}
                                    >
                                      {site.nom.slice(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />

                                {/* Tag type */}
                                <div className="absolute top-3 left-3">
                                  <span
                                    className="text-[9px] tracking-[0.2em] uppercase font-display font-bold px-2 py-0.5"
                                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                                  >
                                    {cfg.label}
                                  </span>
                                </div>

                                {region && (
                                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                                    <span
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ backgroundColor: (region as any).couleur_identitaire || "#F28DB2" }}
                                    />
                                    <span className="text-lavande/50 text-[10px] font-sans">{region.nom}</span>
                                  </div>
                                )}
                              </div>

                              {/* Texte */}
                              <div className="surface surface-hover flex-1 p-5">
                                <h3 className="font-display font-bold text-base text-lavande mb-2 leading-tight group-hover:text-rose transition-colors">
                                  {site.nom}
                                </h3>
                                <p className="text-lavande/40 text-xs leading-relaxed line-clamp-3">
                                  {site.description}
                                </p>
                              </div>
                            </div>
                          </ScrollReveal>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <div className="divider mx-8 md:mx-16" />
      <section className="py-16 px-8 md:px-16 section-lavande">
        <ScrollReveal className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: `${sites.length}`, label: "Sites répertoriés" },
            { n: `${Object.keys(typeGroups).length}`, label: "Catégories" },
            { n: "7", label: "Classés UNESCO" },
            { n: "4 000", label: "Ans d'histoire" },
          ].map(({ n, label }) => (
            <div key={label} className="glass p-5 text-center">
              <p className="font-display font-black text-3xl text-lavande mb-1">{n}</p>
              <p className="text-lavande/40 text-xs tracking-widest uppercase font-sans">{label}</p>
            </div>
          ))}
        </ScrollReveal>
      </section>
    </div>
  );
}
