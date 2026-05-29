/**
 * Triangle Lines — geometria procedural.
 *
 * Gera uma treliça triangular (lattice isométrico) por camada e a converte
 * em nós e arestas centrados na origem. Nada de modelos externos: tudo é
 * calculado a partir de `config`.
 *
 * Cada nó e cada aresta recebe um valor `build` (0..1) derivado da distância
 * planar à origem, normalizado globalmente. É essa ordem que faz a estrutura
 * "crescer" do centro para fora — a malha se monta, não aparece pronta.
 */

import { LAYERS, SPACING, type LayerConfig } from "./config";

/** PRNG determinístico (mulberry32): jitter estável entre renders. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SQRT3_2 = Math.sqrt(3) / 2;

type Vec3 = [number, number, number];

interface RawGrid {
  nodes: { x: number; y: number }[];
  edges: [number, number][];
}

/**
 * Treliça triangular: linhas alternadas deslocadas em meio passo formam
 * triângulos equiláteros. As arestas (horizontais + duas diagonais por nó)
 * são o que dá a leitura de malha triangulada.
 */
function triangularGrid(
  cols: number,
  rows: number,
  spacing: number,
  jitter: number,
  rand: () => number,
): RawGrid {
  const nodes: { x: number; y: number }[] = [];
  const edges: [number, number][] = [];
  const rowHeight = spacing * SQRT3_2;
  const idx = (r: number, c: number) => r * cols + c;

  for (let r = 0; r < rows; r += 1) {
    const offset = (r % 2) * (spacing / 2);
    for (let c = 0; c < cols; c += 1) {
      const jx = (rand() * 2 - 1) * jitter * spacing;
      const jy = (rand() * 2 - 1) * jitter * spacing;
      nodes.push({ x: c * spacing + offset + jx, y: r * rowHeight + jy });
    }
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (c < cols - 1) edges.push([idx(r, c), idx(r, c + 1)]);
      if (r < rows - 1) {
        if (r % 2 === 0) {
          if (c - 1 >= 0) edges.push([idx(r, c), idx(r + 1, c - 1)]);
          edges.push([idx(r, c), idx(r + 1, c)]);
        } else {
          edges.push([idx(r, c), idx(r + 1, c)]);
          if (c + 1 <= cols - 1) edges.push([idx(r, c), idx(r + 1, c + 1)]);
        }
      }
    }
  }

  return { nodes, edges };
}

export interface BuiltNode {
  position: Vec3;
  /** 0 = centro (surge primeiro), 1 = mais distante (surge por último). */
  build: number;
}

export interface BuiltEdge {
  points: [Vec3, Vec3];
  /** Surge depois dos seus dois nós. */
  build: number;
}

export interface BuiltLayer {
  layer: LayerConfig;
  nodes: BuiltNode[];
  edges: BuiltEdge[];
}

export interface Lattice {
  layers: BuiltLayer[];
  /** Maior raio planar (mundo) — usado pelo ajuste responsivo de escala. */
  fitRadius: number;
}

/** Constrói todas as camadas e a métrica de fit a partir de `config`. */
export function buildLattice(spacing: number = SPACING): Lattice {
  const centered = LAYERS.map((layer) => {
    const rand = mulberry32(layer.seed);
    const { nodes, edges } = triangularGrid(
      layer.cols,
      layer.rows,
      spacing,
      layer.jitter,
      rand,
    );

    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

    const world = nodes.map((n) => ({
      x: (n.x - cx) * layer.scale,
      y: (n.y - cy) * layer.scale,
    }));

    return { layer, world, edges };
  });

  let maxDist = 0;
  centered.forEach(({ world }) =>
    world.forEach((p) => {
      const d = Math.hypot(p.x, p.y);
      if (d > maxDist) maxDist = d;
    }),
  );
  const fitRadius = maxDist || 1;

  const layers: BuiltLayer[] = centered.map(({ layer, world, edges }) => {
    const build = world.map((p) => Math.hypot(p.x, p.y) / fitRadius);

    const nodes: BuiltNode[] = world.map((p, i) => ({
      position: [p.x, p.y, layer.z],
      build: build[i],
    }));

    const builtEdges: BuiltEdge[] = edges.map(([a, b]) => ({
      points: [
        [world[a].x, world[a].y, layer.z],
        [world[b].x, world[b].y, layer.z],
      ],
      build: Math.max(build[a], build[b]),
    }));

    return { layer, nodes, edges: builtEdges };
  });

  return { layers, fitRadius };
}
