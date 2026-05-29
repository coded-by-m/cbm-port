"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";

/**
 * Descoberta de um fragmento.
 *
 * Unifica hover (desktop) e toque (mobile) num único estado `active`:
 *  - ponteiro entra/sai → destaca/relaxa (desktop);
 *  - toque/clique → alterna (mobile, onde não há hover).
 *
 * `stopPropagation` evita que fragmentos sobrepostos disparem juntos. Sem
 * card, sem modal — apenas o estado de destaque.
 */
export function useDiscovery() {
  const [active, setActive] = useState(false);

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setActive(true);
    document.body.style.cursor = "pointer";
  }, []);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setActive(false);
    document.body.style.cursor = "";
  }, []);

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setActive((current) => !current);
  }, []);

  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  return {
    active,
    handlers: { onPointerOver, onPointerOut, onPointerDown },
  };
}
