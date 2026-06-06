"use client";

import { useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/lab/TerrainMesh/config";

/**
 * Substrato conectivo do HomeCanvas — o "barro" persistente que NUNCA
 * desmonta. Por enquanto é só o terreno triangulado da marca (reusa
 * `TerrainLayer`, que é cena R3F pura, sem Canvas/câmera próprios).
 *
 * Próximos passos do spec adicionam aqui o **pool de fragmentos instanciado**
 * que re-targeta posições por capítulo (o mecanismo dos morphs 4–7).
 *
 * Lição reaproveitada: `TerrainLayer` roda sem o `TerrainScene` (que controla
 * a câmera via `useCinematicCamera`). Aqui a câmera é do `CameraRig`, então
 * renderizamos `LAYERS.map(TerrainLayer)` direto, só com o fit responsivo.
 */
export function ConnectiveSubstrate() {
  const fitRef = useRef<Group>(null);
  useResponsiveFit(fitRef, FIT_RADIUS);

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
    </group>
  );
}
