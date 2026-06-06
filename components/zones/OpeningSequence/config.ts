/**
 * Opening Sequence — tempos da autoplay timeline.
 *
 * A Parte 1 do portfólio é cinematográfica e independente de scroll:
 *   build (TriangleLoader) → hold → exit → philosophy
 *
 * Build dura ~4.3s e é controlado pelo `useTriangleAnimation` do
 * TriangleLoader. As constantes abaixo controlam o que vem depois.
 */
/**
 * Triangle Flip — transição 3D entre Philosophy e ProjectLandscape.
 *
 * O wrapper rotaciona em torno do eixo `(AXIS_X, AXIS_Y, 0)` — vetor a 60°,
 * que corresponde a uma aresta de triângulo equilátero (cos60°, sin60°).
 * Eco visual ao logo CbM.
 */
export const FLIP = {
  /** Duração total do flip (s). */
  DURATION: 1.2,
  /** Componente X do eixo de rotação. */
  AXIS_X: 0.5,
  /** Componente Y do eixo de rotação (sin 60°). */
  AXIS_Y: 0.866,
  /** Perspectiva CSS (px) — quanto menor, mais dramático. */
  PERSPECTIVE: 1500,
} as const;

export const TIMING = {
  /** Pausa entre o fim do build e o início do exit (logo respira). */
  HOLD_DURATION: 1.2,
  /** Duração total do exit (recuo do logo + entrada da philosophy). */
  EXIT_DURATION: 2.3,
  /** Fração do EXIT em que o fade-out do logo termina (0..1). */
  LOGO_FADE_END: 0.75,
  /** Fração do EXIT em que o fade-in da philosophy começa (0..1). */
  PHILOSOPHY_FADE_START: 0.15,
  /** Multiplicador aplicado quando o usuário clica/teclado para acelerar. */
  ACCELERATE_FACTOR: 2.5,
  /** Multiplicador aplicado por default quando `prefers-reduced-motion: reduce`. */
  REDUCED_MOTION_FACTOR: 2.5,
} as const;
