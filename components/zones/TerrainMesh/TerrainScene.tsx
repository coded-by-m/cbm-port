"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import TerrainLayer from "./TerrainLayer";
import { useCinematicCamera } from "./useCinematicCamera";
import { useResponsiveFit } from "./useResponsiveFit";
import { useCursorHover } from "./useCursorHover";
import { FIT_RADIUS, LAYERS } from "./config";

/**
 * Cena do Terrain Mesh.
 *
 * Renderiza a camada de terreno e delega:
 *  - escala responsiva para `useResponsiveFit`;
 *  - movimento de observação para `useCinematicCamera`;
 *  - lift localizado sob o cursor para `useCursorHover` (apenas a área ao
 *    redor do ponteiro responde — não o terreno todo).
 *
 * O `scaleRef` rastreia a escala atual do grupo (atualizada pelo useResponsiveFit)
 * pra que o hook de hover possa converter coordenadas de mundo em coordenadas
 * locais do terreno.
 */
export default function TerrainScene({
  cinematic = true,
}: {
  /** `false` quando embutido numa cena com câmera própria (Paisagem orbital):
   *  evita que o drift cinematográfico sobrescreva o controlador da cena-mãe. */
  cinematic?: boolean;
} = {}) {
  const fitRef = useRef<Group>(null);
  const scaleRef = useRef<number>(1);

  useResponsiveFit(fitRef, FIT_RADIUS);
  useCinematicCamera(cinematic);
  const hoverRef = useCursorHover(scaleRef);

  // Mantém scaleRef alinhado com a escala atual do grupo a cada frame.
  // useResponsiveFit atualiza só em mudanças de viewport, mas leitura por
  // frame é gratuita e elimina qualquer race.
  useFrame(() => {
    if (fitRef.current) scaleRef.current = fitRef.current.scale.x;
  });

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} hoverRef={hoverRef} />
      ))}
    </group>
  );
}
