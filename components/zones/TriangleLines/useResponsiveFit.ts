"use client";

import { useEffect, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import type { Group } from "three";
import { FIT_RATIO } from "./config";

/**
 * Mantém a malha proporcional em qualquer tela.
 *
 * A escala do grupo é derivada do viewport 3D (não de tamanhos fixos),
 * usando o maior raio planar da estrutura como referência. Adapta-se a
 * desktop e mobile e reage a redimensionamentos.
 */
export function useResponsiveFit(ref: RefObject<Group>, fitRadius: number) {
  const width = useThree((state) => state.viewport.width);
  const height = useThree((state) => state.viewport.height);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;

    const smallestSide = Math.min(width, height);
    const scale = (smallestSide * FIT_RATIO) / fitRadius;
    group.scale.setScalar(scale);
  }, [ref, width, height, fitRadius]);
}
