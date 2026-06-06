import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases, getCaseBySlug } from "@/data/cases";
import { CaseHero } from "@/components/case/CaseHero";
import { CaseOverview } from "@/components/case/CaseOverview";
import { CaseScreens } from "@/components/case/CaseScreens";
import { CaseResponsive } from "@/components/case/CaseResponsive";
import { CaseReturnCTA } from "@/components/case/CaseReturnCTA";
import { CaseBackButton } from "@/components/case/CaseBackButton";

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
    <main className="case-fade-in" style={{ background: "#000F08", minHeight: "100vh" }}>
      <CaseBackButton />
      <CaseHero project={project} />
      <CaseOverview project={project} />
      <CaseScreens project={project} />
      <CaseResponsive project={project} />
      <CaseReturnCTA siteUrl={project.siteUrl} />
      <style>{`
        @keyframes case-fade-in { from { opacity: 0 } to { opacity: 1 } }
        .case-fade-in { animation: case-fade-in 0.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .case-fade-in { animation: none; } }
      `}</style>
    </main>
  );
}
