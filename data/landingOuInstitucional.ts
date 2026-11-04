/**
 * Artigo /landing-page-ou-site-institucional.
 *
 * Texto, title e meta fechados em 2026-11-03. O title aprovado não leva
 * "· Coded by M": a página usa title.absolute para o template do layout
 * não acrescentar o sufixo. O FAQ visível e o FAQPage saem do mesmo array,
 * em texto puro.
 *
 * A célula "igual" da linha "Em comum" no rascunho é a mesma frase nas duas
 * colunas. A página publica a frase, sem a anotação.
 */

import type { FaqItem } from "@/data/servicePages";
import { QUANTO_CUSTA_PATH } from "@/data/quantoCusta";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";

export const LP_OU_PATH = "/landing-page-ou-site-institucional";

/** URL absoluta com www, a mesma origem do canonical. */
export const LP_OU_URL = `${SITE_URL}${LP_OU_PATH}`;

/** datePublished do Article. O dateModified é LP_OU_MODIFIED. */
export const LP_OU_DATE = "2026-11-03";

/** dateModified do Article. */
export const LP_OU_MODIFIED = "2026-11-04";

export const LP_OU_TITLE = "Landing page ou site institucional: qual escolher?";

export const LP_OU_DESCRIPTION =
  "Veja a diferença entre landing page e site institucional, quando usar cada um e o preço de partida, e escolha o formato certo para a sua empresa.";

export const LP_OU_H1 = LP_OU_TITLE;

/** Nome do BreadcrumbList. Igual ao H1: é o que a trilha mostra. */
export const LP_OU_CRUMB = LP_OU_H1;

export const LP_OU_LEAD =
  "Escolha uma landing page quando o site tem um objetivo só, como divulgar um serviço ou uma campanha e levar a pessoa a entrar em contato. Escolha um site institucional quando a empresa precisa se apresentar por completo, com páginas para serviços, história e projetos. Na Coded by M, em Florianópolis, a landing page parte de R$ 600 e o site institucional de R$ 1.500, com valor final conforme o escopo.";

export const LP_OU_TABLE_HEADING = "Diferença entre landing page e site institucional";

export const LP_OU_TABLE_COLS = ["Landing page", "Site institucional"] as const;

export type CopyPart =
  | { type: "text"; text: string }
  | { type: "internal"; href: string; label: string }
  | { type: "external"; href: string; label: string };

const LANDING_URL = `${SITE_URL}/landing-page`;
const INSTITUCIONAL_URL = `${SITE_URL}/site-institucional`;
const PRECO_URL = `${SITE_URL}${QUANTO_CUSTA_PATH}`;
const CALC_URL = `${SITE_URL}/calculadora-preco-site`;

const EM_COMUM =
  "Eu faço os dois do zero, com código próprio e a identidade do cliente; hospedagem e domínio inclusos, com domínio no nome do cliente";

export const LP_OU_ROWS: {
  criterio: string;
  landing: readonly CopyPart[];
  institucional: readonly CopyPart[];
}[] = [
  {
    criterio: "O que é",
    landing: [{ type: "text", text: "Uma página focada em uma oferta" }],
    institucional: [
      { type: "text", text: "Várias páginas que apresentam a empresa inteira" },
    ],
  },
  {
    criterio: "Objetivo",
    landing: [
      { type: "text", text: "Uma ação principal, como chamar no WhatsApp" },
    ],
    institucional: [
      {
        type: "text",
        text: "Explicar quem é a empresa, o que faz e como contratar",
      },
    ],
  },
  {
    criterio: "Quando usar",
    landing: [
      {
        type: "text",
        text: "Campanha, anúncio, lançamento ou um serviço específico",
      },
    ],
    institucional: [
      {
        type: "text",
        text: "Empresa com vários serviços ou que precisa de presença completa",
      },
    ],
  },
  {
    criterio: "Prazo na Coded by M",
    landing: [
      { type: "text", text: "veja em " },
      { type: "internal", href: LANDING_URL, label: "landing page" },
    ],
    institucional: [
      { type: "text", text: "veja em " },
      { type: "internal", href: INSTITUCIONAL_URL, label: "site institucional" },
    ],
  },
  {
    criterio: "Investimento na Coded by M",
    landing: [{ type: "text", text: "a partir de R$ 600" }],
    institucional: [{ type: "text", text: "a partir de R$ 1.500" }],
  },
  {
    criterio: "Em comum",
    landing: [{ type: "text", text: EM_COMUM }],
    institucional: [{ type: "text", text: EM_COMUM }],
  },
];

