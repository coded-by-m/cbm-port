"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ReleaseContext } from "@/components/three/ReleaseContext";
import {
  CITY_FRAG,
  CITY_VERT,
  CONCRETE,
  GROUND_FRAG,
  GROUND_VERT,
  buildModules,
} from "@/components/lab/aberturas/CidadeScene";
import {
  clamp01,
  easeInCubic,
  easeInOut,
  span,
  useCovers,
} from "@/components/lab/aberturas/cena";

import {
  DIVE_FROM,
  GO_BACK,
  GO_POST,
  LAST,
  POST,
  SIGNS,
  SIGN_H,
  SIGN_TIP,
  SIGN_W,
  STOPS,
  TRAVEL,
  stopProgress,
} from "./stops";

const FOV = 42;
const TAN = Math.tan((FOV * Math.PI) / 360);
const ACCENT = "#FB3640";
const NIGHT = "#060606";

/** Folga entre o telhado mais alto e a base das placas. */
const ROOF = 5.6;

/**
 * Painéis de capa espalhados pela cidade: é o que enche o voo de imagem.
 * Proporção das capas (760×874), então não há recorte.
 */
const SHOT_ASPECT = 760 / 874;
const SHOTS = [
  { x: 15, y: 8.4, z: 9, ry: -1.0, w: 5 },
  { x: -14, y: 9, z: -23, ry: 0.6, w: 5.4 },
  { x: 16, y: 9, z: -36, ry: -0.5, w: 5 },
];

/** Duração do voo de quem clica numa placa de rua, em segundos. */
const ROUTE_S = 2.1;

export interface BoardPx {
  w: number;
  h: number;
}

export interface HeroOutdoorSceneProps {
  /** O palco alto: o scroll dentro dele é o progresso da câmera. */
  stage: RefObject<HTMLElement>;
  /** Os blocos de HTML presos nas placas, um por parada. */
  boards: MutableRefObject<(HTMLDivElement | null)[]>;
  /** Véu que escurece a tela no fim do mergulho. */
  fade: RefObject<HTMLDivElement>;
  heroPx: BoardPx;
  chapterPx: BoardPx;
  /** Os rótulos (links) presos nas placas do poste, de cima pra baixo. */
  signs: MutableRefObject<(HTMLAnchorElement | null)[]>;
  signPx: BoardPx;
  /** Capas dos painéis soltos pela cidade. */
  covers: string[];
  /** Pedido de rota: a navegação escreve aqui o índice da parada. */
  go: MutableRefObject<number | null>;
  /** Parada mais próxima da câmera; -1 quando ela está no poste. */
  onStop: (index: number) => void;
  active: boolean;
  reduced: boolean;
}

const corners = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
const view = new THREE.Vector3();

/**
 * Prende um elemento HTML numa placa do mundo 3D.
 *
 * Projeta os quatro cantos da placa na tela e monta a `matrix3d` que leva o
 * retângulo do elemento exatamente pra esse quadrilátero. O texto continua
 * sendo DOM de verdade: selecionável, clicável, lido por leitor de tela.
 */
