/**
 * Artigo /como-escolher-empresa-criacao-de-sites-florianopolis.
 *
 * Texto, title e meta fechados em 2026-11-03. O title aprovado não leva
 * "· Coded by M": a página usa title.absolute para o template do layout
 * não acrescentar o sufixo. O FAQ visível e o FAQPage saem do mesmo array,
 * em texto puro.
 */

import { CALC_PATH } from "@/data/calculadoraPreco";
import { QUANTO_CUSTA_PATH } from "@/data/quantoCusta";
import type { FaqItem } from "@/data/servicePages";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/contact";

export const ESCOLHER_PATH = "/como-escolher-empresa-criacao-de-sites-florianopolis";

/** datePublished e dateModified do Article. */
export const ESCOLHER_DATE = "2026-11-03";

export const ESCOLHER_TITLE = "Como escolher empresa de criação de sites em Floripa";

export const ESCOLHER_DESCRIPTION =
  "Checklist para escolher uma empresa de criação de sites em Florianópolis: código próprio, domínio, prazo, preço público, portfólio e atendimento.";

export const ESCOLHER_H1 =
  "Como escolher uma empresa de criação de sites em Florianópolis";

/** Nome do BreadcrumbList. Igual ao H1: é o que a trilha mostra. */
export const ESCOLHER_CRUMB = ESCOLHER_H1;

export const ESCOLHER_LEAD =
  "Para escolher uma empresa de criação de sites em Florianópolis, compare seis pontos que dá para conferir antes de assinar: se o site é feito com código próprio ou com template, em nome de quem ficam o domínio e a hospedagem, qual é o prazo por escrito, se o preço é público, se o portfólio tem sites reais no ar e como funciona o atendimento. Uma boa empresa responde a todos eles com clareza, antes de você pagar qualquer coisa.";

export const ESCOLHER_CHECKLIST_HEADING =
  "Checklist: 6 critérios para comparar empresas de sites";

export const ESCOLHER_CRITERIOS = [
  {
    title: "1. Código próprio ou template",
    body: "Template é um modelo pronto adaptado com a sua marca. Código próprio é um site desenhado e programado do zero para o seu projeto. Os dois podem funcionar, mas mudam o quanto o site se adapta à sua empresa e o quanto ele depende de uma plataforma.",
    verificar:
      'pergunte diretamente "o site é feito do zero ou a partir de um tema?" e peça para ver um projeto parecido com o seu já no ar.',
  },
  {
    title: "2. Quem é dono do domínio e da hospedagem",
    body: "O domínio é o endereço do site (por exemplo, suaempresa.com.br) e a hospedagem é onde ele fica no ar. Saber quem controla cada um evita surpresas se um dia você quiser mudar de fornecedor.",
    verificar:
      "pergunte em nome de quem o domínio será registrado e se ele continua seu caso você mude de fornecedor. Para domínios .br, a titularidade pode ser consultada no Registro.br.",
  },
  {
    title: "3. Prazo de entrega por escrito",
    body: "Prazo vago dificulta planejar lançamento, campanha ou mudança de marca.",
    verificar:
      "peça o prazo no orçamento, contado em dias úteis, e pergunte o que depende de você (textos, fotos, aprovações) para ele ser cumprido.",
  },
  {
    title: "4. Preço público ou, pelo menos, um ponto de partida",
    body: "Um valor de partida publicado ajuda a saber se a empresa cabe no seu orçamento antes da primeira conversa.",
    verificar:
      'procure no site da empresa um "a partir de" e pergunte o que entra no valor e o que é cobrado à parte, como hospedagem, domínio ou mensalidade.',
  },
  {
    title: "5. Portfólio real",
    body: "Imagens bonitas não mostram se o site funciona. Um site no ar mostra.",
    verificar:
      "abra os projetos do portfólio no navegador, teste no celular e confira se a empresa separa clientes reais de estudos conceituais.",
  },
  {
    title: "6. Atendimento",
    body: "Você vai precisar tirar dúvidas durante e depois do projeto.",
    verificar:
      "mande uma mensagem pelo canal que a empresa divulga e observe em quanto tempo e com que clareza ela responde. Pergunte também quem vai cuidar do seu projeto e se existe suporte depois da entrega.",
  },
] as const;

export const ESCOLHER_TABLE_HEADING = "Como a Coded by M responde a cada critério";

export const ESCOLHER_TABLE_COLS = ["Critério", "Coded by M"] as const;

export type CopyPart =
  | { type: "text"; text: string }
  | { type: "internal"; href: string; label: string }
  | { type: "external"; href: string; label: string };

