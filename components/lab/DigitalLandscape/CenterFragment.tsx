"use client";

import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { buildFragment } from "@/components/lab/ProjectFragments/geometry";
import {
  FRAGMENT,
  FRAGMENT_COLORS,
  FRAGMENT_MOTION,
  HOST_LAYER,
} from "@/components/lab/ProjectFragments/config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CenterFragment({ seed }: { seed: number }) {
  const [currentSeed, setCurrentSeed] = useState(seed);
  const presence = useRef(1);
  const targetPresence = useRef(1);
  const elapsed = useRef(0);
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (seed !== currentSeed) {
      targetPresence.current = 0;
      const timer = setTimeout(() => {
        setCurrentSeed(seed);
        targetPresence.current = 1;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [seed, currentSeed]);

  const geom = useMemo(() => buildFragment(currentSeed), [currentSeed]);
  const lineRefs = useMemo(() => geom.edges.map(() => createRef<Line2>()), [geom]);
  const nodeMeshRefs = useMemo(() => geom.nodes.map(() => createRef<Mesh>()), [geom]);
  const nodeMatRefs = useMemo(
    () => geom.nodes.map(() => createRef<MeshBasicMaterial>()),
    [geom],
  );

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    presence.current = lerp(
      presence.current,
      targetPresence.current,
      Math.min(1, delta * 6),
    );
    const p = presence.current;

    const surfaceY = sampleHeight(0, 0, t, HOST_LAYER);
    const bob =
      Math.sin(t * (TWO_PI / FRAGMENT_MOTION.bobPeriod)) *
      FRAGMENT_MOTION.bobAmplitude;

    const group = groupRef.current;
    if (group) {
      group.position.set(0, surfaceY + FRAGMENT.surfaceLift + bob, 0);
      group.scale.setScalar(p);
      group.rotation.y = t * (TWO_PI / FRAGMENT_MOTION.yawPeriod);
    }

    const edgeOpacity = FRAGMENT_COLORS.edgeHighlightOpacity * p;
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOpacity;
    });

    const nodeOpacity = FRAGMENT_COLORS.nodeHighlightOpacity * p;
    nodeMatRefs.forEach((ref) => {
      if (ref.current) ref.current.opacity = nodeOpacity;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {geom.edges.map((points, i) => (
        <Line
          key={`edge-${currentSeed}-${i}`}
          ref={lineRefs[i]}
          points={points}
          color={FRAGMENT_COLORS.edge}
          lineWidth={1.4}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      ))}
      {geom.nodes.map((position, i) => (
        <mesh key={`node-${currentSeed}-${i}`} ref={nodeMeshRefs[i]} position={position}>
          <icosahedronGeometry args={[FRAGMENT.nodeRadius, 1]} />
          <meshBasicMaterial
            ref={nodeMatRefs[i]}
            color={i === 3 ? FRAGMENT_COLORS.apex : FRAGMENT_COLORS.node}
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  );
}
