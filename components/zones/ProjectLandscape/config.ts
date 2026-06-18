import { LAYERS } from "@/components/zones/TerrainMesh/config";
import type { ProjectType } from "@/types/case";

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
 * Layout orbital — 6 fragmentos distribuídos em círculo ao redor de um centro.
 *
 * Ângulos a cada 60° (0°, 60°, 120°, 180°, 240°, 300°). Câmera orbita ao redor
 * do centro à distância `ORBIT.cameraRadius`, sempre olhando para o centro.
 * Drag horizontal rotaciona a câmera; auto-rotate lento quando ocioso.
 */
function ringSlot(
  index: number,
  scaleSlug: { scale: number; seed: number; slug: string },
): FragmentSlot {
  const angle = index * ((Math.PI * 2) / 6);
  const r = 5.5;
  return {
    index,
    x: Math.sin(angle) * r,
    z: Math.cos(angle) * r,
    scale: scaleSlug.scale,
    seed: scaleSlug.seed,
    slug: scaleSlug.slug,
  };
}

const FRAGMENT_SCALE = 1.8;

export const FRAGMENT_SLOTS: FragmentSlot[] = [
  ringSlot(0, { scale: FRAGMENT_SCALE, seed: 17, slug: "machado-plataformas" }),
  ringSlot(1, { scale: FRAGMENT_SCALE, seed: 137, slug: "estudio-mendes" }),
  ringSlot(2, { scale: FRAGMENT_SCALE, seed: 211, slug: "rota-clinica" }),
  ringSlot(3, { scale: FRAGMENT_SCALE, seed: 73, slug: "industrial-tba" }),
  ringSlot(4, { scale: FRAGMENT_SCALE, seed: 191, slug: "ecommerce-tba" }),
  ringSlot(5, { scale: FRAGMENT_SCALE, seed: 257, slug: "education-tba" }),
];

/** Slug do fragmento que abre automaticamente quando a Paisagem entra. */
export const INITIAL_ACTIVE_SLUG = "machado-plataformas";

/**
 * Câmera orbital ao redor do centro do círculo de fragmentos.
 *
 * - Auto-rotate lento até primeira interação real
 * - Drag horizontal do mouse / swipe touch → rotaciona manualmente
 * - Click no dot do card → tween GSAP do ângulo até o fragmento alvo
 */
export const ORBIT = {
  /** Raio da câmera ao redor do centro. Maior = mais respiro pros fragmentos. */
  cameraRadius: 13,
  /** Altura Y da câmera. */
  cameraY: 5,
  /** Y do target — abaixo dos fragmentos pra empurrá-los pra cima no frame. */
  targetY: -0.5,
  /** Velocidade do auto-rotate (rad/seg) — ~90s pra dar uma volta. */
  autoRotateSpeed: 0.07,
  /** Sensibilidade do drag (rad por pixel) — drag suave, controle fino. */
  dragSensitivity: 0.003,
  /** Atrito da inércia ao soltar o drag (fator de decay por ~frame @60fps).
      Menor = para mais rápido. */
  inertiaFriction: 0.93,
  /** Abaixo desta velocidade (rad/s) a inércia para e cede pro auto-rotate. */
  inertiaCutoff: 0.06,
  /** Duração do snap pra um fragmento (s) — equilíbrio entre rápido e suave. */
  snapDuration: 2,
  /** Ângulo inicial da câmera (rad). Aponta pro primeiro fragmento. */
  initialAngle: 0,
  /** Amplitude da respiração ambiente (oscila Y). */
  breathAmp: 0.18,
  /** Período da respiração (s). */
  breathPeriod: 6,
} as const;

/**
 * Overrides da órbita no retrato (mobile). *Enhancement pra baixo*: o desktop
 * (`ORBIT`) fica congelado; aqui só ajustamos o enquadramento pra tela estreita.
 *
 * Estratégia "constelação compacta": aperta o anel (`ringScale` < 1, via x/z dos
 * slots — invariante ao ângulo, então não quebra active/snap/dots) pra os
 * vizinhos serem insinuados nas bordas, puxa a câmera pra perto (ativo legível)
 * e abaixa o `targetY` pra empurrar o fragmento ativo pra metade superior,
 * acima do bottom-sheet card.
 */
export const ORBIT_MOBILE = {
  /** Raio da câmera — bem mais longe que o desktop: o zoom de perto deixava o
   *  fragmento gigante; recuado, a constelação respira e lê melhor no retrato. */
  cameraRadius: 15,
  /** Altura Y da câmera. */
  cameraY: 4.6,
  /** Y do target — empurra o ativo pra cima sem cortar o apex no topo. */
  targetY: -0.9,
  /** Multiplicador do raio do anel (aperta a constelação). */
  ringScale: 0.8,
} as const;

