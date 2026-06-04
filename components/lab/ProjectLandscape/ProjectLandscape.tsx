"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { cases } from "@/data/cases";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import { useScrollDriver } from "@/components/lab/ScrollCamera/useScrollDriver";
import LandscapeScene from "./LandscapeScene";
import { ProjectCard } from "./ProjectCard";
import {
  INITIAL_ACTIVE_DELAY,
  INITIAL_ACTIVE_SLUG,
  SCROLL_VH,
} from "./config";

type ScreenPos = { x: number; y: number; visible: boolean } | null;

/**
 * Paisagem Digital — orquestrador.
 *
 * Substitui o `DigitalLandscape` (1 fragmento) por uma paisagem com N
 * fragmentos descobertos via scroll horizontal. Cada fragmento é um case;
 * hover revela um card HTML ancorado ao ápice projetado em 2D. Click
 * navega para `/cases/[slug]` (cases publicados) ou é no-op (em breve).
 *
 * O scroll é escopado a um wrapper interno (Lenis + ScrollTrigger) — não
 * conflita com o scroll da OpeningSequence ou do site real ao redor.
 */
export default function ProjectLandscape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const [, setStarted] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [screenPos, setScreenPos] = useState<ScreenPos>(null);

  const router = useRouter();

  useScrollDriver(wrapperRef, contentRef, progress, setStarted);

  // Auto-ativa o fragmento central pouco depois da Paisagem entrar — usuário
  // já chega com o card aberto sem precisar mover o mouse.
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlug((prev) => prev ?? INITIAL_ACTIVE_SLUG);
    }, INITIAL_ACTIVE_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const handleHover = useCallback((slug: string | null) => {
    setActiveSlug((prev) => {
      if (slug === null && prev !== null) return null;
      return slug ?? prev;
    });
  }, []);

  const handleClick = useCallback(
    (slug: string) => {
      const caseProject = cases.find((c) => c.slug === slug);
      if (!caseProject) return;
      if (caseProject.status === "coming-soon") return;
      router.push(`/cases/${slug}`);
    },
    [router],
  );

  const handleScreenPosition = useCallback(
    (slug: string, pos: ScreenPos) => {
      // Só atualiza se for o slug ativo — evita race entre fragmentos.
      setScreenPos((prev) => (slug === activeSlug ? pos : prev));
    },
    [activeSlug],
  );

  const activeCase =
    activeSlug !== null
      ? cases.find((c) => c.slug === activeSlug) ?? null
      : null;

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-y-auto overscroll-contain"
    >
      <div
        ref={contentRef}
        className="relative w-full"
        style={{ height: `${SCROLL_VH}vh` }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <Canvas
            frameloop="always"
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
            camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
            style={{ background: COLORS.background }}
          >
            <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
            <LandscapeScene
              progress={progress}
              activeSlug={activeSlug}
              onHover={handleHover}
              onClick={handleClick}
              onScreenPosition={handleScreenPosition}
            />
          </Canvas>

          <ProjectCard caseProject={activeCase} pos={screenPos} />
        </div>
      </div>
    </div>
  );
}
