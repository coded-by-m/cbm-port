/**
 * Os 3 serviços da Coded by M.
 *
 * Posicionamento (2026-06-05): CbM faz webdesign + websoftware. O leque
 * cobre desde Landing Pages até Aplicações Web (dashboards, sistemas).
 */

export type ServiceVariant = "landing" | "institutional" | "app";

export interface ServiceConfig {
  /** Identificador. Ex: "landing-pages". */
  slug: string;
  /** Numeração visível no card. */
  index: string;
  /** Variante visual da mini-scene 3D. */
  variant: ServiceVariant;
  /** Título do card (Panchang 700, 24-28px). */
  title: string;
  /** Descrição teaser (3 linhas no estado colapsado). */
  description: string;
  /** Bullets de deliverables no estado expandido. */
  includes: string[];
  /** Perfil de cliente indicado (1-2 linhas, expandido). */
  indicatedFor: string;
  /** Subject do mailto do CTA expandido. */
  mailSubject: string;
}

export const SERVICES: ServiceConfig[] = [
  {
    slug: "landing-pages",
    index: "01",
    variant: "landing",
    title: "Landing Pages",
    description:
      "Sites de conversão. Foco em uma única ação. Performance e clareza.",
    includes: [
      "Estratégia de conversão",
      "Copywriting persuasivo",
      "Design responsivo",
      "Setup de analytics",
      "Deploy e handover",
    ],
    indicatedFor:
      "Empresas com produto único ou campanha específica que precisam de uma página focada em conversão.",
    mailSubject: "Interesse em Landing Page",
  },
  {
    slug: "sites-institucionais",
    index: "02",
    variant: "institutional",
    title: "Sites Institucionais",
    description:
      "Presença digital completa. Estrutura, autoridade, profundidade.",
    includes: [
      "Arquitetura de informação",
      "Identidade aplicada",
      "5–12 páginas estruturadas",
      "CMS leve",
      "SEO técnico",
      "Performance otimizada",
    ],
    indicatedFor:
      "Empresas que querem presença sólida e profunda — comunicando autoridade, produtos e cultura.",
    mailSubject: "Interesse em Site Institucional",
  },
  {
    slug: "aplicacoes-web",
    index: "03",
    variant: "app",
    title: "Aplicações Web",
    description:
      "Dashboards, sistemas, plataformas. Software com interface refinada.",
    includes: [
      "Arquitetura de informação",
      "Design system próprio",
      "Componentes interativos",
      "Estados e fluxos completos",
      "Integração de APIs",
      "Performance otimizada",
    ],
    indicatedFor:
      "Empresas com processos digitais, equipes que precisam de ferramentas internas, ou produtos SaaS em construção.",
    mailSubject: "Interesse em Aplicação Web",
  },
];
