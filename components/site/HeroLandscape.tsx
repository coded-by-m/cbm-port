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
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const id = idle(() => {
      setSource(document.body);
      setMounted(true);
    });
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else clearTimeout(id as unknown as number);
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
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.55,
        maskImage:
          "radial-gradient(120% 90% at 60% 45%, #000 35%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(120% 90% at 60% 45%, #000 35%, transparent 78%)",
      }}
    >
      {mounted && <Landscape active={active} eventSource={source} />}
    </div>
  );
}
