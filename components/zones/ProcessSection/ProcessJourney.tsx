"use client";

import {
  createRef,
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  IcosahedronGeometry,
  type BufferGeometry as TBufferGeometry,
  type Group,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
  OctahedronGeometry,
  type Points,
  TetrahedronGeometry,
  Vector3,
} from "three";
import type { Line2 } from "three-stdlib";
import TerrainLayer from "@/components/zones/TerrainMesh/TerrainLayer";
import { useCursorHover } from "@/components/zones/TerrainMesh/useCursorHover";
import { LAYERS, FOG } from "@/components/zones/TerrainMesh/config";
import { APEX_PULSE, FRAGMENT_VISUAL } from "@/components/zones/ProjectLandscape/config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (x: number) => x * x * (3 - 2 * x);
const TWO_PI = Math.PI * 2;

const colorBase = new Color(FRAGMENT_VISUAL.nodeColor);
const colorActive = new Color(FRAGMENT_VISUAL.apexColor);
const colorScratch = new Color();

/** X de cada estação. A câmera passa exatamente por cada uma. */
const STATION_X = [-12, -4, 4, 12];
const STATION_Y = 0.7;
const LINE_Y = 0.3;
const STATION_SCALE = 1.0;
const N = STATION_X.length;

/**
 * 4 formas distintas — progressão de complexidade que ecoa o método:
 * Estratégia (tetraedro) → Design (octaedro) → Código (prisma) →
 * Resultado (icosaedro).
 */
function makeShape(index: number): TBufferGeometry {
  switch (index) {
    case 0:
      return new TetrahedronGeometry(0.95);
    case 1:
      return new OctahedronGeometry(0.98);
    case 2:
      return new CylinderGeometry(0.9, 0.9, 1.7, 3);
    default:
      return new IcosahedronGeometry(0.92);
  }
}

interface StationGeometry {
  edges: EdgesGeometry;
  vertices: Vector3[];
  apexIndex: number;
  /** Sequência de vértices que percorre todas as arestas (pro edge-pulse). */
  edgePath: Vector3[];
}

const round3 = (v: number) => v.toFixed(3);

