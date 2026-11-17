/**
 * Copy da home (`/`) — o que não vem de cases/services/process/about.
 *
 * Fonte única do texto novo escrito para o site estático. Origem: design
 * aprovado no Claude Design (projeto "Hero da home pronto", 2026-09-19).
 */

import { LP_OU_URL } from "@/data/landingOuInstitucional";
import {
  CONTRATO_NF,
  ESTUDIO_SOLO,
  GARANTIA_GOOGLE,
  HOSPEDAGEM_INCLUSA,
  LAYOUT_AJUSTES,
  PAINEL_VISITAS,
  PLANO_MENSAL,
  PUBLIC_PRICE,
  type FaqItem,
} from "@/data/servicePages";
import { SITE_URL } from "@/lib/site";

/** Slug do projeto em destaque no hero. Trocar aqui troca a vitrine inteira. */
export const FEATURED_SLUG = "estudio-lentz";

/** Mensagem do CTA de orçamento do convite, no fim da home. */
export const HOME_WA_MESSAGE = "Olá! Vim pelo site da Coded by M e quero um orçamento.";

/**
 * O hero é do portfólio: marca e posicionamento, sem preço nem prova na dobra.
 * Dor, preço e prazo logo no topo são papel da landing de anúncio
 * (`/criacao-de-sites`), não desta página (decisão de 2026-11-16).
 */
export const HERO = {
  eyebrow: "Estúdio independente · Florianópolis",
  /** A marca é o enunciado principal do hero. */
  brand: ["Coded", "by M"],
  /**
   * O H1 da página, logo abaixo da marca e em corpo menor. Diz serviço e
   * cidade numa frase só — a marca acima é logo, não título.
   */
  lead: "Criação de sites e landing pages sob medida em Florianópolis",
  headline: "Projetamos a forma como sua empresa é percebida digitalmente.",
  sub: "Landing pages, sites institucionais e aplicações web: da estratégia ao deploy, no mesmo lugar.",
  ctaPrimary: "Começar meu projeto",
  /** Linha de apoio do canto superior direito, como o "BASED IN" da referência. */
  meta: "Design + Development",
  ctaSecondary: "Ver projetos",
} as const;

export const SECTIONS = {
  projetos: {
    label: "Projetos",
    heading: "Projetos no ar, abertos pra conferir.",
    sub: "Dez projetos entre 2025 e 2026: três para clientes e sete conceituais, entre landing pages e sites institucionais para arquitetura, engenharia, interiores, costura, café e indústria. Cada um com o endereço no ar.",
  },
  clientes: {
    label: "Clientes",
    heading: "Três clientes, três sites no ar.",
    sub: "Projetos contratados e entregues, cada um com o endereço para você abrir e conferir. Os outros sete da vitrine são conceituais e estão marcados assim.",
  },
  servicos: {
    label: "Serviços",
    heading: "Landing pages e sites institucionais, feitos do zero.",
    sub: "O mesmo padrão de execução em todo projeto: estratégia antes do desenho, código próprio e entrega com handover.",
    /** O que fica de fora, dito cedo: evita a conversa que não fecha. */
    naoFaz: "O estúdio não faz loja virtual, logotipo nem gestão de anúncios.",
  },
  processo: {
    label: "Método",
    heading: "Todo projeto percorre o mesmo caminho.",
    sub: "Estrutura clara. Sem improvisos.",
  },
  experiencia: {
    label: "Laboratório",
    heading: "Tem uma versão desta página que se constrói na sua frente.",
    sub: "Nove capítulos em WebGL, navegáveis um a um: o mesmo conteúdo deste site, montado camada por camada em vez de exibido. É o que a gente faz quando não tem cliente pra agradar.",
    cta: "Entrar na experiência",
    note: "WebGL · melhor no desktop",
  },
  sobre: {
    label: "Sobre",
  },
  capacidades: {
    label: "Capacidades",
    heading: "O que entra em cada projeto.",
    /** Marcador da escala, alinhado à direita do cabeçalho. */
    aside: "Escala 1: 10",
  },
  faq: {
    label: "Dúvidas",
    heading: "Perguntas frequentes",
  },
  contato: {
    label: "Convite",
    heading: "Vamos construir a sua.",
    sub: "Conversa direta no WhatsApp: você conta o contexto, eu digo o que faria, quanto custa e em quanto tempo entrego.",
    cta: "Pedir orçamento no WhatsApp",
  },
} as const;

