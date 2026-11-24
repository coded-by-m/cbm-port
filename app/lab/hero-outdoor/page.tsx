import type { Metadata } from "next";
import { getPublishedProjects, portfolioGroups } from "@/lib/galleryData";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import {
  HeroOutdoorLab,
  type OutdoorProject,
} from "@/components/lab/hero-outdoor/HeroOutdoorLab";

export const metadata: Metadata = { title: "Laboratório · hero outdoor" };

/**
 * Protótipo: o hero da home como uma placa de outdoor na cidade-QR. Imagem
 * primeiro, quase nenhum texto; depois do voo a página pousa numa galeria dos
 * projetos. Herda o noindex de `app/lab/layout.tsx`.
 */
export default function HeroOutdoorPage() {
  const { ordered } = portfolioGroups(getPublishedProjects());
  const projects: OutdoorProject[] = ordered
    .filter((p) => p.preview?.card)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      cover: p.preview!.card as string,
      color: PROJECT_TYPE_COLOR[p.type ?? "institucional"],
    }));
  return <HeroOutdoorLab projects={projects} />;
}
