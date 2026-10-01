import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases, getCaseBySlug } from "@/data/cases";
import { CaseHero } from "@/components/case/CaseHero";
import { CaseOverview } from "@/components/case/CaseOverview";
import { CaseShowcase } from "@/components/case/CaseShowcase";
import { CaseScreens } from "@/components/case/CaseScreens";
import { CaseResponsive } from "@/components/case/CaseResponsive";
import { CaseReturnCTA } from "@/components/case/CaseReturnCTA";
import { CaseBackButton } from "@/components/case/CaseBackButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { OG, OG_SIZE, breadcrumbSchema, caseSchema, graph, webPageSchema } from "@/lib/seo";

/**
 * Só case publicado vira página. Os "em breve" existem em `data/cases.ts`
 * para a Paisagem desenhar o fragmento, mas não têm conteúdo — servidos como
 * página, eram URLs 200 vazias, indexáveis. Com `dynamicParams = false`
 * qualquer slug fora desta lista responde 404.
 */
export const dynamicParams = false;

function getPublishedCase(slug: string) {
  const project = getCaseBySlug(slug);
  return project?.status === "published" ? project : undefined;
}

export function generateStaticParams() {
  return cases
    .filter((c) => c.status === "published")
    .map((c) => ({ slug: c.slug }));
}

/** "Case Estúdio Lentz — Site Institucional Imersivo" — nome + o que foi feito. */
function caseTitle(project: NonNullable<ReturnType<typeof getPublishedCase>>) {
  return `Case ${project.title} — ${project.meta.tipo}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getPublishedCase(params.slug);
  if (!project) return {};
  const title = caseTitle(project);
  const url = `/cases/${project.slug}`;
  const image = OG.case(project.slug);
  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${title} · Coded by M`,
      description: project.description,
      url,
      images: [{ url: image, ...OG_SIZE, alt: `${project.title} — case da Coded by M` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Coded by M`,
      description: project.description,
      images: [image],
    },
  };
}

export default function CasePage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getPublishedCase(params.slug);
  if (!project) notFound();

  // Próximo publicado, na ordem da vitrine; o último volta ao primeiro.
  const published = cases.filter((c) => c.status === "published");
  const next = published[(published.indexOf(project) + 1) % published.length];

  const schema = graph(
    webPageSchema({
      path: `/cases/${project.slug}`,
      name: caseTitle(project),
      description: project.description,
      image: OG.case(project.slug),
    }),
    caseSchema(project),
    breadcrumbSchema([
      { name: "Início", path: "/" },
      { name: "Projetos", path: "/projetos" },
      { name: project.title, path: `/cases/${project.slug}` },
    ]),
  );

  return (
    <main
      className="case-fade-in"
      data-cm-section="case-study"
      data-cm-id={project.slug} style={{ background: "#000F08", minHeight: "100vh" }}>
      <JsonLd data={schema} />
      <CaseBackButton />
      <CaseHero project={project} />
      <CaseOverview project={project} />
      <CaseShowcase project={project} />
      <CaseScreens project={project} />
      <CaseResponsive project={project} />
      <CaseReturnCTA
        siteUrl={project.siteUrl}
        next={next && next !== project ? { slug: next.slug, title: next.title } : undefined}
      />
      <style>{`
        @keyframes case-fade-in { from { opacity: 0 } to { opacity: 1 } }
        .case-fade-in { animation: case-fade-in 0.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .case-fade-in { animation: none; } }
      `}</style>
    </main>
  );
}
