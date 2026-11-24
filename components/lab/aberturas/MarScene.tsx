"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ReleaseContext } from "@/components/three/ReleaseContext";

/**
 * Linha do tempo, em segundos. É AQUI que se ajusta o ritmo da abertura.
 *
 *   0 ........ T_SURF     mar
 *   T_SURF ... T_TUMBLE   surf
 *   T_TUMBLE . T_IMPACT   tombo
 *   T_IMPACT . T_CRANE    o mar congela em terreno, de dentro pra fora
 *   T_CRANE .. T_PROJECTS a câmera sobe até olhar de cima: o terreno vira mosaico
 */
export const T_SURF = 0.8;
export const T_TUMBLE = 1.95;
export const T_IMPACT = 2.55;
export const T_CRANE = 3.0;
export const T_PROJECTS = 3.65;

/** Pausa no instante da batida: é o que dá peso ao impacto. */
const HIT_STOP = 0.07;

/** Malha: vértices em fileiras alternadas, triângulos quase equiláteros. */
const NX = 46;
const NZ = 26;
const SX = 0.95;
const SZ = 0.82;
const X0 = -24;
const Z0 = -10;
const TRIS = (NX - 1) * (NZ - 1) * 2;

/** Partículas: espuma do surf, borrifo da crista e estilhaços do impacto. */
const FOAM = 56;
const SPRAY = 30;
const DEBRIS = 34;
const PARTICLES = FOAM + SPRAY + DEBRIS;

/** Raio (centro → ponta) do triângulo da marca. */
const SURFER_R = 1.3;
/** Onde ele crava a ponta, e a velocidade com que o congelamento se espalha. */
const IMPACT_X = 1.6;
const RING_SPEED = 19;

const BG = 0.024;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Ruído determinístico em [0, 1) a partir de dois inteiros. */
const hash = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function ripple(x: number, z: number, t: number) {
  return (
    0.24 * Math.sin(0.85 * x - 2.3 * t + 0.45 * z) +
    0.13 * Math.sin(1.6 * x + 1.4 * t - 0.9 * z + 1.3) +
    0.07 * Math.sin(2.9 * x - 3.1 * t + 1.7 * z + 4.0)
  );
}

function terrain(x: number, z: number) {
  const a = Math.sin(x * 0.62 + 1) * Math.cos(z * 0.7);
  const b = Math.sin(x * 1.31 - z * 1.07 + 2);
  return Math.max(0, a * 0.9 + b * 0.45) * 1.3;
}

function surferX(t: number) {
  if (t < T_SURF) return -14;
  if (t < T_TUMBLE) return -14 + 14 * easeOutCubic((t - T_SURF) / (T_TUMBLE - T_SURF));
  return IMPACT_X * clamp01((t - T_TUMBLE) / (T_IMPACT - T_TUMBLE));
}

/** Altura da onda grande: cheia no surf, desaba no tombo. */
function bigAmp(t: number) {
  if (t < T_TUMBLE) return 2.1;
  const u = clamp01((t - T_TUMBLE) / (T_IMPACT - T_TUMBLE));
  return 2.1 * (1 - u) * (1 - u);
}

/**
 * A onda grande num ponto. Assimétrica: a face da frente é íngreme, as costas
 * são longas — é o que separa "onda" de "lombada".
 */
function swell(x: number, z: number, t: number) {
  const d = x - (surferX(t) - 0.6);
  const s = d > 0 ? 1.5 : 3.2;
  return bigAmp(t) * Math.exp(-(d / s) * (d / s)) * (0.72 + 0.28 * Math.cos(z * 0.35 + 0.4));
}

/** Altura do mar, com o tempo travado no impacto. */
function seaHeight(x: number, z: number, t: number) {
  const tw = Math.min(t, T_IMPACT);
  return ripple(x, z, tw) + swell(x, z, tw);
}

/** Quanto um ponto já congelou. O congelamento parte do impacto e corre pra fora. */
function frozen(t: number, dist: number) {
  const tt = t - dist / RING_SPEED;
  return tt <= T_IMPACT ? 0 : easeOutCubic(clamp01((tt - T_IMPACT) / 0.35));
}

function triangle(r: number) {
  const g = new THREE.BufferGeometry();
  const w = r * 0.866;
  g.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([0, 0, -r, w, 0, r * 0.5, -w, 0, r * 0.5]), 3),
  );
  return g;
}

