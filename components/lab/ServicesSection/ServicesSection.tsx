"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SERVICES } from "@/data/services";
import ServiceCard from "./ServiceCard";

const TerrainBackground = dynamic(
  () => import("./TerrainBackground"),
  { ssr: false },
);

/**
 * Seção Serviços da Home — 3 cards expandíveis (acordeon).
 *
 * Layout flex (desktop): flex-grow muda quando 1 card está expandido.
 * Mobile: stack vertical.
 *
 * Animação de entrada:
 *  - Header (eyebrow + headline + sub): fade-in com translateY ao entrar
 *    no viewport, stagger 100ms entre elementos.
 *  - Cards: fade-in com translateY 14px, stagger 150ms via enterDelay.
 *
 * Background: TerrainScene transparente.
 */
/**
 * @param inPage `false` (default) → scroller interno (uso isolado no /lab).
 *   `true` → fluxo de página (Home): `relative` sem scroller interno e fundos
 *   `absolute` presos à seção.
 */
export default function ServicesSection({
  inPage = false,
}: {
  inPage?: boolean;
} = {}) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [headerEntered, setHeaderEntered] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Renderiza só os cards do breakpoint ativo. Antes, desktop (lg:flex) E
  // mobile (lg:hidden) montavam os 3 ServiceCards CADA → 6 mini-scenes
  // (6 contextos WebGL). Renderizar um só corta isso pela metade.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : true,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const handleToggle = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  const someExpanded = expandedSlug !== null;

  /** flex-grow por card: expandido = 2.6, inativos = 0.7, neutro = 1. */
  const flexGrowFor = (slug: string) => {
    if (!expandedSlug) return 1;
    return slug === expandedSlug ? 2.6 : 0.7;
  };

  // Entry do header via IntersectionObserver
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setHeaderEntered(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setHeaderEntered(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Click fora dos cards fecha o expandido. Esc também.
  useEffect(() => {
    if (!expandedSlug) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (!target.closest("[data-service-card]")) {
        setExpandedSlug(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedSlug(null);
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [expandedSlug]);

  return (
    <section
      data-cursor="triangle"
      className={`bg-[#000F08] py-24 sm:py-32 ${
        inPage ? "relative min-h-screen" : "absolute inset-0 overflow-y-auto"
      }`}
      aria-labelledby="services-headline"
    >
      {/* Background terrain mesh. Na Home (`inPage`) é `absolute` preso à seção. */}
      <div
        className={`pointer-events-none ${
          inPage ? "absolute" : "fixed"
        } inset-0 z-0 opacity-[0.22]`}
      >
        <TerrainBackground />
      </div>

      {/* Vignette overlay — escurece bordas top e bottom pra dar profundidade */}
      <div
        className={`pointer-events-none ${
          inPage ? "absolute" : "fixed"
        } inset-0 z-[1]`}
        style={{
          background:
            "linear-gradient(180deg, rgba(0,15,8,0.85) 0%, rgba(0,15,8,0) 22%, rgba(0,15,8,0) 78%, rgba(0,15,8,0.9) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-10">
        {/* Header */}
        <div ref={headerRef}>
          {/* Eyebrow: número da seção + red bar + label */}
          <div
            className="flex items-center gap-4"
            style={{
              opacity: headerEntered ? 1 : 0,
              transform: headerEntered ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              transitionDelay: "0ms",
            }}
          >
            <span
              className="text-[0.65rem] uppercase tracking-[0.35em] text-[#F5F2ED]/35"
              style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 500 }}
            >
              05
            </span>
            <span className="h-[1px] w-12 bg-[#FB3640]/70" aria-hidden />
            <p
              className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
              style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
            >
              Serviços
            </p>
          </div>

          {/* Headline */}
          <h2
            id="services-headline"
            className="mt-7 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] text-[#F5F2ED]"
            style={{
              fontFamily: '"Panchang", sans-serif',
              fontWeight: 700,
              letterSpacing: "-0.025em",
              opacity: headerEntered ? 1 : 0,
              transform: headerEntered ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "120ms",
            }}
          >
            Construímos presença digital.
          </h2>

          {/* Sub + decorative trail */}
          <div
            className="mt-5 flex items-center gap-5"
            style={{
              opacity: headerEntered ? 1 : 0,
              transform: headerEntered ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "240ms",
            }}
          >
            <p
              className="max-w-xl text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-[#F5F2ED]/65"
              style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 300 }}
            >
              Para empresas que levam a sério.
            </p>
            <span
              className="hidden h-[1px] flex-1 bg-[#F5F2ED]/10 sm:block"
              aria-hidden
            />
          </div>
        </div>

        {/* Cards — só o breakpoint ativo monta (evita canvas em dobro). */}
        {isDesktop ? (
          <div className="mt-16 flex items-start gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={service.slug}
                className="min-w-0"
                style={{
                  flex: `${flexGrowFor(service.slug)} 1 0`,
                  transition: "flex 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
                }}
              >
                <ServiceCard
                  service={service}
                  expanded={expandedSlug === service.slug}
                  someExpanded={someExpanded}
                  onToggle={() => handleToggle(service.slug)}
                  borderDelay={i * 0.15}
                  enterDelay={400 + i * 150}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col gap-4">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.slug}
                service={service}
                expanded={expandedSlug === service.slug}
                someExpanded={someExpanded}
                onToggle={() => handleToggle(service.slug)}
                borderDelay={i * 0.15}
                enterDelay={400 + i * 150}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
