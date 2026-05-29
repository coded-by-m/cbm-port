/**
 * Terrain Mesh — geometria procedural.
 *
 * Gera um heightfield triangulado por camada: uma grade no plano XZ, com
 * jitter nos vértices internos para um triangulado irregular (técnico, não um
 * grid perfeito), e altura (Y) dada por uma soma de senos de baixa frequência
 * — organizada e elegante, nunca turbulenta. Nada de modelos externos.
 *
 * A mesma geometria é compartilhada pelo preenchimento (vertex colors) e pelo
 * wireframe; animar as posições atualiza os dois de uma vez.
 */

import { BufferAttribute, BufferGeometry, Color } from "three";
import type { LayerConfig } from "./config";

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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Interpolação suave (Hermite) entre dois limites. */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Altura do terreno em (x, z) no instante t. Soma de senos não-harmônicos +
 * um termo mais fino para irregularidade organizada. Os termos animados têm
 * velocidade mínima — a malha "respira", não escorre.
 *
 * Um amortecimento radial ("centro calmo") aplaina a região central de cada
 * camada: cria respiro visual no meio da cena, abre áreas calmas onde futuros
 * fragmentos/projetos poderão aparecer e evita que o relevo compita com textos
 * HTML. As cristas ficam nas bordas, reforçando a moldura de profundidade.
 */
export function sampleHeight(
  x: number,
  z: number,
  t: number,
  layer: LayerConfig,
): number {
  const s = layer.seed * 0.013;
  let h = 0;
  h += Math.sin(x * 0.55 + t * 0.14 + s) * 0.55;
  h += Math.cos(z * 0.5 - t * 0.11 + s) * 0.5;
  h += Math.sin((x + z) * 0.32 + t * 0.09) * 0.35;
  h += Math.sin(x * 1.15 - z * 0.6 + s * 3) * 0.16;
  h *= layer.heightAmp;

  const rx = x / (layer.sizeX * 0.5);
  const rz = z / (layer.sizeZ * 0.5);
  const d = Math.min(1, Math.hypot(rx, rz));
  const calm = smoothstep(layer.calmRadius, layer.calmRadius + layer.calmFalloff, d);
  return h * (layer.calmMin + (1 - layer.calmMin) * calm);
}

/** Soma das amplitudes — usado para normalizar a altura em cor. */
const HEIGHT_RANGE = 0.55 + 0.5 + 0.35 + 0.16;

export interface TerrainGeometry {
  geometry: BufferGeometry;
  count: number;
}

/** Constrói a geometria estática (XZ fixos, Y=0) de uma camada. */
export function buildTerrainGeometry(layer: LayerConfig): TerrainGeometry {
  const rand = mulberry32(layer.seed);
  const cols = layer.segX + 1;
  const rows = layer.segZ + 1;
  const count = cols * rows;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const cellX = layer.sizeX / layer.segX;
  const cellZ = layer.sizeZ / layer.segZ;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = r * cols + c;
      const isEdge = c === 0 || c === layer.segX || r === 0 || r === layer.segZ;

      let x = (c / layer.segX - 0.5) * layer.sizeX;
      let z = (r / layer.segZ - 0.5) * layer.sizeZ;
      if (!isEdge) {
        x += (rand() * 2 - 1) * layer.jitter * cellX;
        z += (rand() * 2 - 1) * layer.jitter * cellZ;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = z;
    }
  }

  const indices: number[] = [];
  for (let r = 0; r < layer.segZ; r += 1) {
    for (let c = 0; c < layer.segX; c += 1) {
      const a = r * cols + c;
      const b = a + 1;
      const cc = a + cols;
      const d = cc + 1;
      indices.push(a, cc, b, b, cc, d);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  return { geometry, count };
}

/**
 * Atualiza alturas e cores de uma camada para o instante `t`.
 *
 * `reveal` (0..1) escala a altura na construção (terreno sobe do plano). A cor
 * vem da altura normalizada (vales escuros, cristas mais claras) — profundidade
 * sem luzes nem shaders, evitando o aspecto chapado.
 */
export function updateTerrain(
  geometry: BufferGeometry,
  layer: LayerConfig,
  t: number,
  reveal: number,
  low: Color,
  high: Color,
): void {
  const position = geometry.attributes.position as BufferAttribute;
  const color = geometry.attributes.color as BufferAttribute;
  const pos = position.array as Float32Array;
  const col = color.array as Float32Array;

  const range = HEIGHT_RANGE * layer.heightAmp;

  for (let i = 0; i < position.count; i += 1) {
    const x = pos[i * 3];
    const z = pos[i * 3 + 2];
    const h = sampleHeight(x, z, t, layer);

    pos[i * 3 + 1] = h * reveal;

    // Vales/planos escuros, apenas as cristas se iluminam: o centro calmo
    // recua para o fundo e não disputa atenção com o conteúdo.
    const n = clamp01(h / range);
    col[i * 3] = low.r + (high.r - low.r) * n;
    col[i * 3 + 1] = low.g + (high.g - low.g) * n;
    col[i * 3 + 2] = low.b + (high.b - low.b) * n;
  }

  position.needsUpdate = true;
  color.needsUpdate = true;
}
