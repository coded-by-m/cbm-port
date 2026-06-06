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
    name: "terrain",
    segX: 90,
    segZ: 64,
    sizeX: 50,
    sizeZ: 36,
    xOffset: 0,
    yOffset: 0,
    zOffset: 0,
    heightAmp: 0.55,
    jitter: 0.22,
    seed: 137,
    calmRadius: 0,
    calmFalloff: 0.5,
    calmMin: 0.78,
    edgeColor: "#7a7a7a",
    edgeOpacity: 0.28,
    fillLow: "#0a0a0a",
    fillHigh: "#2a2a2a",
    fillOpacity: 0.65,
    driftAmp: 0.1,
    driftSpeed: 0.06,
    driftPhase: 0,
    buildDelay: 0,
  },
];

/** Tempos (em segundos) da construção do terreno. Lento e progressivo. */
export const TIMING = {
  startDelay: 0.4,
  buildDuration: 2.6,
} as const;

/**
 * Parâmetros do noise procedural (fBm 2D).
 *
 * `amplitude` multiplica `layer.heightAmp` — controle global do relevo.
 * `frequency` é a escala XZ do noise — menor = montanhas maiores.
 * `octaves`/`lacunarity`/`gain` controlam o detalhe fractal.
 * `timeSpeed`/`timeWobble` dão a respiração orgânica sem deriva real.
 */
export const NOISE = {
  amplitude: 2.6,
  frequency: 0.28,
  octaves: 3,
  lacunarity: 2.05,
  gain: 0.4,
  /** Expoente da curva de contraste (1 = linear, <1 = empurra para os extremos, >1 = comprime). */
  contrast: 1.3,
  /**
   * Drift contínuo do conteúdo do noise (unidades de mundo por segundo).
   * Faz o terreno "fluir" lentamente quando o cursor está parado — vivo, mas
   * tranquilo. Combinado com `timeWobble` (respiração), dá a sensação de
   * cena observada, não estática.
   */
  driftSpeedX: 0.14,
  driftSpeedZ: 0.09,
  /**
   * Mapeamento de altura → cor. `colorGain` é a amplitude do gradiente
   * (quanto do range é usado para variar cor). `colorFloor` é o piso —
   * h=0 mapeia para esse ponto do gradiente, evitando vales como buracos
   * pretos. Cristas ainda atingem `fillHigh`, só vales muito profundos
   * caem em `fillLow`.
   */
  colorGain: 0.6,
  colorFloor: 0.4,
  timeSpeed: 0.08,
  timeWobble: 0.12,
} as const;

/**
 * Lift localizado do terreno sob o cursor. Em vez de mover todo o noise, o
 * relevo se eleva levemente numa área circular ao redor do ponto onde o
 * usuário está com o cursor — fica claro que "isso aqui responde a mim",
 * mas sem deslocar o resto.
 *
 * `radius` = raio (em unidades locais do terreno) da área afetada.
 * `amplitude` = altura máxima do lift no centro do hover (somada ao relevo
 *   base; valores típicos ≈ 20-30% da altura máxima do noise).
 * `lerp` = suavidade do alinhamento do centro do lift com o cursor
 *   (menor = lift "arrasta" atrás do cursor).
 */
export const CURSOR_HOVER = {
  radius: 3.2,
  amplitude: 0.28,
  lerp: 0.18,
} as const;

/**
 * Câmera cinematográfica. Posição base + deriva extremamente lenta (paralaxe),
 * olhando o terreno de um ângulo elevado. Sensação de observação, não de voo.
 */
export const CAMERA = {
  position: [0, 5.2, 15] as const,
  fov: 42,
  target: [0, -0.8, -0.6] as const,
  driftX: 0.7,
  driftY: 0.28,
  driftZ: 0.35,
  speedX: 0.045,
  speedY: 0.06,
  speedZ: 0.035,
} as const;
