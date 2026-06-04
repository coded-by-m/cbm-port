"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceConfig } from "@/data/services";
import ServiceMiniScene from "./ServiceMiniScene";
import { useBorderDraw } from "./useBorderDraw";

/**
 * Card individual de serviço — polished.
 *
 * Estados visuais:
 *  - Colapsado neutro: scale 1, opacity 1, hover lift -1
 *  - Colapsado dim (outro expandido): scale 0.96, opacity 0.4
 *  - Expandido: scale 1.02, border bright, left red bar visible
 *
 * Detalhes da entrada (viewport):
 *  - Card inteiro: fade + translateY 12px → 0, com enterDelay próprio
 *  - Border-draw SVG (stagger via borderDelay)
 *
 * Detalhes da expansão (acordeon):
 *  - Outer container: grid-template-rows 0fr → 1fr (suave)
 *  - Inner items: stagger sequencial via transition-delay quando expanded
 *    (Inclui label, cada bullet, Indicado pra label, parágrafo, CTA)
 */
export default function ServiceCard({
  service,
  expanded,
  someExpanded,
  onToggle,
  borderDelay,
  enterDelay = 0,
}: {
  service: ServiceConfig;
  expanded: boolean;
  someExpanded: boolean;
  onToggle: () => void;
  borderDelay: number;
  /** ms de delay na entrada por viewport — stagger entre cards. */
  enterDelay?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [entered, setEntered] = useState(false);

  useBorderDraw(pathRef, { delay: borderDelay });

  // IntersectionObserver — anima entrada do card.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setEntered(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setEntered(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isDimmed = someExpanded && !expanded;
  const mailHref = `mailto:contato.codedbym@gmail.com?subject=${encodeURIComponent(
    service.mailSubject,
  )}`;

  // Stagger interno: delays em ms quando expanded vira true.
  const detailStagger = (i: number) => (expanded ? 280 + i * 70 : 0);

  return (
    <div
      ref={wrapperRef}
      data-service-card
      className={`relative border bg-[#0E1810] transition-all duration-500 ease-out ${
        expanded
          ? "scale-[1.02] border-[#F5F2ED]/80 opacity-100"
          : isDimmed
            ? "scale-[0.96] border-[#1a2a1e] opacity-40"
            : "scale-100 border-[#1a2a1e] opacity-100 hover:-translate-y-1 hover:border-[#F5F2ED]/40"
      }`}
      style={{
        transformOrigin: "center center",
        opacity: entered ? undefined : 0,
        transform: entered ? undefined : "translateY(14px)",
        transitionDelay: entered ? "0ms" : `${enterDelay}ms`,
      }}
    >
      {/* Indicador ativo: barra vermelha esquerda */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[3px] bg-[#FB3640] transition-opacity duration-500 ease-out"
        style={{ opacity: expanded ? 1 : 0 }}
      />

      {/* SVG border-draw overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 0,0 L 100,0 L 100,100 L 0,100 Z"
          stroke="#F5F2ED"
          strokeWidth={0.6}
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0.7 }}
        />
      </svg>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`service-${service.slug}-details`}
        className="relative block w-full p-6 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-[#F5F2ED]"
      >
        {/* Tratamento da numeração: red vertical line + SERVIÇO eyebrow + 01 */}
        <div className="flex items-center gap-3 border-l-[1.5px] border-[#FB3640] pl-3">
          <p
            className="text-[0.5rem] uppercase tracking-[0.4em] text-[#F5F2ED]/40"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            Serviço
          </p>
          <p
            className="text-[0.7rem] uppercase tracking-[0.4em] text-[#F5F2ED]/65"
            style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
          >
            {service.index}
          </p>
        </div>

        {/* Mini canvas 3D */}
        <div className="mt-5 h-[160px] w-full overflow-hidden">
          <ServiceMiniScene variant={service.variant} active={expanded} />
        </div>

        {/* Título */}
        <h3
          className="mt-4 text-[1.5rem] leading-tight text-[#F5F2ED]"
          style={{
            fontFamily: '"Panchang", sans-serif',
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {service.title}
        </h3>

        {/* Descrição teaser */}
        <p
          className="mt-3 text-[0.85rem] leading-relaxed text-[#F5F2ED]/65"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 400 }}
        >
          {service.description}
        </p>

        {/* CTA inline (colapsado) ou seta indicando expandido */}
        <p className="mt-5 inline-flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/85">
          {expanded ? "Recolher" : "Saber mais"}
          <svg
            aria-hidden
            width="11"
            height="11"
            viewBox="0 0 16 16"
            fill="#FB3640"
            className="inline-block transition-transform duration-300"
            style={{ transform: expanded ? "rotate(-90deg)" : "rotate(0deg)" }}
          >
            <polygon points="3,2 14,8 3,14" />
          </svg>
        </p>
      </button>

      {/* Detalhes expandidos — grid-template-rows trick */}
      <div
        id={`service-${service.slug}-details`}
        role="region"
        aria-label={`Detalhes do serviço ${service.title}`}
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#F5F2ED]/10 px-6 pb-6 pt-5">
            {/* INCLUI label */}
            <p
              className="text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 500,
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                transitionDelay: `${detailStagger(0)}ms`,
              }}
            >
              Inclui
            </p>
            <ul
              className="mt-3 space-y-1.5 text-[0.85rem] leading-relaxed text-[#F5F2ED]/80"
              style={{ fontFamily: '"Satoshi", sans-serif' }}
            >
              {service.includes.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-2"
                  style={{
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                    transitionDelay: `${detailStagger(1 + i)}ms`,
                  }}
                >
                  <span aria-hidden className="mt-2 text-[#FB3640]">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* INDICADO PRA */}
            <p
              className="mt-5 text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 500,
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                transitionDelay: `${detailStagger(1 + service.includes.length)}ms`,
              }}
            >
              Indicado pra
            </p>
            <p
              className="mt-2 text-[0.85rem] leading-relaxed text-[#F5F2ED]/75"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                transitionDelay: `${detailStagger(2 + service.includes.length)}ms`,
              }}
            >
              {service.indicatedFor}
            </p>

            {/* CTA mailto */}
            <a
              href={mailHref}
              className="group/cta mt-6 inline-flex w-fit items-center gap-3 border border-[#F5F2ED]/40 px-5 py-3 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED] transition-colors hover:border-[#F5F2ED] hover:bg-[#F5F2ED]/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2ED]"
              style={{
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateY(0)" : "translateY(6px)",
                transition:
                  "opacity 0.4s ease-out, transform 0.4s ease-out, border-color 0.3s, background-color 0.3s",
                transitionDelay: `${detailStagger(3 + service.includes.length)}ms`,
              }}
            >
              Conversar sobre este serviço
              <svg
                aria-hidden
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="#FB3640"
                className="inline-block group-hover/cta:animate-[spin_1.4s_linear_infinite]"
              >
                <polygon points="3,2 14,8 3,14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
