import type { Metadata } from "next";
import { getPublishedProjects, portfolioGroups } from "@/lib/galleryData";
import { BOBINA, PROJETOS_INTRO, PROJETOS_TITLE } from "@/data/projetos";
import { Bobina } from "@/components/projetos/bobina/Bobina";
import type { BbOther, BbProject } from "@/components/projetos/bobina/shared";
import "@/components/projetos/bobina/bobina.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { OG, OG_SIZE, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const TITLE = PROJETOS_TITLE;
const DESCRIPTION = PROJETOS_INTRO;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/projetos" },
  openGraph: {
    title: `${TITLE} · Coded by M`,
    description: DESCRIPTION,
    url: "/projetos",
    type: "website",
    images: [{ url: OG.projetos, ...OG_SIZE, alt: "Projetos da Coded by M" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Coded by M`,
    description: DESCRIPTION,
    images: [OG.projetos],
  },
};

export default function ProjetosPage() {
  const { ordered: projects } = portfolioGroups(getPublishedProjects());

  const featured: BbProject[] = BOBINA.flatMap(({ slug, tallH, line }) => {
    const c = projects.find((p) => p.slug === slug);
    if (!c?.preview) return [];
    return [
      {
        slug,
        title: c.title,
        concept: Boolean(c.concept),
        setor: c.meta.setor,
        ano: c.meta.ano,
        line,
        siteUrl: c.siteUrl,
        tall: { src: c.preview.desktop, w: 1440, h: tallH },
        top: { src: c.preview.top ?? c.preview.desktop, w: 1440, h: 900 },
      },
    ];
  });
  const picked = new Set(featured.map((f) => f.slug));
  const others: BbOther[] = projects
    .filter((p) => !picked.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      concept: Boolean(p.concept),
      setor: p.meta.setor,
      thumb: p.preview?.top ?? p.preview?.card ?? "",
    }))
    .filter((o) => o.thumb);

  const schema = graph(
    {
      ...webPageSchema({
        path: "/projetos",
        name: TITLE,
        description: DESCRIPTION,
        type: "CollectionPage",
        image: OG.projetos,
      }),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/cases/${p.slug}`,
          name: p.title,
        })),
      },
    },
    breadcrumbSchema([
      { name: "Início", path: "/" },
      { name: "Projetos", path: "/projetos" },
    ]),
  );
  return (
    <>
      <JsonLd data={schema} />
      <Bobina projects={featured} others={others} />
    </>
  );
}
