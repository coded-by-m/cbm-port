"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ReleaseContext } from "@/components/three/ReleaseContext";
import {
  aspectOf,
  crop,
  easeInCubic,
  easeInOut,
  easeOutCubic,
  span,
  useCenaClock,
  useCovers,
  type CenaProps,
} from "./cena";

/**
 * Linha do tempo, em segundos. É AQUI que se ajusta o ritmo.
 *
 *   0 ........ T_FILL   os anéis entram girando, letra off-white
 *   T_FILL ... depois   as letras viram janela: uma capa por vez (COVER cada)
 *   por fim PUSH: a câmera atravessa a parede de letras
 */
const T_FILL = 0.9;
const COVER = 0.95;
const FADE = 0.32;
const PUSH = 0.8;
/** Quanto do PUSH já passou quando a página começa a aparecer. */
const END_AT = 0.6;

const FOV = 40;
const RADIUS = 5;
const RING_H = 0.62;
const RING_GAP = 0.07;
const RINGS = 13;
/** Altura do canvas de cada faixa de texto. */
const TEXT_H = 256;
const TEXT_MAX_W = 4096;

const VERT = /* glsl */ `
  uniform float uRepeat;
  varying vec2 vUv;
  void main() {
    vUv = vec2(uv.x * uRepeat, uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uText;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec4 uCropA;
  uniform vec4 uCropB;
  uniform vec2 uRes;
  uniform float uMix;
  uniform float uFill;
  uniform float uAlpha;
  varying vec2 vUv;

  void main() {
    float mask = texture2D(uText, vUv).r;
    float a = mask * uAlpha;
    if (a < 0.02) discard;

    // A capa não está colada no anel: está parada na tela, e as letras são a
    // janela que passa por cima dela.
    vec2 s = gl_FragCoord.xy / uRes;
    vec3 ca = texture2D(uTexA, s * uCropA.xy + uCropA.zw).rgb;
    vec3 cb = texture2D(uTexB, s * uCropB.xy + uCropB.zw).rgb;
    vec3 cover = mix(ca, cb, uMix);
    vec3 paper = vec3(0.96, 0.95, 0.93);

    // O lado de trás do cilindro aparece pelos vãos, bem mais apagado.
    vec3 col = gl_FrontFacing ? mix(paper, cover, uFill * 0.86) : paper * 0.13;
    gl_FragColor = vec4(col, a);
  }
`;

/** Uma faixa de texto que emenda nela mesma: branco no preto. */
function textTexture(text: string) {
  const font = `800 ${Math.round(TEXT_H * 0.72)}px "Panchang", sans-serif`;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width);
  const k = Math.min(1, TEXT_MAX_W / width);
  canvas.width = Math.round(width * k);
  canvas.height = Math.round(TEXT_H * k);
  ctx.scale(k, k);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, TEXT_H);
  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, TEXT_H * 0.54);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: width / TEXT_H };
}

function Scene(props: CenaProps) {
  const { covers, names } = props;
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const { textures, ready } = useCovers(covers);
  const [fontReady, setFontReady] = useState(false);
  const n = covers.length;
  const tPush = T_FILL + n * COVER;
  const clock = useCenaClock(props, tPush + PUSH * END_AT, ready && fontReady);
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  // O canvas 2D só enxerga a Panchang depois que o documento a carregou.
  useEffect(() => {
    let alive = true;
    const done = () => alive && setFontReady(true);
    document.fonts.load('800 100px "Panchang"').then(done, done);
    return () => {
      alive = false;
    };
  }, []);

  const res = useMemo(() => {
    if (!fontReady) return null;
    const geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, RING_H, 128, 1, true);
    const shared = {
      uTexA: { value: null as THREE.Texture | null },
      uTexB: { value: null as THREE.Texture | null },
      uCropA: { value: new THREE.Vector4(1, 1, 0, 0) },
      uCropB: { value: new THREE.Vector4(1, 1, 0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMix: { value: 0 },
      uFill: { value: 0 },
    };
    const strips = names.map((name) => textTexture(`${name.toUpperCase()}  —  `));
    const rings = Array.from({ length: RINGS }, (_, i) => {
      const strip = strips[i % strips.length];
      // Quantas vezes a faixa dá a volta: arredonda pra emendar sem costura.
      const repeat = Math.max(1, Math.round((2 * Math.PI * RADIUS) / (strip.aspect * RING_H)));
      return new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          ...shared,
          uText: { value: strip.tex },
          uRepeat: { value: repeat },
          uAlpha: { value: 0 },
        },
      });
    });
    return { geometry, shared, strips, rings };
  }, [fontReady, names]);

  useEffect(
    () => () => {
      res?.geometry.dispose();
      res?.strips.forEach((s) => s.tex.dispose());
      res?.rings.forEach((m) => m.dispose());
    },
    [res],
  );

  useFrame((state, dt) => {
    const t = clock.tick(dt);
    if (!res) return;
    const portrait = size.width < size.height;
    const screen = size.width / size.height;
    const u = res.shared;

    // Capa em curso e a anterior, com uma passagem curta entre elas.
    const k = Math.max(0, Math.min(n - 1, Math.floor((t - T_FILL) / COVER)));
    const from = textures[Math.max(0, k - 1)];
    const to = textures[k];
    u.uTexA.value = from;
    u.uTexB.value = to;
    crop(u.uCropA.value, aspectOf(from), screen);
    crop(u.uCropB.value, aspectOf(to), screen);
    u.uMix.value = k === 0 ? 1 : easeInOut(span(t, T_FILL + k * COVER, T_FILL + k * COVER + FADE));
    u.uFill.value = easeInOut(span(t, T_FILL - 0.25, T_FILL + 0.35));
    u.uRes.value.set(size.width * dpr, size.height * dpr);

    const push = easeInCubic(span(t, tPush, tPush + PUSH));
    res.rings.forEach((mat, i) => {
      mat.uniforms.uAlpha.value = span(t, i * 0.05, 0.45 + i * 0.05);
      const mesh = meshes.current[i];
      if (!mesh) return;
      const dir = i % 2 === 0 ? 1 : -1;
      // Entra rápido e freia; no fim acelera de novo, junto com a câmera.
      const spin = 1.7 * easeOutCubic(span(t, 0, 1.3)) + 0.2 * t + 0.9 * push;
      mesh.rotation.y = dir * spin + i * 0.7;
    });

    if (group.current) {
      group.current.rotation.set(0.1 + 0.03 * Math.sin(t * 0.7), 0, -0.13);
    }

    const far = RADIUS + (portrait ? 9 : 6.5);
    state.camera.position.set(0, 0, far + (RADIUS - 1.5 - far) * push);
    state.camera.lookAt(0, 0, 0);

    clock.cue(t < T_FILL || t >= tPush ? -1 : k);
  });

  if (!res) return null;
  return (
    <group ref={group}>
      {res.rings.map((mat, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          geometry={res.geometry}
          material={mat}
          position={[0, (i - (RINGS - 1) / 2) * (RING_H + RING_GAP), 0]}
        />
      ))}
    </group>
  );
}

/**
 * 8 · Tipografia.
 *
 * Sem objeto nenhum: os nomes dos projetos em Panchang, enrolados em anéis
 * que giram em sentidos opostos. As letras viram janela e mostram as capas,
 * uma por vez, paradas na tela enquanto o texto passa. No fim a câmera
 * atravessa a parede de letras.
 */
export default function TipoScene(props: CenaProps) {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: FOV, near: 0.1, far: 60 }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#060606"]} />
      <ReleaseContext />
      <Scene {...props} />
    </Canvas>
  );
}
