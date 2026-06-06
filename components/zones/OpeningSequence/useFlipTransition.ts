"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { FLIP } from "./config";

/**
 * Orquestra o flip 3D Philosophy → Landscape.
 *
 * Anima `transform: rotate3d(AXIS_X, AXIS_Y, 0, 0deg → 180deg)` no card
 * interno. A perspectiva é aplicada pelo wrapper externo. Quando atinge
 * 180°, chama `onComplete` que desmonta o card e troca para a phase
 * "landscape" definitiva.
 *
 * `prefers-reduced-motion: reduce` reduz a duração para 0.4s e remove
 * o ease (linear) — entrega o conteúdo rapidamente sem o gesto 3D
 * prolongado.
 */
export function useFlipTransition(
  cardRef: RefObject<HTMLDivElement>,
  enabled: boolean,
  onComplete: () => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const card = cardRef.current;
    if (!card) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const duration = reducedMotion ? 0.4 : FLIP.DURATION;
    const ease = reducedMotion ? "power1.out" : "power3.inOut";

    const state = { angle: 0 };
    const apply = () => {
      card.style.transform = `rotate3d(${FLIP.AXIS_X}, ${FLIP.AXIS_Y}, 0, ${state.angle}deg)`;
    };
    apply();

    const tween = gsap.to(state, {
      angle: 180,
      duration,
      ease,
      onUpdate: apply,
      onComplete,
    });

    return () => {
      tween.kill();
    };
  }, [cardRef, enabled, onComplete]);
}
