/**
 * Copy da home (`/`) — o que não vem de cases/services/process/about.
 *
 * Fonte única do texto novo escrito para o site estático. Origem: design
 * aprovado no Claude Design (projeto "Hero da home pronto", 2026-09-19).
 */

import { LP_OU_URL } from "@/data/landingOuInstitucional";
import { PUBLIC_PRICE, type FaqItem } from "@/data/servicePages";
import { SITE_URL } from "@/lib/site";

/** Slug do projeto em destaque no hero. Trocar aqui troca a vitrine inteira. */
export const FEATURED_SLUG = "estudio-lentz";

export const HERO = {
  eyebrow: "Estúdio independente · Florianópolis",
  brand: "Coded by M",
  lead: "Criação de sites profissionais e landing pages para pequenas empresas.",
  headline:
    "Sites sob medida, feitos para passar confiança e transformar visitas em conversas.",
  ctaPrimary: "Pedir orçamento",
  ctaSecondary: "Ver projetos",
  trust:
    "Você fala direto com Matheus Mendes, quem desenha e programa. Código e acessos são seus na entrega.",
} as const;

export const SECTIONS = {
  projetos: {
    label: "Projetos",
    heading: "Projetos no ar, abertos pra conferir.",
    sub: "Dez projetos entre 2025 e 2026: três para clientes e sete conceituais, entre landing pages e sites institucionais para arquitetura, engenharia, interiores, costura, café e indústria. Cada um com o endereço no ar.",
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
  insights: {
    label: "Coded Insights",
    heading: "Seu site não termina na entrega.",
    body: "Todo site entregue pode ser acompanhado no Coded Insights, um painel próprio de visitas e cliques, sem dados pessoais.",
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
 * Perguntas frequentes da home — visíveis antes do convite e no `FAQPage`.
 * PREENCHER = rascunho, fica fora do site e do schema até ter resposta.
 */
export const HOME_FAQ: FaqItem[] = [
  {
    q: "Quanto custa um site ou uma landing page?",
    a: `Landing page a partir de ${PUBLIC_PRICE.landing.display}. Site institucional a partir de ${PUBLIC_PRICE.institucional.display}. Em ambos o valor final depende do projeto; no WhatsApp eu fecho valor e prazo antes de qualquer compromisso.`,
    links: [
      { href: "/landing-page", label: "Landing page" },
      { href: "/site-institucional", label: "Site institucional" },
    ],
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
    q: "Em quanto tempo fica pronto?",
    a: "Landing page: 7 dias úteis. Site institucional: a partir de 15 dias úteis.",
  },
  {
    q: "Vocês atendem fora de Florianópolis?",
    a: "Sim. O estúdio fica em Florianópolis e atendo empresas de todo o Brasil de forma remota.",
  },
  {
    q: "Como funciona o processo?",
    a: "Em quatro etapas: estratégia (diagnóstico, escopo e posicionamento), design (arquitetura, identidade e protótipo), código (implementação e performance) e resultado: mensuração, ajustes e evolução depois do deploy.",
  },
  {
    q: "Hospedagem e domínio estão inclusos?",
    a: "Sim. Hospedagem e domínio estão inclusos no preço total do projeto.",
  },
  {
    q: "Como funciona a manutenção depois da entrega?",
    a: "Manutenções básicas são grátis nos 3 primeiros meses. Redesign e mudanças de estrutura são cobrados por hora técnica.",
  },
  {
    q: "Quantas revisões estão inclusas?",
    a: "Os ajustes de design continuam até a aprovação. Depois de aprovado, o projeto inclui 3 rodadas de alteração.",
  },
  {
    q: "Você faz outros tipos de projeto?",
    a: "Além de landing pages e sites institucionais, faço e-commerce, apps, logotipos e branding básico. Gestão de tráfego pago ainda não faz parte do serviço.",
  },
  {
    q: "O site já vem com SEO?",
    a: "Todo projeto recebe SEO técnico básico, com estrutura semântica, metadados, sitemap e cuidados de performance. Isso ajuda os mecanismos de busca a entender o site, mas não há promessa de posição no Google.",
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
