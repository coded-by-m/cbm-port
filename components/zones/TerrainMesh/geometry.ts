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
import { CURSOR_HOVER, LAYERS, NOISE } from "./config";
import type { CursorHover } from "./useCursorHover";
const { colorGain: COLOR_GAIN, colorFloor: COLOR_FLOOR } = NOISE;
import { fbm2D } from "./noise";

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
 * Altura do terreno em (x, z) no instante t.
 *
 * fBm 2D (value noise, 4 oitavas) dá cristas com hierarquia técnica — blocos
 * grandes + detalhe fino, sem o aspecto "ondulado" da soma de senos. O input
 * é deslocado por `(offsetX, offsetZ)` para permitir navegação por drag sem
 * mover a geometria nem a câmera: o **conteúdo do noise** rola por baixo da
 * malha finita. Um leve `timeWobble` no input cria a respiração orgânica.
 *
 * O amortecimento radial ("centro calmo") permanece ancorado às coordenadas
 * locais da malha — a área plana fica sempre no meio da viewport mesmo
 * arrastando, abrindo espaço para fragmentos/cards.
 */
export function sampleHeight(
  x: number,
  z: number,
  t: number,
  layer: LayerConfig,
  offsetX = 0,
  offsetZ = 0,
): number {
  const f = NOISE.frequency;
  const tw = NOISE.timeWobble;
  const ts = NOISE.timeSpeed;
  // Drift contínuo: o conteúdo do noise flui lentamente sob a câmera,
  // dando a sensação de cena viva mesmo sem cursor próximo.
  const nx =
    (x + offsetX + t * NOISE.driftSpeedX) * f + Math.sin(t * ts) * tw;
  const nz =
    (z + offsetZ + t * NOISE.driftSpeedZ) * f + Math.cos(t * ts * 0.83) * tw;

  let h = fbm2D(nx, nz, layer.seed, NOISE.octaves, NOISE.lacunarity, NOISE.gain);
  // fBm tende a se concentrar perto de 0 (central-limit). A curva sign·|h|^c
  // empurra valores intermediários para os extremos — relevo legível sem
  // perder a forma natural do noise.
  h = Math.sign(h) * Math.pow(Math.abs(h), NOISE.contrast);
  h *= layer.heightAmp * NOISE.amplitude;

  const rx = x / (layer.sizeX * 0.5);
  const rz = z / (layer.sizeZ * 0.5);
  const d = Math.min(1, Math.hypot(rx, rz));
  const calm = smoothstep(layer.calmRadius, layer.calmRadius + layer.calmFalloff, d);
  return h * (layer.calmMin + (1 - layer.calmMin) * calm);
}

/**
 * Altura final do terreno em coordenadas de mundo (inclui `yOffset` da camada).
 * Use para posicionar pirâmides, marcadores ou cards sobre a superfície.
 *
 * @param layerName nome da camada a amostrar. O config atual usa um único
 *   layer `"terrain"`; o fallback retorna a única camada disponível, então
 *   chamadas com nomes legados (`foreground`/`midground`/`background`)
 *   continuam funcionando.
 */
export function getTerrainHeight(
  x: number,
  z: number,
  t = 0,
  offsetX = 0,
  offsetZ = 0,
  layerName: string = "terrain",
): number {
  const layer =
    LAYERS.find((l) => l.name === layerName) ?? LAYERS[LAYERS.length - 1];
  return sampleHeight(x, z, t, layer, offsetX, offsetZ) + layer.yOffset;
}

/** Faixa esperada do fBm (≈ -1..1) escalada pela amplitude global. */
const HEIGHT_RANGE = NOISE.amplitude;

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
/**
 * Fator de fade nas bordas do mesh (0 na borda, 1 no interior).
 * Usa as 15% externas de cada eixo para transição suave — o mesh
 * desaparece gradualmente em vez de ter um corte abrupto.
 */
function edgeFade(x: number, z: number, layer: LayerConfig): number {
  const halfX = layer.sizeX * 0.5;
  const halfZ = layer.sizeZ * 0.5;
  const margin = 0.15;
  const fadeX = 1 - smoothstep(halfX * (1 - margin), halfX, Math.abs(x));
  const fadeZ = 1 - smoothstep(halfZ * (1 - margin), halfZ, Math.abs(z));
  return fadeX * fadeZ;
}

export function updateTerrain(
  geometry: BufferGeometry,
  layer: LayerConfig,
  t: number,
  reveal: number,
  low: Color,
  high: Color,
  bg?: Color,
  hover?: CursorHover,
): void {
  const position = geometry.attributes.position as BufferAttribute;
  const color = geometry.attributes.color as BufferAttribute;
  const pos = position.array as Float32Array;
  const col = color.array as Float32Array;

  const range = HEIGHT_RANGE * layer.heightAmp;
  const bgColor = bg ?? new Color(0x000f08);

  // Lift localizado sob o cursor: pré-calcula raio ao quadrado pra evitar
  // `Math.sqrt` em vértices fora da área de hover.
  const hoverActive = hover?.active ?? false;
  const hx = hover?.x ?? 0;
  const hz = hover?.z ?? 0;
  const hoverR = CURSOR_HOVER.radius;
  const hoverR2 = hoverR * hoverR;
  const hoverA = CURSOR_HOVER.amplitude;

  for (let i = 0; i < position.count; i += 1) {
    const x = pos[i * 3];
    const z = pos[i * 3 + 2];
    const h = sampleHeight(x, z, t, layer);
    const fade = edgeFade(x, z, layer);

    let lift = 0;
    if (hoverActive) {
      const dx = x - hx;
      const dz = z - hz;
      const d2 = dx * dx + dz * dz;
      if (d2 < hoverR2) {
        // Bell curve: smoothstep no fator de proximidade (1 no centro, 0 na borda).
        const u = 1 - Math.sqrt(d2) / hoverR;
        lift = hoverA * u * u * (3 - 2 * u);
      }
    }

    pos[i * 3 + 1] = (h + lift) * reveal * fade;

    const n = clamp01((h / range) * COLOR_GAIN + COLOR_FLOOR);
    const lr = low.r + (high.r - low.r) * n;
    const lg = low.g + (high.g - low.g) * n;
    const lb = low.b + (high.b - low.b) * n;
    col[i * 3] = bgColor.r + (lr - bgColor.r) * fade;
    col[i * 3 + 1] = bgColor.g + (lg - bgColor.g) * fade;
    col[i * 3 + 2] = bgColor.b + (lb - bgColor.b) * fade;
  }

  position.needsUpdate = true;
  color.needsUpdate = true;
}
