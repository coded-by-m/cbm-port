"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Dado o centro vertical de cada linha e o ponto de foco da tela, devolve o
 * índice da linha mais próxima. Pura de propósito: é a regra inteira de "qual
 * projeto está em cena" e não depende de DOM.
 */
export function pickActive(centers: number[], focusY: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < centers.length; i++) {
    const d = Math.abs(centers[i] - focusY);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

/** px/ms de rolagem que já contam como velocidade máxima para o shader. */
const FULL_SPEED = 2.4;

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

interface Options {
  /** Velocidade de rolagem normalizada em [-1, 1], a cada frame de scroll. */
  onVelocity?: (v: number) => void;
}

/**
 * Qual linha do índice está ativa.
 *
 * - Ponteiro grosso: a linha mais próxima do centro da tela.
 * - Ponteiro fino: a linha sob o ponteiro ou com foco; sem nenhuma, vale a
 *   regra do centro.
 *
 * `inIndex` diz se a lista está ocupando a tela — é o que liga o dock.
 */
export function useActiveRow(count: number, { onVelocity }: Options = {}) {
  const rows = useRef<(HTMLElement | null)[]>([]);
  const [scrollIdx, setScrollIdx] = useState(0);
  const [pointed, setPointed] = useState<number | null>(null);
  const [inIndex, setInIndex] = useState(false);
  const velocityCb = useRef(onVelocity);
  velocityCb.current = onVelocity;

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const els = rows.current.slice(0, count).filter(Boolean) as HTMLElement[];
      if (els.length === 0) return;
      const rects = els.map((el) => el.getBoundingClientRect());
      setScrollIdx(pickActive(rects.map((r) => r.top + r.height / 2), vh / 2));
      setInIndex(rects[0].top < vh * 0.8 && rects[rects.length - 1].bottom > vh * 0.45);
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const v = (window.scrollY - lastY) / dt / FULL_SPEED;
        velocityCb.current?.(Math.max(-1, Math.min(1, v)));
      }
      lastY = window.scrollY;
      lastT = now;
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const onResize = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  const setRowRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      rows.current[i] = el;
    },
    [],
  );

  /** Handlers de uma linha: ponteiro fino e foco de teclado a tornam ativa. */
  const rowHandlers = useCallback(
    (i: number) => ({
      onPointerEnter: (e: React.PointerEvent) => {
        if (e.pointerType === "mouse" && window.matchMedia(FINE_POINTER).matches) setPointed(i);
      },
      // Só foco de teclado. O toque também foca o link, e o foco sobrevive ao
      // "voltar" do navegador: sem este filtro a linha tocada ficaria presa
      // como ativa e o scroll pararia de trocar a capa.
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        if (e.currentTarget.matches(":focus-visible")) setPointed(i);
      },
      onBlur: () => setPointed((cur) => (cur === i ? null : cur)),
    }),
    [],
  );

  const clearPointed = useCallback(() => setPointed(null), []);

  return {
    active: pointed ?? scrollIdx,
    inIndex,
    setRowRef,
    rowHandlers,
    clearPointed,
  };
}
