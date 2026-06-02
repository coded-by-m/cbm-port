"use client";

import { useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useCinematicCamera } from "@/components/lab/TerrainMesh/useCinematicCamera";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import CenterFragment from "./CenterFragment";
import { LANDSCAPE_CARDS } from "./config";

export default function LandscapeScene({
  activeIndex,
}: {
  activeIndex: number;
}) {
  const fitRef = useRef<Group>(null);

  useResponsiveFit(fitRef, FIT_RADIUS);
  useCinematicCamera();

  const seed = LANDSCAPE_CARDS[activeIndex]?.seed ?? 17;

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
      <group position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}>
        <CenterFragment seed={seed} />
      </group>
    </group>
  );
}
