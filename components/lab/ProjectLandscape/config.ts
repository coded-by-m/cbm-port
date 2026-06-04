import { LAYERS } from "@/components/lab/TerrainMesh/config";

/**
 * Posição e escala dos 3 fragmentos sobre o terreno.
 *
 * Layout em **arco de profundidade**: central na frente (z=+1.5, escala 1.4×)
 * e laterais ao fundo (z=-2, escala 1.0×). Quando a câmera passa pelo centro,
 * o fragmento ali aparece com presença visivelmente maior — destaque natural.
 */
export interface FragmentSlot {
  /** Índice estável (0..N-1) usado para sincronizar com a câmera de scroll. */
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

export const FRAGMENT_SLOTS: FragmentSlot[] = [
  { index: 0, x: -7, z: 0, scale: 2.6, seed: 17, slug: "machado-plataformas" },
  { index: 1, x: 0, z: 0, scale: 2.6, seed: 137, slug: "estudio-mendes" },
  { index: 2, x: 7, z: 0, scale: 2.6, seed: 211, slug: "rota-clinica" },
];

/** Slug do fragmento que abre automaticamente quando a Paisagem entra. */
export const INITIAL_ACTIVE_SLUG = "estudio-mendes";

/** Delay (ms) antes de auto-ativar o fragmento inicial — dá tempo do flip assentar. */
export const INITIAL_ACTIVE_DELAY = 1000;

/**
 * Override visual dos fragmentos especificamente na Paisagem (vs Lab).
 *
 * Os valores em `lab/ProjectFragments/config.ts` foram tunados pra um
 * cenário com 9 fragmentos pequenos descobertos por exploração. Na
 * Paisagem temos apenas 3 e a câmera fica mais longe — então precisamos
 * de muito mais contraste e presença para o fragmento ler como "obra".
 */
export const FRAGMENT_VISUAL = {
  edgeColor: "#F5F2ED",
  edgeNormalOpacity: 0.55,
  edgeHighlightOpacity: 1.0,
  edgeWidth: 1.8,
  nodeColor: "#F5F2ED",
  nodeNormalOpacity: 0.7,
  nodeHighlightOpacity: 1.0,
  apexColor: "#FB3640",
  /** Bump extra do apex no hover — virou a "cabeça" do fragmento. */
  apexHighlightScale: 0.45,
  /** Escala adicional aplicada ao destaque (multiplicador local). */
  highlightScale: 1.18,
  /** Elevação adicional sobre o terreno (compensa a escala maior). */
  surfaceLift: 0.4,
  highlightLift: 0.18,
} as const;

/** Layer do terreno que hospeda os fragmentos. */
export const HOST_LAYER = LAYERS[0];

/**
 * Keyframes da câmera de scroll.
 *
 * Em vez de pan linear em X, a câmera percorre 3 poses — uma por fragmento.
 * `useProjectScrollCamera` interpola com smoothstep entre cada par adjacente,
 * dando a sensação de "câmera respirando entre projetos".
 */
export interface CameraKeyframe {
  /** Progresso de scroll (0..1) em que essa pose é atingida. */
  p: number;
  pos: readonly [number, number, number];
  tgt: readonly [number, number, number];
}

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [-4, 5.2, 13], tgt: [-7, -0.5, 0] },
  { p: 0.5, pos: [0, 5.2, 13], tgt: [0, -0.5, 0] },
  { p: 1.0, pos: [4, 5.2, 13], tgt: [7, -0.5, 0] },
];

/** Altura de scroll dedicada ao pan (em vh). */
export const SCROLL_VH = 200;

/** Card HTML ancorado ao fragmento ativo. */
export const CARD = {
  offsetX: 32,
  offsetY: 28,
  margin: 24,
  /** Largura desktop do card (px). */
  widthDesktop: 480,
  /** Altura aproximada (px) — usado pra clamp. */
  heightDesktop: 280,
  /** Duração do fade in/out do card (s). */
  fadeInDuration: 0.35,
  fadeOutDuration: 0.2,
} as const;
