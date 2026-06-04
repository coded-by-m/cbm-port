"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/**
 * Anima o stroke-dashoffset de um path SVG (border-draw) ao entrar no viewport.
 *
 * Usa IntersectionObserver pra disparar a animação somente quando o card
 * aparece. Respeita `prefers-reduced-motion` (instant set sem animação).
 */
export function useBorderDraw(
  pathRef: RefObject<SVGPathElement>,
  options: {
    /** Delay em segundos antes de iniciar (pra stagger entre cards). */
    delay?: number;
    /** Duração da animação em segundos. */
    duration?: number;
    /** Threshold do IntersectionObserver (0-1). */
    threshold?: number;
  } = {},
) {
  const { delay = 0, duration = 0.9, threshold = 0.3 } = options;

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // pathLength=1 + dasharray "1 1" + dashoffset 1 = hidden
    path.setAttribute("pathLength", "1");
    path.style.strokeDasharray = "1 1";
    path.style.strokeDashoffset = "1";

    if (reduceMotion) {
      path.style.strokeDashoffset = "0";
      return;
    }

    let tween: gsap.core.Tween | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tween = gsap.to(path, {
              strokeDashoffset: 0,
              duration,
              delay,
              ease: "power2.out",
              onComplete: () => {
                // Após o draw, fade-out pra deixar a border CSS assumir.
                gsap.to(path, {
                  opacity: 0,
                  duration: 0.6,
                  delay: 0.2,
                  ease: "power2.in",
                });
              },
            });
            observer.disconnect();
          }
        }
      },
      { threshold },
    );

    observer.observe(path);

    return () => {
      observer.disconnect();
      if (tween) tween.kill();
    };
  }, [pathRef, delay, duration, threshold]);
}
