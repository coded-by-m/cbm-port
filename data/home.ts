/**
 * Copy da home (`/`) — o que não vem de cases/services/process/about.
 *
 * Fonte única do texto novo escrito para o site estático. Origem: design
 * aprovado no Claude Design (projeto "Hero da home pronto", 2026-09-19).
 */

/** Slug do projeto em destaque no hero. Trocar aqui troca a vitrine inteira. */
export const FEATURED_SLUG = "estudio-lentz";

export const HERO = {
  eyebrow: "Estúdio independente · Florianópolis",
  /**
   * O bloco gigante do hero. São a CATEGORIA, não a frase — é isso que
   * permite a escala: duas palavras aguentam 130px, uma sentença não.
   */
  lead: ["Web", "Design"],
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
    heading: "Projetos entregues, no ar e acessíveis.",
    sub: "Seis projetos publicados entre 2025 e 2026 — landing pages de conversão e sites institucionais para arquitetura, engenharia e indústria. Cada um com o endereço no ar, aberto pra conferir.",
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
