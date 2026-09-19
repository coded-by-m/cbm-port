"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Gesto de entrada. Cada seção usa o seu — nove blocos fazendo exatamente o
 * mesmo movimento é o que faz a página ler como uma fila uniforme.
 *
 * - `up`    sobe e desfoca. O padrão, para texto corrido.
 * - `scale` cresce de dentro. Para cards e imagens, que têm massa.
 * - `wipe`  revela por uma máscara vertical. Para blocos de largura total.
 * - `side`  entra lateralmente. Para colunas que já vivem numa borda.
 * - `draw`  desenha em X, ancorado à esquerda. Para réguas e linhas.
 */
export type RevealVariant = "up" | "scale" | "wipe" | "side" | "draw";

/** Estado inicial de cada gesto. O final é sempre o repouso. */
const FROM: Record<RevealVariant, CSSProperties> = {
  up: { opacity: 0, transform: "translateY(24px)", filter: "blur(6px)" },
  scale: { opacity: 0, transform: "scale(0.955) translateY(14px)" },
  wipe: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  side: { opacity: 0, transform: "translateX(-28px)" },
  draw: { transform: "scaleX(0)" },
};

const TO: Record<RevealVariant, CSSProperties> = {
  up: { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
  scale: { opacity: 1, transform: "scale(1) translateY(0)" },
  wipe: { opacity: 1, clipPath: "inset(0 0 0 0)" },
  side: { opacity: 1, transform: "translateX(0)" },
  draw: { transform: "scaleX(1)" },
};

/** Duração por gesto: massa maior pede tempo maior. */
const DURATION: Record<RevealVariant, number> = {
  up: 700,
  scale: 760,
  wipe: 900,
  side: 700,
  draw: 820,
};

const EASE = "cubic-bezier(0.16,1,0.3,1)";

export function Reveal({
  children,
  delay = 0,
  className,
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
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

  const d = DURATION[variant];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(shown ? TO[variant] : FROM[variant]),
        transformOrigin: variant === "draw" ? "left center" : undefined,
        transition: [
          `opacity ${d}ms ease-out ${delay}ms`,
          `transform ${d}ms ${EASE} ${delay}ms`,
          `filter ${d}ms ease-out ${delay}ms`,
          `clip-path ${d}ms ${EASE} ${delay}ms`,
        ].join(", "),
      }}
    >
      {children}
    </div>
  );
}
