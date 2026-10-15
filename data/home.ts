/**
 * Copy da home (`/`) — o que não vem de cases/services/process/about.
 *
 * Fonte única do texto novo escrito para o site estático. Origem: design
 * aprovado no Claude Design (projeto "Hero da home pronto", 2026-09-19).
 */

import type { FaqItem } from "@/data/servicePages";

/** Slug do projeto em destaque no hero. Trocar aqui troca a vitrine inteira. */
export const FEATURED_SLUG = "estudio-lentz";

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
  sub: "Landing pages, sites institucionais e aplicações web — da estratégia ao deploy, no mesmo lugar.",
  ctaPrimary: "Começar meu projeto",
  /** Linha de apoio do canto superior direito, como o "BASED IN" da referência. */
  meta: "Design + Development",
  ctaSecondary: "Ver projetos",
} as const;

/** Selos de disponibilidade. `filled` = losango sólido; senão, contorno. */
export const AVAILABILITY = [
  { label: "Aceitando projetos", filled: true },
  { label: "Agenda 2026 limitada", filled: false },
] as const;

export const SECTIONS = {
  projetos: {
    label: "Projetos",
    heading: "Projetos no ar, abertos pra conferir.",
    sub: "Dez projetos entre 2025 e 2026 — três para clientes e sete conceituais, entre landing pages e sites institucionais para arquitetura, engenharia, interiores, costura, café e indústria. Cada um com o endereço no ar.",
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
    sub: "Nove capítulos em WebGL, navegáveis um a um — o mesmo conteúdo deste site, montado camada por camada em vez de exibido. É o que a gente faz quando não tem cliente pra agradar.",
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
    aside: "Escala 1 — 10",
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
    a: "Depende do escopo: quantidade de páginas, textos e integrações. Você conta o projeto no WhatsApp e eu respondo com valor e prazo antes de qualquer compromisso.",
    links: [
      { href: "/landing-page", label: "Landing page" },
      { href: "/site-institucional", label: "Site institucional" },
    ],
  },
  {
    q: "Qual o prazo de entrega?",
    a: "PREENCHER — prazo típico de landing page e de site institucional.",
  },
  {
    q: "Hospedagem e domínio estão inclusos?",
    a: "PREENCHER — o que entra na entrega e o que fica por conta do cliente.",
  },
  {
    q: "Vocês atendem fora de Florianópolis?",
    a: "Sim. O estúdio fica em Florianópolis, e atendo empresas de todo o Brasil de forma remota.",
  },
  {
    q: "Como funciona o processo?",
    a: "Em quatro etapas: estratégia (diagnóstico, escopo e posicionamento), design (arquitetura, identidade e protótipo), código (implementação e performance) e resultado — mensuração, ajustes e evolução depois do deploy.",
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
