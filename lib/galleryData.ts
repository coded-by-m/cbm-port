import { cases } from "@/data/cases";
import { PROJECT_TYPE_ORDER } from "@/lib/projectTypes";
import type { CaseProject, ProjectType } from "@/types/case";

/** Todos os projetos publicados, na ordem do arquivo. */
export function getPublishedProjects(): CaseProject[] {
  return cases.filter((c) => c.status === "published");
}

/**
 * Clientes no ar, na ordem da página `/projetos`. Quem não está na lista
 * (cliente novo) entra depois, sem furar Machado, MJ e Valdete.
 */
const LIVE_CLIENT_ORDER = ["machado-plataformas", "mj-engenharia", "valdete-costuras"];

export interface PortfolioGroups {
  /** Entregas de cliente. */
  live: CaseProject[];
  /** Estudos autorais (`concept`). */
  conceptual: CaseProject[];
  /** A ordem em que a página mostra — a mesma do ItemList. */
  ordered: CaseProject[];
}

/** Separa publicados em clientes e estudos, na ordem da vitrine. */
export function portfolioGroups(projects: CaseProject[]): PortfolioGroups {
  const rank = (slug: string) => {
    const i = LIVE_CLIENT_ORDER.indexOf(slug);
    return i === -1 ? LIVE_CLIENT_ORDER.length : i;
  };
  const live = projects
    .filter((p) => !p.concept)
    .slice()
    .sort((a, b) => rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title, "pt"));
  const conceptual = projects.filter((p) => p.concept);
  return { live, conceptual, ordered: [...live, ...conceptual] };
}

/** Uma faixa da vitrine: um tipo + seus projetos publicados. */
export interface ProjectBand {
  type: ProjectType;
  projects: CaseProject[];
}

/**
 * Faixas da vitrine `/projetos`: só projetos publicados, agrupados por tipo na
 * ordem de `PROJECT_TYPE_ORDER`. Tipos sem projeto publicado são descartados
 * (sem faixas vazias). Projetos sem `type` caem em "institucional" (default da
 * marca, coerente com a Paisagem).
 */
export function getPublishedBands(): ProjectBand[] {
  const published = cases.filter((c) => c.status === "published");
  return PROJECT_TYPE_ORDER.map((type) => ({
    type,
    projects: published.filter((c) => (c.type ?? "institucional") === type),
  })).filter((band) => band.projects.length > 0);
}
