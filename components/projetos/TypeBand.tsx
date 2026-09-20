import type { ProjectBand } from "@/lib/galleryData";
import { PROJECT_TYPE_LABEL } from "@/lib/projectTypes";
import { Reveal } from "@/components/ui/Reveal";
import { ProjetoCard } from "./ProjetoCard";

/**
 * Faixa de um tipo na vitrine. Numeral-fantasma Panchang atrás do rótulo
 * (anti-monotonia). `hidden` controla a visibilidade pelo filtro de chips —
 * a faixa fica no HTML (bom pra SEO), só some via CSS.
 */
export function TypeBand({
  band,
  index,
  hidden = false,
}: {
  band: ProjectBand;
  index: number;
  hidden?: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <section
      aria-label={PROJECT_TYPE_LABEL[band.type]}
      className={hidden ? "hidden" : "block"}
    >
      {/* Cabeçalho da faixa. */}
      <div className="relative mb-6 flex items-end justify-between border-b border-[#F5F2ED]/12 pb-3">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-1 -top-6 select-none leading-none"
          style={{
            fontFamily: '"Panchang", sans-serif',
            fontWeight: 700,
            fontSize: "3.5rem",
            color: "rgba(245,242,237,0.06)",
          }}
        >
          {num}
        </span>
        <h2
          className="relative text-sm uppercase tracking-[0.3em] text-[#F5F2ED]"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          {PROJECT_TYPE_LABEL[band.type]}
        </h2>
        <span className="text-xs tabular-nums text-[#F5F2ED]/45">
          ({band.projects.length})
        </span>
      </div>

      {/* Lista índice: uma linha por projeto, todas uniformes. */}
      <div className="flex flex-col">
        {/* Reveal e nao `landscape-ui-stagger`: aquele anima na MONTAGEM, entao
            a lista inteira entrava de uma vez, inclusive o que estava fora da
            tela. Numa vitrine longa isso desperdica o gesto. */}
        {band.projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 70} variant="side">
            <ProjetoCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
