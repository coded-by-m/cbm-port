"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { CaseProject } from "@/types/case";
import { CARD, FRAGMENT_SLOTS } from "./config";
import { CardMeshPlaceholder } from "./CardMeshPlaceholder";

type Pos = { x: number; y: number; visible: boolean } | null;

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

/**
 * Card de hover dos projetos (dual preview).
 *
 * Wrapper sempre montado (ref estável) — posição via DOM imperativo,
 * fade in/out via GSAP. Conteúdo envolto em `<Link>` quando publicado;
 * "Em breve" exibe placeholder triangulado sem link.
 *
 * Layout dual preview: desktop (~75% da largura) + mobile (~25%) lado a lado.
 */
export function ProjectCard({
  caseProject,
  pos,
}: {
  caseProject: CaseProject | null;
  pos: Pos;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !pos || !pos.visible || !caseProject) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const left = clamp(
      pos.x + CARD.offsetX,
      CARD.margin,
      window.innerWidth - w - CARD.margin,
    );
    const top = clamp(
      pos.y - h - CARD.offsetY,
      CARD.margin,
      window.innerHeight - h - CARD.margin,
    );
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [pos, caseProject]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const shouldShow = !!(caseProject && pos?.visible);
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: shouldShow ? 1 : 0,
      duration: shouldShow ? CARD.fadeInDuration : CARD.fadeOutDuration,
      ease: shouldShow ? "power2.out" : "power2.in",
    });
  }, [caseProject, pos]);

  if (!caseProject) {
    return (
      <div
        ref={ref}
        className="pointer-events-none fixed left-0 top-0 opacity-0"
        aria-hidden
      />
    );
  }

  const isComingSoon = caseProject.status === "coming-soon";
  const slot = FRAGMENT_SLOTS.find((s) => s.slug === caseProject.slug);
  const seed = slot?.seed ?? 0;

  const content = (
    <div className="flex flex-col gap-4">
      {/* Dual preview com scroll vertical contínuo. */}
      <div className="flex gap-3">
        <div className="flex-[3] min-w-0">
          {caseProject.preview && !isComingSoon ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#F5F2ED]/20">
              {/* biome-ignore lint/a11y/useAltText: alt no img */}
              <img
                src={caseProject.preview.desktop}
                alt={`${caseProject.title} — preview desktop`}
                className="card-preview-img absolute left-0 top-0 w-full object-cover object-top"
              />
            </div>
          ) : (
            <CardMeshPlaceholder
              variant="desktop"
              seed={seed}
              label={isComingSoon ? "Em breve" : undefined}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {caseProject.preview && !isComingSoon ? (
            <div className="relative aspect-[9/16] w-full overflow-hidden border border-[#F5F2ED]/20">
              {/* biome-ignore lint/a11y/useAltText: alt no img */}
              <img
                src={caseProject.preview.mobile}
                alt={`${caseProject.title} — preview mobile`}
                className="card-preview-img absolute left-0 top-0 w-full object-cover object-top"
              />
            </div>
          ) : (
            <CardMeshPlaceholder variant="mobile" seed={seed + 1} />
          )}
        </div>
      </div>
      <style>{`
        @keyframes card-preview-img-scroll {
          0%   { transform: translateY(0%); }
          50%  { transform: translateY(-65%); }
          100% { transform: translateY(0%); }
        }
        .card-preview-img {
          animation: card-preview-img-scroll 18s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-preview-img { animation: none !important; }
        }
      `}</style>

      {/* Texto */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#97938b]">
          {isComingSoon
            ? `Em breve · ${caseProject.meta.setor}`
            : `${caseProject.meta.setor} · ${caseProject.meta.ano}`}
        </p>
        <p
          className="text-lg leading-tight tracking-tight text-[#F5F2ED]"
          style={{
            fontFamily: '"Satoshi", sans-serif',
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {caseProject.title}
        </p>
        <p className="text-[0.75rem] leading-relaxed text-[#F5F2ED]/65">
          {caseProject.description}
        </p>
        {!isComingSoon && (
          <p className="mt-2 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/85">
            Ver projeto
            <span aria-hidden style={{ color: "#FB3640" }}>
              →
            </span>
          </p>
        )}
      </div>
    </div>
  );

  const wrapperClassName =
    "pointer-events-auto fixed z-30 border border-[#F5F2ED]/30 bg-[#000F08]/85 backdrop-blur-md transition-colors duration-300 hover:border-[#F5F2ED]/60";

  return (
    <div
      ref={ref}
      className={wrapperClassName}
      style={{ opacity: 0, width: `${CARD.widthDesktop}px` }}
    >
      {isComingSoon ? (
        <div className="block px-5 py-5">{content}</div>
      ) : (
        <Link
          href={`/cases/${caseProject.slug}`}
          className="block px-5 py-5"
        >
          {content}
        </Link>
      )}
    </div>
  );
}
