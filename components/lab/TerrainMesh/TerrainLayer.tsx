"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type MeshBasicMaterial } from "three";
import { buildTerrainGeometry, updateTerrain } from "./geometry";
import { useTerrainBuild } from "./useTerrainBuild";
import type { LayerConfig } from "./config";
import type { CursorHover } from "./useCursorHover";

/**
 * Uma camada de profundidade do terreno.
 *
 * Constrói a geometria uma única vez e a compartilha entre dois materiais:
 *  - preenchimento (vertex colors): dá corpo e gradiente de altura — evita o
 *    aspecto chapado e a leitura de "wireframe genérico";
 *  - wireframe: as arestas técnicas da malha triangulada.
 *
 * A cada frame as alturas e cores são recalculadas (respiração da malha) e a
 * opacidade acompanha o `reveal` da construção. `polygonOffset` no
 * preenchimento evita z-fighting com o wireframe.
 */
export default function TerrainLayer({
  layer,
  hoverRef,
}: {
  layer: LayerConfig;
  hoverRef?: RefObject<CursorHover>;
}) {
  const { geometry } = useMemo(() => buildTerrainGeometry(layer), [layer]);
  const low = useMemo(() => new Color(layer.fillLow), [layer.fillLow]);
  const high = useMemo(() => new Color(layer.fillHigh), [layer.fillHigh]);

  const fillRef = useRef<MeshBasicMaterial>(null);
  const wireRef = useRef<MeshBasicMaterial>(null);
  const elapsed = useRef(0);

  const reveal = useTerrainBuild(layer.buildDelay);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const r = reveal.current;

    // Micro-deslocamento orgânico próprio da camada (parallax em profundidade).
    const phase =
      elapsed.current * layer.driftSpeed * Math.PI * 2 + layer.driftPhase;
    const time = elapsed.current + Math.sin(phase) * layer.driftAmp;

    const hover = hoverRef?.current ?? undefined;
    updateTerrain(geometry, layer, time, r, low, high, undefined, hover);

    if (fillRef.current) fillRef.current.opacity = layer.fillOpacity * r;
    if (wireRef.current) wireRef.current.opacity = layer.edgeOpacity * r;
  });

  return (
    <group position={[layer.xOffset, layer.yOffset, layer.zOffset]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          ref={fillRef}
          vertexColors
          transparent
          opacity={0}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          ref={wireRef}
          wireframe
          color={layer.edgeColor}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
