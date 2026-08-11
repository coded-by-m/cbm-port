import { Reveal } from "@/components/ui/Reveal";
import { getPublishedCases } from "@/lib/portfolio";
import { ProjectCard } from "./ProjectCard";

/** Grade dos projetos publicados. Dois por linha no desktop, um no mobile. */
export function ProjectGrid() {
  const projects = getPublishedCases();

  return (
    <section
      id="projetos"
      data-cursor="default"
      aria-labelledby="portfolio-projetos-headline"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28"
    >
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
          <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
            Projetos
          </p>
        </div>
        <h2
          id="portfolio-projetos-headline"
          className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-cbm-white"
        >
          Sites no ar, com nome e endereço.
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 90}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