/** Subdivisões por lado do triângulo da marca: é o que deixa ele vergar. */
const BOARD_N = 7;

/**
 * O triângulo da marca como lâmina flexível: a mesma silhueta, subdividida.
 * Devolve também as posições de repouso, que o frame usa pra vergar.
 */
function buildBoard(r: number) {
  const w = r * 0.866;
  const rest: number[] = [];
  const index: number[] = [];
  const at: number[][] = [];
  for (let i = 0; i <= BOARD_N; i++) {
    at.push([]);
    for (let j = 0; j <= BOARD_N - i; j++) {
      const u = i / BOARD_N;
      const v = j / BOARD_N;
      at[i].push(rest.length / 3);
      // ponta em -z; os outros dois cantos em +z
      rest.push(u * w - v * w, 0, -r + (u + v) * 1.5 * r);
    }
  }
  for (let i = 0; i < BOARD_N; i++) {
    for (let j = 0; j < BOARD_N - i; j++) {
      index.push(at[i][j], at[i + 1][j], at[i][j + 1]);
      if (j < BOARD_N - i - 1) index.push(at[i + 1][j], at[i + 1][j + 1], at[i][j + 1]);
    }
  }
  const g = new THREE.BufferGeometry();
  const pos = new THREE.BufferAttribute(new Float32Array(rest), 3);
  const col = new THREE.BufferAttribute(new Float32Array(rest.length).fill(1), 3);
  pos.setUsage(THREE.DynamicDrawUsage);
  col.setUsage(THREE.DynamicDrawUsage);
  g.setAttribute("position", pos);
  g.setAttribute("color", col);
  g.setIndex(index);
  return { g, pos, col, rest: new Float32Array(rest) };
}

/** Índices de vértice de cada triângulo da malha, e uma semente por triângulo. */
function buildTopology() {
  const idx = new Uint16Array(TRIS * 3);
  const seed = new Float32Array(TRIS);
  let k = 0;
  const v = (i: number, j: number) => j * NX + i;
  for (let j = 0; j < NZ - 1; j++) {
    for (let i = 0; i < NX - 1; i++) {
      const tris =
        j % 2 === 0
          ? [v(i, j), v(i + 1, j), v(i, j + 1), v(i + 1, j), v(i + 1, j + 1), v(i, j + 1)]
          : [v(i, j), v(i + 1, j), v(i + 1, j + 1), v(i, j), v(i + 1, j + 1), v(i, j + 1)];
      for (let n = 0; n < 6; n++) idx[k * 3 + n] = tris[n];
      seed[k] = hash(i, j);
      seed[k + 1] = hash(i + 91, j + 17);
      k += 2;
    }
  }
  return { idx, seed };
}

interface SceneProps {
  /** Cor do brilho na crista (hex). */
  accent: string;
  /** Vira true quando o usuário pula: a cena salta pro fim. */
  skip: MutableRefObject<boolean>;
  /** Bancada: congela a cena neste instante (segundos), pra afinar um quadro. */
  freeze?: number;
  onImpact: () => void;
  onProjects: () => void;
}

