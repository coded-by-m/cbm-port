"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { ANTENNA } from "./config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Antena vertical saindo do apex.
 *
 * Linha 3D real (não sprite) — imune a problemas de billboard com o flip.
 * Termina num pequeno nó no topo. Brilha quando ativo.
 */
export default function FragmentAntenna({
  isActive,
  baseY,
}: {
  isActive: boolean;
  /** Y local onde a antena começa (apex.y). */
  baseY: number;
}) {
  const lineRef = useRef<Line2 | null>(null);
  const nodeRef = useRef<MeshBasicMaterial | null>(null);
  const opacity = useRef<number>(ANTENNA.baseOpacity);

  useFrame((_, delta) => {
    const target = isActive ? ANTENNA.activeOpacity : ANTENNA.baseOpacity;
    opacity.current = lerp(
      opacity.current,
      target,
      Math.min(1, delta * ANTENNA.lerpSpeed),
    );
    if (lineRef.current) {
      (lineRef.current.material as { opacity: number }).opacity =
        opacity.current;
    }
    if (nodeRef.current) {
      nodeRef.current.opacity = opacity.current;
    }
  });

  const topY = baseY + ANTENNA.height;

  return (
    <>
      <Line
        ref={lineRef}
        points={[
          [0, baseY, 0],
          [0, topY, 0],
        ]}
        color={ANTENNA.color}
        lineWidth={ANTENNA.lineWidth}
        transparent
        opacity={ANTENNA.baseOpacity}
        depthWrite={false}
        depthTest={false}
      />
      <mesh position={[0, topY, 0]}>
        <icosahedronGeometry args={[ANTENNA.topNodeRadius, 1]} />
        <meshBasicMaterial
          ref={nodeRef}
          color={ANTENNA.color}
          transparent
          opacity={ANTENNA.baseOpacity}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </>
  );
}
