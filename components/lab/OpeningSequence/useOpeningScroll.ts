"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function useOpeningScroll(
  wrapperRef: RefObject<HTMLDivElement>,
  contentRef: RefObject<HTMLDivElement>,
  layers: {
    logo: RefObject<HTMLDivElement>;
    text: RefObject<HTMLDivElement>;
    pyramid: RefObject<HTMLDivElement>;
  },
  scrollProgress: MutableRefObject<number>,
  enabled: boolean,
  onPyramidVisible: () => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.35,
      touchMultiplier: 0.4,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let pyramidMounted = false;
    let scrollStopped = false;

    const trigger = ScrollTrigger.create({
      scroller: wrapper,
      trigger: content,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        scrollProgress.current = p;

        const logoEl = layers.logo.current;
        const textEl = layers.text.current;
        const pyramidEl = layers.pyramid.current;

        // Phase 1: text hint exits first (0 → 0.10)
        if (textEl) {
          const t = Math.min(1, p / 0.10);
          textEl.style.opacity = String(1 - t);
        }
        // Phase 2: logo fades out (0.08 → 0.25)
        if (logoEl) {
          const t = Math.max(0, Math.min(1, (p - 0.08) / 0.17));
          logoEl.style.opacity = String(1 - t);
        }
        // Phase 3: philosophy fades in overlapping logo exit (0.20 → 0.38)
        if (pyramidEl) {
          const t = Math.max(0, Math.min(1, (p - 0.20) / 0.18));
          pyramidEl.style.opacity = String(t);
        }

        // Mount PhilosophySection early so terrain has time to build
        if (p > 0.15 && !pyramidMounted) {
          pyramidMounted = true;
          onPyramidVisible();
        }
        // Stop scroll only once philosophy is fully visible
        if (p > 0.42 && !scrollStopped) {
          scrollStopped = true;
          setTimeout(() => {
            lenis.stop();
          }, 600);
        }
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [wrapperRef, contentRef, layers, scrollProgress, enabled, onPyramidVisible]);
}
