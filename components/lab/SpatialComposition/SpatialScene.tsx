"use client";

import { useMemo, useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/lab/TerrainMesh/config";
import HeroFragment from "./HeroFragment";
import { useSpatialCamera } from "./useSpatialCamera";

/**
 * Cena espacial — terreno em profundidade + estrutura focal.
 *
 * As 3 camadas do terreno criam o chão e a moldura de profundidade.
 * O Hero Fragment fica além do midground, parcialmente engolido pela
 * névoa — presente, mas não totalmente revelado.
 */
export default function SpatialScene() {
  const fitRef = useRef<Group>(null);

  useResponsiveFit(fitRef, FIT_RADIUS);
  useSpatialCamera();

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
      <HeroFragment />
    </group>
  );
}
