/**
 * Páginas de serviço indexáveis — `/landing-page`, `/site-institucional` e
 * `/sites-para-arquitetura`.
 *
 * Diferente das `/lp/*` (noindex, corredor de campanha): estas existem pra
 * aparecer na busca. Têm navegação, links pros cases e FAQ com schema.
 *
 * Fonte única: a FAQ visível e o JSON-LD `FAQPage` saem do mesmo array, então
 * o texto do robô é sempre o texto da página.
 *
 * ATENÇÃO — respostas marcadas com PREENCHER dependem de números que só o
 * Matheus tem (prazo, hospedagem). Elas NÃO aparecem no site nem no schema
 * enquanto tiverem o marcador (ver `isFilled`): melhor uma pergunta a menos
 * que uma resposta inventada. Preço não é publicado (decisão de 2026-09-30).
 */

export interface FaqItem {
  q: string;
  a: string;
  /** Links opcionais ao fim da resposta. Entram no schema como texto. */
  links?: { href: string; label: string }[];
}

/** Resposta pronta pra publicar — sem o marcador de rascunho. */
export function isFilled(f: FaqItem) {
  return !f.a.includes("PREENCHER");
}

/** Texto da resposta como o leitor vê, link incluído — o mesmo vai pro schema. */
export function faqAnswerText(f: FaqItem) {
  return f.links?.length
    ? `${f.a} Veja: ${f.links.map((l) => l.label).join(" e ")}.`
    : f.a;
}

/**
 * Preço público. Desligado por decisão (2026-09-30): sem faixa no site, sem
 * `priceRange` no schema. Ligar exige preencher `price` em cada página.
 */
export const SHOW_PRICES = false;

export interface ServicePageConfig {
  /** Vira a rota: `/<slug>`. */
  slug: "landing-page" | "site-institucional" | "sites-para-arquitetura";
  /** Rótulo curto do cabeçalho e do breadcrumb. */
  label: string;
  /** Nome do serviço no schema `Service`. */
  serviceName: string;
  meta: { title: string; description: string };
  h1: string;
  intro: string;
  /**
   * Resumo de 40-60 palavras logo após o H1: o que é, pra quem, preço/prazo,
   * como pedir. É o trecho que buscadores com IA citam.
   */
  summary: string;
  /** Seções de texto livres, antes do "O que está incluso" (página de nicho). */
  extraSections?: { heading: string; body?: string[]; list?: string[] }[];
  includesHeading: string;
  includes: string[];
  /** Só usado com SHOW_PRICES = true. Ex.: "A partir de R$ …". */
  price?: string;
  /** Slugs de `data/cases.ts`, na ordem em que provam. */
  caseSlugs: string[];
  projectsHeading: string;
  faq: FaqItem[];
  waMessage: string;
  /** `data-cm-id` do CTA — vira o `location` do whatsapp_click. */
  ctaSource: string;
}

const ATENDE_BRASIL: FaqItem = {
  q: "Vocês atendem fora de Santa Catarina?",
  a: "Sim, atendo todo o Brasil de forma remota.",
};

const PRECO_TEXTO =
  "Depende do escopo: quantidade de seções ou páginas, textos e integrações. Você conta o projeto no WhatsApp e eu respondo com valor e prazo antes de qualquer compromisso.";

