import type { CaseProject } from "@/types/case";

export const cases: CaseProject[] = [
  {
    slug: "mj-engenharia",
    eyebrow: "Landing Page Premium / Case Study",
    title: "MJ Engenharia",
    description:
      "Landing page de alta conversão para uma engenharia de prevenção contra incêndio em Santa Catarina — do dimensionamento ao carimbo de aprovação do CBMSC, numa narrativa técnica que gera contato qualificado.",
    meta: {
      cliente: "MJ Engenharia",
      setor: "Engenharia / Prevenção contra Incêndio",
      tipo: "Landing Page",
      ano: "2026",
    },
    type: "landing",
    stack: [
      "Next.js (App Router)",
      "React",
      "Tailwind CSS",
      "Montserrat + Barlow Condensed + Inter",
      "Vercel",
    ],
    heroImages: [
      "/cases/mj-engenharia/hero-1.webp",
      "/cases/mj-engenharia/hero-2.webp",
      "/cases/mj-engenharia/hero-3.webp",
    ],
    sections: [
      "/cases/mj-engenharia/section-01.webp",
      "/cases/mj-engenharia/section-02.webp",
      "/cases/mj-engenharia/section-03.webp",
      "/cases/mj-engenharia/section-04.webp",
    ],
    overview: {
      heading: "Do dimensionamento ao carimbo de aprovação",
      body: [
        "A MJ Engenharia projeta sistemas preventivos contra incêndio (PPCI) para empreendimentos que precisam aprovar de verdade — não no papel. O desafio era transformar um serviço técnico e regulatório denso numa página que comunica autoridade e conduz o cliente certo até o contato.",
        "A landing foi construída como uma narrativa de confiança: um hero com a promessa direta de projetos que passam na primeira análise, o escopo técnico por inteiro, o método ponta a ponta — do diagnóstico ao carimbo do CBMSC — e os segmentos atendidos (edifício comercial, galpão industrial, condomínio residencial, centro logístico), fechando na prova de especialização e num convite para falar com um engenheiro.",
        "A paleta petróleo sobre off-white transmite a seriedade de quem responde por aprovação; Montserrat e Barlow Condensed dão o tom técnico de engenharia, e o ritmo conduz do problema regulatório à solução sem que o jargão afaste quem decide.",
      ],
      challenge:
        "Transformar um serviço de engenharia técnico e regulatório — projeto preventivo e aprovação no CBMSC — numa landing que comunica autoridade e conduz o cliente certo ao contato, sem que o jargão afaste quem decide.",
    },
    gallery: [],
    mockups: {
      desktop3d: "/cases/mj-engenharia/mockup-desktop-3d.webp",
      mobile3d: "/cases/mj-engenharia/mockup-mobile-3d.webp",
      browser: "/cases/mj-engenharia/mockup-browser.webp",
      phone: "/cases/mj-engenharia/mockup-phone.webp",
    },
    palette: ["#fbfcfd", "#2b3a40", "#0b2a36", "#073b4c"],
    status: "published",
    siteUrl: "mj-engenharia-flame.vercel.app",
    preview: {
      desktop: "/cases/mj-engenharia/desktop-tall.webp",
      mobile: "/cases/mj-engenharia/mobile-tall.webp",
    },
  },
  {
    slug: "machado-plataformas",
    eyebrow: "Web Design Premium / Case Study",
    title: "Machado Plataformas",
    description:
      "Site institucional premium para uma empresa técnica de implementos rodoviários, com foco em percepção de valor, clareza comercial e presença digital mais profissional.",
    meta: {
      cliente: "Machado Plataformas",
      setor: "Implementos Rodoviários",
      tipo: "Site Institucional",
      ano: "2025",
    },
    heroImages: [
      "/cases/machado/hero-1.webp",
      "/cases/machado/hero-2.webp",
      "/cases/machado/hero-3.webp",
      "/cases/machado/hero-4.webp",
      "/cases/machado/hero-5.webp",
    ],
    overview: {
      heading: "O que foi construído e por quê",
      body: [
        "A Machado Plataformas é uma empresa técnica de alto valor real, mas com uma presença digital que não refletia sua capacidade. O site anterior comunicava commodity, não expertise.",
        "O projeto partiu de um diagnóstico claro: o problema não era o produto, era a percepção. A solução foi construir uma presença digital que transmitisse a seriedade e a precisão que a empresa já tinha internamente.",
        "Cada decisão de design — da hierarquia tipográfica ao sistema de cores — foi orientada por um único critério: o visitante precisa sentir confiança antes de ler a primeira linha.",
      ],
      challenge:
        "Empresa técnica de alto valor percebido como commodity. Presença digital genérica não refletia a capacidade real do negócio.",
    },
    gallery: [
      "/cases/machado/gallery-1.webp",
      "/cases/machado/gallery-2.webp",
      "/cases/machado/gallery-3.webp",
      "/cases/machado/gallery-4.webp",
      "/cases/machado/gallery-5.webp",
    ],
    status: "published",
    type: "institucional",
    siteUrl: "machadoplataformas.com.br",
    preview: {
      desktop: "/cases/machado/desktop-tall.webp",
      mobile: "/cases/machado/mobile-tall.webp",
    },
  },
  {
    slug: "maison-etoile",
    eyebrow: "Landing Page Premium / Case Study",
    title: "Maison Étoile Interiors",
    description:
      "Landing page de alta conversão para um estúdio boutique de interiores de luxo em São Paulo — manifesto, portfólio e proposta numa única página cinematográfica.",
    meta: {
      cliente: "Maison Étoile Interiors",
      setor: "Design de Interiores",
      tipo: "Landing Page",
      ano: "2025",
    },
    type: "landing",
    stack: [
      "Next.js (App Router)",
      "React",
      "Tailwind CSS",
      "Marcellus + Hanken Grotesk",
      "Google Tag Manager",
      "Vercel",
    ],
    heroImages: [
      "/cases/maison-etoile/hero-1.jpeg",
      "/cases/maison-etoile/hero-2.jpeg",
    ],
    overview: {
      heading: "Uma página, uma decisão",
      body: [
        "A Maison Étoile Interiors é um estúdio boutique de interiores de alto padrão em São Paulo. O desafio era condensar reputação, método e portfólio numa única página que conduzisse o visitante certo até a solicitação de proposta.",
        "A landing foi construída como uma narrativa vertical: um hero cinematográfico que ancora o posicionamento, um manifesto que estabelece a voz, cinco diferenciais que justificam o preço e um portfólio em carrossel que prova a entrega — fechando num método claro e num convite direto.",
        "Tipografia serifada (Marcellus) sobre Hanken Grotesk dá o tom de luxo sereno; o ritmo de respiro entre seções sustenta a percepção de exclusividade do começo ao fim.",
      ],
      challenge:
        "Transformar um estúdio boutique de interiores em uma presença digital de página única que comunica exclusividade e conduz à solicitação de proposta sem dispersar o visitante.",
    },
    gallery: ["/cases/maison-etoile/gallery-1.jpeg", "/cases/maison-etoile/gallery-2.jpeg"],
    status: "published",
    siteUrl: "lp-interiores.vercel.app",
    preview: {
      desktop: "/cases/maison-etoile/desktop-tall.jpeg",
      mobile: "/cases/maison-etoile/mobile-tall.jpeg",
    },
  },
  {
    slug: "forma-viva",
    eyebrow: "Site Institucional / Case Study",
    title: "Atelier Forma Viva",
    description:
      "Site institucional multi-página para um atelier de arquitetura residencial em Santa Catarina — projetos, atelier e processo com navegação editorial e foco em luz e matéria.",
    meta: {
      cliente: "Atelier Forma Viva",
      setor: "Arquitetura",
      tipo: "Site Institucional",
      ano: "2026",
    },
    type: "institucional",
    stack: [
      "Next.js (App Router)",
      "React",
      "Tailwind CSS",
      "Raleway + Inter",
      "Vercel",
    ],
    heroImages: [
      "/cases/forma-viva/hero-1.jpeg",
      "/cases/forma-viva/hero-2.jpeg",
    ],
    overview: {
      heading: "Arquitetura como sistema navegável",
      body: [
        "O Atelier Forma Viva projeta residências e interiores em Santa Catarina a partir da relação entre luz, proporção e matéria. O site precisava organizar esse portfólio autoral num sistema multi-página sem perder a atmosfera de atelier.",
        "A arquitetura de informação separa projetos, atelier e processo em rotas próprias, com páginas de projeto individuais para cada obra. A navegação é editorial e contida — a imagem conduz, o texto sustenta.",
        "Raleway e Inter dão uma base tipográfica limpa e arejada; o ritmo de espaços negativos deixa cada projeto respirar, reforçando a ideia de espaços que respiram forma, luz e matéria.",
      ],
      challenge:
        "Estruturar o portfólio de um atelier de arquitetura em um site institucional navegável, com páginas de projeto individuais, sem perder a atmosfera autoral.",
    },
    gallery: ["/cases/forma-viva/gallery-1.jpeg"],
    status: "published",
    siteUrl: "forma-viva.vercel.app",
    preview: {
      desktop: "/cases/forma-viva/desktop-tall.jpeg",
      mobile: "/cases/forma-viva/mobile-tall.jpeg",
    },
  },
  {
    slug: "estudio-monteiro",
    eyebrow: "Site Institucional / Case Study",
    title: "Estúdio Monteiro",
    description:
      "Site institucional para um escritório de arquitetura autoral em São Paulo — design editorial escuro, tipografia serifada e obras selecionadas com páginas de projeto dedicadas.",
    meta: {
      cliente: "Estúdio Monteiro",
      setor: "Arquitetura",
      tipo: "Site Institucional",
      ano: "2025",
    },
    type: "institucional",
    stack: [
      "Next.js (App Router + Turbopack)",
      "React",
      "Tailwind CSS",
      "Fraunces + Hanken Grotesk",
      "Vercel",
    ],
    heroImages: [
      "/cases/estudio-monteiro/hero-1.jpeg",
      "/cases/estudio-monteiro/hero-2.jpeg",
    ],
    overview: {
      heading: "Permanência como linguagem",
      body: [
        "O Estúdio Monteiro projeta residências de alto padrão e ambientes corporativos em São Paulo, com mais de 40 obras desde 2009. O site institucional precisava transmitir permanência e autoria — não tendência.",
        "O sistema editorial é escuro, com tipografia serifada (Fraunces) e um acento terracota que assina os marcos. Obras selecionadas levam a páginas de projeto dedicadas; números de atuação ancoram a credibilidade logo no hero.",
        "O resultado é uma presença sóbria e adulta, em que o desenho é a linguagem e a obra é o argumento — coerente com o posicionamento do escritório.",
      ],
      challenge:
        "Dar a um escritório com 40+ obras uma presença digital que transmita permanência e autoria, organizando obras residenciais e corporativas num só sistema editorial.",
    },
    gallery: ["/cases/estudio-monteiro/gallery-1.jpeg"],
    status: "published",
    siteUrl: "monteiro-nine.vercel.app",
    preview: {
      desktop: "/cases/estudio-monteiro/desktop-tall.jpeg",
      mobile: "/cases/estudio-monteiro/mobile-tall.jpeg",
    },
  },
  {
    slug: "rota-clinica",
    eyebrow: "Em breve",
    title: "Rota Clínica",
    description:
      "Plataforma de agendamento e presença digital para uma rede de clínicas especializadas em fisioterapia.",
    meta: {
      cliente: "Rota Clínica",
      setor: "Saúde",
      tipo: "Plataforma + Site",
      ano: "2026",
    },
    type: "webapp",
    heroImages: [],
    overview: { heading: "", body: [], challenge: "" },
    gallery: [],
    status: "coming-soon",
  },
  {
    slug: "industrial-tba",
    eyebrow: "Em breve",
    title: "Industrial",
    description:
      "Próxima vertente em formação. Sites premium para indústrias técnicas de alto valor.",
    meta: {
      cliente: "—",
      setor: "Indústria",
      tipo: "Site Institucional",
      ano: "2026",
    },
    type: "institucional",
    heroImages: [],
    overview: { heading: "", body: [], challenge: "" },
    gallery: [],
    status: "coming-soon",
  },
  {
    slug: "ecommerce-tba",
    eyebrow: "Em breve",
    title: "E-commerce",
    description:
      "Vertente em formação. Lojas digitais com curadoria e percepção de marca alta.",
    meta: {
      cliente: "—",
      setor: "Varejo / Marca",
      tipo: "E-commerce",
      ano: "2026",
    },
    type: "ecommerce",
    heroImages: [],
    overview: { heading: "", body: [], challenge: "" },
    gallery: [],
    status: "coming-soon",
  },
  {
    slug: "education-tba",
    eyebrow: "Em breve",
    title: "Educação",
    description:
      "Vertente em formação. Plataformas e sites institucionais para educação especializada.",
    meta: {
      cliente: "—",
      setor: "Educação",
      tipo: "Plataforma + Site",
      ano: "2026",
    },
    type: "webapp",
    heroImages: [],
    overview: { heading: "", body: [], challenge: "" },
    gallery: [],
    status: "coming-soon",
  },
];

export function getCaseBySlug(slug: string): CaseProject | undefined {
  return cases.find((c) => c.slug === slug);
}
