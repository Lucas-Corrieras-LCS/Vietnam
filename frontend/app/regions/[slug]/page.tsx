import { getAllRegionSlugs, getRegionBySlug } from "@/lib/directus";
import { DIRECTUS_URL } from "@/lib/directus";
import { assetUrl } from "@/types";
import { localRegion, localTradition, localSite, bgImage } from "@/lib/localImages";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ── Génération statique ───────────────────────────────────────────────────────
// Next.js appelle cette fonction au BUILD pour générer toutes les pages /regions/[slug]
// Aucun appel réseau ne se fait depuis le navigateur.
export async function generateStaticParams() {
  const slugs = await getAllRegionSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Métadonnées dynamiques ────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const region = await getRegionBySlug(params.slug);
  if (!region) return { title: "Région introuvable" };
  return {
    title: `${region.nom} — Mémoires du Vietnam`,
    description: region.description?.slice(0, 160),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function RegionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const region = await getRegionBySlug(params.slug);
  if (!region) notFound();

  const heroUrl = assetUrl(region.image_hero, DIRECTUS_URL) || localRegion(params.slug);
  const traditions = region.traditions?.map((t) => t.traditions_id) ?? [];
  const sites      = region.sites ?? [];
  const periodes   = region.periodes?.map((p) => p.periodes_id) ?? [];

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] flex items-end pb-12 px-8 md:px-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: heroUrl
              ? `url(${heroUrl})`
              : `url(https://picsum.photos/1600/900?random=${region.id})`,
            backgroundColor: region.couleur_identitaire || "#1A1A1A",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/40 to-transparent" />
        <div className="relative z-10">
          <p className="text-[#9E8E7A] text-xs tracking-widest uppercase mb-3 font-sans">
            {region.capitale}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-white">{region.nom}</h1>
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-16 max-w-4xl">
        <p className="text-white/70 text-lg leading-relaxed">{region.description}</p>
      </section>

      {/* ── TRADITIONS ───────────────────────────────────────────────────── */}
      {traditions.length > 0 && (
        <section className="px-8 md:px-16 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl text-white mb-2">Traditions & Culture</h2>
            <div
              className="w-12 h-0.5 mb-10"
              style={{ backgroundColor: region.couleur_identitaire || "#C0392B" }}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {traditions.map((tradition) => {
                const imgUrl = assetUrl(tradition.image, DIRECTUS_URL);
                const categorie = tradition.categorie_id;
                return (
                  <div key={tradition.id} className="bg-white/5 border border-white/10 p-5">
                    {imgUrl && (
                      <div
                        className="w-full aspect-video bg-cover bg-center mb-4"
                        style={{ backgroundImage: `url(${imgUrl})` }}
                      />
                    )}
                    {categorie && (
                      <span
                        className="inline-block text-white text-xs px-2 py-0.5 mb-3 font-sans"
                        style={{ backgroundColor: categorie.couleur || "#555" }}
                      >
                        {categorie.nom}
                      </span>
                    )}
                    <h3 className="font-serif text-lg text-white mb-2">{tradition.nom}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{tradition.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── SITES ────────────────────────────────────────────────────────── */}
      {sites.length > 0 && (
        <section className="px-8 md:px-16 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl text-white mb-2">Sites patrimoniaux</h2>
            <div className="w-12 h-0.5 bg-[#9E8E7A] mb-10" />
            <div className="grid sm:grid-cols-2 gap-4">
              {sites.map((site) => {
                const siteImg = assetUrl(site.image, DIRECTUS_URL);
                return (
                  <div key={site.id} className="flex gap-4 p-4 border border-white/10 hover:border-[#9E8E7A]/50 transition-colors">
                    {siteImg && (
                      <div
                        className="w-24 h-20 shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${siteImg})` }}
                      />
                    )}
                    <div>
                      <span className="text-[#9E8E7A] text-xs tracking-widest uppercase font-sans">
                        {site.type}
                      </span>
                      <h3 className="font-serif text-base text-white mt-1 mb-1">{site.nom}</h3>
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                        {site.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── PÉRIODES LIÉES ───────────────────────────────────────────────── */}
      {periodes.length > 0 && (
        <section className="px-8 md:px-16 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl text-white mb-8">Périodes historiques liées</h2>
            <div className="flex flex-wrap gap-3">
              {periodes.map((periode) => (
                <a key={periode.id} href={`/histoire/${periode.slug}`}
                   className="px-4 py-2 border border-white/20 text-white/60 text-sm font-sans hover:border-[#C0392B] hover:text-white transition-colors">
                  {periode.nom}
                  <span className="text-white/30 ml-2">
                    {periode.date_debut}
                    {periode.date_fin ? `–${periode.date_fin}` : ""}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Retour */}
      <div className="px-8 md:px-16 py-8">
        <a
          href="/regions"
          className="inline-flex items-center gap-2 border border-lavande/15 hover:border-lavande/40 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-display font-semibold text-lavande/40 hover:text-lavande transition-all duration-300"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
            <path d="M9 5H1M4 2L1 5L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Toutes les régions
        </a>
      </div>
    </div>
  );
}
