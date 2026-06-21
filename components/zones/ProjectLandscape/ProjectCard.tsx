"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { CaseProject } from "@/types/case";
import { CARD, FRAGMENT_SLOTS, PROJECT_TYPE_COLOR, SLIDESHOW } from "./config";
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
  const borderPathRef = useRef<SVGPathElement>(null);
  const firstShownRef = useRef(false); // cascata/border-draw só na 1ª aparição

  // Conteúdo "exibido" — separado da prop pra permitir slide-out → swap → slide-in.
  const [displayed, setDisplayed] = useState<CaseProject | null>(caseProject);

  // Fade do wrapper desktop + (na 1ª aparição) cascata dos elementos internos
  // e border-draw da moldura.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (isMobile) {
      // O bottom-sheet é sempre visível. `isMobile` pode virar `true` só após o
      // 1º render (matchMedia em effect) — nesse intervalo o caminho desktop
      // abaixo roda e deixa `opacity:0`/`transform` inline no MESMO nó. Limpa,
      // senão o card "some" no mobile.
      gsap.killTweensOf(el);
      gsap.set(el, { opacity: 1, clearProps: "transform" });
      return;
    }
    const shouldShow = !!caseProject;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: shouldShow ? 1 : 0,
      y: shouldShow ? 0 : 16, // sobe ao surgir, desce ao sair
      duration: shouldShow ? CARD.fadeInDuration : CARD.fadeOutDuration,
      ease: shouldShow ? "power3.out" : "power2.in",
    });

    if (!shouldShow) {
      firstShownRef.current = false; // reseta → reanima na próxima entrada
      return;
    }
    if (firstShownRef.current) return;
    firstShownRef.current = true;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const staggerEls = el.querySelectorAll(".card-stagger");
    const path = borderPathRef.current;

    if (reduceMotion) {
      gsap.set(staggerEls, { opacity: 1, y: 0 });
      if (path) path.style.opacity = "0";
      return;
    }

    // Cascata: preview → título → descrição → CTA entram escalonados.
    gsap.fromTo(
      staggerEls,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.15,
        ease: "power2.out",
      },
    );

    // Border-draw: a moldura se desenha e depois cede pra borda CSS.
    if (path) {
      path.setAttribute("pathLength", "1");
      path.style.strokeDasharray = "1 1";
      path.style.strokeDashoffset = "1";
      path.style.opacity = "0.7";
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.9,
        delay: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(path, {
            opacity: 0,
            duration: 0.6,
            delay: 0.3,
            ease: "power2.in",
          });
        },
      });
    }
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
    const typeColor =
      !isComingSoon && project.type != null
        ? PROJECT_TYPE_COLOR[project.type]
        : null;
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
          <div className="card-stagger flex items-center justify-between border-b border-[#F5F2ED]/10 pb-3 -mt-1">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] tabular-nums text-[#F5F2ED]/55">
              {positionLabel}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 border px-2 py-[3px] text-[0.5rem] uppercase tracking-[0.3em] ${
                isComingSoon
                  ? "border-[#F5F2ED]/15 text-[#F5F2ED]/45"
                  : "border-[#FB3640]/40 text-[#FB3640]"
              }`}
            >
              <span
                className="h-1 w-1 rounded-full"
                style={{
                  backgroundColor: isComingSoon ? "#97938b" : "#FB3640",
                  animation: isComingSoon
                    ? undefined
                    : "card-status-pulse 1.8s ease-in-out infinite",
                }}
              />
              {isComingSoon ? "Em breve" : "Publicado"}
            </span>
          </div>
        )}
        {/* Dual preview com scroll vertical contínuo. */}
        <div className={`card-stagger ${isMobile ? "flex gap-2" : "flex gap-3"}`}>
          <div className={isMobile ? "w-[100px]" : "flex-[3] min-w-0"}>
            {!isMobile && (
              <p className="mb-1.5 text-[0.5rem] uppercase tracking-[0.3em] text-[#F5F2ED]/40">
                Desktop
              </p>
            )}
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
            {!isMobile && (
              <p className="mb-1.5 text-[0.5rem] uppercase tracking-[0.3em] text-[#F5F2ED]/40">
                Mobile
              </p>
            )}
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
        <div className="card-stagger flex min-w-0 flex-col gap-1.5">
          <p className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.4em] text-[#97938b]">
            {typeColor && (
              <span
                aria-hidden
                className="inline-block h-[2px] w-3.5 flex-shrink-0"
                style={{ backgroundColor: typeColor }}
              />
            )}
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
            <span className="mt-4 flex w-full items-center justify-between gap-3 border border-[#FB3640]/50 bg-[#FB3640]/[0.08] px-5 py-3 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#F5F2ED] transition-all duration-300 group-hover/card:border-[#FB3640] group-hover/card:bg-[#FB3640]">
              Ver projeto
              <svg
                aria-hidden
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="#F5F2ED"
                className="transition-transform duration-300 group-hover/card:translate-x-1.5"
              >
                <polygon points="3,2 14,8 3,14" />
              </svg>
            </span>
          )}
          {isComingSoon && !isMobile && (
            <a
              href="mailto:matheusmendes077@gmail.com?subject=Interesse no projeto"
              className="mt-3 inline-flex w-fit items-center gap-3 border border-[#F5F2ED]/25 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/70 transition-colors hover:border-[#F5F2ED]/70 hover:text-[#F5F2ED]"
            >
              Conversar sobre primeiros projetos
              <svg
                aria-hidden
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="#FB3640"
                className="relative inline-block opacity-70 group-hover/card:opacity-100"
              >
                <polygon points="3,2 14,8 3,14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    );
  };

  // Estilo do card. O preview fica ESTÁTICO no topo por padrão (mostra o
  // herói da página); o scroll vertical contínuo distraía e, em alguns
  // assets, expunha área em branco no fim do loop. Só rola no hover do card
  // (desktop), como reforço opcional — nunca à toa.
  const scrollStyle = (
    <style>{`
      @keyframes card-preview-img-scroll {
        0%   { transform: translateY(0%); }
        50%  { transform: translateY(-55%); }
        100% { transform: translateY(0%); }
      }
      .card-preview-img {
        transform: translateY(0%);
      }
      .group\\/card:hover .card-preview-img {
        animation: card-preview-img-scroll 22s ease-in-out infinite;
      }
      @keyframes card-status-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.35; transform: scale(0.7); }
      }
      @media (prefers-reduced-motion: reduce) {
        .group\\/card:hover .card-preview-img { animation: none !important; }
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
  const ghostNum = String(orderedIdx(displayed.slug) + 1).padStart(2, "0");
  const wrapperClassName =
    "pointer-events-auto fixed bottom-6 right-6 z-30 overflow-hidden border border-[#F5F2ED]/30 bg-[#000F08]/85 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md transition-colors duration-300 hover:border-[#F5F2ED]/60";

  const contentBlock = (
    <div ref={contentRef} className="px-5 pb-3 pt-5">
      {renderContent(displayed)}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{
        opacity: 0,
        transform: "translateY(16px)",
        width: `${CARD.widthDesktop}px`,
      }}
      role="complementary"
      aria-label={`Projeto ativo: ${displayed.title}`}
      aria-live="polite"
    >
      {scrollStyle}

      {/* Número-fantasma editorial — posição do projeto, fraco atrás (contido
          no canto sup-direito pra não fatiar o layout). */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-3 z-0 select-none leading-none"
        style={{
          fontFamily: '"Panchang", sans-serif',
          fontWeight: 700,
          fontSize: "3.4rem",
          color: "rgba(245,242,237,0.07)",
        }}
      >
        {ghostNum}
      </span>

      {/* Moldura que se desenha (border-draw) na entrada, depois cede pra CSS. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={borderPathRef}
          d="M 0,0 L 100,0 L 100,100 L 0,100 Z"
          stroke="#F5F2ED"
          strokeWidth={0.6}
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* Brackets técnicos nos cantos (HUD frame). Top-left em signal-red. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t border-[#FB3640]" />
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r border-t border-[#F5F2ED]/40" />
        <span className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 border-b border-l border-[#F5F2ED]/40" />
        <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 border-b border-r border-[#F5F2ED]/40" />
      </div>

      <div className="relative z-10">
        {allVisited && (
          <div className="flex items-center justify-center gap-3 border-b border-[#F5F2ED]/10 bg-[#FB3640]/8 px-5 py-2">
            <span className="text-[0.5rem] uppercase tracking-[0.4em] text-[#FB3640]">
              ✦ Você viu tudo
            </span>
            <span className="text-[0.55rem] uppercase tracking-[0.3em] text-[#F5F2ED]/55">
              novos projetos em breve
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
