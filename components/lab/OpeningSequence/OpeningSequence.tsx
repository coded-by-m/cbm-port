"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useOpeningScroll } from "./useOpeningScroll";

const TriangleLoader = dynamic(
  () => import("@/components/lab/TriangleLoader/TriangleLoader"),
  { ssr: false },
);

const Pyramid = dynamic(
  () => import("@/components/lab/Pyramid/Pyramid"),
  { ssr: false },
);

const SCROLL_LENGTH = 200;

export default function OpeningSequence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pyramidRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  const [buildComplete, setBuildComplete] = useState(false);
  const [showPyramid, setShowPyramid] = useState(false);

  const handleLogoComplete = useCallback(() => {
    setBuildComplete(true);
  }, []);

  const handlePyramidVisible = useCallback(() => {
    setShowPyramid(true);
  }, []);

  useOpeningScroll(
    wrapperRef,
    contentRef,
    { logo: logoRef, text: textRef, pyramid: pyramidRef },
    scrollProgress,
    buildComplete,
    handlePyramidVisible,
  );

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

          {/* Pyramid — shows after scroll crossfade */}
          <div
            ref={pyramidRef}
            className="absolute inset-0"
            style={{ opacity: 0 }}
          >
            {showPyramid && <Pyramid />}
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
