"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  type Group,
  type MeshBasicMaterial,
} from "three";
import { EDGE_PULSE } from "./config";
import type { TowerGeometry } from "./towerGeometry";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const colorBase = new Color(EDGE_PULSE.baseColor);
const colorActive = new Color(EDGE_PULSE.activeColor);
const colorScratch = new Color();

/**
 * Faísca suave percorrendo as arestas da torre.
 *
 * Duas camadas concêntricas:
 *  - core: pequeno ponto central (opacity ~0.45 base, ~0.75 ativo)
 *  - halo: bolha grande com AdditiveBlending (opacity baixa, faz o "blur")
 *
 * Caminho: 0→3→6→4→1→5→6→3→0→2→5→1→4→6→0 (atravessa todos os níveis).
 * Lento (1.6s por aresta) — total ≈22s no idle. Quando ativo acelera 1.4×
 * e a cor pende pra signal red.
 */
export default function FragmentEdgePulse({
  geom,
  isActive,
}: {
  geom: TowerGeometry;
  isActive: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const coreMatRef = useRef<MeshBasicMaterial>(null);
  const haloMatRef = useRef<MeshBasicMaterial>(null);
  const elapsed = useRef(0);
  const coreOpacity = useRef<number>(EDGE_PULSE.coreBaseOpacity);
  const haloOpacity = useRef<number>(EDGE_PULSE.haloBaseOpacity);
  const colorMix = useRef<number>(0);

  const path = useMemo<number[]>(
    () => [0, 3, 6, 4, 1, 5, 6, 3, 0, 2, 5, 1, 4, 6, 0],
    [],
  );

  const points = useMemo(() => path.map((i) => geom.nodes[i]), [path, geom]);

  useFrame((_, delta) => {
    const speedMul = isActive ? 1.4 : 1;
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

    const group = groupRef.current;
    if (group) {
      group.position.set(
        lerp(from[0], to[0], localT),
        lerp(from[1], to[1], localT),
        lerp(from[2], to[2], localT),
      );
    }

    const coreTarget = isActive
      ? EDGE_PULSE.coreActiveOpacity
      : EDGE_PULSE.coreBaseOpacity;
    const haloTarget = isActive
      ? EDGE_PULSE.haloActiveOpacity
      : EDGE_PULSE.haloBaseOpacity;

    coreOpacity.current = lerp(
      coreOpacity.current,
      coreTarget,
      Math.min(1, delta * EDGE_PULSE.lerpSpeed),
    );
    haloOpacity.current = lerp(
      haloOpacity.current,
      haloTarget,
      Math.min(1, delta * EDGE_PULSE.lerpSpeed),
    );

    const targetMix = isActive ? 1 : 0;
    colorMix.current = lerp(
      colorMix.current,
      targetMix,
      Math.min(1, delta * EDGE_PULSE.lerpSpeed),
    );

    colorScratch.copy(colorBase).lerp(colorActive, colorMix.current);

    if (coreMatRef.current) {
      coreMatRef.current.opacity = coreOpacity.current;
      coreMatRef.current.color.copy(colorScratch);
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = haloOpacity.current;
      haloMatRef.current.color.copy(colorScratch);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Halo blurry: bola grande com Additive blending. */}
      <mesh>
        <icosahedronGeometry args={[EDGE_PULSE.haloRadius, 2]} />
        <meshBasicMaterial
          ref={haloMatRef}
          color={EDGE_PULSE.baseColor}
          transparent
          opacity={EDGE_PULSE.haloBaseOpacity}
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </mesh>
      {/* Core: ponto central pequeno. */}
      <mesh>
        <icosahedronGeometry args={[EDGE_PULSE.coreRadius, 1]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color={EDGE_PULSE.baseColor}
          transparent
          opacity={EDGE_PULSE.coreBaseOpacity}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </group>
  );
}
