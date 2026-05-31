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
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.5,
      touchMultiplier: 0.6,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let pyramidTriggered = false;

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

        if (textEl) {
          textEl.style.opacity = String(Math.max(0, 1 - p / 0.3));
        }
        if (logoEl) {
          logoEl.style.opacity = String(Math.max(0, 1 - p / 0.5));
        }
        if (pyramidEl) {
          const fadeIn = Math.max(0, Math.min(1, (p - 0.4) / 0.4));
          pyramidEl.style.opacity = String(fadeIn);
        }

        if (p > 0.85 && !pyramidTriggered) {
          pyramidTriggered = true;
          onPyramidVisible();
          setTimeout(() => {
            lenis.stop();
          }, 800);
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
