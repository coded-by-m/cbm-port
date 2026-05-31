import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases, getCaseBySlug } from "@/data/cases";
import { CaseHero } from "@/components/case/CaseHero";
import { CaseOverview } from "@/components/case/CaseOverview";
import { CaseGallery } from "@/components/case/CaseGallery";
import { CaseReturnCTA } from "@/components/case/CaseReturnCTA";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getCaseBySlug(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Coded by M`,
    description: project.description,
  };
}

export default function CasePage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getCaseBySlug(params.slug);
  if (!project) notFound();

  return (
    <main style={{ background: "#000F08", minHeight: "100vh" }}>
      <CaseHero project={project} />
      <CaseOverview project={project} />
      <CaseGallery project={project} />
      <CaseReturnCTA />
    </main>
  );
}
