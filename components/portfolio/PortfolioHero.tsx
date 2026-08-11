"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { waLink } from "@/lib/contact";
import { frameLabel } from "@/lib/portfolio";
import type { CaseProject } from "@/types/case";

/** `useLayoutEffect` no browser, `useEffect` no SSR (evita o warning do React). */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Primeira dobra do /portfolio.
 *
 * O projeto em destaque chega por prop — a página (server) resolve o
 * `FEATURED_SLUG` de `lib/portfolio.ts`. Assim o copy dos outros projetos
 * não vai pro bundle client.
 *
 * Timeline GSAP de ~1s rodando uma vez na entrada: eyebrow → statement →
 * linha de apoio → CTA → o frame subindo com leve scale. Tudo dentro de
 * `gsap.matchMedia()`, então com prefers-reduced-motion nada anima e o
 * conteúdo já nasce visível (o markup é visível por padrão; a timeline é
 * que esconde e revela, antes do primeiro paint).
 */
export function PortfolioHero({
  project,
}: {
  project: CaseProject | undefined;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        animate: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { animate } = context.conditions as { animate: boolean };
        if (!animate) return;

        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(q("[data-hero='eyebrow']"), {
          opacity: 0,
          y: 10,
          duration: 0.45,
        })
          .from(
            q("[data-hero='statement']"),
            { opacity: 0, y: 22, duration: 0.7 },
            "-=0.2",
          )
          .from(
            q("[data-hero='support']"),
            { opacity: 0, y: 16, duration: 0.6 },
            "-=0.42",
          )
          .from(
            q("[data-hero='cta']"),
            { opacity: 0, y: 14, duration: 0.55 },
            "-=0.38",
          )
          .from(
            q("[data-hero='frame']"),
            { opacity: 0, y: 34, scale: 0.97, duration: 0.85 },
            "-=0.5",
          );
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-cursor="default"
      aria-labelledby="portfolio-hero-headline"
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-28 lg:pt-24"
    >
      {/* Coluna de texto */}
      <div>
        <div data-hero="eyebrow" className="flex items-center gap-4">
          <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
          <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
            Coded by M · Florianópolis
          </p>
        </div>

        <h1
          id="portfolio-hero-headline"
          data-hero="statement"
          className="mt-7 max-w-xl font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.025em] text-cbm-white"
        >
          Uma presença digital à altura da empresa por trás dela.
        </h1>

        <p
          data-hero="support"
          className="mt-6 max-w-lg font-body text-[clamp(0.95rem,1.4vw,1.1rem)] font-light leading-relaxed text-cbm-white/65"
        >
          Landing pages, sites institucionais e aplicações web. Estratégia,
          design e código sob o mesmo teto — do diagnóstico ao site no ar.
        </p>

        <div data-hero="cta" className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="inline-flex items-center gap-2.5 bg-cbm-red px-7 py-4 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cbm-white transition-colors hover:bg-cbm-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            Começar um projeto
            <span aria-hidden>↗</span>
          </a>
          <a
            href="#projetos"
            data-cursor="triangle"
            className="inline-flex items-center gap-2 border-b border-cbm-white/25 pb-1 font-body text-[0.68rem] uppercase tracking-[0.22em] text-cbm-white/70 transition-colors hover:border-cbm-red hover:text-cbm-white focus-visible:text-cbm-white focus-visible:outline-none"
          >
            Ver projetos
          </a>
        </div>
      </div>

      {/* Projeto em destaque */}
      {project && (
        <div data-hero="frame">
          <Link
            href={`/cases/${project.slug}`}
            aria-label={`Ver o projeto ${project.title}`}
            data-cursor="triangle"
            className="group block outline-none focus-visible:ring-2 focus-visible:ring-cbm-red"
          >
            <BrowserFrame url={frameLabel(project)}>
              <div className="aspect-[16/11] w-full overflow-hidden bg-cbm-forest">
                {project.preview?.desktop && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.preview.desktop}
                    alt={`${project.title} — preview do site`}
                    className="w-full object-cover object-top"
                  />
                )}
              </div>
            </BrowserFrame>
            <p className="mt-4 font-body text-[0.62rem] uppercase tracking-[0.28em] text-cbm-white/45">
              {project.meta.tipo} · {project.meta.setor}
            </p>
          </Link>
        </div>
      )}
    </section>
  );
}
