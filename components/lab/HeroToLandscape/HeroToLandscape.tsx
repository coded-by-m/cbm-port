"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS } from "@/components/lab/TerrainMesh/config";
import { SPATIAL_FOG } from "@/components/lab/SpatialComposition/config";
import { useOverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ProjectCard from "@/components/lab/HtmlOverlay/ProjectCard";
import Connector from "@/components/lab/HtmlOverlay/Connector";
import { useScrollDriver } from "@/components/lab/ScrollCamera/useScrollDriver";
import { SCROLL_LENGTH } from "@/components/lab/ScrollCamera/config";
import { LANDSCAPE_CARDS } from "@/components/lab/DigitalLandscape/config";
import TransitionScene from "./TransitionScene";
import { TRANSITION } from "./config";
import type { HeroTransitionState } from "./useHeroTransition";

export default function HeroToLandscape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const heroStateRef = useRef<HeroTransitionState | null>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [pulseReady, setPulseReady] = useState(false);

  const {
    store,
    activeId,
    isCompact,
    setActive,
    setCardEl,
    setConnectorLine,
    setConnectorDot,
  } = useOverlayStore();

  useScrollDriver(wrapperRef, contentRef, progress, setStarted);

  const length = isCompact ? SCROLL_LENGTH.compact : SCROLL_LENGTH.desktop;

  useEffect(() => {
    const timer = setTimeout(() => setPulseReady(true), TRANSITION.pulseDelay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let raf: number;
    const sync = () => {
      const state = heroStateRef.current;
      if (state && vignetteRef.current) {
        vignetteRef.current.style.opacity = String(state.vignetteOpacity);
      }
      if (pulseRef.current) {
        const hide = progress.current >= TRANSITION.pulseHideProgress;
        pulseRef.current.style.opacity = hide ? "0" : "1";
      }
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-y-auto overscroll-contain"
    >
      <div ref={contentRef} className="relative w-full" style={{ height: `${length}vh` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <Canvas
            frameloop="always"
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
            camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
            style={{ background: COLORS.background }}
          >
            <fog attach="fog" args={[SPATIAL_FOG.color, SPATIAL_FOG.near, SPATIAL_FOG.far]} />
            <TransitionScene
              store={store}
              progress={progress}
              setActive={setActive}
              onHeroState={heroStateRef}
            />
          </Canvas>

          <Connector
            visible={Boolean(activeId) && !isCompact}
            setLine={setConnectorLine}
            setDot={setConnectorDot}
          />

          <ProjectCard
            activeId={activeId}
            isCompact={isCompact}
            setCardEl={setCardEl}
            onClose={() => setActive(null)}
            cards={LANDSCAPE_CARDS}
          />

          <div
            ref={vignetteRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 8%, transparent 0%, rgba(0,15,8,1) 100%)`,
              opacity: TRANSITION.vignetteStart,
            }}
          />

          <div
            ref={pulseRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500"
            style={{ opacity: pulseReady && !started ? 1 : 0 }}
          >
            <span
              className="inline-block text-sm text-neutral-500"
              style={{
                animation: "heroToLandscapePulse 2.5s ease-in-out infinite",
              }}
            >
              ▽
            </span>
            <style>{`
              @keyframes heroToLandscapePulse {
                0%, 100% { opacity: 0.4; transform: translateY(0); }
                50% { opacity: 0.7; transform: translateY(4px); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
