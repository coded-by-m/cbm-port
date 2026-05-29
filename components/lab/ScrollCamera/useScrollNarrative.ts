"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { ACTIVE_RANGES } from "./config";

/**
 * Liga o progresso do scroll ao fragmento ativo (overlay).
 *
 * Ao entrar na janela de progresso de um fragmento, ele se destaca e o card
 * HTML aparece — o scroll revela os projetos. `setActive` só é chamado na
 * transição (não a cada frame), evitando re-renders.
 */
export function useScrollNarrative(
  progress: MutableRefObject<number>,
  setActive: (id: string | null) => void,
) {
  const current = useRef<string | null>(null);

  useFrame(() => {
    const p = progress.current;
    let next: string | null = null;
    for (const range of ACTIVE_RANGES) {
      if (p >= range.from && p <= range.to) {
        next = range.id;
        break;
      }
    }
    if (next !== current.current) {
      current.current = next;
      setActive(next);
    }
  });
}
