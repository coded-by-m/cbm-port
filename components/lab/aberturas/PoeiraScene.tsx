"use client";

import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ReleaseContext } from "@/components/three/ReleaseContext";
import { aspectOf, crop, hash, span, useCenaClock, useCovers, type CenaProps } from "./cena";

/**
 * Linha do tempo, em segundos. É AQUI que se ajusta o ritmo.
 *
 *   0 ........ T_LOGO   a poeira se junta no símbolo
 *   T_LOGO ... T_FIRST  o símbolo respira
 *   depois, pra cada capa: SWAP de revoada + HOLD parado
 *   por fim OUT: a poeira assenta e a página aparece
 */
const T_LOGO = 1.0;
const T_FIRST = 1.5;
const SWAP = 0.9;
const HOLD = 0.6;
const OUT = 0.7;
/** Quanto do OUT já passou quando a página começa a aparecer. */
const END_AT = 0.3;

const CAM_Z = 5;
const FOV = 40;
const VIEW_H = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360);

/** O símbolo do cartão, em unidades do viewBox 142×161: [x1, y1, x2, y2, vermelho]. */
const LOGO: [number, number, number, number, number][] = [
  [11.5, 148, 11.5, 59, 0],
  [11.5, 59, 53.5, 104.4, 0],
  [130.5, 103, 130.5, 19, 0],
  [130.5, 19, 85.5, 67.3, 0],
  [9.5, 18, 130.5, 147, 1],
];
const LOGO_LEN = LOGO.map(([a, b, c, d]) => Math.hypot(c - a, d - b));
const LOGO_TOTAL = LOGO_LEN.reduce((s, l) => s + l, 0);

const VERT = /* glsl */ `
  attribute vec2 aUv;
  attribute vec3 aLogo;
  attribute vec4 aRnd;

  uniform float uTime;
  uniform float uForm;
  uniform float uToImg;
  uniform float uSwap;
  uniform float uOut;
  uniform vec2 uPlane;
  uniform float uLogoH;
  uniform float uPx;
  uniform vec3 uAccent;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec4 uCropA;
  uniform vec4 uCropB;

  varying vec3 vCol;
  varying float vAlpha;

  const float PI = 3.14159265;

  // Progresso próprio de cada grão: o atraso "d" é o que faz a troca correr
  // pela imagem em vez de acontecer de uma vez.
  float stag(float u, float d, float spread) {
    float t = clamp(u * (1.0 + spread) - d * spread, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    vec3 grid = vec3((aUv - 0.5) * uPlane, 0.0);
    vec3 logo = vec3((aLogo.x - 71.0) / 161.0, -(aLogo.y - 80.5) / 161.0, 0.0) * uLogoH;
    logo.z = (aRnd.w - 0.5) * 0.12;
    vec3 scatter = (aRnd.yzw - 0.5) * vec3(7.0, 9.0, 6.0);

    float sweep = aUv.x * 0.6 + aRnd.x * 0.4;
    float lf = stag(uForm, aRnd.x, 0.9);
    float li = stag(uToImg, sweep, 1.2);
    float ls = stag(uSwap, sweep, 1.2);
    float lo = stag(uOut, (1.0 - aUv.y) * 0.7 + aRnd.x * 0.3, 1.0);

    vec3 p = mix(scatter, logo, lf);
    p = mix(p, grid, li);

    // Revoada: no meio da troca cada grão sai do lugar, gira e volta.
    float burst = sin(PI * li) + sin(PI * ls);
    vec3 dir = (aRnd.yzw - 0.5) * vec3(1.6, 1.6, 2.4) + vec3(-grid.y, grid.x, 0.0) * 0.45;
    dir.x += 0.7;
    p += dir * burst * uPlane.x * 0.3;

    // Parado, ele ainda respira.
    p.xy += 0.006 * vec2(sin(uTime * 1.3 + aRnd.y * 6.28), cos(uTime * 1.1 + aRnd.z * 6.28));

    // Saída: assenta de baixo pra cima, feito poeira caindo.
    p.y -= lo * lo * uPlane.y * 0.8;
    p.x += (aRnd.y - 0.5) * lo * 0.7;

    vec3 logoCol = mix(vec3(0.77, 0.79, 0.80), uAccent, aLogo.z);
    vec3 a = texture2D(uTexA, aUv * uCropA.xy + uCropA.zw).rgb;
    vec3 b = texture2D(uTexB, aUv * uCropB.xy + uCropB.zw).rgb;
    vec3 col = mix(logoCol, a, li);
    col = mix(col, b, ls);
    // No voo o grão clareia um pouco: é o que deixa a revoada visível.
    vCol = col + burst * 0.16;
    vAlpha = smoothstep(0.0, 0.35, uForm) * (0.35 + 0.65 * lf) * (1.0 - lo);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPx * (1.0 + burst * 0.5) * (${CAM_Z.toFixed(1)} / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.36, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vCol, a);
  }
`;

