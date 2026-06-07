"use client";

import { createRef, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { ReleaseContext } from "@/components/three/ReleaseContext";
import {
  type Group,
  type MeshBasicMaterial,
  Vector3,
} from "three";
import type { Line2 } from "three-stdlib";
import TerrainLayer from "@/components/zones/TerrainMesh/TerrainLayer";
import { useCursorHover } from "@/components/zones/TerrainMesh/useCursorHover";
import { LAYERS, FOG } from "@/components/zones/TerrainMesh/config";
import { buildFragment } from "@/components/zones/ProjectFragments/geometry";

const OFF_WHITE = "#F5F2ED";
const SIGNAL = "#FB3640";

const FRAG_COUNT = 16;
const BOUND_X = 9;
const BOUND_Y_BOT = 1.6;
const BOUND_Y_TOP = 5.4;
const REPEL_RADIUS = 1.6;
const REPEL_STRENGTH = 1.3;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Terreno triangulado da marca subindo da base do footer. Reusa as LAYERS +
 * o hover de cursor (o relevo se eleva sob o mouse).
 */
function Terrain() {
  const scaleRef = useRef(1);
  const hoverRef = useCursorHover(scaleRef);
  return (
    <>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} hoverRef={hoverRef} />
      ))}
    </>
  );
}

interface FragSpec {
  seed: number;
  home: Vector3;
  vx: number;
  vy: number;
  scale: number;
  axis: Vector3;
  red: boolean;
}

/** Fragmentos trianguladados voando no "céu" acima da paisagem (eco do Convite). */
function Fragments() {
  const specs = useMemo<FragSpec[]>(() => {
    const rand = mulberry32(73219);
    return Array.from({ length: FRAG_COUNT }, (_, i) => {
      const speed = 0.3 + rand() * 0.4;
      const ang = rand() * Math.PI * 2;
      return {
        seed: 31 + i * 47,
        home: new Vector3(
          (rand() * 2 - 1) * BOUND_X,
          BOUND_Y_BOT + rand() * (BOUND_Y_TOP - BOUND_Y_BOT),
          (rand() * 2 - 1) * 2,
        ),
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed * 0.6,
        scale: 0.28 + rand() * 0.16,
        axis: new Vector3(
          rand() * 2 - 1,
          rand() * 2 - 1,
          rand() * 2 - 1,
        ).normalize(),
        red: rand() < 0.25,
      };
    });
  }, []);

  return (
    <>
      {specs.map((s, i) => (
        <FooterFragment key={i} spec={s} />
      ))}
    </>
  );
}

function FooterFragment({ spec }: { spec: FragSpec }) {
  const frag = useMemo(() => buildFragment(spec.seed), [spec.seed]);
  const groupRef = useRef<Group>(null);
  const edgeRefs = useMemo(
    () => frag.edges.map(() => createRef<Line2>()),
    [frag],
  );
  const nodeMatRefs = useMemo(
    () => frag.nodes.map(() => createRef<MeshBasicMaterial>()),
    [frag],
  );
  const posRef = useRef(spec.home.clone());
  const repelRef = useRef(new Vector3());

  useFrame((state, delta) => {
    // Voo contínuo + wrap nas bordas.
    const pos = posRef.current;
    pos.x += spec.vx * delta;
    pos.y += spec.vy * delta;
    if (pos.x > BOUND_X) pos.x = -BOUND_X;
    else if (pos.x < -BOUND_X) pos.x = BOUND_X;
    if (pos.y > BOUND_Y_TOP) pos.y = BOUND_Y_BOT;
    else if (pos.y < BOUND_Y_BOT) pos.y = BOUND_Y_TOP;

    // Repulsão pontual do cursor.
    const camZ = state.camera.position.z || 10.5;
    const depthScale = (camZ - pos.z) / camZ;
    const cwx = state.pointer.x * (state.viewport.width / 2) * depthScale;
    const cwy = state.pointer.y * (state.viewport.height / 2) * depthScale;
    const ddx = pos.x - cwx;
    const ddy = pos.y - cwy;
    const dd = Math.hypot(ddx, ddy);
    let rx = 0;
    let ry = 0;
    if (dd < REPEL_RADIUS && dd > 1e-4) {
      const force = (1 - dd / REPEL_RADIUS) * REPEL_STRENGTH;
      rx = (ddx / dd) * force;
      ry = (ddy / dd) * force;
    }
    const rep = repelRef.current;
    const k = Math.min(1, delta * 6);
    rep.x += (rx - rep.x) * k;
    rep.y += (ry - rep.y) * k;

    const g = groupRef.current;
    if (g) {
      g.position.set(pos.x + rep.x, pos.y + rep.y, pos.z);
      g.rotateOnAxis(spec.axis, 0.3 * delta);
    }

    const op = spec.red ? 0.42 : 0.26;
    edgeRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = op;
    });
    frag.nodes.forEach((_n, i) => {
      const mat = nodeMatRefs[i].current;
      if (!mat) return;
      mat.opacity = i === 3 ? op + 0.1 : op * 0.7;
    });
  });

  return (
    <group ref={groupRef} position={spec.home} scale={spec.scale}>
      {frag.edges.map((points, i) => (
        <Line
          key={`e-${i}`}
          ref={edgeRefs[i]}
          points={points}
          color={spec.red ? SIGNAL : OFF_WHITE}
          lineWidth={1}
          transparent
          opacity={0}
          depthWrite={false}
        />
      ))}
      {frag.nodes.map((position, i) => {
        const isApex = i === 3;
        return (
          <mesh key={`n-${i}`} position={position}>
            <icosahedronGeometry args={[isApex ? 0.035 : 0.022, 1]} />
            <meshBasicMaterial
              ref={nodeMatRefs[i]}
              color={isApex && spec.red ? SIGNAL : OFF_WHITE}
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

export default function FooterLandscape({
  active = true,
}: {
  /** `false` → congela o render loop (não gasta GPU fora de vista). */
  active?: boolean;
} = {}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.4, 10.5], fov: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
      style={{ background: "transparent" }}
    >
      <ReleaseContext />
      <fog attach="fog" args={[FOG.color, 12, 40]} />
      <Terrain />
      <Fragments />
    </Canvas>
  );
}