export const SERVICE_PAGES: ServicePageConfig[] = [
  {
    slug: "landing-page",
    label: "Landing page",
    serviceName: "Criação de landing page sob medida",
    meta: {
      // Sem sufixo: o `template` do layout raiz acrescenta "· Coded by M".
      title: "Landing page profissional em Florianópolis",
      description:
        "Landing pages feitas do zero, rápidas e focadas em conversão. Estúdio em Florianópolis, atendimento em todo o Brasil. Peça seu orçamento pelo WhatsApp.",
    },
    h1: "Landing page sob medida para vender mais",
    intro:
      "Crio landing pages com código próprio, pensadas para transformar visitantes em contatos: design exclusivo, carregamento rápido e otimizadas para Google e anúncios. Atendo empresas e profissionais em todo o Brasil, a partir de Florianópolis.",
    summary:
      "Landing page é uma página única com um objetivo só: pedir orçamento, agendar ou comprar. Faço do zero, sem template, para empresas que anunciam ou precisam transformar visita em contato. Valor e prazo dependem do escopo — você conta o projeto no WhatsApp e recebe a proposta antes de qualquer compromisso.",
    includesHeading: "O que está incluso",
    includes: [
      "Estratégia de conversão e copywriting",
      "Design exclusivo, sem template",
      "Versão mobile pensada desde o início",
      "Integração com WhatsApp e métricas configuradas",
      "SEO técnico e carregamento rápido",
      "Publicação e handover",
    ],
    caseSlugs: ["mj-engenharia", "maison-etoile"],
    projectsHeading: "Landing pages no ar",
    faq: [
      { q: "Quanto custa uma landing page?", a: PRECO_TEXTO },
      { q: "Em quanto tempo fica pronta?", a: "PREENCHER — prazo típico de uma landing page." },
      { q: "Hospedagem e domínio estão inclusos?", a: "PREENCHER — o que entra na entrega e o que fica por conta do cliente." },
      ATENDE_BRASIL,
      {
        q: "Posso editar o conteúdo depois?",
        a: "Sim. A entrega inclui handover, e se o conteúdo muda com frequência a página sai com um CMS leve para você editar sem depender de mim.",
      },
      {
        q: "Landing page ou site institucional: qual escolher?",
        a: "Landing page quando existe uma ação principal — um serviço, uma campanha, um anúncio. Site institucional quando a empresa precisa apresentar serviços, história e projetos em várias páginas.",
        links: [{ href: "/site-institucional", label: "Site institucional" }],
      },
    ],
    waMessage: "Olá! Vim pela página de landing page da Coded by M e quero um orçamento.",
    ctaSource: "lp-page",
  },
  {
    slug: "site-institucional",
    label: "Site institucional",
    serviceName: "Criação de site institucional sob medida",
    meta: {
      // Sem sufixo: o `template` do layout raiz acrescenta "· Coded by M".
      title: "Criação de site institucional em Florianópolis",
      description:
        "Sites institucionais exclusivos, rápidos e prontos para o Google. Criação sob medida em Florianópolis, atendimento em todo o Brasil. Solicite um orçamento.",
    },
    h1: "Site institucional sob medida para sua empresa",
    intro:
      "Um site profissional que apresenta sua empresa com clareza, passa confiança e gera contatos. Desenvolvido do zero, com código próprio, foco em velocidade e SEO desde o primeiro dia.",
    summary:
      "Site institucional é a presença completa da empresa: serviços, história, projetos e contato, em várias páginas. Faço do zero, com código próprio, para empresas que querem ser encontradas no Google e passar confiança. Valor e prazo dependem do escopo — você conta o projeto no WhatsApp e recebe a proposta antes de qualquer compromisso.",
    includesHeading: "O que está incluso",
    includes: [
      "Arquitetura de informação",
      "De 5 a 12 páginas estruturadas",
      "Design system aplicado, sem template",
      "SEO técnico, dados estruturados e performance",
      "Integração com WhatsApp e métricas configuradas",
      "CMS leve e handover",
    ],
    caseSlugs: ["machado-plataformas", "estudio-lentz", "forma-viva", "estudio-monteiro"],
    projectsHeading: "Sites institucionais no ar",
    faq: [
      { q: "Quanto custa um site institucional?", a: PRECO_TEXTO },
      { q: "Qual o prazo de entrega?", a: "PREENCHER — prazo típico de um site institucional." },
      {
        q: "Quantas páginas o site tem?",
        a: "Normalmente entre 5 e 12, definidas na etapa de estratégia a partir do que a empresa precisa apresentar.",
      },
      { q: "Hospedagem e domínio estão inclusos?", a: "PREENCHER — o que entra na entrega e o que fica por conta do cliente." },
      { q: "Como funciona a manutenção depois da entrega?", a: "PREENCHER — suporte, ajustes e evolução após a publicação." },
      ATENDE_BRASIL,
    ],
    waMessage: "Olá! Vim pela página de site institucional da Coded by M e quero um orçamento.",
    ctaSource: "institucional-page",
  },
  {
    slug: "sites-para-arquitetura",
    label: "Arquitetura e interiores",
    serviceName: "Sites para escritórios de arquitetura e design de interiores",
    meta: {
      title: "Site para escritório de arquitetura e interiores",
      description:
        "Sites sob medida para arquitetos e designers de interiores: portfólio elegante, rápido e pronto para o Google. Atendimento em todo o Brasil.",
    },
    h1: "Sites para escritórios de arquitetura e design de interiores",
    intro:
      "Sites e landing pages para escritórios que projetam espaço — feitos do zero, sem template, com a apresentação que o seu trabalho teria se fosse impresso.",
    summary:
      "Um site de arquitetura organiza a obra por projeto, com fotos tratadas e página própria para cada uma, e faz o escritório ser encontrado no Google pelo nome e pela cidade. Faço do zero, para arquitetos e designers de interiores de todo o Brasil. Valor e prazo dependem do escopo — peça a proposta pelo WhatsApp.",
    extraSections: [
      {
        heading: "Por que um portfólio próprio",
        body: [
          "O Instagram é ótimo pra ser lembrado e péssimo pra ser encontrado. Ele não aparece no Google, não organiza sua obra por projeto e não sobrevive ao feed.",
          "Um site é o único lugar onde o trabalho fica no seu endereço, na sua ordem, pra sempre — e onde quem pesquisa o seu nome encontra o projeto inteiro, não uma foto comprimida.",
        ],
      },
      {
        heading: "O que um site de arquitetura precisa ter",
        list: [
          "Uma página por projeto, com a obra contada do conceito ao espaço habitado",
          "Fotos tratadas em peso e recorte — o que mais estraga site de arquitetura",
          "Navegação editorial: a imagem conduz, o texto sustenta",
          "Carregamento rápido mesmo com imagem grande",
          "Contato direto pelo WhatsApp",
          "SEO para ser encontrado pelo nome do escritório e pela cidade",
        ],
      },
    ],
    includesHeading: "O que está incluso",
    includes: [
      "Arquitetura de informação do portfólio",
      "Páginas de projeto individuais",
      "Tratamento de peso e recorte das fotos",
      "SEO técnico, dados estruturados e performance",
      "Integração com WhatsApp e métricas configuradas",
      "CMS leve para publicar obra nova",
    ],
    caseSlugs: ["estudio-lentz", "forma-viva", "estudio-monteiro", "maison-etoile"],
    projectsHeading: "Projetos de arquitetura e interiores",
    faq: [
      { q: "Quanto custa um site para escritório de arquitetura?", a: PRECO_TEXTO },
      { q: "Em quanto tempo fica pronto?", a: "PREENCHER — prazo típico de um site de arquitetura." },
      {
        q: "Meu Instagram já não basta?",
        a: "O Instagram é ótimo pra ser lembrado e péssimo pra ser encontrado. Ele não aparece no Google, não organiza sua obra por projeto e não sobrevive ao feed. Um site é o único lugar onde o trabalho fica no seu endereço, na sua ordem, pra sempre.",
      },
      {
        q: "E os meus textos e as minhas fotos?",
        a: "As fotos são suas e eu trabalho com elas — inclusive tratando peso e recorte. O texto a gente escreve junto: você conta o projeto e eu estruturo a narrativa.",
      },
      {
        q: "Vou conseguir publicar projetos novos depois?",
        a: "Sim. A entrega inclui handover, e o site sai com um CMS leve pra você publicar obra nova sem depender de mim.",
      },
      ATENDE_BRASIL,
    ],
    waMessage:
      "Olá! Vim pela página de sites para arquitetura da Coded by M e quero falar sobre o site do meu escritório.",
    ctaSource: "arquitetura-page",
  },
];

export function getServicePage(slug: ServicePageConfig["slug"]) {
  const page = SERVICE_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Página de serviço desconhecida: ${slug}`);
  return page;
}

/** Setores que a página de nicho de arquitetura cobre. */
const ARCHITECTURE_SECTORS = ["Arquitetura", "Design de Interiores"];

/**
 * Para onde um case aponta no fim: o serviço do mesmo tipo e, se for do
 * ambiente construído, a página de nicho. Derivado do `type`/`setor` que o
 * case já tem — sem campo novo pra manter em dia.
 */
export function serviceLinksForCase(c: { type?: string; meta: { setor: string } }) {
  const service =
    c.type === "landing"
      ? { href: "/landing-page", label: "criação de landing page" }
      : { href: "/site-institucional", label: "criação de site institucional" };
  const niche = ARCHITECTURE_SECTORS.includes(c.meta.setor)
    ? { href: "/sites-para-arquitetura", label: "Veja como crio sites para arquitetura" }
    : undefined;
  return { service, niche };
}
