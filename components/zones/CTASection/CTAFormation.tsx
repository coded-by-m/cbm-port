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
  drift: number;
  phase: number;
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
  const COUNT = 22;
  const RED = 7;

  const specs = useMemo<FragSpec[]>(() => {
    const rand = mulberry32(20260606);
    const list: FragSpec[] = [];
    for (let i = 0; i < COUNT; i++) {
      // Home dispersa, evitando a zona central-superior (texto).
      let x = (rand() * 2 - 1) * 7;
      const y = (rand() * 2 - 1) * 4;
      const z = (rand() * 2 - 1) * 2;
      if (Math.abs(x) < 2.7 && y > -1.4) {
        x = Math.sign(x || 1) * (2.7 + rand() * 4);
      }
      const home = new Vector3(x, y, z);
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
      list.push({
        seed: 17 + i * 53,
        home,
        final,
        axis,
        red,
        drift: 0.16 + rand() * 0.28,
        phase: rand() * Math.PI * 2,
        scale: red ? 0.46 : 0.36 + rand() * 0.12,
      });
    }
    return list;
  }, []);

  const fieldRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const coreMatRef = useRef<{ opacity: number } | null>(null);
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = clamp01(progressRef.current);

    if (fieldRef.current) {
      const k = Math.min(1, delta * 2);
      fieldRef.current.position.x +=
        (state.pointer.x * 0.4 - fieldRef.current.position.x) * k;
      fieldRef.current.position.y +=
        (state.pointer.y * 0.3 - fieldRef.current.position.y) * k;
    }

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
  const elapsed = useRef(spec.phase);
  const _v = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = clamp01(progressRef.current);
    const fadeIn = clamp01(p / 0.1);
    const conv = spec.red ? easeInOut(clamp01((p - 0.35) / 0.5)) : 0;

    _v.lerpVectors(spec.home, spec.final, conv);
    const amp = (1 - conv) * spec.drift;
    const g = groupRef.current;
    if (g) {
      g.position.set(
        _v.x + Math.sin(t * 0.5 + spec.phase) * amp,
        _v.y + Math.cos(t * 0.45 + spec.phase) * amp,
        _v.z,
      );
      g.rotateOnAxis(spec.axis, (0.3 + (1 - conv) * 0.4) * delta);
    }

    const edgeOp = (spec.red ? lerp(0.2, 0.85, conv) : 0.22) * fadeIn;
    edgeRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOp;
    });
    const nodeOp = (spec.red ? lerp(0.3, 0.95, conv) : 0.32) * fadeIn;
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
