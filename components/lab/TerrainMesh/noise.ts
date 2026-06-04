/**
 * Value-noise 2D + fBm — sem dependências externas.
 *
 * Substitui a soma de senos por uma soma fractal de oitavas de noise. Quatro
 * oitavas com lacunaridade 2 e ganho 0.5 produzem cristas com hierarquia
 * (grandes blocos + detalhe técnico) sem o aspecto "demo de Three.js".
 *
 * Determinístico por `seed`. Estável entre frames quando (x, z) e seed não
 * mudam — a "respiração" vem de um leve deslocamento de input no chamador.
 */

const INV_U32 = 1 / 4294967295;

function hash2(xi: number, yi: number, seed: number): number {
  let h = (xi | 0) * 374761393 + (yi | 0) * 668265263 + (seed | 0) * 1274126177;
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) * INV_U32;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Value noise 2D. Saída em 0..1. */
export function valueNoise2D(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);

  const u = smooth(xf);
  const v = smooth(yf);

  const ab = a + (b - a) * u;
  const cd = c + (d - c) * u;
  return ab + (cd - ab) * v;
}

/**
 * Fractional Brownian Motion. Soma `octaves` camadas de noise com frequência
 * crescente (`lacunarity`) e amplitude decrescente (`gain`).
 *
 * Saída normalizada em -1..1.
 */
export function fbm2D(
  x: number,
  y: number,
  seed: number,
  octaves: number,
  lacunarity: number,
  gain: number,
): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += amp * (valueNoise2D(x * freq, y * freq, seed + i * 31) * 2 - 1);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return norm > 0 ? sum / norm : 0;
}
