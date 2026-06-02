"use client";

import { useMemo, useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "./TerrainLayer";
import { useCinematicCamera } from "./useCinematicCamera";
import { useResponsiveFit } from "./useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "./config";

/**
 * Cena do Terrain Mesh.
 *
 * Distribui as camadas de terreno em profundidade (background → foreground) e
 * delega:
 *  - escala responsiva para `useResponsiveFit`;
 *  - movimento de observação para `useCinematicCamera`.
 */
export default function TerrainScene() {
  const fitRef = useRef<Group>(null);

  useResponsiveFit(fitRef, FIT_RADIUS);
  useCinematicCamera();

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
    </group>
  );
}