/** Wireframe + vértices únicos + apex + caminho de arestas pro pulse. */
function buildStationGeometry(index: number): StationGeometry {
  const base = makeShape(index);
  const edges = new EdgesGeometry(base);

  const pos = base.attributes.position;
  const seen = new Map<string, number>();
  const vertices: Vector3[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${round3(x)},${round3(y)},${round3(z)}`;
    if (!seen.has(key)) {
      seen.set(key, vertices.length);
      vertices.push(new Vector3(x, y, z));
    }
  }
  base.dispose();

  let apexIndex = 0;
  vertices.forEach((v, i) => {
    if (v.y > vertices[apexIndex].y) apexIndex = i;
  });

  // Pares de arestas (índices de vértice) a partir do EdgesGeometry.
  const ep = edges.attributes.position;
  const pairs: [number, number][] = [];
  for (let i = 0; i < ep.count; i += 2) {
    const aKey = `${round3(ep.getX(i))},${round3(ep.getY(i))},${round3(ep.getZ(i))}`;
    const bKey = `${round3(ep.getX(i + 1))},${round3(ep.getY(i + 1))},${round3(ep.getZ(i + 1))}`;
    const a = seen.get(aKey);
    const b = seen.get(bKey);
    if (a !== undefined && b !== undefined) pairs.push([a, b]);
  }

  // Greedy walk: percorre arestas seguindo vértices conectados (minimiza
  // saltos). Resultado é um caminho contínuo cobrindo toda a malha.
  const adj: { ei: number; to: number }[][] = vertices.map(() => []);
  pairs.forEach(([a, b], ei) => {
    adj[a].push({ ei, to: b });
    adj[b].push({ ei, to: a });
  });
  const used = new Array(pairs.length).fill(false);
  const pathIdx: number[] = [0];
  let cur = 0;
  let remaining = pairs.length;
  while (remaining > 0) {
    let next = adj[cur].find((e) => !used[e.ei]);
    if (!next) {
      const ei = used.findIndex((u) => !u);
      if (ei < 0) break;
      cur = pairs[ei][0];
      pathIdx.push(cur);
      next = { ei, to: pairs[ei][1] };
    }
    used[next.ei] = true;
    remaining--;
    cur = next.to;
    pathIdx.push(cur);
  }
  const edgePath = pathIdx.map((i) => vertices[i]);

  return { edges, vertices, apexIndex, edgePath };
}

/**
 * Jornada 3D da Seção Processo.
 *
 * 4 formas trianguladas distintas em linha sobre o terreno. A câmera desliza
 * com leve dwell; a estação ativa acende. Tetraedros 3D animados percorrem as
 * arestas de cada forma (eco do Landscape) e a linha de energia que conecta
 * as estações — fio condutor da passagem de uma etapa pra outra.
 */
export default function ProcessJourney({
  progressRef,
  scrollingRef,
}: {
  progressRef: MutableRefObject<number>;
  scrollingRef: MutableRefObject<boolean>;
}) {
  // Progresso amortecido — todos os consumidores leem este, não o scroll cru.
  // Glide suave mesmo com scroll picado (jerky).
  const smoothRef = useRef(0);

  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [STATION_X[0], 2.2, 10.5], fov: 46 }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={[FOG.color, 14, 42]} />

      <Terrain />

      <ProgressSmoother source={progressRef} target={smoothRef} />
      <Particles />
      <CameraRig progressRef={smoothRef} />
      <EnergyLine progressRef={smoothRef} scrollingRef={scrollingRef} />

      {STATION_X.map((x, i) => (
        <Station key={i} index={i} x={x} progressRef={smoothRef} />
      ))}
    </Canvas>
  );
}

/**
 * Terreno da marca + hover sutil: o relevo se eleva levemente sob o cursor
 * (mesmo useCursorHover da Paisagem). Escala fixa 1 (sem fit responsivo).
 */
function Terrain() {
  const scaleRef = useRef(1);
  const hoverRef = useCursorHover(scaleRef);
  return (
    <>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} hoverRef={hoverRef} />
      ))}
    </>
  );
}

/**
 * Amortece o progresso do scroll: target persegue source com lerp por frame
 * (~0.6s pra assentar). Fonte única de suavidade pra toda a cena.
 */
function ProgressSmoother({
  source,
  target,
}: {
  source: MutableRefObject<number>;
  target: MutableRefObject<number>;
}) {
  useFrame((_, delta) => {
    target.current += (source.current - target.current) * Math.min(1, delta * 2);
  });
  return null;
}

/**
 * Câmera desliza com dwell SUAVE (blend linear↔smoothstep) — flui contínuo,
 * sem travar/parar duro entre estações. Push-in leve ao centralizar.
 */
function CameraRig({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const camera = useThree((s) => s.camera);
  useFrame((_, delta) => {
    const p = clamp01(progressRef.current);
    const sf = p * (N - 1);
    const seg = Math.min(N - 2, Math.floor(sf));
    const frac = sf - seg;
    // Dwell suave: mistura linear com smoothstep (45%) → assenta sem parar.
    const eased = lerp(frac, smoothstep(frac), 0.45);
    const dwellFloat = seg + eased;

    const wantX = lerp(STATION_X[seg], STATION_X[seg + 1], eased);
    const nearest = Math.round(dwellFloat);
    const nearFocus = clamp01(1 - Math.abs(dwellFloat - nearest) / 0.5);
    const wantZ = lerp(10.5, 9.0, nearFocus);

    const k = Math.min(1, delta * 3.5);
    camera.position.x += (wantX - camera.position.x) * k;
    camera.position.z += (wantZ - camera.position.z) * k;
    camera.lookAt(camera.position.x, 0.8, 0);
  });
  return null;
}

/** focus (0..1) de quão centralizada está a etapa, dado o progress. */
function stationFocus(p: number, center: number) {
  return clamp01(1 - Math.abs(p - center) / (1 / (N - 1)));
}

/**
 * Uma estação. Ativa → wireframe brilha, apex vermelho pulsa, forma cresce
 * sutil, e o tetraedro que percorre as arestas acelera e fica vermelho.
 */
function Station({
  index,
  x,
  progressRef,
}: {
  index: number;
  x: number;
  progressRef: MutableRefObject<number>;
}) {
  const geo = useMemo(() => buildStationGeometry(index), [index]);
  useEffect(() => () => geo.edges.dispose(), [geo]);

  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const wireMatRef = useRef<LineBasicMaterial>(null);
  const nodeMatRefs = useMemo(
    () => geo.vertices.map(() => createRef<MeshBasicMaterial>()),
    [geo],
  );
  const apexRef = useRef<Mesh>(null);
  const elapsed = useRef(0);
  const focusSmooth = useRef(0);

  const center = index / (N - 1);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = clamp01(progressRef.current);

    focusSmooth.current = lerp(
      focusSmooth.current,
      stationFocus(p, center),
      Math.min(1, delta * 4),
    );
    const f = focusSmooth.current;

    if (wireMatRef.current) {
      wireMatRef.current.opacity = lerp(
        0.18,
        FRAGMENT_VISUAL.edgeHighlightOpacity,
        f,
      );
    }

    const nodeOp = lerp(0.28, FRAGMENT_VISUAL.nodeNormalOpacity + 0.2, f);
    nodeMatRefs.forEach((ref, i) => {
      const mat = ref.current;
      if (!mat) return;
      if (i === geo.apexIndex) {
        const pulse =
          1 +
          Math.sin(t * (TWO_PI / APEX_PULSE.idlePeriod)) *
            APEX_PULSE.idleAmplitude *
            f;
        mat.opacity = lerp(0.3, 1, f);
        if (apexRef.current) apexRef.current.scale.setScalar(pulse);
      } else {
        mat.opacity = nodeOp;
      }
    });

    if (innerRef.current) {
      innerRef.current.rotation.y = t * (TWO_PI / 48) * (1 + f * 0.5);
      innerRef.current.scale.setScalar(lerp(1, 1.16, f));
    }
    if (groupRef.current) {
      groupRef.current.position.y = STATION_Y + Math.sin(t * 0.6 + index) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[x, STATION_Y, 0]} scale={STATION_SCALE}>
      <group ref={innerRef} rotation={[0.35, 0, 0.12]}>
        <lineSegments geometry={geo.edges}>
          <lineBasicMaterial
            ref={wireMatRef}
            color={FRAGMENT_VISUAL.edgeColor}
            transparent
            opacity={0.18}
            depthWrite={false}
            depthTest={false}
          />
        </lineSegments>

        {geo.vertices.map((vertex, i) => {
          const isApex = i === geo.apexIndex;
          return (
            <mesh
              key={`node-${i}`}
              position={vertex}
              ref={isApex ? apexRef : undefined}
            >
              <icosahedronGeometry args={[isApex ? 0.06 : 0.04, 1]} />
              <meshBasicMaterial
                ref={nodeMatRefs[i]}
                color={
                  isApex ? FRAGMENT_VISUAL.apexColor : FRAGMENT_VISUAL.nodeColor
                }
                transparent
                opacity={0.3}
                depthWrite={false}
                depthTest={false}
              />
            </mesh>
          );
        })}

        {/* Tetraedro 3D percorrendo as arestas (eco do Landscape) */}
        <EdgePulse path={geo.edgePath} progressRef={progressRef} center={center} />
      </group>
    </group>
  );
}

/**
 * Mini-tetraedro 3D percorrendo as arestas da forma. Mesma linguagem do
 * FragmentEdgePulse do Landscape: volumétrico, gira em 3 eixos, additive,
 * off-white → vermelho e mais rápido quando a etapa está ativa.
 */
function EdgePulse({
  path,
  progressRef,
  center,
}: {
  path: Vector3[];
  progressRef: MutableRefObject<number>;
  center: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshBasicMaterial>(null);
  const elapsed = useRef(0);
  const TIME_PER_EDGE = 1.3;

  useFrame((_, delta) => {
    const p = clamp01(progressRef.current);
    const f = stationFocus(p, center);
    const speedMul = 1 + f * 0.4;
    elapsed.current += delta * speedMul;

    const segCount = Math.max(1, path.length - 1);
    const total = segCount * TIME_PER_EDGE;
    const tt = elapsed.current % total;
    const ei = Math.min(segCount - 1, Math.floor(tt / TIME_PER_EDGE));
    const localT = (tt - ei * TIME_PER_EDGE) / TIME_PER_EDGE;
    const from = path[ei];
    const to = path[ei + 1];

    const mesh = meshRef.current;
    if (mesh && from && to) {
      mesh.position.set(
        lerp(from.x, to.x, localT),
        lerp(from.y, to.y, localT),
        lerp(from.z, to.z, localT),
      );
      const r = 0.55 * speedMul * delta;
      mesh.rotation.x += r;
      mesh.rotation.y += r * 0.7;
      mesh.rotation.z += r * 0.4;
    }

    if (matRef.current) {
      matRef.current.opacity = lerp(0.5, 1, f);
      colorScratch.copy(colorBase).lerp(colorActive, f);
      matRef.current.color.copy(colorScratch);
    }
  });

  return (
    <mesh ref={meshRef}>
      <tetrahedronGeometry args={[0.06, 0]} />
      <meshBasicMaterial
        ref={matRef}
        color={FRAGMENT_VISUAL.nodeColor}
        transparent
        opacity={0.5}
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

/** Partículas flutuantes — profundidade atmosférica sutil. */
function Particles() {
  const ref = useRef<Points>(null);
  const geometry = useMemo(() => {
    const count = 130;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() * 2 - 1) * 22;
      arr[i * 3 + 1] = Math.random() * 7 - 0.5;
      arr[i * 3 + 2] = (Math.random() * 2 - 1) * 7 - 1.5;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(arr, 3));
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.055}
        color="#8f8b80"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Linha de energia conectando as estações. Track faint + traço vermelho
 * (dashOffset) + um TETRAEDRO 3D animado percorrendo a frente do desenho —
 * o fio condutor que liga visualmente a passagem de uma etapa pra outra.
 */
function EnergyLine({
  progressRef,
  scrollingRef,
}: {
  progressRef: MutableRefObject<number>;
  scrollingRef: MutableRefObject<boolean>;
}) {
  const drawRef = useRef<Line2>(null);
  const sparkRef = useRef<Mesh>(null);
  const sparkMatRef = useRef<MeshBasicMaterial>(null);
  const trailRef = useRef<Mesh>(null);
  const trailMatRef = useRef<MeshBasicMaterial>(null);
  const dashReady = useRef(false);
  const elapsed = useRef(0);
  const trailX = useRef(STATION_X[0]);
  // Visibilidade do condutor: 1 enquanto rola, 0 ao parar (oculta na travada).
  const reveal = useRef(0);

  const x0 = STATION_X[0];
  const x1 = STATION_X[N - 1];
  const length = x1 - x0;

  const points = useMemo<[number, number, number][]>(
    () => [
      [x0, LINE_Y, 0],
      [x1, LINE_Y, 0],
    ],
    [x0, x1],
  );

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = clamp01(progressRef.current);

    const line = drawRef.current;
    if (line) {
      if (!dashReady.current) {
        const mat = line.material;
        mat.dashed = true;
        mat.dashSize = length;
        mat.gapSize = length;
        mat.needsUpdate = true;
        dashReady.current = true;
      }
      line.material.dashOffset = length * (1 - p);
    }

    const sparkX = lerp(x0, x1, p);
    const onLine = p > 0.005 && p < 0.999;

    // Reveal: aparece ao rolar, oculta ao parar (a "travada" na estação).
    const revealTarget = scrollingRef.current ? 1 : 0;
    reveal.current = lerp(reveal.current, revealTarget, Math.min(1, delta * 6));
    const rv = reveal.current;
    const visible = onLine && rv > 0.01;

    // Pulso ao passar por uma estação.
    let nearestDist = Infinity;
    for (const sx of STATION_X) {
      nearestDist = Math.min(nearestDist, Math.abs(sparkX - sx));
    }
    const burst = clamp01(1 - nearestDist / 0.9);

    const spark = sparkRef.current;
    if (spark) {
      spark.position.x = sparkX;
      spark.visible = visible;
      spark.scale.setScalar((1 + burst * 0.7) * (0.4 + rv * 0.6));
      const r = 0.6 * delta;
      spark.rotation.x += r;
      spark.rotation.y += r * 0.7;
      spark.rotation.z += r * 0.4;
    }
    if (sparkMatRef.current) {
      sparkMatRef.current.opacity = (0.85 + Math.sin(t * 8) * 0.15) * rv;
    }

    // Trail (tetra menor, atrasado) → leitura de cometa.
    trailX.current += (sparkX - trailX.current) * Math.min(1, delta * 6);
    if (trailRef.current) {
      trailRef.current.position.x = trailX.current;
      trailRef.current.visible = visible;
      trailRef.current.rotation.y += delta * 0.5;
    }
    if (trailMatRef.current) trailMatRef.current.opacity = 0.22 * rv;
  });

  return (
    <>
      <Line
        points={points}
        color={FRAGMENT_VISUAL.edgeColor}
        lineWidth={1.2}
        transparent
        opacity={0.12}
        depthWrite={false}
        depthTest={false}
      />
      <Line
        ref={drawRef}
        points={points}
        color={FRAGMENT_VISUAL.apexColor}
        lineWidth={2}
        transparent
        opacity={0.9}
        dashed
        depthWrite={false}
        depthTest={false}
      />

      {/* Trail */}
      <mesh ref={trailRef} position={[x0, LINE_Y, 0]}>
        <tetrahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial
          ref={trailMatRef}
          color={FRAGMENT_VISUAL.apexColor}
          transparent
          opacity={0.22}
          blending={AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* Tetraedro 3D condutor */}
      <mesh ref={sparkRef} position={[x0, LINE_Y, 0]}>
        <tetrahedronGeometry args={[0.16, 0]} />
        <meshBasicMaterial
          ref={sparkMatRef}
          color={FRAGMENT_VISUAL.apexColor}
          transparent
          opacity={1}
          blending={AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </>
  );
}
