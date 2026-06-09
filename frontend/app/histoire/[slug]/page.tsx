import { getAllPeriodeSlugs, getPeriodeBySlug } from "@/lib/directus";
import { DIRECTUS_URL } from "@/lib/directus";
import { assetUrl } from "@/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ── Génération statique ───────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllPeriodeSlugs();
  // Si Directus est injoignable au build, on retourne un slug fantôme
  // pour éviter l'erreur Next.js "missing generateStaticParams"
  if (slugs.length === 0) return [{ slug: "__placeholder__" }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const periode = await getPeriodeBySlug(params.slug);
  if (!periode) return { title: "Période introuvable" };
  return {
    title: `${periode.nom} — Mémoires du Vietnam`,
    description: periode.description?.slice(0, 160),
  };
}

const TYPE_COLORS: Record<string, string> = {
  "Légendaire":  "#7D3C98",
  "Occupation":  "#784212",
  "Dynastie":    "#9E8E7A",
  "Colonisation":"#6D4C41",
  "Guerre":      "#C0392B",
  "Réforme":     "#1A5276",
  "Contemporain":"#2E7D32",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function PeriodeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const periode = await getPeriodeBySlug(params.slug);
  if (!periode) notFound();

  const imgUrl      = assetUrl(periode.image, DIRECTUS_URL);
  const personnages = periode.personnages?.map((p) => p.personnages_id) ?? [];
  const regions     = periode.regions?.map((r) => r.regions_id) ?? [];
  const typeColor   = TYPE_COLORS[periode.type] || "#555";

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] flex items-end pb-12 px-8 md:px-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: imgUrl
              ? `url(${imgUrl})`
              : `url(https://picsum.photos/1600/900?random=${periode.id})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/50 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-white text-xs px-3 py-1 font-sans"
              style={{ backgroundColor: typeColor }}
            >
              {periode.type}
            </span>
            <span className="text-[#9E8E7A] text-sm font-sans">
              {periode.date_debut}
              {periode.date_fin ? ` – ${periode.date_fin}` : " – aujourd'hui"}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-white">{periode.nom}</h1>
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-16 max-w-4xl">
        <p className="text-white/70 text-lg leading-relaxed whitespace-pre-line">
          {periode.description}
        </p>
      </section>

      {/* ── PERSONNAGES ──────────────────────────────────────────────────── */}
      {personnages.length > 0 && (
        <section className="px-8 md:px-16 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl text-white mb-2">Personnages clés</h2>
            <div className="w-12 h-0.5 mb-10" style={{ backgroundColor: typeColor }} />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {personnages.map((p) => {
                const portraitUrl = assetUrl(p.portrait, DIRECTUS_URL);
                return (
                  <div key={p.id} className="flex gap-4 p-5 border border-white/10">
                    {/* Portrait */}
                    <div
                      className="w-16 h-16 shrink-0 rounded-full bg-cover bg-center bg-white/10"
                      style={portraitUrl ? { backgroundImage: `url(${portraitUrl})` } : {}}
                    />
                    {/* Infos */}
                    <div>
                      <h3 className="font-serif text-base text-white mb-0.5">{p.nom}</h3>
                      <p className="text-[#9E8E7A] text-xs mb-2 font-sans">{p.dates_vie}</p>
                      <span className="text-white/30 text-xs bg-white/10 px-2 py-0.5 font-sans">
                        {p.role}
                      </span>
                      {p.description && (
                        <p className="text-white/50 text-xs leading-relaxed mt-3">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── RÉGIONS CONCERNÉES ───────────────────────────────────────────── */}
      {regions.length > 0 && (
        <section className="px-8 md:px-16 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl text-white mb-8">Régions concernées</h2>
            <div className="flex flex-wrap gap-3">
              {regions.map((r) => (
                <a key={r.id} href={`/regions/${r.slug}`}
                   className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 text-sm font-sans hover:border-[#9E8E7A] hover:text-white transition-colors">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: r.couleur_identitaire || "#C0392B" }}
                  />
                  {r.nom}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Retour */}
      <div className="px-8 md:px-16 py-8">
        <a
          href="/histoire"
          className="inline-flex items-center gap-2 border border-lavande/15 hover:border-lavande/40 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-display font-semibold text-lavande/40 hover:text-lavande transition-all duration-300"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
            <path d="M9 5H1M4 2L1 5L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Toutes les périodes
        </a>
      </div>
    </div>
  );
}
