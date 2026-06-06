"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial } from "three";
import { sampleHeight } from "@/components/zones/TerrainMesh/geometry";
import { FRAGMENT } from "@/components/zones/ProjectFragments/config";
import {
  BASE_RING,
  FRAGMENT_VISUAL,
  HOST_LAYER,
  type FragmentSlot,
} from "./config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Anel discreto de pontos no terreno, ancorando o fragmento à paisagem.
 *
 * 12 pontos circulares ao redor da base do fragmento, repousando na altura
 * do terreno (com sampleHeight). Marca "aqui tem obra" sem competir com a
 * silhueta da torre.
 */
export default function FragmentBaseRing({
  slot,
  isActive,
}: {
  slot: FragmentSlot;
  isActive: boolean;
}) {
  const positions = useMemo(
    () =>
      Array.from({ length: BASE_RING.pointCount }, (_, i) => {
        const angle = (i / BASE_RING.pointCount) * Math.PI * 2;
        const r = FRAGMENT.baseRadius * slot.scale * BASE_RING.radiusFactor;
        return [Math.cos(angle) * r, Math.sin(angle) * r] as [number, number];
      }),
    [slot.scale],
  );

  const meshRefs = useRef<(Mesh | null)[]>([]);
  const matRefs = useRef<(MeshBasicMaterial | null)[]>([]);
  const opacity = useRef<number>(BASE_RING.baseOpacity);
  const highlight = useRef(0);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    const target = isActive ? BASE_RING.activeOpacity : BASE_RING.baseOpacity;
    opacity.current = lerp(
      opacity.current,
      target,
      Math.min(1, delta * BASE_RING.lerpSpeed),
    );

    // Acompanha o avanço em z do fragmento ativo (mesmo `activePushZ` da torre),
    // pra o anel não descolar pra trás quando o ativo vem em direção à câmera.
    highlight.current = lerp(
      highlight.current,
      isActive ? 1 : 0,
      Math.min(1, delta * BASE_RING.lerpSpeed),
    );
    const pushZ = FRAGMENT_VISUAL.activePushZ * highlight.current;

    // Cada ponto repousa na altura do terreno naquele (x, z).
    positions.forEach(([dx, dz], i) => {
      const mesh = meshRefs.current[i];
      const mat = matRefs.current[i];
      if (!mesh || !mat) return;
      const lz = dz + pushZ;
      const worldX = slot.x + dx;
      const worldZ = slot.z + lz;
      const y = sampleHeight(worldX, worldZ, t, HOST_LAYER) + 0.02;
      mesh.position.set(dx, y, lz);
      mat.opacity = opacity.current;
    });
  });

  return (
    <group position={[slot.x, 0, slot.z]}>
      {positions.map(([dx, dz], i) => (
        <mesh
          key={`ring-${i}`}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[dx, 0, dz]}
          renderOrder={2}
        >
          <icosahedronGeometry args={[BASE_RING.pointSize, 0]} />
          <meshBasicMaterial
            ref={(el) => {
              matRefs.current[i] = el;
            }}
            color={BASE_RING.color}
            transparent
            opacity={BASE_RING.baseOpacity}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  );
}
