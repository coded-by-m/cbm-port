"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useOpeningScroll } from "./useOpeningScroll";

const TriangleLoader = dynamic(
  () => import("@/components/lab/TriangleLoader/TriangleLoader"),
  { ssr: false },
);

const PhilosophySection = dynamic(
  () =>
    import("@/components/lab/PhilosophySection").then(
      (m) => m.PhilosophySection,
    ),
  { ssr: false },
);

const DigitalLandscape = dynamic(
  () =>
    import("@/components/lab/DigitalLandscape").then(
      (m) => m.DigitalLandscape,
    ),
  { ssr: false },
);

const SCROLL_LENGTH = 200;

type Phase = "logo" | "philosophy" | "landscape";

export default function OpeningSequence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  const [phase, setPhase] = useState<Phase>("logo");
  const [buildComplete, setBuildComplete] = useState(false);

  const handleLogoComplete = useCallback(() => {
    setBuildComplete(true);
  }, []);

  const handlePhilosophyVisible = useCallback(() => {
    setPhase("philosophy");
  }, []);

  const handlePhilosophyComplete = useCallback(() => {
    setPhase("landscape");
  }, []);

  useOpeningScroll(
    wrapperRef,
    contentRef,
    { logo: logoRef, text: textRef, pyramid: philosophyRef },
    scrollProgress,
    buildComplete,
    handlePhilosophyVisible,
  );

  if (phase === "landscape") {
    return (
      <div className="absolute inset-0">
        <DigitalLandscape />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-y-auto overscroll-contain"
    >
      <div
        ref={contentRef}
        className="relative w-full"
        style={{ height: `${SCROLL_LENGTH}vh` }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {/* Logo Loader */}
          <div ref={logoRef} className="absolute inset-0">
            <TriangleLoader
              onComplete={handleLogoComplete}
              scrollProgress={scrollProgress}
            />
          </div>

          {/* Philosophy — shows after scroll crossfade */}
          <div
            ref={philosophyRef}
            className="absolute inset-0"
            style={{ opacity: 0 }}
          >
            {phase === "philosophy" && (
              <PhilosophySection onComplete={handlePhilosophyComplete} />
            )}
          </div>

          {/* Tipografia + scroll hint */}
          <div
            ref={textRef}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[16vh]"
            style={{
              opacity: buildComplete ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          >
            <p className="text-[0.65rem] font-light uppercase tracking-[0.5em] text-[#F5F2ED]/70">
              Coded by M
            </p>
            <div className="mt-8 flex flex-col items-center gap-1">
              <p className="text-[0.5rem] uppercase tracking-[0.4em] text-[#F5F2ED]/20">
                scroll
              </p>
              <p className="text-[0.55rem] text-[#F5F2ED]/15">↓</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
