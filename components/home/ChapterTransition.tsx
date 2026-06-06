"use client";

import { useEffect, useState } from "react";

/** Cor de fundo da marca — o "material conectivo" entre as cenas. */
const BG = "#000F08";
/** Opacidade no pico da emenda — quase opaco pra esconder a linha dura. */
const MAX_OPACITY = 0.92;
/** Largura da zona de dip, em fração do viewport (ramp suave). */
const FADE_FRACTION = 0.5;

/**
 * Transição conectiva entre capítulos — overlay fixo na cor da marca que
 * escurece suavemente quando a emenda entre duas seções cruza o centro da
 * tela, e clareia ao entrar numa seção.
 *
 * Resolve o "corte seco": em vez de duas cenas 3D diferentes dividindo a tela
 * com uma linha dura, elas dissolvem através do verde profundo. Scroll-acoplado
 * (sem CSS transition) → acompanha o scroll exatamente. Lê as fronteiras ao
 * vivo via `[data-chapter-index]`, então lida com as alturas dinâmicas do
 * mount/unmount.
 *
 * z-40: acima das cenas, abaixo da trilha/cue (z-60).
 */
export function ChapterTransition() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const els = document.querySelectorAll<HTMLElement>("[data-chapter-index]");
      const vh = window.innerHeight;
      const fade = vh * FADE_FRACTION;
      let peak = 0;

      els.forEach((el, i) => {
        if (i === 0) return; // sem dip antes do primeiro capítulo
        // O topo da seção (a emenda) cruzando o centro do viewport = pico.
        const top = el.getBoundingClientRect().top;
        const dist = Math.abs(top - vh / 2);
        if (dist < fade) {
          const o = (1 - dist / fade) * MAX_OPACITY;
          if (o > peak) peak = o;
        }
      });

      setOpacity((prev) => (Math.abs(prev - peak) > 0.008 ? peak : prev));
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

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{ background: BG, opacity }}
    />
  );
}
