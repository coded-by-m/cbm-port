"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import { PROJECT_CARDS } from "@/components/lab/HtmlOverlay/config";
import type { OverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ScrollFragment from "./ScrollFragment";
import { useScrollCamera } from "./useScrollCamera";
import { useScrollNarrative } from "./useScrollNarrative";

/**
 * Cena 3D do Scroll Camera.
 *
 * Reaproveita o terreno e o fit do Terrain Mesh e os fragmentos/overlay. A
 * câmera e o fragmento ativo são dirigidos pelo progresso do scroll (não há
 * câmera cinematográfica autônoma nem hover).
 */
export default function ScrollScene({
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
        {PROJECT_CARDS.map((card, index) => (
          <ScrollFragment
            key={card.id}
            card={card}
            index={index}
            store={store}
          />
        ))}
      </group>
    </group>
  );
}
