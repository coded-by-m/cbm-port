"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { CaseProject } from "@/types/case";
import { CARD, FRAGMENT_SLOTS, SLIDESHOW } from "./config";
import { CardMeshPlaceholder } from "./CardMeshPlaceholder";
import SlideshowDots from "./SlideshowDots";

type Direction = "left" | "right" | null;

/**
 * Card de projetos (desktop fixo bottom-right) ou bottom sheet (mobile).
 *
 * Mobile (≤767px): bottom sheet full-width, sempre visível, layout 2 colunas.
 *
 * Desktop: card fixo no canto inferior direito do viewport. Estável mesmo
 * com a câmera 3D em movimento (tunnel mode). Conteúdo interno faz slide
 * direcional + crossfade ao trocar de projeto.
 */
export function ProjectCard({
  caseProject,
  isMobile,
  direction,
  activeSlug,
  allVisited,
  onSelectSlide,
}: {
  caseProject: CaseProject | null;
  isMobile: boolean;
  direction: Direction;
  activeSlug: string | null;
  allVisited: boolean;
  onSelectSlide: (slug: string) => void;
}) {
  // Posição angular dos fragmentos (ordem visual no orbital).
  const TWO_PI = Math.PI * 2;
  const angleOf = (s: { x: number; z: number }) =>
    ((Math.atan2(s.x, s.z) % TWO_PI) + TWO_PI) % TWO_PI;
  const orderedSlots = [...FRAGMENT_SLOTS].sort(
    (a, b) => angleOf(a) - angleOf(b),
  );
  const orderedIdx = (slug: string) =>
    orderedSlots.findIndex((s) => s.slug === slug);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Conteúdo "exibido" — separado da prop pra permitir slide-out → swap → slide-in.
  const [displayed, setDisplayed] = useState<CaseProject | null>(caseProject);

  // Fade do wrapper desktop conforme caseProject existe ou não.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || isMobile) return;
    const shouldShow = !!caseProject;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: shouldShow ? 1 : 0,
      duration: shouldShow ? CARD.fadeInDuration : CARD.fadeOutDuration,
      ease: shouldShow ? "power2.out" : "power2.in",
    });
  }, [caseProject, isMobile]);

  // Slide direcional ao trocar de projeto.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) {
      setDisplayed(caseProject);
      return;
    }
    if (caseProject?.slug === displayed?.slug) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const outDx = direction === "right" ? -12 : direction === "left" ? 12 : 0;
    const inDx = direction === "right" ? 12 : direction === "left" ? -12 : 0;

    if (reduceMotion) {
      gsap.killTweensOf(el);
      gsap.to(el, {
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          setDisplayed(caseProject);
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.1 });
        },
      });
      return;
    }

    const outDuration = (SLIDESHOW.transitionDuration * 0.4) / 1000;
    const inDuration = (SLIDESHOW.transitionDuration * 0.6) / 1000;
    gsap.killTweensOf(el);
    gsap.to(el, {
      x: outDx,
      opacity: 0,
      duration: outDuration,
      ease: "power2.in",
      onComplete: () => {
        setDisplayed(caseProject);
        gsap.fromTo(
          el,
          { x: inDx, opacity: 0 },
          { x: 0, opacity: 1, duration: inDuration, ease: "power2.out" },
        );
      },
    });
  }, [caseProject, displayed, direction]);

  const renderContent = (project: CaseProject) => {
    const isComingSoon = project.status === "coming-soon";
    const slot = FRAGMENT_SLOTS.find((s) => s.slug === project.slug);
    const seed = slot?.seed ?? 0;
    const positionIdx = orderedIdx(project.slug);
    const positionLabel =
      positionIdx >= 0
        ? `${String(positionIdx + 1).padStart(2, "0")} / ${String(orderedSlots.length).padStart(2, "0")}`
        : "";

    return (
      <div className={isMobile ? "grid grid-cols-[auto_1fr] gap-4" : "flex flex-col gap-4"}>
        {!isMobile && (
          <div className="flex items-center justify-between border-b border-[#F5F2ED]/10 pb-3 -mt-1">
            <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55">
              {positionLabel}
            </p>
            <span
              className={`text-[0.5rem] uppercase tracking-[0.3em] ${
                isComingSoon
                  ? "text-[#F5F2ED]/40"
                  : "text-[#FB3640]"
              }`}
            >
              {isComingSoon ? "Em breve" : "Publicado"}
            </span>
          </div>
        )}
        {/* Dual preview com scroll vertical contínuo. */}
        <div className={isMobile ? "flex gap-2" : "flex gap-3"}>
          <div className={isMobile ? "w-[100px]" : "flex-[3] min-w-0"}>
            {project.preview && !isComingSoon ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#F5F2ED]/20">
                <ImageWithFallback
                  src={project.preview.desktop}
                  alt={`${project.title} — preview desktop`}
                  fallback={
                    <CardMeshPlaceholder variant="desktop" seed={seed} />
                  }
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
          <div className={isMobile ? "w-[44px]" : "flex-1 min-w-0"}>
            {project.preview && !isComingSoon ? (
              <div className="relative aspect-[9/16] w-full overflow-hidden border border-[#F5F2ED]/20">
                <ImageWithFallback
                  src={project.preview.mobile}
                  alt={`${project.title} — preview mobile`}
                  fallback={
                    <CardMeshPlaceholder variant="mobile" seed={seed + 1} />
                  }
                />
              </div>
            ) : (
              <CardMeshPlaceholder variant="mobile" seed={seed + 1} />
            )}
          </div>
        </div>

        {/* Texto */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#97938b]">
            {isComingSoon
              ? `Em breve · ${project.meta.setor}`
              : `${project.meta.setor} · ${project.meta.ano}`}
          </p>
          <p
            className="text-lg leading-tight tracking-tight text-[#F5F2ED]"
            style={{
              fontFamily: '"Satoshi", sans-serif',
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {project.title}
          </p>
          <p className="text-[0.75rem] leading-relaxed text-[#F5F2ED]/65">
            {project.description}
          </p>
          {!isComingSoon && !isMobile && (
            <span className="mt-3 inline-flex w-fit items-center gap-3 border border-[#F5F2ED]/40 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/95 transition-colors group-hover/card:border-[#F5F2ED] group-hover/card:bg-[#F5F2ED]/5">
              Ver projeto
              <span aria-hidden style={{ color: "#FB3640" }}>
                →
              </span>
            </span>
          )}
          {isComingSoon && !isMobile && (
            <span className="mt-3 inline-flex w-fit items-center gap-3 border border-[#F5F2ED]/15 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/45">
              Vertente em formação
            </span>
          )}
        </div>
      </div>
    );
  };

  // Estilo único para a animação CSS do scroll vertical (sempre presente).
  const scrollStyle = (
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
  );

  // Render mobile bottom-sheet.
  if (isMobile) {
    return (
      <div
        ref={wrapperRef}
        className="pointer-events-auto fixed bottom-0 left-0 right-0 z-30 border-t border-[#F5F2ED]/25 bg-[#000F08]/90 px-4 pb-4 pt-3 backdrop-blur-md"
      >
        {scrollStyle}
        <div className="mb-3 flex items-center justify-between">
          <SlideshowDots
            slots={FRAGMENT_SLOTS}
            activeSlug={activeSlug}
            onSelect={onSelectSlide}
          />
          {displayed && displayed.status !== "coming-soon" && (
            <Link
              href={`/cases/${displayed.slug}`}
              className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/85"
            >
              Ver projeto
              <span aria-hidden style={{ color: "#FB3640" }}>
                →
              </span>
            </Link>
          )}
        </div>
        <div ref={contentRef}>
          {displayed ? renderContent(displayed) : null}
        </div>
      </div>
    );
  }

  // Render desktop — card fixo no canto inferior direito do viewport.
  if (!displayed) {
    return (
      <div
        ref={wrapperRef}
        className="pointer-events-none fixed bottom-6 right-6 opacity-0"
        style={{ width: `${CARD.widthDesktop}px` }}
        aria-hidden
      />
    );
  }

  const isComingSoon = displayed.status === "coming-soon";
  const wrapperClassName =
    "pointer-events-auto fixed bottom-6 right-6 z-30 border border-[#F5F2ED]/30 bg-[#000F08]/85 backdrop-blur-md transition-colors duration-300 hover:border-[#F5F2ED]/60";

  const contentBlock = (
    <div ref={contentRef} className="px-5 pb-3 pt-5">
      {renderContent(displayed)}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ opacity: 0, width: `${CARD.widthDesktop}px` }}
    >
      {scrollStyle}
      {allVisited && (
        <div className="flex items-center justify-center gap-3 border-b border-[#F5F2ED]/10 bg-[#FB3640]/8 px-5 py-2">
          <span className="text-[0.5rem] uppercase tracking-[0.4em] text-[#FB3640]">
            ✦ Tour completo
          </span>
          <span className="text-[0.55rem] uppercase tracking-[0.3em] text-[#F5F2ED]/55">
            role pra continuar
          </span>
        </div>
      )}
      {isComingSoon ? (
        <div className="block">{contentBlock}</div>
      ) : (
        <Link href={`/cases/${displayed.slug}`} className="block group/card">
          {contentBlock}
        </Link>
      )}
      <div className="flex justify-center border-t border-[#F5F2ED]/10 px-5 py-3">
        <SlideshowDots
          slots={FRAGMENT_SLOTS}
          activeSlug={activeSlug}
          onSelect={onSelectSlide}
        />
      </div>
    </div>
  );
}

/**
 * `<img>` com fallback gracioso quando o asset falha (404, rede).
 *
 * Mantém o componente do card resiliente caso o usuário deploy sem dropar
 * as imagens em `public/cases/<slug>/`.
 */
function ImageWithFallback({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) return <>{fallback}</>;
  return (
    // biome-ignore lint/a11y/useAltText: alt prop is forwarded
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="card-preview-img absolute left-0 top-0 w-full object-cover object-top"
    />
  );
}
