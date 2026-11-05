/**
 * Landings de campanha: o motor de `/lp/[segmento]`.
 *
 * Abrir um ângulo novo é acrescentar um objeto aqui. Cada rota nasce `noindex`
 * de propósito: ela existe pra receber clique pago, e se o Google indexasse,
 * competiria com a `/` pelas mesmas buscas e entregaria a quem vem da busca uma
 * página sem navegação.
 *
 * ATENÇÃO: o copy daqui é rascunho e precisa de revisão. Respostas marcadas com
 * PREENCHER dependem de números que só o Matheus tem e NÃO aparecem na página
 * enquanto tiverem o marcador (ver `isFilled`).
 */

import {
  ATENDE_BRASIL,
  INSTITUCIONAL_PRECO,
  PUBLIC_PRICE,
  getServicePage,
} from "@/data/servicePages";
import { OG } from "@/lib/seo";

export interface LandingFaq {
  q: string;
  a: string;
}

/** Blocos disponíveis. A ordem da página é a ordem de `LandingConfig.blocks`. */
export type LandingBlock =
  | "hero"
  | "pains"
  | "promise"
  | "proof"
  | "differentials"
  | "offer"
  | "process"
  | "faq"
  | "final";

export interface LandingConfig {
  /** Vira a rota: `/lp/<slug>`. */
  slug: string;
  /** Blocos da página, na ordem em que aparecem. */
  blocks: LandingBlock[];
  /** Hero. */
  headline: string;
  sub: string;
  ctaLabel: string;
  /** Slug de `data/cases.ts` cuja captura aparece no hero. Sem isto, só texto. */
  heroCaseSlug?: string;
  /** 3 ou 4 pontos de dor, se a página listar o bloco `pains`. */
  pains?: string[];
  /** Uma frase, se a página listar o bloco `promise`. */
  promise?: string;
  /** Título da prova. */
  proofHeading: string;
  /** Título do grupo de conceitos, quando também há clientes reais. */
  conceptHeading?: string;
  /** Slugs de `data/cases.ts`, na ordem em que provam. */
  caseSlugs: string[];
  differentials?: { heading: string; items: { title: string; text: string }[] };
  offer?: {
    heading: string;
    includes: string[];
    price: string;
    deadline: string;
    note: string;
    /** Uma linha com a opção menor. */
    alternative?: string;
  };
  processHeading: string;
  /** 4 a 6 objeções reais. */
  faq: LandingFaq[];
  final: { heading: string; text: string };
  /** Base da mensagem do WhatsApp; a origem da campanha é anexada em runtime. */
  waMessage: string;
  /** A rota é noindex, mas o preview do link em WhatsApp e LinkedIn importa. */
  meta: { title: string; description: string; ogImage: string };
}