export const LP_OU_TABLE_NOTE: readonly CopyPart[] = [
  {
    type: "text",
    text: 'Valores "a partir de": o preço final depende do escopo. Para entender o que muda o valor, veja ',
  },
  {
    type: "internal",
    href: PRECO_URL,
    label: "quanto custa um site em Florianópolis",
  },
  { type: "text", text: " ou simule na " },
  { type: "internal", href: CALC_URL, label: "calculadora de preço de site" },
  { type: "text", text: "." },
];

/** Frase logo abaixo da tabela: estudo de caso da Vodafone no web.dev. */
export const LP_OU_VELOCIDADE: readonly CopyPart[] = [
  { type: "text", text: "Código enxuto também pesa na conversão: no " },
  {
    type: "external",
    href: "https://web.dev/case-studies/vodafone",
    label: "estudo de caso da Vodafone publicado no web.dev",
  },
  {
    type: "text",
    text: " (Google, 2021), uma melhora de 31% no LCP, métrica de velocidade de carregamento, resultou em 8% mais vendas.",
  },
];

export const LP_OU_LP_HEADING = "Quando a landing page é a melhor escolha";

export const LP_OU_LP_ITEMS: readonly (readonly CopyPart[])[] = [
  [
    {
      type: "text",
      text: "Você quer divulgar um serviço ou uma campanha específica.",
    },
  ],
  [
    {
      type: "text",
      text: "Vai investir em anúncios e precisa de uma página que leve a uma ação só. Segundo o ",
    },
    {
      type: "external",
      href: "https://agenciasebrae.com.br/dados/quase-metade-dos-pequenos-negocios-investe-em-propaganda-paga-na-internet/",
      label: "Sebrae",
    },
    {
      type: "text",
      text: " (Pulso dos Pequenos Negócios, 2024), 48% dos pequenos negócios já pagaram propaganda na internet.",
    },
  ],
  [
    {
      type: "text",
      text: "Precisa testar uma oferta antes de investir em mais páginas.",
    },
  ],
];

export const LP_OU_LP_MORE: readonly CopyPart[] = [
  { type: "text", text: "Saiba mais na página de " },
  { type: "internal", href: LANDING_URL, label: "landing page" },
  { type: "text", text: "." },
];

export const LP_OU_INST_HEADING = "Quando o site institucional é a melhor escolha";

export const LP_OU_INST_ITEMS = [
  "A empresa tem vários serviços e cada um merece explicação própria.",
  "Quem pesquisa a empresa quer ver história, projetos e formas de contato. E 89,1% das pessoas com 10 anos ou mais usaram a internet nos últimos três meses (IBGE, PNAD Contínua TIC 2024).",
  "O site vai ser a referência principal da marca na internet.",
] as const;

export const LP_OU_INST_MORE: readonly CopyPart[] = [
  { type: "text", text: "Saiba mais na página de " },
  { type: "internal", href: INSTITUCIONAL_URL, label: "site institucional" },
  { type: "text", text: "." },
];

export const LP_OU_MIGRAR_HEADING = "Dá para começar com uma e depois ter a outra?";

export const LP_OU_MIGRAR =
  "Sim. Dá para começar com uma landing page para um objetivo imediato e, depois, partir para um site institucional. Se ficar em dúvida, conte o objetivo no orçamento e o formato é indicado junto.";

export const LP_OU_COMO_HEADING = "Como funciona na Coded by M";

export const LP_OU_COMO =
  "Trabalho de Florianópolis e atendo empresas de todo o Brasil, com reuniões online. O orçamento é grátis e eu respondo no mesmo dia pelo WhatsApp. Depois da entrega, existe um plano mensal opcional de suporte e atualizações, com valor que depende do serviço.";

export const LP_OU_CTA = "Pedir orçamento no WhatsApp";

export const LP_OU_CTA_HREF = `https://wa.me/${WHATSAPP_NUMBER}`;

export const LP_OU_FAQ: FaqItem[] = [
  {
    q: "Qual é a diferença entre landing page e site institucional?",
    a: "A landing page é uma página única focada em uma ação, como pedir orçamento. O site institucional tem várias páginas e apresenta a empresa inteira: serviços, história, projetos e contato.",
  },
  {
    q: "Landing page serve para anúncios?",
    a: "Sim. Como tem um objetivo só, a landing page é indicada para receber o tráfego de uma campanha e levar a pessoa direto para a ação principal. Segundo o Sebrae, 48% dos pequenos negócios já pagaram propaganda na internet (Pulso dos Pequenos Negócios, 2024).",
  },
  {
    q: "Uma landing page pode substituir o site da empresa?",
    a: "Para quem tem um serviço principal, uma landing page pode bastar no começo. Quando a empresa tem vários serviços ou precisa mostrar história e projetos, o site institucional é o formato mais indicado.",
  },
  {
    q: "Posso ter landing page e site institucional ao mesmo tempo?",
    a: "Sim. O site institucional apresenta a empresa e a landing page pode ser usada para uma campanha ou um serviço específico.",
  },
];
