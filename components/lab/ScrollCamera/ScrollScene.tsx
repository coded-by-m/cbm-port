"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import type { OverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ScrollFragment from "./ScrollFragment";
import { useScrollCamera } from "./useScrollCamera";
import { useScrollNarrative } from "./useScrollNarrative";
import { SCROLL_CARDS } from "./config";

/**
 * Cena 3D do Scroll Camera.
 *
 * Usa SCROLL_CARDS (posições ajustadas para o percurso em profundidade) em
 * vez das posições originais de HtmlOverlay — os experimentos 4 e 5 ficam
 * intocados. Passa `progress` e `envelopeIndex` a cada ScrollFragment para
 * que cada um controle sua própria visibilidade ao longo da trilha.
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

  useResponsiveFit(fitRef, FIT_RADIUS);
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
        {SCROLL_CARDS.map((card, index) => (
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
