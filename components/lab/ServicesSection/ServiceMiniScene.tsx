"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group } from "three";
import type { ServiceVariant } from "@/data/services";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Mini-scene 3D dentro do card de serviço.
 *
 * 3 variants literais (lê em segundos o que o serviço é):
 *  - "landing": página tall vertical com blocks internos descendo
 *  - "institutional": sitemap (página central + filhas conectadas)
 *  - "app": dashboard (frame + widgets internos animando)
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
      camera={{ position: [0, 0, 6], fov: 35 }}
      style={{ background: "transparent" }}
    >
      {variant === "landing" && <LandingScene active={active} />}
      {variant === "institutional" && <InstitutionalScene active={active} />}
      {variant === "app" && <AppScene active={active} />}
    </Canvas>
  );
}

/* -------------------- LANDING: página tall com sections deslizando -------------------- */

function LandingScene({ active }: { active: boolean }) {
  const innerGroupRef = useRef<Group>(null);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // Frame externo: retângulo vertical tall (proporção ~9:16, página de smartphone).
  const frameWidth = 1.5;
  const frameHeight = 3.4;

  // Sections internas: 6 blocos horizontais empilhados verticalmente.
  // O grupo inteiro desliza Y pra simular scroll vertical de uma landing.
  const sections = useMemo(() => {
    const count = 6;
    const sectionHeight = 1.0;
    const totalHeight = count * sectionHeight;
    const blocks: Array<{
      yCenter: number;
      width: number;
      isAccent: boolean;
    }> = [];
    for (let i = 0; i < count; i++) {
      const yCenter = (totalHeight / 2) - (i * sectionHeight) - sectionHeight / 2;
      blocks.push({
        yCenter,
        width: frameWidth * (0.55 + (i % 3) * 0.15), // varia largura
        isAccent: i === 2, // 1 bloco vermelho (eco do CTA "Iniciar")
      });
    }
    return { blocks, totalHeight };
  }, [frameWidth]);

  useFrame((_, delta) => {
    speedRef.current = lerp(
      speedRef.current,
      active ? 1.5 : 1,
      Math.min(1, delta * 4),
    );
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    // Scroll vertical loop — mais lento e contemplativo
    const scrollSpeed = 0.22;
    const cycleHeight = sections.totalHeight;
    const yOffset = ((t * scrollSpeed) % cycleHeight);
    if (innerGroupRef.current) {
      innerGroupRef.current.position.y = -yOffset + cycleHeight / 2 - 0.3;
    }
  });

  // Frame externo (estático, define a "tela").
  const framePoints: [[number, number, number], [number, number, number]][] = [
    [[-frameWidth / 2, frameHeight / 2, 0], [frameWidth / 2, frameHeight / 2, 0]],
    [[frameWidth / 2, frameHeight / 2, 0], [frameWidth / 2, -frameHeight / 2, 0]],
    [[frameWidth / 2, -frameHeight / 2, 0], [-frameWidth / 2, -frameHeight / 2, 0]],
    [[-frameWidth / 2, -frameHeight / 2, 0], [-frameWidth / 2, frameHeight / 2, 0]],
  ];

  return (
    <group>
      {/* Frame */}
      {framePoints.map((p, i) => (
        <Line
          key={`frame-${i}`}
          points={p}
          color="#F5F2ED"
          lineWidth={1.4}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      ))}

      {/* Conteúdo interno (clipped pela máscara) — scrollando */}
      <group ref={innerGroupRef}>
        {/* Repete blocks 2x pra fazer loop suave */}
        {[0, 1].map((repeat) => (
          <group
            key={`rep-${repeat}`}
            position={[0, repeat * sections.totalHeight, 0]}
          >
            {sections.blocks.map((block, i) => {
              const h = 0.7; // altura visual do bloco
              const halfW = block.width / 2;
              const yTop = block.yCenter + h / 2;
              const yBot = block.yCenter - h / 2;
              const linePoints: [
                [number, number, number],
                [number, number, number],
              ][] = [
                [
                  [-halfW, yTop, 0],
                  [halfW, yTop, 0],
                ],
                [
                  [halfW, yTop, 0],
                  [halfW, yBot, 0],
                ],
                [
                  [halfW, yBot, 0],
                  [-halfW, yBot, 0],
                ],
                [
                  [-halfW, yBot, 0],
                  [-halfW, yTop, 0],
                ],
              ];
              const opacity = block.isAccent ? 0.85 : 0.5;
              const color = block.isAccent ? "#FB3640" : "#F5F2ED";
              return (
                <group key={`block-${repeat}-${i}`}>
                  {linePoints.map((p, lpi) => (
                    <Line
                      key={`bp-${lpi}`}
                      points={p}
                      color={color}
                      lineWidth={1.0}
                      transparent
                      opacity={opacity}
                      depthWrite={false}
                    />
                  ))}
                </group>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
}

/* -------------------- INSTITUTIONAL: sitemap (1 página central + 4 filhas) -------------------- */

function InstitutionalScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // Sitemap mais compacto pra caber no canvas (240x160).
  const pages = useMemo(() => {
    return [
      { id: "root", x: 0, y: 1.1, w: 0.95, h: 0.6, isCenter: true },
      { id: "child-1", x: -1.6, y: -0.3, w: 0.78, h: 0.52, isCenter: false },
      { id: "child-2", x: -0.55, y: -0.3, w: 0.78, h: 0.52, isCenter: false },
      { id: "child-3", x: 0.55, y: -0.3, w: 0.78, h: 0.52, isCenter: false },
      { id: "child-4", x: 1.6, y: -0.3, w: 0.78, h: 0.52, isCenter: false },
      { id: "grand", x: -0.55, y: -1.5, w: 0.68, h: 0.44, isCenter: false },
    ];
  }, []);

  const connections = useMemo(
    () => [
      { from: [0, 1.1 - 0.3, 0], to: [-1.6, -0.3 + 0.26, 0] },
      { from: [0, 1.1 - 0.3, 0], to: [-0.55, -0.3 + 0.26, 0] },
      { from: [0, 1.1 - 0.3, 0], to: [0.55, -0.3 + 0.26, 0] },
      { from: [0, 1.1 - 0.3, 0], to: [1.6, -0.3 + 0.26, 0] },
      { from: [-0.55, -0.3 - 0.26, 0], to: [-0.55, -1.5 + 0.22, 0] },
    ],
    [],
  );

  useFrame((_, delta) => {
    speedRef.current = lerp(
      speedRef.current,
      active ? 1.4 : 1,
      Math.min(1, delta * 4),
    );
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    if (groupRef.current) {
      // Levíssima rotação Y pra dar vida — eco de "estrutura sendo observada"
      groupRef.current.rotation.y = Math.sin(t * (TWO_PI / 14)) * 0.08;
    }
  });

  const pageEdges = (p: { x: number; y: number; w: number; h: number }) => {
    const hw = p.w / 2;
    const hh = p.h / 2;
    return [
      [
        [p.x - hw, p.y + hh, 0],
        [p.x + hw, p.y + hh, 0],
      ],
      [
        [p.x + hw, p.y + hh, 0],
        [p.x + hw, p.y - hh, 0],
      ],
      [
        [p.x + hw, p.y - hh, 0],
        [p.x - hw, p.y - hh, 0],
      ],
      [
        [p.x - hw, p.y - hh, 0],
        [p.x - hw, p.y + hh, 0],
      ],
    ] as [[number, number, number], [number, number, number]][];
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Conexões entre páginas */}
      {connections.map((c, i) => (
        <Line
          key={`conn-${i}`}
          points={[c.from, c.to] as [[number, number, number], [number, number, number]]}
          color="#F5F2ED"
          lineWidth={0.9}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      ))}

      {/* Páginas (retângulos wireframe) */}
      {pages.map((p) => {
        const edges = pageEdges(p);
        const opacity = p.isCenter ? 0.9 : 0.6;
        const color = p.isCenter ? "#F5F2ED" : "#F5F2ED";
        return (
          <group key={p.id}>
            {edges.map((e, i) => (
              <Line
                key={`pe-${p.id}-${i}`}
                points={e}
                color={color}
                lineWidth={p.isCenter ? 1.4 : 1.0}
                transparent
                opacity={opacity}
                depthWrite={false}
              />
            ))}
            {/* Apex vermelho na página central (marcador de "raiz") */}
            {p.isCenter && (
              <mesh position={[p.x, p.y + p.h / 2, 0]}>
                <icosahedronGeometry args={[0.06, 0]} />
                <meshBasicMaterial color="#FB3640" transparent opacity={1} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

/* -------------------- APP: dashboard (frame + widgets internos animando) -------------------- */

function AppScene({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const barRefs = useRef<(Group | null)[]>([]);
  const elapsed = useRef(0);
  const speedRef = useRef(1);

  // Frame externo: dashboard wide (4:3 horizontal)
  const frameW = 4.2;
  const frameH = 3.2;

  // Layout interno: header bar (topo) + sidebar (esq) + main grid (centro com widgets)
  const headerH = 0.5;
  const sidebarW = 0.9;

  // 4 widgets no main area (2x2 grid)
  const mainAreaX = -frameW / 2 + sidebarW;
  const mainAreaW = frameW - sidebarW;
  const mainAreaTop = frameH / 2 - headerH;
  const mainAreaBottom = -frameH / 2;
  const mainAreaH = mainAreaTop - mainAreaBottom;

  const widgets = useMemo(() => {
    const cols = 2;
    const rows = 2;
    const gap = 0.15;
    const wW = (mainAreaW - gap * (cols + 1)) / cols;
    const wH = (mainAreaH - gap * (rows + 1)) / rows;
    const arr: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      isAccent: boolean;
    }> = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = mainAreaX + gap + c * (wW + gap) + wW / 2;
        const y = mainAreaTop - gap - r * (wH + gap) - wH / 2;
        arr.push({ x, y, w: wW, h: wH, isAccent: r === 0 && c === 0 });
      }
    }
    return arr;
  }, [mainAreaX, mainAreaW, mainAreaH, mainAreaTop]);

  // Barras animando dentro do widget accent (gráfico de barras)
  const accentBars = useMemo(() => {
    const w = widgets[0];
    if (!w) return [];
    const count = 5;
    const gap = 0.04;
    const totalW = w.w * 0.7;
    const bw = (totalW - gap * (count - 1)) / count;
    const startX = w.x - totalW / 2;
    const baseY = w.y - w.h * 0.3;
    return Array.from({ length: count }, (_, i) => ({
      x: startX + i * (bw + gap) + bw / 2,
      baseY,
      width: bw,
      phase: i * 0.4,
    }));
  }, [widgets]);

  useFrame((_, delta) => {
    speedRef.current = lerp(
      speedRef.current,
      active ? 1.6 : 1,
      Math.min(1, delta * 4),
    );
    elapsed.current += delta * speedRef.current;
    const t = elapsed.current;

    if (groupRef.current) {
      // Leve tilt 3D pra mostrar profundidade
      groupRef.current.rotation.y = 0.15 + Math.sin(t * (TWO_PI / 12)) * 0.04;
      groupRef.current.rotation.x = 0.08;
    }

    // Barras crescendo e descrescendo (data update)
    accentBars.forEach((b, i) => {
      const g = barRefs.current[i];
      if (!g) return;
      const heightT = (Math.sin(t * (TWO_PI / 3) + b.phase) + 1) / 2; // 0..1
      const height = 0.1 + heightT * 0.55;
      g.scale.y = height;
      g.position.y = b.baseY + height / 2;
    });
  });

  // Edges de um retângulo
  const rectEdges = (
    x: number,
    y: number,
    w: number,
    h: number,
  ): [[number, number, number], [number, number, number]][] => {
    const hw = w / 2;
    const hh = h / 2;
    return [
      [
        [x - hw, y + hh, 0],
        [x + hw, y + hh, 0],
      ],
      [
        [x + hw, y + hh, 0],
        [x + hw, y - hh, 0],
      ],
      [
        [x + hw, y - hh, 0],
        [x - hw, y - hh, 0],
      ],
      [
        [x - hw, y - hh, 0],
        [x - hw, y + hh, 0],
      ],
    ];
  };

  // Frame externo
  const frame = rectEdges(0, 0, frameW, frameH);

  // Header bar interno
  const headerEdges = rectEdges(0, frameH / 2 - headerH / 2, frameW, headerH);

  // Sidebar
  const sidebarEdges = rectEdges(
    -frameW / 2 + sidebarW / 2,
    mainAreaBottom + mainAreaH / 2,
    sidebarW,
    mainAreaH,
  );

  // 3 itens dentro do header (nav)
  const headerNavY = frameH / 2 - headerH / 2;
  const headerNavItems = [
    { x: -frameW / 2 + 0.4, w: 0.5 },
    { x: -frameW / 2 + 1.0, w: 0.4 },
    { x: -frameW / 2 + 1.55, w: 0.3 },
  ];

  // 4 itens dentro da sidebar (menu)
  const sidebarMenuItems = useMemo(() => {
    const startY = mainAreaTop - 0.2;
    return [0, 1, 2, 3].map((i) => ({
      y: startY - i * 0.4,
      isActive: i === 1,
    }));
  }, [mainAreaTop]);

  return (
    <group ref={groupRef} scale={0.55}>
      {/* Frame externo */}
      {frame.map((e, i) => (
        <Line
          key={`fr-${i}`}
          points={e}
          color="#F5F2ED"
          lineWidth={1.4}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      ))}

      {/* Header bar */}
      {headerEdges.map((e, i) => (
        <Line
          key={`hd-${i}`}
          points={e}
          color="#F5F2ED"
          lineWidth={0.9}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      ))}

      {/* Header nav items (linhas pequenas) */}
      {headerNavItems.map((item, i) => (
        <Line
          key={`hn-${i}`}
          points={[
            [item.x - item.w / 2, headerNavY, 0],
            [item.x + item.w / 2, headerNavY, 0],
          ]}
          color="#F5F2ED"
          lineWidth={1.2}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      ))}

      {/* Sidebar */}
      {sidebarEdges.map((e, i) => (
        <Line
          key={`sb-${i}`}
          points={e}
          color="#F5F2ED"
          lineWidth={0.9}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      ))}

      {/* Sidebar menu items */}
      {sidebarMenuItems.map((m, i) => (
        <Line
          key={`sm-${i}`}
          points={[
            [-frameW / 2 + 0.2, m.y, 0],
            [-frameW / 2 + sidebarW - 0.2, m.y, 0],
          ]}
          color={m.isActive ? "#FB3640" : "#F5F2ED"}
          lineWidth={m.isActive ? 1.4 : 1.0}
          transparent
          opacity={m.isActive ? 0.9 : 0.55}
          depthWrite={false}
        />
      ))}

      {/* 4 widgets */}
      {widgets.map((w, wi) => (
        <group key={`w-${wi}`}>
          {rectEdges(w.x, w.y, w.w, w.h).map((e, ei) => (
            <Line
              key={`we-${wi}-${ei}`}
              points={e}
              color="#F5F2ED"
              lineWidth={1.0}
              transparent
              opacity={w.isAccent ? 0.75 : 0.5}
              depthWrite={false}
            />
          ))}
        </group>
      ))}

      {/* Barras animadas dentro do widget 0 (gráfico de barras) */}
      {accentBars.map((b, i) => (
        <group
          key={`bar-${i}`}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          position={[b.x, b.baseY, 0.01]}
        >
          <mesh>
            <planeGeometry args={[b.width, 1]} />
            <meshBasicMaterial
              color={i === 2 ? "#FB3640" : "#F5F2ED"}
              transparent
              opacity={i === 2 ? 0.85 : 0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
