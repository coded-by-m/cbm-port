/**
 * Copy da home (`/`) — o que não vem de cases/services/process/about.
 *
 * Fonte única do texto novo escrito para o site estático. Origem: design
 * aprovado no Claude Design (projeto "Hero da home pronto", 2026-09-19).
 */

import { LP_OU_URL } from "@/data/landingOuInstitucional";
import {
  ALEM_DE_SITES,
  APROVACAO_DESIGN,
  HOSPEDAGEM_INCLUSA,
  MANUTENCAO,
  PRAZO_GERAL,
  PRECO_FECHADO,
  PUBLIC_PRICE,
  SEO_TECNICO,
  type FaqItem,
} from "@/data/servicePages";
import { SITE_URL } from "@/lib/site";

/** Slug do cliente em destaque. Machado é o projeto principal. */
export const FEATURED_SLUG = "machado-plataformas";

export const HERO = {
  eyebrow: "Estúdio independente · Florianópolis",
  /** Destaque curto no topo, no lugar da disciplina antiga. */
  ownership: "Código e acessos são seus",
  /**
   * O H1. Diz o que se vende e onde. A marca fica acima, em corpo menor.
   */
  lead: "Criação de sites e landing pages sob medida em Florianópolis",
  benefit:
    "Sua empresa é melhor do que o site que ela tem hoje. Sites feitos do zero para você mandar o link com orgulho e receber contato no WhatsApp.",
  trustLead: "Você fala direto com Matheus Mendes, quem desenha e programa.",
  trustProof: "Código e acessos são seus na entrega.",
  ctaPrimary: "Começar meu projeto",
  ctaSecondary: "Ver projetos",
} as const;

export const SECTIONS = {
  projetos: {
    label: "Projetos",
    heading: "Projetos no ar, abertos pra conferir.",
    sub: "Clientes reais: Machado Plataformas (o principal), MJ Engenharia e Valdete Costuras. Os demais projetos desta vitrine são conceituais, estudos do estúdio, e não são entregas de cliente.",
  },
  servicos: {
    label: "Serviços",
    heading: "Do site de uma página ao sistema inteiro.",
    sub: "Três frentes, o mesmo padrão de execução: estratégia antes do desenho, código próprio e entrega com handover.",
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
  },
} as const;

/**
 * Perguntas frequentes da home. Visíveis antes do convite e no `FAQPage`.
 * O marcador PREENCHER, se voltar, fica fora do site e do schema.
 */
export const HOME_FAQ: FaqItem[] = [
  {
    q: "Quanto custa um site ou uma landing page?",
    a: `Landing page a partir de ${PUBLIC_PRICE.landing.display}. Site institucional a partir de ${PUBLIC_PRICE.institucional.display}. ${PRECO_FECHADO}`,
    links: [
      { href: "/landing-page", label: "Landing page" },
      { href: "/site-institucional", label: "Site institucional" },
    ],
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: PRAZO_GERAL,
  },
  {
    q: "Hospedagem e domínio estão inclusos?",
    a: HOSPEDAGEM_INCLUSA,
  },
  {
    q: "Como funciona a aprovação do design?",
    a: APROVACAO_DESIGN,
  },
  {
    q: "Como funciona a manutenção?",
    a: MANUTENCAO,
  },
  {
    q: "O que vocês fazem além de sites?",
    a: ALEM_DE_SITES,
  },
  {
    q: "O site fica pronto para o Google?",
    a: SEO_TECNICO,
  },
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
