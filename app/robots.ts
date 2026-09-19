import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Rotas internas fora do índice: os laboratórios e os renderizadores de
 * carrossel de Instagram (que são ferramenta de produção, não conteúdo).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/lab", "/ui-lab", "/posts/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
