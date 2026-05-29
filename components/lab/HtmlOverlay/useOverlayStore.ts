"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OVERLAY } from "./config";

/**
 * Estado mutável compartilhado entre o 3D (dentro do Canvas) e o HTML (fora).
 *
 * O contexto do React não atravessa a fronteira do Canvas do R3F, então o
 * estado é um objeto estável passado por props para os dois lados. Os campos
 * são lidos no loop de frame (sempre atuais, pois o objeto é mutado a cada
 * render) e a posição do card é escrita imperativamente em `cardEl` — sem
 * re-render a 60fps.
 */
export interface OverlayStore {
  /** Fragmento ativo (hover/toque). */
  activeId: string | null;
  /** Layout compacto (mobile / ponteiro grosso): painel inferior. */
  isCompact: boolean;
  /** Elemento DOM do card, posicionado pela projeção 3D→2D. */
  cardEl: HTMLDivElement | null;
  /** Conector visual (linha técnica) entre o fragmento e o card. */
  connectorLine: SVGLineElement | null;
  /** Ponto-âncora desenhado sobre o fragmento projetado. */
  connectorDot: SVGCircleElement | null;
}

export function useOverlayStore() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);

  // Objeto estável; campos sincronizados a cada render para o loop de frame.
  const store = useRef<OverlayStore>({
    activeId: null,
    isCompact: false,
    cardEl: null,
    connectorLine: null,
    connectorDot: null,
  }).current;
  store.activeId = activeId;
  store.isCompact = isCompact;

  const setActive = useCallback((id: string | null) => setActiveId(id), []);
  const setCardEl = useCallback(
    (el: HTMLDivElement | null) => {
      store.cardEl = el;
    },
    [store],
  );
  const setConnectorLine = useCallback(
    (el: SVGLineElement | null) => {
      store.connectorLine = el;
    },
    [store],
  );
  const setConnectorDot = useCallback(
    (el: SVGCircleElement | null) => {
      store.connectorDot = el;
    },
    [store],
  );

  useEffect(() => {
    const media = window.matchMedia(OVERLAY.compactQuery);
    const update = () => setIsCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return {
    store,
    activeId,
    isCompact,
    setActive,
    setCardEl,
    setConnectorLine,
    setConnectorDot,
  };
}
