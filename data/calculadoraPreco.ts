/**
 * Página /calculadora-preco-site.
 *
 * Os pisos saem de PUBLIC_PRICE (landing R$ 600, institucional R$ 1.500).
 * Os prazos são os já publicados nas páginas de serviço: 5 e 15 dias úteis.
 * Não há outro valor. O FAQ visível e o FAQPage saem do mesmo array.
 */

import { PUBLIC_PRICE, type FaqItem } from "@/data/servicePages";

export const CALC_PATH = "/calculadora-preco-site";

export const CALC_H1 = "Calculadora de preço de site";

export const CALC_CRUMB = CALC_H1;

/** O template do layout acrescenta " · Coded by M". */
export const CALC_TITLE = `${CALC_H1} · Coded by M`;

const LANDING_PRECO = `a partir de ${PUBLIC_PRICE.landing.display}`;
const LANDING_PRAZO = "a partir de 5 dias úteis";
const INSTITUCIONAL_PRECO = `a partir de ${PUBLIC_PRICE.institucional.display}`;
const INSTITUCIONAL_PRAZO = "a partir de 15 dias úteis";

export const CALC_ESCOPO = "O valor final depende do escopo.";

/** O artigo já publica hospedagem e domínio no valor, para os dois tipos. */
export const CALC_INCLUSO = "Hospedagem e domínio inclusos";

export const CALC_DESCRIPTION = `Landing page ${LANDING_PRECO} e ${LANDING_PRAZO}. Site institucional ${INSTITUCIONAL_PRECO} e ${INSTITUCIONAL_PRAZO}. ${CALC_ESCOPO}`;

export const CALC_TIPOS = [
  {
    id: "landing",
    label: "Landing page",
    preco: LANDING_PRECO,
    prazo: LANDING_PRAZO,
  },
  {
    id: "institucional",
    label: "Site institucional",
    preco: INSTITUCIONAL_PRECO,
    prazo: INSTITUCIONAL_PRAZO,
  },
] as const;

export type CalculadoraTipo = (typeof CALC_TIPOS)[number]["id"];

/**
 * Único extra, sem preço. A frase corrida fica em minúscula.
 * O rótulo do campo usa a mesma frase com inicial maiúscula.
 */
export const CALC_PLANO_FRASE = "plano mensal de suporte e atualizações (opcional, sem preço)";

export const CALC_PLANO_LABEL = `P${CALC_PLANO_FRASE.slice(1)}`;

export const CALC_FAQ: FaqItem[] = [
  {
    q: "A calculadora mostra o preço fechado?",
    a: `Não. O resultado mostra só a faixa "a partir de". ${CALC_ESCOPO} O valor é fechado no orçamento, antes de começar.`,
  },
  {
    q: "Qual a faixa de uma landing page?",
    a: `Landing page ${LANDING_PRECO} e ${LANDING_PRAZO}. ${CALC_ESCOPO}`,
  },
  {
    q: "Qual a faixa de um site institucional?",
    a: `Site institucional ${INSTITUCIONAL_PRECO} e ${INSTITUCIONAL_PRAZO}. ${CALC_ESCOPO}`,
  },
  {
    q: "O plano mensal tem preço?",
    a: `Não. O ${CALC_PLANO_FRASE} não muda a faixa. O valor desse plano depende do serviço.`,
  },
  {
    q: "As escolhas ficam salvas?",
    a: "Não. As escolhas só montam a mensagem do WhatsApp. Nada fica gravado no navegador.",
  },
];

/** Mensagem do WhatsApp, só com o que a pessoa escolheu. Sem outro preço. */
export function calculatorMessage(input: {
  tipo: CalculadoraTipo | null;
  plano: boolean;
  detalhes: string;
}): string {
  const tipo = CALC_TIPOS.find((item) => item.id === input.tipo);
  const linhas = [
    "Olá! Vim pela calculadora de preço de site da Coded by M.",
    tipo
      ? `Tipo: ${tipo.label}. Faixa: ${tipo.preco} e ${tipo.prazo}. ${CALC_INCLUSO}.`
      : "Tipo: ainda não escolhi entre landing page e site institucional.",
    input.plano ? `${CALC_PLANO_LABEL}: quero incluir.` : `${CALC_PLANO_LABEL}: não.`,
  ];
  const detalhes = input.detalhes.trim();
  if (detalhes) linhas.push(`Detalhes: ${detalhes}`);
  linhas.push(CALC_ESCOPO);
  return linhas.join("\n");
}
