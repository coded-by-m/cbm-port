/**
 * Triangle Loader — configuração e dados da estrutura.
 *
 * Geometria baseada na logo CbM: dois strokes estruturais (#F5F2ED)
 * e uma diagonal vermelha (#FB3640) como sinal de completude.
 *
 * Coordenadas normalizadas a partir do SVG da logo (142×161),
 * centradas na origem e com Y invertido para espaço 3D.
 */

/**
 * Paleta de estúdio escuro. Off-white quente, Signal Red quando importa.
 */
export const COLORS = {
  background: "#000F08",
  point: "#F5F2ED",
  line: "#F5F2ED",
  signal: "#FB3640",
} as const;

/**
 * Pontos estruturais da logo — os "nós" que aparecem antes dos strokes.
 * Posicionados nos cantos/bends dos strokes C e M, e na origem do signal.
 */
export const LOGO_POINTS: readonly [number, number, number][] = [
  [-0.836, 0.343, 0],
  [0.864, 0.914, 0],
  [-0.864, 0.929, 0],
];

function polylineLength(points: [number, number, number][]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    const dz = points[i][2] - points[i - 1][2];
    len += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  return len;
}

/**
 * Strokes da logo CbM como polilíneas.
 * Cada stroke tem pontos, cor, opacidade-alvo e comprimento pré-calculado.
 * O comprimento é usado para a animação de draw-on via dashOffset.
 */
const STROKE_DEFS = [
  {
    points: [
      [-0.836, -0.929, 0],
      [-0.836, 0.343, 0],
      [-0.254, -0.323, 0],
    ] as [number, number, number][],
    color: COLORS.line,
    targetOpacity: 0.65,
  },
  {
    points: [
      [0.864, -0.286, 0],
      [0.864, 0.914, 0],
      [0.238, 0.246, 0],
    ] as [number, number, number][],
    color: COLORS.line,
    targetOpacity: 0.65,
  },
  {
    points: [
      [-0.864, 0.929, 0],
      [0.864, -0.914, 0],
    ] as [number, number, number][],
    color: COLORS.signal,
    targetOpacity: 0.88,
  },
];

export const LOGO_STROKES = STROKE_DEFS.map((s) => ({
  ...s,
  length: polylineLength(s.points),
}));

/** Raio envolvente da logo (usado pelo ajuste responsivo de escala). */
export const LOGO_RADIUS = 1.27;

/**
 * Raio do marcador de vértice. Rebites de precisão nos cantos da logo.
 */
export const POINT_RADIUS = 0.033;

/**
 * Espessura dos strokes (Line2, em px lógicos). Mais presente que o
 * blueprint original, fiel ao peso visual da logo SVG.
 */
export const LINE_WIDTH = 2.0;

/**
 * Tempos (em segundos) da timeline de construção.
 * Pontos surgem → strokes estruturais desenham linearmente → diagonal vermelha cruza.
 */
export const TIMING = {
  startDelay: 0.25,
  pointPop: 0.4,
  pointStagger: 0.12,
  strokeDraw: 0.5,
  strokeStagger: 0.08,
  signalDelay: 0.15,
  signalDraw: 0.55,
  signalShift: 0.55,
  settle: 0.3,
} as const;

/**
 * Velocidade da rotação livre do logo (em segundos por volta completa).
 * Aplicada diretamente em `rotateRef.rotation.y` após o build — a câmera
 * fica parada, o próprio logo gira no eixo Y.
 */
export const LOGO_ROTATION_PERIOD = 55;

/**
 * Estrutura "viva": respiração e inclinação orgânicas, extremamente sutis.
 */
export const MOTION = {
  breathAmplitude: 0.012,
  breathPeriod: 7.5,
  tiltAmplitude: 0.016,
  tiltPeriod: 12,
} as const;

/**
 * Profundidade cinematográfica: três camadas de partículas discretas.
 * Tons quentes alinhados com a temperatura do fundo #000F08.
 */
export const PARTICLE_LAYERS = [
  {
    name: "background",
    count: 62,
    size: 0.08,
    opacity: 0.12,
    spread: [9, 9] as const,
    depth: [-9, -4] as const,
    color: "#5a5750",
    drift: 0.006,
    /** Força da repulsão ao cursor (unidades de mundo que a partícula é
        empurrada no contato). Foreground reage mais. */
    repel: 0.5,
  },
  {
    name: "midground",
    count: 34,
    size: 0.11,
    opacity: 0.18,
    spread: [6, 6] as const,
    depth: [-3, -1] as const,
    color: "#736f66",
    drift: 0.011,
    repel: 1.1,
  },
  {
    name: "foreground",
    count: 13,
    size: 0.15,
    opacity: 0.1,
    spread: [5, 4] as const,
    depth: [1.5, 3.5] as const,
    color: "#97938b",
    drift: 0.017,
    repel: 1.9,
  },
] as const;
