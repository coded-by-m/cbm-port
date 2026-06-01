"use client";

import { createRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { buildFragment } from "@/components/lab/ProjectFragments/geometry";
import { HERO } from "./config";

const TWO_PI = Math.PI * 2;

interface HeroStructureProps {
  seed: number;
  scale: number;
  yOffset: number;
  xOffset?: number;
  zOffset?: number;
  rotationSpeed: number;
}

function HeroStructure({
  seed,
  scale,
  yOffset,
  xOffset = 0,
  zOffset = 0,
  rotationSpeed,
}: HeroStructureProps) {
  const geom = useMemo(() => buildFragment(seed), [seed]);
  const groupRef = useRef<Group>(null);
  const lineRefs = useMemo(() => geom.edges.map(() => createRef<Line2>()), [geom]);
  const nodeRefs = useMemo(() => geom.nodes.map(() => createRef<Mesh>()), [geom]);
  const matRefs = useMemo(
    () => geom.nodes.map(() => createRef<MeshBasicMaterial>()),
    [geom],
  );
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    const group = groupRef.current;
    if (group) {
      group.rotation.y = t * rotationSpeed * TWO_PI;
      group.position.y =
        yOffset +
        Math.sin(t * (TWO_PI / HERO.bobPeriod) + seed) * HERO.bobAmplitude * scale;
    }
  });

  return (
    <group ref={groupRef} position={[xOffset, yOffset, zOffset]} scale={scale}>
      {geom.edges.map((points, i) => (
        <Line
          key={`e-${i}`}
          ref={lineRefs[i]}
          points={points}
          color={HERO.edgeColor}
          lineWidth={1.2}
          transparent
          opacity={HERO.edgeOpacity}
          depthWrite={false}
          depthTest={false}
        />
      ))}

      {geom.nodes.map((position, i) => (
        <mesh key={`n-${i}`} ref={nodeRefs[i]} position={position}>
          <icosahedronGeometry args={[HERO.nodeRadius, 1]} />
          <meshBasicMaterial
            ref={matRefs[i]}
            color={i === 3 ? HERO.apexColor : HERO.nodeColor}
            transparent
            opacity={i === 3 ? HERO.apexOpacity : HERO.nodeOpacity}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Hero Fragment — aglomerado focal distante.
 *
 * Estruturas trianguladas em escala maior, agrupadas na profundidade da
 * cena. A névoa engole parcialmente — o que se vê é suficiente para
 * despertar curiosidade, não para revelar tudo.
 */
export default function HeroFragment() {
  return (
    <group position={[...HERO.position]}>
      {HERO.structures.map((s, i) => (
        <HeroStructure key={i} {...s} />
      ))}
    </group>
  );
}
