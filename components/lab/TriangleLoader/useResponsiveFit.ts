"use client";

import { useEffect, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import type { Group } from "three";
import { TRIANGLE_RADIUS } from "./config";

/** Fração do menor lado do viewport que a meia-altura da estrutura deve ocupar. */
const FIT_RATIO = 0.32;

/**
 * Mantém o triângulo proporcional em qualquer tela.
 *
 * Em vez de tamanhos fixos, a escala do grupo é derivada do viewport 3D,
 * garantindo adaptação consistente entre desktop e mobile (retrato ou
 * paisagem). Reage automaticamente a redimensionamentos da janela.
 */
export function useResponsiveFit(ref: RefObject<Group>) {
  const width = useThree((state) => state.viewport.width);
  const height = useThree((state) => state.viewport.height);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;

    const smallestSide = Math.min(width, height);
    const scale = (smallestSide * FIT_RATIO) / TRIANGLE_RADIUS;
    group.scale.setScalar(scale);
  }, [ref, width, height]);
}
