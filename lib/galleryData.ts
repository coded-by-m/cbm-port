import { cases } from "@/data/cases";
import { PROJECT_TYPE_ORDER } from "@/lib/projectTypes";
import type { CaseProject, ProjectType } from "@/types/case";

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
