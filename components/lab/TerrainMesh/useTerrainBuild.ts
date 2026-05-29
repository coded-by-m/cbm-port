"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { TIMING } from "./config";

/**
 * Construção do terreno (princípio "tudo é construído").
 *
 * Anima um valor `reveal` (0 → 1) que faz o terreno subir do plano e surgir
 * progressivamente. O `delay` por camada escalona a montagem de trás para
 * frente, reforçando a profundidade. O valor é exposto por ref e lido a cada
 * frame pela superfície (sem re-render do React).
 */
export function useTerrainBuild(delay: number): MutableRefObject<number> {
  const reveal = useRef(0);

  useEffect(() => {
    const target = { value: 0 };
    const tween = gsap.to(target, {
      value: 1,
      duration: TIMING.buildDuration,
      delay: TIMING.startDelay + delay,
      ease: "power2.out",
      onUpdate: () => {
        reveal.current = target.value;
      },
    });

    return () => {
      tween.kill();
    };
  }, [delay]);

  return reveal;
}