function Scene({ accent, skip, freeze, onImpact, onProjects }: SceneProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const particles = useRef<THREE.InstancedMesh>(null);
  const surfer = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const hold = useRef(0);
  const fired = useRef({ impact: false, projects: false });
  const cbs = useRef({ onImpact, onProjects });
  cbs.current = { onImpact, onProjects };

  const res = useMemo(() => {
    const field = new THREE.BufferGeometry();
    const pos = new THREE.BufferAttribute(new Float32Array(TRIS * 9), 3);
    const col = new THREE.BufferAttribute(new Float32Array(TRIS * 9), 3);
    pos.setUsage(THREE.DynamicDrawUsage);
    col.setUsage(THREE.DynamicDrawUsage);
    field.setAttribute("position", pos);
    field.setAttribute("color", col);
    const glint = new THREE.Color(accent);
    return {
      field,
      pos,
      col,
      fieldMat: new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }),
      bit: triangle(0.24),
      bitMat: new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
      board: buildBoard(SURFER_R),
      boardMat: new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }),
      keelMat: new THREE.MeshBasicMaterial({ color: accent, side: THREE.DoubleSide }),
      // O acento em sRGB, pra somar direto nas contas de cor da malha.
      ar: Math.pow(glint.r, 1 / 2.2),
      ag: Math.pow(glint.g, 1 / 2.2),
      ab: Math.pow(glint.b, 1 / 2.2),
    };
  }, [accent]);

  useEffect(
    () => () => {
      res.field.dispose();
      res.fieldMat.dispose();
      res.bit.dispose();
      res.bitMat.dispose();
      res.board.g.dispose();
      res.boardMat.dispose();
      res.keelMat.dispose();
    },
    [res],
  );

  const work = useMemo(
    () => ({
      ...buildTopology(),
      vx: new Float32Array(NX * NZ),
      vy: new Float32Array(NX * NZ),
      vz: new Float32Array(NX * NZ),
      vm: new Float32Array(NX * NZ),
      vd: new Float32Array(NX * NZ),
      o: new THREE.Object3D(),
      c: new THREE.Color(),
      q: new THREE.Quaternion(),
      q2: new THREE.Quaternion(),
      q3: new THREE.Quaternion(),
      look: new THREE.Vector3(),
      nrm: new THREE.Vector3(),
      X: new THREE.Vector3(1, 0, 0),
      Y: new THREE.Vector3(0, 1, 0),
      Z: new THREE.Vector3(0, 0, 1),
    }),
    [],
  );

  useFrame((state, rawDt) => {
    // ── Relógio, com a pausa do impacto ──────────────────────────────
    const dt = Math.min(rawDt, 1 / 20);
    if (hold.current > 0) {
      hold.current -= dt;
    } else {
      const prev = clock.current;
      clock.current += dt;
      if (prev < T_IMPACT && clock.current >= T_IMPACT) {
        clock.current = T_IMPACT;
        hold.current = HIT_STOP;
      }
    }
    if (freeze !== undefined) clock.current = freeze;
    if (skip.current) clock.current = Math.max(clock.current, T_PROJECTS + 0.05);
    const t = clock.current;
    const tw = Math.min(t, T_IMPACT);
    const hit = t - T_IMPACT;
    const crane = easeInOut(clamp01((t - T_CRANE) / (T_PROJECTS - T_CRANE)));
    const portrait = state.size.width < state.size.height;
    const { vx, vy, vz, vm, vd, idx, seed, o, c, q, q2, q3, look, nrm, X, Y, Z } = work;

    // ── Câmera ───────────────────────────────────────────────────────
    const sx = surferX(t);
    const surf = clamp01((t - T_SURF) / (T_TUMBLE - T_SURF));
    // O surfista entra pela esquerda do quadro e a câmera o alcança.
    const lead = (portrait ? 2.6 : 5.5) * (1 - easeOutCubic(surf));
    const camX = sx + lead;
    const shakeAmp = hit > 0 && hit < 0.4 ? (1 - hit / 0.4) * 0.16 : 0;
    const shakeX = Math.sin(hit * 83) * shakeAmp;
    const shakeY = Math.cos(hit * 71) * shakeAmp;
    const punch = hit > 0 ? -0.9 * Math.exp(-hit * 5) : 0;
    const baseY = portrait ? 4.6 : 3.1;
    const baseZ = (portrait ? 12.3 : 11.6) - 0.9 * easeOutCubic(surf) + punch;
    // Grua: sobe até quase a pino sobre o ponto do impacto.
    const cx = camX + shakeX + (IMPACT_X - camX) * crane;
    const cy = baseY + shakeY + ((portrait ? 17 : 13) - baseY) * crane;
    const cz = baseZ + (1.4 - baseZ) * crane;
    camera.fov = portrait ? 62 : 46;
    camera.position.set(cx, cy, cz);
    look.set(
      camX + 0.4 + (IMPACT_X - camX - 0.4) * crane,
      (portrait ? -0.5 : 0.6) * (1 - crane),
      (portrait ? -1.5 : -1) * (1 - crane),
    );
    camera.lookAt(look);
    camera.updateProjectionMatrix();

    // ── Vértices da malha ────────────────────────────────────────────
    const ring = hit * RING_SPEED;
    const ringFade = hit > 0 ? Math.max(0, 1 - hit / 1.1) : 0;
    const flatten = 1 - 0.82 * crane;
    for (let j = 0; j < NZ; j++) {
      for (let i = 0; i < NX; i++) {
        const n = j * NX + i;
        const x = X0 + i * SX + (j % 2 ? SX / 2 : 0);
        const z = Z0 + j * SZ;
        const dist = Math.hypot(x - IMPACT_X, z);
        const m = frozen(t, dist);
        const big = swell(x, z, tw);
        let h = ripple(x, z, tw) + big;
        if (m > 0) h += (terrain(x, z) - h) * m;
        // A onda de choque levanta o chão por onde passa.
        if (ringFade > 0) {
          const r = (dist - ring) / 1.1;
          h += 0.5 * Math.exp(-r * r) * ringFade;
        }
        // A crista se inclina pra frente: é o lábio da onda.
        vx[n] = x + 0.34 * big * (1 - m);
        vy[n] = h * flatten;
        vz[n] = z;
        vm[n] = m;
        vd[n] = dist;
      }
    }

    // ── Triângulos: cada um encolhido e solto no mar, travado no terreno ──
    const P = res.pos.array as Float32Array;
    const C = res.col.array as Float32Array;
    // Luz de cima-esquerda pro volume; contraluz baixa pro brilho na água.
    const lx = -0.5;
    const ly = 0.78;
    const lz = 0.37;
    const bx = -0.55;
    const by = 0.3;
    const bz = -0.78;
    for (let k = 0; k < TRIS; k++) {
      const a = idx[k * 3];
      const b = idx[k * 3 + 1];
      const d = idx[k * 3 + 2];
      const mx = (vx[a] + vx[b] + vx[d]) / 3;
      const my = (vy[a] + vy[b] + vy[d]) / 3;
      const mz = (vz[a] + vz[b] + vz[d]) / 3;
      const m = (vm[a] + vm[b] + vm[d]) / 3;
      const live = (1 - m) * (1 - crane);
      const s = seed[k];
      let shrink = 0.78 + 0.19 * m + 0.05 * Math.sin(t * 2.6 + s * 40) * live;
      shrink += (0.9 - shrink) * crane;
      const yaw = 0.5 * Math.sin(t * 1.7 + s * 6.283) * live;
      const cs = Math.cos(yaw);
      const sn = Math.sin(yaw);
      const tiltX = 0.34 * Math.sin(t * 2.3 + s * 17) * live;
      const tiltZ = 0.34 * Math.cos(t * 1.9 + s * 29) * live;

      const base = k * 9;
      for (let n = 0; n < 3; n++) {
        const vi = n === 0 ? a : n === 1 ? b : d;
        const ox = (vx[vi] - mx) * shrink;
        const oy = (vy[vi] - my) * shrink;
        const oz = (vz[vi] - mz) * shrink;
        const rx = ox * cs - oz * sn;
        const rz = ox * sn + oz * cs;
        P[base + n * 3] = mx + rx;
        P[base + n * 3 + 1] = my + oy + rx * tiltX + rz * tiltZ;
        P[base + n * 3 + 2] = mz + rz;
      }

      // Normal da faceta (sempre apontando pra cima).
      const e1x = P[base + 3] - P[base];
      const e1y = P[base + 4] - P[base + 1];
      const e1z = P[base + 5] - P[base + 2];
      const e2x = P[base + 6] - P[base];
      const e2y = P[base + 7] - P[base + 1];
      const e2z = P[base + 8] - P[base + 2];
      let nx = e1y * e2z - e1z * e2y;
      let ny = e1z * e2x - e1x * e2z;
      let nz = e1x * e2y - e1y * e2x;
      const nl = (Math.hypot(nx, ny, nz) || 1) * (ny < 0 ? -1 : 1);
      nx /= nl;
      ny /= nl;
      nz /= nl;

      const diff = Math.max(0, nx * lx + ny * ly + nz * lz);
      // Especular de Blinn com a contraluz: a faceta acende quando o
      // meio-vetor entre a luz e a câmera cai em cima da normal.
      let hx = cx - mx;
      let hy = cy - my;
      let hz = cz - mz;
      const vl = Math.hypot(hx, hy, hz) || 1;
      hx = hx / vl + bx;
      hy = hy / vl + by;
      hz = hz / vl + bz;
      const hl = Math.hypot(hx, hy, hz) || 1;
      const spec = Math.pow(Math.max(0, (nx * hx + ny * hy + nz * hz) / hl), 26);

      // Só o alto da onda pega cor: tingir a onda inteira vira mancha rosa.
      const crest = clamp01((my - 0.75) / 1.3);
      const tint = Math.pow(crest, 1.6) * 0.85 * live;
      const white = (spec * (0.35 + crest) * 0.9 + Math.pow(crest, 4) * 0.45) * live;
      const grey = 0.04 + 0.15 * diff + 0.1 * clamp01(my / 1.4) * m;
      const peak = 0.22 * clamp01((my - 0.9) / 0.6) * m * (1 - crane);
      let glow = 0;
      if (ringFade > 0) {
        const r = ((vd[a] + vd[b] + vd[d]) / 3 - ring) / 0.9;
        glow = Math.exp(-r * r) * ringFade;
      }
      const hue = tint + peak + glow * 0.9;
      let r = grey + res.ar * hue + white + glow * 0.3;
      let g = grey + 0.004 + res.ag * hue + white + glow * 0.3;
      let bl = grey + 0.012 + res.ab * hue + white + glow * 0.3;

      // Névoa: some no fundo e na beirada de cá. A grua dissipa a névoa.
      const far = clamp01((mz - Z0) / 5.5);
      const near = clamp01((baseZ - 1.2 - mz) / 3);
      const fog = far * near + (1 - far * near) * crane;
      r = BG + (r - BG) * fog;
      g = BG + (g - BG) * fog;
      bl = BG + (bl - BG) * fog;

      // sRGB → linear, que é o que o atributo de cor espera.
      r = Math.pow(Math.min(1, r), 2.2);
      g = Math.pow(Math.min(1, g), 2.2);
      bl = Math.pow(Math.min(1, bl), 2.2);
      for (let n = 0; n < 3; n++) {
        C[base + n * 3] = r;
        C[base + n * 3 + 1] = g;
        C[base + n * 3 + 2] = bl;
      }
    }
    res.pos.needsUpdate = true;
    res.col.needsUpdate = true;

    // ── Triângulo da marca ───────────────────────────────────────────
    const u = clamp01((t - T_TUMBLE) / (T_IMPACT - T_TUMBLE));
    const group = surfer.current;
    if (group) {
      const fall = Math.pow(u, 2.2);
      const lay = crane;
      // Ele não anda em linha reta: desenha um S na face da onda, vindo pra
      // câmera e voltando. É a curva que tira a rigidez do trajeto.
      const weave = surf * Math.PI * 1.6 + 0.4;
      const sz = 1.1 * Math.sin(weave) * (1 - u);
      const tr = Math.min(t, T_TUMBLE);
      const rx = Math.min(sx, 0);
      const rideY = seaHeight(rx, sz, tr) + 0.5;
      // Inclinação da água embaixo dele: a prancha acompanha a face da onda.
      const slope = seaHeight(rx + 0.5, sz, tr) - seaHeight(rx - 0.5, sz, tr);

      // Depois da batida ele não trava: balança sobre a ponta até assentar.
      const teeter = hit > 0 ? 0.26 * Math.exp(-hit * 5.5) * Math.sin(hit * 17) * (1 - lay) : 0;
      // Batida: amassa na vertical e alarga, depois volta com um repique.
      const squash = hit > 0 ? Math.exp(-hit * 11) * Math.cos(hit * 34) : 0;
      const sy = 1 - 0.24 * squash;
      const standY = SURFER_R * sy;
      const airY = rideY + (standY - rideY) * fall + 1.7 * Math.sin(Math.PI * u) * (1 - fall);
      group.position.set(
        sx + Math.sin(teeter) * standY,
        // Deitado, fica um palmo acima do terreno pra não atravessar as facetas.
        (hit > 0 ? standY * Math.cos(teeter) : airY) * (1 - lay) + 0.7 * lay,
        sz,
      );

      // Prancha: inclinada pra câmera, e mais ainda quando a curva fecha.
      q.setFromAxisAngle(X, 0.6 + 0.32 * Math.cos(weave) * (1 - u));
      // Nariz segue a face da onda; antes do tombo ele sobe (antecipação).
      q.multiply(
        q2.setFromAxisAngle(
          Z,
          0.16 + Math.atan(slope) * 0.6 * (1 - u) + 0.6 * Math.sin(Math.PI * clamp01(u / 0.3)),
        ),
      );
      // A proa vira junto com o S.
      q.multiply(q2.setFromAxisAngle(Y, -Math.PI / 2 - 0.3 * Math.cos(weave) * (1 - u)));
      if (fall > 0) {
        // Pose final: de pé, de frente pra câmera, ponta cravada no chão.
        // No caminho dá uma volta inteira no plano da tela.
        q2.setFromAxisAngle(Z, Math.PI).multiply(q3.setFromAxisAngle(X, Math.PI / 2));
        q.slerp(q2, fall);
        q.premultiply(q2.setFromAxisAngle(Z, -Math.PI * 2 * fall - teeter));
      }
      // Na grua ele deita e vira mais uma faceta do mosaico.
      if (lay > 0) q.slerp(q2.setFromAxisAngle(Y, Math.PI), lay);
      group.quaternion.copy(q);
      // De pé, o eixo local Z é a vertical do mundo.
      group.scale.set(1 + 0.18 * squash * (1 - lay), 1, sy + (1 - sy) * lay);
      group.visible = t >= T_SURF - 0.05;

      // Lâmina flexível: verga ao longo do comprimento e torce de lado.
      //  - no surf, respira com a ondulação e torce com a curva;
      //  - no tombo, a ponta fica pra trás do giro (arrasto);
      //  - na batida, treme feito gelatina até parar.
      const flex =
        ((0.16 + 0.1 * Math.sin(t * 6.5)) * (1 - u) -
          0.6 * Math.sin(Math.PI * u) +
          (hit > 0 ? 0.55 * Math.exp(-hit * 6.5) * Math.cos(hit * 27) : 0)) *
        (1 - lay);
      const twist =
        (0.3 * Math.cos(weave) * (1 - u) +
          0.35 * Math.sin(Math.PI * u) +
          (hit > 0 ? 0.3 * Math.exp(-hit * 6) * Math.sin(hit * 22) : 0)) *
        (1 - lay);
      const { rest, pos: bp, col: bc } = res.board;
      const BP = bp.array as Float32Array;
      const BC = bc.array as Float32Array;
      const len = SURFER_R * 1.5;
      const bend = flex * SURFER_R * 1.6;
      for (let n = 0; n < rest.length; n += 3) {
        const px = rest[n];
        const pz = rest[n + 2];
        // 0 na rabeta, 1 na ponta.
        const along = (SURFER_R * 0.5 - pz) / len;
        const lift = along - 0.3;
        BP[n + 1] = bend * lift * lift + twist * px * along * 0.5;
        // Normal da lâmina vergada, levada pro mundo, pra luz correr por ela.
        nrm
          .set(-twist * along * 0.5, 1, (bend * 2 * lift + twist * px * 0.5) / len)
          .normalize()
          .applyQuaternion(q);
        const lit = Math.abs(nrm.x * -0.5 + nrm.y * 0.78 + nrm.z * 0.37);
        const shade = 0.58 + 0.42 * Math.min(1, lit * 1.15);
        // Off-white da marca, esfriando um pouco na sombra. sRGB → linear.
        BC[n] = Math.pow(0.96 * shade, 2.2);
        BC[n + 1] = Math.pow(0.95 * shade, 2.2);
        BC[n + 2] = Math.pow(0.93 * shade + 0.03 * (1 - shade), 2.2);
      }
      bp.needsUpdate = true;
      bc.needsUpdate = true;
    }

    // ── Partículas ───────────────────────────────────────────────────
    const bits = particles.current;
    if (bits) {
      for (let i = 0; i < PARTICLES; i++) {
        let alive = false;
        if (i < FOAM) {
          // Espuma: solta da rabeta e voa pra trás.
          const born = T_SURF + ((i + hash(i, 1)) / FOAM) * (T_TUMBLE - T_SURF + 0.15);
          const age = t - born;
          const life = 0.75 + 0.4 * hash(i, 2);
          if (age > 0 && age < life) {
            alive = true;
            const px = surferX(born);
            const k = age / life;
            o.position.set(
              px - 0.9 - (2.6 + 2.2 * hash(i, 3)) * age,
              seaHeight(px, 0, born) + 0.4 + (1.4 + 1.6 * hash(i, 4)) * age - 2.6 * age * age,
              (hash(i, 5) - 0.5) * 3.2 * age,
            );
            o.rotation.set(age * (6 + 6 * hash(i, 6)) + i, age * 7, age * 5 + i * 0.7);
            o.scale.setScalar((1 - k * k) * (0.6 + 0.8 * hash(i, 7)));
            c.setRGB(1, 0.96 - 0.72 * k, 0.94 - 0.66 * k, THREE.SRGBColorSpace);
          }
        } else if (i < FOAM + SPRAY) {
          // Borrifo: a crista joga gotas pra cima ao longo do lábio.
          const born = T_SURF + 0.15 + hash(i, 8) * (T_TUMBLE - T_SURF + 0.25);
          const age = t - born;
          const life = 0.55 + 0.3 * hash(i, 9);
          if (age > 0 && age < life) {
            alive = true;
            const px = surferX(born) - 0.2 + hash(i, 10) * 0.9;
            const pz = (hash(i, 11) - 0.5) * 7;
            const k = age / life;
            o.position.set(
              px + 0.6 * age,
              seaHeight(px, pz, born) + (2.2 + 1.8 * hash(i, 12)) * age - 4.2 * age * age,
              pz,
            );
            o.rotation.set(age * 8 + i, age * 5, i);
            o.scale.setScalar((1 - k) * (0.35 + 0.5 * hash(i, 13)));
            c.setRGB(1, 1 - 0.5 * k, 1 - 0.45 * k, THREE.SRGBColorSpace);
          }
        } else if (hit > 0) {
          // Estilhaços do impacto: abrem em leque e caem.
          const life = 0.55 + 0.45 * hash(i, 14);
          if (hit < life) {
            alive = true;
            const ang = hash(i, 15) * Math.PI * 2;
            const sp = 3 + 6 * hash(i, 16);
            const k = hit / life;
            o.position.set(
              IMPACT_X + Math.cos(ang) * sp * hit,
              Math.max(0.05, 0.1 + (3.5 + 4.5 * hash(i, 17)) * hit - 8 * hit * hit),
              Math.sin(ang) * sp * hit * 0.7,
            );
            o.rotation.set(hit * 11 + i, hit * 9, hit * 7 + i);
            o.scale.setScalar((1 - k) * (0.7 + 0.9 * hash(i, 18)));
            const warm = hash(i, 19);
            c.setRGB(1, 0.95 - 0.6 * warm, 0.93 - 0.55 * warm, THREE.SRGBColorSpace);
          }
        }
        if (!alive) o.scale.setScalar(0);
        else bits.setColorAt(i, c);
        o.updateMatrix();
        bits.setMatrixAt(i, o.matrix);
      }
      o.scale.setScalar(1);
      bits.instanceMatrix.needsUpdate = true;
      if (bits.instanceColor) bits.instanceColor.needsUpdate = true;
    }

    if (!fired.current.impact && t >= T_IMPACT) {
      fired.current.impact = true;
      if (!skip.current && freeze === undefined) cbs.current.onImpact();
    }
    // Os cacos entram com a grua ainda terminando: as duas imagens se cruzam.
    if (!fired.current.projects && t >= T_PROJECTS - 0.3) {
      fired.current.projects = true;
      cbs.current.onProjects();
    }
  });

  return (
    <>
      <mesh geometry={res.field} material={res.fieldMat} frustumCulled={false} />
      <instancedMesh ref={particles} args={[res.bit, res.bitMat, PARTICLES]} frustumCulled={false} />
      <group ref={surfer} visible={false}>
        <mesh geometry={res.board.g} material={res.boardMat} />
        {/* A quilha: o mesmo triângulo, maior e por baixo, na cor de destaque.
            De cima é o contorno; no tombo é o verso que aparece girando. */}
        <mesh geometry={res.board.g} material={res.keelMat} scale={1.09} position={[0, -0.03, 0]} />
      </group>
    </>
  );
}

/**
 * Cenas 1 a 3 da abertura "mar", mais a grua que entrega a cena 4.
 *
 * A malha é uma superfície de triângulos de verdade (vértices compartilhados
 * na conta, separados no desenho): no mar cada triângulo encolhe e balança
 * solto, e no impacto eles travam de dentro pra fora, fechando o terreno.
 *
 * Tudo é função do tempo, sem estado entre frames: pular é só adiantar o
 * relógio, e `freeze` mostra qualquer quadro parado.
 */
export default function MarScene(props: SceneProps) {
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 50, near: 0.1, far: 90 }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#060606"]} />
      <ReleaseContext />
      <Scene {...props} />
    </Canvas>
  );
}
