import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/galleryData";
import { SURFACE } from "@/components/site/shared";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { GalleryFooter } from "@/components/projetos/GalleryFooter";
import { ProjetosGallery } from "@/components/projetos/ProjetosGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { OG, OG_SIZE, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const TITLE = "Projetos de sites e landing pages";
const DESCRIPTION =
  "Sites institucionais e landing pages da Coded by M — projetos para clientes e conceituais em arquitetura, engenharia, interiores e indústria, cada um com case e endereço no ar.";

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
  const projects = getPublishedProjects();
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
    <div className="site-home min-h-dvh text-[#F5F2ED]" style={{ background: SURFACE.base }}>
      <JsonLd data={schema} />
      <GalleryHeader />
      <ProjetosGallery projects={projects} />
      <GalleryFooter />
    </div>
  );
}
