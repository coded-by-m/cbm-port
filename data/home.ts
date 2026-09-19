/**
 * Copy da home (`/`) — o que não vem de cases/services/process/about.
 *
 * Fonte única do texto novo escrito para o site estático. Origem: design
 * aprovado no Claude Design (projeto "Hero da home pronto", 2026-09-19).
 */

/** Slug do projeto em destaque no hero. Trocar aqui troca a vitrine inteira. */
export const FEATURED_SLUG = "estudio-lentz";

export const HERO = {
  eyebrow: "Webdesign e websoftware · Florianópolis",
  headline: "Presença digital à altura da empresa por trás dela",
  sub: "A Coded by M une design, tecnologia e pensamento estrutural. Landing pages, sites institucionais e aplicações web — da estratégia ao deploy, no mesmo lugar.",
  ctaPrimary: "Começar meu projeto",
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
    heading: "Projetos entregues, no ar e medidos.",
    sub: "Seis projetos publicados entre 2025 e 2026 — landing pages de conversão e sites institucionais para arquitetura, engenharia e indústria.",
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
  contato: {
    label: "Convite",
    heading: "Vamos construir a sua.",
    sub: "Conversa direta no WhatsApp: você conta o contexto, eu digo o que faria, quanto custa e em quanto tempo entrego.",
  },
} as const;

/** Links do menu drawer e das âncoras. */
export const NAV_LINKS = [
  { href: "#top", label: "Home" },
  { href: "#projetos", label: "Projetos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#sobre", label: "Sobre" },
] as const;
