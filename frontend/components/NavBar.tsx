"use client";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/",            label: "Accueil" },
  { href: "/regions",     label: "Régions" },
  { href: "/histoire",    label: "Histoire" },
  { href: "/traditions",  label: "Traditions" },
  { href: "/sites",       label: "Sites" },
  { href: "/personnages", label: "Personnages" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy/96 backdrop-blur-md border-b border-violet/15 shadow-xl shadow-navy/50"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 h-[72px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/boby.svg"
            alt="Logo"
            className="w-8 h-8 shrink-0 object-contain"
          />
          <span className="font-display font-bold text-lavande tracking-wide text-sm uppercase group-hover:text-rose transition-colors duration-300 hidden sm:block">
            Mémoires du Vietnam
          </span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.slice(1).map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="underline-anim text-lavande/55 hover:text-lavande/90 text-[11px] tracking-[0.18em] uppercase font-sans transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Burger mobile */}
        <button
          className="lg:hidden flex flex-col gap-[5px] p-2 ml-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-px bg-lavande/70 transition-all duration-300 ${
                i === 0 ? (menuOpen ? "w-6 rotate-45 translate-y-[9px]" : "w-6") :
                i === 1 ? (menuOpen ? "w-0 opacity-0" : "w-4") :
                           (menuOpen ? "w-6 -rotate-45 -translate-y-[9px]" : "w-5")
              }`}
            />
          ))}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="bg-navy/98 backdrop-blur-md border-t border-violet/15 px-6 py-5 flex flex-col gap-3">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-lavande/60 text-sm tracking-widest uppercase font-sans hover:text-rose transition-colors py-1 border-b border-violet/10 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
