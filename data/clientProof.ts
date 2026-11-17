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
/**
 * O mesmo resultado de `fact`, em partes, para a landing `/criacao-de-sites`
 * escrever o período por extenso e dar destaque ao número. Os dois campos
 * descrevem a mesma medição: ao atualizar um, atualize o outro.
 */
export interface ClientMetric {
  value: string;
  label: string;
  /** Período por extenso, sem barras. */
  period: string;
  /** De onde vem o número e o que ele não prova. */
  source: string;
}

export interface ClientProof {
  slug: string;
  fact?: string;
  metric?: ClientMetric;
  quote?: string;
  /** Nome e cargo de quem assina o depoimento. */
  author?: string;
}

export const CLIENT_PROOF: ClientProof[] = [
  {
    slug: "machado-plataformas",
    // Mesmo dado do artigo "como escolher": a origem paga faz parte do fato.
    fact: "181 cliques no WhatsApp de 6/08 a 3/11/2026, medidos no Coded Insights. A maior parte do tráfego vem de anúncio pago.",
    metric: {
      value: "181",
      label: "cliques no WhatsApp",
      period: "entre 6 de agosto e 3 de novembro de 2026",
      source: "Medidos no painel de visitas do site. A maior parte das visitas veio de anúncio pago.",
    },
  },
  { slug: "mj-engenharia" },
  { slug: "valdete-costuras" },
];
