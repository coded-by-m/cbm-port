"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  Euler,
  InstancedMesh,
  Object3D,
  TetrahedronGeometry,
  Vector3,
} from "three";

/** Quantidade de fragmentos no pool (o mesmo conjunto se remodela em todos os capítulos). */
const N = 72;
const SIGNAL = "#FB3640";
const OFF_WHITE = "#F5F2ED";

/** Pseudo-random estável por índice (sem Math.random → layout determinístico). */
const hash = (i: number, seed = 1) => {
  const x = Math.sin((i + 1) * 127.1 * seed) * 43758.5453;
  return x - Math.floor(x);
};
const rng = (i: number, seed: number) => hash(i, seed) * 2 - 1; // -1..1

interface Target {
  px: number;
  py: number;
  pz: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
}

/** Um "layout" preenche o alvo (pos/rot/scale) do fragmento `i` num capítulo. */
type Layout = (i: number, t: Target) => void;

// ── Layouts por capítulo (a narrativa do "barro") ──

const cluster: Layout = (i, t) => {
  // 0 Logo — aglomerado apertado no centro (a marca).
  t.px = rng(i, 1) * 1.6;
  t.py = 1.2 + rng(i, 2) * 1.4;
  t.pz = rng(i, 3) * 1.2;
  t.rx = rng(i, 4) * 3;
  t.ry = rng(i, 5) * 3;
  t.rz = 0;
  t.s = 0.5 + hash(i, 6) * 0.3;
};

const cloud: Layout = (i, t) => {
  // 1 Manifesto — nuvem dispersa flutuando.
  t.px = rng(i, 7) * 9;
  t.py = 0.5 + hash(i, 8) * 4;
  t.pz = rng(i, 9) * 5;
  t.rx = rng(i, 10) * 3;
  t.ry = rng(i, 11) * 3;
  t.rz = rng(i, 12) * 3;
  t.s = 0.35 + hash(i, 13) * 0.4;
};

const grid: Layout = (i, t) => {
  // 2 Problema — grade regular (os cubos idênticos).
  const cols = 9;
  t.px = ((i % cols) - (cols - 1) / 2) * 1.5;
  t.py = 0.8;
  t.pz = (Math.floor(i / cols) - N / cols / 2) * 1.4 - 1;
  t.rx = 0;
  t.ry = 0;
  t.rz = 0;
  t.s = 0.55;
};

const triCluster: Layout = (i, t) => {
  // 3 Serviços — 3 aglomerados (os 3 cards).
  t.px = ((i % 3) - 1) * 5 + rng(i, 14) * 1.2;
  t.py = 1.4 + rng(i, 15) * 1.4;
  t.pz = rng(i, 16) * 1.2;
  t.rx = rng(i, 17) * 2;
  t.ry = rng(i, 18) * 2;
  t.rz = 0;
  t.s = 0.45 + hash(i, 19) * 0.25;
};

const ring: Layout = (i, t) => {
  // 4 Projetos — anel orbital.
  const a = (i / N) * Math.PI * 2;
  const r = 6 + rng(i, 20) * 0.5;
  t.px = Math.cos(a) * r;
  t.py = 1 + Math.sin(a * 3) * 0.6;
  t.pz = Math.sin(a) * r * 0.6 - 1;
  t.rx = 0;
  t.ry = a;
  t.rz = 0;
  t.s = 0.5 + hash(i, 21) * 0.3;
};

const line: Layout = (i, t) => {
  // 5 Processo — linha das estações.
  t.px = (i / (N - 1)) * 16 - 8;
  t.py = 1 + Math.sin(i * 0.5) * 0.3;
  t.pz = -1 + rng(i, 22) * 0.6;
  t.rx = 0;
  t.ry = 0;
  t.rz = 0.2;
  t.s = 0.4 + (i % 18 === 0 ? 0.6 : 0); // nós maiores nas estações
};

const residual: Layout = (i, t) => {
  // 6 Laboratório — campo residual esparso.
  t.px = rng(i, 23) * 11;
  t.py = 0.3 + hash(i, 24) * 2;
  t.pz = rng(i, 25) * 6;
  t.rx = rng(i, 26) * 3;
  t.ry = rng(i, 27) * 3;
  t.rz = 0;
  t.s = 0.3 + hash(i, 28) * 0.3;
};

