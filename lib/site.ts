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
