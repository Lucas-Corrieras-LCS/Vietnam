import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — Mémoires du Vietnam",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <p className="font-display font-black text-[120px] text-violet/15 leading-none select-none">
        404
      </p>
      <h1 className="font-display font-bold text-2xl text-lavande mb-3 -mt-4">
        Page introuvable
      </h1>
      <p className="text-lavande/40 text-sm mb-10 max-w-xs leading-relaxed">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 border border-rose/25 hover:border-rose/60 px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase font-display font-semibold text-rose/60 hover:text-rose transition-all duration-300"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <path d="M9 5H1M4 2L1 5L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Retour à l'accueil
      </a>
    </div>
  );
}
