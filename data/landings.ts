/**
 * Landings de campanha — o motor de `/lp/[segmento]`.
 *
 * Abrir um ângulo novo é acrescentar um objeto aqui; nenhuma linha de
 * componente muda. Cada rota nasce `noindex` de propósito: ela existe pra
 * receber clique pago, e se o Google indexasse, competiria com a `/` pelas
 * mesmas buscas e entregaria a quem vem da busca uma página sem navegação.
 *
 * ATENÇÃO — o copy daqui é RASCUNHO e precisa da sua revisão. É o texto que
 * carrega a campanha: cada frase é uma afirmação sua para quem nunca ouviu
 * falar do estúdio. Os pontos marcados com PREENCHER dependem de números que
 * só você tem (preço e prazo) e estão sem resposta de propósito — inventar
 * seria pior que deixar em branco.
 */

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingConfig {
  /** Vira a rota: `/lp/<slug>`. */
  slug: string;
  /** Hero. */
  eyebrow: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  /** 3 ou 4 pontos de dor. Frases curtas, na pele de quem clicou. */
  pains: string[];
  /** Uma frase. O que muda depois. Não é parágrafo. */
  promise: string;
  /** Slugs de `data/cases.ts`, na ordem em que provam. */
  caseSlugs: string[];
  /** 4 ou 5 objeções reais. */
  faq: LandingFaq[];
  /** Base da mensagem do WhatsApp; a origem da campanha é anexada em runtime. */
  waMessage: string;
  /** A rota é noindex, mas o preview do link em WhatsApp e LinkedIn importa. */
  meta: { title: string; description: string; ogImage: string };
}

export const LANDINGS: LandingConfig[] = [
  {
    slug: "arquitetura",
    eyebrow: "Para escritórios de arquitetura, interiores e engenharia",
    headline: "Sua obra merece um site tão bem resolvido quanto ela.",
    sub: "Sites e landing pages para escritórios que projetam espaço — feitos do zero, sem template, com a apresentação que o seu trabalho já teria se fosse impresso.",
    ctaLabel: "Falar sobre o meu escritório",

    pains: [
      "Seu portfólio vive no Instagram, e cada projeto some do feed em dois dias.",
      "O site que existe foi montado num template — e nivela seu escritório com quem não projeta metade.",
      "Quem pesquisa seu nome encontra foto comprimida e nenhum projeto por inteiro.",
      "A obra vai pro escritório ao lado, que não projeta melhor. Só se apresenta melhor.",
    ],

    promise:
      "Um site que apresenta sua obra com o mesmo cuidado que você teve ao projetá-la.",

    /** Os quatro cases do ambiente construído, na ordem em que provam. */
    caseSlugs: ["estudio-lentz", "forma-viva", "estudio-monteiro", "maison-etoile"],

    faq: [
      {
        q: "Quanto custa?",
        a: "PREENCHER — a faixa depende do escopo, e a resposta honesta aqui é a que você pratica. Sem um número, esta pergunta trabalha contra: quem não vê preço assume que é caro e não pergunta.",
      },
      {
        q: "Quanto tempo leva?",
        a: "PREENCHER — o prazo real do seu processo de quatro etapas, da estratégia ao deploy.",
      },
      {
        q: "Meu Instagram já não basta?",
        a: "O Instagram é ótimo pra ser lembrado e péssimo pra ser encontrado. Ele não aparece no Google, não organiza sua obra por projeto e não sobrevive ao feed. Um site é o único lugar onde o trabalho fica no seu endereço, na sua ordem, pra sempre.",
      },
      {
        q: "E os meus textos e as minhas fotos?",
        a: "As fotos são suas e eu trabalho com elas — inclusive tratando peso e recorte, que é o que costuma estragar site de arquitetura. O texto a gente escreve junto: você conta o projeto e eu estruturo a narrativa.",
      },
      {
        q: "Vou conseguir mexer depois?",
        a: "Sim. A entrega inclui handover, e projetos com conteúdo que muda com frequência saem com um CMS leve pra você publicar obra nova sem depender de mim.",
      },
    ],

    waMessage:
      "Olá! Vim pela página para escritórios de arquitetura e queria falar sobre o site do meu escritório.",

    meta: {
      // Sem sufixo: o `template` do layout raiz já acrescenta "· Coded by M".
      title: "Sites para escritórios de arquitetura",
      description:
        "Sites e landing pages para escritórios de arquitetura, interiores e engenharia. Feitos do zero, sem template — a apresentação que a sua obra merece.",
      ogImage: "/cases/estudio-lentz/desktop-tall.webp",
    },
  },
];

export function getLanding(slug: string) {
  return LANDINGS.find((l) => l.slug === slug);
}
