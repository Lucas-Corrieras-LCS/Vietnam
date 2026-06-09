import { getAccueilData } from "@/lib/directus";
import { DIRECTUS_URL } from "@/lib/directus";
import { assetUrl } from "@/types";
import ParallaxHero from "@/components/ParallaxHero";
import ScrollReveal from "@/components/ScrollReveal";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "Légendaire":  { bg: "#E7D5F2", text: "#0C0A40" },
  "Occupation":  { bg: "#F28DB2", text: "#0C0A40" },
  "Dynastie":    { bg: "#512DB9", text: "#E7D5F2" },
  "Colonisation":{ bg: "#F22222", text: "#fff" },
  "Guerre":      { bg: "#F22222", text: "#fff" },
  "Réforme":     { bg: "#512DB9", text: "#E7D5F2" },
  "Contemporain":{ bg: "#F28DB2", text: "#0C0A40" },
};

export default async function HomePage() {
  const { regions, periodes } = await getAccueilData();

  return (
    <>
      {/* ─────────────────────────────── HERO ────────────────────────────────── */}
      <ParallaxHero
        bgUrl="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1800&q=80"
        overlay="from-navy via-navy/80 to-navy/40"
        className="min-h-screen flex items-end pb-20 px-8 md:px-16"
        lanternes
        lanternesLeft
      >
        <div className="max-w-5xl pt-32 pb-8">
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-rose" />
            <span className="text-rose text-xs tracking-[0.35em] uppercase font-display font-semibold">
              Atlas culturel & historique
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-lavande mb-6">
            Un pays qui a<br />
            <span className="text-gradient-fire">résisté à tout.</span>
          </h1>

          <p className="text-lavande/50 text-base md:text-lg max-w-xl leading-relaxed mb-10 font-sans">
            Du delta du Mékong aux rizières de Sa Pa — trois régions, des siècles
            de dynasties, de guerres et de renaissance.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap">
            <a href="/regions"
               className="group inline-flex items-center gap-3 border border-rose/40 hover:border-rose px-7 py-3.5 text-rose/70 hover:text-rose text-xs tracking-[0.2em] uppercase font-display font-bold transition-all duration-300">
              Explorer les régions
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform shrink-0">
                <path d="M1 6H11M7 2L11 6L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/histoire"
               className="inline-flex items-center gap-3 px-7 py-3.5 border border-lavande/15 hover:border-lavande/40 text-lavande/45 hover:text-lavande text-xs tracking-[0.2em] uppercase font-display font-bold transition-all duration-300">
              Voir l'histoire
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14 pt-10 border-t border-violet/20">
            {[
              { n: "3",    label: "Régions" },
              { n: "4 000", label: "Ans d'histoire" },
              { n: "8",    label: "Traditions" },
              { n: "7",    label: "Sites UNESCO" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-display font-black text-2xl md:text-3xl text-lavande">{n}</p>
                <p className="text-lavande/40 text-xs tracking-widest uppercase font-sans">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </ParallaxHero>

      {/* ─────────────────────────── SECTION RÉGIONS ─────────────────────────── */}
      <section className="relative py-24 px-8 md:px-16 overflow-hidden section-lavande">
        <div className="absolute inset-0 pattern-grid opacity-20" />
        {/* Glow décoratif */}
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-violet/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header section */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-px bg-lavande/40" />
                  <span className="text-lavande/55 text-xs tracking-[0.3em] uppercase font-display font-semibold">Géographie</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-lavande leading-tight">
                  Les trois<br /><span className="text-gradient">régions</span>
                </h2>
              </div>
              <p className="text-lavande/40 text-sm max-w-xs leading-relaxed">
                Nord · Centre · Sud — trois identités distinctes, une même âme vietnamienne.
              </p>
            </div>
          </ScrollReveal>

          {regions.length === 0 ? (
            <div className="glass p-8 text-center">
              <p className="text-lavande/30 text-sm">
                Lance <code className="text-rose">node setup-directus.mjs</code> puis <code className="text-rose">node fix-permissions.mjs</code>
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {regions.map((region, i) => {
                const imgUrl = assetUrl(region.image_hero, DIRECTUS_URL);
                return (
                  <ScrollReveal key={region.id} direction="up" delay={i * 120}>
                    <a
                      href={`/regions/${region.slug}`}
                      className="group card-border block relative overflow-hidden aspect-[3/4]"
                    >
                      {/* Image avec parallax CSS */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        style={{
                          backgroundImage: imgUrl
                            ? `url(${imgUrl})`
                            : `url(https://images.unsplash.com/photo-${["1528360983277-13d401cdc186","1559592413-7cec4d0cae2b","1506905925346-21bda4d32df4"][i]}?w=600&q=80)`,
                          backgroundColor: region.couleur_identitaire || "#512DB9",
                        }}
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

                      {/* Couleur accent top */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: region.couleur_identitaire || "#512DB9" }}
                      />

                      {/* Contenu */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <p className="text-rose text-xs tracking-[0.25em] uppercase font-sans mb-2 opacity-70">
                          {region.capitale}
                        </p>
                        <h3 className="font-display font-bold text-2xl text-lavande mb-2 group-hover:text-rose transition-colors duration-300">
                          {region.nom}
                        </h3>
                        <p className="text-lavande/50 text-sm leading-relaxed line-clamp-2 mb-4">
                          {region.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-display text-lavande/40 group-hover:text-lavande transition-colors">
                          Découvrir
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-hover:translate-x-1 transition-transform shrink-0">
                            <path d="M1 5H9M6 2L9 5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>

                      {/* Glow hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: `inset 0 0 60px ${region.couleur_identitaire || "#512DB9"}40` }}
                      />
                    </a>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────── BANDE SÉPARATRICE ──────────────────────────────── */}
      <div className="divider mx-8 md:mx-16 my-0" />

      {/* ─────────────────────────── FRISE HISTOIRE ──────────────────────────── */}
      <section className="relative py-24 px-8 md:px-16 overflow-hidden section-rose">
        {/* Background decoration */}
        <div className="absolute inset-0 pattern-wave opacity-40" />
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-rouge/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-violet/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-px bg-violet" />
                  <span className="text-violet text-xs tracking-[0.3em] uppercase font-display font-semibold">Chronologie</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-lavande leading-tight">
                  4 000 ans<br /><span className="text-gradient">d'histoire</span>
                </h2>
              </div>
              <a href="/histoire"
                 className="inline-flex items-center gap-2 border border-lavande/20 hover:border-rose/50 px-6 py-3 text-lavande/50 hover:text-rose text-xs tracking-[0.2em] uppercase font-display font-semibold transition-all self-end">
                Toute la chronologie
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                  <path d="M1 5H9M6 2L9 5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </ScrollReveal>

          {periodes.length === 0 ? (
            <div className="glass p-8 text-center">
              <p className="text-lavande/30 text-sm">Insérez le contenu dans Directus</p>
            </div>
          ) : (
            <div className="relative">
              {/* Ligne verticale gauche */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet/40 to-transparent" />

              <div className="flex flex-col">
                {periodes.map((periode, i) => {
                  const colors = TYPE_COLORS[periode.type] || { bg: "#512DB9", text: "#E7D5F2" };
                  return (
                    <ScrollReveal key={periode.id} direction="left" delay={i * 100}>
                      <a
                        href={`/histoire/${periode.slug}`}
                        className="group relative flex items-start gap-6 pl-10 py-5 border-b border-violet/10 last:border-0 hover:bg-violet/5 transition-colors duration-300"
                      >
                        {/* Puce timeline */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5">
                          <div
                            className="w-3 h-3 rounded-full border-2 border-navy group-hover:scale-150 transition-transform duration-300"
                            style={{ backgroundColor: colors.bg, boxShadow: `0 0 8px ${colors.bg}80` }}
                          />
                        </div>

                        {/* Date */}
                        <span className="text-rose/60 font-sans text-xs tabular-nums w-28 shrink-0 pt-1">
                          {periode.date_debut < 0
                            ? `${Math.abs(periode.date_debut)} av. J.-C.`
                            : periode.date_debut}
                          {periode.date_fin ? ` → ${periode.date_fin}` : " → auj."}
                        </span>

                        {/* Contenu */}
                        <div className="flex-1 flex items-start gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <h3 className="font-display font-bold text-lg text-lavande group-hover:text-rose transition-colors">
                                {periode.nom}
                              </h3>
                              <span
                                className="text-[10px] tracking-[0.15em] uppercase font-display font-bold px-2 py-0.5"
                                style={{ backgroundColor: colors.bg, color: colors.text }}
                              >
                                {periode.type}
                              </span>
                            </div>
                            {periode.resume_frise && (
                              <p className="text-lavande/40 text-sm">{periode.resume_frise}</p>
                            )}
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-lavande/35 text-[10px] font-display tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity pt-1 shrink-0">
                            Lire
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="shrink-0">
                              <path d="M1 5H9M6 2L9 5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                      </a>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────── CTA FINAL ───────────────────────────── */}
      <section className="relative py-32 px-8 md:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/12 via-navy to-rose/8" />
        <div className="absolute inset-0 pattern-dots opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-rose/5 blur-3xl animate-glow-pulse" />
        </div>

        <ScrollReveal className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-10 h-px bg-lavande/30" />
            <span className="text-lavande/40 text-xs tracking-[0.3em] uppercase font-display">Explorez</span>
            <span className="w-10 h-px bg-lavande/30" />
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-lavande mb-6 leading-tight">
            Plongez dans<br /><span className="text-gradient">l'âme du Vietnam</span>
          </h2>
          <p className="text-lavande/45 text-base leading-relaxed mb-10">
            Traditions millénaires, sites classés UNESCO, personnages historiques — découvrez un pays dont chaque région est un monde.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/traditions"
               className="group inline-flex items-center gap-3 border border-rose/35 hover:border-rose px-8 py-4 text-rose/65 hover:text-rose font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300">
              Traditions
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-hover:translate-x-0.5 transition-transform shrink-0">
                <path d="M1 5H9M6 2L9 5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/personnages"
               className="group inline-flex items-center gap-3 border border-lavande/20 hover:border-lavande/50 px-8 py-4 text-lavande/50 hover:text-lavande font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300">
              Personnages
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-hover:translate-x-0.5 transition-transform shrink-0">
                <path d="M1 5H9M6 2L9 5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
