import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/case/Reveal";

export function CaseOverview({ project }: { project: CaseProject }) {
  const { heading, body, challenge } = project.overview;

  return (
    <section
      id="overview"
      className="border-b px-6 py-16 sm:px-12 sm:py-20 xl:px-16 xl:py-24"
      style={{
        background: "#000F08",
        borderColor: "rgba(245,242,237,0.06)",
      }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">

        {/* Left — editorial text */}
        <Reveal className="flex-1">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
              Visão Geral
            </p>
          </div>

          <h2
            className="font-display font-bold tracking-[-0.02em] text-cbm-white"
            style={{ fontSize: "clamp(24px,3vw,36px)", lineHeight: 1.1 }}
          >
            {heading}
          </h2>

          <div className="mt-6 flex max-w-[520px] flex-col gap-4">
            {body.map((paragraph, i) => (
              <p
                key={i}
                className="font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Right — challenge block */}
        <Reveal className="w-full lg:w-[280px] lg:flex-shrink-0" delay={120}>
          <div className="border border-cbm-gray-800 p-6">
            <p className="mb-3 font-body text-[8px] uppercase tracking-[0.35em] text-cbm-gray-600">
              Desafio
            </p>
            <p className="font-body text-[13px] font-light leading-[1.75] text-cbm-gray-400">
              {challenge}
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
