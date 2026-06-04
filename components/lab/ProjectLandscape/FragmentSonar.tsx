"use client";

import { createRef, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group } from "three";
import type { Line2 } from "three-stdlib";
import { SONAR } from "./config";
import type { TowerGeometry } from "./towerGeometry";

/**
 * Pulso sonar — wireframe expande ao tornar-se ativo.
 *
 * Quando `isActive` transiciona false→true, dispara animação: scale 1→2 +
 * opacity 0.7→0 ao longo de SONAR.duration. Feedback claro de ativação.
 */
export default function FragmentSonar({
  geom,
  isActive,
}: {
  geom: TowerGeometry;
  isActive: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const lineRefs = useMemo(
    () => geom.edges.map(() => createRef<Line2>()),
    [geom],
  );
  // -1 = idle (não mostrar); >= 0 = tempo decorrido desde último trigger.
  const pulseElapsed = useRef(-1);
  const wasActive = useRef(false);

  // Dispara a animação quando isActive sobe pra true.
  useEffect(() => {
    if (isActive && !wasActive.current) {
      pulseElapsed.current = 0;
    }
    wasActive.current = isActive;
  }, [isActive]);

  useFrame((_, delta) => {
    if (pulseElapsed.current < 0) {
      // Idle: invisível.
      if (groupRef.current) groupRef.current.scale.setScalar(0);
      return;
    }

    pulseElapsed.current += delta;
    const t = pulseElapsed.current / SONAR.duration;

    if (t >= 1) {
      pulseElapsed.current = -1;
      if (groupRef.current) groupRef.current.scale.setScalar(0);
      return;
    }

    const eased = 1 - (1 - t) * (1 - t); // ease-out quad
    const scale = lerp(1, SONAR.finalScale, eased);
    const opacity = SONAR.startOpacity * (1 - t);

    if (groupRef.current) groupRef.current.scale.setScalar(scale);
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = opacity;
    });
  });

  return (
    <group ref={groupRef} scale={0}>
      {geom.edges.map((points, i) => (
        <Line
          key={`sonar-${i}`}
          ref={lineRefs[i]}
          points={points}
          color={SONAR.color}
          lineWidth={SONAR.lineWidth}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      ))}
    </group>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
