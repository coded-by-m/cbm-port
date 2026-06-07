"use client";

import {
  createRef,
  type MutableRefObject,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  BoxGeometry,
  EdgesGeometry,
  type Group,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import type { Line2 } from "three-stdlib";
import { buildTower } from "@/components/zones/ProjectLandscape/towerGeometry";
import {
  APEX_INDEX,
  APEX_PULSE,
  FRAGMENT_VISUAL,
} from "@/components/zones/ProjectLandscape/config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const TWO_PI = Math.PI * 2;

/** Escala da torre no field (cabe perto do spacing 1.5 com presença). */
const TOWER_SCALE = 1.15;

/**
 * Field de cubos wireframe idênticos. O cubo central, conforme o scroll
 * progress avança (0→1), perde opacidade enquanto uma torre triangulada
 * (com apex vermelho) aparece em seu lugar — crossfade simples.
 *
 * progressRef permite que o componente leia o scroll progress sem causar
 * re-render (anti-stale-closure pattern: ref atualizado pelo parent).
 *
 * isMobile reduz grid pra 4×4×2 = 32 cubos e desabilita rotação idle.
 */
export default function GenericGrid({
  progressRef,
  outroRef,
  hoveredRef,
  isMobile = false,
  active = true,
}: {
  progressRef: MutableRefObject<number>;
  outroRef?: MutableRefObject<number>;
  hoveredRef?: MutableRefObject<boolean>;
  isMobile?: boolean;
  /** `false` → congela o render loop fora do capítulo ativo (perf). */
  active?: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.1, 9], fov: FOV_DEG }}
      style={{ background: "transparent" }}
    >
      <GridScene
        progressRef={progressRef}
        outroRef={outroRef}
        hoveredRef={hoveredRef}
        isMobile={isMobile}
      />
    </Canvas>
  );
}

const FOV_DEG = 42;
// Fração horizontal de tela onde o fragmento fica ancorado. 0 = centro,
// 0.4 ≈ 70% da largura (lado direito) pra abrir espaço pra frase à esquerda.
// Em telas estreitas (mobile portrait) volta pro centro.
const FOCAL_NDC_X = 0.4;

/**
 * Camera dolly — zoom narrativo no fragmento conforme o scroll progress.
 *
 * O fragmento (focal) é ancorado no lado DIREITO da tela, centralizado na
 * vertical, ao lado da coluna de frases à esquerda. A câmera mira um ponto
 * deslocado à esquerda do fragmento (lookTarget) pra empurrá-lo pra direita,
 * com leve elevação pra dar profundidade ao field. Só o Z anima (zoom-in).
 *
 * panX é recalculado por frame a partir do Z atual + aspect, então a
 * posição de tela do fragmento fica estável durante todo o dolly.
 */
