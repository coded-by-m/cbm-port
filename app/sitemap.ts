import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cases } from "@/data/cases";
import { SERVICE_PAGES } from "@/data/servicePages";
import { publishedPosts } from "@/data/blog";

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
    // Páginas de serviço: as que respondem às buscas comerciais.
    ...SERVICE_PAGES.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/projetos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "yearly", priority: 0.5 },
    // Blog só entra com artigo publicado: rascunho não existe pro público.
    ...(publishedPosts().length
      ? [
          { url: `${SITE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.6 },
          ...publishedPosts().map((p) => ({
            url: `${SITE_URL}/blog/${p.slug}`,
            changeFrequency: "yearly" as const,
            priority: 0.6,
          })),
        ]
      : []),
    ...caseRoutes,
    // A experiência é quase só canvas: pouco texto pra busca, mas é o
    // showpiece do estúdio e tem canonical próprio.
    { url: `${SITE_URL}/experiencia`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
