"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  BoxGeometry,
  CatmullRomCurve3,
  EdgesGeometry,
  IcosahedronGeometry,
  TubeGeometry,
  Vector3,
  type Group,
  type Mesh,
} from "three";
import type { ServiceVariant } from "@/data/services";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Mini-scene 3D dentro do card de serviço.
 *
 * 3 variants conceitualmente fortes:
 *  - "landing": torre 3D de andares flutuantes + partículas subindo
 *  - "institutional": mind map 3D — nó central + satélites + tubos curvos
 *  - "app": cubo dashboard rotativo com conteúdo nas 6 faces
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
      camera={{ position: [0, 0, 6], fov: 38 }}
      style={{ background: "transparent" }}
    >
      {variant === "landing" && <LandingScene active={active} />}
      {variant === "institutional" && <InstitutionalScene active={active} />}
      {variant === "app" && <AppScene active={active} />}
    </Canvas>
  );
}

/* ============================================================
   LANDING — Torre 3D de andares flutuantes
   ============================================================ */

function LandingScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const particlesRef = useRef<(Mesh | null)[]>([]);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // 6 andares empilhados verticalmente. Cada um é um box fino (chapa 3D).
  const floors = useMemo(() => {
    const count = 6;
    const totalHeight = 4.5;
    const spacing = totalHeight / (count - 1);
    return Array.from({ length: count }, (_, i) => {
      const y = totalHeight / 2 - i * spacing;
      const isCta = i === 2; // andar 3 é o CTA (vermelho)
      // Tamanho varia ligeiramente: andares do meio um pouco maiores
      const w = 1.5 - Math.abs(i - count / 2) * 0.08;
      return { y, w, isCta, depth: 0.06 };
    });
  }, []);

  // Edges geometry pra cada andar (só as arestas, look limpo).
  const edgesGeoms = useMemo(() => {
    return floors.map((f) => {
      const box = new BoxGeometry(f.w, f.depth, f.w * 0.78);
      return new EdgesGeometry(box);
    });
  }, [floors]);

  // 10 partículas subindo em espiral ao redor da torre.
  const particles = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      angle: (i / 10) * TWO_PI,
      radius: 1.05 + (i % 3) * 0.15,
      seed: i * 0.7,
      speed: 0.5 + (i % 4) * 0.15,
    }));
  }, []);

  useFrame((_, delta) => {
    speedRef.current = lerp(
      speedRef.current,
      active ? 1.5 : 1,
      Math.min(1, delta * 4),
    );
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    const g = groupRef.current;
    if (g) {
      // Torre gira lenta + bob sutil
      g.rotation.y = t * 0.18;
      g.position.y = Math.sin(t * 0.4) * 0.08;
    }

    // Partículas sobem em espiral, reaparecem embaixo ao chegar no topo
    particles.forEach((p, i) => {
      const mesh = particlesRef.current[i];
      if (!mesh) return;
      const yPhase = ((t * p.speed + p.seed) % 5) - 2.5; // -2.5 → 2.5
      const angle = p.angle + t * 0.2;
      mesh.position.set(
        Math.cos(angle) * p.radius,
        yPhase,
        Math.sin(angle) * p.radius,
      );
      // Fade quando perto das pontas
      const fadeT = 1 - Math.abs(yPhase) / 2.5;
      const mat = mesh.material as { opacity: number };
      mat.opacity = Math.max(0.1, fadeT * 0.7);
    });
  });

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Andares (edges only) */}
      {floors.map((f, i) => (
        <group key={`floor-${i}`} position={[0, f.y, 0]}>
          <lineSegments geometry={edgesGeoms[i]}>
            <lineBasicMaterial
              color={f.isCta ? "#FB3640" : "#F5F2ED"}
              transparent
              opacity={f.isCta ? 0.95 : 0.7}
              linewidth={1}
            />
          </lineSegments>

          {/* Apex vermelho no andar CTA, ponto central */}
          {f.isCta && (
            <mesh position={[0, 0, 0]}>
              <icosahedronGeometry args={[0.06, 0]} />
              <meshBasicMaterial color="#FB3640" transparent opacity={1} />
            </mesh>
          )}
        </group>
      ))}

      {/* Coluna central conectando os andares (eco do logo CbM) */}
      <Line
        points={[
          [0, -2.4, 0],
          [0, 2.4, 0],
        ]}
        color="#F5F2ED"
        lineWidth={0.9}
        transparent
        opacity={0.25}
        depthWrite={false}
      />

      {/* Partículas em espiral */}
      {particles.map((_, i) => (
        <mesh
          key={`particle-${i}`}
          ref={(el) => {
            particlesRef.current[i] = el;
          }}
        >
          <icosahedronGeometry args={[0.03, 0]} />
          <meshBasicMaterial
            color="#F5F2ED"
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   INSTITUTIONAL — Mind map 3D com tubos curvos
   ============================================================ */

function InstitutionalScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const nodesRef = useRef<(Group | null)[]>([]);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // Nó central + 5 satélites em 3D (não plano).
  const nodes = useMemo(() => {
    return [
      { id: "root", pos: new Vector3(0, 0, 0), size: 0.4, isRoot: true },
      { id: "n1", pos: new Vector3(-1.6, 0.9, 0.3), size: 0.22, isRoot: false },
      { id: "n2", pos: new Vector3(1.5, 0.7, -0.4), size: 0.22, isRoot: false },
      {
        id: "n3",
        pos: new Vector3(-1.4, -0.8, -0.5),
        size: 0.22,
        isRoot: false,
      },
      { id: "n4", pos: new Vector3(1.5, -1.0, 0.4), size: 0.22, isRoot: false },
      { id: "n5", pos: new Vector3(0, 1.5, -0.8), size: 0.22, isRoot: false },
    ];
  }, []);

  // Tubos curvos entre o root e cada satélite.
  const tubes = useMemo(() => {
    const root = nodes[0].pos;
    return nodes.slice(1).map((n) => {
      // Ponto intermediário deslocado pra criar curva (não reta)
      const mid = new Vector3()
        .addVectors(root, n.pos)
        .multiplyScalar(0.5)
        .add(new Vector3(0, 0, 0.6 * Math.sign(n.pos.x || 0.1)));
      const curve = new CatmullRomCurve3([root.clone(), mid, n.pos.clone()]);
      return new TubeGeometry(curve, 24, 0.012, 6, false);
    });
  }, [nodes]);

  // Edges das icosaedros pra wireframe limpo
  const nodeEdges = useMemo(() => {
    return nodes.map((n) => {
      const ico = new IcosahedronGeometry(n.size, 0);
      return new EdgesGeometry(ico);
    });
  }, [nodes]);

  useFrame((_, delta) => {
    speedRef.current = lerp(
      speedRef.current,
      active ? 1.4 : 1,
      Math.min(1, delta * 4),
    );
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    const g = groupRef.current;
    if (g) {
      g.rotation.y = t * 0.12; // rotação lenta
      g.rotation.x = Math.sin(t * 0.3) * 0.06; // leve oscilação pra mostrar 3D
    }

    // Nós satélites: pulse sutil (scale) — eco de "respiração da estrutura"
    nodes.forEach((n, i) => {
      const node = nodesRef.current[i];
      if (!node) return;
      const phase = i * 0.7;
      const pulse = 1 + Math.sin(t * 1.2 + phase) * (n.isRoot ? 0.05 : 0.08);
      node.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={groupRef} scale={0.95}>
      {/* Tubos curvos (conexões) */}
      {tubes.map((g, i) => (
        <mesh key={`tube-${i}`} geometry={g}>
          <meshBasicMaterial
            color="#F5F2ED"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Nós (edges only icosahedrons) */}
      {nodes.map((n, i) => (
        <group
          key={n.id}
          position={n.pos}
          ref={(el) => {
            nodesRef.current[i] = el;
          }}
        >
          <lineSegments geometry={nodeEdges[i]}>
            <lineBasicMaterial
              color="#F5F2ED"
              transparent
              opacity={n.isRoot ? 0.95 : 0.7}
              linewidth={1}
            />
          </lineSegments>
          {/* Apex vermelho só na raiz */}
          {n.isRoot && (
            <mesh position={[0, n.size, 0]}>
              <icosahedronGeometry args={[0.06, 0]} />
              <meshBasicMaterial color="#FB3640" transparent opacity={1} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

/* ============================================================
   APP — Cubo dashboard rotativo com conteúdo nas faces
   ============================================================ */

function AppScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const orbitRef = useRef<(Mesh | null)[]>([]);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  const cubeSize = 1.8;

  // Edges do cubo principal
  const cubeEdges = useMemo(() => {
    const box = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    return new EdgesGeometry(box);
  }, []);

  // Conteúdo das faces — cada face tem um padrão wireframe interno diferente.
  // Vamos desenhar 3 faces visíveis: front (+Z), right (+X), top (+Y).

  // Face FRONT: gráfico de barras (5 barras verticais de altura variável)
  const frontBars = useMemo(() => {
    const count = 5;
    const totalW = cubeSize * 0.62;
    const gap = 0.08;
    const bw = (totalW - gap * (count - 1)) / count;
    const startX = -totalW / 2;
    const baseY = -cubeSize * 0.3;
    return Array.from({ length: count }, (_, i) => ({
      x: startX + i * (bw + gap) + bw / 2,
      width: bw,
      baseY,
      phase: i * 0.5,
      isAccent: i === 2,
    }));
  }, []);

  // Face RIGHT: grid 4x4 (tabela)
  const rightGridLines = useMemo(() => {
    const half = cubeSize * 0.35;
    const cells = 4;
    const lines: [[number, number, number], [number, number, number]][] = [];
    for (let i = 0; i <= cells; i++) {
      const t = -half + (i / cells) * (half * 2);
      // Horizontais no plano YZ (X = cubeSize/2 + offset)
      lines.push([
        [cubeSize / 2 + 0.005, t, -half],
        [cubeSize / 2 + 0.005, t, half],
      ]);
      // Verticais
      lines.push([
        [cubeSize / 2 + 0.005, -half, t],
        [cubeSize / 2 + 0.005, half, t],
      ]);
    }
    return lines;
  }, []);

  // Face TOP: 4 nós interconectados (mini grafo)
  const topNodes = useMemo(() => {
    const half = cubeSize * 0.32;
    const y = cubeSize / 2 + 0.005;
    return [
      { p: [-half, y, -half] as [number, number, number], isAccent: false },
      { p: [half, y, -half] as [number, number, number], isAccent: true },
      { p: [-half, y, half] as [number, number, number], isAccent: false },
      { p: [half, y, half] as [number, number, number], isAccent: false },
    ];
  }, []);

  const topConnections = useMemo(() => {
    return [
      [topNodes[0].p, topNodes[1].p],
      [topNodes[1].p, topNodes[3].p],
      [topNodes[3].p, topNodes[2].p],
      [topNodes[2].p, topNodes[0].p],
      [topNodes[0].p, topNodes[3].p],
    ] as [[number, number, number], [number, number, number]][];
  }, [topNodes]);

  // 4 partículas orbitando ao redor do cubo
  const orbitParticles = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      radius: 1.6 + (i % 2) * 0.2,
      angleOffset: (i / 4) * TWO_PI,
      yOffset: (i % 2 === 0 ? 0.3 : -0.3) * (i < 2 ? 1 : -1),
      speed: 0.25 + (i % 3) * 0.1,
    }));
  }, []);

  // Refs das barras da face front pra animar
  const barRefs = useRef<(Mesh | null)[]>([]);

  useFrame((_, delta) => {
    speedRef.current = lerp(
      speedRef.current,
      active ? 1.4 : 1,
      Math.min(1, delta * 4),
    );
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    const g = groupRef.current;
    if (g) {
      // Cubo gira Y + leve inclinação X
      g.rotation.y = t * 0.22;
      g.rotation.x = 0.25 + Math.sin(t * 0.4) * 0.05;
    }

    // Barras crescendo/decrescendo (data update)
    frontBars.forEach((b, i) => {
      const mesh = barRefs.current[i];
      if (!mesh) return;
      const h = 0.15 + ((Math.sin(t * 1.5 + b.phase) + 1) / 2) * 0.55;
      mesh.scale.y = h;
      mesh.position.y = b.baseY + h / 2;
    });

    // Partículas orbitando
    orbitParticles.forEach((p, i) => {
      const mesh = orbitRef.current[i];
      if (!mesh) return;
      const angle = p.angleOffset + t * p.speed;
      mesh.position.set(
        Math.cos(angle) * p.radius,
        p.yOffset + Math.sin(t * 0.6 + i) * 0.1,
        Math.sin(angle) * p.radius,
      );
    });
  });

  return (
    <group ref={groupRef} scale={0.7}>
      {/* Cubo principal (edges) */}
      <lineSegments geometry={cubeEdges}>
        <lineBasicMaterial
          color="#F5F2ED"
          transparent
          opacity={0.85}
          linewidth={1}
        />
      </lineSegments>

      {/* Face FRONT — gráfico de barras */}
      {frontBars.map((b, i) => (
        <group key={`fb-${i}`} position={[b.x, b.baseY, cubeSize / 2 + 0.005]}>
          <mesh
            ref={(el) => {
              barRefs.current[i] = el;
            }}
          >
            <planeGeometry args={[b.width, 1]} />
            <meshBasicMaterial
              color={b.isAccent ? "#FB3640" : "#F5F2ED"}
              transparent
              opacity={b.isAccent ? 0.9 : 0.65}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* Face RIGHT — grid (linhas) */}
      {rightGridLines.map((points, i) => (
        <Line
          key={`rg-${i}`}
          points={points}
          color="#F5F2ED"
          lineWidth={0.9}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      ))}

      {/* Face TOP — grafo de nós */}
      {topConnections.map((c, i) => (
        <Line
          key={`tc-${i}`}
          points={c}
          color="#F5F2ED"
          lineWidth={0.9}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      ))}
      {topNodes.map((n, i) => (
        <mesh key={`tn-${i}`} position={n.p}>
          <icosahedronGeometry args={[0.05, 0]} />
          <meshBasicMaterial
            color={n.isAccent ? "#FB3640" : "#F5F2ED"}
            transparent
            opacity={n.isAccent ? 0.95 : 0.7}
          />
        </mesh>
      ))}

      {/* Partículas orbitando (eco de "dados em movimento") */}
      {orbitParticles.map((_, i) => (
        <mesh
          key={`orbit-${i}`}
          ref={(el) => {
            orbitRef.current[i] = el;
          }}
        >
          <icosahedronGeometry args={[0.035, 0]} />
          <meshBasicMaterial
            color="#F5F2ED"
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
