"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { centroid, meshTris, triD } from "@/components/ui/triMesh";

/**
 * Cortina de triângulos do print: a mesma malha dos botões e do logo.
 *
 * Cobre o print enquanto ele não entrou; quando o pai ganha `is-in`, cada
 * triângulo encolhe até sumir, numa onda que parte do canto de cima à
 * esquerda. A malha só cobre o primeiro trecho do print (o que cabe na
 * tela); o resto fica sob um bloco liso que some junto, fora da vista.
 * Só aparece com `.bb-motion` (ver useReveal): sem JS, nada cobre nada.
 */

/** Tamanho da célula da malha, em px. */
const CELL = 58;
/** Quanto a onda leva pra atravessar a malha, em segundos. */
const SWEEP = 0.95;

export function TriCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const sheet = ref.current?.parentElement;
    if (!sheet) return;
    const measure = () => {
      const w = Math.round(sheet.clientWidth);
      const h = Math.round(
        Math.min(sheet.clientHeight, window.innerHeight * 1.25),
      );
      setBox((b) => (b && b.w === w && b.h === h ? b : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sheet);
    return () => ro.disconnect();
  }, []);

  const tris = useMemo(() => {
    if (!box) return [];
    const list = meshTris(box.w, box.h, CELL);
    const far = Math.hypot(box.w, box.h);
    return list.map((t, i) => {
      const [x, y] = centroid(t);
      // Onda do canto de cima à esquerda, com um tremor pra não ler régua.
      const jitter = ((i * 7919) % 97) / 97;
      return {
        d: triD(t),
        delay: (Math.hypot(x, y) / far) * SWEEP + jitter * 0.08,
      };
    });
  }, [box]);

  return (
    <div ref={ref} className={`bb-curtain${box ? " is-ready" : ""}`} aria-hidden>
      {box && (
        <>
          <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`}>
            {tris.map((t, i) => (
              <path
                key={i}
                d={t.d}
                style={{ transitionDelay: `${t.delay.toFixed(3)}s` }}
              />
            ))}
          </svg>
          <span className="bb-curtain-rest" style={{ top: box.h }} />
        </>
      )}
    </div>
  );
}
