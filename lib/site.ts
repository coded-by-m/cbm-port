/**
 * Identidade do site — fonte única.
 *
 * SITE_URL é usada por metadataBase, robots.ts e sitemap.ts. Sem barra final:
 * o Next concatena os caminhos e duas barras quebram a URL canônica.
 * Sobrescrevível por ambiente (preview da Vercel, staging) sem editar código.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.codedbym.com"
).replace(/\/$/, "");

export const SITE_NAME = "Coded by M";

/**
 * Identificação empresarial exibida no rodapé da landing `/criacao-de-sites`.
 *
 * Razão social e CNPJ ainda não foram informados (pendência em
 * docs/lp/criacao-de-sites.md). Enquanto forem `undefined`, a linha não
 * aparece: melhor uma informação a menos que um dado inventado.
 */
export const LEGAL: { owner: string; city: string; razaoSocial?: string; cnpj?: string } = {
  owner: "Matheus Mendes",
  city: "Florianópolis, SC",
  razaoSocial: undefined,
  cnpj: undefined,
};
