import type { Metadata } from "next";
import { getPublishedProjects, portfolioGroups } from "@/lib/galleryData";
import { AberturasLab } from "@/components/lab/aberturas/AberturasLab";

export const metadata: Metadata = { title: "Laboratório · aberturas da /projetos" };

/**
 * Bancada de teste das aberturas da `/projetos` para quem chega pelo QR do
 * cartão. Herda o noindex de `app/lab/layout.tsx`.
 */
export default function AberturasPage() {
  const { live, conceptual } = portfolioGroups(getPublishedProjects());
  return <AberturasLab live={live} conceptual={conceptual} />;
}
