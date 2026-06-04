"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ServiceConfig } from "@/data/services";
import ServiceMiniScene from "./ServiceMiniScene";
import { useBorderDraw } from "./useBorderDraw";

/**
 * Card individual de serviço.
 *
 * Dois estados: colapsado (compacto, ~420px alto) e expandido (~620px+ alto,
 * mostra deliverables + perfil + CTA mailto). Transição via GSAP. Border-draw
 * SVG ao entrar no viewport (stagger pelo `borderDelay` do orquestrador).
 */
export default function ServiceCard({
  service,
  expanded,
  onToggle,
  borderDelay,
}: {
  service: ServiceConfig;
  expanded: boolean;
  onToggle: () => void;
  borderDelay: number;
}) {
  const detailsRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useBorderDraw(pathRef, { delay: borderDelay });

  // Anima a abertura/fechamento do detalhes via height: auto manual.
  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.killTweensOf(el);

    if (expanded) {
      // Mede altura natural e anima até ela.
      gsap.set(el, { height: "auto" });
      const targetHeight = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: targetHeight,
          opacity: 1,
          duration: reduceMotion ? 0 : 0.55,
          ease: "power2.out",
          onComplete: () => {
            // Após anim, libera pra height auto pra acomodar conteúdo dinâmico.
            gsap.set(el, { height: "auto" });
          },
        },
      );
    } else {
      const currentHeight = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: currentHeight, opacity: 1 },
        {
          height: 0,
          opacity: 0,
          duration: reduceMotion ? 0 : 0.4,
          ease: "power2.in",
        },
      );
    }
  }, [expanded]);

  const mailHref = `mailto:contato.codedbym@gmail.com?subject=${encodeURIComponent(
    service.mailSubject,
  )}`;

  return (
    <div
      className={`relative border bg-[#0E1810] transition-all duration-500 ${
        expanded
          ? "border-[#F5F2ED]/70"
          : "border-[#1a2a1e] hover:border-[#F5F2ED]/35 hover:-translate-y-0.5"
      }`}
    >
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
        {/* Numeração */}
        <p
          className="text-[0.65rem] uppercase tracking-[0.4em] text-[#F5F2ED]/45"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
        >
          {service.index}
        </p>

        {/* Mini canvas 3D */}
        <div className="mt-4 h-[160px] w-full overflow-hidden">
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

      {/* Detalhes expandidos */}
      <div
        ref={detailsRef}
        id={`service-${service.slug}-details`}
        role="region"
        aria-label={`Detalhes do serviço ${service.title}`}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="border-t border-[#F5F2ED]/10 px-6 pb-6 pt-5">
          {/* INCLUI */}
          <p
            className="text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            Inclui
          </p>
          <ul
            className="mt-3 space-y-1.5 text-[0.85rem] leading-relaxed text-[#F5F2ED]/80"
            style={{ fontFamily: '"Satoshi", sans-serif' }}
          >
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-2">
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
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            Indicado pra
          </p>
          <p
            className="mt-2 text-[0.85rem] leading-relaxed text-[#F5F2ED]/75"
            style={{ fontFamily: '"Satoshi", sans-serif' }}
          >
            {service.indicatedFor}
          </p>

          {/* CTA mailto */}
          <a
            href={mailHref}
            className="group/cta mt-6 inline-flex w-fit items-center gap-3 border border-[#F5F2ED]/40 px-5 py-3 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED] transition-colors hover:border-[#F5F2ED] hover:bg-[#F5F2ED]/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2ED]"
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
  );
}
