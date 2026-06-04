"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { cases } from "@/data/cases";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import LandscapeScene from "./LandscapeScene";
import { ProjectCard } from "./ProjectCard";
import {
  FRAGMENT_SLOTS,
  INITIAL_ACTIVE_DELAY,
  INITIAL_ACTIVE_SLUG,
  SLIDESHOW,
} from "./config";

type ScreenPos = { x: number; y: number; visible: boolean } | null;
type Direction = "left" | "right" | null;

const MOBILE_BREAKPOINT = "(max-width: 767px)";

/**
 * Paisagem Digital — orquestrador (vista fixa).
 *
 * 3 fragmentos triangulares sobre o terreno, todos visíveis ao mesmo tempo.
 * Slideshow auto-rotativo destaca um por vez (release-on-interact). Card
 * flutuante (desktop) ou bottom sheet (mobile) acompanha o ativo. Sem scroll
 * interno, sem pan de câmera — narrativa é puramente via slideshow.
 */
export default function ProjectLandscape() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [screenPos, setScreenPos] = useState<ScreenPos>(null);
  const [released, setReleased] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<Direction>(null);

  const router = useRouter();

  const orderedSlots = useMemo(
    () => [...FRAGMENT_SLOTS].sort((a, b) => a.x - b.x),
    [],
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlug((prev) => prev ?? INITIAL_ACTIVE_SLUG);
    }, INITIAL_ACTIVE_DELAY);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (released) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const interval = setInterval(() => {
      setActiveSlug((current) => {
        if (!current) return INITIAL_ACTIVE_SLUG;
        const idx = orderedSlots.findIndex((s) => s.slug === current);
        const next = orderedSlots[(idx + 1) % orderedSlots.length];
        return next.slug;
      });
    }, SLIDESHOW.holdDuration);

    return () => clearInterval(interval);
  }, [released, orderedSlots]);

  const prevSlugRef = useRef<string | null>(null);
  useEffect(() => {
    if (!activeSlug) return;
    const prev = prevSlugRef.current;
    if (prev && prev !== activeSlug) {
      const prevSlot = FRAGMENT_SLOTS.find((s) => s.slug === prev);
      const nextSlot = FRAGMENT_SLOTS.find((s) => s.slug === activeSlug);
      if (prevSlot && nextSlot) {
        setDirection(nextSlot.x > prevSlot.x ? "right" : "left");
      }
    }
    prevSlugRef.current = activeSlug;
  }, [activeSlug]);

  const handleHover = useCallback((slug: string | null) => {
    if (slug !== null) setReleased(true);
    setActiveSlug((prev) => {
      if (slug === null && prev !== null) return prev;
      return slug ?? prev;
    });
  }, []);

  const handleClick = useCallback(
    (slug: string) => {
      setReleased(true);
      const caseProject = cases.find((c) => c.slug === slug);
      if (!caseProject) return;
      if (caseProject.status === "coming-soon") return;
      router.push(`/cases/${slug}`);
    },
    [router],
  );

  const handleSelectSlide = useCallback((slug: string) => {
    setReleased(true);
    setActiveSlug(slug);
  }, []);

  const handleScreenPosition = useCallback(
    (slug: string, pos: ScreenPos) => {
      setScreenPos((prev) => (slug === activeSlug ? pos : prev));
    },
    [activeSlug],
  );

  const activeCase =
    activeSlug !== null
      ? cases.find((c) => c.slug === activeSlug) ?? null
      : null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <LandscapeScene
          activeSlug={activeSlug}
          onHover={handleHover}
          onClick={handleClick}
          onScreenPosition={handleScreenPosition}
        />
      </Canvas>

      <ProjectCard
        caseProject={activeCase}
        pos={screenPos}
        isMobile={isMobile}
        direction={direction}
        activeSlug={activeSlug}
        onSelectSlide={handleSelectSlide}
      />
    </div>
  );
}
