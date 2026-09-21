// Dados de exemplo compartilhados pelos previews.
//
// Nao e um componente: nenhum componente se chama _fixtures, entao o conversor
// nunca usa este arquivo como entrada de preview — ele so e importado pelos
// outros previews.
//
// Por que existem imagens sinteticas aqui: os componentes de case apontam para
// /cases/<slug>/*.webp, que sao servidos pelo Next e nao existem no bundle do
// design system. Um src quebrado renderiza icone de imagem faltando no card. As
// data-URIs abaixo sao fixtures — conteudo de exemplo, na paleta da marca, para
// que o card mostre o componente de verdade em vez de um buraco.

const INK = "#F5F2ED";
const BASE = "#000F08";
const SIGNAL = "#FB3640";

/** Screenshot sintetico: uma pagina abstrata na gramatica da marca. */
function shot(w: number, h: number, accent = SIGNAL): string {
  const bar = Math.round(h * 0.06);
  const rows = Array.from({ length: 5 }, (_, i) => {
    const y = bar + Math.round(h * 0.14) + i * Math.round(h * 0.09);
    const rw = Math.round(w * (i % 2 ? 0.52 : 0.68));
    return `<rect x="${Math.round(w * 0.08)}" y="${y}" width="${rw}" height="${Math.max(
      3,
      Math.round(h * 0.022),
    )}" fill="${INK}" opacity="${0.16 + i * 0.03}"/>`;
  }).join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="#070B08"/>` +
    `<rect width="${w}" height="${bar}" fill="${BASE}"/>` +
    `<circle cx="${Math.round(w * 0.06)}" cy="${Math.round(bar / 2)}" r="${Math.max(
      2,
      Math.round(bar * 0.16),
    )}" fill="${accent}"/>` +
    `<rect x="${Math.round(w * 0.08)}" y="${bar + Math.round(h * 0.05)}" width="${Math.round(
      w * 0.44,
    )}" height="${Math.round(h * 0.045)}" fill="${INK}" opacity="0.82"/>` +
    rows +
    `<rect x="${Math.round(w * 0.08)}" y="${Math.round(h * 0.78)}" width="${Math.round(
      w * 0.24,
    )}" height="${Math.round(h * 0.05)}" fill="${accent}"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SHOT_DESKTOP = shot(1280, 800);
export const SHOT_MOBILE = shot(390, 844);
export const SHOT_CARD = shot(760, 874);

/**
 * Case real do estudio (MJ Engenharia), com os campos de imagem trocados pelas
 * fixtures. O texto e o do repo — e assim que uma pagina de case realmente le.
 */
export const CASE = {
  slug: "mj-engenharia",
  eyebrow: "Landing Page Premium / Case Study",
  title: "MJ Engenharia",
  description:
    "Landing page de alta conversão para uma engenharia de prevenção contra incêndio em Santa Catarina — do dimensionamento ao carimbo de aprovação do CBMSC.",
  meta: {
    cliente: "MJ Engenharia",
    setor: "Engenharia / Prevenção contra Incêndio",
    tipo: "Landing Page",
    ano: "2026",
  },
  type: "landing" as const,
  status: "published" as const,
  siteUrl: "mj-engenharia-flame.vercel.app",
  stack: ["Next.js (App Router)", "React", "Tailwind CSS", "Vercel"],
  heroImages: [SHOT_DESKTOP, SHOT_DESKTOP, SHOT_DESKTOP],
  sections: [SHOT_DESKTOP, SHOT_DESKTOP, SHOT_DESKTOP, SHOT_DESKTOP],
  gallery: [],
  overview: {
    heading: "Do dimensionamento ao carimbo de aprovação",
    body: [
      "A MJ Engenharia projeta sistemas preventivos contra incêndio (PPCI) para empreendimentos que precisam aprovar de verdade — não no papel. O desafio era transformar um serviço técnico e regulatório denso numa página que comunica autoridade e conduz o cliente certo até o contato.",
      "A landing foi construída como uma narrativa de confiança: um hero com a promessa direta de projetos que passam na primeira análise, o escopo técnico por inteiro e o método ponta a ponta — do diagnóstico ao carimbo do CBMSC.",
    ],
    challenge:
      "Transformar um serviço de engenharia técnico e regulatório numa landing que comunica autoridade e conduz o cliente certo ao contato, sem que o jargão afaste quem decide.",
  },
  mockups: {
    desktop3d: SHOT_DESKTOP,
    mobile3d: SHOT_MOBILE,
    browser: SHOT_DESKTOP,
    phone: SHOT_MOBILE,
  },
  palette: ["#fbfcfd", "#2b3a40", "#0b2a36", "#073b4c"],
  preview: { desktop: SHOT_DESKTOP, mobile: SHOT_MOBILE, card: SHOT_CARD },
};

/** Um segundo case, para grades e vitrines não repetirem o mesmo cartão. */
export const CASE_B = {
  ...CASE,
  slug: "estudio-lentz",
  title: "Estúdio Lentz",
  eyebrow: "Site Institucional / Case Study",
  type: "institucional" as const,
  description:
    "Site institucional para um escritório de arquitetura — a obra apresentada com o mesmo cuidado com que foi projetada.",
  meta: {
    cliente: "Estúdio Lentz",
    setor: "Arquitetura e Interiores",
    tipo: "Site Institucional",
    ano: "2026",
  },
  siteUrl: "estudiolentz.com.br",
};

/** Um terceiro, ainda sem publicação — o estado "coming-soon" é real. */
export const CASE_SOON = {
  ...CASE,
  slug: "rota-clinica",
  title: "Rota Clínica",
  eyebrow: "Aplicação Web / Em produção",
  type: "webapp" as const,
  status: "coming-soon" as const,
  description:
    "Aplicação de agendamento e prontuário para uma rede de clínicas — em produção, case em preparação.",
  meta: {
    cliente: "Rota Clínica",
    setor: "Saúde",
    tipo: "Aplicação Web",
    ano: "2026",
  },
  preview: undefined,
};

/** Landing page real do repo (segmento arquitetura), encurtada. */
export const LANDING = {
  slug: "arquitetura",
  eyebrow: "Para escritórios de arquitetura, interiores e engenharia",
  headline: "Sua obra merece um site tão bem resolvido quanto ela.",
  sub: "Sites e landing pages para escritórios que projetam espaço — feitos do zero, sem template, com a apresentação que o seu trabalho já teria se fosse impresso.",
  ctaLabel: "Falar sobre o meu escritório",
  pains: [
    "Seu portfólio vive no Instagram, e cada projeto some do feed em dois dias.",
    "O site que existe foi montado num template — e nivela seu escritório com quem não projeta metade.",
    "Quem pesquisa seu nome encontra foto comprimida e nenhum projeto por inteiro.",
    "A obra vai pro escritório ao lado, que não projeta melhor. Só se apresenta melhor.",
  ],
  promise:
    "Um site que apresenta sua obra com o mesmo cuidado que você teve ao projetá-la.",
  caseSlugs: ["estudio-lentz", "forma-viva"],
  faq: [
    {
      q: "Meu Instagram já não basta?",
      a: "O Instagram é ótimo pra ser lembrado e péssimo pra ser encontrado. Ele não aparece no Google, não organiza sua obra por projeto e não sobrevive ao feed. Um site é o único lugar onde o trabalho fica no seu endereço, na sua ordem, pra sempre.",
    },
    {
      q: "E os meus textos e as minhas fotos?",
      a: "As fotos são suas e eu trabalho com elas — inclusive tratando peso e recorte, que é o que costuma estragar site de arquitetura. O texto a gente escreve junto: você conta o projeto e eu estruturo a narrativa.",
    },
    {
      q: "Quanto tempo leva?",
      a: "Quatro etapas — estratégia, design, código e entrega — com data combinada em cada uma. Você sabe onde o projeto está em qualquer dia.",
    },
  ],
  waMessage: "Oi Matheus, vim pela página de arquitetura",
  meta: {
    title: "Sites para escritórios de arquitetura — Coded by M",
    description:
      "Sites e landing pages para escritórios que projetam espaço, feitos do zero.",
    ogImage: SHOT_DESKTOP,
  },
};
