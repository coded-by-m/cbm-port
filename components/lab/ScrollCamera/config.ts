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
  { x:  0.0, z:  3.0 },  // A
  { x:  0.0, z:  1.5 },  // B
  { x:  0.0, z:  0.0 },  // C
  { x:  0.0, z: -1.5 },  // D
  { x:  0.0, z: -3.0 },  // E
  { x:  0.0, z: -4.5 },  // F
  { x:  0.0, z: -6.0 },  // G
  { x:  0.0, z: -7.5 },  // H
  { x:  0.0, z: -9.0 },  // I
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
  { p: 0.000, pos: [ 0.0,  1.8,  7.0], tgt: [ 0.0,  0.2,  1.0] },
  // A  (z=3.0)
  { p: 0.060, pos: [ 0.0,  1.2,  4.8], tgt: [ 0.0,  0.2,  3.0] },
  { p: 0.100, pos: [ 0.0,  1.0,  4.4], tgt: [ 0.0,  0.2,  3.0] },
  // B  (z=1.5)
  { p: 0.155, pos: [ 0.0,  1.2,  3.3], tgt: [ 0.0,  0.2,  1.5] },
  { p: 0.200, pos: [ 0.0,  1.0,  2.9], tgt: [ 0.0,  0.2,  1.5] },
  // C  (z=0.0)
  { p: 0.255, pos: [ 0.0,  1.2,  1.8], tgt: [ 0.0,  0.2,  0.0] },
  { p: 0.310, pos: [ 0.0,  1.0,  1.4], tgt: [ 0.0,  0.2,  0.0] },
  // D  (z=-1.5)
  { p: 0.365, pos: [ 0.0,  1.2,  0.3], tgt: [ 0.0,  0.2, -1.5] },
  { p: 0.420, pos: [ 0.0,  1.0, -0.1], tgt: [ 0.0,  0.2, -1.5] },
  // E  (z=-3.0)
  { p: 0.475, pos: [ 0.0,  1.2, -1.2], tgt: [ 0.0,  0.2, -3.0] },
  { p: 0.530, pos: [ 0.0,  1.0, -1.6], tgt: [ 0.0,  0.2, -3.0] },
  // F  (z=-4.5)
  { p: 0.585, pos: [ 0.0,  1.2, -2.7], tgt: [ 0.0,  0.2, -4.5] },
  { p: 0.640, pos: [ 0.0,  1.0, -3.1], tgt: [ 0.0,  0.2, -4.5] },
  // G  (z=-6.0)
  { p: 0.695, pos: [ 0.0,  1.2, -4.2], tgt: [ 0.0,  0.2, -6.0] },
  { p: 0.750, pos: [ 0.0,  1.0, -4.6], tgt: [ 0.0,  0.2, -6.0] },
  // H  (z=-7.5)
  { p: 0.805, pos: [ 0.0,  1.2, -5.7], tgt: [ 0.0,  0.2, -7.5] },
  { p: 0.860, pos: [ 0.0,  1.0, -6.1], tgt: [ 0.0,  0.2, -7.5] },
  // I  (z=-9.0)
  { p: 0.900, pos: [ 0.0,  1.2, -7.2], tgt: [ 0.0,  0.2, -9.0] },
  { p: 0.945, pos: [ 0.0,  1.0, -7.6], tgt: [ 0.0,  0.2, -9.0] },
  // Final
  { p: 1.000, pos: [ 0.0,  1.8,  7.0], tgt: [ 0.0,  0.2,  1.0] },
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
