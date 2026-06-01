"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const TerrainMesh = dynamic(
  () => import("@/components/lab/TerrainMesh").then((m) => m.TerrainMesh),
  { ssr: false },
);

const STATEMENTS = [
  {
    number: "01",
    text: "Cada pixel é uma decisão.",
  },
  {
    number: "02",
    text: "Design e código. Mesmo autor.",
  },
  {
    number: "03",
    text: "A primeira impressão não se repete.",
  },
  {
    number: "04",
    text: "Ver o que já construímos →",
    isCta: true,
  },
];

const DWELL = 4;
const TRANSITION = 0.8;
const SCROLL_COOLDOWN = 900;

type PhilosophySectionProps = {
  onComplete?: () => void;
};

export default function PhilosophySection({ onComplete }: PhilosophySectionProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);
  const statementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCooldown = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, STATEMENTS.length - 1));

    statementsRef.current.forEach((el, i) => {
      if (!el) return;
      if (i === clamped) {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: TRANSITION,
          ease: "power2.out",
        });
      } else {
        gsap.to(el, {
          opacity: 0,
          y: i < clamped ? -30 : 30,
          scale: 0.96,
          duration: TRANSITION * 0.6,
          ease: "power2.in",
        });
      }
    });

    if (lineRef.current) {
      gsap.to(lineRef.current, {
        width: `${((clamped + 1) / STATEMENTS.length) * 100}%`,
        duration: TRANSITION,
        ease: "power2.inOut",
      });
    }

    activeRef.current = clamped;
    setActive(clamped);
  }, []);

  const next = useCallback(() => {
    setActive((prev) => {
      const n = prev < STATEMENTS.length - 1 ? prev + 1 : prev;
      goTo(n);
      return n;
    });
  }, [goTo]);

  const prev = useCallback(() => {
    setActive((prev) => {
      const n = prev > 0 ? prev - 1 : 0;
      goTo(n);
      return n;
    });
  }, [goTo]);

  // Auto-advance start
  useEffect(() => {
    const startDelay = setTimeout(() => goTo(0), 800);
    return () => clearTimeout(startDelay);
  }, [goTo]);

  // Auto-advance timer — resets when active changes
  useEffect(() => {
    if (active < 0) return;
    if (active >= STATEMENTS.length - 1) return;

    autoTimerRef.current = setTimeout(() => {
      goTo(active + 1);
    }, DWELL * 1000);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [active, goTo]);

  // Keyboard nav
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

  // Scroll/wheel to advance — with cooldown to prevent rapid-fire
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollCooldown.current) return;

      scrollCooldown.current = true;
      setTimeout(() => {
        scrollCooldown.current = false;
      }, SCROLL_COOLDOWN);

      if (e.deltaY > 0) {
        if (activeRef.current >= STATEMENTS.length - 1) {
          onCompleteRef.current?.();
        } else {
          next();
        }
      } else if (e.deltaY < 0) {
        prev();
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Background: Terrain Mesh at low opacity */}
      <div className="absolute inset-0 opacity-[0.35]">
        <TerrainMesh />
      </div>

      {/* Vignette overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, #000F08 75%)",
        }}
      />

      {/* Statements */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <div className="relative h-32 w-full max-w-2xl px-8">
          {STATEMENTS.map((stmt, i) => (
            <div
              key={stmt.number}
              ref={(el) => {
                statementsRef.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ opacity: 0, transform: "translateY(30px) scale(0.96)" }}
            >
              <p className="mb-6 font-mono text-[0.6rem] tracking-[0.4em] text-[#F5F2ED]/25">
                {stmt.number}
              </p>
              <p
                className={[
                  "text-2xl font-light leading-relaxed tracking-wide sm:text-3xl",
                  stmt.isCta ? "text-[#FB3640]/90" : "text-[#F5F2ED]/85",
                ].join(" ")}
              >
                {stmt.isCta ? (
                  <button
                    type="button"
                    onClick={() => onCompleteRef.current?.()}
                    className="transition-colors hover:text-[#FB3640]"
                  >
                    {stmt.text.replace(" →", "")}
                    <span className="ml-2 inline-block animate-pulse">→</span>
                  </button>
                ) : (
                  stmt.text
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Progress line + dots */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          {/* Progress bar */}
          <div className="h-px w-32 overflow-hidden bg-[#F5F2ED]/10">
            <div
              ref={lineRef}
              className="h-full bg-[#FB3640]/60"
              style={{ width: "0%" }}
            />
          </div>

          {/* Dots */}
          <div className="flex gap-3">
            {STATEMENTS.map((stmt, i) => (
              <button
                key={stmt.number}
                type="button"
                aria-label={`Statement ${stmt.number}`}
                onClick={() => goTo(i)}
                className="h-1.5 w-1.5 rounded-full transition-all duration-300 ease-out"
                style={{
                  backgroundColor: active === i ? "#FB3640" : "#F5F2ED",
                  opacity: active === i ? 1 : 0.25,
                  transform: active === i ? "scale(1.5)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