function pin(
  el: HTMLElement | null,
  camera: THREE.Camera,
  size: { width: number; height: number },
  center: THREE.Vector3,
  ry: number,
  w: number,
  h: number,
  px: BoardPx,
  opacity: number,
) {
  if (!el) return;
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  const sx = [-w / 2, w / 2, w / 2, -w / 2];
  const sy = [h / 2, h / 2, -h / 2, -h / 2];
  let visible = opacity > 0.01;
  for (let i = 0; i < 4 && visible; i++) {
    const c = corners[i].set(center.x + sx[i] * cos, center.y + sy[i], center.z - sx[i] * sin);
    // Canto atrás da câmera: a projeção não vale.
    if (view.copy(c).applyMatrix4(camera.matrixWorldInverse).z > -0.2) visible = false;
    c.project(camera);
    c.x = (c.x * 0.5 + 0.5) * size.width;
    c.y = (-c.y * 0.5 + 0.5) * size.height;
  }
  const [p0, p1, p2, p3] = corners;
  // Placa vista por trás: o quadrilátero inverte.
  if (visible && (p1.x - p0.x) * (p3.y - p0.y) - (p1.y - p0.y) * (p3.x - p0.x) <= 0) visible = false;

  if (!visible) {
    el.style.visibility = "hidden";
    return;
  }
  // Quadrado unitário → quadrilátero (projeção geral em 2D).
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const sxx = p0.x - p1.x + p2.x - p3.x;
  const syy = p0.y - p1.y + p2.y - p3.y;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sxx * dy2 - dx2 * syy) / den;
  const k = (dx1 * syy - sxx * dy1) / den;
  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + k * p3.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + k * p3.y;
  el.style.visibility = "visible";
  el.style.left = "0";
  el.style.top = "0";
  el.style.opacity = String(opacity);
  el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
  el.style.transform = `matrix3d(${a / px.w},${d / px.w},0,${g / px.w},${b / px.h},${e / px.h},0,${k / px.h},0,0,1,0,${p0.x},${p0.y},0,1)`;
}

/** Bézier quadrática, escrita em `out`. */
function bezier(
  out: THREE.Vector3,
  a: THREE.Vector3,
  c: THREE.Vector3,
  b: THREE.Vector3,
  t: number,
) {
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    u * u * a.z + 2 * u * t * c.z + t * t * b.z,
  );
}

