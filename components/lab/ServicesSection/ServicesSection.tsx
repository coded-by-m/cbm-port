"use client";

import { useState } from "react";
import { SERVICES } from "@/data/services";
import ServiceCard from "./ServiceCard";

/**
 * Seção Serviços da Home — 3 cards expandíveis (acordeon).
 *
 * Layout grid responsivo:
 *  - Desktop (≥1024px): 3 colunas; quando um card expande, ele ocupa ~2.4
 *    unidades enquanto os outros encolhem (via grid-template-columns dinâmico).
 *  - Mobile (<768px): stack vertical, expand cresce em altura.
 *
 * Estado: apenas 1 card expandido por vez (acordeon).
 */
export default function ServicesSection() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const handleToggle = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  // Grid template columns dinâmico: quando expandido, o card ativo ganha mais espaço.
  const gridTemplate = expandedSlug
    ? SERVICES.map((s) => (s.slug === expandedSlug ? "2.4fr" : "1fr")).join(" ")
    : "1fr 1fr 1fr";

  return (
    <section
      data-cursor="triangle"
      className="absolute inset-0 overflow-y-auto bg-[#000F08] py-24 sm:py-32"
      aria-labelledby="services-headline"
    >
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
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
              onToggle={() => handleToggle(service.slug)}
              borderDelay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
