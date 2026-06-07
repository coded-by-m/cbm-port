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
  live,
  onForward,
  onBack,
}: {
  inPage?: boolean;
  /** Capítulo ativo (na Home) → entrada sincronizada com o wipe de chegada. */
  live?: boolean;
  /** Rolar ↓ no FIM da seção → próximo capítulo (wipe pra Projetos). */
  onForward?: () => void;
  /** Rolar ↑ no TOPO → capítulo anterior (wipe pro Problema). */
  onBack?: () => void;
} = {}) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [headerEntered, setHeaderEntered] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const onForwardRef = useRef(onForward);
  onForwardRef.current = onForward;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  // Entrada sincronizada: assim que a seção fica ativa (logo após o wipe
  // revelar), dispara a entrada — não espera só o IntersectionObserver.
  useEffect(() => {
    if (live) setHeaderEntered(true);
  }, [live]);

  // Wipe nas BORDAS: a seção rola livre por dentro (cards), mas ao chegar no
  // fim e rolar ↓ → wipe pro próximo capítulo; no topo e rolar ↑ → wipe pro
  // anterior. Assim nunca trava no meio do scroll entre seções.
  useEffect(() => {
    if (!inPage || !live) return;
    const el = sectionRef.current;
    if (!el) return;
    let cooldown = false;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const fire = (fn?: () => void) => {
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, 1100);
      accum = 0;
      fn?.();
    };
    const onWheel = (e: WheelEvent) => {
      if (cooldown) return;
      const rect = el.getBoundingClientRect();
      const atBottom = rect.bottom <= window.innerHeight + 2;
      const atTop = rect.top >= -2;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accum = 0;
      }, 200);
      if (e.deltaY > 0 && atBottom) {
        e.preventDefault();
        accum += e.deltaY;
        if (accum > 90) fire(onForwardRef.current);
      } else if (e.deltaY < 0 && atTop) {
        e.preventDefault();
        accum += e.deltaY;
        if (accum < -90) fire(onBackRef.current);
      } else {
        accum = 0; // no meio → scroll livre
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [inPage, live]);

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
      ref={sectionRef}
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
        <TerrainBackground active={live} />
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
              04
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

        {/* Hint claro — convida a abrir um card; some quando algo expande. */}
        <div
          className="mt-8 flex items-center gap-2.5"
          style={{
            opacity: headerEntered && !someExpanded ? 1 : 0,
            transform: headerEntered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.45s ease-out, transform 0.6s ease-out",
            transitionDelay: someExpanded ? "0ms" : "380ms",
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <span
            className="h-[1px] w-6 bg-[#FB3640]/70"
            style={{ animation: "svc-hint-pulse 2s ease-in-out infinite" }}
          />
          <p
            className="text-[0.6rem] uppercase tracking-[0.35em] text-[#F5F2ED]/45"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            Clique em um serviço para explorar
          </p>
          <style>{`@keyframes svc-hint-pulse { 0%,100% { opacity: 0.5; transform: scaleX(1); } 50% { opacity: 1; transform: scaleX(1.6); } }`}</style>
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
                  play={headerEntered}
                  live={live}
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
                play={headerEntered}
                live={live}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
