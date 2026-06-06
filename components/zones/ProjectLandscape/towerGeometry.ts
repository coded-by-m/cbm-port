import { TOWER } from "./config";

export type Vec3 = [number, number, number];

export interface TowerGeometry {
  nodes: Vec3[];
  edges: [Vec3, Vec3][];
  apex: Vec3;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Torre triangular ascendente — assinatura da Paisagem.
 *
 * 3 níveis: base (0,1,2) → meio rotacionado 60° (3,4,5) → apex (6).
 * 15 arestas: 3 base + 3 meio + 6 base↔meio em estrela + 3 meio↔apex.
 *
 * Jitter determinístico por seed evita fragmentos idênticos sem comprometer
 * a leitura vertical da silhueta.
 */
export function buildTower(seed: number): TowerGeometry {
  const rand = mulberry32(seed);

  const base: Vec3[] = [];
  for (let i = 0; i < 3; i += 1) {
    const angle =
      -Math.PI / 2 + (i * Math.PI * 2) / 3 + (rand() - 0.5) * 0.5;
    const radius = TOWER.baseRadius * (0.85 + rand() * 0.3);
    base.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
  }

  const mid: Vec3[] = [];
  for (let i = 0; i < 3; i += 1) {
    const angle =
      -Math.PI / 2 + (i * Math.PI * 2) / 3 + Math.PI / 3 + (rand() - 0.5) * 0.5;
    const radius = TOWER.midRadius * (0.85 + rand() * 0.3);
    const y = TOWER.midHeight * (0.9 + rand() * 0.2);
    mid.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
  }

  const apex: Vec3 = [
    (rand() - 0.5) * 0.16,
    TOWER.apexHeight * (0.85 + rand() * 0.3),
    (rand() - 0.5) * 0.16,
  ];

  const nodes: Vec3[] = [...base, ...mid, apex];

  const edges: [Vec3, Vec3][] = [
    [base[0], base[1]],
    [base[1], base[2]],
    [base[2], base[0]],
    [mid[0], mid[1]],
    [mid[1], mid[2]],
    [mid[2], mid[0]],
    [base[0], mid[0]],
    [base[0], mid[2]],
    [base[1], mid[1]],
    [base[1], mid[0]],
    [base[2], mid[2]],
    [base[2], mid[1]],
    [mid[0], apex],
    [mid[1], apex],
    [mid[2], apex],
  ];

  return { nodes, edges, apex };
}
