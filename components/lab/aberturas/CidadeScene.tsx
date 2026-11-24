"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ReleaseContext } from "@/components/three/ReleaseContext";
import { QR_ROWS } from "@/data/cartao";
import {
  aspectOf,
  clamp01,
  easeInCubic,
  easeInOut,
  easeOutCubic,
  hash,
  span,
  useCenaClock,
  useCovers,
  type CenaProps,
} from "./cena";

/**
 * Linha do tempo, em segundos. É AQUI que se ajusta o ritmo.
 *
 *   0 ........ T_RISE   o QR do cartão, chapado, visto de cima (mira de leitura)
 *   T_RISE ... T_FLY    a câmera desce e os módulos ganham altura
 *   T_FLY .... T_DIVE   voo por cima dos telhados, passando pelos painéis
 *   T_DIVE ... T_END    mergulho no último painel
 */
const T_RISE = 0.8;
const T_FLY = 2.2;
const T_DIVE = 4.5;
const T_END = 5.2;

const FOV = 42;
export const N = QR_ROWS.length;
export const HALF = N / 2;

/** Papel do verso do cartão, tinta do QR, e a cidade à noite. */
const PAPER = new THREE.Color("#F4F0E6");
const NIGHT = new THREE.Color("#060606");
export const INK = new THREE.Color("#0b0b0b");
export const CONCRETE = new THREE.Color("#34353a");

/** Painéis: posição do centro, giro em Y e largura. O último é o do mergulho. */
const PANELS: { at: [number, number, number]; ry: number; w: number }[] = [
  { at: [9.5, 7.4, 6], ry: -0.75, w: 7.5 },
  { at: [-9, 7.8, -4], ry: 0.8, w: 7.5 },
  { at: [1.5, 8.2, -17], ry: 0, w: 9 },
];
/**
 * Formato do painel: 16:10 deitado. Em pé ele vira 4:5, mais estreito e mais
 * alto, pra caber inteiro na tela do celular (e mostrar mais da capa).
 */
const PANEL_ASPECT = 1.6;
const PANEL_ASPECT_PORTRAIT = 0.8;
const PANEL_SCALE_PORTRAIT = 0.6;
const PANEL_LIFT_PORTRAIT = 1.6;
/** Em pé a câmera para mais longe do último painel. */
const PULLBACK_PORTRAIT = 5;
/** Placa com o nome do projeto, embaixo de cada painel. */
const LABEL_W = 1024;
const LABEL_H = 176;

/** Caminho da câmera no voo. */
const PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-5, 10, 27),
    new THREE.Vector3(4.5, 8.4, 14),
    new THREE.Vector3(-3.5, 8.2, 3),
    new THREE.Vector3(1.5, 8.2, -6),
  ],
  false,
  "catmullrom",
  0.5,
);

const DUST = 260;

const GLSL_COMMON = /* glsl */ `
  uniform float uNight;
  uniform float uRing;
  uniform vec3 uAccent;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vW;
  varying float vDepth;

  // Hash sem seno: com seno, qualquer erro de arredondamento vira chuvisco.
  float hash2(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  // Frente da construção: um anel de luz que corre do centro pra fora.
  float ring() {
    float d = (length(vW.xz) - uRing) / 1.7;
    return exp(-d * d) * step(0.0, uRing);
  }
  vec3 fogged(vec3 col) {
    return mix(col, uFogColor, smoothstep(uFogNear, uFogFar, vDepth));
  }
`;