/**
 * Perguntas frequentes da home — visíveis antes do convite e no `FAQPage`.
 * PREENCHER = rascunho, fica fora do site e do schema até ter resposta.
 */
export const HOME_FAQ: FaqItem[] = [
  {
    q: "Quanto custa um site ou uma landing page?",
    a: `Landing page a partir de ${PUBLIC_PRICE.landing.display}. Site institucional a partir de ${PUBLIC_PRICE.institucional.display}. Em ambos o valor final depende do projeto; no WhatsApp eu fecho valor e prazo antes de qualquer compromisso. Dá para parcelar.`,
    links: [
      { href: "/landing-page", label: "Landing page" },
      { href: "/site-institucional", label: "Site institucional" },
    ],
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "Landing page a partir de 5 dias úteis. Site institucional a partir de 15 dias úteis, porque tem mais páginas e conteúdo. O prazo final depende do escopo e é fechado no orçamento, antes de começar.",
  },
  HOSPEDAGEM_INCLUSA,
  CONTRATO_NF,
  LAYOUT_AJUSTES,
  {
    q: "Quem cuida do site depois da entrega?",
    a: `${PLANO_MENSAL} Com ou sem plano, código e acessos ficam com você na entrega.`,
  },
  {
    q: "Vou saber quantas pessoas visitam o site?",
    a: `Sim. Todo cliente recebe acesso ao Coded Insights, o painel de visitas do estúdio. Ele mostra ${PAINEL_VISITAS}.`,
  },
  GARANTIA_GOOGLE,
  {
    q: "Vocês fazem loja virtual, logotipo ou gestão de anúncios?",
    a: "Não. O foco é landing page e site institucional, feitos do zero. Loja virtual, logotipo, redes sociais e gestão de anúncios ficam de fora.",
  },
  ESTUDIO_SOLO,
  {
    q: "Landing page ou site institucional: qual escolher?",
    a: "Landing page quando há uma ação principal, como uma campanha ou um serviço. Site institucional quando a empresa precisa de várias páginas. {0}. Se for escritório de arquitetura ou interiores, veja também {1}.",
    links: [
      { href: LP_OU_URL, label: "Veja a comparação completa" },
      { href: `${SITE_URL}/sites-para-arquitetura`, label: "sites para arquitetura" },
    ],
  },
  {
    q: "Vocês atendem fora de Florianópolis?",
    a: "Sim. O estúdio fica em Florianópolis e atendo empresas de todo o Brasil de forma remota.",
  },
  {
    q: "Como funciona o processo?",
    a: "Em quatro etapas: estratégia (diagnóstico, escopo e posicionamento), design (arquitetura, identidade e protótipo), código (implementação e performance) e resultado: mensuração, ajustes e evolução depois do deploy.",
  },
];

/**
 * Links do menu drawer — só âncoras desta página.
 *
 * A Experiência saiu daqui: o rótulo era longo demais pro corpo dos itens e
 * quebrava no meio da sílaba. O caminho pra ela é o rodapé.
 *
 * `id` casa com o `id` da seção, para o marcador de seção ativa.
 */
export const NAV_LINKS = [
  { href: "#top", id: "top", label: "Home" },
  { href: "#projetos", id: "projetos", label: "Projetos" },
  { href: "#servicos", id: "servicos", label: "Serviços" },
  { href: "#processo", id: "processo", label: "Processo" },
  { href: "#sobre", id: "sobre", label: "Sobre" },
] as const;
