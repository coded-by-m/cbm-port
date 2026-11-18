/**
 * Copy e estrutura da landing comercial `/criacao-de-sites` (versão de
 * 2026-11-17, refeita a partir do documento de persona).
 *
 * Regras deste arquivo:
 * - Preço, prazo e condições saem das constantes já publicadas em
 *   `data/servicePages.ts`. Nada é digitado à mão aqui.
 * - Só entra o que está confirmado. O que depende do Matheus está listado em
 *   `docs/lp/criacao-de-sites.md` (seção "Pendências") e fica fora da página.
 * - Primeira pessoa do singular: quem fala é o Matheus.
 * - Sem jargão: nada de "handover", "CMS", "deploy", "design system" ou
 *   "dados estruturados". O comprador é dono de empresa, não desenvolvedor.
 */

import { cases } from "@/data/cases";
import { CLIENT_PROOF, type ClientMetric } from "@/data/clientProof";
import {
  LAYOUT_AJUSTES,
  PAINEL_VISITAS,
  PUBLIC_PRICE,
} from "@/data/servicePages";
import type { DriftTile } from "@/components/site/DriftWall";
import type { CaseProject } from "@/types/case";

/* ── Contato ─────────────────────────────────────────────────────────────── */

/** Tipo de projeto escolhido antes do clique. Vai na mensagem e no `data-cm-id`. */
export type ProjectChoice = "institucional" | "landing" | "indefinido";

const WA_OPENING = "Olá, Matheus! Vim pela página de criação de sites da Coded by M";

/** Mensagem dos CTAs sem escolha de tipo (abertura, projetos, investimento). */
export const WA_MESSAGE = `${WA_OPENING} e quero um orçamento.`;

export const CONTACT_CHOICES: { id: ProjectChoice; label: string; hint: string; message: string }[] = [
  {
    id: "institucional",
    label: "Site institucional",
    hint: "A empresa inteira, em várias páginas",
    message: `${WA_OPENING} e quero um orçamento de site institucional.`,
  },
  {
    id: "landing",
    label: "Landing page",
    hint: "Uma página para uma oferta ou campanha",
    message: `${WA_OPENING} e quero um orçamento de landing page.`,
  },
  {
    id: "indefinido",
    label: "Ainda não sei",
    hint: "Eu ajudo a escolher na conversa",
    message: `${WA_OPENING} e quero um orçamento. Ainda não sei se preciso de site institucional ou de landing page.`,
  },
];

/** Rótulo único dos CTAs: um só tipo de ação na página inteira. */
export const CTA_LABEL = "Pedir orçamento";

/* ── Metadados ───────────────────────────────────────────────────────────── */

export const META = {
  // Sem sufixo: o `template` do layout raiz acrescenta "· Coded by M".
  title: "Criação de sites para empresas",
  description:
    "Sites institucionais e landing pages sob medida, desenhados e programados por Matheus Mendes em Florianópolis. Sites de clientes no ar para conferir. Orçamento pelo WhatsApp.",
};

/* ── Navegação da página ─────────────────────────────────────────────────── */

