"use client";

import { useState } from "react";
import type { CaseProject, ProjectType } from "@/types/case";
import { Reveal } from "@/components/ui/Reveal";
import { PANCHANG, SATOSHI } from "@/components/site/shared";
import { FilterChips, type ChipValue } from "./FilterChips";
import { ProjetoGridCard } from "./ProjetoGridCard";

/**
 * Grade de projetos.
 *
 * Uma lista única filtrada por chips, em vez das faixas por tipo de antes: com
 * seis projetos, agrupar criava faixas de um item só e a página lia como uma
 * sequência de listas curtas em vez de um catálogo.
 *
 * O filtro esconde por CSS e não desmonta: as células continuam no HTML
 * inicial, então a página serve o catálogo inteiro para busca e funciona sem
 * JavaScript no estado "Todos".
 */
export function ProjetosGallery({ projects }: { projects: CaseProject[] }) {
  const [active, setActive] = useState<ChipValue>("all");

  // Dedupe sem espalhar Set: o target do tsconfig é anterior a es2015 e
  // iterar Set exigiria downlevelIteration.
  const types = projects
    .map((p) => (p.type ?? "institucional") as ProjectType)
    .filter((t, i, arr) => arr.indexOf(t) === i);
  const total = String(projects.length).padStart(2, "0");

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
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "0.3em",
            fontFamily: PANCHANG,
            fontWeight: 800,
            fontSize: "clamp(34px,6.4vw,82px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.92,
            color: "#F5F2ED",
          }}
        >
          Projetos
          <span style={{ color: "#FB3640" }}>/ {total}</span>
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p
          style={{
            margin: "18px 0 0",
            maxWidth: "52ch",
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: "clamp(14px,1.4vw,16px)",
            lineHeight: 1.7,
            color: "#B4B0AA",
            textWrap: "pretty",
          }}
        >
          Do conceito ao site no ar. Cada projeto abre o case por dentro — e o
          endereço real, pra você conferir.
        </p>
      </Reveal>

      <Reveal delay={220}>
        <div style={{ margin: "clamp(28px,4vh,44px) 0 clamp(22px,3vh,32px)" }}>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,330px),1fr))",
            gap: "clamp(14px,1.6vw,20px)",
          }}
        >
          {projects.map((p, i) => {
            const t = (p.type ?? "institucional") as ProjectType;
            const visible = active === "all" || active === t;
            return (
              <Reveal
                key={p.slug}
                delay={(i % 4) * 90}
                variant="scale"
                // Esconde por classe e não desmonta: o catálogo inteiro segue
                // no HTML inicial, então a busca enxerga tudo e o estado
                // "Todos" funciona sem JavaScript.
                className={visible ? "site-cell" : "site-cell is-hidden"}
              >
                <ProjetoGridCard project={p} index={i} priority={i < 4} />
              </Reveal>
            );
          })}
        </div>
      )}
    </main>
  );
}
