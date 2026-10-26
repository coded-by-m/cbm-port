"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import type { CaseProject, ProjectType } from "@/types/case";
import { portfolioGroups } from "@/lib/galleryData";
import { PROJETOS_H1, PROJETOS_INTRO } from "@/data/projetos";
import { Reveal } from "@/components/ui/Reveal";
import { PANCHANG, SATOSHI } from "@/components/site/shared";
import { FilterChips, type ChipValue } from "./FilterChips";
import { ProjetoGridCard } from "./ProjetoGridCard";

const H2: CSSProperties = {
  margin: 0,
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: "clamp(25px,3.2vw,40px)",
  letterSpacing: "-0.014em",
  lineHeight: 1.1,
  color: "#F5F2ED",
  textWrap: "balance",
};

const INTRO: CSSProperties = {
  margin: 0,
  maxWidth: "52ch",
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: "clamp(14px,1.4vw,16px)",
  lineHeight: 1.7,
  color: "#B4B0AA",
  textWrap: "pretty",
};

const GRID: CSSProperties = {
  display: "grid",
  // 420px, não menos: a célula é horizontal (numeral + miniatura de
  // até 178px + texto). Com 330px cabiam 3 colunas e o texto ficava
  // com ~20px, vazando do card.
  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
  gap: "clamp(14px,1.6vw,20px)",
};

function matches(project: CaseProject, active: ChipValue) {
  const t = (project.type ?? "institucional") as ProjectType;
  return active === "all" || active === t;
}

/**
 * Grade de projetos em dois capítulos: clientes no ar e estudos conceituais.
 *
 * O filtro esconde por CSS e não desmonta: as células continuam no HTML
 * inicial, então a página serve o catálogo inteiro para busca e funciona sem
 * JavaScript no estado "Todos".
 */
export function ProjetosGallery({ projects }: { projects: CaseProject[] }) {
  const [active, setActive] = useState<ChipValue>("all");
  const { live, conceptual } = portfolioGroups(projects);

  const types = projects
    .map((p) => (p.type ?? "institucional") as ProjectType)
    .filter((t, i, arr) => arr.indexOf(t) === i);

  const liveOffset = 0;
  const conceptOffset = live.length;

  return (
    <main
      data-cm-section="projects"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "clamp(40px,7vh,72px) clamp(20px,4vw,48px) clamp(64px,9vh,96px)",
      }}
    >
      <Reveal variant="side">
        <h1
          style={{
            margin: 0,
            maxWidth: "11em",
            fontFamily: PANCHANG,
            fontWeight: 800,
            fontSize: "clamp(34px,6vw,72px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            color: "#F5F2ED",
            textWrap: "balance",
          }}
        >
          {PROJETOS_H1}
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p style={{ ...INTRO, marginTop: 18 }}>{PROJETOS_INTRO}</p>
        <p style={{ ...INTRO, marginTop: 12 }}>
          Para o mesmo caminho:{" "}
          <Link href="/landing-page" className="projetos-text-link">
            landing page
          </Link>
          ,{" "}
          <Link href="/site-institucional" className="projetos-text-link">
            site institucional
          </Link>{" "}
          ou{" "}
          <Link href="/sites-para-arquitetura" className="projetos-text-link">
            site para arquitetura
          </Link>
          .
        </p>
      </Reveal>

      <Reveal delay={220}>
        <div style={{ margin: "clamp(28px,4vh,44px) 0 clamp(36px,5vh,52px)" }}>
          <FilterChips types={types} active={active} onSelect={setActive} />
        </div>
      </Reveal>

      {projects.length === 0 ? (
        <p
          style={{
            marginTop: 40,
            border: "1px solid rgba(245,242,237,0.12)",
            padding: "40px 20px",
            textAlign: "center",
            fontFamily: SATOSHI,
            fontSize: 13,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(245,242,237,0.5)",
          }}
        >
          Projetos em breve
        </p>
      ) : (
        <>
          <ProjectBand
            id="clientes-no-ar"
            heading="Clientes no ar"
            projects={live}
            active={active}
            startIndex={liveOffset}
            hidden={!live.some((p) => matches(p, active))}
          />
          <ProjectBand
            id="projetos-conceituais"
            heading="Projetos conceituais"
            projects={conceptual}
            active={active}
            startIndex={conceptOffset}
            hidden={!conceptual.some((p) => matches(p, active))}
            ruled
          />
        </>
      )}
    </main>
  );
}

function ProjectBand({
  id,
  heading,
  projects,
  active,
  startIndex,
  hidden,
  ruled = false,
}: {
  id: string;
  heading: string;
  projects: CaseProject[];
  active: ChipValue;
  startIndex: number;
  hidden: boolean;
  /** Filete de seção — o mesmo da home — só a partir do segundo capítulo. */
  ruled?: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby={id}
      className={hidden ? "is-hidden" : undefined}
      style={
        ruled
          ? {
              marginTop: "clamp(48px,7vh,80px)",
              paddingTop: "clamp(28px,4vh,40px)",
              borderTop: "1px solid #111511",
            }
          : undefined
      }
    >
      <h2 id={id} style={{ ...H2, marginBottom: "clamp(22px,3vh,32px)" }}>
        {heading}
      </h2>
      <div style={GRID}>
        {projects.map((p, i) => {
          const index = startIndex + i;
          return (
            <Reveal
              key={p.slug}
              delay={(i % 4) * 90}
              variant="scale"
              className={matches(p, active) ? "site-cell" : "site-cell is-hidden"}
            >
              <ProjetoGridCard project={p} index={index} priority={index < 4} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
