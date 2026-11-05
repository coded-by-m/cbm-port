import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cases } from "@/data/cases";
import { SERVICE_PAGES } from "@/data/servicePages";
import { publishedPosts } from "@/data/blog";
import { QUANTO_CUSTA_PATH } from "@/data/quantoCusta";
import { ESCOLHER_PATH } from "@/data/comoEscolherEmpresa";
import { LP_OU_PATH } from "@/data/landingOuInstitucional";
import { SITE_PROPRIO_MODIFIED, SITE_PROPRIO_PATH } from "@/data/siteProprioWix";
import { CALC_PATH } from "@/data/calculadoraPreco";
import { PRIVACY_PATH } from "@/data/privacidade";

/**
 * Rotas públicas e indexáveis. Fora daqui, de propósito: `/lp/*`, `/lab`,
 * `/ui-lab` e `/posts/*` (todas noindex) e os cases "em breve" (404).
 *
 * Sem `lastModified` na maior parte das rotas: a data do build não é a
 * data da última mudança da página, e um lastmod que muda a cada deploy
 * ensina o Google a ignorar o campo. Melhor ausente que falso. O artigo
 * de plataforma declara a data de publicação, que é a mudança real.
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
    // Artigo de preço na raiz. A URL não leva o ano para poder ser atualizada.
    {
      url: `${SITE_URL}${QUANTO_CUSTA_PATH}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}${ESCOLHER_PATH}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}${LP_OU_PATH}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}${SITE_PROPRIO_PATH}`,
      lastModified: SITE_PROPRIO_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}${CALC_PATH}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    { url: `${SITE_URL}/projetos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}${PRIVACY_PATH}`, changeFrequency: "yearly", priority: 0.2 },
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
