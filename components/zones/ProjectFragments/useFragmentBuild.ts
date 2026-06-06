"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { TIMING } from "./config";

/**
 * Construção de um fragmento (princípio "tudo é construído").
 *
 * Anima um `reveal` (0 → 1) que faz o fragmento surgir após o terreno se
 * assentar; o `delay` escalona os fragmentos. Exposto por ref e lido por frame
 * (sem re-render do React).
 */
export function useFragmentBuild(index: number): MutableRefObject<number> {
  const reveal = useRef(0);

  useEffect(() => {
    const target = { value: 0 };
    const tween = gsap.to(target, {
      value: 1,
      duration: TIMING.duration,
      delay: TIMING.startDelay + index * TIMING.stagger,
      ease: "power2.out",
      onUpdate: () => {
        reveal.current = target.value;
      },
    });

    return () => {
      tween.kill();
    };
  }, [index]);

  return reveal;
}
