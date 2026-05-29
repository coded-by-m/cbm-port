"use client";

import { useEffect, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import type { Group } from "three";
import { FIT_RATIO } from "./config";

/**
 * Mantém o terreno proporcional em qualquer tela.
 *
 * A escala do grupo é derivada do viewport 3D (não de tamanhos fixos), usando
 * o maior lado para garantir que a malha cubra a viewport (full-bleed) em
 * desktop e mobile, e reage a redimensionamentos.
 */
export function useResponsiveFit(ref: RefObject<Group>, fitRadius: number) {
  const width = useThree((state) => state.viewport.width);
  const height = useThree((state) => state.viewport.height);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;

    const largestSide = Math.max(width, height);
    const scale = (largestSide * FIT_RATIO) / fitRadius;
    group.scale.setScalar(scale);
  }, [ref, width, height, fitRadius]);
}
