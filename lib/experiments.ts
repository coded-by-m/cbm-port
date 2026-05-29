/**
 * Registro central dos experimentos do Experience Lab.
 *
 * O Experience Lab valida riscos técnicos antes do site principal
 * (ver docs/06-technical-feasibility.md). Cada novo experimento deve ser
 * adicionado aqui e implementado em `components/lab/<Nome>`.
 */

export type ExperimentStatus = "ready" | "planned";

export interface Experiment {
  /** Identificador estável e amigável para URL. */
  slug: string;
  /** Nome exibido na central de experimentos. */
  title: string;
  /** O que o experimento valida. */
  description: string;
  /** "ready" = implementado e ativo; "planned" = placeholder preparado. */
  status: ExperimentStatus;
}

export const EXPERIMENTS: Experiment[] = [
  {
    slug: "triangle-loader",
    title: "Triangle Loader",
    description:
      "Pontos surgem, linhas conectam e o triângulo wireframe se forma e gira lentamente. Nada surge pronto: tudo é construído.",
    status: "ready",
  },
  {
    slug: "triangle-lines",
    title: "Triangle Lines",
    description:
      "Linhas desenhando formas, variações de triângulos e múltiplas conexões.",
    status: "planned",
  },
  {
    slug: "terrain-mesh",
    title: "Terrain Mesh",
    description:
      "Malha triangulada procedural com movimento orgânico sutil e performance estável.",
    status: "planned",
  },
  {
    slug: "project-fragments",
    title: "Project Fragments",
    description:
      "Fragmentos triangulares com hover no desktop, toque no mobile e reação visual.",
    status: "planned",
  },
  {
    slug: "html-overlay",
    title: "HTML Overlay",
    description:
      "Card HTML ancorado a uma posição 3D, com acessibilidade e responsividade.",
    status: "planned",
  },
  {
    slug: "scroll-camera",
    title: "Scroll Camera",
    description:
      "Câmera controlada por scroll com GSAP ScrollTrigger + Lenis e transições suaves.",
    status: "planned",
  },
  {
    slug: "cta-formation",
    title: "CTA Formation",
    description:
      "Fragmentos convergindo para formar o símbolo da Coded by M — final cinematográfico.",
    status: "planned",
  },
];
