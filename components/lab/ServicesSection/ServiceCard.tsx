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
          ? "border-[#F5F2ED]/80 opacity-100"
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
        className="relative block w-full p-7 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-[#F5F2ED]"
      >
        {/* Numeração vertical: SERVIÇO eyebrow + número grande, red bar à esquerda */}
        <div className="flex items-start gap-3">
          <div className="mt-1 h-7 w-[1.5px] bg-[#FB3640]" aria-hidden />
          <div className="flex flex-col gap-0.5">
            <p
              className="text-[0.5rem] uppercase tracking-[0.4em] text-[#F5F2ED]/35"
              style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
            >
              Serviço
            </p>
            <p
              className="text-[0.95rem] leading-none text-[#F5F2ED]/80"
              style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
            >
              {service.index}
            </p>
          </div>
        </div>

        {/* Mini canvas 3D — largura fixa centralizada pra manter aspect ratio
            estável quando o card expande (evita re-projection "teleport") */}
        <div className="mt-6 flex justify-center">
          <div className="h-[170px] w-[260px] overflow-hidden">
            <ServiceMiniScene variant={service.variant} active={expanded} />
          </div>
        </div>

        {/* Título */}
        <h3
          className="mt-5 text-[1.55rem] leading-[1.1] text-[#F5F2ED]"
          style={{
            fontFamily: '"Panchang", sans-serif',
            fontWeight: 700,
            letterSpacing: "-0.015em",
          }}
        >
          {service.title}
        </h3>

        {/* Descrição teaser */}
        <p
          className="mt-3 text-[0.88rem] leading-[1.65] text-[#F5F2ED]/65"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 400 }}
        >
          {service.description}
        </p>

        {/* CTA inline com mais peso */}
        <div className="mt-6 flex items-center gap-3 border-t border-[#F5F2ED]/10 pt-4">
          <p
            className="flex-1 text-[0.6rem] uppercase tracking-[0.35em] text-[#F5F2ED]/90"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            {expanded ? "Recolher" : "Saber mais"}
          </p>
          <svg
            aria-hidden
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="#FB3640"
            className="transition-transform duration-300"
            style={{ transform: expanded ? "rotate(-90deg)" : "rotate(0deg)" }}
          >
            <polygon points="3,2 14,8 3,14" />
          </svg>
        </div>
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
          <div className="border-t border-[#F5F2ED]/10 px-7 pb-7 pt-6">
            {/* INCLUI label */}
            <div
              className="flex items-center gap-3"
              style={{
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                transitionDelay: `${detailStagger(0)}ms`,
              }}
            >
              <span className="h-[1px] w-6 bg-[#FB3640]/80" aria-hidden />
              <p
                className="text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/65"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                Inclui
              </p>
            </div>
            <ul
              className="mt-4 space-y-2 text-[0.88rem] leading-[1.6] text-[#F5F2ED]/85"
              style={{ fontFamily: '"Satoshi", sans-serif' }}
            >
              {service.includes.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                  style={{
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                    transitionDelay: `${detailStagger(1 + i)}ms`,
                  }}
                >
                  <svg
                    aria-hidden
                    width="8"
                    height="8"
                    viewBox="0 0 16 16"
                    fill="#FB3640"
                    className="mt-1.5 flex-shrink-0"
                  >
                    <polygon points="3,2 14,8 3,14" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Separator entre INCLUI e INDICADO PRA */}
            <div
              className="my-6 h-[1px] w-full bg-[#F5F2ED]/8"
              aria-hidden
              style={{
                opacity: expanded ? 1 : 0,
                transition: "opacity 0.4s ease-out",
                transitionDelay: `${detailStagger(1 + service.includes.length) - 30}ms`,
              }}
            />

            {/* INDICADO PRA */}
            <div
              className="flex items-center gap-3"
              style={{
                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                transitionDelay: `${detailStagger(1 + service.includes.length)}ms`,
              }}
            >
              <span className="h-[1px] w-6 bg-[#FB3640]/80" aria-hidden />
              <p
                className="text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/65"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                Indicado pra
              </p>
            </div>
            <p
              className="mt-3 text-[0.88rem] leading-[1.65] text-[#F5F2ED]/80"
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

            {/* CTA mailto — peso visual maior */}
            <a
              href={mailHref}
              className="group/cta mt-7 inline-flex w-fit items-center gap-3 border border-[#F5F2ED]/50 bg-[#F5F2ED]/[0.02] px-6 py-3.5 text-[0.6rem] uppercase tracking-[0.35em] text-[#F5F2ED] transition-colors hover:border-[#FB3640] hover:bg-[#FB3640]/[0.06] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2ED]"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 500,
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
                width="12"
                height="12"
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
