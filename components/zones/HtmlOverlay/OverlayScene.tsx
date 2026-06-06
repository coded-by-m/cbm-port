"use client";

import { useMemo, useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/zones/TerrainMesh/TerrainLayer";
import { useCinematicCamera } from "@/components/zones/TerrainMesh/useCinematicCamera";
import { useResponsiveFit } from "@/components/zones/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/zones/TerrainMesh/config";
import { HOST_LAYER } from "@/components/zones/ProjectFragments/config";
import OverlayFragment from "./OverlayFragment";
import { PROJECT_CARDS } from "./config";
import type { OverlayStore } from "./useOverlayStore";

/**
 * Cena 3D do HTML Overlay.
 *
 * Reaproveita o terreno, a câmera e o fit do Terrain Mesh (sem alterá-lo) e
 * posiciona os fragmentos no mesmo grupo. Cada fragmento, quando ativo, projeta
 * sua posição para a tela e ancora o card HTML (renderizado fora do Canvas).
 */
export default function OverlayScene({
  store,
  setActive,
}: {
  store: OverlayStore;
  setActive: (id: string | null) => void;
}) {
  const fitRef = useRef<Group>(null);

  useResponsiveFit(fitRef, FIT_RADIUS);
  useCinematicCamera();

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}

      <group
        position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}
      >
        {PROJECT_CARDS.map((card, index) => (
          <OverlayFragment
            key={card.id}
            card={card}
            index={index}
            store={store}
            setActive={setActive}
          />
        ))}
      </group>
    </group>
  );
}
