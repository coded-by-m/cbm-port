/**
 * Dados estruturados (schema.org, JSON-LD) — fonte única.
 *
 * Regra: tudo que entra aqui está VISÍVEL em alguma página do site. Nada de
 * nota, avaliação, preço, endereço de rua ou rede social não confirmada — o
 * schema descreve a página, não a promove. Se um dado não aparece para quem
 * lê, ele não aparece para o robô.
 *
 * As entidades se ligam por `@id` (URL + fragmento), pra que o grafo de cada
 * página aponte para a mesma organização em vez de redeclará-la:
 *
 *   Organization (#organization) ← WebSite (#website) ← WebPage ← CreativeWork
 */

import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ABOUT } from "@/data/about";
import { SERVICES } from "@/data/services";
import { GITHUB_URL, INSTAGRAM_URL, WHATSAPP_DISPLAY } from "@/lib/contact";
import type { CaseProject } from "@/types/case";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

type Json = Record<string, unknown>;

/** Título e descrição da home — também o padrão de quem não declara os seus. */
export const HOME_TITLE = "Coded by M — Criação de sites e landing pages sob medida";
export const HOME_DESCRIPTION =
  "Estúdio de web design em Florianópolis. Landing pages, sites institucionais e aplicações web feitos do zero, com código próprio — da estratégia ao deploy.";

/** Imagem social padrão por rota (geradas por scripts/build-og-images.py). */
export const OG = {
  home: "/og/home.jpg",
  projetos: "/og/projetos.jpg",
  experiencia: "/og/experiencia.jpg",
  case: (slug: string) => `/og/cases/${slug}.jpg`,
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * A organização. `ProfessionalService` é subtipo de LocalBusiness e de
 * Organization — o estúdio presta serviço a partir de Florianópolis, que é
 * o que o site declara no hero e no rodapé. Sem rua: o site não publica uma.
 *
 * `sameAs`: Instagram e GitHub, os dois perfis confirmados (2026-09-30). Não
 * há LinkedIn.
 */
export function organizationSchema(): Json {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}${OG.home}`,
    description:
      "Estúdio de web design e desenvolvimento em Florianópolis. Landing pages, sites institucionais e aplicações web feitos sob medida, da estratégia ao deploy.",
    telephone: WHATSAPP_DISPLAY.replace(/[^\d+]/g, ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Florianópolis",
      addressRegion: "SC",
      addressCountry: "BR",
    },
    founder: { "@id": FOUNDER_ID },
    sameAs: [INSTAGRAM_URL, GITHUB_URL],
    knowsAbout: [
      "Web design",
      "Desenvolvimento front-end",
      "Next.js",
      "React",
      "Design system",
      "WebGL",
      "SEO técnico",
      "Performance web",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.indicatedFor,
          provider: { "@id": ORG_ID },
        },
      })),
    },
  };
}

export function founderSchema(): Json {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: ABOUT.founder.name,
    jobTitle: "Fundador",
    worksFor: { "@id": ORG_ID },
    description: ABOUT.founder.bio,
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

/** Página genérica, presa ao site e à organização. */
export function webPageSchema(opts: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage";
  image?: string;
}): Json {
  const url = `${SITE_URL}${opts.path === "/" ? "" : opts.path}`;
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: "pt-BR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    ...(opts.image
      ? { primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${opts.image}` } }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

/**
 * Um case: o site entregue, como obra criada pela organização.
 *
 * `dateCreated` é só o ano — é o que a página mostra no campo "Ano". O
 * cliente entra como `about`, pelo nome, sem URL inventada: o endereço do
 * site no ar é o `url` da obra, porque é o que a página exibe e linka.
 *
 * Conceito não tem cliente: sai o `about` e entra `creativeWorkStatus`.
 */
export function caseSchema(project: CaseProject): Json {
  const pageUrl = `${SITE_URL}/cases/${project.slug}`;
  return {
    "@type": "CreativeWork",
    "@id": `${pageUrl}#work`,
    name: project.title,
    headline: project.concept
      ? `${project.title} — ${project.meta.tipo} (projeto conceitual)`
      : `${project.title} — ${project.meta.tipo}`,
    description: project.description,
    genre: project.meta.tipo,
    dateCreated: project.meta.ano,
    inLanguage: "pt-BR",
    creator: { "@id": ORG_ID },
    ...(project.concept
      ? { creativeWorkStatus: "Projeto conceitual" }
      : { about: { "@type": "Organization", name: project.meta.cliente } }),
    ...(project.siteUrl ? { url: `https://${project.siteUrl}` } : {}),
    image: `${SITE_URL}${OG.case(project.slug)}`,
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    ...(project.stack?.length ? { keywords: project.stack.join(", ") } : {}),
  };
}

/** Envolve nós num grafo com o contexto. */
export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}