export const NAV = [
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Como funciona" },
  { href: "#investimento", label: "Investimento" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;


/* ── Abertura ────────────────────────────────────────────────────────────── */

export const HERO = {
  /** O que é vendido e onde, antes do título. */
  kicker: "Criação de sites e landing pages sob medida",
  place: "Florianópolis, com atendimento em todo o Brasil",
  /**
   * A direção do briefing, mantida. Ela começa reconhecendo o que o dono já
   * fez (a empresa é boa) e só depois aponta a lacuna (o site). É a hipótese
   * de posicionamento, "um site à altura da empresa", dita na ordem em que a
   * persona sente o problema.
   */
  headline: ["Sua empresa já entrega qualidade.", "Seu site precisa mostrar isso."],
  sub: "Desenho e programo sites institucionais e landing pages para empresas que são boas no que fazem e hoje parecem menores na internet. Você fala direto comigo, do orçamento à entrega.",
  ctaNote: "Abre o WhatsApp com a mensagem pronta. Valor e prazo fechados antes de começar.",
  links: [
    { href: "#projetos", label: "Ver sites de clientes" },
    { href: "#investimento", label: "Ver investimento" },
  ],
  /** Cliente da imagem de abertura: o único com resultado medido. */
  figureSlug: "machado-plataformas",
} as const;

/* ── Projetos de clientes ────────────────────────────────────────────────── */

/**
 * Uma cota sobre a primeira tela do site do cliente. `x` e `y` em % da
 * captura (`preview.top`, 1440x900). O texto descreve algo que está visível
 * na imagem: conferir na captura antes de mudar.
 */
export interface PlateNote {
  x: number;
  y: number;
  text: string;
}

export interface ClientPlate {
  slug: string;
  title: string;
  /** "Fábrica de plataformas de auto socorro". */
  business: string;
  place: string;
  /** "Site institucional" ou "Landing page". */
  format: string;
  year: string;
  /** O que o projeto precisava resolver, em uma frase. */
  summary: string;
  notes: PlateNote[];
  /** Domínio no ar, sem protocolo. */
  siteUrl: string;
  shots: {
    /** Primeira tela no computador, 1440x900. */
    desktop: string;
    /** Primeira tela no celular (scripts/build-lp-shots.py). */
    mobile: string;
    mobileSize: { width: number; height: number };
    /** Página inteira, carregada só quando a pessoa pede. */
    desktopFull: string;
    mobileFull: string;
  };
  metric?: ClientMetric;
}

interface PlateCopy {
  slug: string;
  business: string;
  place: string;
  summary: string;
  mobile: { src: string; width: number; height: number };
  notes: PlateNote[];
}

const PLATE_COPY: PlateCopy[] = [
  {
    slug: "machado-plataformas",
    business: "Fábrica de plataformas de auto socorro",
    place: "Palhoça, SC",
    summary:
      "A empresa fabrica do corte do aço ao acabamento, e o site antigo não mostrava isso. O novo apresenta a fábrica e leva ao pedido de orçamento.",
    mobile: { src: "/cases/machado/mobile-top.webp", width: 560, height: 1182 },
    notes: [
      { x: 92.5, y: 14, text: "O pedido de orçamento aparece no topo e de novo ao lado do título." },
      { x: 45, y: 57, text: "Uma frase diz o que a empresa fabrica e onde." },
      { x: 81, y: 73, text: "O produto aparece inteiro logo na primeira tela." },
    ],
  },
  {
    slug: "mj-engenharia",
    business: "Engenharia de prevenção contra incêndio",
    place: "Grande Florianópolis, SC",
    summary:
      "Um serviço técnico, cheio de norma e sigla, explicado para quem decide a contratação e não é engenheiro.",
    mobile: { src: "/cases/mj-engenharia/mobile-top.webp", width: 404, height: 853 },
    notes: [
      { x: 62, y: 36, text: "A promessa do serviço é o maior elemento da tela." },
      { x: 66, y: 79, text: "Responsável técnico e registro no CREA aparecem sem rolar a página." },
      { x: 27, y: 83, text: "O botão diz com quem a pessoa vai falar: um engenheiro." },
    ],
  },
  {
    slug: "valdete-costuras",
    business: "Ateliê de costura",
    place: "Palhoça, SC",
    summary:
      "Um ateliê com mais de trinta anos de ofício e clientela de indicação ganhou um endereço para quem procura o serviço no celular.",
    mobile: { src: "/cases/valdete-costuras/mobile-top.webp", width: 560, height: 1182 },
    notes: [
      { x: 49, y: 37, text: "O serviço é dito com as palavras de quem procura." },
      { x: 60, y: 17, text: "A fachada do ateliê abre a página: quem chega reconhece o lugar." },
      { x: 28, y: 73, text: "O WhatsApp fica ao lado da promessa de orçamento na hora." },
    ],
  },
];

function caseOf(slug: string): CaseProject {
  const c = cases.find((item) => item.slug === slug);
  if (!c) throw new Error(`Case desconhecido na landing: ${slug}`);
  return c;
}

/** Clientes reais, na ordem em que provam. Conceito nunca entra aqui. */
export const CLIENT_PLATES: ClientPlate[] = PLATE_COPY.map((copy) => {
  const c = caseOf(copy.slug);
  if (c.concept) throw new Error(`${copy.slug} é conceitual e não pode ser apresentado como cliente.`);
  if (!c.siteUrl || !c.preview?.top) throw new Error(`${copy.slug} sem endereço no ar ou sem captura.`);
  return {
    slug: c.slug,
    title: c.title,
    business: copy.business,
    place: copy.place,
    format: c.meta.tipo,
    year: c.meta.ano,
    summary: copy.summary,
    notes: copy.notes,
    siteUrl: c.siteUrl,
    shots: {
      desktop: c.preview.top,
      mobile: copy.mobile.src,
      mobileSize: { width: copy.mobile.width, height: copy.mobile.height },
      desktopFull: c.preview.desktop,
      mobileFull: c.preview.mobile,
    },
    metric: CLIENT_PROOF.find((p) => p.slug === c.slug)?.metric,
  };
});

/**
 * Parede de fundo da abertura: recortes dos sites dos clientes reais (nunca
 * conceito), intercalados por cliente. O i-ésimo tile é do cliente `i % n`;
 * com colunas coprimas com `n` (5 e 4 para 3 clientes), cada coluna passa
 * pelos três. Até 8 recortes por cliente, do mais reconhecível ao mais interno.
 */
const WALL_SHOTS = 8;

export const HERO_WALL: DriftTile[] = (() => {
  const list = CLIENT_PLATES.map((p) => caseOf(p.slug));
  const shots = list.map((c) =>
    Array.from(
      new Set(
        [c.preview?.top, ...c.heroImages, ...(c.sections ?? []), ...c.gallery, c.preview?.card].filter(
          (src): src is string => !!src,
        ),
      ),
    ).slice(0, WALL_SHOTS),
  );
  const depth = Math.max(0, ...shots.map((list) => list.length));
  const tiles: DriftTile[] = [];
  for (let k = 0; k < depth; k++) {
    list.forEach((c, i) => {
      const src = shots[i][k];
      if (src) tiles.push({ src, slug: c.slug, title: c.title, color: "#FB3640" });
    });
  }
  return tiles;
})();

export const PROJECTS = {
  heading: "Sites de clientes, no ar para conferir.",
  sub: "Abra cada um e confira. Os números sobre as telas marcam o que cada site faz por quem está decidindo a compra.",
  cta: {
    text: "Quer um site nesse nível para a sua empresa?",
    note: "Você conta o que a empresa faz e eu respondo com valor e prazo.",
  },
};

export interface ConceptCard {
  slug: string;
  title: string;
  sector: string;
  format: string;
  image: string;
  siteUrl: string;
}

/** Estudos autorais. A página diz isso antes de mostrar qualquer um. */
export const CONCEPTS = {
  heading: "Projetos conceituais",
  text: "Estudos que fiz sem cliente contratante, para mostrar até onde o desenho pode ir. Não são entregas: são sete no portfólio, e estes são três deles.",
  label: "Projeto conceitual",
  cards: ["estudio-lentz", "nord-arch", "stige"].map((slug): ConceptCard => {
    const c = caseOf(slug);
    if (!c.concept) throw new Error(`${slug} não é conceitual.`);
    return {
      slug: c.slug,
      title: c.title,
      sector: c.meta.setor,
      format: c.meta.tipo,
      image: c.preview?.card ?? "",
      siteUrl: c.siteUrl ?? "",
    };
  }),
};

/* ── Situações que o serviço resolve ─────────────────────────────────────── */

export const SITUATIONS = {
  heading: "O que um site fraco custa, e o que muda.",
  before: "Hoje",
  after: "Com o site novo",
  rows: [
    {
      before: "Você manda um PDF pelo WhatsApp porque não quer mandar o link do site.",
      after: "Um endereço para enviar antes da reunião, que apresenta a empresa do tamanho que ela tem.",
    },
    {
      before: "O concorrente é menor ou mais novo, e o site dele passa mais confiança.",
      after: "Layout desenhado para o conteúdo da sua empresa, sem modelo pronto. Ele não fica parecido com o de ninguém.",
    },
    {
      before: "As pessoas entram no site, olham tudo e não chamam.",
      after: "O pedido de orçamento fica à vista em todas as telas, como nos sites acima.",
    },
    {
      before: "Você não sabe quantas pessoas visitam o site nem de onde elas vêm.",
      after: `Acesso a um painel que mostra ${PAINEL_VISITAS}.`,
    },
    {
      before: "Quem fez o site atual sumiu, e os acessos foram junto.",
      after: "O domínio é registrado no nome da sua empresa. Na entrega, código e acessos ficam com você.",
    },
  ],
};

/* ── O que entra em todo projeto ─────────────────────────────────────────── */

export const DELIVERABLES = {
  heading: "O que entra em todo projeto.",
  text: "Site institucional ou landing page, a lista é a mesma. O que muda entre os dois é o tamanho.",
  items: [
    {
      title: "Conteúdo organizado",
      text: "Páginas e textos estruturados junto com você: você conta o que a empresa faz, eu organizo.",
    },
    {
      title: "Layout exclusivo",
      text: "Desenhado para o seu conteúdo, sem modelo pronto, do celular ao computador.",
    },
    {
      title: "Programação própria",
      text: "Sem construtor de sites. Páginas leves, que abrem rápido no celular.",
    },
    {
      title: "Preparação para o Google",
      text: "A parte técnica que o Google lê para entender o site, pronta desde o primeiro dia. Sem promessa de posição.",
    },
    {
      title: "WhatsApp e painel de visitas",
      text: `Botão de contato em todas as telas e acesso ao painel que mostra ${PAINEL_VISITAS}.`,
    },
    {
      title: "Domínio e hospedagem",
      text: "Incluídos no primeiro ano. O domínio é registrado no nome da sua empresa.",
    },
    {
      title: "Entrega de código e acessos",
      text: "Na publicação, o código e os acessos passam para você. Nada fica preso comigo.",
    },
  ],
  extras: [
    "Se o conteúdo muda com frequência, o site sai com uma área simples para você mesmo editar.",
    "Animação e 3D entram só quando ajudam a contar a história da empresa.",
  ],
  excluded: {
    title: "O que fica de fora",
    text: "Loja virtual, logotipo, redes sociais e gestão de anúncios. Se você precisa de algum desses, é melhor saber agora do que no meio da conversa.",
  },
};

/* ── Processo ────────────────────────────────────────────────────────────── */

export const PROCESS = {
  heading: "Quatro etapas, e você sabe o que acontece em cada uma.",
  yourPart: "Sua parte",
  steps: [
    {
      title: "Conversa e proposta",
      text: "Você conta o que a empresa faz e manda sites que admira. Eu respondo com o que entra no projeto, o valor e o prazo.",
      yours: "Aprovar a proposta. O contrato é assinado antes de eu começar.",
    },
    {
      title: "Desenho",
      text: "Organizo o conteúdo e desenho as páginas, para celular e computador.",
      yours: "Ver o desenho e pedir ajustes. Só programo depois que o layout estiver do seu agrado.",
    },
    {
      title: "Programação",
      text: "Programo o site com código próprio, leve e pronto para o Google.",
      yours: "Enviar os textos e as fotos que ainda faltarem.",
    },
    {
      title: "Publicação",
      text: "O site vai ao ar no domínio da sua empresa. Você recebe o código, os acessos e o painel de visitas.",
      yours: "Decidir se quer o plano mensal de suporte. Ele é opcional.",
    },
  ],
  deadline: {
    title: "Prazo",
    rows: [
      { label: "Landing page", value: "a partir de 5 dias úteis" },
      { label: "Site institucional", value: "a partir de 15 dias úteis" },
    ],
    note: "O prazo do seu projeto vai escrito na proposta.",
  },
};

/* ── Quem faz ────────────────────────────────────────────────────────────── */

export const ABOUT_LP = {
  heading: "Você fala com quem desenha e programa.",
  /** Legenda da prancha do fundador (o nome vem de `ABOUT.founder.name`). */
  plate: { role: "Desenho e programação", place: "Florianópolis, SC" },
  paragraphs: [
    "Sou Matheus Mendes, de Florianópolis. Formado em Análise e Desenvolvimento de Sistemas, desenho e programo cada site da Coded by M.",
    "Não tem atendente nem repasse para terceiros: a pessoa que ouve o problema é a que resolve. O atendimento é à distância, por WhatsApp e videochamada, para empresas de todo o Brasil.",
  ],
  /** A objeção do estúdio solo, dita pelo próprio estúdio. */
  honest:
    "O estúdio é novo e enxuto. Uma agência com quinze anos de mercado tem mais estrutura. O que eu ofereço é atenção direta, cada projeto feito do zero e a garantia de que nada fica preso comigo.",
  guardTitle: "Tudo por escrito e no nome da sua empresa.",
  guards: [
    { title: "Contrato", text: "Valor e prazo por escrito, antes de começar." },
    { title: "Domínio", text: "Registrado no nome da sua empresa, não no meu." },
    { title: "Código e acessos", text: "Entregues na publicação. Se um dia você trocar de fornecedor, leva tudo." },
  ],
  verifyTitle: "Confira quem está do outro lado",
};

/* ── Investimento ────────────────────────────────────────────────────────── */

export const INVESTMENT = {
  heading: "Quanto custa, e o que vem depois.",
  rowLabels: { size: "Tamanho", price: "Investimento", deadline: "Prazo" },
  /** Vai antes do valor: o piso nunca aparece sem "a partir de". */
  from: "a partir de",
  formats: [
    {
      name: "Landing page",
      when: "Para uma oferta, um serviço ou uma campanha de anúncio. Uma página com um objetivo só.",
      size: "Uma página",
      price: PUBLIC_PRICE.landing.display,
      deadline: "a partir de 5 dias úteis",
    },
    {
      name: "Site institucional",
      when: "Para apresentar a empresa inteira: serviços, história, projetos e contato.",
      size: "De 5 a 12 páginas",
      price: PUBLIC_PRICE.institucional.display,
      deadline: "a partir de 15 dias úteis",
    },
  ],
  changes: {
    title: "O que muda o valor",
    text: "O número de páginas ou seções, quanto do conteúdo já existe e integrações, como formulários. O valor do seu projeto é fechado na proposta, antes de começar. Dá para parcelar, e todo projeto tem contrato e nota fiscal.",
  },
  after: {
    title: "Depois da entrega",
    rows: [
      { label: "Hospedagem e domínio", value: "Incluídos no primeiro ano." },
      { label: "Plano mensal", value: "Opcional. Cobre suporte e atualizações, e o valor depende do serviço." },
      { label: "Sem o plano", value: "O site continua seu, com código e acessos." },
    ],
  },
  filter:
    "Existe site mais barato, montado em modelo pronto. Não é o que eu faço: aqui o layout é desenhado para a sua empresa.",
  ctaNote: "Você recebe a proposta com valor e prazo antes de qualquer compromisso.",
};

/* ── Dúvidas ─────────────────────────────────────────────────────────────── */

const MACHADO_METRIC = CLIENT_PROOF.find((p) => p.slug === "machado-plataformas")?.metric;

export const FAQ = {
  heading: "Perguntas de quem está comparando.",
  items: [
    {
      q: "Site bonito traz cliente?",
      a: MACHADO_METRIC
        ? `Sozinho, não. O desenho serve para a pessoa entender rápido o que a empresa faz e achar o botão de contato. No site da Machado Plataformas, o painel de visitas registrou ${MACHADO_METRIC.value} ${MACHADO_METRIC.label} ${MACHADO_METRIC.period}, com a maior parte das visitas vindo de anúncio pago. É o resultado de um cliente, não uma garantia para o seu.`
        : "Sozinho, não. O desenho serve para a pessoa entender rápido o que a empresa faz e achar o botão de contato.",
    },
    {
      q: "Tem garantia de primeiro lugar no Google?",
      a: "Não, e ninguém pode garantir. O que entra em todo projeto é a parte técnica: páginas leves e as informações que o Google lê para entender o site, prontas desde o primeiro dia. A posição depende também da concorrência e do conteúdo.",
    },
    { q: "E se eu não gostar do layout?", a: LAYOUT_AJUSTES.a },
    {
      q: "Quem atualiza o site depois de pronto?",
      a: "Existe um plano mensal opcional de suporte e atualizações. Se o conteúdo muda com frequência, o site sai com uma área simples para você mesmo editar. Com ou sem plano, código e acessos ficam com você.",
    },
    {
      q: "Em um construtor de sites eu faço em um fim de semana. Por que esperar?",
      a: "Se a empresa só precisa existir na internet, um construtor resolve e custa menos. O projeto sob medida faz sentido quando o site precisa passar confiança para fechar contrato de valor alto: o layout é desenhado para o seu conteúdo e não fica igual ao de todo mundo.",
    },
  ],
};

/* ── Contato ─────────────────────────────────────────────────────────────── */

export const CONTACT = {
  heading: "Conte o que a sua empresa faz. Eu respondo com valor e prazo.",
  steps: [
    "Escolha o tipo de projeto e toque no botão. O WhatsApp abre com a mensagem pronta.",
    "Conte o que a empresa faz e, se tiver, mande um site que você admira.",
    "Eu respondo no mesmo dia com valor e prazo. O orçamento é gratuito e sem compromisso.",
  ],
  choiceLegend: "Que tipo de projeto você procura?",
  cta: CTA_LABEL,
  numberLabel: "Se preferir, salve o número:",
};
