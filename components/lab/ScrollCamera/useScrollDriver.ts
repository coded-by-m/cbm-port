"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Ponte scroll → progresso.
 *
 * Lenis dá o scroll suave (escopado ao wrapper, não à janela) e o ScrollTrigger
 * traduz a posição num progresso 0..1 escrito por ref — lido a cada frame pela
 * câmera, sem re-render do React. `setStarted` apenas esconde a dica de scroll.
 */
export function useScrollDriver(
  wrapperRef: RefObject<HTMLDivElement>,
  contentRef: RefObject<HTMLDivElement>,
  progress: MutableRefObject<number>,
  setStarted: (value: boolean) => void,
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.08,
      smoothWheel: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      scroller: wrapper,
      trigger: content,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress;
        if (self.progress > 0.02) setStarted(true);
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
  }, [wrapperRef, contentRef, progress, setStarted]);
}
