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
export default function ServicesSection() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [headerEntered, setHeaderEntered] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

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
      className="absolute inset-0 overflow-y-auto bg-[#000F08] py-24 sm:py-32"
      aria-labelledby="services-headline"
    >
      {/* Background terrain mesh — bem transparente */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.22]">
        <TerrainBackground />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-10">
        {/* Header */}
        <div ref={headerRef}>
          {/* Eyebrow com red bar */}
          <div
            className="flex items-center gap-3 border-l-[1.5px] border-[#FB3640] pl-3"
            style={{
              opacity: headerEntered ? 1 : 0,
              transform: headerEntered ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              transitionDelay: "0ms",
            }}
          >
            <p
              className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/50"
              style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
            >
              Serviços
            </p>
          </div>

          {/* Headline */}
          <h2
            id="services-headline"
            className="mt-5 text-[clamp(2rem,4vw,3.25rem)] leading-tight text-[#F5F2ED]"
            style={{
              fontFamily: '"Panchang", sans-serif',
              fontWeight: 700,
              letterSpacing: "-0.02em",
              opacity: headerEntered ? 1 : 0,
              transform: headerEntered ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "120ms",
            }}
          >
            Construímos presença digital.
          </h2>

          {/* Sub */}
          <p
            className="mt-3 text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-[#F5F2ED]/60"
            style={{
              fontFamily: '"Satoshi", sans-serif',
              fontWeight: 300,
              opacity: headerEntered ? 1 : 0,
              transform: headerEntered ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "240ms",
            }}
          >
            Para empresas que levam a sério.
          </p>
        </div>

        {/* Cards row — desktop flex */}
        <div className="mt-16 hidden items-start gap-6 lg:flex">
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

        {/* Cards stack mobile/tablet */}
        <div className="mt-16 flex flex-col gap-4 lg:hidden">
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
      </div>
    </section>
  );
}