function CameraDolly({
  progressRef,
  focal,
}: {
  progressRef: MutableRefObject<number>;
  focal: [number, number, number];
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const baseZ = 9;
  const targetZ = 4.6;
  const camHeight = 0.9; // elevação acima do focal → leve down-tilt
  const tanHalfFov = Math.tan((FOV_DEG * Math.PI) / 180 / 2);

  useFrame((_, delta) => {
    const p = Math.max(0, Math.min(1, progressRef.current));
    const aspect = size.width / Math.max(1, size.height);
    const ndcX = aspect > 1.1 ? FOCAL_NDC_X : 0;

    const camZ = baseZ + (targetZ - baseZ) * p;
    const halfWidth = camZ * tanHalfFov * aspect;
    const panX = ndcX * halfWidth;

    // lookTarget à esquerda do fragmento → fragmento aparece à direita.
    const targetX = focal[0] - panX;
    const wantX = targetX;
    const wantY = focal[1] + camHeight;
    const wantZ = focal[2] + camZ;

    const k = Math.min(1, delta * 5);
    camera.position.x += (wantX - camera.position.x) * k;
    camera.position.y += (wantY - camera.position.y) * k;
    camera.position.z += (wantZ - camera.position.z) * k;
    // Mira no lookTarget (mesma altura do fragmento → centrado na vertical).
    camera.lookAt(targetX, focal[1], focal[2]);
  });
  return null;
}

function GridScene({
  progressRef,
  outroRef,
  hoveredRef,
  isMobile,
}: {
  progressRef: MutableRefObject<number>;
  outroRef?: MutableRefObject<number>;
  hoveredRef?: MutableRefObject<boolean>;
  isMobile: boolean;
}) {
  // Dims ímpares garantem um cubo exatamente no centro (origem) — necessário
  // pra rotação do field não fazer o fragmento orbitar.
  const dimsX = isMobile ? 5 : 7;
  const dimsY = isMobile ? 3 : 5;
  const dimsZ = 3;
  const spacing = 1.5;

  // Edges geometry compartilhada entre todos os cubos.
  const cubeEdges = useMemo(() => {
    const box = new BoxGeometry(0.6, 0.6, 0.6);
    return new EdgesGeometry(box);
  }, []);

  // Posições + delay de entrada por wave diagonal (Manhattan dist).
  const cubes = useMemo(() => {
    const offsetX = ((dimsX - 1) * spacing) / 2;
    const offsetY = ((dimsY - 1) * spacing) / 2;
    const offsetZ = ((dimsZ - 1) * spacing) / 2;
    const centerIx = Math.floor(dimsX / 2);
    const centerIy = Math.floor(dimsY / 2);
    const centerIz = Math.floor(dimsZ / 2);
    const list: Array<{
      key: string;
      pos: [number, number, number];
      delay: number;
      isCenter: boolean;
    }> = [];
    for (let ix = 0; ix < dimsX; ix++) {
      for (let iy = 0; iy < dimsY; iy++) {
        for (let iz = 0; iz < dimsZ; iz++) {
          const isCenter = ix === centerIx && iy === centerIy && iz === centerIz;
          list.push({
            key: `${ix}-${iy}-${iz}`,
            pos: [
              ix * spacing - offsetX,
              iy * spacing - offsetY,
              iz * spacing - offsetZ,
            ],
            // wave diagonal: cubos da corner (0,0,0) entram primeiro.
            delay: (ix + iy + iz) * 0.025,
            isCenter,
          });
        }
      }
    }
    return list;
  }, [dimsX, dimsY, dimsZ]);

  // Material refs por cubo pra animar opacity individualmente.
  const matRefs = useRef<(LineBasicMaterial | null)[]>([]);

  // Mesh do grupo inteiro — pra rotação idle compartilhada.
  const groupRef = useRef<Mesh>(null);

  // Torre triangular ascendente no centro — a mesma pirâmide da Paisagem
  // (buildTower). É o "diferente" no meio dos quadrados: um deles vira a
  // estrutura triangulada da marca, construída de baixo pra cima.
  const towerGroupRef = useRef<Group>(null);
  const tower = useMemo(() => buildTower(73), []);
  const towerEdgeRefs = useMemo(
    () => tower.edges.map(() => createRef<Line2>()),
    [tower],
  );
  const towerNodeMatRefs = useMemo(
    () => tower.nodes.map(() => createRef<MeshBasicMaterial>()),
    [tower],
  );
  const apexScaleRef = useRef<Mesh>(null);
  const centerCubeMatRef = useRef<LineBasicMaterial | null>(null);

  // Tempo desde mount pra entry wave.
  const elapsed = useRef(0);

  // Altura (y) min/max pra revelar a torre de baixo pra cima com o progress.
  const yRange = useMemo(() => {
    const ys = tower.nodes.map((n) => n[1]);
    return { min: Math.min(...ys), max: Math.max(...ys) };
  }, [tower]);
  // Offset vertical pra centralizar a massa da torre na origem.
  const TOWER_Y_OFFSET = -(yRange.max + yRange.min) / 2;

  // Distância máxima de um cubo à origem — normaliza o stagger do outro.
  const maxDist = useMemo(() => {
    let m = 0.001;
    cubes.forEach((c) => {
      m = Math.max(m, Math.hypot(c.pos[0], c.pos[1], c.pos[2]));
    });
    return m;
  }, [cubes]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const progress = clamp01(progressRef.current);
    const outro = clamp01(outroRef?.current ?? 0);

    // Rotação idle do grid inteiro (super sutil, todos sincronizados).
    if (groupRef.current && !isMobile) {
      groupRef.current.rotation.y += delta * 0.05;
    }

    // Entry wave: cada cubo fade-in opacity 0 → 0.18 baseado em delay.
    cubes.forEach((c, i) => {
      const mat = matRefs.current[i];
      if (!mat) return;
      const localT = clamp01((t - c.delay) / 0.7);
      const baseOpacity = 0.18 * localT;
      const dist = Math.hypot(c.pos[0], c.pos[1], c.pos[2]);

      let op: number;
      if (c.isCenter) {
        // Cubo central perde opacidade conforme progress (.18 → 0.04)
        op = lerp(baseOpacity, 0.04, progress);
        centerCubeMatRef.current = mat;
      } else {
        // Vizinhos próximos clareiam mais com o progress → abre um "respiro"
        // ao redor do fragmento, guiando o olho. clearing 1 = perto, 0 = longe.
        const clearing = clamp01(1 - dist / 2.4);
        op = baseOpacity * lerp(1, 0.35, clearing * progress);
      }

      // Outro: fade-out escalonado da borda pro centro. Cubos distantes
      // (borda) somem primeiro; os próximos do centro, por último.
      if (outro > 0) {
        const distNorm = dist / maxDist; // 1 = borda, 0 = centro
        const threshold = (1 - distNorm) * 0.55; // borda 0 → centro 0.55
        const outFade = clamp01((outro - threshold) / 0.45);
        op *= 1 - outFade;
      }

      mat.opacity = op;
    });

    // Torre central: constrói de baixo pra cima com o progress.
    const isHovered = hoveredRef?.current === true;
    const hoverBoost = isHovered ? 1.12 : 1;
    const span = Math.max(0.001, yRange.max - yRange.min);

    // Revela cada elemento conforme a "frente de construção" sobe.
    // buildFront vai um pouco além de 1 pra garantir o apex 100% no fim.
    const buildFront = progress * 1.15;
    const revealAtHeight = (h: number) => {
      const norm = (h - yRange.min) / span; // 0 = base, 1 = apex
      return clamp01((buildFront - norm) / 0.25); // janela de 0.25
    };

    // Arestas: reveladas pela altura média dos endpoints.
    tower.edges.forEach((edge, i) => {
      const line = towerEdgeRefs[i].current;
      if (!line) return;
      const hMid = (edge[0][1] + edge[1][1]) / 2;
      const local = revealAtHeight(hMid);
      const op = lerp(
        FRAGMENT_VISUAL.edgeNormalOpacity,
        FRAGMENT_VISUAL.edgeHighlightOpacity,
        progress,
      );
      (line.material as { opacity: number }).opacity = Math.min(
        1,
        op * local * hoverBoost,
      );
    });

    // Nós: revelados pela própria altura. Apex (index 6) pulsa em vermelho.
    tower.nodes.forEach((node, i) => {
      const mat = towerNodeMatRefs[i].current;
      if (!mat) return;
      const local = revealAtHeight(node[1]);
      if (i === APEX_INDEX) {
        const pulse =
          1 +
          Math.sin(t * (TWO_PI / APEX_PULSE.idlePeriod)) *
            APEX_PULSE.idleAmplitude;
        mat.opacity = Math.min(1, local * hoverBoost);
        if (apexScaleRef.current) apexScaleRef.current.scale.setScalar(pulse);
      } else {
        mat.opacity = Math.min(
          1,
          FRAGMENT_VISUAL.nodeNormalOpacity * local * hoverBoost,
        );
      }
    });

    // Vida da torre: yaw lento (é 3D, gira bem) + bob sutil + scale-in.
    if (towerGroupRef.current) {
      towerGroupRef.current.rotation.y = t * (TWO_PI / 22) * (isHovered ? 1.5 : 1);
      towerGroupRef.current.position.y =
        TOWER_Y_OFFSET + Math.sin(t * 0.7) * 0.03;
      const s = TOWER_SCALE * (0.85 + progress * 0.15);
      towerGroupRef.current.scale.setScalar(s);
    }
  });

  // Posição do cubo central — com dims ímpares, fica exatamente na origem,
  // então a rotação do field o mantém pinado (gira no lugar, não orbita).
  const centerPos = useMemo<[number, number, number]>(() => {
    const c = cubes.find((x) => x.isCenter);
    return c?.pos ?? [0, 0, 0];
  }, [cubes]);

  return (
    <>
      <CameraDolly progressRef={progressRef} focal={centerPos} />

      {/* Field de cubos — rotaciona lentamente (o cubo central, na origem,
          gira no lugar e some no crossfade). */}
      <group ref={groupRef as never}>
        {cubes.map((c, i) => (
          <lineSegments key={c.key} geometry={cubeEdges} position={c.pos}>
            <lineBasicMaterial
              color="#F5F2ED"
              transparent
              opacity={0}
              depthWrite={false}
              ref={(el) => {
                matRefs.current[i] = el;
              }}
            />
          </lineSegments>
        ))}
      </group>

      {/* Torre triangular ascendente — a mesma pirâmide da Paisagem.
          Fora da rotação do field; gira em Y próprio. Constrói de baixo
          pra cima com o scroll, apex vermelho por último. */}
      <group position={centerPos}>
        <group ref={towerGroupRef}>
          {tower.edges.map((points, i) => (
            <Line
              key={`tower-edge-${i}`}
              ref={towerEdgeRefs[i]}
              points={points}
              color={FRAGMENT_VISUAL.edgeColor}
              lineWidth={FRAGMENT_VISUAL.edgeWidth}
              transparent
              opacity={0}
              depthTest={false}
            />
          ))}

          {tower.nodes.map((vertex, i) => {
            const isApex = i === APEX_INDEX;
            return (
              <mesh
                key={`tower-node-${i}`}
                position={vertex}
                ref={isApex ? apexScaleRef : undefined}
              >
                <icosahedronGeometry args={[isApex ? 0.05 : 0.035, 1]} />
                <meshBasicMaterial
                  ref={towerNodeMatRefs[i]}
                  color={
                    isApex
                      ? FRAGMENT_VISUAL.apexColor
                      : FRAGMENT_VISUAL.nodeColor
                  }
                  transparent
                  opacity={0}
                  depthTest={false}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </>
  );
}
