// Substituto de @/data/cases para o bundle do design system.
//
// O texto e o real — slugs, titulos, metas, overview, stack, paletas. O que
// muda sao os CAMINHOS DE IMAGEM: data/cases.ts aponta para /cases/<slug>/*.webp,
// servidos pelo Next a partir de public/. Esses arquivos nao existem no bundle,
// e nao existem tampouco em nenhum design que o agente montar — ou seja, sem
// isto todo componente que le os cases por dentro (ProjectsSection, LpProof)
// renderiza icone de imagem quebrada, no card E no design final.
//
// Cada caminho vira um screenshot sintetico na paleta da marca, na proporcao
// sugerida pelo nome do arquivo original. E conteudo de exemplo assumido como
// tal — o que se perde e a foto do site do cliente, que de todo modo nao
// chegaria ate aqui.

import type { CaseProject } from "@/types/case";
import { cases as realCases } from "../../data/cases";
import { shotFor } from "./_shot";

const isAsset = (v: unknown): v is string =>
  typeof v === "string" && v.startsWith("/cases/");

const swap = (v: string | undefined) =>
  v !== undefined && isAsset(v) ? shotFor(v) : v;

const swapList = (list: string[] | undefined) =>
  list?.map((v) => (isAsset(v) ? shotFor(v) : v));

export const cases: CaseProject[] = realCases.map((c) => ({
  ...c,
  heroImages: swapList(c.heroImages) ?? [],
  gallery: swapList(c.gallery) ?? [],
  sections: swapList(c.sections),
  preview: c.preview && {
    ...c.preview,
    desktop: swap(c.preview.desktop) ?? c.preview.desktop,
    mobile: swap(c.preview.mobile) ?? c.preview.mobile,
    card: swap(c.preview.card),
  },
  mockups: c.mockups && {
    desktop3d: swap(c.mockups.desktop3d),
    mobile3d: swap(c.mockups.mobile3d),
    browser: swap(c.mockups.browser),
    phone: swap(c.mockups.phone),
  },
}));

export function getCaseBySlug(slug: string): CaseProject | undefined {
  return cases.find((c) => c.slug === slug);
}
