"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { EDGE_PULSE } from "./config";
import type { TowerGeometry } from "./towerGeometry";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const colorBase = new Color("#F5F2ED");
const colorActive = new Color("#FB3640");
const colorScratch = new Color();

/**
 * Mini-tetraedro 3D percorrendo as arestas da torre.
 *
 * Volumétrico (não sprite) — gira em 3 eixos enquanto se move, sempre
 * visível de qualquer ângulo. AdditiveBlending dá leitura de "partícula
 * de luz com forma triangulada". Lê como mini-cursor 3D em movimento.
 *
 * Caminho: 0→3→6→4→1→5→6→3→0→2→5→1→4→6→0. 1.6s/aresta no idle, 1.4×
 * quando ativo + cor pende pro signal red.
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
    const localT =
      (t - edgeIdx * EDGE_PULSE.timePerEdge) / EDGE_PULSE.timePerEdge;

    const from = points[edgeIdx];
    const to = points[edgeIdx + 1];

    const mesh = meshRef.current;
    if (mesh) {
      mesh.position.set(
        lerp(from[0], to[0], localT),
        lerp(from[1], to[1], localT),
        lerp(from[2], to[2], localT),
      );
      // Rotação em múltiplos eixos pra leitura volumétrica.
      const r = EDGE_PULSE.rotateSpeed * speedMul * delta;
      mesh.rotation.x += r;
      mesh.rotation.y += r * 0.7;
      mesh.rotation.z += r * 0.4;
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
      <tetrahedronGeometry args={[EDGE_PULSE.size, 0]} />
      <meshBasicMaterial
        ref={matRef}
        color={"#F5F2ED"}
        transparent
        opacity={EDGE_PULSE.baseOpacity}
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
