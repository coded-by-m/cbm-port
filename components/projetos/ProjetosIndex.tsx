"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseProject } from "@/types/case";
import { IndexDock } from "./IndexDock";
import { IndexRow } from "./IndexRow";
import { IndexStage } from "./IndexStage";
import type { StageBridge } from "./IndexStageGL";
import { useActiveRow } from "./useActiveRow";

/**
 * Índice vivo da `/projetos`: a lista dos projetos em tipografia grande, a
 * capa do projeto ativo em cena atrás e o dock com o resumo dele.
 *
 * Dono de um estado só — qual projeto está ativo — que distribui pra linha
 * (estilo), pra cena (capa) e pro dock (texto). Velocidade de scroll e de
 * ponteiro vão pro shader por ref, sem re-render.
 *
 * As linhas são links reais no HTML do servidor: sem JS a página é a lista
 * completa, com a primeira capa atrás.
 */
export function ProjetosIndex({
  live,
  conceptual,
}: {
  live: CaseProject[];
  conceptual: CaseProject[];
}) {
  const projects = [...live, ...conceptual];
  const bridge = useRef<StageBridge>({ vel: 0, kick: () => {} });
  // Sem JS nenhuma linha é rebaixada: o destaque só liga depois de hidratar.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const onVelocity = useCallback((v: number) => {
    bridge.current.vel = v;
    bridge.current.kick();
  }, []);

  const { active, inIndex, setRowRef, rowHandlers, clearPointed } = useActiveRow(
    projects.length,
    { onVelocity },
  );

  if (projects.length === 0) {
    return <p className="pi-empty">Projetos em breve</p>;
  }

  const chapters = [
    { id: "clientes-no-ar", heading: "Clientes no ar", items: live, offset: 0 },
    {
      id: "projetos-conceituais",
      heading: "Projetos conceituais",
      items: conceptual,
      offset: live.length,
    },
  ].filter((c) => c.items.length > 0);

  return (
    <div className="pi-index" data-live={hydrated ? "true" : undefined}>
      <IndexStage projects={projects} active={active} bridge={bridge} />

      <div className="pi-chapters" onPointerLeave={clearPointed}>
        {chapters.map((chapter) => (
          <section key={chapter.id} aria-labelledby={chapter.id} className="pi-chapter">
            <header className="pi-chapter-head">
              <h2 id={chapter.id}>{chapter.heading}</h2>
              <span aria-hidden>({String(chapter.items.length).padStart(2, "0")})</span>
            </header>
            <ol className="pi-list">
              {chapter.items.map((p, i) => {
                const index = chapter.offset + i;
                return (
                  <IndexRow
                    key={p.slug}
                    project={p}
                    index={index}
                    active={index === active}
                    rowRef={setRowRef(index)}
                    handlers={rowHandlers(index)}
                  />
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <IndexDock
        project={projects[active]}
        index={active}
        total={projects.length}
        visible={hydrated && inIndex}
      />
    </div>
  );
}
