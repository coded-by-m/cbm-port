/**
 * Scroll Camera — configuração.
 *
 * Trilha narrativa em profundidade: a câmera percorre a paisagem com os
 * projetos surgindo em sequência — esquerda, direita, fundo — como descobertas,
 * não como vitrine. Cada projeto tem seu momento exclusivo de visibilidade.
 */

import { PROJECT_CARDS } from "@/components/lab/HtmlOverlay/config";

/** Altura do trilho de scroll (maior para acomodar o percurso completo). */
export const SCROLL_LENGTH = {
  desktop: 580,
  compact: 440,
} as const;

/**
 * Posições dos fragmentos em espaço local da HOST_LAYER (antes do fit).
 * Distribuídas ao longo do eixo z — A próximo, B médio, C fundo — para criar
 * a sensação de percurso em profundidade em vez de vitrine lateral.
 */
export const SCROLL_POSITIONS: Array<{ x: number; z: number }> = [
  { x: -1.5, z:  1.8 },  // Projeto A — próximo, esquerda
  { x:  2.0, z: -0.8 },  // Projeto B — profundidade média, direita
  { x: -0.6, z: -3.5 },  // Projeto C — fundo, levemente esquerda
];

export interface Pose {
  /** Progresso 0..1 em que esta pose é o alvo. */
  p: number;
  /** Posição da câmera em unidades normalizadas (multiplicadas por fit). */
  pos: [number, number, number];
  /** Alvo (lookAt) em unidades normalizadas (multiplicadas por fit). */
  tgt: [number, number, number];
}

/**
 * Trilha de câmera como poses explícitas.
 *
 * Todas as coordenadas são em unidades normalizadas — multiplicadas por `fit`
 * em useScrollCamera para escalar junto com o terreno em qualquer viewport.
 *
 * Percurso: ampla → entra → A (esq.) → B (dir.) → C (fundo) → sobe e recua.
 * Os targets apontam para a posição world dos fragmentos (local + HOST_LAYER offset).
 */
export const SCROLL_POSES: Pose[] = [
  { p: 0.00, pos: [ 0.0,  3.4,  7.6], tgt: [ 0.0, -0.1,  0.0] }, // ampla inicial
  { p: 0.10, pos: [ 0.0,  3.0,  6.2], tgt: [ 0.0, -0.3,  0.5] }, // entrando
  { p: 0.24, pos: [-1.0,  2.6,  4.0], tgt: [-1.5, -0.4,  1.3] }, // aproxima A (esq.)
  { p: 0.38, pos: [-0.8,  2.4,  3.4], tgt: [-1.5, -0.4,  1.3] }, // foco A
  { p: 0.52, pos: [ 0.8,  2.8,  1.8], tgt: [ 2.0, -0.4, -1.3] }, // cruza → B (dir.)
  { p: 0.64, pos: [ 1.2,  2.5,  0.8], tgt: [ 2.0, -0.4, -1.3] }, // foco B
  { p: 0.76, pos: [ 0.2,  3.0, -1.0], tgt: [-0.6, -0.3, -4.0] }, // empurra → C (fundo)
  { p: 0.86, pos: [-0.2,  2.6, -2.2], tgt: [-0.6, -0.4, -4.0] }, // foco C
  { p: 0.94, pos: [ 0.5,  3.6,  1.5], tgt: [ 0.0, -0.2, -1.5] }, // sobe e recua
  { p: 1.00, pos: [ 0.0,  3.4,  7.6], tgt: [ 0.0, -0.1,  0.0] }, // ampla final
];

export interface VisibilityEnvelope {
  /** Progresso em que o fragmento começa a emergir. */
  fadeInStart: number;
  /** Progresso em que o fragmento atinge presença total (card HTML aparece). */
  activeFrom: number;
  /** Progresso em que o fragmento começa a recuar (card HTML some). */
  activeTo: number;
  /** Progresso em que o fragmento termina de desaparecer. */
  fadeOutEnd: number;
  /** Opacidade mínima fora da janela (0 = completamente invisível). */
  dormant: number;
}

/**
 * Envelope de visibilidade por fragmento (ordem: A, B, C).
 *
 * Cada fragmento tem exclusividade: emerge quando a câmera se aproxima,
 * brilha durante o foco, desaparece antes do próximo surgir.
 * Nunca há dois fragmentos com presença plena ao mesmo tempo.
 */
export const VISIBILITY_ENVELOPES: VisibilityEnvelope[] = [
  { fadeInStart: 0.12, activeFrom: 0.24, activeTo: 0.46, fadeOutEnd: 0.52, dormant: 0 },
  { fadeInStart: 0.48, activeFrom: 0.52, activeTo: 0.72, fadeOutEnd: 0.78, dormant: 0 },
  { fadeInStart: 0.74, activeFrom: 0.78, activeTo: 0.92, fadeOutEnd: 0.97, dormant: 0 },
];

/** Janelas em que cada fragmento está ativo (card HTML visível). */
export const ACTIVE_RANGES = VISIBILITY_ENVELOPES.map((env, i) => ({
  id:   PROJECT_CARDS[i]!.id,
  from: env.activeFrom,
  to:   env.activeTo,
}));

/**
 * Cards dos projetos com posições ajustadas para o percurso narrativo.
 * Substitui as posições de HtmlOverlay/config.ts apenas neste experimento,
 * sem alterar os experimentos 4 e 5.
 */
export const SCROLL_CARDS = PROJECT_CARDS.map((card, i) => ({
  ...card,
  x: SCROLL_POSITIONS[i]?.x ?? card.x,
  z: SCROLL_POSITIONS[i]?.z ?? card.z,
}));

/** Vida sutil da câmera (micro-deriva), proporcional ao fit. */
export const CAMERA_IDLE = {
  amplitude: 0.04,
  speedX:    0.18,
  speedY:    0.24,
} as const;