const WA = `https://wa.me/${WHATSAPP_NUMBER}`;

export const ESCOLHER_ROWS: { criterio: string; parts: readonly CopyPart[] }[] = [
  {
    criterio: "Código próprio ou template",
    parts: [
      {
        type: "text",
        text: "Todos os projetos são feitos do zero, com código próprio e a identidade de cada cliente.",
      },
    ],
  },
  {
    criterio: "Domínio e hospedagem",
    parts: [
      {
        type: "text",
        text: "O domínio é registrado no nome do cliente. A Coded by M cuida de tudo, com hospedagem e domínio inclusos no preço do projeto. Se você quiser sair, o domínio continua seu.",
      },
    ],
  },
  {
    criterio: "Prazo",
    parts: [
      { type: "text", text: "Prazo informado no orçamento. Veja o prazo de cada serviço em " },
      { type: "internal", href: "/landing-page", label: "landing page" },
      { type: "text", text: " e " },
      { type: "internal", href: "/site-institucional", label: "site institucional" },
      { type: "text", text: "." },
    ],
  },
  {
    criterio: "Preço público",
    parts: [
      {
        type: "text",
        text: "Landing page a partir de R$ 600 e site institucional a partir de R$ 1.500. O valor final depende do escopo. Detalhes em ",
      },
      {
        type: "internal",
        href: QUANTO_CUSTA_PATH,
        label: "quanto custa um site em Florianópolis",
      },
      { type: "text", text: " e na " },
      { type: "internal", href: CALC_PATH, label: "calculadora de preço de site" },
      { type: "text", text: "." },
    ],
  },
  {
    criterio: "Portfólio real",
    parts: [
      { type: "text", text: "O " },
      { type: "internal", href: "/projetos", label: "portfólio" },
      { type: "text", text: " separa clientes no ar e estudos conceituais." },
    ],
  },
  {
    criterio: "Atendimento",
    parts: [
      {
        type: "text",
        text: "Resposta no mesmo dia pelo WhatsApp, orçamento grátis e reuniões online. Quem faz os projetos é o próprio fundador, Matheus Mendes (",
      },
      { type: "internal", href: "/sobre", label: "sobre" },
      {
        type: "text",
        text: "). Depois da entrega, há um plano mensal opcional de suporte e atualizações, com valor que depende do serviço.",
      },
    ],
  },
];

export const ESCOLHER_PROXIMO_HEADING = "Próximo passo";

export const ESCOLHER_PROXIMO: readonly CopyPart[] = [
  {
    type: "text",
    text: "Se quiser aplicar este checklist ao seu projeto, mande as perguntas acima no WhatsApp ",
  },
  { type: "external", href: WA, label: WHATSAPP_DISPLAY },
  { type: "text", text: " ou pela página de " },
  { type: "internal", href: "/contato", label: "contato" },
  { type: "text", text: ". O orçamento é gratuito." },
];

export const ESCOLHER_CTA = "Pedir orçamento no WhatsApp";

export const ESCOLHER_CTA_HREF = WA;

export const ESCOLHER_FAQ: FaqItem[] = [
  {
    q: "O que perguntar antes de contratar uma empresa de criação de sites?",
    a: "Pergunte se o site é feito do zero ou com template, em nome de quem fica o domínio, qual é o prazo em dias úteis, o que está incluso no preço e quem vai atender você durante e depois do projeto.",
  },
  {
    q: "Como saber se um site foi feito com template?",
    a: "Pergunte diretamente à empresa e peça projetos parecidos com o seu já no ar. Sites diferentes entre si no layout e na estrutura indicam trabalho sob medida.",
  },
  {
    q: "Em nome de quem o domínio deve ser registrado?",
    a: "No nome da sua empresa, para que ele continue seu se você mudar de fornecedor. Na Coded by M, o domínio é registrado no nome do cliente. Para domínios .br, a titularidade pode ser consultada no Registro.br.",
  },
  {
    q: "Por que um preço público ajuda na escolha?",
    a: "Um valor de partida publicado mostra se a empresa cabe no seu orçamento antes da conversa e facilita comparar o que cada proposta inclui.",
  },
  {
    q: "Como avaliar o portfólio de uma empresa de sites?",
    a: "Abra os projetos no navegador e no celular, veja se estão no ar e se a empresa diferencia clientes reais de estudos conceituais.",
  },
];

/** Frase no fim do artigo de preço. O ponto final fica depois do link. */
export const ESCOLHER_BACKLINK_BEFORE = "Ainda comparando fornecedores? Veja ";

export const ESCOLHER_BACKLINK_LABEL =
  "como escolher uma empresa de criação de sites em Florianópolis";
