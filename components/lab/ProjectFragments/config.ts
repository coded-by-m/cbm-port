/**
 * Project Fragments — configuração e dados.
 *
 * Fonte única da verdade para os fragmentos. Reaproveita o Terrain Mesh como
 * base (sem alterá-lo): importa as camadas e a amostragem de altura para que
 * os fragmentos repousem sobre a superfície viva do terreno.
 *
 * Conceito: projetos não são cards nem grade. São fragmentos descobertos
 * dentro da paisagem — pequenas estruturas trianguladas que emergem do próprio
 * sistema. Ainda sem dados reais: placeholders Project A/B/C/D.
 */

import { LAYERS } from "@/components/lab/TerrainMesh/config";

/** Camada que hospeda os fragmentos (o plano central de leitura). */
export const HOST_LAYER = LAYERS.find((layer) => layer.name === "midground")!;

export interface FragmentConfig {
  id: string;
  /** Marcador simples exibido na descoberta (sem card/descrição/CTA). */
  label: string;
  /** Posição no plano local da camada hospedeira (centro calmo do terreno). */
  x: number;
  z: number;
  seed: number;
}

/**
 * 3 a 5 fragmentos, distribuídos na região calma central do terreno — onde o
 * relevo é mais plano e há respiro visual. Espaçados para a paisagem
 * continuar limpa.
 */
export const FRAGMENTS: FragmentConfig[] = [
  { id: "a", label: "PROJECT A", x:  0.0, z:  3.0, seed: 17  },
  { id: "b", label: "PROJECT B", x:  0.0, z:  1.5, seed: 53  },
  { id: "c", label: "PROJECT C", x:  0.0, z:  0.0, seed: 91  },
  { id: "d", label: "PROJECT D", x:  0.0, z: -1.5, seed: 139 },
  { id: "e", label: "PROJECT E", x:  0.0, z: -3.0, seed: 173 },
  { id: "f", label: "PROJECT F", x:  0.0, z: -4.5, seed: 211 },
  { id: "g", label: "PROJECT G", x:  0.0, z: -6.0, seed: 257 },
  { id: "h", label: "PROJECT H", x:  0.0, z: -7.5, seed: 307 },
  { id: "i", label: "PROJECT I", x:  0.0, z: -9.0, seed: 359 },
];

/** Forma e dimensões do fragmento (pequeno tetraedro triangulado emergente). */
export const FRAGMENT = {
  baseRadius: 0.34,
  apexHeight: 0.5,
  /** Folga acima da superfície para o fragmento "pousar" sem afundar. */
  surfaceLift: 0.06,
  /** Elevação adicional ao destacar (discreta). */
  highlightLift: 0.08,
  /** Escala em repouso → destacado (sutil). */
  scaleHighlight: 1.07,
  nodeRadius: 0.02,
  /** Suavização do destaque (lerp por frame). */
  highlightLerp: 6,
} as const;

/**
 * Paleta dos fragmentos. Em repouso discretos e integrados ao terreno; ao
 * destacar ganham contraste e presença — sem glow, sem neon.
 */
export const FRAGMENT_COLORS = {
  edge: "#9a9a9a",
  edgeNormalOpacity: 0.24,
  edgeHighlightOpacity: 0.56,
  node: "#cccccc",
  nodeNormalOpacity: 0.42,
  nodeHighlightOpacity: 0.85,
  apex: "#FB3640",
  label: "#b6b6b6",
} as const;

/** Movimento vivo dos fragmentos — muito sutil, nunca compete com o terreno. */
export const FRAGMENT_MOTION = {
  bobAmplitude: 0.02,
  bobPeriod: 6.5,
  yawPeriod: 34,
} as const;

/**
 * Marcador (drei Text, 3D na cena — não é HTML overlay).
 *
 * Pequeno e espaçado: uma etiqueta técnica discreta, nunca um título. Surge
 * só depois que o fragmento já está destacado (hierarquia: fragmento →
 * marcador) e fica próximo do fragmento.
 */
export const LABEL = {
  fontSize: 0.085,
  offsetY: 0.24,
  letterSpacing: 0.26,
  fillOpacity: 0.7,
  /** Fração do destaque a partir da qual o rótulo começa a surgir. */
  showThreshold: 0.5,
} as const;

/** Tempos da construção dos fragmentos — surgem após o terreno se assentar. */
export const TIMING = {
  startDelay: 1.8,
  stagger: 0.22,
  duration: 0.9,
} as const;
