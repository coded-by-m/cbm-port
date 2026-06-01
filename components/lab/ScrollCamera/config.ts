/**
 * Scroll Camera — configuração.
 *
 * Trilha narrativa em profundidade: a câmera percorre a paisagem com 9
 * projetos surgindo em sequência. Cada projeto tem seu momento exclusivo.
 */

import { PROJECT_CARDS } from "@/components/lab/HtmlOverlay/config";

export const SCROLL_LENGTH = {
  desktop: 1200,
  compact: 900,
} as const;

/**
 * Posições dos 9 fragmentos para o percurso narrativo.
 * Distribuídos em profundidade (Z decrescente) com alternância lateral.
 */
export const SCROLL_POSITIONS: Array<{ x: number; z: number }> = [
  { x: -2.6, z:  3.2 },  // A — próximo, esquerda
  { x:  2.4, z:  1.8 },  // B — próximo, direita
  { x: -1.2, z:  0.0 },  // C — centro-esquerda
  { x:  3.6, z: -0.8 },  // D — direita profunda
  { x: -3.4, z: -1.6 },  // E — esquerda profunda
  { x:  0.8, z: -3.0 },  // F — centro
  { x: -2.0, z: -4.4 },  // G — esquerda fundo
  { x:  2.8, z: -5.6 },  // H — direita fundo
  { x: -0.4, z: -7.0 },  // I — centro fundo
];

export interface Pose {
  p: number;
  pos: [number, number, number];
  tgt: [number, number, number];
}

/**
 * Trilha de câmera — 9 projetos.
 * Câmera mais baixa (Y ~2.0-2.4) para centralizar fragmentos na viewport.
 * Percurso: ampla → serpenteia entre projetos → ampla final.
 */
export const SCROLL_POSES: Pose[] = [
  { p: 0.000, pos: [ 0.0,  2.6,  7.0], tgt: [ 0.0, -0.3,  1.0] },
  // A
  { p: 0.060, pos: [-1.4,  2.0,  5.4], tgt: [-2.6, -0.4,  2.8] },
  { p: 0.100, pos: [-1.2,  1.8,  4.8], tgt: [-2.6, -0.4,  2.8] },
  // B
  { p: 0.155, pos: [ 1.2,  2.0,  4.0], tgt: [ 2.4, -0.4,  1.4] },
  { p: 0.200, pos: [ 1.4,  1.8,  3.6], tgt: [ 2.4, -0.4,  1.4] },
  // C
  { p: 0.255, pos: [-0.4,  2.0,  2.4], tgt: [-1.2, -0.4, -0.4] },
  { p: 0.310, pos: [-0.6,  1.8,  1.8], tgt: [-1.2, -0.4, -0.4] },
  // D
  { p: 0.365, pos: [ 2.0,  2.0,  1.2], tgt: [ 3.6, -0.4, -1.2] },
  { p: 0.420, pos: [ 2.2,  1.8,  0.6], tgt: [ 3.6, -0.4, -1.2] },
  // E
  { p: 0.475, pos: [-1.8,  2.0,  0.2], tgt: [-3.4, -0.4, -2.0] },
  { p: 0.530, pos: [-2.0,  1.8, -0.4], tgt: [-3.4, -0.4, -2.0] },
  // F
  { p: 0.585, pos: [ 0.4,  2.0, -1.2], tgt: [ 0.8, -0.4, -3.4] },
  { p: 0.640, pos: [ 0.2,  1.8, -1.8], tgt: [ 0.8, -0.4, -3.4] },
  // G
  { p: 0.695, pos: [-1.0,  2.0, -2.8], tgt: [-2.0, -0.4, -4.8] },
  { p: 0.750, pos: [-1.2,  1.8, -3.4], tgt: [-2.0, -0.4, -4.8] },
  // H
  { p: 0.805, pos: [ 1.6,  2.0, -4.0], tgt: [ 2.8, -0.4, -6.0] },
  { p: 0.860, pos: [ 1.8,  1.8, -4.6], tgt: [ 2.8, -0.4, -6.0] },
  // I
  { p: 0.900, pos: [-0.2,  2.0, -5.4], tgt: [-0.4, -0.4, -7.4] },
  { p: 0.945, pos: [ 0.0,  1.8, -6.0], tgt: [-0.4, -0.4, -7.4] },
  // Final
  { p: 1.000, pos: [ 0.0,  2.8,  7.0], tgt: [ 0.0, -0.3,  1.0] },
];

export interface VisibilityEnvelope {
  fadeInStart: number;
  activeFrom: number;
  activeTo: number;
  fadeOutEnd: number;
  dormant: number;
}

/**
 * Envelopes de visibilidade — 9 projetos, janelas exclusivas.
 */
export const VISIBILITY_ENVELOPES: VisibilityEnvelope[] = [
  { fadeInStart: 0.03, activeFrom: 0.07, activeTo: 0.12,  fadeOutEnd: 0.15,  dormant: 0 },
  { fadeInStart: 0.14, activeFrom: 0.17, activeTo: 0.22,  fadeOutEnd: 0.25,  dormant: 0 },
  { fadeInStart: 0.24, activeFrom: 0.27, activeTo: 0.33,  fadeOutEnd: 0.36,  dormant: 0 },
  { fadeInStart: 0.34, activeFrom: 0.37, activeTo: 0.44,  fadeOutEnd: 0.47,  dormant: 0 },
  { fadeInStart: 0.46, activeFrom: 0.49, activeTo: 0.55,  fadeOutEnd: 0.58,  dormant: 0 },
  { fadeInStart: 0.57, activeFrom: 0.60, activeTo: 0.66,  fadeOutEnd: 0.69,  dormant: 0 },
  { fadeInStart: 0.68, activeFrom: 0.71, activeTo: 0.77,  fadeOutEnd: 0.80,  dormant: 0 },
  { fadeInStart: 0.79, activeFrom: 0.82, activeTo: 0.88,  fadeOutEnd: 0.91,  dormant: 0 },
  { fadeInStart: 0.89, activeFrom: 0.91, activeTo: 0.96,  fadeOutEnd: 0.99,  dormant: 0 },
];

export const ACTIVE_RANGES = VISIBILITY_ENVELOPES.map((env, i) => ({
  id:   PROJECT_CARDS[i]?.id ?? `unknown-${i}`,
  from: env.activeFrom,
  to:   env.activeTo,
}));

export const SCROLL_CARDS = PROJECT_CARDS.map((card, i) => ({
  ...card,
  x: SCROLL_POSITIONS[i]?.x ?? card.x,
  z: SCROLL_POSITIONS[i]?.z ?? card.z,
}));

export const CAMERA_IDLE = {
  amplitude: 0.04,
  speedX:    0.18,
  speedY:    0.24,
} as const;
