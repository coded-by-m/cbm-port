/**
 * Triangle Loader — configuração e dados da estrutura.
 *
 * Fonte única da verdade para a geometria, paleta e tempos da animação.
 * Mantém a "lógica" separada da "cena" e das "animações" (ver docs/06).
 */

/**
 * Vértices de um triângulo equilátero com circunraio = 1
 * (vértice superior em y = 1). A simetria mantém a estrutura
 * centrada na origem, facilitando a rotação e o ajuste responsivo.
 */
export const TRIANGLE_VERTICES: readonly [number, number, number][] = [
  [0, 1, 0],
  [-0.8660254, -0.5, 0],
  [0.8660254, -0.5, 0],
];

/** Arestas do triângulo, como pares de índices de vértices. */
export const TRIANGLE_EDGES: readonly [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 0],
];

/** Circunraio do triângulo (usado pelo ajuste responsivo de escala). */
export const TRIANGLE_RADIUS = 1;

/**
 * Paleta de estúdio escuro. Tons de cinza, sem neon, sem cyberpunk.
 * Referência emocional: Porsche, não videogame.
 */
export const COLORS = {
  background: "#000F08",
  point: "#e2e2e2",
  line: "#9c9c9c",
} as const;

/**
 * Raio do marcador de vértice. Reduzido ~40% (0.055 → 0.033) para que os
 * pontos pareçam rebites de engenharia de precisão, não esferas dominantes.
 */
export const POINT_RADIUS = 0.033;

/**
 * Espessura das arestas (Line2, em px lógicos). Fina e constante para uma
 * leitura técnica de blueprint — precisa, não decorativa.
 */
export const LINE_WIDTH = 1.5;

/**
 * Tempos (em segundos) da timeline de construção. Lento e progressivo:
 * cada elemento se assenta antes do próximo — sensação de montagem.
 */
export const TIMING = {
  startDelay: 0.45,
  pointPop: 0.7,
  pointStagger: 0.18,
  lineDraw: 0.85,
  lineOverlap: 0.1,
  lineOpacity: 0.74,
  settle: 0.6,
  rotationDuration: 28,
} as const;

/**
 * Estrutura "viva": respiração e inclinação orgânicas, extremamente sutis.
 * Amplitudes minúsculas e períodos longos — nunca uma animação chamativa,
 * apenas a sensação de que a peça respira.
 */
export const MOTION = {
  breathAmplitude: 0.012,
  breathPeriod: 7.5,
  tiltAmplitude: 0.016,
  tiltPeriod: 12,
} as const;

/**
 * Profundidade cinematográfica: três camadas de partículas discretas.
 * `background` distante e quase imperceptível, `foreground` perto da câmera
 * e raríssimo. Cada camada gira lentamente em ritmo próprio (parallax sutil).
 * Sem poluição visual: contagens baixas, opacidades mínimas.
 */
export const PARTICLE_LAYERS = [
  {
    name: "background",
    count: 44,
    size: 0.016,
    opacity: 0.1,
    spread: [9, 9] as const,
    depth: [-9, -4] as const,
    color: "#565656",
    drift: 0.006,
  },
  {
    name: "midground",
    count: 24,
    size: 0.022,
    opacity: 0.16,
    spread: [6, 6] as const,
    depth: [-3, -1] as const,
    color: "#6f6f6f",
    drift: 0.011,
  },
  {
    name: "foreground",
    count: 8,
    size: 0.03,
    opacity: 0.08,
    spread: [5, 4] as const,
    depth: [1.5, 3.5] as const,
    color: "#959595",
    drift: 0.017,
  },
] as const;
