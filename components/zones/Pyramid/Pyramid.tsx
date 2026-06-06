"use client";

import { useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import PyramidScene from "./PyramidScene";
import { CARD_CONTENT, COLORS } from "./config";
import { usePyramidTimeline } from "./usePyramidTimeline";

export default function Pyramid() {
  const [activeCard, setActiveCard] = useState(-1);

  const timeline = usePyramidTimeline((stopIndex) => {
    setActiveCard(stopIndex);
  });

  const handleOrbitStart = useCallback(() => {
    timeline.pause();
  }, [timeline]);

  const handleOrbitEnd = useCallback(() => {
    setTimeout(() => timeline.resume(), 1500);
  }, [timeline]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        timeline.nextStop();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        timeline.prevStop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [timeline]);

  return (
    <div className="flex h-full w-full">
      {/* Left: 3D Canvas */}
      <div className="relative h-full w-[60%]">
        <Canvas
          frameloop="always"
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
          camera={{ position: [0, 0.3, 4.5], fov: 45 }}
          style={{ background: COLORS.background }}
        >
          <PyramidScene
            timelineRef={timeline.timelineRef}
            onOrbitStart={handleOrbitStart}
            onOrbitEnd={handleOrbitEnd}
          />
        </Canvas>
      </div>

      {/* Right: Content Cards */}
      <div
        className="relative flex h-full w-[40%] flex-col justify-center px-12"
        style={{ background: COLORS.background }}
      >
        {CARD_CONTENT.map((card, i) => {
          const isActive = activeCard === i;
          return (
            <div
              key={card.number}
              className="absolute inset-x-12 transition-all duration-[600ms] ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(0)" : "translateX(20px)",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <p className="font-mono text-[0.65rem] tracking-wider text-[#F5F2ED]/40">
                | {card.number} |{" "}
                <span className="ml-1 font-sans uppercase tracking-[0.3em]">
                  {card.label}
                </span>
              </p>

              <h3 className="mt-4 text-2xl font-light tracking-wide text-[#F5F2ED]/90">
                {card.title}
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#F5F2ED]/50">
                {card.description}
              </p>

              {"isCta" in card && card.isCta && (
                <button
                  type="button"
                  className="mt-6 text-sm uppercase tracking-[0.2em] text-[#FB3640]/90 transition-colors hover:text-[#FB3640]"
                >
                  Ver projetos{" "}
                  <span className="ml-1 inline-block animate-pulse">→</span>
                </button>
              )}
            </div>
          );
        })}

        {/* Dots navigation */}
        <div className="absolute bottom-12 left-12 flex gap-3">
          {CARD_CONTENT.map((card, i) => (
            <button
              key={card.number}
              type="button"
              aria-label={`Princípio ${card.number}`}
              onClick={() => timeline.seekToStop(i)}
              className="h-2 w-2 rounded-full transition-all duration-300 ease-out"
              style={{
                backgroundColor: activeCard === i ? "#FB3640" : "#F5F2ED",
                opacity: activeCard === i ? 1 : 0.35,
                transform: activeCard === i ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