export const CITY_VERT = /* glsl */ `
  attribute float aRed;
  varying vec3 vW;
  varying vec3 vN;
  varying vec3 vC;
  varying vec2 vSeed;
  varying float vRed;
  varying float vDepth;

  void main() {
    vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vN = normal;
    vC = instanceColor;
    vRed = aRed;
    vSeed = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const CITY_FRAG = /* glsl */ `
  ${GLSL_COMMON}
  uniform float uWin;
  varying vec3 vN;
  varying vec3 vC;
  varying vec2 vSeed;
  varying float vRed;

  void main() {
    vec3 n = normalize(vN);
    float top = step(0.5, n.y);
    float side = 1.0 - top;
    float diff = max(dot(n, normalize(vec3(-0.42, 0.8, 0.45))), 0.0);
    vec3 col = vC * (0.42 + 0.95 * diff);
    // À noite a base do prédio some no escuro: dá peso e profundidade.
    col *= mix(1.0, 0.35 + 0.65 * smoothstep(-0.4, 2.6, vW.y), side * uNight);

    // Janelas: uma grade nas fachadas, cada uma acende no seu tempo.
    float u = abs(n.x) > 0.5 ? vW.z : vW.x;
    vec2 g = vec2(u * 3.0, vW.y * 2.4);
    vec2 cell = floor(g);
    vec2 f = fract(g);
    float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.3, f.y) * step(f.y, 0.78);
    win *= side * (1.0 - vRed);
    // A semente é o módulo do QR, arredondado: igual no prédio inteiro.
    vec2 seed = floor(vSeed + 40.0);
    float r1 = hash2(cell + seed * 13.0 + n.xz * 5.0);
    float r2 = hash2(cell.yx + seed * 7.0 + 91.0);
    float on = step(0.6, r1) * step(r2, uWin);
    float near = smoothstep(52.0, 20.0, vDepth);
    vec3 glass = mix(vec3(0.96, 0.93, 0.86), uAccent, step(0.9, fract(r1 * 7.0)));
    col *= 1.0 - win * 0.35 * uNight;
    col += glass * win * on * near * uNight * (0.5 + 0.5 * r2);

    // O traço vermelho do símbolo brilha por conta própria.
    col += uAccent * vRed * uNight * (0.05 + 0.1 * side);
    col += uAccent * ring() * 0.55;
    gl_FragColor = vec4(fogged(col), 1.0);
  }
`;

export const GROUND_VERT = /* glsl */ `
  varying vec3 vW;
  varying float vDepth;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const GROUND_FRAG = /* glsl */ `
  ${GLSL_COMMON}
  void main() {
    // Planta baixa: a grade dos módulos riscada no chão, só perto da câmera.
    vec2 f = abs(fract(vW.xz) - 0.5);
    float line = max(step(0.47, f.x), step(0.47, f.y));
    float inside = step(max(abs(vW.x), abs(vW.z)), ${(HALF + 3).toFixed(1)});
    float near = smoothstep(34.0, 6.0, vDepth);
    vec3 col = uFogColor + vec3(0.96, 0.95, 0.93) * line * inside * near * 0.09 * uNight;
    col += uAccent * ring() * inside * 0.3;
    gl_FragColor = vec4(fogged(col), 1.0);
  }
`;

interface Module {
  x: number;
  z: number;
  h: number;
  dist: number;
  red: boolean;
}

/** `redWidth`: meia-largura, em módulos, do traço vermelho na diagonal. */
export function buildModules(redWidth = 1.1) {
  const list: Module[] = [];
  QR_ROWS.forEach((row, r) => {
    for (let c = 0; c < N; c++) {
      if (row[c] !== "1") continue;
      const x = c - HALF + 0.5;
      const z = r - HALF + 0.5;
      const k = hash(c, r);
      // O traço vermelho do símbolo da CbM: a diagonal que corta o QR do canto
      // de cima à esquerda até o de baixo à direita.
      const red = Math.abs(x - z) < redWidth;
      list.push({ x, z, h: red ? 2.2 + 2.4 * k : 0.5 + 4.2 * k * k, dist: Math.hypot(x, z), red });
    }
  });
  return list;
}

