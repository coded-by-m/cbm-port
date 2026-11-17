/**
 * Landing de anúncio: o conteúdo de `/criacao-de-sites`.
 *
 * Uma landing só, de propósito (decisão de 2026-11-17): a de arquitetura saiu e
 * `/lp/arquitetura` redireciona para `/sites-para-arquitetura`. A página nasce
 * `noindex`: ela existe pra receber clique pago, e se o Google indexasse,
 * competiria com a `/` pelas mesmas buscas e entregaria a quem vem da busca uma
 * página sem navegação.
 *
 * ATENÇÃO: o copy daqui é rascunho e precisa de revisão. Respostas marcadas com
 * PREENCHER dependem de números que só o Matheus tem e NÃO aparecem na página
 * enquanto tiverem o marcador (ver `isFilled`).
 */

import {
  ATENDE_BRASIL,
  CONTRATO_NF,
  ESTUDIO_SOLO,
  GARANTIA_GOOGLE,
  HOSPEDAGEM_INCLUSA,
  INSTITUCIONAL_PRECO,
  LAYOUT_AJUSTES,
  PAINEL_VISITAS,
  PLANO_MENSAL,
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
  /** Blocos da página, na ordem em que aparecem. */
  blocks: LandingBlock[];
  /** Hero. */
  headline: string;
  sub: string;
  ctaLabel: string;
  /**
   * Linha de preço do hero, entre o subtítulo e o CTA: os pisos dos dois
   * serviços, para filtrar quem procura o site mais barato antes do clique.
   */
  heroPrice?: string;
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
    /** O que fica de fora, dito antes da conversa. */
    excludes?: string;
  };
  processHeading: string;
  /** Objeções reais de quem compara antes de chamar. */
  faq: LandingFaq[];
  final: { heading: string; text: string };
  /** Base da mensagem do WhatsApp; a origem da campanha é anexada em runtime. */
  waMessage: string;
  /** A rota é noindex, mas o preview do link em WhatsApp e LinkedIn importa. */
  meta: { title: string; description: string; ogImage: string };
}

/** Endereço da landing. Os antigos `/lp/*` redirecionam para cá (next.config.js). */
export const LANDING_PATH = "/criacao-de-sites";

export const LANDING: LandingConfig = {
  /** Quem vem do Google já procura um site: preço e prova antes da dor. */
  blocks: ["hero", "proof", "pains", "differentials", "offer", "process", "faq", "final"],

  headline: "Site profissional para a sua empresa, feito do zero.",
  /** Subtítulo e linha de preço como a análise do Gianini sugeriu (2026-11-16). */
  sub: "Sites e landing pages sob medida em Florianópolis, feitos por quem desenha e programa. Você fala direto comigo e fica com o código e os acessos.",
  heroPrice: `Landing page a partir de ${PUBLIC_PRICE.landing.display} · site institucional a partir de ${PUBLIC_PRICE.institucional.display}. Valor final no orçamento.`,
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

  /** As dores da persona (2026-11-16), nas palavras de quem contrata. */
  pains: [
    "Você evita mandar o link do site, porque ele parece de uma empresa menor que a sua.",
    "O concorrente é mais novo, o site dele passa mais confiança, e o orçamento vai para ele.",
    "Quem fez o seu site sumiu, e você ficou sem o código e sem os acessos.",
    "As pessoas entram no site, olham tudo e não chamam no WhatsApp.",
  ],

  differentials: {
    heading: "O que muda quando o site é feito do zero.",
    items: [
      {
        title: "Atendimento direto",
        text: "Você fala com quem desenha e programa o site. Sem atendente e sem repasse para terceiros.",
      },
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
        title: "Nada preso",
        text: "O domínio é registrado no nome da sua empresa e, na entrega, código e acessos ficam com você.",
      },
      {
        title: "Painel de visitas",
        text: `Acesso ao Coded Insights para ver ${PAINEL_VISITAS}.`,
      },
    ],
  },

  offer: {
    heading: "Site institucional sob medida.",
    includes: getServicePage("site-institucional").includes,
    price: `A partir de ${PUBLIC_PRICE.institucional.display}`,
    deadline: "A partir de 15 dias úteis",
    note: "O valor final depende do projeto e é fechado no WhatsApp, antes de começar. Dá para parcelar.",
    alternative: `Precisa só de uma página? Landing page a partir de ${PUBLIC_PRICE.landing.display}, em 5 dias úteis.`,
    excludes: "Não inclui loja virtual, logotipo nem gestão de anúncios.",
  },

  processHeading: "Quatro etapas, e você sabe onde está em cada uma.",

  faq: [
    { q: "Quanto custa um site?", a: INSTITUCIONAL_PRECO },
    {
      q: "Em quanto tempo fica pronto?",
      a: "A partir de 15 dias úteis. O prazo final depende do número de páginas e do conteúdo e é fechado no orçamento no WhatsApp, antes de começar.",
    },
    HOSPEDAGEM_INCLUSA,
    { q: "Tem mensalidade?", a: PLANO_MENSAL },
    CONTRATO_NF,
    LAYOUT_AJUSTES,
    ESTUDIO_SOLO,
    GARANTIA_GOOGLE,
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
    description: `Sites e landing pages feitos do zero. Landing page a partir de ${PUBLIC_PRICE.landing.display} e site institucional a partir de ${PUBLIC_PRICE.institucional.display}, com hospedagem e domínio inclusos. Peça um orçamento pelo WhatsApp.`,
    ogImage: OG.home,
  },
};
