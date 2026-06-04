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
 * 3 variants em progressão de complexidade visual:
 *  - "landing": página única flutuante (mais simples)
 *  - "institutional": torre de andares 3D (múltiplas páginas)
 *  - "app": mind map 3D — sistema interconectado (mais complexo)
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
   LANDING — Página única flutuante (simplicidade)
   ============================================================ */

function LandingScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const sparkRef = useRef<Mesh>(null);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // Página única (frame retangular tall) + 4 blocks horizontais internos.
  // Lê como UMA página com hero + 2 sections + CTA — simples e direto.
  const pageW = 1.4;
  const pageH = 3.2;

  // Frame externo (edges)
  const frameEdges = useMemo(() => {
    const box = new BoxGeometry(pageW, pageH, 0.04);
    return new EdgesGeometry(box);
  }, []);

  // 4 sections internas: hero (maior) + 2 content + CTA (vermelho, embaixo)
  const sections = useMemo(() => {
    const padding = 0.18;
    const gap = 0.1;
    const totalContentH = pageH - padding * 2;
    // Hero ocupa 35%, 2 content 22% cada, CTA 21%
    const ratios = [0.35, 0.22, 0.22, 0.21];
    const blocks: Array<{
      yCenter: number;
      height: number;
      isAccent: boolean;
    }> = [];
    let cursor = pageH / 2 - padding;
    ratios.forEach((r, i) => {
      const h = (totalContentH - gap * (ratios.length - 1)) * r;
      const yCenter = cursor - h / 2;
      blocks.push({
        yCenter,
        height: h,
        isAccent: i === ratios.length - 1, // último (CTA) é vermelho
      });
      cursor -= h + gap;
    });
    return blocks;
  }, []);

  useFrame((_, delta) => {
    speedRef.current = lerp(
      speedRef.current,
      active ? 1.6 : 1,
      Math.min(1, delta * 4),
    );
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    const g = groupRef.current;
    if (g) {
      // Página flutuante: rotação Y muito lenta + bob suave
      g.rotation.y = Math.sin(t * 0.25) * 0.18;
      g.position.y = Math.sin(t * 0.4) * 0.06;
    }

    // Faísca no apex/CTA: pulsa de leve
    if (sparkRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      sparkRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} scale={0.85}>
      {/* Frame externo da página */}
      <lineSegments geometry={frameEdges}>
        <lineBasicMaterial
          color="#F5F2ED"
          transparent
          opacity={0.85}
          linewidth={1}
        />
      </lineSegments>

      {/* 4 sections internas */}
      {sections.map((s, i) => {
        const halfW = (pageW * 0.78) / 2;
        const halfH = s.height / 2;
        const blockPoints: [
          [number, number, number],
          [number, number, number],
        ][] = [
          [
            [-halfW, s.yCenter + halfH, 0.025],
            [halfW, s.yCenter + halfH, 0.025],
          ],
          [
            [halfW, s.yCenter + halfH, 0.025],
            [halfW, s.yCenter - halfH, 0.025],
          ],
          [
            [halfW, s.yCenter - halfH, 0.025],
            [-halfW, s.yCenter - halfH, 0.025],
          ],
          [
            [-halfW, s.yCenter - halfH, 0.025],
            [-halfW, s.yCenter + halfH, 0.025],
          ],
        ];
        const color = s.isAccent ? "#FB3640" : "#F5F2ED";
        const opacity = s.isAccent ? 0.9 : 0.55;
        return (
          <group key={`section-${i}`}>
            {blockPoints.map((p, bi) => (
              <Line
                key={`bp-${bi}`}
                points={p}
                color={color}
                lineWidth={1.1}
                transparent
                opacity={opacity}
                depthWrite={false}
              />
            ))}
          </group>
        );
      })}

      {/* Faísca vermelha no centro do CTA block */}
      <mesh ref={sparkRef} position={[0, sections[3].yCenter, 0.05]}>
        <icosahedronGeometry args={[0.05, 0]} />
        <meshBasicMaterial color="#FB3640" transparent opacity={1} />
      </mesh>
    </group>
  );
}

/* ============================================================
   INSTITUTIONAL — Torre 3D de andares (várias páginas/seções)
   ============================================================ */

function InstitutionalScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const particlesRef = useRef<(Mesh | null)[]>([]);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // 6 andares empilhados verticalmente — lê como site com várias páginas.
  const floors = useMemo(() => {
    const count = 6;
    const totalHeight = 4.5;
    const spacing = totalHeight / (count - 1);
    return Array.from({ length: count }, (_, i) => {
      const y = totalHeight / 2 - i * spacing;
      const isAccent = i === 2; // andar 3 destacado (vermelho)
      const w = 1.5 - Math.abs(i - count / 2) * 0.08;
      return { y, w, isAccent, depth: 0.06 };
    });
  }, []);

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
      g.rotation.y = t * 0.18;
      g.position.y = Math.sin(t * 0.4) * 0.08;
    }

    particles.forEach((p, i) => {
      const mesh = particlesRef.current[i];
      if (!mesh) return;
      const yPhase = ((t * p.speed + p.seed) % 5) - 2.5;
      const angle = p.angle + t * 0.2;
      mesh.position.set(
        Math.cos(angle) * p.radius,
        yPhase,
        Math.sin(angle) * p.radius,
      );
      const fadeT = 1 - Math.abs(yPhase) / 2.5;
      const mat = mesh.material as { opacity: number };
      mat.opacity = Math.max(0.1, fadeT * 0.7);
    });
  });

  return (
    <group ref={groupRef} scale={0.8}>
      {floors.map((f, i) => (
        <group key={`floor-${i}`} position={[0, f.y, 0]}>
          <lineSegments geometry={edgesGeoms[i]}>
            <lineBasicMaterial
              color={f.isAccent ? "#FB3640" : "#F5F2ED"}
              transparent
              opacity={f.isAccent ? 0.95 : 0.7}
              linewidth={1}
            />
          </lineSegments>
          {f.isAccent && (
            <mesh position={[0, 0, 0]}>
              <icosahedronGeometry args={[0.06, 0]} />
              <meshBasicMaterial color="#FB3640" transparent opacity={1} />
            </mesh>
          )}
        </group>
      ))}

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
   APP — Mind map 3D com tubos curvos (sistema interconectado)
   ============================================================ */

function AppScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const nodesRef = useRef<(Group | null)[]>([]);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

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

  const tubes = useMemo(() => {
    const root = nodes[0].pos;
    return nodes.slice(1).map((n) => {
      const mid = new Vector3()
        .addVectors(root, n.pos)
        .multiplyScalar(0.5)
        .add(new Vector3(0, 0, 0.6 * Math.sign(n.pos.x || 0.1)));
      const curve = new CatmullRomCurve3([root.clone(), mid, n.pos.clone()]);
      return new TubeGeometry(curve, 24, 0.012, 6, false);
    });
  }, [nodes]);

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
      g.rotation.y = t * 0.12;
      g.rotation.x = Math.sin(t * 0.3) * 0.06;
    }

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
