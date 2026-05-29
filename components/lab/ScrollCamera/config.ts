/**
 * Scroll Camera — configuração.
 *
 * Valida a narrativa: a câmera percorre a paisagem conforme o scroll, sem voo
 * nem FPS — lenta, observacional, cinematográfica (referência Porsche).
 *
 * Reaproveita Terrain Mesh, Project Fragments e HTML Overlay (sem alterá-los).
 * Não adiciona efeitos/partículas/shaders novos.
 */

import { PROJECT_CARDS } from "@/components/lab/HtmlOverlay/config";

/** Altura do trilho de scroll (a paisagem é maior do que a tela). */
export const SCROLL_LENGTH = {
  desktop: 520,
  compact: 380,
} as const;

/**
 * Deslocamento da câmera em relação ao fragmento em foco (em unidades locais,
 * multiplicado pela escala de fit). Acima e à frente → observação, não voo.
 */
export const FOCUS_OFFSET: [number, number, number] = [0, 1, 2.35];

/** Vida sutil da câmera (micro-deriva), para não parecer trilho rígido. */
export const CAMERA_IDLE = {
  amplitude: 0.05,
  speedX: 0.18,
  speedY: 0.24,
} as const;

export type Keyframe = { p: number; key: "wide" | number };

/**
 * Trilha narrativa (0..1). `wide` = visão ampla; número = índice do fragmento
 * em foco. Os trechos com o mesmo destino são "holds" (a câmera observa).
 *
 * 01 ampla → 02 aproxima A → 03 foco B → 04 foco C → 05 volta à visão ampla.
 */
export const KEYFRAMES: Keyframe[] = [
  { p: 0.0, key: "wide" },
  { p: 0.14, key: "wide" },
  { p: 0.3, key: 0 },
  { p: 0.44, key: 0 },
  { p: 0.58, key: 1 },
  { p: 0.7, key: 1 },
  { p: 0.84, key: 2 },
  { p: 0.92, key: 2 },
  { p: 1.0, key: "wide" },
];

/** Janelas de progresso em que cada fragmento fica ativo (overlay visível). */
export const ACTIVE_RANGES = PROJECT_CARDS.map((card, index) => {
  const windows = [
    [0.26, 0.48],
    [0.54, 0.72],
    [0.8, 0.94],
  ];
  const [from, to] = windows[index] ?? [1, 1];
  return { id: card.id, from, to };
});
