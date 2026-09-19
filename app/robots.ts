import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Nada é bloqueado aqui de propósito.
 *
 * As rotas internas (`/lab`, `/ui-lab`, `/posts/*`) ficam fora do índice pela
 * tag `noindex` que cada uma declara, não por `Disallow`. Os dois juntos se
 * anulam: um crawler proibido de rastrear nunca lê a tag, e o Google pode
 * indexar a URL às cegas, só pelo link, sem conteúdo. Deixar o robô entrar é
 * o que garante que ele leia o `noindex` e obedeça.
 *
 * O `/lab` continua linkado no rodapé — fora da busca e alcançável por quem
 * explora são coisas compatíveis.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
