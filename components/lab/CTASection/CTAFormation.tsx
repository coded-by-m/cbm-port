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

/** Símbolo CbM final: triângulo subdividido (triforce). Retorna as arestas. */
function symbolEdges(): [Vector3, Vector3][] {
  const A = new Vector3(0, 2.6, 0); // topo (apex)
  const B = new Vector3(-2.3, -1.9, 0);
  const C = new Vector3(2.3, -1.9, 0);
  const mAB = new Vector3().addVectors(A, B).multiplyScalar(0.5);
  const mBC = new Vector3().addVectors(B, C).multiplyScalar(0.5);
  const mCA = new Vector3().addVectors(C, A).multiplyScalar(0.5);
  return [
    [A, B],
    [B, C],
    [C, A],
    [mAB, mBC],
    [mBC, mCA],
    [mCA, mAB],
  ];
}

interface Particle {
  start: Vector3;
  final: Vector3;
  delay: number;
  axis: Vector3;
  red: boolean;
}

/**
 * CTAFormation — clímax da Home. Dezenas de fragmentos triangulados surgem
 * dispersos, convergem com o scroll e formam o símbolo CbM (triângulo
 * subdividido, apex vermelho). Scroll-driven em fases:
 *  - 0–30%  dispersão (drift sutil)
 *  - 30–85% convergência (lerp pros destinos, stagger por fragmento)
 *  - 85–100% formado (respira) + apex vermelho
 */
export default function CTAFormation({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.2, 9.5], fov: 42 }}
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
  const COUNT = 60;
  const PER_EDGE = 10;

  // Geometria compartilhada — mini-tetraedro wireframe.
  const tetraEdges = useMemo(
    () => new EdgesGeometry(new TetrahedronGeometry(0.16)),
    [],
  );

  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(20260605);
    const edges = symbolEdges();
    const list: Particle[] = [];
    edges.forEach((edge) => {
      for (let k = 0; k < PER_EDGE; k++) {
        const t = (k + 0.5) / PER_EDGE;
        const final = new Vector3().lerpVectors(edge[0], edge[1], t);
        // Início: random numa esfera.
        const theta = rand() * Math.PI * 2;
        const phi = Math.acos(rand() * 2 - 1);
        const r = 6 + rand() * 4;
        const start = new Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi) * 0.6,
        );
        const axis = new Vector3(
          rand() * 2 - 1,
          rand() * 2 - 1,
          rand() * 2 - 1,
        ).normalize();
        // Vermelho: topo (apex) + ~30% espalhado.
        const red = final.y > 1.2 || rand() < 0.22;
        list.push({ start, final, delay: rand() * 0.8, axis, red });
      }
    });
    return list;
  }, []);

  const groupRefs = useRef<(Group | null)[]>([]);
  const matRefs = useRef<(LineBasicMaterial | null)[]>([]);
  const apexRef = useRef<Mesh>(null);
  const apexMatRef = useRef<{ opacity: number } | null>(null);
  const elapsed = useRef(0);
  const _v = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = clamp01(progressRef.current);

    // Fade-in geral nos primeiros 12%.
    const fadeIn = clamp01(p / 0.12);

    particles.forEach((pt, i) => {
      const g = groupRefs.current[i];
      if (!g) return;

      // Convergência com stagger por fragmento.
      const convRaw = (p - 0.3) / 0.55;
      const conv = clamp01(convRaw - pt.delay * 0.18);
      const e = easeInOut(conv);

      // Drift na dispersão (decai conforme converge).
      const driftAmp = (1 - e) * 0.5;
      const dx = Math.sin(t * 0.6 + i) * driftAmp;
      const dy = Math.cos(t * 0.5 + i * 1.3) * driftAmp;

      _v.lerpVectors(pt.start, pt.final, e);
      // Bob sutil quando formado.
      const bob = e > 0.98 ? Math.sin(t * 0.8 + i) * 0.04 : 0;
      g.position.set(_v.x + dx, _v.y + dy + bob, _v.z);

      // Rotação no eixo próprio (mais lenta ao assentar).
      const rot = (0.5 + (1 - e) * 0.8) * delta;
      g.rotateOnAxis(pt.axis, rot);

      const mat = matRefs.current[i];
      if (mat) mat.opacity = lerp(0.35, 0.9, e) * fadeIn;
    });

    // Apex vermelho do símbolo aparece na formação.
    if (apexMatRef.current) {
      const reveal = clamp01((p - 0.78) / 0.18);
      const pulse = 0.85 + Math.sin(t * 2.2) * 0.15;
      apexMatRef.current.opacity = reveal * pulse;
    }
    if (apexRef.current) {
      apexRef.current.position.y = 2.6 + Math.sin(t * 0.8) * 0.04;
    }
  });

  return (
    <>
      {particles.map((pt, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={pt.start}
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

      {/* Apex vermelho do símbolo formado */}
      <mesh ref={apexRef} position={[0, 2.6, 0]}>
        <icosahedronGeometry args={[0.08, 1]} />
        <meshBasicMaterial
          ref={(el) => {
            apexMatRef.current = el as { opacity: number } | null;
          }}
          color={SIGNAL}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
