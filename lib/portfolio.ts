import { cases } from "@/data/cases";
import type { CaseProject } from "@/types/case";

/**
 * Helpers da rota /portfolio.
 *
 * Módulo sem dependência de React — pode ser importado tanto de Server
 * Components quanto de client sem arrastar nada junto.
 */

/**
 * Projeto em destaque na primeira dobra. Trocar aqui troca o hero.
 *
 * Vive aqui, e não no `PortfolioHero`, porque quem resolve o slug é a
 * página (Server Component): constantes exportadas de um módulo
 * `"use client"` chegam ao servidor como referência client, não como valor.
 */
export const FEATURED_SLUG = "mj-engenharia";

/** O `CaseProject` em destaque, ou `undefined` se o slug não existir mais. */
export function getFeaturedCase(): CaseProject | undefined {
  return cases.find((c) => c.slug === FEATURED_SLUG);
}

/**
 * Os projetos que aparecem na grade: só `status: "published"`, na ordem em
 * que estão em `data/cases.ts`. Os `coming-soon` ficam de fora.
 */
export function getPublishedCases(): CaseProject[] {
  return cases.filter((c) => c.status === "published");
}

/**
 * Rótulo da barra de URL do `BrowserFrame`.
 *
 * Domínio real quando o projeto tem um. Quando a URL ainda é a de preview
 * da Vercel (`*.vercel.app`), mostra o nome do projeto — a barra é parte da
 * apresentação, e um subdomínio gerado não comunica nada.
 */
export function frameLabel(project: CaseProject): string {
  const url = project.siteUrl;
  if (!url || url.endsWith(".vercel.app")) return project.title;
  return url;
}
