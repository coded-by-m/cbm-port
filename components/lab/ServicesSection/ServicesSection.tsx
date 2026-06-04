"use client";

import { useState } from "react";
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
 * Layout grid responsivo desktop (≥1024px):
 *  - Default: `1fr 1fr 1fr` (3 colunas iguais)
 *  - Quando 1 card expandido: ativo `2.6fr`, inativos `0.7fr` (encolhem
 *    visivelmente). Outros cards também recebem opacity 0.45 e scale 0.96
 *    via GSAP no ServiceCard pra reforçar a hierarquia visual.
 *
 * Mobile (<768px): stack vertical, expand cresce em altura, sem mudança de
 * scale/opacity nos outros.
 *
 * Estado: apenas 1 card expandido por vez (acordeon).
 *
 * Background: TerrainScene transparente (~0.22 opacity) por trás.
 */
export default function ServicesSection() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const handleToggle = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  const gridTemplate = expandedSlug
    ? SERVICES.map((s) => (s.slug === expandedSlug ? "2.6fr" : "0.7fr")).join(
        " ",
      )
    : "1fr 1fr 1fr";

  const someExpanded = expandedSlug !== null;

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
        {/* Eyebrow */}
        <p
          className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/50"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          Serviços
        </p>

        {/* Headline + Sub */}
        <h2
          id="services-headline"
          className="mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-tight text-[#F5F2ED]"
          style={{
            fontFamily: '"Panchang", sans-serif',
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Construímos presença digital.
        </h2>
        <p
          className="mt-3 text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-[#F5F2ED]/60"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 300 }}
        >
          Para empresas que levam a sério.
        </p>

        {/* Cards grid */}
        <div
          className="mt-16 hidden gap-6 transition-[grid-template-columns] duration-500 lg:grid"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.slug}
              service={service}
              expanded={expandedSlug === service.slug}
              someExpanded={someExpanded}
              onToggle={() => handleToggle(service.slug)}
              borderDelay={i * 0.15}
            />
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
