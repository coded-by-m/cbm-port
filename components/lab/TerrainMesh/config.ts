/**
 * Terrain Mesh — configuração e dados da estrutura.
 *
 * Fonte única da verdade para geometria, paleta, tempos, movimento e câmera.
 * Mantém a "lógica" separada da "geometria", das "animações" e da "cena"
 * (mesmo padrão dos experimentos anteriores — ver docs/06).
 *
 * Conceito: primeira versão da futura Paisagem Digital. Ainda não há projetos
 * nem cards — existe apenas o terreno. Uma malha triangulada procedural que
 * transmite profundidade, escala e estrutura: "estou observando uma estrutura
 * digital", não "estou olhando um grid".
 */

/** Paleta de estúdio escuro. Sem neon, sem sci-fi. */
export const COLORS = {
  background: "#000F08",
} as const;

/** Névoa de profundidade (perspectiva atmosférica). Funde o fundo no preto. */
export const FOG = {
  color: "#000F08",
  near: 12,
  far: 40,
} as const;

/** Fração do maior lado do viewport que o raio do terreno deve cobrir. */
export const FIT_RATIO = 0.9;

/** Raio de referência fixo para o fit responsivo — desacoplado do sizeX das camadas. */
export const FIT_RADIUS = 13;

/**
 * Configuração de uma camada de profundidade do terreno.
 *
 * Cada camada é um patch de terreno em um plano de profundidade distinto;
 * sobrepostos e com perspectiva atmosférica (opacidade/cor) criam cordilheiras
 * recuando na profundidade — foreground, midground e background reais.
 */
export interface LayerConfig {
  name: string;
  /** Subdivisões da malha (mais = mais densa). */
  segX: number;
  segZ: number;
  /** Extensão em unidades de mundo. */
  sizeX: number;
  sizeZ: number;
  /** Posição do patch em profundidade/altura. */
  xOffset: number;
  yOffset: number;
  zOffset: number;
  /** Amplitude máxima das elevações. */
  heightAmp: number;
  /** Irregularidade do triangulado (jitter XZ, fração da célula). */
  jitter: number;
  seed: number;
  /**
   * Centro calmo: amortecimento radial da altura. `calmRadius` é onde a calma
   * começa (0..1 do raio), `calmFalloff` a largura da transição e `calmMin` a
   * fração de relevo que sobra no centro (0 = plano total).
   */
  calmRadius: number;
  calmFalloff: number;
  calmMin: number;
  /** Perspectiva atmosférica: arestas e preenchimento. */
  edgeColor: string;
  edgeOpacity: number;
  fillLow: string;
  fillHigh: string;
  fillOpacity: number;
  /** Micro-deslocamento próprio (parallax orgânico em profundidade). */
  driftAmp: number;
  driftSpeed: number;
  driftPhase: number;
  /** Atraso de construção (a cena se monta de trás para frente). */
  buildDelay: number;
}

export const LAYERS: LayerConfig[] = [
  {
    name: "background",
    segX: 48,
    segZ: 32,
    sizeX: 40,
    sizeZ: 28,
    xOffset: 0,
    yOffset: 1.55,
    zOffset: -3.7,
    heightAmp: 0.85,
    jitter: 0.32,
    seed: 71,
    calmRadius: 0.08,
    calmFalloff: 0.5,
    calmMin: 0.5,
    edgeColor: "#3c3c3c",
    edgeOpacity: 0.11,
    fillLow: "#070707",
    fillHigh: "#191919",
    fillOpacity: 0.36,
    driftAmp: 0.12,
    driftSpeed: 0.06,
    driftPhase: 0,
    buildDelay: 0,
  },
  {
    name: "midground",
    segX: 52,
    segZ: 36,
    sizeX: 34,
    sizeZ: 24,
    xOffset: 0,
    yOffset: 0,
    zOffset: -0.5,
    heightAmp: 1,
    jitter: 0.36,
    seed: 137,
    calmRadius: 0,
    calmFalloff: 0.62,
    calmMin: 0.1,
    edgeColor: "#6f6f6f",
    edgeOpacity: 0.22,
    fillLow: "#090909",
    fillHigh: "#262626",
    fillOpacity: 0.52,
    driftAmp: 0.09,
    driftSpeed: 0.08,
    driftPhase: 2.1,
    buildDelay: 0.35,
  },
  {
    name: "foreground",
    segX: 40,
    segZ: 24,
    sizeX: 28,
    sizeZ: 18,
    xOffset: 0,
    yOffset: -1.25,
    zOffset: 2.7,
    heightAmp: 1.05,
    jitter: 0.4,
    seed: 211,
    calmRadius: 0,
    calmFalloff: 0.5,
    calmMin: 0.18,
    edgeColor: "#9a9a9a",
    edgeOpacity: 0.1,
    fillLow: "#0a0a0a",
    fillHigh: "#242424",
    fillOpacity: 0.6,
    driftAmp: 0.14,
    driftSpeed: 0.05,
    driftPhase: 4.3,
    buildDelay: 0.7,
  },
];

/** Tempos (em segundos) da construção do terreno. Lento e progressivo. */
export const TIMING = {
  startDelay: 0.4,
  buildDuration: 2.6,
} as const;

/**
 * Câmera cinematográfica. Posição base + deriva extremamente lenta (paralaxe),
 * olhando o terreno de um ângulo elevado. Sensação de observação, não de voo.
 */
export const CAMERA = {
  position: [0, 3.4, 7.6] as const,
  fov: 42,
  target: [0, -0.1, -0.6] as const,
  driftX: 0.7,
  driftY: 0.28,
  driftZ: 0.35,
  speedX: 0.045,
  speedY: 0.06,
  speedZ: 0.035,
} as const;
