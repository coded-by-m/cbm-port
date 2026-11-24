"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ReleaseContext } from "@/components/three/ReleaseContext";

/**
 * Ponte entre o React da página e o loop do shader, sem re-render:
 * a página escreve `vel` (velocidade normalizada em [-1, 1]) e chama `kick()`
 * para pedir um frame.
 */
export interface StageBridge {
  vel: number;
  kick: () => void;
}

interface Props {
  /** Índice do projeto em cena. */
  active: number;
  /** A `<img>` já carregada da capa `i`, ou null se ainda não chegou. */
  getImage: (i: number) => HTMLImageElement | null;
  bridge: MutableRefObject<StageBridge>;
  /** Ponteiro grosso: teto de DPR menor. */
  coarse: boolean;
  /** Primeiro frame com capa desenhado. */
  onReady: () => void;
  /** Contexto WebGL perdido: a página volta pra camada DOM. */
  onLost: () => void;
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * A capa nova invade a antiga de cima pra baixo, com a borda quebrada por
 * ruído. As duas deslizam em sentidos opostos durante a troca, e a velocidade
 * do scroll/ponteiro entorta o plano e abre os canais RGB.
 *
 * As texturas ficam sem color space: o valor sRGB do arquivo vai direto pro
 * framebuffer, sem conversão de ida e volta.
 */
const FRAGMENT = /* glsl */ `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uProgress;
  uniform float uVel;
  uniform float uPlane;
  uniform float uAspA;
  uniform float uAspB;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // object-fit: cover, ancorado no topo (o topo do site é o que identifica).
  vec2 cover(vec2 uv, float img) {
    vec2 s = uPlane > img ? vec2(1.0, img / uPlane) : vec2(uPlane / img, 1.0);
    vec2 c = vec2((uv.x - 0.5) * s.x + 0.5, 1.0 - (1.0 - uv.y) * s.y);
    return clamp(c, 0.0, 1.0);
  }

  vec3 shot(sampler2D tex, vec2 uv, float img, float shift) {
    vec2 c = cover(uv, img);
    return vec3(
      texture2D(tex, clamp(c + vec2(shift, 0.0), 0.0, 1.0)).r,
      texture2D(tex, c).g,
      texture2D(tex, clamp(c - vec2(shift, 0.0), 0.0, 1.0)).b
    );
  }

  void main() {
    vec2 uv = vUv;
    uv.y += uVel * 0.045 * sin(uv.x * 3.14159265);

    float n = noise(uv * vec2(3.0, 4.0) + 7.0);
    float edge = (1.0 - uv.y) * 0.62 + n * 0.38;
    float m = smoothstep(edge - 0.12, edge + 0.12, uProgress * 1.24 - 0.12);
    float d = 1.0 - abs(2.0 * m - 1.0);

    float shift = uVel * 0.012 + d * 0.008;
    vec3 a = shot(uTexA, uv + vec2(0.0, -m * 0.10), uAspA, shift);
    vec3 b = shot(uTexB, uv + vec2(0.0, (1.0 - m) * 0.10), uAspB, shift);

    vec3 col = mix(a, b, m) + d * 0.05;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function Scene({ active, getImage, bridge, onReady, onLost }: Omit<Props, "coarse">) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTexA: { value: null },
          uTexB: { value: null },
          uProgress: { value: 1 },
          uVel: { value: 0 },
          uPlane: { value: 1 },
          uAspA: { value: 1 },
          uAspB: { value: 1 },
        },
      }),
    [],
  );

  const textures = useRef(new Map<number, THREE.Texture>());
  const state = useRef({ to: -1, progress: 1, vel: 0, ready: false });
  const activeRef = useRef(active);
  activeRef.current = active;
  const cbs = useRef({ getImage, onReady, onLost });
  cbs.current = { getImage, onReady, onLost };

  useEffect(() => {
    const b = bridge.current;
    b.kick = () => invalidate();
    invalidate();
    return () => {
      b.kick = () => {};
    };
  }, [bridge, invalidate]);

  useEffect(() => {
    invalidate();
  }, [active, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      cbs.current.onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl]);

  useEffect(() => {
    const map = textures.current;
    return () => {
      map.forEach((t) => t.dispose());
      map.clear();
      material.dispose();
    };
  }, [material]);

  const textureFor = (i: number) => {
    const cached = textures.current.get(i);
    if (cached) return cached;
    const img = cbs.current.getImage(i);
    if (!img) return null;
    const tex = new THREE.Texture(img);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    textures.current.set(i, tex);
    return tex;
  };

  const aspectOf = (tex: THREE.Texture) => {
    const img = tex.image as HTMLImageElement;
    return img.naturalWidth / Math.max(1, img.naturalHeight);
  };

  useFrame((three, rawDt) => {
    // Em `demand` o primeiro frame depois de um repouso traz um delta enorme.
    const dt = Math.min(rawDt, 1 / 30);
    const s = state.current;
    const u = material.uniforms;
    const target = activeRef.current;
    let busy = false;

    if (s.to === -1) {
      const tex = textureFor(target);
      if (!tex) return;
      u.uTexA.value = tex;
      u.uTexB.value = tex;
      u.uAspA.value = u.uAspB.value = aspectOf(tex);
      s.to = target;
      s.progress = 1;
    } else if (s.progress >= 1 && s.to !== target) {
      const tex = textureFor(target);
      if (tex) {
        u.uTexA.value = u.uTexB.value;
        u.uAspA.value = u.uAspB.value;
        u.uTexB.value = tex;
        u.uAspB.value = aspectOf(tex);
        s.to = target;
        s.progress = 0;
      }
    }

    if (s.progress < 1) {
      // O alvo mudou no meio da troca: termina esta depressa e a próxima
      // parte do estado atual, sem salto.
      const speed = s.to !== target ? 4.2 : 1.35;
      s.progress = Math.min(1, s.progress + dt * speed);
      busy = true;
    }
    u.uProgress.value = ease(s.progress);

    const b = bridge.current;
    s.vel += (b.vel - s.vel) * Math.min(1, dt * 9);
    b.vel *= Math.pow(0.001, dt);
    if (Math.abs(s.vel) > 0.002 || Math.abs(b.vel) > 0.002) busy = true;
    else s.vel = 0;
    u.uVel.value = s.vel;

    u.uPlane.value = three.size.width / Math.max(1, three.size.height);

    if (!s.ready) {
      s.ready = true;
      requestAnimationFrame(() => cbs.current.onReady());
    }
    if (busy) three.invalidate();
  });

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

/**
 * Camada WebGL da cena do índice: um plano só, do tamanho do canvas.
 * `frameloop="demand"`: só há frame durante troca de capa ou movimento.
 */
export default function IndexStageGL({ coarse, ...scene }: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, coarse ? 1.5 : 2]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      // O r3f liga pointer-events no wrapper; a cena é só fundo e não pode
      // ficar entre o dedo e a lista.
      style={{ pointerEvents: "none" }}
    >
      <ReleaseContext />
      <Scene {...scene} />
    </Canvas>
  );
}
