/**
 * Artigo /site-proprio-wix-ou-wordpress.
 *
 * Texto, title e meta fechados em 2026-11-04. O title aprovado já leva
 * "| Coded by M": a página usa title.absolute para o template do layout
 * não acrescentar outro sufixo. O FAQ visível e o FAQPage saem do mesmo
 * array, em texto puro.
 */

import { ESCOLHER_PATH } from "@/data/comoEscolherEmpresa";
import { LP_OU_PATH } from "@/data/landingOuInstitucional";
import { QUANTO_CUSTA_PATH } from "@/data/quantoCusta";
import type { FaqItem } from "@/data/servicePages";
import { SITE_URL } from "@/lib/site";

export const SITE_PROPRIO_PATH = "/site-proprio-wix-ou-wordpress";

/** URL absoluta com www, a mesma origem do canonical. */
export const SITE_PROPRIO_URL = `${SITE_URL}${SITE_PROPRIO_PATH}`;

/** datePublished e dateModified do Article. */
export const SITE_PROPRIO_DATE = "2026-11-04";

export const SITE_PROPRIO_MODIFIED = SITE_PROPRIO_DATE;

export const SITE_PROPRIO_TITLE =
  "Site próprio, Wix ou WordPress: qual escolher? | Coded by M";

export const SITE_PROPRIO_DESCRIPTION =
  "Compare Wix, WordPress e site em código próprio com dados oficiais: velocidade, o que você pode levar se mudar e quando cada opção faz sentido.";

export const SITE_PROPRIO_H1 =
  "Site próprio, Wix ou WordPress: qual é a melhor escolha para o seu negócio";

/** Nome do BreadcrumbList. É o que a trilha mostra. */
export const SITE_PROPRIO_CRUMB = "Site próprio, Wix ou WordPress";

export type CopyPart =
  | { type: "text"; text: string }
  | { type: "internal"; href: string; label: string }
  | { type: "external"; href: string; label: string };

const PRECO_URL = `${SITE_URL}${QUANTO_CUSTA_PATH}`;
const TIPO_URL = `${SITE_URL}${LP_OU_PATH}`;
const ESCOLHER_URL = `${SITE_URL}${ESCOLHER_PATH}`;

const WIX_EXPORT =
  "https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere";
const WIX_BLOG = "https://pt.wix.com/blog/wix-e-bom-para-pequenos-negocios";
const WP_EXPORT = "https://wordpress.org/documentation/article/tools-export-screen/";
const VODAFONE = "https://web.dev/case-studies/vodafone";
const MOBILE_SPEED =
  "https://www.thinkwithgoogle.com/_qs/documents/2340/bc22e_The_Need_for_Mobile_Speed_-_FINAL_1.pdf";
const SEBRAE_WHATSAPP =
  "https://ce.agenciasebrae.com.br/dados/81-dos-pequenos-negocios-cearenses-utilizam-canais-digitais-para-vendas/";

export const SITE_PROPRIO_RAPIDA_HEADING = "Resposta rápida: quando cada opção faz sentido";

export const SITE_PROPRIO_RAPIDA =
  "Wix, WordPress e site em código próprio resolvem problemas diferentes. O Wix é bom para quem quer montar e editar o site sozinho, sem lidar com hospedagem. O WordPress serve para quem quer muitos recursos prontos e liberdade para trocar de hospedagem. O site em código próprio faz sentido quando o site precisa gerar contato ou venda e você quer controle total sobre cada detalhe.";

export const SITE_PROPRIO_RAPIDA_ITEMS: {
  label: string;
  text: string;
}[] = [
  {
    label: "Wix",
    text: "você vai montar e cuidar do site por conta própria e quer tudo num lugar só.",
  },
  {
    label: "WordPress",
    text: "você precisa de blog forte, plugins específicos ou quer escolher onde hospedar.",
  },
  {
    label: "Site em código próprio",
    text: "você quer um site feito para o seu negócio, rápido, focado em conversão e que não dependa de uma plataforma específica.",
  },
];

export const SITE_PROPRIO_OQUE_HEADING = "O que é cada opção";

export const SITE_PROPRIO_OQUE: { label: string; text: string }[] = [
  {
    label: "Wix",
    text: "é uma plataforma de criação de sites com editor visual de arrastar e soltar. Você escolhe um modelo, muda textos e imagens e publica. A hospedagem é do próprio Wix.",
  },
  {
    label: "WordPress",
    text: "é um sistema de gerenciamento de conteúdo. Você instala numa hospedagem (ou usa um serviço que já instala), escolhe um tema e adiciona plugins para cada função.",
  },
  {
    label: "Site em código próprio",
    text: "é um site escrito do zero por um desenvolvedor, sem editor visual nem plugins de terceiros por trás. Cada página é feita para o objetivo do negócio.",
  },
];

