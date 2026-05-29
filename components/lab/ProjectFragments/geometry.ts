/**
 * Project Fragments — geometria procedural.
 *
 * Cada fragmento é uma pequena estrutura triangulada emergente: um triângulo
 * de base sobre o terreno + um ápice elevado, conectados por arestas. Lê-se
 * como parte da malha, não como um objeto estranho à paisagem.
 *
 * Uma leve irregularidade (jitter determinístico por seed) evita que os
 * fragmentos pareçam idênticos — técnicos, não repetitivos.
 */

import { FRAGMENT } from "./config";

/** PRNG determinístico (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Vec3 = [number, number, number];

export interface FragmentGeometry {
  /** [base0, base1, base2, apex] — o índice 3 é o ápice (a "ponta" emergente). */
  nodes: Vec3[];
  edges: [Vec3, Vec3][];
  apex: Vec3;
}

/** Constrói os nós e arestas de um fragmento a partir do seed. */
export function buildFragment(seed: number): FragmentGeometry {
  const rand = mulberry32(seed);

  const base: Vec3[] = [];
  for (let i = 0; i < 3; i += 1) {
    const angle =
      -Math.PI / 2 + (i * Math.PI * 2) / 3 + (rand() * 2 - 1) * 0.25;
    const radius = FRAGMENT.baseRadius * (0.85 + rand() * 0.3);
    base.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
  }

  const apex: Vec3 = [
    (rand() * 2 - 1) * 0.08,
    FRAGMENT.apexHeight * (0.85 + rand() * 0.3),
    (rand() * 2 - 1) * 0.08,
  ];

  const nodes: Vec3[] = [...base, apex];
  const edges: [Vec3, Vec3][] = [
    [base[0], base[1]],
    [base[1], base[2]],
    [base[2], base[0]],
    [base[0], apex],
    [base[1], apex],
    [base[2], apex],
  ];

  return { nodes, edges, apex };
}
