import { cases } from "@/data/cases";
import { SECTIONS } from "@/data/home";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import type { CaseProject } from "@/types/case";
import { SectionHead } from "./shared";
import { ProjectsStage, type StageProject } from "./ProjectsStage";
import type { DriftTile } from "./DriftWall";

/** Recortes por projeto no muro. 9 projetos × 4 = 36 tiles em 5 colunas. */
const SHOTS_PER_PROJECT = 4;

const colorOf = (c: CaseProject) =>
  c.type ? PROJECT_TYPE_COLOR[c.type] : "#FB3640";

/**
 * Recortes de um projeto, do mais reconhecível pro mais interno: o topo da
 * home primeiro, depois hero, seções e galeria.
 */
function shotsOf(c: CaseProject) {
  const all = [
    c.preview?.top,
    ...c.heroImages,
    ...(c.sections ?? []),
    ...c.gallery,
  ];
  return Array.from(new Set(all.filter((s): s is string => !!s))).slice(
    0,
    SHOTS_PER_PROJECT,
  );
}

/**
 * Tiles intercalados por projeto — o i-ésimo tile é do projeto `i % n`.
 * Como o muro distribui por `i % colunas`, vizinhos de uma mesma coluna ficam
 * a `colunas` posições de distância — com 9 projetos e 5 (ou 3) colunas,
 * nunca no mesmo projeto.
 */
function buildTiles(projects: CaseProject[]): DriftTile[] {
  const shots = projects.map(shotsOf);
  const depth = Math.max(...shots.map((s) => s.length));
  const tiles: DriftTile[] = [];
  for (let k = 0; k < depth; k++) {
    projects.forEach((p, i) => {
      const src = shots[i][k];
      if (src)
        tiles.push({ src, slug: p.slug, title: p.title, color: colorOf(p) });
    });
  }
  return tiles;
}

/**
 * Projetos — tela cheia, o muro à deriva de fundo e o índice por cima.
 *
 * Saiu do grid de cards: na home a seção é vitrine de clima, e o catálogo com
 * descrição e stack continua em `/projetos`, onde `ProjetoGridCard` segue em
 * uso.
 */
export function ProjectsSection() {
  const published = cases.filter((c) => c.status === "published");

  const projects: StageProject[] = published.map((c) => ({
    slug: c.slug,
    title: c.title,
    meta: c.concept ? `Conceito · ${c.meta.ano}` : c.meta.ano,
    color: colorOf(c),
  }));

  return (
    <section id="projetos" data-cm-section="projects" className="pj-section">
      <ProjectsStage
        head={
          <SectionHead
            heading={SECTIONS.projetos.heading}
            sub={SECTIONS.projetos.sub}
          />
        }
        projects={projects}
        tiles={buildTiles(published)}
      />
    </section>
  );
}
