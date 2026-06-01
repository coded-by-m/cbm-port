"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import type { OverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ScrollFragment from "@/components/lab/ScrollCamera/ScrollFragment";
import { useScrollCamera } from "@/components/lab/ScrollCamera/useScrollCamera";
import { useScrollNarrative } from "@/components/lab/ScrollCamera/useScrollNarrative";
import { LANDSCAPE_CARDS } from "./config";

export default function LandscapeScene({
  store,
  progress,
  setActive,
}: {
  store: OverlayStore;
  progress: MutableRefObject<number>;
  setActive: (id: string | null) => void;
}) {
  const fitRef = useRef<Group>(null);

  const fitRadius = useMemo(
    () => Math.max(...LAYERS.map((layer) => layer.sizeX / 2)),
    [],
  );

  useResponsiveFit(fitRef, fitRadius);
  useScrollCamera(progress);
  useScrollNarrative(progress, setActive);

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}

      <group
        position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}
      >
        {LANDSCAPE_CARDS.map((card, index) => (
          <ScrollFragment
            key={card.id}
            card={card}
            store={store}
            progress={progress}
            envelopeIndex={index}
          />
        ))}
      </group>
    </group>
  );
}
