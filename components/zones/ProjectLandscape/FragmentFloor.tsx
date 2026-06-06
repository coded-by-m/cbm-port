"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, type MeshBasicMaterial } from "three";
import { FLOOR } from "./config";
import type { TowerGeometry } from "./towerGeometry";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Chão técnico transparente sob o fragmento.
 *
 * Triângulo plano conectando os 3 nós da base. Cor off-white com opacidade
 * baixa (0.05 base, 0.12 ativo). Lê como "footprint do projeto" — discreto.
 */
export default function FragmentFloor({
  geom,
  isActive,
}: {
  geom: TowerGeometry;
  isActive: boolean;
}) {
  const matRef = useRef<MeshBasicMaterial>(null);
  const opacity = useRef<number>(FLOOR.baseOpacity);

  // BufferGeometry com os 3 vértices da base, projetados para Y=yOffset
  // (acima do terreno só pra evitar z-fighting).
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const positions = new Float32Array([
      geom.nodes[0][0], FLOOR.yOffset, geom.nodes[0][2],
      geom.nodes[1][0], FLOOR.yOffset, geom.nodes[1][2],
      geom.nodes[2][0], FLOOR.yOffset, geom.nodes[2][2],
    ]);
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.computeVertexNormals();
    return g;
  }, [geom]);

  useFrame((_, delta) => {
    const target = isActive ? FLOOR.activeOpacity : FLOOR.baseOpacity;
    opacity.current = lerp(
      opacity.current,
      target,
      Math.min(1, delta * FLOOR.lerpSpeed),
    );
    if (matRef.current) matRef.current.opacity = opacity.current;
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        ref={matRef}
        color={FLOOR.color}
        transparent
        opacity={FLOOR.baseOpacity}
        depthWrite={false}
        side={2}
      />
    </mesh>
  );
}
