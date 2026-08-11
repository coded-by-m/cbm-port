import Link from "next/link";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { frameLabel } from "@/lib/portfolio";
import type { CaseProject } from "@/types/case";

/**
 * Um projeto na grade do /portfolio.
 *
 * Server Component — não sabe de onde veio o `project`. Todo o movimento é
 * CSS: no hover o card levanta, a borda acende no vermelho e o screenshot
 * (que é uma captura da página inteira, bem mais alta que a janela) desliza
 * pra cima revelando o resto do site. `motion-reduce:` desliga tudo.
 */
export function ProjectCard({ project }: { project: CaseProject }) {
  return (
    <Link
      href={`/cases/${project.slug}`}
      aria-label={`Ver o projeto ${project.title}`}
      data-cursor="triangle"
      className="group block outline-none transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-cbm-red motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="transition-colors duration-500 [&>div]:border-cbm-white/15 group-hover:[&>div]:border-cbm-red/60">
        <BrowserFrame url={frameLabel(project)}>
          <div className="aspect-[16/11] w-full overflow-hidden bg-cbm-forest">
            {project.preview?.desktop ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.preview.desktop}
                alt={`${project.title} — preview do site`}
                loading="lazy"
                className="w-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:-translate-y-[38%] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                style={{ transformOrigin: "top" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  aria-hidden
                  width="36"
                  height="36"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <polygon
                    points="8,2 14,14 2,14"
                    stroke="#F5F2ED"
                    strokeOpacity="0.18"
                    strokeWidth="0.6"
                  />
                </svg>
              </div>
            )}
          </div>
        </BrowserFrame>
      </div>

      <div className="mt-5">
        <p className="font-body text-[0.58rem] uppercase tracking-[0.3em] text-cbm-white/45">
          {project.meta.setor} · {project.meta.ano}
        </p>
        <h3 className="mt-2.5 font-display text-[1.35rem] font-semibold tracking-[-0.015em] text-cbm-white transition-colors duration-300 group-hover:text-cbm-red">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-xl font-body text-[0.88rem] font-light leading-relaxed text-cbm-white/60">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
