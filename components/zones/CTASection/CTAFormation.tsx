"use client";

import { createRef, type MutableRefObject, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  Vector3,
} from "three";
import type { Line2 } from "three-stdlib";
import { buildFragment } from "@/components/zones/ProjectFragments/geometry";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const OFF_WHITE = "#F5F2ED";
const SIGNAL = "#FB3640";
/** Ponto de convergência da energia — área do CTA (baixo-centro). */
const FOCAL = new Vector3(0, -2.7, 0);
/** Repulsão local PONTUAL do cursor (raio pequeno): só os bem próximos fogem. */
const REPEL_RADIUS = 1.4;
const REPEL_STRENGTH = 1.5;
/** Limites do voo (wrap quando o fragmento sai) — perto do que a câmera vê. */
const BOUND_X = 5.5;
const BOUND_Y = 3.4;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface FragSpec {
  seed: number;
  home: Vector3;
  final: Vector3;
  axis: Vector3;
  red: boolean;
  vx: number;
  vy: number;
  scale: number;
}

/**
 * CTAFormation (refatorado) — finale: usa os FRAGMENTOS reais dos Projetos
 * (mesma geometria triangulada) como "vários projetos construídos" flutuando
 * na periferia (centro limpo pra headline), e uma leva de fragmentos vermelhos
 * que CONVERGEM pro CTA com o scroll = "o seu projeto se formando". Núcleo
 * vermelho acende no foco; parallax sutil no cursor. Congela fora do ativo.
 */
export default function CTAFormation({
  progressRef,
  active = true,
}: {
  progressRef: MutableRefObject<number>;
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9.5], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <Formation progressRef={progressRef} />
    </Canvas>
  );
}

function Formation({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const COUNT = 28;
  const RED = 9;

  const specs = useMemo<FragSpec[]>(() => {
    const rand = mulberry32(20260606);
    const list: FragSpec[] = [];
    for (let i = 0; i < COUNT; i++) {
      const home = new Vector3(
        (rand() * 2 - 1) * BOUND_X,
        (rand() * 2 - 1) * BOUND_Y,
        (rand() * 2 - 1) * 2,
      );
      const red = i < RED;
      const final = red
        ? new Vector3(
            FOCAL.x + (rand() * 2 - 1) * 1.2,
            FOCAL.y + (rand() * 2 - 1) * 0.7,
            FOCAL.z + (rand() * 2 - 1) * 0.5,
          )
        : home.clone();
      const axis = new Vector3(
        rand() * 2 - 1,
        rand() * 2 - 1,
        rand() * 2 - 1,
      ).normalize();
      // Velocidade de voo (varia direção/sentido; mais horizontal).
      const speed = 0.3 + rand() * 0.45;
      const ang = rand() * Math.PI * 2;
      list.push({
        seed: 17 + i * 53,
        home,
        final,
        axis,
        red,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed * 0.7,
        scale: red ? 0.46 : 0.34 + rand() * 0.12,
      });
    }
    return list;
  }, []);

  const fieldRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const coreMatRef = useRef<{ opacity: number } | null>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = clamp01(progressRef.current);

    if (coreMatRef.current) {
      const reveal = clamp01((p - 0.75) / 0.2);
      coreMatRef.current.opacity = reveal * (0.8 + Math.sin(t * 2.2) * 0.2);
    }
    if (coreRef.current) {
      coreRef.current.position.y = FOCAL.y + Math.sin(t * 0.9) * 0.05;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.18);
    }
  });

  return (
    <group ref={fieldRef}>
      {specs.map((s, i) => (
        <FieldFragment key={i} spec={s} progressRef={progressRef} />
      ))}

      {/* Núcleo vermelho de energia no ponto do CTA. */}
      <mesh ref={coreRef} position={[FOCAL.x, FOCAL.y, FOCAL.z]}>
        <icosahedronGeometry args={[0.12, 1]} />
        <meshBasicMaterial
          ref={(el) => {
            coreMatRef.current = el as { opacity: number } | null;
          }}
          color={SIGNAL}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Um fragmento (geometria real dos Projetos) — ambiente ou convergindo. */
function FieldFragment({
  spec,
  progressRef,
}: {
  spec: FragSpec;
  progressRef: MutableRefObject<number>;
}) {
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
    const p = clamp01(progressRef.current);
    // Campo já visível ao chegar (piso) — sobe rápido nos primeiros %.
    const fadeIn = clamp01(0.55 + p / 0.06);
    const conv = spec.red ? easeInOut(clamp01((p - 0.35) / 0.5)) : 0;

    // Voo contínuo: velocidade + wrap nas bordas (reaparece do lado oposto).
    const pos = posRef.current;
    pos.x += spec.vx * delta;
    pos.y += spec.vy * delta;
    if (pos.x > BOUND_X) pos.x = -BOUND_X;
    else if (pos.x < -BOUND_X) pos.x = BOUND_X;
    if (pos.y > BOUND_Y) pos.y = -BOUND_Y;
    else if (pos.y < -BOUND_Y) pos.y = BOUND_Y;

    // Vermelhos: puxados pro foco do CTA conforme converge.
    const bx = spec.red ? lerp(pos.x, spec.final.x, conv) : pos.x;
    const by = spec.red ? lerp(pos.y, spec.final.y, conv) : pos.y;
    const bz = spec.red ? lerp(pos.z, spec.final.z, conv) : pos.z;

    // Repulsão local PONTUAL do cursor (raio pequeno): cursor no plano de
    // profundidade → empurra pra longe com falloff; volta suave ao sair.
    const camZ = state.camera.position.z || 9.5;
    const depthScale = (camZ - bz) / camZ;
    const cwx = state.pointer.x * (state.viewport.width / 2) * depthScale;
    const cwy = state.pointer.y * (state.viewport.height / 2) * depthScale;
    const ddx = bx - cwx;
    const ddy = by - cwy;
    const dd = Math.hypot(ddx, ddy);
    let rx = 0;
    let ry = 0;
    if (dd < REPEL_RADIUS && dd > 1e-4) {
      const force = (1 - dd / REPEL_RADIUS) * REPEL_STRENGTH;
      rx = (ddx / dd) * force;
      ry = (ddy / dd) * force;
    }
    const rep = repelRef.current;
    const ease = Math.min(1, delta * 6);
    rep.x += (rx - rep.x) * ease;
    rep.y += (ry - rep.y) * ease;

    const g = groupRef.current;
    if (g) {
      g.position.set(bx + rep.x, by + rep.y, bz);
      g.rotateOnAxis(spec.axis, (0.3 + (1 - conv) * 0.3) * delta);
    }

    const edgeOp = (spec.red ? lerp(0.32, 0.9, conv) : 0.34) * fadeIn;
    edgeRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOp;
    });
    const nodeOp = (spec.red ? lerp(0.4, 0.95, conv) : 0.42) * fadeIn;
    frag.nodes.forEach((_n, i) => {
      const mat = nodeMatRefs[i].current;
      if (!mat) return;
      mat.opacity = i === 3 ? nodeOp : nodeOp * 0.7;
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
          lineWidth={1.1}
          transparent
          opacity={0}
          depthWrite={false}
        />
      ))}
      {frag.nodes.map((position, i) => {
        const isApex = i === 3;
        return (
          <mesh key={`n-${i}`} position={position}>
            <icosahedronGeometry args={[isApex ? 0.04 : 0.025, 1]} />
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
