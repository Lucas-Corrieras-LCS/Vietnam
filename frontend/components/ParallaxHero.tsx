"use client";
import { useEffect, useRef } from "react";

interface LanterneItem {
  src: string;
  width: number;
  top: string | number;
  right?: string;
  left?: string;
  opacity: number;
  duration: string;
  delay: string;
}

const LANTERNES_RIGHT: LanterneItem[] = [
  { src: "/lanterne-rose.svg",   width: 68, top: 0, right: "5%",   opacity: 0.72, duration: "6.5s", delay: "0s"   },
  { src: "/lanterne-bleu.svg",   width: 46, top: 0, right: "15%",  opacity: 0.50, duration: "8.8s", delay: "1.4s" },
  { src: "/lanterne-orange.svg", width: 54, top: 0, right: "1%",   opacity: 0.55, duration: "7.3s", delay: "0.7s" },
];
const LANTERNES_LEFT: LanterneItem[] = [
  { src: "/lanterne-bleu.svg",   width: 40, top: 0, left: "2%",    opacity: 0.35, duration: "9.2s", delay: "2.1s" },
];

interface Props {
  children: React.ReactNode;
  bgUrl?: string;
  overlay?: string;
  className?: string;
  speed?: number;
  lanternes?: boolean;   // affiche les SVG lanternes flottantes
  lanternesLeft?: boolean; // + une lanterne côté gauche
}

export default function ParallaxHero({
  children,
  bgUrl,
  overlay = "from-navy via-navy/70 to-transparent",
  className = "",
  speed = 0.45,
  lanternes = false,
  lanternesLeft = false,
}: Props) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    let raf = 0;

    const update = () => {
      bg.style.transform = `translateY(${window.scrollY * speed}px) scale(1.1)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // init
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-grid opacity-30" />

      {/* Éléments décoratifs flottants */}
      <div className="absolute top-1/4 right-16 w-64 h-64 rounded-full bg-violet/10 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-48 h-48 rounded-full bg-rouge/10 blur-2xl animate-float-slow pointer-events-none" />

      {/* Lanternes SVG flottantes */}
      {lanternes && (
        <div className="absolute inset-0 pointer-events-none select-none z-[6]" aria-hidden>
          {LANTERNES_RIGHT.map((l, i) => (
            <img
              key={i}
              src={l.src}
              alt=""
              style={{
                position: "absolute",
                top: l.top,
                right: l.right,
                width: l.width,
                opacity: l.opacity,
                transformOrigin: "top center",
                animation: `lantFloat ${l.duration} ease-in-out infinite`,
                animationDelay: l.delay,
              }}
            />
          ))}
          {lanternesLeft && LANTERNES_LEFT.map((l, i) => (
            <img
              key={"l" + i}
              src={l.src}
              alt=""
              style={{
                position: "absolute",
                top: l.top,
                left: l.left,
                width: l.width,
                opacity: l.opacity,
                transformOrigin: "top center",
                animation: `lantFloat ${l.duration} ease-in-out infinite`,
                animationDelay: l.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