const settled: Layout = (i, t) => {
  // 7 Sobre — calmo, baixo, centrado.
  t.px = rng(i, 29) * 4;
  t.py = 0.4 + hash(i, 30) * 0.8;
  t.pz = rng(i, 31) * 2.5;
  t.rx = 0;
  t.ry = rng(i, 32) * 1;
  t.rz = 0;
  t.s = 0.35 + hash(i, 33) * 0.2;
};

const symbol: Layout = (i, t) => {
  // 8 Convite — formação apertada (fecha a simetria com o Logo).
  const a = (i / N) * Math.PI * 2;
  const r = 1.6 * hash(i, 34);
  t.px = Math.cos(a) * r;
  t.py = 1.4 + Math.sin(a) * r;
  t.pz = rng(i, 35) * 0.6;
  t.rx = rng(i, 36) * 3;
  t.ry = rng(i, 37) * 3;
  t.rz = 0;
  t.s = 0.45 + hash(i, 38) * 0.3;
};

const LAYOUTS: Layout[] = [
  cluster, // 0 Logo
  cloud, // 1 Manifesto
  grid, // 2 Problema
  triCluster, // 3 Serviços
  ring, // 4 Projetos
  line, // 5 Processo
  residual, // 6 Laboratório
  settled, // 7 Sobre
  symbol, // 8 Convite
];

/**
 * FragmentPool — o pool único de fragmentos triangulados que re-targeta por
 * capítulo. Mecanismo central dos morphs do HomeCanvas: o MESMO conjunto de
 * instâncias voa entre os layouts conforme o scroll, então a "transição"
 * entre cenas é geometria se remodelando, não troca de cena.
 */
export function FragmentPool({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => new TetrahedronGeometry(0.5), []);
  const elapsed = useRef(0);

  // Cor por instância: maioria off-white, ~22% signal-red (linguagem dos
  // fragmentos do lab — só vermelho é pesado demais). Setado uma vez.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const c = new Color();
    for (let i = 0; i < N; i++) {
      c.set(hash(i, 99) > 0.78 ? SIGNAL : OFF_WHITE);
      mesh.setColorAt(i, c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  // Estado atual amortecido de cada instância.
  const cur = useMemo(
    () =>
      Array.from({ length: N }, () => ({
        pos: new Vector3(),
        rot: new Euler(),
        s: 0.5,
      })),
    [],
  );
  const dummy = useMemo(() => new Object3D(), []);
  const ta = useMemo<Target>(
    () => ({ px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0, s: 0.5 }),
    [],
  );
  const tb = useMemo<Target>(
    () => ({ px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0, s: 0.5 }),
    [],
  );
  const started = useRef(false);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    elapsed.current += delta;

    const last = LAYOUTS.length - 1;
    const p = Math.max(0, Math.min(1, progressRef.current ?? 0)) * last;
    const i0 = Math.min(Math.floor(p), last);
    const i1 = Math.min(i0 + 1, last);
    const f = p - i0;
    const k = started.current ? 1 - Math.pow(0.002, delta) : 1; // 1º frame pousa no alvo

    for (let i = 0; i < N; i++) {
      LAYOUTS[i0](i, ta);
      LAYOUTS[i1](i, tb);
      const tx = ta.px + (tb.px - ta.px) * f;
      const ty = ta.py + (tb.py - ta.py) * f;
      const tz = ta.pz + (tb.pz - ta.pz) * f;
      const trx = ta.rx + (tb.rx - ta.rx) * f;
      const trY = ta.ry + (tb.ry - ta.ry) * f;
      const trz = ta.rz + (tb.rz - ta.rz) * f;
      const ts = ta.s + (tb.s - ta.s) * f;

      const c = cur[i];
      c.pos.x += (tx - c.pos.x) * k;
      c.pos.y += (ty - c.pos.y) * k;
      c.pos.z += (tz - c.pos.z) * k;
      c.rot.set(
        c.rot.x + (trx - c.rot.x) * k,
        c.rot.y + (trY - c.rot.y) * k,
        c.rot.z + (trz - c.rot.z) * k,
      );
      c.s += (ts - c.s) * k;

      dummy.position.copy(c.pos);
      // Rotação do layout + spin idle lento (fragmentos vivos sem deriva).
      dummy.rotation.set(
        c.rot.x + elapsed.current * 0.05,
        c.rot.y + elapsed.current * (0.08 + hash(i, 77) * 0.12),
        c.rot.z,
      );
      dummy.scale.setScalar(c.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    started.current = true;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, N]}
      frustumCulled={false}
    >
      <meshBasicMaterial wireframe transparent opacity={0.55} />
    </instancedMesh>
  );
}