/** Placa do painel: quadrado na cor do tipo, número em Satoshi, nome em Panchang. */
function labelTexture(index: number, name: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = LABEL_W;
  canvas.height = LABEL_H;
  const ctx = canvas.getContext("2d")! as CanvasRenderingContext2D & { letterSpacing: string };
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);
  ctx.fillStyle = "rgba(245,242,237,0.28)";
  ctx.fillRect(0, 0, LABEL_W, 3);
  ctx.fillStyle = color;
  ctx.fillRect(30, 34, 20, 20);
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "6px";
  ctx.font = '500 26px "Satoshi", sans-serif';
  ctx.fillStyle = "rgba(245,242,237,0.72)";
  ctx.fillText(`${String(index + 1).padStart(2, "0")} / PROJETO`, 66, 45);
  ctx.letterSpacing = "0px";
  const text = name.toUpperCase();
  let px = 58;
  ctx.font = `700 ${px}px "Panchang", sans-serif`;
  const width = ctx.measureText(text).width;
  if (width > LABEL_W - 60) {
    px = Math.floor((px * (LABEL_W - 60)) / width);
    ctx.font = `700 ${px}px "Panchang", sans-serif`;
  }
  ctx.fillStyle = "#F5F2ED";
  ctx.fillText(text, 30, 120);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Scene(props: CenaProps) {
  const { covers, names, colors, accent } = props;
  const size = useThree((s) => s.size);
  const scene = useThree((s) => s.scene);
  const { textures, ready } = useCovers(covers);
  const [fontsReady, setFontsReady] = useState(false);
  const clock = useCenaClock(props, T_END, ready && fontsReady);

  const city = useRef<THREE.InstancedMesh>(null);
  const dust = useRef<THREE.PointsMaterial>(null);
  const panels = useRef<(THREE.Mesh | null)[]>([]);
  const plates = useRef<(THREE.Mesh | null)[]>([]);
  const posts = useRef<(THREE.Group | null)[]>([]);

  // O canvas 2D das placas só enxerga as fontes depois que o documento carrega.
  useEffect(() => {
    let alive = true;
    const done = () => alive && setFontsReady(true);
    Promise.all([
      document.fonts.load('700 58px "Panchang"'),
      document.fonts.load('500 26px "Satoshi"'),
    ]).then(done, done);
    return () => {
      alive = false;
    };
  }, []);

  const res = useMemo(() => {
    const modules = buildModules();
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const cityBox = box.clone();
    cityBox.setAttribute(
      "aRed",
      new THREE.InstancedBufferAttribute(
        new Float32Array(modules.map((m) => (m.red ? 1 : 0))),
        1,
      ),
    );
    // Uniformes comuns ao chão e aos prédios: o mesmo objeto nos dois.
    const shared = {
      uNight: { value: 0 },
      uRing: { value: -1 },
      uAccent: { value: new THREE.Color() },
      uFogColor: { value: new THREE.Color() },
      uFogNear: { value: 18 },
      uFogFar: { value: 62 },
    };
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (hash(i, 1) - 0.5) * 46;
      dustPos[i * 3 + 1] = 3 + hash(i, 2) * 12;
      dustPos[i * 3 + 2] = (hash(i, 3) - 0.5) * 60;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    return {
      modules,
      box,
      cityBox,
      dustGeo,
      plane: new THREE.PlaneGeometry(1, 1),
      shared,
      cityMat: new THREE.ShaderMaterial({
        vertexShader: CITY_VERT,
        fragmentShader: CITY_FRAG,
        uniforms: { ...shared, uWin: { value: 0 } },
      }),
      groundMat: new THREE.ShaderMaterial({
        vertexShader: GROUND_VERT,
        fragmentShader: GROUND_FRAG,
        uniforms: shared,
      }),
      panelMats: PANELS.map(
        () => new THREE.MeshBasicMaterial({ color: "#000000", toneMapped: false, fog: false }),
      ),
      plateMats: PANELS.map(
        () => new THREE.MeshBasicMaterial({ color: "#000000", toneMapped: false, fog: false }),
      ),
      work: {
        m: new THREE.Matrix4(),
        c: new THREE.Color(),
        red: new THREE.Color(),
        bg: new THREE.Color(),
        pos: new THREE.Vector3(),
        look: new THREE.Vector3(),
        a: new THREE.Vector3(),
        b: new THREE.Vector3(),
      },
    };
  }, []);

  useEffect(
    () => () => {
      res.box.dispose();
      res.cityBox.dispose();
      res.dustGeo.dispose();
      res.plane.dispose();
      res.cityMat.dispose();
      res.groundMat.dispose();
      res.panelMats.forEach((m) => m.dispose());
      res.plateMats.forEach((m) => m.dispose());
    },
    [res],
  );

  // Os painéis mostram as capas de trás pra frente: o do mergulho é a primeira.
  const count = Math.max(1, covers.length);

  useEffect(() => {
    // MeshBasicMaterial converte cor na saída: aqui a capa precisa ser sRGB.
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (tex.image) tex.needsUpdate = true;
    });
    PANELS.forEach((_, i) => {
      res.panelMats[i].map = textures[(PANELS.length - 1 - i) % count] ?? null;
      res.panelMats[i].needsUpdate = true;
    });
  }, [ready, res, textures, count]);

  useEffect(() => {
    if (!fontsReady) return;
    const made = PANELS.map((_, i) => {
      const k = (PANELS.length - 1 - i) % count;
      const tex = labelTexture(k, names[k] ?? "", colors[k] ?? "#F5F2ED");
      res.plateMats[i].map = tex;
      res.plateMats[i].needsUpdate = true;
      return tex;
    });
    return () => made.forEach((t) => t.dispose());
  }, [fontsReady, names, colors, res, count]);

  useFrame((state, dt) => {
    const t = clock.tick(dt);
    const { m, c, red, bg, pos, look, a, b } = res.work;
    const u = res.shared;
    const aspect = size.width / size.height;
    const portrait = aspect < 1;
    // Em pé a tela é estreita: o voo e os painéis fecham pro meio.
    const squeeze = Math.max(0.42, Math.min(1, aspect * 0.85));
    const panelAspect = portrait ? PANEL_ASPECT_PORTRAIT : PANEL_ASPECT;
    const panelScale = portrait ? PANEL_SCALE_PORTRAIT : 1;
    const lift = portrait ? PANEL_LIFT_PORTRAIT : 0;
    const rise = span(t, T_RISE, T_FLY);
    const night = easeInOut(span(t, T_RISE + 0.1, T_FLY - 0.2));
    const fly = easeInOut(span(t, T_FLY, T_DIVE));
    const dive = easeInCubic(span(t, T_DIVE, T_END));
    const down = easeInOut(rise);

    clock.phase(t < T_RISE ? "scan" : t < T_FLY ? "rise" : t < T_DIVE ? "fly" : "dive");

    // ── Papel vira noite ─────────────────────────────────────────────
    bg.copy(PAPER).lerp(NIGHT, night);
    (scene.background as THREE.Color).copy(bg);
    // Os shaders devolvem sRGB cru: as cores vão pra eles já convertidas.
    u.uFogColor.value.copy(bg).convertLinearToSRGB();
    u.uAccent.value.set(accent).convertLinearToSRGB();
    u.uNight.value = night;
    // O anel acompanha a frente em que os módulos estão subindo.
    u.uRing.value = rise > 0 && rise < 1 ? rise * 1.9 * 26 - 3 : -1;
    res.cityMat.uniforms.uWin.value = span(t, T_FLY - 0.7, T_FLY + 0.9);
    if (dust.current) dust.current.opacity = 0.5 * night * (1 - dive);

    // ── Módulos ──────────────────────────────────────────────────────
    const mesh = city.current;
    if (mesh) {
      red.set(accent);
      res.modules.forEach((mod, i) => {
        // A altura nasce do centro pra fora, com um repique no fim.
        const g = clamp01((rise * 1.9 - mod.dist / 26) / 0.9);
        const grow = g <= 0 ? 0 : 1 - Math.pow(1 - g, 3) * Math.cos(g * 7);
        const foot = 1 - 0.1 * night;
        m.makeScale(foot, Math.max(0.02, mod.h * grow), foot);
        m.setPosition(mod.x, 0, mod.z);
        mesh.setMatrixAt(i, m);
        c.copy(INK)
          .lerp(mod.red ? red : CONCRETE, night)
          .convertLinearToSRGB();
        mesh.setColorAt(i, c);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // ── Painéis: sobem com a cidade e acendem piscando ──────────────
    PANELS.forEach((p, i) => {
      const on = span(t, T_FLY - 0.1 + i * 0.2, T_FLY + 0.4 + i * 0.2);
      const flick = on <= 0 ? 0 : on < 1 ? (Math.sin(on * 40) > -0.2 ? on : on * 0.25) : 1;
      res.panelMats[i].color.setScalar(flick);
      res.plateMats[i].color.setScalar(flick);
      const isLast = i === PANELS.length - 1;
      // Em pé os painéis do caminho ficam menores e mais baixos que o do fim.
      const w = p.w * panelScale * (portrait && !isLast ? 0.8 : 1);
      const h = w / panelAspect;
      panels.current[i]?.scale.set(w, h, 1);
      const plate = plates.current[i];
      if (plate) {
        const ph = (w * LABEL_H) / LABEL_W;
        plate.scale.set(w, ph, 1);
        plate.position.set(0, -h / 2 - ph / 2 - 0.14, 0);
      }
      // As capas são altas: o painel mostra só o topo delas.
      const map = res.panelMats[i].map;
      if (map) {
        const keep = Math.min(1, aspectOf(map) / panelAspect);
        map.repeat.set(1, keep);
        map.offset.set(0, 1 - keep);
      }
      const post = posts.current[i];
      if (post) {
        // Sobem por último, um depois do outro: na descida da câmera ainda
        // não existem, senão tapam a cidade nascendo.
        const up = easeOutCubic(span(t, T_FLY - 0.55 + i * 0.12, T_FLY + 0.15 + i * 0.12));
        post.visible = up > 0;
        post.position.set(p.at[0] * squeeze, (p.at[1] + (isLast ? lift : 0)) * up, p.at[2]);
        post.rotation.y = p.ry * squeeze;
      }
    });

    // ── Câmera ───────────────────────────────────────────────────────
    // De cima: longe o bastante pro QR inteiro caber na tela.
    const top = (N * 1.3) / (2 * Math.tan((FOV * Math.PI) / 360) * Math.min(1, aspect));
    const last = PANELS[PANELS.length - 1];
    const lastY = last.at[1] + lift;
    // De cima a névoa fica além do chão, senão ela apaga o QR.
    u.uFogNear.value = top * 2 + (18 - top * 2) * down;
    u.uFogFar.value = top * 3 + (62 - top * 3) * down;

    PATH.getPoint(fly, a);
    a.x *= squeeze;
    if (portrait) {
      a.y += lift * fly;
      a.z += PULLBACK_PORTRAIT * fly;
    }
    pos.set(0, top, 0.01).lerp(a, down);
    // No mergulho ele vai reto pro painel, até a capa passar da tela.
    b.set(last.at[0] * squeeze, lastY, last.at[2] + 2.2);
    pos.lerp(b, dive);

    look.set(0, 0, 0).lerp(a.set(0, 2.5, 0), down);
    // Durante o voo ele mira um pouco abaixo do centro: a placa entra no quadro.
    b.set(last.at[0] * squeeze, lastY - 0.5, last.at[2]);
    look.lerp(b, easeInOut(span(fly, 0.15, 1)));
    b.y = lastY;
    look.lerp(b, dive);

    state.camera.position.copy(pos);
    state.camera.up.set(0, 1, 0);
    state.camera.lookAt(look);
    // Curva inclinada: o horizonte tomba um pouco enquanto ele vira.
    state.camera.rotateZ(0.09 * Math.sin(fly * Math.PI * 2) * (1 - dive));

    clock.cue(t > T_DIVE - 0.5 ? 0 : -1);
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={res.groundMat}>
        <planeGeometry args={[400, 400]} />
      </mesh>
      <instancedMesh
        ref={city}
        args={[res.cityBox, res.cityMat, res.modules.length]}
        frustumCulled={false}
      />
      <points geometry={res.dustGeo} frustumCulled={false}>
        <pointsMaterial
          ref={dust}
          color="#F5F2ED"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          fog={false}
        />
      </points>
      {PANELS.map((p, i) => (
        <group
          key={i}
          ref={(el) => {
            posts.current[i] = el;
          }}
          visible={false}
        >
          <mesh
            ref={(el) => {
              panels.current[i] = el;
            }}
            geometry={res.plane}
            material={res.panelMats[i]}
          >
            {/* Moldura: herda a escala do painel. */}
            <mesh geometry={res.box} position={[0, -0.53, -0.2]} scale={[1.04, 1.06, 0.3]}>
              <meshBasicMaterial color="#0d0d0e" />
            </mesh>
          </mesh>
          <mesh
            ref={(el) => {
              plates.current[i] = el;
            }}
            geometry={res.plane}
            material={res.plateMats[i]}
          />
          {/* Poste: desce além do chão, pra servir nas duas alturas. */}
          <mesh
            geometry={res.box}
            position={[0, -p.at[1] - 3, -0.4]}
            scale={[0.7, p.at[1] + 3, 0.5]}
          >
            <meshBasicMaterial color="#0d0d0e" />
          </mesh>
        </group>
      ))}
    </>
  );
}

/**
 * 7 · Cidade-QR.
 *
 * Abre com o QR do cartão (os módulos reais, de `data/cartao.ts`) visto de
 * cima, chapado no papel, com a mira de leitura por cima. A câmera desce, o
 * papel escurece e cada módulo ganha altura: o QR vira uma cidade, cortada na
 * diagonal pelo traço vermelho do símbolo. As janelas acendem, o voo passa por
 * três painéis com capa e placa de cada projeto e mergulha no último.
 */
export default function CidadeScene(props: CenaProps) {
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: FOV, near: 0.1, far: 160 }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#F4F0E6"]} />
      <ReleaseContext />
      <Scene {...props} />
    </Canvas>
  );
}
