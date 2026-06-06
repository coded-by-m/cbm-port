"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS, FOG } from "@/components/zones/TerrainMesh/config";
import LandscapeScene from "./LandscapeScene";
import CenteredCard from "./CenteredCard";
import DotsNav from "./DotsNav";
import { LANDSCAPE_CARDS } from "./config";

const COOLDOWN = 1200;

export default function DigitalLandscape() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cooldown = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, LANDSCAPE_CARDS.length - 1));
    if (clamped === activeIndex) return;
    setActiveIndex(clamped);
  }, [activeIndex]);

  const next = useCallback(() => {
    if (cooldown.current) return;
    cooldown.current = true;
    setTimeout(() => { cooldown.current = false; }, COOLDOWN);
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const prev = useCallback(() => {
    if (cooldown.current) return;
    cooldown.current = true;
    setTimeout(() => { cooldown.current = false; }, COOLDOWN);
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) next();
      else if (e.deltaY < 0) prev();
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <LandscapeScene activeIndex={activeIndex} />
      </Canvas>

      <CenteredCard activeIndex={activeIndex} cards={LANDSCAPE_CARDS} />
      <DotsNav
        count={LANDSCAPE_CARDS.length}
        activeIndex={activeIndex}
        onGo={goTo}
      />
    </div>
  );
}
