"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { cases } from "@/data/cases";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import { useScrollDriver } from "@/components/lab/ScrollCamera/useScrollDriver";
import LandscapeScene from "./LandscapeScene";
import { ProjectCard } from "./ProjectCard";
import { FRAGMENT_SLOTS, TUNNEL } from "./config";

type Direction = "left" | "right" | null;

const MOBILE_BREAKPOINT = "(max-width: 767px)";

/**
 * Paisagem Digital — orquestrador (tunnel mode).
 *
 * 6 fragmentos distribuídos em profundidade. Scroll vertical da Paisagem
 * move a câmera ao longo de Z (linear). Active deriva da posição Z atual
 * da câmera — o fragmento mais próximo no espaço Z vira o destacado.
 *
 * Sem slideshow auto-rotativo: a narrativa é puramente do scroll do usuário.
 * Card fixo no canto inferior direito (estável apesar da câmera em movimento).
 */
export default function ProjectLandscape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const [, setStarted] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<Direction>(null);

  const router = useRouter();

  useScrollDriver(wrapperRef, contentRef, progress, setStarted);

  // Ordem visual em Z (perto da câmera → longe).
  const orderedSlots = useMemo(
    () => [...FRAGMENT_SLOTS].sort((a, b) => b.z - a.z),
    [],
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  // Deriva activeSlug da posição Z da câmera (que é função do scroll progress).
  // rAF poll — só atualiza state quando o fragmento focado muda.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = Math.max(0, Math.min(1, progress.current));
      const smoothP = p * p * (3 - 2 * p);
      const cameraZ = TUNNEL.startZ + (TUNNEL.endZ - TUNNEL.startZ) * smoothP;

      // Fragmento focado = aquele cujo Z está mais próximo do camera Z.
      let closest = orderedSlots[0];
      let minDist = Math.abs(cameraZ - closest.z);
      for (const slot of orderedSlots) {
        const d = Math.abs(cameraZ - slot.z);
        if (d < minDist) {
          minDist = d;
          closest = slot;
        }
      }

      setActiveSlug((prev) => (prev === closest.slug ? prev : closest.slug));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [orderedSlots]);

  // Direção da transição do card baseada no delta de Z entre ativos.
  const prevSlugRef = useRef<string | null>(null);
  useEffect(() => {
    if (!activeSlug) return;
    const prev = prevSlugRef.current;
    if (prev && prev !== activeSlug) {
      const prevSlot = FRAGMENT_SLOTS.find((s) => s.slug === prev);
      const nextSlot = FRAGMENT_SLOTS.find((s) => s.slug === activeSlug);
      if (prevSlot && nextSlot) {
        // Indo "pra frente no túnel" = z mais negativo = direction right
        setDirection(nextSlot.z < prevSlot.z ? "right" : "left");
      }
    }
    prevSlugRef.current = activeSlug;
  }, [activeSlug]);

  const handleHover = useCallback((slug: string | null) => {
    // No tunnel mode hover é decorativo — o scroll controla o ativo.
    // Ignoramos pra evitar conflito entre hover e scroll-derived active.
    void slug;
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

  const handleSelectSlide = useCallback(
    (slug: string) => {
      // Click no dot: scrolla a Paisagem até a progress que corresponde ao slot.
      const target = FRAGMENT_SLOTS.find((s) => s.slug === slug);
      if (!target) return;
      // Inverte smoothstep: dado z desejado, qual p produz isso?
      // Aproximação: linear (smoothstep é monotônica, próximo o bastante pro click).
      const linearP =
        (target.z - TUNNEL.startZ) / (TUNNEL.endZ - TUNNEL.startZ);
      const clamped = Math.max(0, Math.min(1, linearP));
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      if (!wrapper || !content) return;
      const totalScrollable = content.offsetHeight - wrapper.clientHeight;
      wrapper.scrollTo({ top: totalScrollable * clamped, behavior: "smooth" });
    },
    [],
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
        style={{ height: `${TUNNEL.scrollVh}vh` }}
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
            />
          </Canvas>

          <ProjectCard
            caseProject={activeCase}
            isMobile={isMobile}
            direction={direction}
            activeSlug={activeSlug}
            onSelectSlide={handleSelectSlide}
          />
        </div>
      </div>
    </div>
  );
}
