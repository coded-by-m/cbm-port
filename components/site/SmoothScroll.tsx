"use client";

import { useEffect } from "react";

/**
 * Scroll suave da home, com Lenis.
 *
 * Mesma inércia da experiência (`lerp: 0.08`), que é o que faz toda entrada
 * de seção ler como deliberada em vez de abrupta — a rolagem deixa de ser um
 * salto e passa a ter peso.
 *
 * Três cuidados, porque sequestrar o scroll nativo quebra coisas:
 *
 * 1. Sob `prefers-reduced-motion` nada é inicializado. Inércia é exatamente
 *    o tipo de movimento que causa desconforto vestibular.
 * 2. As âncoras do menu (`#projetos`…) param de funcionar sozinhas quando o
 *    scroll é controlado por JS, então elas passam pelo `scrollTo` do Lenis.
 * 3. Importado dinamicamente: os ~10 KB só baixam depois da primeira tela.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Ponteiro grosso já tem inércia nativa no sistema; somar a nossa deixa
    // a rolagem pastosa no celular.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: string | HTMLElement, o?: object) => void } | null = null;
    let frame = 0;
    let cancelled = false;

    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!href || !href.startsWith("#") || !lenis) return;
      const target = href === "#top" ? document.body : document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: href === "#top" ? 0 : -64 });
    };

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.08 }) as unknown as typeof lenis;
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      document.addEventListener("click", onAnchorClick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
