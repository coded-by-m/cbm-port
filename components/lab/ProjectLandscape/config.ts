import { LAYERS } from "@/components/lab/TerrainMesh/config";

/**
 * Posição e escala dos 3 fragmentos sobre o terreno.
 *
 * Vista única, fixa. Central em x=0 z=0 (escala 2.6); laterais em x=±3 z=-1.5
 * (escala 2.4). Os 3 cabem simultaneamente no viewport com FOV=42° em z=15.
 * O leve recuo em z + scale menor dos laterais cria profundidade sem precisar
 * pan de câmera.
 */
export interface FragmentSlot {
  /** Índice estável (0..N-1) usado para ordenação. */
  index: number;
  x: number;
  z: number;
  /** Multiplicador de escala da geometria (1.0 = tamanho default). */
  scale: number;
  /** Seed do PRNG para variar a silhueta triangular. */
  seed: number;
  /** Slug do case em `data/cases.ts`. */
  slug: string;
}

/**
 * Layout em corredor de profundidade ("tunnel").
 *
 * 6 fragmentos distribuídos ao longo de Z (espaçamento 5 unidades), com leve
 * serpentina em X (±1.5) pra quebrar a leitura de fila. A câmera percorre
 * o eixo Z conforme o usuário scrolla.
 *
 * Mais próximo (z=-2) é o que aparece primeiro; mais distante (z=-27) é o
 * último alcançável. Scale uniforme — distância da câmera + fog fazem o
 * trabalho de hierarquia visual.
 */
export const FRAGMENT_SLOTS: FragmentSlot[] = [
  { index: 0, x: 0, z: -2, scale: 2.4, seed: 17, slug: "machado-plataformas" },
  { index: 1, x: 1.5, z: -7, scale: 2.4, seed: 137, slug: "estudio-mendes" },
  { index: 2, x: -1.5, z: -12, scale: 2.4, seed: 211, slug: "rota-clinica" },
  { index: 3, x: 1.5, z: -17, scale: 2.4, seed: 73, slug: "industrial-tba" },
  { index: 4, x: -1.5, z: -22, scale: 2.4, seed: 191, slug: "ecommerce-tba" },
  { index: 5, x: 0, z: -27, scale: 2.4, seed: 257, slug: "education-tba" },
];

/** Slug do fragmento que abre automaticamente quando a Paisagem entra. */
export const INITIAL_ACTIVE_SLUG = "machado-plataformas";

/**
 * Câmera percorre Z conforme o scroll.
 *
 * Movimento linear single-axis (sem keyframes em arco / sem pan X). Active
 * deriva da posição Z da câmera — não há slideshow paralelo que possa
 * conflitar.
 */
export const TUNNEL = {
  /** Z inicial da câmera (em frente ao primeiro fragmento). */
  startZ: 4,
  /** Z final (depois do último fragmento). */
  endZ: -30,
  /** Altura da câmera. */
  cameraY: 4.5,
  /** Y do target (ligeiramente abaixo pra criar tilt down sutil). */
  targetY: 0.5,
  /** Distância à frente da câmera onde o target fica (look-ahead). */
  lookAhead: 10,
  /** Altura de scroll dedicada (em vh). */
  scrollVh: 350,
} as const;

/** Delay (ms) antes de auto-ativar o fragmento inicial — dá tempo do flip assentar. */
export const INITIAL_ACTIVE_DELAY = 1000;

/**
 * Override visual dos fragmentos especificamente na Paisagem (vs Lab).
 *
 * Bumped opacities para separar do terreno (mesma técnica wireframe, mesma cor
 * base — sem contraste, malhas se confundiam). Inativos puxam pra cor do
 * terreno via lerp de cor (não só opacity).
 */
export const FRAGMENT_VISUAL = {
  edgeColor: "#F5F2ED",
  edgeNormalOpacity: 0.85,
  edgeHighlightOpacity: 1.0,
  edgeWidth: 2.2,
  nodeColor: "#F5F2ED",
  nodeNormalOpacity: 0.95,
  nodeHighlightOpacity: 1.0,
  apexColor: "#FB3640",
  /** Cor pra qual edges/nodes de inativos puxam (tom de meio do terreno). */
  dimColor: "#6b7a72",
  /** Bump extra do apex no hover. */
  apexHighlightScale: 0.45,
  /** Escala adicional aplicada ao destaque. */
  highlightScale: 1.18,
  /** Elevação sobre o terreno. */
  surfaceLift: 0.4,
  highlightLift: 0.18,
  /** Avanço em z (em direção à câmera) do ativo. */
  activePushZ: 0.8,
  /** Multiplicador de opacidade aplicado a inativos quando há ativo. */
  dimMultiplier: 0.3,
  /** Velocidade do lerp do dim. */
  dimLerpSpeed: 4,
} as const;

/**
 * Geometria da torre triangular ascendente.
 *
 * 3 níveis: base (3 nós) → meio rotacionado 60° (3 nós) → apex.
 */
export const TOWER = {
  baseRadius: 0.34,
  midRadius: 0.22,
  midHeight: 0.4,
  apexHeight: 0.95,
} as const;

/** Index do apex no array de nós retornado por `buildTower`. */
export const APEX_INDEX = 6;

/** Linha de rede ligando os 3 apexes ao longo do horizonte. */
export const NETWORK_LINE = {
  color: "#F5F2ED",
  baseOpacity: 0.1,
  activeOpacity: 0.55,
  lineWidth: 1.2,
  lerpSpeed: 4,
} as const;

/** Base ring discreto sob cada fragmento, ancorando ao terreno. */
export const BASE_RING = {
  pointCount: 12,
  radiusFactor: 0.85,
  color: "#F5F2ED",
  baseOpacity: 0.25,
  activeOpacity: 0.55,
  pointSize: 0.04,
  lerpSpeed: 4,
} as const;

/** Halo radial sutil atrás do fragmento ativo. */
export const ACTIVE_GLOW = {
  color: "#F5F2ED",
  peakOpacity: 0.18,
  sizeFactor: 2.4,
} as const;

/** Tempos do slideshow auto-rotativo. */
export const SLIDESHOW = {
  /** Tempo (ms) que cada fragmento fica ativo antes do próximo entrar. */
  holdDuration: 6000,
  /** Duração total da transição direcional do card (ms). */
  transitionDuration: 600,
} as const;

/** Layer do terreno que hospeda os fragmentos. */
export const HOST_LAYER = LAYERS[0];

/** Card HTML ancorado ao fragmento ativo. */
export const CARD = {
  offsetX: 32,
  offsetY: 28,
  margin: 24,
  widthDesktop: 480,
  heightDesktop: 280,
  fadeInDuration: 0.35,
  fadeOutDuration: 0.2,
} as const;
