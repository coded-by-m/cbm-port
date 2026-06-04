"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  Color,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import type { ServiceVariant } from "@/data/services";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Mini-scene 3D dentro do card de serviço.
 *
 * 3 variants visuais:
 * - "landing": 3 colunas verticais conectadas em zigzag — eco do preview tall
 * - "institutional": 4 planos horizontais empilhados — eco de site multi-seção
 * - "app": núcleo central + 6 módulos satélite + linhas pulsando — sistema
 */
export default function ServiceMiniScene({
  variant,
  active,
}: {
  variant: ServiceVariant;
  active: boolean;
}) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 40 }}
      style={{ background: "transparent" }}
    >
      {variant === "landing" && <LandingScene active={active} />}
      {variant === "institutional" && <InstitutionalScene active={active} />}
      {variant === "app" && <AppScene active={active} />}
    </Canvas>
  );
}

/* -------------------- LANDING -------------------- */

function LandingScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // 3 colunas × 5 níveis = 15 nós base. Em zigzag: colunas alternam X levemente.
  const layout = useMemo(() => {
    const cols = [-1.4, 0, 1.4];
    const rows = [-2, -1, 0, 1, 2];
    const nodes: [number, number, number][] = [];
    for (const x of cols) {
      for (const y of rows) {
        nodes.push([x, y, 0]);
      }
    }
    // Arestas: dentro de cada coluna (verticais) + zigzag entre colunas adjacentes.
    const edges: [[number, number, number], [number, number, number]][] = [];
    // Verticais
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 4; r++) {
        edges.push([nodes[c * 5 + r], nodes[c * 5 + r + 1]]);
      }
    }
    // Zigzag entre col 0↔1 e col 1↔2
    for (let r = 0; r < 5; r++) {
      edges.push([nodes[r], nodes[5 + r]]);
      edges.push([nodes[5 + r], nodes[10 + r]]);
    }
    return { nodes, edges };
  }, []);

  useFrame((_, delta) => {
    speedRef.current = lerp(speedRef.current, active ? 1.8 : 1, Math.min(1, delta * 4));
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;
    const g = groupRef.current;
    if (g) {
      // Oscilação Y do grupo inteiro: lê como "página tall scrollando"
      g.position.y = Math.sin(t * (TWO_PI / 8)) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {layout.edges.map((e, i) => (
        <Line
          key={`l-edge-${i}`}
          points={e}
          color="#F5F2ED"
          lineWidth={1.2}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      ))}
      {layout.nodes.map((p, i) => (
        <mesh key={`l-node-${i}`} position={p}>
          <icosahedronGeometry args={[0.05, 0]} />
          <meshBasicMaterial
            color={active && i === 12 ? "#FB3640" : "#F5F2ED"}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------- INSTITUTIONAL -------------------- */

function InstitutionalScene({ active }: { active: boolean }) {
  const layersRef = useRef<(Group | null)[]>([]);
  const elapsed = useRef(0);

  // 4 planos empilhados em Y.
  const layers = useMemo(() => {
    const ys = [-1.5, -0.5, 0.5, 1.5];
    return ys.map((y, idx) => {
      const half = 1.2;
      const corners: [number, number, number][] = [
        [-half, y, -half],
        [half, y, -half],
        [half, y, half],
        [-half, y, half],
      ];
      const center: [number, number, number] = [0, y, 0];
      const nodes = [...corners, center];
      const edges: [[number, number, number], [number, number, number]][] = [
        [corners[0], corners[1]],
        [corners[1], corners[2]],
        [corners[2], corners[3]],
        [corners[3], corners[0]],
        [corners[0], center],
        [corners[1], center],
        [corners[2], center],
        [corners[3], center],
      ];
      return { idx, y, nodes, edges, opacity: 0.6 - idx * 0.05 };
    });
  }, []);

  // Conexões verticais entre cantos correspondentes de camadas adjacentes.
  const verticalConnections = useMemo(() => {
    const conns: [[number, number, number], [number, number, number]][] = [];
    for (let li = 0; li < 3; li++) {
      const lower = layers[li];
      const upper = layers[li + 1];
      for (let ci = 0; ci < 4; ci++) {
        conns.push([lower.nodes[ci], upper.nodes[ci]]);
      }
    }
    return conns;
  }, [layers]);

  const vertOpacityRef = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    layers.forEach((layer, i) => {
      const g = layersRef.current[i];
      if (!g) return;
      // Cada camada respira em fase deslocada.
      g.position.y = Math.sin(t * (TWO_PI / 5) + i * 1.25) * 0.08;
    });

    // Conexões verticais aparecem quando ativo.
    vertOpacityRef.current = lerp(
      vertOpacityRef.current,
      active ? 0.8 : 0,
      Math.min(1, delta * 3),
    );
  });

  return (
    <group position={[0, 0, 0]} rotation={[0, 0.3, 0]}>
      {layers.map((layer, li) => (
        <group
          key={`layer-${li}`}
          ref={(el) => {
            layersRef.current[li] = el;
          }}
        >
          {layer.edges.map((e, ei) => (
            <Line
              key={`i-edge-${li}-${ei}`}
              points={e}
              color="#F5F2ED"
              lineWidth={1.1}
              transparent
              opacity={layer.opacity}
              depthWrite={false}
            />
          ))}
          {layer.nodes.map((p, ni) => (
            <mesh key={`i-node-${li}-${ni}`} position={p}>
              <icosahedronGeometry args={[0.04, 0]} />
              <meshBasicMaterial
                color="#F5F2ED"
                transparent
                opacity={layer.opacity + 0.15}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Conexões verticais (aparecem no hover/expand) */}
      {verticalConnections.map((c, i) => (
        <VerticalConnection key={`vc-${i}`} points={c} opacityRef={vertOpacityRef} />
      ))}
    </group>
  );
}

function VerticalConnection({
  points,
  opacityRef,
}: {
  points: [[number, number, number], [number, number, number]];
  opacityRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<{ opacity: number } | null>(null);

  useFrame(() => {
    if (matRef.current) matRef.current.opacity = opacityRef.current;
  });

  return (
    <Line
      points={points}
      color="#F5F2ED"
      lineWidth={0.8}
      transparent
      opacity={0}
      depthWrite={false}
      ref={(line) => {
        matRef.current = (line?.material as { opacity: number } | undefined) ?? null;
      }}
    />
  );
}

/* -------------------- APP -------------------- */

const lineColorRed = new Color("#FB3640");

function AppScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const coreMatRef = useRef<MeshBasicMaterial>(null);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // 6 módulos satélite em arranjo octaédrico.
  const modules = useMemo(() => {
    const d = 1.5;
    const positions: [number, number, number][] = [
      [d, 0, 0],
      [-d, 0, 0],
      [0, 0, d],
      [0, 0, -d],
      [0, d, 0],
      [0, -d, 0],
    ];
    return positions.map((p, i) => ({
      pos: p,
      seed: i * 1.3,
      bobPeriod: 4 + i * 0.5,
    }));
  }, []);

  // 6 conexões core ↔ módulo. Cada uma com fase de pulse offset.
  const connections = useMemo(
    () =>
      modules.map((m, i) => ({
        from: [0, 0, 0] as [number, number, number],
        to: m.pos,
        phase: i * (TWO_PI / 6),
      })),
    [modules],
  );

  const moduleRefs = useRef<(Group | null)[]>([]);
  const connOpacities = useRef<number[]>(modules.map(() => 0.25));

  useFrame((_, delta) => {
    speedRef.current = lerp(speedRef.current, active ? 1.5 : 1, Math.min(1, delta * 4));
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    // Rotação Y do grupo inteiro.
    if (groupRef.current) {
      groupRef.current.rotation.y = t * (TWO_PI / 18);
    }

    // Núcleo "respira" quando ativo.
    if (coreRef.current) {
      const baseScale = 1;
      const pulse = active ? Math.sin(t * (TWO_PI / 2)) * 0.08 : 0;
      coreRef.current.scale.setScalar(baseScale + pulse);
    }

    // Bob individual dos módulos.
    modules.forEach((mod, i) => {
      const g = moduleRefs.current[i];
      if (!g) return;
      g.position.set(
        mod.pos[0],
        mod.pos[1] + Math.sin(t * (TWO_PI / mod.bobPeriod) + mod.seed) * 0.06,
        mod.pos[2],
      );
    });

    // Pulse de "dados" percorre as 6 conexões em sequência.
    // Cada conexão tem fase deslocada — uma onda passa por elas em loop de 4s.
    connections.forEach((c, i) => {
      const wave = Math.sin(t * (TWO_PI / 4) - c.phase);
      const target = active
        ? 0.3 + Math.max(0, wave) * 0.5
        : 0.15 + Math.max(0, wave) * 0.35;
      connOpacities.current[i] = lerp(
        connOpacities.current[i],
        target,
        Math.min(1, delta * 8),
      );
    });
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Conexões core ↔ módulos */}
      {connections.map((c, i) => (
        <ConnectionLine
          key={`conn-${i}`}
          from={c.from}
          to={c.to}
          opacityRef={connOpacities}
          index={i}
        />
      ))}

      {/* Núcleo central — icosaedro */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color="#F5F2ED"
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* Apex vermelho do núcleo (1 vértice top) */}
      <mesh position={[0, 0.5, 0]}>
        <icosahedronGeometry args={[0.06, 0]} />
        <meshBasicMaterial color={lineColorRed} transparent opacity={1} />
      </mesh>

      {/* 6 módulos satélite */}
      {modules.map((mod, i) => (
        <group
          key={`mod-${i}`}
          ref={(el) => {
            moduleRefs.current[i] = el;
          }}
        >
          <mesh>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshBasicMaterial color="#F5F2ED" wireframe transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ConnectionLine({
  from,
  to,
  opacityRef,
  index,
}: {
  from: [number, number, number];
  to: [number, number, number];
  opacityRef: React.MutableRefObject<number[]>;
  index: number;
}) {
  const matRef = useRef<{ opacity: number } | null>(null);

  useFrame(() => {
    if (matRef.current) matRef.current.opacity = opacityRef.current[index];
  });

  return (
    <Line
      points={[from, to]}
      color="#FB3640"
      lineWidth={1.0}
      transparent
      opacity={0.25}
      depthWrite={false}
      ref={(line) => {
        matRef.current = (line?.material as { opacity: number } | undefined) ?? null;
      }}
    />
  );
}