/** O triângulo da marca: só o contorno, com a ponta em +z (pra onde ele voa). */
function outlineTriangle(r: number, thickness: number) {
  const pts = (k: number) => [
    [0, r * k],
    [0.866 * r * k, -0.5 * r * k],
    [-0.866 * r * k, -0.5 * r * k],
  ];
  const outer = pts(1);
  const inner = pts(1 - thickness);
  const pos: number[] = [];
  for (let i = 0; i < 3; i++) {
    const j = (i + 1) % 3;
    const quad = [outer[i], outer[j], inner[j], outer[i], inner[j], inner[i]];
    // (x, y) do desenho vira (x, z) do mundo: o triângulo fica deitado.
    quad.forEach(([x, y]) => pos.push(x, 0, y));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
  return g;
}

/** A chapa de uma placa de rua: retângulo com a ponta em triângulo em +x. */
function signShape() {
  const w = SIGN_W / 2;
  const h = SIGN_H / 2;
  const tip = SIGN_W * SIGN_TIP;
  const shape = new THREE.Shape();
  shape.moveTo(-w, -h);
  shape.lineTo(w - tip, -h);
  shape.lineTo(w, 0);
  shape.lineTo(w - tip, h);
  shape.lineTo(-w, h);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

/** A estrutura da placa: face escura, moldura, postes e três refletores. */
function Outdoor({
  center,
  ry,
  w,
  h,
  box,
  glow,
}: {
  center: THREE.Vector3;
  ry: number;
  w: number;
  h: number;
  box: THREE.BoxGeometry;
  glow: THREE.Texture;
}) {
  return (
    <group position={center} rotation={[0, ry, 0]}>
      {/* Halo: a placa acesa clareia o ar em volta dela. */}
      <mesh position={[0, 0, -0.62]} scale={[w * 2.1, h * 1.9, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={glow}
          color="#F5F2ED"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh geometry={box} position={[0, -h / 2 - 0.12, -0.26]} scale={[w + 0.24, h + 0.24, 0.5]}>
        <meshBasicMaterial color="#0b0b0c" />
      </mesh>
      {[-0.32, 0.32].map((k) => (
        <mesh
          key={k}
          geometry={box}
          position={[w * k, -center.y - 1, -0.6]}
          scale={[0.5, center.y + 1, 0.5]}
        >
          <meshBasicMaterial color="#0b0b0c" />
        </mesh>
      ))}
      {[-0.3, 0, 0.3].map((k) => (
        <mesh key={k} geometry={box} position={[w * k, h / 2 + 0.2, 0.5]} scale={[0.5, 0.12, 0.3]}>
          <meshBasicMaterial color="#F5F2ED" />
        </mesh>
      ))}
    </group>
  );
}

interface Route {
  to: number;
  t: number;
  from: THREE.Vector3;
  fromLook: THREE.Vector3;
  ctrl: THREE.Vector3;
  guideFrom: THREE.Vector3;
  vis: number[];
  signVis: number;
}

function Scene({
  stage,
  boards,
  fade,
  heroPx,
  chapterPx,
  signs,
  signPx,
  covers,
  go,
  onStop,
  reduced,
}: HeroOutdoorSceneProps) {
  const { textures } = useCovers(covers);
  const size = useThree((s) => s.size);
  // Em pé a tela é estreita: os painéis soltos fecham pro meio.
  const squeeze = Math.max(0.5, Math.min(1, (size.width / size.height) * 0.85));
  const city = useRef<THREE.InstancedMesh>(null);
  const guide = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const route = useRef<Route | null>(null);
  // Estacionado no poste: `blend` 1 é a câmera lá, 0 é de volta no scroll.
  const park = useRef({ blend: 0, release: false, at: 0, signVis: 0 });
  const stop = useRef(-1);
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;

  const res = useMemo(() => {
    // Traço vermelho fino: aqui ele é detalhe, não o assunto.
    const modules = buildModules(0.6);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.45, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const glow = new THREE.CanvasTexture(canvas);
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const cityBox = box.clone();
    cityBox.setAttribute(
      "aRed",
      new THREE.InstancedBufferAttribute(new Float32Array(modules.map((m) => (m.red ? 1 : 0))), 1),
    );
    const night = new THREE.Color(NIGHT).convertLinearToSRGB();
    const shared = {
      uNight: { value: 1 },
      uRing: { value: -1 },
      uAccent: { value: new THREE.Color(ACCENT).convertLinearToSRGB() },
      uFogColor: { value: night },
      uFogNear: { value: 20 },
      uFogFar: { value: 74 },
    };
    const v = () => new THREE.Vector3();
    return {
      modules,
      box,
      cityBox,
      glow,
      tri: outlineTriangle(0.62, 0.3),
      sign: signShape(),
      shared,
      cityMat: new THREE.ShaderMaterial({
        vertexShader: CITY_VERT,
        fragmentShader: CITY_FRAG,
        uniforms: { ...shared, uWin: { value: 1 } },
      }),
      groundMat: new THREE.ShaderMaterial({
        vertexShader: GROUND_VERT,
        fragmentShader: GROUND_FRAG,
        uniforms: shared,
      }),
      work: {
        pos: v(),
        look: v(),
        ctrl: v(),
        aim: v(),
        gPos: v(),
        gPrev: v(),
        gCtrl: v(),
        vel: v(),
        lastPos: v(),
        lastLook: v(),
        q: new THREE.Quaternion(),
        m: new THREE.Matrix4(),
        up: new THREE.Vector3(0, 1, 0),
        e: new THREE.Euler(),
        vis: STOPS.map(() => 0),
      },
    };
  }, []);

  /**
   * Geometria de cada parada: centro e largura da placa, a pose da câmera na
   * frente dela e o poleiro do triângulo (quina de cima à direita).
   */
  const stops = useMemo(
    () =>
      STOPS.map((s, i) => {
        const px = i === 0 ? heroPx : chapterPx;
        const w = (s.h * px.w) / px.h;
        const center = new THREE.Vector3(s.x, ROOF + s.lift + s.h / 2, s.z);
        // Distância em que a placa ocupa na tela a mesma altura do HTML: assim
        // o texto fica no tamanho em que foi desenhado, sem borrar.
        const d = (s.h * size.height) / (px.h * 2 * TAN);
        const nx = Math.sin(s.ry);
        const nz = Math.cos(s.ry);
        return {
          ...s,
          px,
          w,
          center,
          cam: new THREE.Vector3(s.x + nx * d, center.y - (i === 0 ? 0.9 : 0.3), s.z + nz * d),
          look: new THREE.Vector3(s.x, center.y - (i === 0 ? 1.3 : 0), s.z),
          perch: new THREE.Vector3(
            s.x + (w / 2 - 0.5) * nz + nx * 0.4,
            // No hero ele pousa rente à quina, pra não sair pelo topo da tela.
            center.y + s.h / 2 + (i === 0 ? (size.width < size.height ? 0.15 : 0.35) : 0.95),
            s.z - (w / 2 - 0.5) * nx + nz * 0.4,
          ),
          dive: new THREE.Vector3(s.x + nx * 0.7, center.y, s.z + nz * 0.7),
        };
      }),
    [heroPx, chapterPx, size.width, size.height],
  );

  /**
   * O poste: a pose da câmera em close (a distância em que uma placa ocupa na
   * tela o tamanho do rótulo em HTML) e o centro de cada placa.
   */
  const post = useMemo(() => {
    const d = (SIGN_W * size.height) / (signPx.w * 2 * TAN);
    return {
      side: 0.5,
      cam: new THREE.Vector3(POST.x + 0.45, POST.y + 1.7, POST.z + d),
      look: new THREE.Vector3(POST.x, POST.y + 0.35, POST.z),
      perch: new THREE.Vector3(POST.x, POST.y + 1.5, POST.z),
      plates: SIGNS.map((s) => {
        // A placa sai do poste pro lado em que aponta.
        // Em tela em pé não cabem duas larguras: as placas ficam centradas
        // na haste e só a ponta diz o lado.
        const off = s.dir * (size.width < size.height ? 0.1 : SIGN_W / 2 - 0.2);
        return {
          ...s,
          center: new THREE.Vector3(
            POST.x + off * Math.cos(s.yaw) + 0.08 * Math.sin(s.yaw),
            POST.y + s.level,
            POST.z - off * Math.sin(s.yaw) + 0.08 * Math.cos(s.yaw),
          ),
        };
      }),
    };
  }, [signPx, size.width, size.height]);

  // A cidade já nasce pronta: as matrizes são escritas uma vez, antes do
  // primeiro quadro (o shader só enxerga `instanceColor` se ela já existir).
  useLayoutEffect(() => {
    const mesh = city.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    const red = new THREE.Color(ACCENT);
    res.modules.forEach((mod, i) => {
      m.makeScale(0.9, mod.h, 0.9);
      m.setPosition(mod.x, 0, mod.z);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.copy(mod.red ? red : CONCRETE).convertLinearToSRGB());
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    res.cityMat.needsUpdate = true;
  }, [res]);

  useEffect(
    () => () => {
      res.box.dispose();
      res.cityBox.dispose();
      res.glow.dispose();
      res.tri.dispose();
      res.sign.dispose();
      res.cityMat.dispose();
      res.groundMat.dispose();
    },
    [res],
  );

  // MeshBasicMaterial converte cor na saída: as capas precisam ser sRGB.
  useEffect(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (tex.image) tex.needsUpdate = true;
    });
  }, [textures]);

  // Paralaxe do ponteiro: só onde existe ponteiro fino.
  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const w = res.work;
    const { pos, look, ctrl, aim, gPos, gPrev, gCtrl, vel, vis } = w;
    const el = stage.current;
    const heroTop = stops[0].center.y + stops[0].h / 2;

    // ── Scroll ───────────────────────────────────────────────────────
    let target = 0;
    let total = 1;
    let top = 0;
    if (el) {
      const rect = el.getBoundingClientRect();
      total = Math.max(1, rect.height - window.innerHeight);
      top = rect.top;
      target = clamp01(-top / total);
    }
    const jump = (i: number) => {
      const p = stopProgress(i);
      progress.current = p;
      window.scrollTo({ top: window.scrollY + top + p * total, behavior: "instant" });
    };

    // ── Pedido de rota (clique numa placa de rua) ───────────────────
    const pk = park.current;
    if (go.current !== null) {
      const to = go.current;
      go.current = null;
      const away = -top > total + 4 || w.lastPos.lengthSq() === 0;
      if (to === GO_BACK) {
        // Sair do poste: a câmera volta pra onde o scroll está.
        pk.release = true;
      } else if (to === GO_POST && (reduced || away)) {
        // Sem voo: aparece direto no poste.
        route.current = null;
        pk.blend = 1;
        pk.release = false;
        pk.at = target;
      } else if (reduced || away) {
        // Fora do palco, ou com movimento reduzido, não há voo: só o salto.
        route.current = null;
        pk.blend = 0;
        jump(to);
        target = stopProgress(to);
      } else {
        const dest = to === GO_POST ? post : stops[to];
        const from = w.lastPos.clone();
        // Cada destino faz a curva pra um lado e a uma altura: é o "caminho".
        const c = from.clone().add(dest.cam).multiplyScalar(0.5);
        const dist = from.distanceTo(dest.cam);
        if (to === GO_POST) {
          // Pro poste é um zoom, não uma viagem: quase reto, pouca altura.
          c.y += 1 + dist * 0.08;
        } else {
          c.x += dest.side * (5 + dist * 0.18);
          c.y += 7 + dist * 0.22;
        }
        // Atravessando a placa do hero, a rota tem que passar por cima dela.
        if ((from.z - stops[0].z) * (dest.cam.z - stops[0].z) < 0) {
          c.y = Math.max(c.y, heroTop + 11);
        }
        route.current = {
          to,
          t: 0,
          from,
          fromLook: w.lastLook.clone(),
          ctrl: c,
          guideFrom: gPrev.clone(),
          vis: [...vis],
          signVis: pk.signVis,
        };
        pk.blend = 0;
        pk.release = false;
      }
    }

    const ptr = pointer.current;
    ptr.sx += (ptr.x - ptr.sx) * (1 - Math.exp(-dt * 4));
    ptr.sy += (ptr.y - ptr.sy) * (1 - Math.exp(-dt * 4));

    // Um anel de luz varre a cidade de tempos em tempos.
    const cycle = t % 9;
    res.shared.uRing.value = !reduced && cycle < 3.2 ? cycle * 14 - 3 : -1;

    let still = 0;
    let near = 0;
    let roll = 0;
    // Quanto o triângulo está no poste (0 a 1): lá ele fica menor e de frente.
    let atPost = 0;
    const r = route.current;

    if (r) {
      // ── Voo de rota: da pose atual direto pro destino ─────────────
      r.t = Math.min(1, r.t + dt / ROUTE_S);
      const toPost = r.to === GO_POST;
      const dest = toPost ? post : stops[r.to];
      bezier(pos, r.from, r.ctrl, dest.cam, easeInOut(r.t));
      look.copy(r.fromLook).lerp(dest.look, easeInOut(span(r.t, 0.05, 0.8)));
      roll = 0.09 * dest.side * Math.sin(r.t * Math.PI);
      // O triângulo sai antes e chega antes: é ele quem mostra o caminho.
      gCtrl.copy(r.ctrl).setY(r.ctrl.y + 1.5);
      bezier(gPos, r.guideFrom, gCtrl, dest.perch, easeInOut(span(r.t, 0, 0.78)));
      for (let i = 0; i < vis.length; i++) vis[i] = r.vis[i] * (1 - clamp01(r.t * 3));
      const arrive = clamp01((r.t - 0.6) / 0.3);
      if (!toPost) vis[r.to] = Math.max(vis[r.to], arrive);
      else atPost = easeInOut(span(r.t, 0.3, 0.8));
      pk.signVis = toPost ? Math.max(r.signVis, arrive) : r.signVis * (1 - clamp01(r.t * 3));
      near = r.to;
      if (r.t >= 1) {
        route.current = null;
        if (toPost) {
          // Chegou no poste: fica estacionado até clicar numa placa ou rolar.
          pk.blend = 1;
          pk.release = false;
          pk.at = target;
        } else {
          // Chegou: o scroll é reposicionado na mesma pose, e ele reassume.
          jump(r.to);
        }
      }
    } else {
      // ── Scroll: visita as paradas em ordem ────────────────────────
      progress.current += (target - progress.current) * (reduced ? 1 : 1 - Math.exp(-dt * 7));
      const p = progress.current;
      const s = clamp01(p / TRAVEL) * LAST;
      const k = Math.min(LAST - 1, Math.floor(s));
      const frac = s - k;
      const f = easeInOut(span(frac, 0.12, 0.88));
      const a = stops[k];
      const b = stops[k + 1];
      const dive = easeInCubic(span(p, DIVE_FROM, 1));

      ctrl.copy(a.cam).add(b.cam).multiplyScalar(0.5);
      // Saindo do hero, o voo passa por cima da placa dele.
      if (k === 0) ctrl.set(ctrl.x + 2.5, heroTop + 11, a.z + 1);
      else ctrl.y += 8;
      bezier(pos, a.cam, ctrl, b.cam, f);
      pos.lerp(stops[LAST].dive, dive);
      look.copy(a.look).lerp(b.look, easeInOut(span(f, 0.08, 0.85)));

      gCtrl.copy(ctrl).setY(ctrl.y + 1.5);
      bezier(gPos, a.perch, gCtrl, b.perch, easeInOut(span(frac, 0.04, 0.7)));

      const at = k + f;
      for (let i = 0; i < vis.length; i++) {
        vis[i] = clamp01(1 - Math.abs(at - i) * 2.2) * (1 - span(p, 0.955, 0.99));
      }
      still = 1 - Math.sin(Math.PI * f);
      near = Math.round(at);
      roll = 0.06 * Math.sin(f * Math.PI * 2) * (1 - dive);

      // Estacionado no poste: qualquer scroll solta a câmera de volta.
      if (pk.blend > 0) {
        if (!pk.release && Math.abs(target - pk.at) > 0.004) pk.release = true;
        if (pk.release) pk.blend = Math.max(0, pk.blend - dt / 0.9);
        const e = easeInOut(pk.blend);
        pos.lerp(post.cam, e);
        look.lerp(post.look, e);
        gPos.lerp(post.perch, e);
        for (let i = 0; i < vis.length; i++) vis[i] *= 1 - e;
        roll *= 1 - e;
        still = still * (1 - e) + e;
        if (e > 0.5) near = GO_POST;
        pk.signVis = e;
        atPost = e;
      } else {
        pk.signVis = 0;
      }
    }

    if (!reduced) {
      // Parado ele nunca está parado: deriva lenta e paralaxe do ponteiro.
      pos.x += (0.22 * Math.sin(t * 0.4) + ptr.sx * 0.9) * still;
      pos.y += (0.1 * Math.sin(t * 0.31) - ptr.sy * 0.4) * still;
    }

    const camera = state.camera;
    camera.position.copy(pos);
    camera.up.set(0, 1, 0);
    camera.lookAt(look);
    camera.rotateZ(roll);
    camera.updateMatrixWorld();
    w.lastPos.copy(pos);
    w.lastLook.copy(look);

    if (near !== stop.current) {
      stop.current = near;
      onStopRef.current(near);
    }

    // ── O triângulo da marca, guia do caminho ───────────────────────
    const g = guide.current;
    if (g) {
      vel.copy(gPos).sub(gPrev);
      const flying = vel.length() / Math.max(dt, 1e-4) > 0.6;
      if (flying) {
        // Voando: a ponta aponta pra onde ele vai.
        w.m.lookAt(gPos, aim.copy(gPos).sub(vel), w.up);
        w.q.setFromRotationMatrix(w.m);
      } else {
        // Pousado: fica de pé na quina da placa, girando feito biruta.
        // No poste ele não gira: fica de frente pra câmera, só balançando.
        const spin = atPost > 0.5 ? 0.3 * Math.sin(t * 0.8) : t * 0.9;
        w.q.setFromEuler(w.e.set(-Math.PI / 2, 0, reduced ? 0 : spin, "YXZ"));
      }
      g.quaternion.slerp(w.q, 1 - Math.exp(-dt * 9));
      g.position.copy(gPos);
      g.scale.setScalar(1 - 0.5 * atPost);
      if (!reduced && !flying) g.position.y += 0.12 * Math.sin(t * 2.1);
      gPrev.copy(gPos);
    }

    // ── HTML preso nas placas ────────────────────────────────────────
    stops.forEach((s, i) => {
      pin(boards.current[i], camera, size, s.center, s.ry, s.w, s.h, s.px, vis[i]);
    });
    post.plates.forEach((s, i) => {
      pin(signs.current[i], camera, size, s.center, s.yaw, SIGN_W, SIGN_H, signPx, pk.signVis);
    });
    if (fade.current) fade.current.style.opacity = String(span(progress.current, 0.955, 0.995));
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={res.groundMat}>
        <planeGeometry args={[500, 500]} />
      </mesh>
      <instancedMesh
        ref={city}
        args={[res.cityBox, res.cityMat, res.modules.length]}
        frustumCulled={false}
      />
      {stops.map((s) => (
        <Outdoor
          key={s.id}
          center={s.center}
          ry={s.ry}
          w={s.w}
          h={s.h}
          box={res.box}
          glow={res.glow}
        />
      ))}
      {/* O poste de placas: haste e uma chapa por andar. */}
      <mesh geometry={res.box} position={[POST.x, 0, POST.z]} scale={[0.11, POST.y + 1.22, 0.11]}>
        <meshBasicMaterial color="#3d3e44" />
      </mesh>
      {post.plates.map((s) => (
        <mesh
          key={s.stop}
          geometry={res.sign}
          position={s.center}
          rotation={[0, s.yaw, 0]}
          scale={[s.dir, 1, 1]}
        >
          <meshBasicMaterial color="#F5F2ED" side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
      <group ref={guide}>
        <mesh geometry={res.tri}>
          <meshBasicMaterial color={ACCENT} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
      {textures.length > 0 &&
        SHOTS.map((s, i) => {
          const h = s.w / SHOT_ASPECT;
          return (
            <group key={i} position={[s.x * squeeze, s.y, s.z]} rotation={[0, s.ry * squeeze, 0]}>
              <mesh scale={[s.w, h, 1]}>
                <planeGeometry />
                <meshBasicMaterial map={textures[i % textures.length]} toneMapped={false} />
              </mesh>
              <mesh
                geometry={res.box}
                position={[0, -h / 2 - 0.1, -0.22]}
                scale={[s.w + 0.2, h + 0.2, 0.4]}
              >
                <meshBasicMaterial color="#0b0b0c" />
              </mesh>
              <mesh geometry={res.box} position={[0, -s.y - 1, -0.5]} scale={[0.45, s.y + 1, 0.45]}>
                <meshBasicMaterial color="#0b0b0c" />
              </mesh>
            </group>
          );
        })}
    </>
  );
}

/**
 * Protótipo "hero como outdoor", com navegação por placas de rua.
 *
 * A cidade-QR à noite, com uma placa por parada (hero + capítulos). O conteúdo
 * das placas é HTML de verdade, preso nelas por `matrix3d` a cada quadro.
 *
 * Duas formas de andar. O scroll visita as paradas em ordem. E o menu dá um
 * zoom no poste de placas que fica na frente do outdoor: cada andar do poste é
 * uma rua, e clicar numa placa manda a câmera pro destino por uma rota própria.
 * Em todos os casos o triângulo da marca voa na frente e pousa onde ela chega.
 */
export default function HeroOutdoorScene(props: HeroOutdoorSceneProps) {
  return (
    <Canvas
      flat
      frameloop={props.active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: FOV, near: 0.1, far: 220 }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={[NIGHT]} />
      <ReleaseContext />
      <Scene {...props} />
    </Canvas>
  );
}
