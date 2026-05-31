import Link from "next/link";
import type { CaseProject } from "@/types/case";
import { CaseHeroCollage } from "@/components/case/CaseHeroCollage";
import { ProjectFacts } from "@/components/case/ProjectFacts";

export function CaseHero({ project }: { project: CaseProject }) {
  return (
    <section
      className="grid min-h-screen"
      style={{
        gridTemplateColumns: "1fr 1.1fr",
        background: "#000F08",
        borderBottom: "1px solid rgba(245,242,237,0.06)",
      }}
    >
      {/* ── Text side */}
      <div
        className="flex flex-col justify-between px-12 py-16 xl:px-16 xl:py-20"
        style={{ borderRight: "1px solid rgba(245,242,237,0.06)" }}
      >
        <div>
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/75">
              {project.eyebrow}
            </p>
          </div>

          {/* Title */}
          <h1
            className="font-display font-black uppercase text-cbm-white"
            style={{
              fontSize: "clamp(36px,4.5vw,60px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
            }}
          >
            {project.title}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-[360px] font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400">
            {project.description}
          </p>

          {/* Project Facts */}
          <ProjectFacts meta={project.meta} />
        </div>

        {/* CTA — Text Link CTA pattern (Button System V1 approved) */}
        <div className="mt-10">
          <Link
            href="#overview"
            className="group inline-flex cursor-pointer flex-col items-start gap-[3px]"
          >
            <span className="inline-flex items-center gap-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-white/90 transition-colors duration-200 group-hover:text-cbm-white">
              Ver o Case
              <span
                className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100"
                aria-hidden="true"
              >
                →
              </span>
            </span>
            <span className="block h-px w-full origin-left scale-x-0 bg-cbm-red transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
          </Link>
        </div>
      </div>

      {/* ── Visual side */}
      <CaseHeroCollage images={project.heroImages} />
    </section>
  );
}
