import { cases } from "@/data/cases";
import { SECTIONS } from "@/data/home";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import type { CaseProject } from "@/types/case";
import { SectionHead } from "./shared";
import { ProjectsStage, type StageProject } from "./ProjectsStage";
import type { DriftTile } from "./DriftWall";

/**
 * Recortes por projeto. 5 fecha as colunas do desktop: 9 × 5 = 45 tiles,
 * 9 por coluna. 4 deixava 36 tiles e uma coluna com um projeto a menos.
 */
const SHOTS_PER_PROJECT = 5;

const colorOf = (c: CaseProject) =>
  c.type ? PROJECT_TYPE_COLOR[c.type] : "#FB3640";

/**
 * Recortes de um projeto, do mais reconhecível pro mais interno: o topo da
 * home primeiro, depois hero, seções e galeria. Desktop, card e mobile só
 * entram se ainda faltar recorte — Forma Viva e Monteiro não têm as quatro
 * seções dos cases novos, e o muro precisa da mesma contagem em todos.
 */
function shotsOf(c: CaseProject) {
  const all = [
    c.preview?.top,
    ...c.heroImages,
    ...(c.sections ?? []),
    ...c.gallery,
    c.preview?.desktop,
    c.preview?.card,
    c.preview?.mobile,
  ];
  return Array.from(new Set(all.filter((s): s is string => !!s))).slice(
    0,
    SHOTS_PER_PROJECT,
  );
}

/**
 * Tiles intercalados por projeto — o i-ésimo tile é do projeto `i % n`.
 * O muro entrega cada tile à coluna `i % colunas`, então o passo dentro da
 * coluna é o número de colunas. 5 é coprimo com 9 e cada coluna passa pelos
 * nove projetos; 3 não é, e o DriftWall troca essa contagem no mobile.
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
            dense
          />
        }
        projects={projects}
        tiles={buildTiles(published)}
      />
    </section>
  );
}