export const LANDINGS: LandingConfig[] = [
  {
    slug: "arquitetura",
    blocks: ["hero", "pains", "promise", "proof", "process", "faq", "final"],
    proofHeading: "Sites de arquitetura e interiores, no ar pra conferir.",
    processHeading: "Quatro etapas, e você sabe onde está em cada uma.",
    final: {
      heading: "Vamos conversar sobre o seu escritório.",
      text: "Você conta o contexto, eu digo o que faria e em quanto tempo entrego. Sem formulário e sem proposta automática.",
    },
    headline: "Sua obra merece um site tão bem resolvido quanto ela.",
    sub: "Sites e landing pages para escritórios que projetam espaço: feitos do zero, sem template, com a apresentação que o seu trabalho já teria se fosse impresso.",
    ctaLabel: "Falar sobre o meu escritório",

    pains: [
      "Seu portfólio vive no Instagram, e cada projeto some do feed em dois dias.",
      "O site que existe foi montado num template, e nivela seu escritório com quem não projeta metade.",
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
        a: "PREENCHER: a faixa depende do escopo, e a resposta honesta aqui é a que você pratica. Sem um número, esta pergunta trabalha contra: quem não vê preço assume que é caro e não pergunta.",
      },
      {
        q: "Quanto tempo leva?",
        a: "PREENCHER: o prazo real do seu processo de quatro etapas, da estratégia ao deploy.",
      },
      {
        q: "Meu Instagram já não basta?",
        a: "O Instagram é ótimo pra ser lembrado e péssimo pra ser encontrado. Ele não aparece no Google, não organiza sua obra por projeto e não sobrevive ao feed. Um site é o único lugar onde o trabalho fica no seu endereço, na sua ordem, pra sempre.",
      },
      {
        q: "E os meus textos e as minhas fotos?",
        a: "As fotos são suas e eu trabalho com elas, inclusive tratando peso e recorte, que é o que costuma estragar site de arquitetura. O texto a gente escreve junto: você conta o projeto e eu estruturo a narrativa.",
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
        "Sites e landing pages para escritórios de arquitetura, interiores e engenharia. Feitos do zero, sem template: a apresentação que a sua obra merece.",
      ogImage: "/og/lp/arquitetura.jpg",
    },
  },
  {
    slug: "site-para-empresa",
    /** Quem vem do Google já procura um site: preço e prova antes da dor. */
    blocks: ["hero", "proof", "pains", "differentials", "offer", "process", "faq", "final"],

    headline: "Site profissional para a sua empresa, feito do zero.",
    sub: `A partir de ${PUBLIC_PRICE.institucional.display}, com hospedagem e domínio inclusos. Prazo a partir de 15 dias úteis. Estúdio em Florianópolis, atendimento em todo o Brasil.`,
    ctaLabel: "Pedir orçamento no WhatsApp",
    heroCaseSlug: "machado-plataformas",

    proofHeading: "Empresas que já estão no ar com um site nosso.",
    conceptHeading: "Projetos conceituais, para mostrar o alcance do trabalho.",
    /** Clientes reais primeiro. Os dois últimos têm `concept: true`. */
    caseSlugs: [
      "machado-plataformas",
      "mj-engenharia",
      "valdete-costuras",
      "stige",
      "estudio-lentz",
    ],

    pains: [
      "Seu site parece com o do concorrente, porque saiu do mesmo template.",
      "A página demora a abrir no celular, e a pessoa volta para o Google.",
      "Quem procura o seu serviço na sua cidade não encontra a sua empresa.",
    ],

    differentials: {
      heading: "O que muda quando o site é feito do zero.",
      items: [
        {
          title: "Código próprio",
          text: "Design exclusivo, sem template e sem o peso de um construtor de sites.",
        },
        {
          title: "Velocidade",
          text: "Pensado primeiro para o celular e para carregar rápido.",
        },
        {
          title: "Google",
          text: "SEO técnico e dados estruturados desde o primeiro dia.",
        },
        {
          title: "Domínio",
          text: "Registrado no nome da sua empresa. Se você quiser sair, ele continua seu.",
        },
        {
          title: "Métricas",
          text: "WhatsApp integrado e métricas configuradas na entrega.",
        },
      ],
    },

    offer: {
      heading: "Site institucional sob medida.",
      includes: getServicePage("site-institucional").includes,
      price: `A partir de ${PUBLIC_PRICE.institucional.display}`,
      deadline: "A partir de 15 dias úteis",
      note: "O valor final depende do projeto e é fechado no WhatsApp, antes de começar.",
      alternative: `Precisa só de uma página? Landing page a partir de ${PUBLIC_PRICE.landing.display}, em 5 dias úteis.`,
    },

    processHeading: "Quatro etapas, e você sabe onde está em cada uma.",

    faq: [
      { q: "Quanto custa um site?", a: INSTITUCIONAL_PRECO },
      {
        q: "Em quanto tempo fica pronto?",
        a: "A partir de 15 dias úteis. O prazo final depende do número de páginas e do conteúdo e é fechado no orçamento no WhatsApp, antes de começar.",
      },
      {
        q: "Hospedagem e domínio estão inclusos?",
        a: "Sim. A hospedagem fica por minha conta e está incluída no valor do projeto. O domínio é registrado no nome da sua empresa, e o custo também está incluído.",
      },
      {
        q: "Tem mensalidade?",
        a: "Existe um plano mensal opcional de suporte e atualizações, com valor que depende do serviço.",
      },
      {
        q: "Posso editar o conteúdo depois?",
        a: "Sim. A entrega inclui handover, e se o conteúdo muda com frequência o site sai com um CMS leve para você editar sem depender de mim.",
      },
      ATENDE_BRASIL,
    ],

    final: {
      heading: "Vamos conversar sobre o site da sua empresa.",
      text: "Você conta o projeto e eu respondo no mesmo dia com valor e prazo. O orçamento é gratuito e sem compromisso.",
    },

    waMessage: "Olá! Vim pela página de sites para empresas da Coded by M e quero um orçamento.",

    meta: {
      // Sem sufixo: o `template` do layout raiz já acrescenta "· Coded by M".
      title: "Criação de site profissional para empresas",
      description: `Site profissional feito do zero, a partir de ${PUBLIC_PRICE.institucional.display}, com hospedagem e domínio inclusos. Prazo a partir de 15 dias úteis. Peça um orçamento pelo WhatsApp.`,
      ogImage: OG.home,
    },
  },
];

export function getLanding(slug: string) {
  return LANDINGS.find((l) => l.slug === slug);
}
