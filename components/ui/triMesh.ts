/**
 * Malha triangulada dos botões — a mesma gramática do terreno e do logo.
 *
 * Gerada em pixels reais da caixa (nunca num quadrado esticado): os
 * triângulos mantêm a proporção em qualquer largura. Bordas retas, miolo com
 * jitter determinístico — a malha é a mesma a cada montagem.
 */

export type Point = [number, number];
export type Tri = [Point, Point, Point];

/** PRNG determinístico (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 137;
const JITTER = 0.32;

/** Triângulos que cobrem `w × h` com células de ~`cell` px. */
export function meshTris(w: number, h: number, cell: number): Tri[] {
  if (!w || !h) return [];
  const cols = Math.max(2, Math.round(w / cell));
  const rows = Math.max(2, Math.round(h / cell));
  const rand = mulberry32(SEED);
  const pts: Point[] = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const edge = r === 0 || r === rows || c === 0 || c === cols;
      const jx = edge ? 0 : (rand() * 2 - 1) * JITTER * (w / cols);
      const jy = edge ? 0 : (rand() * 2 - 1) * JITTER * (h / rows);
      pts.push([(c / cols) * w + jx, (r / rows) * h + jy]);
    }
  const out: Tri[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = a + 1;
      const e = a + cols + 1;
      const f = e + 1;
      // Alterna a diagonal: o padrão não lê como grade.
      if ((r + c) % 2) out.push([pts[a], pts[e], pts[b]], [pts[b], pts[e], pts[f]]);
      else out.push([pts[a], pts[e], pts[f]], [pts[a], pts[f], pts[b]]);
    }
  return out;
}

/** Comando SVG `d` de um triângulo. */
export const triD = (t: Tri) =>
  `M${t.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}Z`;

export const centroid = (t: Tri): Point => [
  (t[0][0] + t[1][0] + t[2][0]) / 3,
  (t[0][1] + t[1][1] + t[2][1]) / 3,
];
