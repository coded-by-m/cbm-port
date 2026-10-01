import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cases } from "@/data/cases";

/**
 * Rotas públicas e indexáveis. Fora daqui, de propósito: `/lp/*`, `/lab`,
 * `/ui-lab` e `/posts/*` (todas noindex) e os cases "em breve" (404).
 *
 * Sem `lastModified`: a data do build não é a data da última mudança da
 * página, e um lastmod que muda a cada deploy ensina o Google a ignorar o
 * campo. Melhor ausente que falso.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseRoutes = cases
    .filter((c) => c.status === "published")
    .map((c) => ({
      url: `${SITE_URL}/cases/${c.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projetos`, changeFrequency: "monthly", priority: 0.8 },
    ...caseRoutes,
    // A experiência é quase só canvas: pouco texto pra busca, mas é o
    // showpiece do estúdio e tem canonical próprio.
    { url: `${SITE_URL}/experiencia`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
