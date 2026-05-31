/**
 * Pyramid V2 — configuração da seção 2 da abertura.
 *
 * Tetraedro com faces trianguladas, timeline automática GSAP,
 * câmera cinematográfica e cards HTML no painel direito.
 */

type Vec3 = [number, number, number];

export const COLORS = {
  background: "#000F08",
  node: "#F5F2ED",
  edge: "#F5F2ED",
  apex: "#FB3640",
} as const;

export const NODE_RADIUS = 0.018;
export const APEX_RADIUS = 0.028;
export const LINE_WIDTH = 1.4;

const APEX: Vec3 = [0, 1.2, 0];
const BASE_ANGLE_OFFSET = -Math.PI / 6;
const BASE_Y = -0.4;
const BASE_RADIUS = 1.0;

export const TETRA_VERTICES: readonly Vec3[] = [
  APEX,
  ...([0, 1, 2] as const).map<Vec3>((i) => {
    const angle = BASE_ANGLE_OFFSET + (i * Math.PI * 2) / 3;
    return [
      Math.cos(angle) * BASE_RADIUS,
      BASE_Y,
      Math.sin(angle) * BASE_RADIUS,
    ];
  }),
];

export const TETRA_FACES: readonly [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 1],
  [1, 3, 2],
];

export const FACE_GRID = {
  cols: 4,
  rows: 3,
  jitter: 0.06,
  edgeOpacity: 0.45,
  nodeOpacity: 0.8,
} as const;

/**
 * Timeline stops — each stop defines a vertex, camera position,
 * dwell duration, travel duration to next stop, and content card.
 */
export const TIMELINE_STOPS = [
  {
    vertex: 0,
    camera: [0.5, 1.5, 3.5] as Vec3,
    dwell: 4,
    travel: 1.2,
  },
  {
    vertex: 1,
    camera: [-1.5, 0, 3.5] as Vec3,
    dwell: 4,
    travel: 1.2,
  },
  {
    vertex: 2,
    camera: [1.5, -0.2, 3.5] as Vec3,
    dwell: 4,
    travel: 1.2,
  },
  {
    vertex: 3,
    camera: [0, -0.5, 4.0] as Vec3,
    dwell: 5,
    travel: 0,
  },
] as const;

export const CAMERA_OVERVIEW: Vec3 = [0, 0.3, 4.5];
export const CAMERA_LOOK_AT: Vec3 = [0, 0.3, 0];

export const CARD_CONTENT = [
  {
    number: "01",
    label: "PRINCÍPIO",
    title: "Construção",
    description: "Acreditamos que toda grande presença digital começa com uma estrutura sólida.",
  },
  {
    number: "02",
    label: "PRINCÍPIO",
    title: "Precisão",
    description: "Cada pixel, cada interação, cada decisão — nada é acidental.",
  },
  {
    number: "03",
    label: "PRINCÍPIO",
    title: "Presença",
    description: "Um site não é uma página. É a primeira impressão que nunca se repete.",
  },
  {
    number: "04",
    label: "PRINCÍPIO",
    title: "Resultado",
    description: "Projetamos para converter. Design que não performa é só decoração.",
    isCta: true,
  },
] as const;

export const SIGNAL_PATH = {
  ballRadius: 0.038,
  trailOpacity: 0.35,
} as const;

export const TIMING = {
  buildDuration: 2.5,
  nodeStagger: 0.04,
  edgeDelay: 0.3,
  edgeStagger: 0.03,
} as const;

export const MOTION = {
  breathAmplitude: 0.01,
  breathPeriod: 9,
  tiltAmplitude: 0.015,
  tiltPeriod: 14,
} as const;

export const FIT_RADIUS = 1.3;
export const FIT_RATIO = 0.32;
