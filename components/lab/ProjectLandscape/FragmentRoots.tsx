"use client";

import { createRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { ROOTS } from "./config";
import type { Vec3, TowerGeometry } from "./towerGeometry";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Raízes descendo dos 3 nós da base pra dentro do terreno.
 *
 * Linhas reais (não sprite). Termina em mini-nós debaixo da superfície.
 * Reforça "obra ancorada". Discreto — opacity 0.25 base.
 */
export default function FragmentRoots({
  geom,
  isActive,
}: {
  geom: TowerGeometry;
  isActive: boolean;
}) {
  // 3 nós da base: indices 0, 1, 2
  const baseNodes = useMemo(
    () => [geom.nodes[0], geom.nodes[1], geom.nodes[2]],
    [geom],
  );

  const lineRefs = useMemo(
    () => baseNodes.map(() => createRef<Line2>()),
    [baseNodes],
  );
  const nodeMatRefs = useMemo(
    () => baseNodes.map(() => createRef<MeshBasicMaterial>()),
    [baseNodes],
  );
  const opacity = useRef<number>(ROOTS.baseOpacity);

  useFrame((_, delta) => {
    const target = isActive ? ROOTS.activeOpacity : ROOTS.baseOpacity;
    opacity.current = lerp(
      opacity.current,
      target,
      Math.min(1, delta * ROOTS.lerpSpeed),
    );
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = opacity.current;
    });
    nodeMatRefs.forEach((ref) => {
      if (ref.current) ref.current.opacity = opacity.current;
    });
  });

  return (
    <>
      {baseNodes.map((node, i) => {
        const bottom: Vec3 = [node[0], node[1] - ROOTS.depth, node[2]];
        return (
          <group key={`root-${i}`}>
            <Line
              ref={lineRefs[i]}
              points={[node, bottom]}
              color={ROOTS.color}
              lineWidth={ROOTS.lineWidth}
              transparent
              opacity={ROOTS.baseOpacity}
              depthWrite={false}
              depthTest={false}
            />
            <mesh position={bottom}>
              <icosahedronGeometry args={[ROOTS.bottomNodeRadius, 0]} />
              <meshBasicMaterial
                ref={nodeMatRefs[i]}
                color={ROOTS.color}
                transparent
                opacity={ROOTS.baseOpacity}
                depthWrite={false}
                depthTest={false}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