function Scene(props: CenaProps) {
  const { covers, accent } = props;
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const portrait = size.width < size.height;
  const { textures, ready } = useCovers(covers);
  const n = covers.length;
  const tOut = T_FIRST + n * (SWAP + HOLD);
  const clock = useCenaClock(props, tOut + OUT * END_AT, ready);

  // A imagem ocupa uma moldura 4:5 em pé e 16:10 deitado.
  const frame = portrait ? 0.8 : 1.6;
  const cols = portrait ? 150 : 256;
  const rows = Math.round(cols / frame);

  const geometry = useMemo(() => {
    const count = cols * rows;
    const uv = new Float32Array(count * 2);
    const logo = new Float32Array(count * 3);
    const rnd = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      uv[i * 2] = ((i % cols) + 0.5) / cols;
      uv[i * 2 + 1] = (Math.floor(i / cols) + 0.5) / rows;
      for (let k = 0; k < 4; k++) rnd[i * 4 + k] = hash(i, k + 1);

      // Um ponto qualquer dentro do traço do símbolo.
      let pick = hash(i, 7) * LOGO_TOTAL;
      let s = 0;
      while (s < LOGO.length - 1 && pick > LOGO_LEN[s]) pick -= LOGO_LEN[s++];
      const [x1, y1, x2, y2, red] = LOGO[s];
      const t = pick / LOGO_LEN[s];
      const r = 4.5 * Math.sqrt(hash(i, 8));
      const a = hash(i, 9) * Math.PI * 2;
      logo[i * 3] = x1 + (x2 - x1) * t + r * Math.cos(a);
      logo[i * 3 + 1] = y1 + (y2 - y1) * t + r * Math.sin(a);
      logo[i * 3 + 2] = red;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aUv", new THREE.BufferAttribute(uv, 2));
    g.setAttribute("aLogo", new THREE.BufferAttribute(logo, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 4));
    return g;
  }, [cols, rows]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uForm: { value: 0 },
          uToImg: { value: 0 },
          uSwap: { value: 0 },
          uOut: { value: 0 },
          uPlane: { value: new THREE.Vector2(1, 1) },
          uLogoH: { value: 1 },
          uPx: { value: 2 },
          uAccent: { value: new THREE.Color() },
          uTexA: { value: null },
          uTexB: { value: null },
          uCropA: { value: new THREE.Vector4(1, 1, 0, 0) },
          uCropB: { value: new THREE.Vector4(1, 1, 0, 0) },
        },
      }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, dt) => {
    const t = clock.tick(dt);
    const u = material.uniforms;
    const viewW = VIEW_H * (size.width / size.height);
    const planeW = portrait ? viewW * 0.88 : VIEW_H * 0.62 * frame;

    u.uTime.value = t;
    u.uPlane.value.set(planeW, planeW / frame);
    u.uLogoH.value = Math.min((viewW * 0.6 * 161) / 142, VIEW_H * 0.36);
    u.uPx.value = ((planeW / viewW) * size.width * dpr * 1.6) / cols;
    // sRGB cru, igual às capas: o shader não converte cor.
    u.uAccent.value.set(accent).convertLinearToSRGB();
    u.uForm.value = span(t, 0, T_LOGO);
    u.uToImg.value = span(t, T_FIRST, T_FIRST + SWAP);
    u.uOut.value = span(t, tOut, tOut + OUT);

    // Troca em curso: de qual capa pra qual.
    const k = Math.max(0, Math.min(n - 1, Math.floor((t - T_FIRST) / (SWAP + HOLD))));
    const p = k === 0 ? 1 : span(t, T_FIRST + k * (SWAP + HOLD), T_FIRST + k * (SWAP + HOLD) + SWAP);
    const from = textures[p < 1 ? k - 1 : k];
    const to = textures[k];
    u.uSwap.value = p < 1 ? p : 0;
    u.uTexA.value = from;
    u.uTexB.value = to;
    crop(u.uCropA.value, aspectOf(from), frame);
    crop(u.uCropB.value, aspectOf(to), frame);

    const shown = k === 0 ? u.uToImg.value : p;
    clock.cue(t < T_FIRST || t >= tOut ? -1 : shown > 0.5 ? k : k - 1);

    state.camera.position.set(0.18 * Math.sin(t * 0.55), 0.08 * Math.sin(t * 0.4), CAM_Z);
    state.camera.lookAt(0, 0, 0);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/**
 * 6 · Poeira.
 *
 * Uma nuvem de grãos se junta no símbolo do cartão, se desfaz e se reorganiza
 * nas capas dos projetos, uma por vez, cada troca como uma revoada.
 *
 * Todo o movimento está no vertex shader: o JS só manda os progressos de cada
 * fase. São 28 mil grãos em pé e 41 mil deitado, sem custo de CPU por grão.
 */
export default function PoeiraScene(props: CenaProps) {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: FOV, near: 0.1, far: 40, position: [0, 0, CAM_Z] }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#060606"]} />
      <ReleaseContext />
      <Scene {...props} />
    </Canvas>
  );
}
