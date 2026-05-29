/**
 * Triangle Lines — configuração e dados da estrutura.
 *
 * Fonte única da verdade para geometria, paleta, tempos e movimento.
 * Mantém a "lógica" separada da "geometria", das "animações" e da "cena"
 * (mesmo padrão do Triangle Loader — ver docs/06).
 *
 * Conceito: o objetivo não é desenhar triângulos, é construir uma estrutura
 * triangulada — uma treliça/malha que parece um sistema sendo montado.
 */

/**
 * Paleta de estúdio escuro. Tons de cinza, sem neon, sem cyberpunk.
 * As arestas escurecem com a profundidade (perspectiva atmosférica): o
 * background some no preto, o foreground é o mais legível.
 */
export const COLORS = {
  background: "#050505",
  node: "#e6e6e6",
} as const;

/** Raio do nó (marcador de vértice). Pequeno — rebite de precisão, não esfera. */
export const NODE_RADIUS = 0.028;

/** Espessura das arestas (Line2, em px lógicos). Fina e constante: leitura de blueprint. */
export const LINE_WIDTH = 1.4;

/** Espaçamento base da treliça triangular, em unidades de mundo (antes do fit). */
export const SPACING = 0.55;

/** Fração do menor lado do viewport que o raio da estrutura deve ocupar. */
export const FIT_RATIO = 0.4;

/**
 * Configuração de uma camada de profundidade.
 *
 * `cols`/`rows` definem a densidade da treliça; `z`/`scale` o plano em
 * profundidade; `edgeOpacity`/`nodeOpacity`/`edgeColor` a perspectiva
 * atmosférica; `drift*` o micro-movimento orgânico próprio da camada.
 */
export interface LayerConfig {
  name: string;
  cols: number;
  rows: number;
  z: number;
  scale: number;
  jitter: number;
  seed: number;
  edgeColor: string;
  edgeOpacity: number;
  nodeOpacity: number;
  driftAmp: number;
  driftPeriod: number;
  driftPhase: number;
}

/**
 * Três planos: background (denso, distante, quase imperceptível), midground
 * (foco principal) e foreground (esparso, próximo da câmera). Criam a
 * sensação espacial — não uma estrutura plana.
 */
export const LAYERS: LayerConfig[] = [
  {
    name: "background",
    cols: 7,
    rows: 4,
    z: -3.2,
    scale: 1.3,
    jitter: 0.06,
    seed: 1117,
    edgeColor: "#474747",
    edgeOpacity: 0.24,
    nodeOpacity: 0.4,
    driftAmp: 0.045,
    driftPeriod: 11,
    driftPhase: 0,
  },
  {
    name: "midground",
    cols: 5,
    rows: 3,
    z: 0,
    scale: 1,
    jitter: 0.07,
    seed: 2239,
    edgeColor: "#808080",
    edgeOpacity: 0.5,
    nodeOpacity: 0.85,
    driftAmp: 0.03,
    driftPeriod: 9,
    driftPhase: 2.1,
  },
  {
    name: "foreground",
    cols: 3,
    rows: 2,
    z: 2,
    scale: 0.72,
    jitter: 0.08,
    seed: 3361,
    edgeColor: "#b2b2b2",
    edgeOpacity: 0.42,
    nodeOpacity: 1,
    driftAmp: 0.05,
    driftPeriod: 7.5,
    driftPhase: 4.3,
  },
];

/**
 * Tempos (em segundos) da construção. Lento e progressivo: os nós surgem do
 * centro para fora, as arestas conectam na mesma onda e os triângulos
 * emergem como consequência. As camadas escalonam de trás para frente.
 */
export const TIMING = {
  startDelay: 0.4,
  layerStagger: 0.55,
  nodePop: 0.55,
  nodeWindow: 1.4,
  edgeStart: 0.45,
  edgeDraw: 0.7,
  edgeWindow: 1.8,
} as const;

/**
 * Estrutura viva — extremamente sutil. Respiração (escala), micro-inclinação
 * e um leve balanço de rotação (yaw oscilante, nunca um giro completo).
 * Nunca parece líquido, fumaça ou videogame: parece uma peça de engenharia
 * que respira. Referência emocional: Porsche.
 */
export const MOTION = {
  breathAmplitude: 0.01,
  breathPeriod: 9,
  tiltAmplitude: 0.02,
  tiltPeriod: 15,
  yawAmplitude: 0.14,
  yawPeriod: 28,
} as const;
