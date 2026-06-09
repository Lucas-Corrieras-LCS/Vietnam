"use client";
import { useState, useEffect, useRef } from "react";
import type { Tradition, Categorie } from "@/types";
import { assetUrl } from "@/types";
import { localTradition, bgImage } from "@/lib/localImages";

interface Props {
  traditions: Tradition[];
  categories: Categorie[];
  directusUrl: string;
}

export default function TraditionsGrid({ traditions, categories, directusUrl }: Props) {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === null
    ? traditions
    : traditions.filter((t) => t.categorie_id?.id === activeFilter);

  // Reveal on filter change
  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll(".trad-card");
    if (!cards) return;
    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, i * 60);
    });
  }, [activeFilter]);

  if (traditions.length === 0) {
    return (
      <p className="text-lavande/30 italic text-center py-20">
        Aucune tradition trouvée — configure les permissions Directus.
      </p>
    );
  }

  return (
    <>
      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 text-xs tracking-[0.15em] uppercase font-display font-semibold transition-all duration-300 ${
            activeFilter === null
              ? "bg-rose text-navy"
              : "border border-lavande/20 text-lavande/50 hover:border-rose/40 hover:text-lavande"
          }`}
        >
          Tout ({traditions.length})
        </button>
        {categories.map((cat) => {
          const count = traditions.filter((t) => t.categorie_id?.id === cat.id).length;
          if (!count) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(activeFilter === cat.id ? null : cat.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs tracking-[0.15em] uppercase font-display font-semibold transition-all duration-300"
              style={{
                backgroundColor: activeFilter === cat.id ? cat.couleur : "transparent",
                color: activeFilter === cat.id ? "#0C0A40" : "rgba(231,213,242,0.5)",
                border: `1px solid ${activeFilter === cat.id ? cat.couleur : "rgba(231,213,242,0.15)"}`,
              }}
            >
              {cat.nom} ({count})
            </button>
          );
        })}
      </div>

      {/* Grille */}
      <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((tradition) => {
          const imgUrl = assetUrl(tradition.image, directusUrl) || localTradition(tradition.slug);
          const cat = tradition.categorie_id;

          return (
            <div key={tradition.id} className="trad-card group card-border">
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-[1.06]"
                  style={{
                    backgroundImage: bgImage(imgUrl),
                    backgroundColor: cat?.couleur ? cat.couleur + "33" : "#1A1660",
                  }}
                />
                {!imgUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display font-black text-3xl tracking-wider"
                      style={{ color: cat?.couleur || "#E7D5F2", opacity: 0.18 }}
                    >
                      {cat?.nom?.slice(0, 2).toUpperCase() || "VN"}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />

                {cat && (
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[10px] tracking-[0.15em] uppercase font-display font-bold px-2 py-1"
                      style={{ backgroundColor: cat.couleur, color: "#0C0A40" }}
                    >
                      {cat.nom}
                    </span>
                  </div>
                )}
              </div>

              {/* Corps */}
              <div className="surface surface-hover p-5">
                <h3 className="font-display font-bold text-base text-lavande mb-2 group-hover:text-rose transition-colors leading-tight">
                  {tradition.nom}
                </h3>
                {tradition.description && (
                  <p className="text-lavande/45 text-xs leading-relaxed line-clamp-3">
                    {tradition.description}
                  </p>
                )}
                {cat && (
                  <div className="mt-3 pt-3 border-t border-violet/15">
                    <span
                      className="w-full block h-0.5 transition-all duration-500 group-hover:opacity-100 opacity-40"
                      style={{ backgroundColor: cat.couleur }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
