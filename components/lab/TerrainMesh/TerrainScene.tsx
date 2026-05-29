"use client";

import { useMemo, useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "./TerrainLayer";
import { useCinematicCamera } from "./useCinematicCamera";
import { useResponsiveFit } from "./useResponsiveFit";
import { LAYERS } from "./config";

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

  // Raio de referência para o fit: a maior meia-largura entre as camadas.
  const fitRadius = useMemo(
    () => Math.max(...LAYERS.map((layer) => layer.sizeX / 2)),
    [],
  );

  useResponsiveFit(fitRef, fitRadius);
  useCinematicCamera();

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
    </group>
  );
}
