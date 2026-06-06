"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HINT } from "./config";

/**
 * Hint inicial "Arraste pra explorar" — descoberta dos controles.
 *
 * Aparece após `HINT.showDelay` ms, fade in suave. Sai quando `show` muda
 * pra false (após primeira interação real do usuário) ou automaticamente
 * após `autoHideDelay`.
 */
export default function LandscapeHint({ show }: { show: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: show ? 1 : 0,
      duration: HINT.fadeDuration,
      ease: show ? "power2.out" : "power2.in",
    });
  }, [show]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-1/2 top-[14%] z-30 -translate-x-1/2"
      style={{ opacity: 0 }}
      aria-hidden
    >
      <div className="flex items-center gap-3 border border-[#F5F2ED]/25 bg-[#000F08]/85 px-4 py-2 backdrop-blur-md">
        <span aria-hidden className="text-[#F5F2ED]/60">
          ←
        </span>
        <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#F5F2ED]/85">
          Arraste pra explorar
        </p>
        <span aria-hidden className="text-[#F5F2ED]/60">
          →
        </span>
      </div>
    </div>
  );
}
