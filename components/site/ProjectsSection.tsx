import { cases } from "@/data/cases";
import { SECTIONS } from "@/data/home";
import { SECTION, SectionHead } from "./shared";
import { Reveal } from "@/components/ui/Reveal";
import { ProjetoGridCard } from "@/components/projetos/ProjetoGridCard";

/**
 * Os 6 projetos publicados, na mesma célula que a vitrine `/projetos` usa —
 * numeral, thumbnail e texto lado a lado, em duas colunas.
 *
 * O card vem de `components/projetos` de propósito: home e vitrine dividindo
 * uma definição só, senão divergem na primeira mexida.
 */
export function ProjectsSection() {
  const published = cases.filter((c) => c.status === "published");

  return (
    <section
      id="projetos"
      style={{
        ...SECTION,
        // Sem régua nesta: ela cai bem na emenda com o hero, e uma linha
        // nítida no meio do degradê anula a dissolução. As outras seções
        // mantêm a borda, que ali separa blocos de verdade.
        borderTop: "none",
        paddingTop: "clamp(40px,7vh,84px)",
      }}
    >
      <SectionHead
        heading={SECTIONS.projetos.heading}
        sub={SECTIONS.projetos.sub}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
          gap: "clamp(14px,1.6vw,20px)",
        }}
      >
        {published.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 2) * 110} variant="scale" className="site-cell">
            <ProjetoGridCard project={c} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
