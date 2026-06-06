"use client";

import { useEffect, useState } from "react";

/**
 * Capítulo ativo da Home, derivado da posição de scroll.
 *
 * Lê os elementos com `[data-chapter-index]` (os wrappers das LazySections) e
 * escolhe aquele cujo range contém o centro do viewport. Usa
 * `getBoundingClientRect` ao vivo a cada frame de scroll, então lida com as
 * alturas dinâmicas do mount/unmount das LazySections sem cache stale.
 *
 * Consumido pela ChapterRail (onde estou) e pela InteractionCue (o que faço).
 */
export function useActiveChapter(): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const els = document.querySelectorAll<HTMLElement>("[data-chapter-index]");
      if (!els.length) return;
      const mid = window.innerHeight / 2;
      let next = 0;
      els.forEach((el) => {
        // rect.top relativo ao viewport; o capítulo está "alcançado" quando seu
        // topo já passou do centro da tela.
        if (el.getBoundingClientRect().top <= mid) {
          next = Number(el.dataset.chapterIndex) || 0;
        }
      });
      setActive((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("scroll", schedule, opts);
    window.addEventListener("resize", schedule);
    compute();

    return () => {
      window.removeEventListener("scroll", schedule, opts);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return active;
}
