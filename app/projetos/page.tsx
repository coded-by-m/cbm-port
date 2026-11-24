import type { Metadata } from "next";
import { getPublishedProjects, portfolioGroups } from "@/lib/galleryData";
import { PROJETOS_INTRO, PROJETOS_TITLE } from "@/data/projetos";
import { SURFACE } from "@/components/site/shared";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { IndexClosing } from "@/components/projetos/IndexClosing";
import { IndexOpening } from "@/components/projetos/IndexOpening";
import { ProjetosIndex } from "@/components/projetos/ProjetosIndex";
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
  const { live, conceptual, ordered: projects } = portfolioGroups(getPublishedProjects());
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
    <div className="site-home pi-root min-h-dvh text-[#F5F2ED]" style={{ background: SURFACE.base }}>
      <JsonLd data={schema} />
      <GalleryHeader />
      <main data-cm-section="projects">
        <IndexOpening total={projects.length} />
        <ProjetosIndex live={live} conceptual={conceptual} />
      </main>
      <IndexClosing />
    </div>
  );
}
