import { getAllRegions } from "@/lib/directus";
import { DIRECTUS_URL } from "@/lib/directus";
import { assetUrl } from "@/types";
import type { Metadata } from "next";
import ParallaxHero from "@/components/ParallaxHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Les Régions — Mémoires du Vietnam",
  description: "Explorez les trois grandes régions du Vietnam : Nord, Centre et Sud.",
};

export default async function RegionsPage() {
  const regions = await getAllRegions();

  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <ParallaxHero
        bgUrl="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1800&q=80"
        overlay="from-navy via-navy/80 to-navy/30"
        className="min-h-[65vh] flex items-end pb-16 px-8 md:px-16"
      >
        <div className="max-w-5xl pt-32">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-rose" />
              <span className="text-rose text-xs tracking-[0.35em] uppercase font-display font-semibold">Géographie & Culture</span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-lavande leading-[0.95] mb-5">
              Les trois<br />
              <span className="text-gradient">régions</span>
            </h1>
            <p className="text-lavande/50 text-lg max-w-lg leading-relaxed">
              Le Vietnam s'étend sur 3 300 km du Nord au Sud — trois zones distinctes, trois identités culturelles.
            </p>
          </ScrollReveal>
        </div>
      </ParallaxHero>

      {/* ── GRILLE RÉGIONS ───────────────────────────────────────────────────── */}
      <section className="relative py-24 px-8 md:px-16 overflow-hidden section-lavande">
        <div className="absolute inset-0 pattern-wave opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-rouge/8 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {regions.length === 0 ? (
            <div className="glass p-10 text-center">
              <p className="text-lavande/30 text-sm">
                Aucune région trouvée — configure les permissions dans Directus.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {regions.map((region, i) => {
                const imgUrl = assetUrl(region.image_hero, DIRECTUS_URL);
                return (
                  <ScrollReveal key={region.id} direction="up" delay={i * 150}>
                    <a href={`/regions/${region.slug}`} className="group card-border block">
                      {/* Image hero */}
                      <div className="relative overflow-hidden aspect-video">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.08]"
                          style={{
                            backgroundImage: imgUrl
                              ? `url(${imgUrl})`
                              : `url(https://images.unsplash.com/photo-${
                                  ["1528360983277-13d401cdc186","1559592413-7cec4d0cae2b","1506905925346-21bda4d32df4"][i]
                                }?w=800&q=80)`,
                            backgroundColor: region.couleur_identitaire || "#512DB9",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: region.couleur_identitaire || "#F28DB2" }} />
                          <span className="text-lavande/60 text-[10px] tracking-widest uppercase font-sans">{region.capitale}</span>
                        </div>
                      </div>

                      {/* Corps */}
                      <div className="glass glass-hover p-6 border-t-0">
                        <div
                          className="h-0.5 w-10 mb-4 transition-all duration-500 group-hover:w-full"
                          style={{ backgroundColor: region.couleur_identitaire || "#F22222" }}
                        />
                        <h2 className="font-display font-bold text-2xl text-lavande mb-3 group-hover:text-rose transition-colors duration-300">
                          {region.nom}
                        </h2>
                        <p className="text-lavande/50 text-sm leading-relaxed line-clamp-3 mb-5">
                          {region.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-display font-bold text-rose/70 group-hover:text-rose group-hover:gap-3 transition-all duration-300">
                          Explorer
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                            <path d="M1 5H9M6 2L9 5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </a>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── INFO GÉOGRAPHIQUE ────────────────────────────────────────────────── */}
      <section className="relative py-20 px-8 md:px-16 section-rose">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="glass p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
              <div className="shrink-0">
                <svg width="80" height="200" viewBox="0 0 80 200" fill="none">
                  <path d="M40 5 C55 8 68 15 70 28 C72 40 68 52 60 58 C72 65 75 80 70 95 C65 110 58 118 60 130 C62 142 58 155 50 165 C42 175 35 180 38 190 C34 185 28 175 30 162 C32 149 38 140 35 128 C32 116 25 108 20 95 C15 82 18 68 28 62 C20 55 12 42 15 28 C18 15 28 8 40 5Z" fill="rgba(81,45,185,0.15)" stroke="rgba(81,45,185,0.4)" strokeWidth="1.5"/>
                  <circle cx="42" cy="35"  r="5" fill="#F28DB2" opacity="0.9"/>
                  <circle cx="42" cy="100" r="5" fill="#E7D5F2" opacity="0.9"/>
                  <circle cx="36" cy="165" r="5" fill="#512DB9" opacity="0.9"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-xl text-lavande mb-4">Un pays de 3 300 km</p>
                <p className="text-lavande/50 text-sm leading-relaxed mb-6">
                  Du tropique au tempéré, du delta au plateau, le Vietnam concentre une diversité de paysages, de cultures et de cuisines sans équivalent en Asie du Sud-Est.
                </p>
                <div className="flex gap-6 flex-wrap">
                  {regions.map((r) => (
                    <div key={r.id} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.couleur_identitaire || "#512DB9" }} />
                      <span className="text-lavande/40 text-xs font-sans">{r.nom?.replace(" Vietnam", "")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
