"use client";

import { useState } from "react";
import type { ProjectBand } from "@/lib/galleryData";
import { FilterChips, type ChipValue } from "./FilterChips";
import { TypeBand } from "./TypeBand";

/**
 * Corpo client da vitrine. As faixas chegam prontas do Server Component; aqui
 * só controlamos o filtro (chip ativo) alternando a visibilidade via CSS — as
 * faixas continuam no HTML inicial (SEO + funciona sem JS no estado "Todos").
 */
export function ProjetosGallery({ bands }: { bands: ProjectBand[] }) {
  const [active, setActive] = useState<ChipValue>("all");
  const types = bands.map((b) => b.type);

  return (
    <main className="mx-auto min-h-dvh max-w-6xl px-5 pb-10 pt-12">
      {/* Intro. */}
      <div className="mb-8">
        <h1
          className="text-4xl leading-none tracking-tight text-[#F5F2ED] md:text-5xl"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
        >
          Projetos
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#F5F2ED]/60">
          Seleção de trabalhos por tipo de entrega — do conceito ao site no ar.
        </p>
      </div>

      {/* Filtro. */}
      <div className="mb-12">
        <FilterChips types={types} active={active} onSelect={setActive} />
      </div>

      {/* Faixas. */}
      <div className="flex flex-col gap-16">
        {bands.map((band, i) => (
          <TypeBand
            key={band.type}
            band={band}
            index={i}
            hidden={active !== "all" && active !== band.type}
          />
        ))}
      </div>
    </main>
  );
}
