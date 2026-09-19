"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Anima a entrada no scroll: fade + sobe + blur→nítido quando entra no viewport.
 * Respeita prefers-reduced-motion (aparece instantâneo). `delay` em ms p/ stagger.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        filter: shown ? "blur(0px)" : "blur(6px)",
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
