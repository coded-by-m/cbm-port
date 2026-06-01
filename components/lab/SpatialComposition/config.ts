/**
 * Spatial Composition — configuração.
 *
 * Composição espacial pura: terreno + estrutura focal distante + câmera
 * cinematográfica lenta + hierarquia de brilho. Sem textos, sem overlay,
 * sem interação. A pergunta: "essa cena desperta curiosidade por si só?"
 */

/** Névoa mais profunda — empurra o fundo e revela o hero parcialmente. */
export const SPATIAL_FOG = {
  color: "#000F08",
  near: 5,
  far: 22,
} as const;

/**
 * Câmera espacial — órbita lenta e contemplativa.
 *
 * Mais lenta que o TerrainMesh padrão, com percurso mais amplo para
 * revelar profundidade e composição de vários ângulos. O target desliza
 * suavemente em direção ao hero fragment, guiando o olhar sem forçar.
 */
export const SPATIAL_CAMERA = {
  position: [0, 3.4, 7.6] as const,
  fov: 42,
  target: [0, 0.2, -3.0] as const,
  driftX: 1.1,
  driftY: 0.35,
  driftZ: 0.6,
  speedX: 0.018,
  speedY: 0.024,
  speedZ: 0.014,
  targetDriftX: 0.4,
  targetDriftSpeed: 0.012,
} as const;

/**
 * Hero Fragment — estrutura focal grande e distante.
 *
 * Um aglomerado de tetraedros em escala maior que os project fragments,
 * posicionado na região de fundo. Parcialmente engolido pela névoa —
 * visível o suficiente para atrair, obscuro o suficiente para gerar
 * curiosidade. Rotação lenta e contínua.
 */
export const HERO = {
  position: [-0.15, 1.5, -3.2] as const,
  structures: [
    { seed: 307, scale: 4.2, yOffset: 0, rotationSpeed: 0.012 },
    { seed: 421, scale: 2.6, yOffset: -0.15, xOffset: 0.6, zOffset: 0.25, rotationSpeed: -0.009 },
    { seed: 563, scale: 1.8, yOffset: 0.3, xOffset: -0.4, zOffset: -0.18, rotationSpeed: 0.014 },
  ],
  edgeColor: "#F5F2ED",
  edgeOpacity: 0.32,
  nodeColor: "#F5F2ED",
  nodeOpacity: 0.5,
  apexColor: "#FB3640",
  apexOpacity: 0.8,
  nodeRadius: 0.06,
  bobAmplitude: 0.025,
  bobPeriod: 14,
} as const;

/**
 * Vinheta CSS — regiões mais escuras nas bordas, mais claras no centro
 * focal. Dirige o olhar sem iluminação real (sem luzes, sem shaders).
 */
export const VIGNETTE = {
  opacity: 0.55,
  offsetY: "8%",
} as const;
