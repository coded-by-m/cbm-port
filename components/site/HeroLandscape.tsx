"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Landscape = dynamic(
  () => import("@/components/zones/CTASection/FooterLandscape"),
  { ssr: false },
);

/**
 * Os fragmentos triangulados da experiência, atrás do hero.
 *
 * Camada de fundo, `pointer-events: none` — o texto e os CTAs continuam
 * clicáveis por cima. O ponteiro é ouvido do `document.body` para que a
 * repulsão do cursor funcione mesmo com o canvas fora da captura de eventos.
 *
 * Três portões antes de montar, porque isto custa a stack 3D:
 *
 * 1. Só em ponteiro fino. Em touch não existe cursor — a repulsão, que é a
 *    razão de a peça estar aqui, não acontece, e o custo cairia justamente
 *    no aparelho mais fraco.
 * 2. Só sem `prefers-reduced-motion`.
 * 3. Só depois que a página fica ociosa, para não disputar a primeira tela.
 *
 * Fora de vista o render loop congela (`active`), seguindo o mesmo padrão
 * dos canvases da experiência.
 */
export function HeroLandscape() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(true);
  const [source, setSource] = useState<HTMLElement | undefined>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let idleId: number | undefined;
    let firstFrame = 0;
    let secondFrame = 0;
    let cancelled = false;

    const schedule = () => {
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          const idle =
            window.requestIdleCallback ??
            ((cb: () => void) => window.setTimeout(cb, 600));
          idleId = idle(() => {
            if (cancelled) return;
            setSource(document.body);
            setMounted(true);
          }) as number;
        });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        schedule();
      },
      { rootMargin: "160px 0px", threshold: 0 },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      if (idleId === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !mounted) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setActive(e.isIntersecting);
      },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        // Sangra a viewport inteira: o hero tem max-width 1440 e padding, mas
        // a paisagem não deve conhecer essas bordas.
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        width: "100vw",
        transform: "translateX(-50%)",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.6,
        /* Duas máscaras compostas: a radial concentra a geometria do lado
           livre, e a linear apaga a base — sem ela a paisagem era CORTADA na
           borda do hero, e o corte é o que se lia como quebra brusca. */
        maskImage:
          "radial-gradient(85% 75% at 38% 52%, #000 55%, transparent 92%), linear-gradient(to bottom, #000 55%, transparent 96%)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "radial-gradient(85% 75% at 38% 52%, #000 55%, transparent 92%), linear-gradient(to bottom, #000 55%, transparent 96%)",
        WebkitMaskComposite: "source-in",
      }}
    >
      {mounted && <Landscape active={active} eventSource={source} />}
    </div>
  );
}
