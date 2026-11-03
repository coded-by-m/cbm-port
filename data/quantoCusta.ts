/**
 * Artigo /quanto-custa-um-site-florianopolis.
 *
 * Texto, title e meta fechados em 2026-11-03. O FAQ visível e o FAQPage
 * saem do mesmo array, em texto puro. O title já inclui "· Coded by M":
 * a página declara title.absolute para o template do layout não repetir.
 */

import type { FaqItem } from "@/data/servicePages";

export const QUANTO_CUSTA_PATH = "/quanto-custa-um-site-florianopolis";

/** datePublished e dateModified do Article. */
export const QUANTO_CUSTA_DATE = "2026-11-03";

export const QUANTO_CUSTA_TITLE =
  "Quanto custa um site em Florianópolis (2026) · Coded by M";

export const QUANTO_CUSTA_DESCRIPTION =
  "Landing page a partir de R$ 600 e site institucional a partir de R$ 1.500 em Florianópolis. Veja o que muda o preço e peça seu orçamento grátis.";

export const QUANTO_CUSTA_H1 = "Quanto custa um site em Florianópolis em 2026?";

/** Nome do BreadcrumbList. Diferente do H1 de propósito: a URL não leva o ano. */
export const QUANTO_CUSTA_CRUMB = "Quanto custa um site em Florianópolis";

export const QUANTO_CUSTA_LEAD = [
  "Na Coded by M, estúdio de web design em Florianópolis, uma landing page custa a partir de R$ 600 e um site institucional a partir de R$ 1.500. O valor final depende do escopo do projeto e é fechado com você antes de começar, com orçamento gratuito e sem compromisso.",
  "Todos os sites são feitos do zero, com código próprio. O estúdio fica em Florianópolis (SC) e atende empresas de todo o Brasil de forma remota.",
] as const;

export const QUANTO_CUSTA_TABLE_NOTE =
  'Os valores "a partir de" são o ponto de partida. O preço de cada projeto sai do escopo, explicado abaixo.';

export const QUANTO_CUSTA_ROWS = [
  {
    tipo: "Landing page",
    href: "/landing-page",
    para: "Uma página focada em uma oferta, campanha ou serviço, com um objetivo claro de contato",
    incluso: "Design e código do zero, hospedagem e domínio",
    preco: "a partir de R$ 600",
  },
  {
    tipo: "Site institucional",
    href: "/site-institucional",
    para: "Empresa que precisa apresentar quem é, o que faz e como ser contratada, em várias páginas",
    incluso: "Design e código do zero, hospedagem e domínio",
    preco: "a partir de R$ 1.500",
  },
  {
    tipo: "Outros projetos ou escopo maior",
    href: null,
    para: "Projetos que vão além de uma landing page ou de um site institucional padrão",
    incluso: "Definido no orçamento",
    preco: "sob consulta",
  },
] as const;

export const QUANTO_CUSTA_INCLUSO_HEADING = "Hospedagem, domínio e mensalidade";

export const QUANTO_CUSTA_INCLUSO = [
  "A hospedagem fica por minha conta e está incluída no valor final do projeto. Eu registro o domínio, e o custo também está incluído no valor do projeto.",
  "A mensalidade é um plano opcional de acompanhamento e atualizações recorrentes. Ela depende do serviço.",
] as const;

export const QUANTO_CUSTA_FATORES = [
  {
    label: "Escopo",
    text: "uma landing page resolve um objetivo só. Um site institucional apresenta a empresa inteira. Quanto mais coisas o site precisa fazer, maior o trabalho.",
  },
  {
    label: "Número de páginas",
    text: "cada página nova (serviços, sobre, projetos, contato) é desenhada e programada à parte.",
  },
  {
    label: "Conteúdo",
    text: "faz diferença se você já tem textos e fotos prontos ou se eles precisam ser organizados junto com o site.",
  },
  {
    label: "Integrações",
    text: "formulários, WhatsApp, mapas, agenda ou outras ferramentas conectadas ao site entram no escopo e no valor.",
  },
  {
    label: "Design sob medida",
    text: "como o site é feito do zero, o layout acompanha a sua marca, sem adaptar um modelo pronto.",
  },
] as const;

export const QUANTO_CUSTA_PASSOS = [
  "Conte o que a empresa faz, o objetivo do site e se você já tem textos e fotos.",
  "Você recebe resposta no mesmo dia pelo WhatsApp.",
  "Se precisar alinhar detalhes, fazemos uma reunião online.",
] as const;

export const QUANTO_CUSTA_ORCAMENTO = "O orçamento é gratuito e sem compromisso.";

export const QUANTO_CUSTA_CTA = "Pedir orçamento no WhatsApp";

export const QUANTO_CUSTA_FAQ: FaqItem[] = [
  {
    q: "Quanto custa um site institucional em Florianópolis?",
    a: "Na Coded by M, um site institucional custa a partir de R$ 1.500. O valor final depende do escopo, como número de páginas, conteúdo e integrações.",
  },
  {
    q: "Quanto custa uma landing page?",
    a: "Uma landing page custa a partir de R$ 600 na Coded by M. O valor final depende do escopo do projeto.",
  },
  {
    q: "O orçamento é pago?",
    a: "Não. O orçamento é gratuito e sem compromisso.",
  },
  {
    q: "Em quanto tempo recebo resposta?",
    a: "Você recebe resposta no mesmo dia pelo WhatsApp.",
  },
  {
    q: "Preciso estar em Florianópolis para contratar?",
    a: "Não. O estúdio fica em Florianópolis e atende empresas de todo o Brasil de forma remota, com reuniões online.",
  },
  {
    q: "O site é feito com modelo pronto?",
    a: "Não. Os sites são feitos do zero, com código próprio.",
  },
  {
    q: "A hospedagem e o domínio estão inclusos?",
    a: "Sim. A hospedagem fica por minha conta e está incluída no valor final do projeto. Eu registro o domínio, e o custo também está incluído no valor do projeto.",
  },
  {
    q: "Tem mensalidade?",
    a: "Não é obrigatória. Há um plano opcional de acompanhamento e atualizações recorrentes, e ele depende do serviço.",
  },
];
