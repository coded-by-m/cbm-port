import type { ProjectType } from "@/types/case";

/**
 * Cor de acento por tipo de projeto. Fonte única (a Paisagem 3D e a vitrine
 * `/projetos` consomem daqui). Dessaturada pra coesão com a marca.
 */
export const PROJECT_TYPE_COLOR: Record<ProjectType, string> = {
  institucional: "#FB3640",
  landing: "#D9A15B",
  webapp: "#5FB0A3",
  ecommerce: "#A98BC9",
} as const;

/** Rótulo comercial de cada faixa na vitrine. */
export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  landing: "Landing Pages",
  institucional: "Sites Institucionais",
  webapp: "Aplicações Web",
  ecommerce: "Lojas (E-commerce)",
} as const;

/** Ordem fixa e intencional das faixas. */
export const PROJECT_TYPE_ORDER: ProjectType[] = [
  "landing",
  "institucional",
  "webapp",
  "ecommerce",
];
