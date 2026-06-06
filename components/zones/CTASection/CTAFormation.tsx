"use client";

import { type MutableRefObject, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EdgesGeometry,
  type Group,
  type LineBasicMaterial,
  type Mesh,
  TetrahedronGeometry,
  Vector3,
} from "three";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const OFF_WHITE = "#F5F2ED";
const SIGNAL = "#FB3640";
/** Ponto de convergência da energia — área do CTA (baixo-centro). */
const FOCAL = new Vector3(0, -2.7, 0);

/** PRNG determinístico (mulberry32) — posições estáveis entre montagens. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  home: Vector3;
  final: Vector3;
  axis: Vector3;
  red: boolean;
  drift: number;
  phase: number;
}

/**
 * CTAFormation (refatorado) — finale sem cobrir o texto.
 *
 * Campo triangulado AMBIENTE na periferia (zona central-superior fica vazia
 * pra headline respirar) + uma leva de fragmentos VERMELHOS que CONVERGEM pro
 * ponto do CTA conforme o scroll (energia fluindo pro botão), com um núcleo
 * vermelho que acende ao formar. Parallax sutil no cursor.
 */
export default function CTAFormation({
  progressRef,
  active = true,
}: {
  progressRef: MutableRefObject<number>;
  /** `false` → congela o render loop (não gasta GPU fora do capítulo ativo). */
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
  const COUNT = 56;
  const RED = 16; // fragmentos que convergem pro CTA

  const tetraEdges = useMemo(
    () => new EdgesGeometry(new TetrahedronGeometry(0.15)),
    [],
  );

  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(20260606);
    const list: Particle[] = [];
    for (let i = 0; i < COUNT; i++) {
      // Home dispersa, EVITANDO a zona central-superior (onde fica o texto):
      // se cair lá, empurra pros lados.
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
        home,
        final,
        axis,
        red,
        drift: 0.18 + rand() * 0.3,
        phase: rand() * Math.PI * 2,
      });
    }
    return list;
  }, []);

  const groupRefs = useRef<(Group | null)[]>([]);
  const matRefs = useRef<(LineBasicMaterial | null)[]>([]);
  const fieldRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const coreMatRef = useRef<{ opacity: number } | null>(null);
  const elapsed = useRef(0);
  const _v = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = clamp01(progressRef.current);
    const fadeIn = clamp01(p / 0.1);

    // Parallax do campo inteiro com o cursor (sutil).
    if (fieldRef.current) {
      const k = Math.min(1, delta * 2);
      fieldRef.current.position.x +=
        (state.pointer.x * 0.4 - fieldRef.current.position.x) * k;
      fieldRef.current.position.y +=
        (state.pointer.y * 0.3 - fieldRef.current.position.y) * k;
    }

    particles.forEach((pt, i) => {
      const g = groupRefs.current[i];
      if (!g) return;
      let conv = 0;
      if (pt.red) {
        conv = easeInOut(clamp01((p - 0.35) / 0.5));
      }
      _v.lerpVectors(pt.home, pt.final, conv);
      const amp = (1 - conv) * pt.drift;
      g.position.set(
        _v.x + Math.sin(t * 0.5 + pt.phase) * amp,
        _v.y + Math.cos(t * 0.45 + pt.phase) * amp,
        _v.z,
      );
      g.rotateOnAxis(pt.axis, (0.4 + (1 - conv) * 0.5) * delta);
      const mat = matRefs.current[i];
      if (mat) {
        const base = pt.red ? lerp(0.25, 0.95, conv) : 0.26;
        mat.opacity = base * fadeIn;
      }
    });

    // Núcleo vermelho no foco do CTA — acende ao convergir.
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
      {particles.map((pt, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={pt.home}
        >
          <lineSegments geometry={tetraEdges}>
            <lineBasicMaterial
              ref={(el) => {
                matRefs.current[i] = el;
              }}
              color={pt.red ? SIGNAL : OFF_WHITE}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </lineSegments>
        </group>
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
