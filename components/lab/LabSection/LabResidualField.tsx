"use client";

import { createRef, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { type Group, type Mesh, type MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { buildFragment } from "@/components/lab/ProjectFragments/geometry";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { LAYERS, FOG } from "@/components/lab/TerrainMesh/config";

const TWO_PI = Math.PI * 2;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const OFF_WHITE = "#9a9a9a";
const NODE = "#cccccc";
const SIGNAL = "#FB3640";

/**
 * Campo residual de fragmentos pequenos espalhados — decorativo, baixa
 * intensidade. Posições/seeds determinísticos pra estabilidade.
 */
const FRAGMENTS = [
  { x: -5.4, z: -1.2, seed: 17, scale: 0.62, delay: 0.0 },
  { x: -3.0, z: 1.6, seed: 53, scale: 0.55, delay: 0.18 },
  { x: -1.2, z: -2.4, seed: 91, scale: 0.6, delay: 0.36 },
  { x: 0.6, z: 0.8, seed: 139, scale: 0.68, delay: 0.54, accent: true },
  { x: 2.4, z: -1.6, seed: 173, scale: 0.56, delay: 0.72 },
  { x: 3.8, z: 1.8, seed: 211, scale: 0.6, delay: 0.9 },
  { x: 5.6, z: -0.6, seed: 257, scale: 0.54, delay: 1.08 },
  { x: -4.2, z: 2.6, seed: 307, scale: 0.5, delay: 1.26 },
  { x: 1.8, z: 2.8, seed: 359, scale: 0.52, delay: 1.44 },
];

/**
 * Background 3D da Seção Laboratório — campo residual de fragmentos
 * triangulados (reuso da geometria da Paisagem) sobre um terreno discreto.
 *
 * Puramente ambiente: sem hover, sem click. Câmera estática teleobjetiva,
 * yaw muito lento por fragmento, fade-in escalonado na entrada.
 */
export default function LabResidualField() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [4, 3, 14], fov: 35 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={[FOG.color, 16, 44]} />

      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}

      {FRAGMENTS.map((f, i) => (
        <ResidualFragment key={i} {...f} />
      ))}
    </Canvas>
  );
}

function ResidualFragment({
  x,
  z,
  seed,
  scale,
  delay,
  accent = false,
}: {
  x: number;
  z: number;
  seed: number;
  scale: number;
  delay: number;
  accent?: boolean;
}) {
  const frag = useMemo(() => buildFragment(seed), [seed]);
  const groupRef = useRef<Group>(null);
  const edgeRefs = useMemo(
    () => frag.edges.map(() => createRef<Line2>()),
    [frag],
  );
  const nodeMatRefs = useMemo(
    () => frag.nodes.map(() => createRef<MeshBasicMaterial>()),
    [frag],
  );
  const apexRef = useRef<Mesh>(null);
  const elapsed = useRef(0);

  useFrame((_, dt) => {
    elapsed.current += dt;
    const t = elapsed.current;
    // Fade-in escalonado (entrada da seção).
    const reveal = clamp01((t - delay) / 1.0);

    edgeRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = 0.25 * reveal;
    });
    frag.nodes.forEach((_n, i) => {
      const mat = nodeMatRefs[i].current;
      if (!mat) return;
      const isApex = i === 3;
      mat.opacity = (isApex ? 0.7 : 0.42) * reveal;
    });
    if (apexRef.current) {
      const pulse = 1 + Math.sin(t * 1.4 + seed) * 0.12;
      apexRef.current.scale.setScalar(pulse);
    }

    // Yaw muito lento + bob sutil.
    if (groupRef.current) {
      groupRef.current.rotation.y = t * (TWO_PI / 60);
      groupRef.current.position.y = Math.sin(t * 0.5 + seed) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]} scale={scale}>
      {frag.edges.map((points, i) => (
        <Line
          key={`edge-${i}`}
          ref={edgeRefs[i]}
          points={points}
          color={OFF_WHITE}
          lineWidth={1.3}
          transparent
          opacity={0}
          depthWrite={false}
        />
      ))}

      {frag.nodes.map((position, i) => {
        const isApex = i === 3;
        return (
          <mesh
            key={`node-${i}`}
            position={position}
            ref={isApex ? apexRef : undefined}
          >
            <icosahedronGeometry args={[isApex ? 0.04 : 0.025, 1]} />
            <meshBasicMaterial
              ref={nodeMatRefs[i]}
              color={isApex && accent ? SIGNAL : isApex ? "#d9b8b8" : NODE}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
