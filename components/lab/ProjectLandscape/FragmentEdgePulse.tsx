"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Mesh, type MeshBasicMaterial } from "three";
import { EDGE_PULSE } from "./config";
import type { TowerGeometry } from "./towerGeometry";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const colorBase = new Color(EDGE_PULSE.baseColor);
const colorActive = new Color(EDGE_PULSE.activeColor);
const colorScratch = new Color();

/**
 * Ponto luminoso percorrendo as arestas da torre.
 *
 * Caminho: base[0] → mid[0] → apex → mid[1] → base[1] → mid[2] → apex →
 * mid[0] → base[2] → base[0] (loop). Cycle ≈ 4.5s no idle. Quando ativo,
 * fica vermelho e acelera (~1.5×).
 */
export default function FragmentEdgePulse({
  geom,
  isActive,
}: {
  geom: TowerGeometry;
  isActive: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshBasicMaterial>(null);
  const elapsed = useRef(0);
  const opacity = useRef<number>(EDGE_PULSE.baseOpacity);
  const colorMix = useRef<number>(0);

  // Caminho de nós (índices) que o pulso percorre.
  // 0,1,2 = base; 3,4,5 = mid; 6 = apex
  const path = useMemo<number[]>(
    () => [0, 3, 6, 4, 1, 5, 6, 3, 0, 2, 5, 1, 4, 6, 0],
    [],
  );

  const points = useMemo(() => path.map((i) => geom.nodes[i]), [path, geom]);

  useFrame((_, delta) => {
    const speedMul = isActive ? 1.5 : 1;
    elapsed.current += delta * speedMul;

    const totalEdges = points.length - 1;
    const totalDuration = totalEdges * EDGE_PULSE.timePerEdge;
    const t = elapsed.current % totalDuration;

    const edgeIdx = Math.min(
      totalEdges - 1,
      Math.floor(t / EDGE_PULSE.timePerEdge),
    );
    const localT = (t - edgeIdx * EDGE_PULSE.timePerEdge) / EDGE_PULSE.timePerEdge;

    const from = points[edgeIdx];
    const to = points[edgeIdx + 1];

    const mesh = meshRef.current;
    if (mesh) {
      mesh.position.set(
        lerp(from[0], to[0], localT),
        lerp(from[1], to[1], localT),
        lerp(from[2], to[2], localT),
      );
    }

    const targetOpacity = isActive
      ? EDGE_PULSE.activeOpacity
      : EDGE_PULSE.baseOpacity;
    opacity.current = lerp(
      opacity.current,
      targetOpacity,
      Math.min(1, delta * EDGE_PULSE.lerpSpeed),
    );

    const targetMix = isActive ? 1 : 0;
    colorMix.current = lerp(
      colorMix.current,
      targetMix,
      Math.min(1, delta * EDGE_PULSE.lerpSpeed),
    );

    if (matRef.current) {
      matRef.current.opacity = opacity.current;
      colorScratch.copy(colorBase).lerp(colorActive, colorMix.current);
      matRef.current.color.copy(colorScratch);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[EDGE_PULSE.radius, 1]} />
      <meshBasicMaterial
        ref={matRef}
        color={EDGE_PULSE.baseColor}
        transparent
        opacity={EDGE_PULSE.baseOpacity}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
