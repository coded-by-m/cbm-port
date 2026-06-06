"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import {
  COLORS,
  LINE_WIDTH,
  LOGO_POINTS,
  LOGO_STROKES,
  POINT_RADIUS,
} from "@/components/zones/TriangleLoader/config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Cursor global (-1..1) — parallax mesmo com o mouse fora do canvas. */
function useGlobalPointer() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}

/**
 * A marca CbM como objeto 3D: strokes (off-white) + diagonal signal-red +
 * nós que pulsam. Faz tilt/parallax suave seguindo o cursor (global) e respira
 * no idle. Reusa a geometria da logo do TriangleLoader.
 */
function Mark() {
  const groupRef = useRef<Group>(null);
  const pointer = useGlobalPointer();
  const nodeRefs = useRef<(Mesh | null)[]>([]);
  const matRefs = useRef<(MeshBasicMaterial | null)[]>([]);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const g = groupRef.current;
    if (g) {
      const targetY = pointer.current.x * 0.55 + Math.sin(t * 0.3) * 0.07;
      const targetX = -pointer.current.y * 0.4 + Math.sin(t * 0.45) * 0.05;
      const k = Math.min(1, delta * 3);
      g.rotation.y = lerp(g.rotation.y, targetY, k);
      g.rotation.x = lerp(g.rotation.x, targetX, k);
      g.position.y = Math.sin(t * 0.5) * 0.04;
    }
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 1 + Math.sin(t * 1.6 + i * 1.3) * 0.18;
      mesh.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={groupRef}>
      {LOGO_STROKES.map((s, i) => (
        <Line
          key={`stroke-${i}`}
          points={s.points}
          color={s.color}
          lineWidth={LINE_WIDTH}
          transparent
          opacity={s.targetOpacity}
        />
      ))}
      {LOGO_POINTS.map((p, i) => (
        <mesh
          key={`node-${i}`}
          position={p}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
        >
          <icosahedronGeometry args={[POINT_RADIUS * 1.7, 1]} />
          <meshBasicMaterial
            ref={(el) => {
              matRefs.current[i] = el;
            }}
            color={i === 0 ? COLORS.signal : COLORS.point}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Canvas do símbolo CbM 3D interativo do Sobre. Congela (`frameloop="never"`)
 * fora do capítulo ativo pra não gastar GPU.
 */
export default function AboutMark({
  active = true,
}: {
  active?: boolean;
} = {}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <Mark />
    </Canvas>
  );
}
