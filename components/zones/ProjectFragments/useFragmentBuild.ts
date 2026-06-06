"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { TIMING } from "./config";

/**
 * Construção de um fragmento (princípio "tudo é construído").
 *
 * Anima um `reveal` (0 → 1) que faz o fragmento surgir; o `delay` escalona os
 * fragmentos. Exposto por ref e lido por frame (sem re-render do React).
 *
 * @param opts.play  Quando `false`, segura/reseta o reveal em 0 (ex.: capítulo
 *   fora da tela) e (re)dispara o build quando volta a `true`. Default `true`
 *   (comportamento original: constrói no mount).
 * @param opts.startDelay  Override do atraso antes de começar (s). Default
 *   `TIMING.startDelay`. Útil pra sincronizar a montagem com a transição.
 */
export function useFragmentBuild(
  index: number,
  opts?: { play?: boolean; startDelay?: number },
): MutableRefObject<number> {
  const play = opts?.play ?? true;
  const startDelay = opts?.startDelay ?? TIMING.startDelay;
  const reveal = useRef(0);

  useEffect(() => {
    if (!play) {
      reveal.current = 0; // fora da tela → reseta pra reconstruir na volta
      return;
    }
    const target = { value: 0 };
    const tween = gsap.to(target, {
      value: 1,
      duration: TIMING.duration,
      delay: startDelay + index * TIMING.stagger,
      ease: "power2.out",
      onUpdate: () => {
        reveal.current = target.value;
      },
    });

    return () => {
      tween.kill();
    };
  }, [index, play, startDelay]);

  return reveal;
}