export const SITE_PROPRIO_VELOCIDADE_HEADING = "Velocidade: o que os dados reais mostram";

export const SITE_PROPRIO_VELOCIDADE: readonly CopyPart[] = [
  {
    type: "text",
    text: "Velocidade importa. Segundo a Think with Google, a partir de dados de 2016, ",
  },
  {
    type: "external",
    href: MOBILE_SPEED,
    label:
      "53% das visitas são abandonadas quando o site no celular leva mais de 3 segundos para carregar",
  },
  {
    type: "text",
    text: ". E não é só abandono: num teste A/B publicado no web.dev em 2021, ",
  },
  {
    type: "external",
    href: VODAFONE,
    label: "a Vodafone melhorou o LCP em 31% e teve 8% mais vendas",
  },
  { type: "text", text: "." },
];

export const SITE_PROPRIO_VELOCIDADE_MAIS =
  "Para ser justo: plataformas hospedadas como o Wix costumam ir bem em velocidade, porque cuidam do servidor e da entrega dos arquivos. O próprio Wix informa que hospeda os sites numa rede de distribuição de conteúdo (CDN) global. O que mais pesa na prática é o que se coloca em cima: imagens grandes demais, muitos apps ou plugins e scripts de terceiros. Um WordPress bem feito pode ser rápido, e um site em código pode ser lento se for mal construído. Na minha experiência, a velocidade depende mais de quem constrói do que da plataforma.";

export const SITE_PROPRIO_MUDAR_HEADING =
  "Se um dia você quiser mudar: o que dá para levar";

export const SITE_PROPRIO_MUDAR_LEAD =
  "Essa é a pergunta que pouca gente faz antes de começar.";

export const SITE_PROPRIO_MUDAR_ITEMS: {
  label: string;
  parts: readonly CopyPart[];
}[] = [
  {
    label: "Wix",
    parts: [
      {
        type: "text",
        text: "a central de ajuda do Wix explica que o site ",
      },
      {
        type: "external",
        href: WIX_EXPORT,
        label: "precisa ficar hospedado e funcionando nos servidores do Wix",
      },
      {
        type: "text",
        text: " (consultado em novembro de 2026). O conteúdo que você cria pertence a você, e o domínio pode ser registrado em outro provedor. Mas o site em si não vai para outra hospedagem: para sair, é preciso refazer.",
      },
    ],
  },
  {
    label: "WordPress",
    parts: [
      {
        type: "text",
        text: "a documentação oficial (atualizada em 2024) mostra que a ",
      },
      {
        type: "external",
        href: WP_EXPORT,
        label: "ferramenta de exportação gera um arquivo XML",
      },
      {
        type: "text",
        text: " com posts, páginas, comentários, campos personalizados, categorias, tags e usuários, que pode ser importado em outro WordPress.",
      },
    ],
  },
  {
    label: "Site em código próprio",
    parts: [
      {
        type: "text",
        text: "em código próprio, o site não depende de uma plataforma específica. Na Coded by M, o domínio fica no nome do cliente.",
      },
    ],
  },
];

export const SITE_PROPRIO_CONTROLE_HEADING = "Controle e personalização";

export const SITE_PROPRIO_CONTROLE_WIX: readonly CopyPart[] = [
  {
    type: "text",
    text: "O editor do Wix é simples de usar, e isso é uma vantagem real. O próprio blog do Wix (consultado em novembro de 2026) reconhece o limite: ",
  },
  {
    type: "external",
    href: WIX_BLOG,
    label:
      "ajustes de layout muito específicos ou integrações complexas exigem o Velo, a linguagem de programação do Wix, ou um desenvolvedor",
  },
  { type: "text", text: "." },
];

export const SITE_PROPRIO_CONTROLE_WP =
  "No WordPress, a personalização vem de temas e plugins. Dá para fazer muita coisa, mas cada plugin é mais um item para atualizar.";

export const SITE_PROPRIO_CONTROLE_CODIGO =
  "No site em código próprio, não há limite de editor: o que o negócio precisa é construído. A contrapartida é que mudanças de estrutura passam por quem desenvolve.";

export const SITE_PROPRIO_CUSTO_HEADING = "Custo";

export const SITE_PROPRIO_CUSTO: readonly CopyPart[] = [
  {
    type: "text",
    text: "Cada opção tem um jeito diferente de cobrar: mensalidade de plataforma, hospedagem, plugins pagos ou projeto sob medida. Comparei isso em detalhe no artigo ",
  },
  {
    type: "internal",
    href: PRECO_URL,
    label: "quanto custa um site em Florianópolis",
  },
  { type: "text", text: "." },
];

export const SITE_PROPRIO_WHATSAPP_HEADING =
  "Para o pequeno negócio que vende pelo WhatsApp";

