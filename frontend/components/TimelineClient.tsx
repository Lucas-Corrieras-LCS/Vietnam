"use client";
import { useEffect, useRef, useState } from "react";
import type { Periode } from "@/types";

const TYPE_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  "Légendaire":  { bg: "#E7D5F2", text: "#0C0A40", glow: "rgba(231,213,242,0.4)" },
  "Occupation":  { bg: "#F28DB2", text: "#0C0A40", glow: "rgba(242,141,178,0.4)" },
  "Dynastie":    { bg: "#512DB9", text: "#E7D5F2", glow: "rgba(81,45,185,0.4)" },
  "Colonisation":{ bg: "#F22222", text: "#fff",    glow: "rgba(242,34,34,0.4)" },
  "Guerre":      { bg: "#F22222", text: "#fff",    glow: "rgba(242,34,34,0.5)" },
  "Réforme":     { bg: "#512DB9", text: "#E7D5F2", glow: "rgba(81,45,185,0.4)" },
  "Contemporain":{ bg: "#F28DB2", text: "#0C0A40", glow: "rgba(242,141,178,0.3)" },
};

interface Props {
  periodes: Periode[];
}

export default function TimelineClient({ periodes }: Props) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate timeline line on scroll
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          line.style.animation = "lineGrow 1.8s ease forwards";
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  // Reveal cards
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".timeline-card");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateX(0) translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  if (periodes.length === 0) {
    return (
      <p className="text-lavande/30 italic text-center py-20">
        Aucune période trouvée — lance node setup-directus.mjs et node fix-permissions.mjs
      </p>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Ligne centrale */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
        <div
          ref={lineRef}
          className="w-full h-full timeline-line"
          style={{ transform: "scaleY(0)", transformOrigin: "top" }}
        />
      </div>
      {/* Ligne mobile */}
      <div className="absolute left-6 top-0 bottom-0 w-px timeline-line md:hidden" />

      <div className="flex flex-col gap-0">
        {periodes.map((periode, i) => {
          const colors = TYPE_COLORS[periode.type] || { bg: "#512DB9", text: "#E7D5F2", glow: "rgba(81,45,185,0.4)" };
          const isEven = i % 2 === 0;
          const isActive = activeId === periode.id;

          return (
            <div key={periode.id} className="relative md:grid md:grid-cols-2 md:gap-8 mb-2 group/row">

              {/* ── Carte (alterne gauche/droite sur desktop) ── */}
              <div
                className={`timeline-card md:col-span-1 ${isEven ? "md:col-start-1" : "md:col-start-2"}`}
                style={{
                  opacity: 0,
                  transform: `translateX(${isEven ? "-40px" : "40px"}) translateY(10px)`,
                  transition: "opacity 0.7s ease, transform 0.7s ease",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <button
                  onClick={() => setActiveId(isActive ? null : periode.id)}
                  className="w-full text-left"
                >
                  <div
                    className="glass glass-hover card-border p-5 md:p-6 cursor-pointer"
                    style={isActive ? { boxShadow: `0 0 30px ${colors.glow}` } : {}}
                  >
                    {/* Type badge */}
                    <span
                      className="inline-block text-[10px] tracking-[0.2em] uppercase font-display font-bold px-3 py-1 mb-3"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {periode.type}
                    </span>

                    {/* Dates */}
                    <p className="text-rose text-xs font-sans mb-2 tabular-nums">
                      {periode.date_debut < 0
                        ? `${Math.abs(periode.date_debut)} av. J.-C.`
                        : periode.date_debut}
                      {periode.date_fin
                        ? ` – ${periode.date_fin < 0 ? `${Math.abs(periode.date_fin)} av. J.-C.` : periode.date_fin}`
                        : " – aujourd'hui"}
                    </p>

                    {/* Titre */}
                    <h2 className="font-display font-bold text-lavande text-xl md:text-2xl mb-2 leading-tight group-hover/row:text-rose transition-colors">
                      {periode.nom}
                    </h2>

                    {/* Résumé */}
                    {periode.resume_frise && (
                      <p className="text-lavande/50 text-sm leading-relaxed">
                        {periode.resume_frise}
                      </p>
                    )}

                    {/* Expand button */}
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-2 border border-rose/20 hover:border-rose/50 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-display font-semibold text-rose/50 hover:text-rose transition-all duration-300">
                        {isActive ? "Réduire" : "Voir le détail"}
                        <svg
                          width="10" height="10" viewBox="0 0 10 10" fill="none"
                          className="transition-transform duration-300 shrink-0"
                          style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                          <path d="M1 3.5L5 7L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>

                    {/* Expanded content */}
                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{ maxHeight: isActive ? "200px" : "0" }}
                    >
                      <div className="pt-4 border-t border-violet/15 mt-4">
                        <a
                          href={`/histoire/${periode.slug}`}
                          className="inline-flex items-center gap-2 border border-lavande/15 hover:border-lavande/40 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-display font-semibold text-lavande/50 hover:text-lavande transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Explorer cette période
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                            <path d="M1 5H9M6 2L9 5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* ── Point sur la timeline (centré, desktop) ── */}
              <div className="absolute left-1/2 top-6 -translate-x-1/2 hidden md:flex flex-col items-center z-10">
                <div
                  className="w-4 h-4 rounded-full border-2 border-navy transition-all duration-300 group-hover/row:scale-125"
                  style={{ backgroundColor: colors.bg, boxShadow: `0 0 12px ${colors.glow}` }}
                />
              </div>

              {/* ── Point mobile ── */}
              <div
                className="absolute left-6 top-6 -translate-x-1/2 md:hidden w-3 h-3 rounded-full border-2 border-navy"
                style={{ backgroundColor: colors.bg }}
              />
            </div>
          );
        })}
      </div>

      {/* Cap final */}
      <div className="flex justify-center mt-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose to-violet animate-glow-pulse" />
          <span className="text-lavande/30 text-xs font-sans tracking-widest uppercase">Aujourd'hui</span>
        </div>
      </div>
    </div>
  );
}
