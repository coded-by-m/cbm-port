"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS, FOG } from "@/components/zones/TerrainMesh/config";
import { useOverlayStore } from "@/components/zones/HtmlOverlay/useOverlayStore";
import ProjectCard from "@/components/zones/HtmlOverlay/ProjectCard";
import Connector from "@/components/zones/HtmlOverlay/Connector";
import ScrollScene from "./ScrollScene";
import { useScrollDriver } from "./useScrollDriver";
import { SCROLL_LENGTH } from "./config";

/**
 * Scroll Camera — Experimento 06 do Experience Lab.
 *
 * Valida a narrativa: o scroll percorre a paisagem com a câmera. O scroll é
 * escopado a um wrapper interno (não à página do lab), com Lenis + ScrollTrigger
 * dirigindo um progresso 0..1 que move a câmera entre keyframes e revela os
 * fragmentos (overlay HTML reaproveitado).
 *
 * Reaproveita Terrain Mesh, Project Fragments e HTML Overlay, sem alterá-los.
 * Mobile usa um trilho mais curto e o card vira painel inferior (narrativa
 * preservada).
 */
export default function ScrollCamera() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [started, setStarted] = useState(false);

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
            <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
            <ScrollScene store={store} progress={progress} setActive={setActive} />
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
          />

          {/* Dica de scroll — some ao primeiro avanço */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500",
              started ? "opacity-0" : "opacity-100",
            ].join(" ")}
          >
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-neutral-500">
              Scroll
            </p>
            <p className="mt-1 text-neutral-600">↓</p>
          </div>
        </div>
      </div>
    </div>
  );
}
