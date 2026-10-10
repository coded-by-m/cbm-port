/**
 * Artigos do blog — `/blog` e `/blog/[slug]`.
 *
 * `draft: true` = não existe pro público: fora da lista, do sitemap e da rota
 * (404). Enquanto não houver nenhum publicado, a própria `/blog` responde 404
 * e o link do rodapé não aparece — uma listagem vazia indexada é pior que
 * nenhuma.
 *
 * Cada artigo responde à pergunta do título no primeiro parágrafo e linka ao
 * menos duas páginas de serviço. Texto revisado pelo Matheus antes de virar
 * `draft: false`.
 */

export interface BlogSection {
  heading: string;
  body: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO, AAAA-MM-DD. */
  datePublished: string;
  dateModified?: string;
  draft: boolean;
  /** Primeiro parágrafo: a resposta direta à pergunta do título. */
  lead: string;
  sections: BlogSection[];
  /** Páginas de serviço linkadas no fim do artigo (mínimo 2). */
  related: { href: string; label: string }[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "quanto-custa-um-site-profissional",
    title: "Quanto custa um site profissional em 2026?",
    description: "PREENCHER",
    datePublished: "2026-10-10",
    draft: true,
    lead: "PREENCHER — a resposta direta, no primeiro parágrafo.",
    sections: [
      { heading: "O que define o preço de um site", body: ["PREENCHER"] },
      { heading: "Template, plataforma ou código próprio", body: ["PREENCHER"] },
      { heading: "O que precisa estar incluso", body: ["PREENCHER"] },
      { heading: "Como pedir um orçamento que dá pra comparar", body: ["PREENCHER"] },
    ],
    related: [
      { href: "/site-institucional", label: "Site institucional" },
      { href: "/landing-page", label: "Criação de landing page" },
    ],
  },
  {
    slug: "landing-page-ou-site-institucional",
    title: "Landing page ou site institucional: qual escolher?",
    description: "PREENCHER",
    datePublished: "2026-10-10",
    draft: true,
    lead: "PREENCHER — a resposta direta, no primeiro parágrafo.",
    sections: [
      { heading: "O que é uma landing page", body: ["PREENCHER"] },
      { heading: "O que é um site institucional", body: ["PREENCHER"] },
      { heading: "Quando escolher cada um", body: ["PREENCHER"] },
      { heading: "Dá pra ter os dois?", body: ["PREENCHER"] },
    ],
    related: [
      { href: "/landing-page", label: "Criação de landing page" },
      { href: "/site-institucional", label: "Site institucional" },
    ],
  },
  {
    slug: "o-que-um-site-de-arquitetura-precisa-ter",
    title: "O que um site de escritório de arquitetura precisa ter",
    description: "PREENCHER",
    datePublished: "2026-10-10",
    draft: true,
    lead: "PREENCHER — a resposta direta, no primeiro parágrafo.",
    sections: [
      { heading: "Portfólio organizado por projeto", body: ["PREENCHER"] },
      { heading: "Fotos que carregam rápido sem perder qualidade", body: ["PREENCHER"] },
      { heading: "Ser encontrado pelo nome e pela cidade", body: ["PREENCHER"] },
      { heading: "Contato sem atrito", body: ["PREENCHER"] },
    ],
    related: [
      { href: "/sites-para-arquitetura", label: "Sites para arquitetura" },
      { href: "/site-institucional", label: "Site institucional" },
    ],
  },
];

export function publishedPosts() {
  return POSTS.filter((p) => !p.draft);
}

export function getPublishedPost(slug: string) {
  return publishedPosts().find((p) => p.slug === slug);
}
