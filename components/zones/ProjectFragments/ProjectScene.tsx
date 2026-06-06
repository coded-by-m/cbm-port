"use client";

import { useMemo, useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/zones/TerrainMesh/TerrainLayer";
import { useCinematicCamera } from "@/components/zones/TerrainMesh/useCinematicCamera";
import { useResponsiveFit } from "@/components/zones/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/zones/TerrainMesh/config";
import Fragments from "./Fragments";

/**
 * Cena do Project Fragments.
 *
 * Reaproveita o Terrain Mesh como base (camadas + câmera + fit, sem alterá-lo)
 * e adiciona os fragmentos no mesmo grupo de fit — assim eles repousam sobre o
 * terreno e escalam junto com ele de forma responsiva.
 */
export default function ProjectScene() {
  const fitRef = useRef<Group>(null);

  useResponsiveFit(fitRef, FIT_RADIUS);
  useCinematicCamera();

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
      <Fragments />
    </group>
  );
}