/** Largura (px) abaixo da qual usamos o enquadramento mobile. Casa com o card. */
export const MOBILE_MAX_WIDTH = 767;

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
  dimMultiplier: 0.24,
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
  peakOpacity: 0.26,
  sizeFactor: 2.7,
} as const;

/** Pulsação do apex — "sinal vivo" sutil. */
export const APEX_PULSE = {
  /** Período (s) do ciclo no estado idle. */
  idlePeriod: 3,
  /** Amplitude (delta de scale) no idle. */
  idleAmplitude: 0.12,
  /** Período (s) quando ativo — mais rápido. */
  activePeriod: 1.4,
  /** Amplitude quando ativo — mais forte. */
  activeAmplitude: 0.22,
} as const;

/**
 * Faísca que percorre as arestas da torre.
 *
 * Sprite com textura procedural radial (canvas gradient). Centro brilhante,
 * borda fade — sensação de luz real, não geometria. Movimento lento.
 */
export const EDGE_PULSE = {
  /** Tempo (s) por aresta percorrida — lento, contemplativo. */
  timePerEdge: 3.2,
  /** Raio do tetraedro — bem pequeno, partícula discreta. */
  size: 0.025,
  baseOpacity: 0.55,
  activeOpacity: 1.0,
  /** Rotação contínua do tetraedro (rad/s). */
  rotateSpeed: 0.45,
  lerpSpeed: 4,
} as const;

/** Pulso sonar (wireframe que expande) ao tornar-se ativo. */
export const SONAR = {
  /** Duração total da expansão (s). */
  duration: 0.8,
  /** Scale final da expansão. */
  finalScale: 2.0,
  /** Opacidade inicial. */
  startOpacity: 0.7,
  lineWidth: 1.0,
  color: "#F5F2ED",
} as const;

/** Chão técnico transparente sob o fragmento (footprint). */
export const FLOOR = {
  color: "#F5F2ED",
  baseOpacity: 0.05,
  activeOpacity: 0.12,
  lerpSpeed: 4,
  /** Y local (acima do terreno por uma fração pra evitar z-fighting). */
  yOffset: 0.005,
} as const;

/**
 * Cor do apex do fragmento por tipo de projeto. Dessaturada pra coesão com a
 * marca — só o apex carrega a cor; arestas/nós continuam off-white.
 * Coming-soon ignora isto (apex vira off-white via STATUS_VISUAL).
 */
export const PROJECT_TYPE_COLOR: Record<ProjectType, string> = {
  institucional: "#FB3640",
  landing: "#D9A15B",
  webapp: "#5FB0A3",
  ecommerce: "#A98BC9",
} as const;

/** Modificadores visuais por status (publicado vs em breve). */
export const STATUS_VISUAL = {
  /** Multiplicador de opacidade para fragmentos "em breve". */
  comingSoonOpacityMul: 0.65,
  /** Apex em "em breve" perde cor vermelha (vira off-white). */
  comingSoonApexAsOffWhite: true,
} as const;

/** Tempos do slideshow auto-rotativo. */
export const SLIDESHOW = {
  /** Tempo (ms) que cada fragmento fica ativo antes do próximo entrar. */
  holdDuration: 6000,
  /** Duração total da transição direcional do card (ms). */
  transitionDuration: 600,
} as const;

/** Hint inicial "Arraste pra explorar". */
export const HINT = {
  /** Delay (ms) após mount antes do hint aparecer. */
  showDelay: 1800,
  /** Tempo (ms) que o hint fica visível antes de fade automático. */
  autoHideDelay: 8000,
  /** Duração do fade in/out (s). */
  fadeDuration: 0.6,
} as const;

/** Auto-rotate retomada após inatividade. */
export const AUTO_RESUME = {
  /** Tempo (ms) sem interação antes de retomar auto-rotate. */
  idleThreshold: 8000,
} as const;

/** Layer do terreno que hospeda os fragmentos. */
export const HOST_LAYER = LAYERS[0];

/** Card HTML ancorado ao fragmento ativo. */
export const CARD = {
  offsetX: 32,
  offsetY: 28,
  margin: 24,
  widthDesktop: 600,
  heightDesktop: 340,
  fadeInDuration: 0.35,
  fadeOutDuration: 0.2,
} as const;
