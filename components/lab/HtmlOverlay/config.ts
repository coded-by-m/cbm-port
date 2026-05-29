/**
 * HTML Overlay — configuração e dados.
 *
 * Valida a ponte entre o 3D (fragmento na paisagem) e o HTML acessível
 * (card com conteúdo do projeto). O fragmento continua 3D; textos, card, CTA
 * e link são HTML, fora do canvas (ver docs/06 — Camada 04 / Regra Técnica).
 *
 * Reaproveita as posições e a geometria de Project Fragments (sem alterá-lo).
 */

import { FRAGMENTS } from "@/components/lab/ProjectFragments/config";

export interface ProjectCard {
  id: string;
  /** Posição (x,z) e seed herdados de Project Fragments. */
  x: number;
  z: number;
  seed: number;
  /** Conteúdo HTML (placeholder). */
  title: string;
  type: string;
  description: string;
  href: string;
}

const SOURCE = new Map(FRAGMENTS.map((fragment) => [fragment.id, fragment]));

/** Conteúdo dos cards (placeholders). Reusa as posições dos fragmentos a/b/c. */
export const PROJECT_CARDS: ProjectCard[] = [
  {
    id: "a",
    title: "Project A",
    type: "Landing Page",
    description: "Estudo visual para presença digital premium.",
    href: "/cases/project-a",
    x: SOURCE.get("a")!.x,
    z: SOURCE.get("a")!.z,
    seed: SOURCE.get("a")!.seed,
  },
  {
    id: "b",
    title: "Project B",
    type: "Site Institucional",
    description: "Sistema visual para empresa técnica.",
    href: "/cases/project-b",
    x: SOURCE.get("b")!.x,
    z: SOURCE.get("b")!.z,
    seed: SOURCE.get("b")!.seed,
  },
  {
    id: "c",
    title: "Project C",
    type: "Experiência Web",
    description: "Exploração interativa com narrativa visual.",
    href: "/cases/project-c",
    x: SOURCE.get("c")!.x,
    z: SOURCE.get("c")!.z,
    seed: SOURCE.get("c")!.seed,
  },
];

/** Ajustes do posicionamento do card ancorado (em pixels de tela). */
export const OVERLAY = {
  /** Deslocamento do card em relação ao ponto projetado — curto, para o card
   *  parecer preso ao fragmento (o conector cobre a folga). */
  offsetX: 14,
  offsetY: 10,
  /** Margem mínima das bordas da tela (clamp para não sair). */
  margin: 14,
  /** Abaixo deste ponto (ou em ponteiro grosso) usa o painel inferior compacto. */
  compactQuery: "(max-width: 640px), (pointer: coarse)",
} as const;

/**
 * Presença do fragmento ativo — específica do HTML Overlay (não altera Project
 * Fragments). Um pouco mais forte que no experimento anterior, para o item
 * selecionado "ancorar" o card com mais clareza. Sem glow/neon.
 */
export const ACTIVE = {
  edgeOpacity: 0.7,
  nodeOpacity: 1,
  scale: 1.12,
  lift: 0.12,
  apexEmphasis: 0.36,
} as const;
