/**
 * Clientes reais, na ordem em que provam. Fonte única da seção Clientes da
 * home e da prova das landings de campanha.
 *
 * Só entra aqui case sem `concept` em `data/cases.ts`: o site nunca apresenta
 * conceito como entrega.
 *
 * `fact` é resultado medido e já publicado; `quote` e `author` são o
 * depoimento do cliente. Sem depoimento, o card sai sem aspas: nunca inventar.
 */
export interface ClientProof {
  slug: string;
  fact?: string;
  quote?: string;
  /** Nome e cargo de quem assina o depoimento. */
  author?: string;
}

export const CLIENT_PROOF: ClientProof[] = [
  {
    slug: "machado-plataformas",
    // Mesmo dado do artigo "como escolher": a origem paga faz parte do fato.
    fact: "181 cliques no WhatsApp de 6/08 a 3/11/2026, medidos no Coded Insights. A maior parte do tráfego vem de anúncio pago.",
  },
  { slug: "mj-engenharia" },
  { slug: "valdete-costuras" },
];