export const SITE_PROPRIO_WHATSAPP: readonly CopyPart[] = [
  {
    type: "text",
    text: "Segundo a Pesquisa Pulso dos Pequenos Negócios do Sebrae (9ª edição, coleta em 2024), ",
  },
  {
    type: "external",
    href: SEBRAE_WHATSAPP,
    label:
      "81% dos pequenos negócios que vendem por canais digitais apontam o WhatsApp",
  },
  {
    type: "text",
    text: ". Para esse negócio, a pergunta não é qual plataforma é mais bonita, e sim qual site leva mais gente a clicar no botão do WhatsApp. Qualquer uma das três opções pode ter esse botão. O que muda é o quanto você consegue ajustar a página e medir esses cliques.",
  },
];

export const SITE_PROPRIO_CASO_HEADING =
  "Um caso real: de um site no Wix para um site em código";

export const SITE_PROPRIO_CASO = [
  "Um cliente com site no Wix tinha um site desatualizado, lento e feio. Refiz o site do zero, com foco em transformar visita em contato no WhatsApp. No painel de 6/08 a 3/11/2026, foram 181 cliques no WhatsApp. A maior parte do tráfego vem de anúncio pago. Na busca do Google, com dados até 2/11, foram 120 cliques, 3.006 impressões e posição média 5,6. O site carrega rápido: LCP de 1,59 s e nota 94 no PageSpeed desktop. Fonte: Coded Insights.",
  "Não há medição do site antigo, então não dá para comparar antes e depois. O que dá para dizer é como o site novo está hoje.",
] as const;

export const SITE_PROPRIO_DECIDIR_HEADING = "Como decidir em 4 perguntas";

export const SITE_PROPRIO_DECIDIR: readonly (readonly CopyPart[])[] = [
  [
    { type: "text", text: "Se sim, o Wix é uma escolha certa e prática." },
  ],
  [
    { type: "text", text: "O WordPress costuma ser o caminho." },
  ],
  [
    { type: "text", text: "Veja se é " },
    {
      type: "internal",
      href: TIPO_URL,
      label: "landing page ou site institucional",
    },
    { type: "text", text: " antes de escolher a ferramenta." },
  ],
  [
    {
      type: "text",
      text: "Aí o site em código próprio faz mais sentido.",
    },
  ],
];

export const SITE_PROPRIO_DECIDIR_LABELS = [
  "Você vai montar e editar o site sozinho?",
  "Precisa de blog grande ou de recursos que já existem em plugins?",
  "Que tipo de site você precisa?",
  "O site precisa gerar contato ou venda e você quer controle total e um site que não dependa de uma plataforma específica?",
] as const;

export const SITE_PROPRIO_CONTRATAR: readonly CopyPart[] = [
  { type: "text", text: "Se for contratar alguém, veja " },
  {
    type: "internal",
    href: ESCOLHER_URL,
    label: "como escolher uma empresa de criação de sites em Florianópolis",
  },
  { type: "text", text: "." },
];

export const SITE_PROPRIO_FAQ: FaqItem[] = [
  {
    q: "Vale a pena fazer site no Wix?",
    a: "Vale quando você quer montar e editar o site sozinho, sem cuidar de hospedagem. Se o site precisa de personalização avançada ou de liberdade para mudar de hospedagem, outra opção pode servir melhor.",
  },
  {
    q: "O Wix é bom para aparecer no Google?",
    a: "Segundo o {0} (consultado em novembro de 2026), a plataforma tem ferramentas integradas de SEO com acesso ao Google Search Console. Na minha experiência, aparecer no Google depende mais do conteúdo, da estrutura das páginas e da velocidade do que da plataforma escolhida.",
    links: [{ href: WIX_BLOG, label: "blog oficial do Wix" }],
  },
  {
    q: "Dá para levar o site do Wix para outra hospedagem?",
    a: "Não. Segundo a central de ajuda do Wix, o site precisa ficar nos servidores do Wix. O conteúdo é seu e o domínio pode ficar em outro provedor, mas para sair é preciso refazer o site.",
  },
  {
    q: "O que é melhor, Wix ou WordPress?",
    a: "Depende do uso. O Wix é mais simples e já inclui a hospedagem. O WordPress dá mais liberdade de plugins e de hospedagem, e exporta o conteúdo em um arquivo XML para outro WordPress.",
  },
  {
    q: "Quando vale pagar por um site profissional?",
    a: "Quando o site precisa gerar contato ou venda, ter identidade própria e você não tem tempo para montar e manter sozinho. Os valores estão no artigo sobre quanto custa um site em Florianópolis.",
  },
  {
    q: "O site em código fica no meu nome?",
    a: "Na Coded by M, o domínio é registrado no nome do cliente. Se você quiser sair, o domínio continua seu.",
  },
];
