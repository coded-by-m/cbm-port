"use client";

import Link from "next/link";
import { useState } from "react";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";

/**
 * Linha de projeto na vitrine `/projetos` — formato índice/biblioteca.
 *
 * Cada projeto ocupa uma linha uniforme (número + thumbnail à esquerda,
 * setor/título/descrição no meio, ação à direita). Sem destaque de tamanho
 * entre projetos — todos idênticos, pra leitura de catálogo.
 *
 * - Linha inteira → /cases/[slug] (stretched link absoluto cobrindo a área;
 *   conteúdo com pointer-events-none).
 * - "ver no ar ↗" → siteUrl em nova aba; re-habilita pointer-events e sobe no
 *   z-index pra não conflitar com o stretched link (sem aninhar <a>).
 */
export function ProjetoCard({
  project,
  index,
}: {
  project: CaseProject;
  index: number;
}) {
  const typeColor = project.type ? PROJECT_TYPE_COLOR[project.type] : "#FB3640";
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative flex items-center gap-4 border-b border-[#F5F2ED]/10 py-4 transition-colors duration-300 last:border-b-0 hover:bg-[#F5F2ED]/[0.025] focus-within:bg-[#F5F2ED]/[0.025] sm:gap-5 sm:py-5">
      {/* Stretched link: clique da linha → case. */}
      <Link
        href={`/cases/${project.slug}`}
        aria-label={`Ver projeto ${project.title}`}
        className="absolute inset-0 z-[1] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FB3640]"
      />

      {/* Número do índice. */}
      <span
        aria-hidden
        className="pointer-events-none hidden w-7 flex-shrink-0 text-right text-[0.72rem] tabular-nums text-[#F5F2ED]/30 sm:block"
      >
        {num}
      </span>

      {/* Thumbnail (reserva espaço via aspect-ratio → sem CLS). */}
      <div className="pointer-events-none relative aspect-[16/10] w-24 flex-shrink-0 overflow-hidden border border-[#F5F2ED]/12 sm:w-36 md:w-44">
        <CardImage
          src={project.preview?.desktop}
          alt={`${project.title} — preview`}
        />
        {/* Tick da cor do tipo — assinatura discreta no canto. */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2"
          style={{ borderColor: typeColor }}
        />
      </div>

      {/* Conteúdo. */}
      <div className="pointer-events-none flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.3em] text-[#97938b]">
          <span
            aria-hidden
            className="inline-block h-[2px] w-3.5 flex-shrink-0"
            style={{ backgroundColor: typeColor }}
          />
          {project.meta.setor} · {project.meta.ano}
        </p>
        <h3
          className="text-lg leading-tight tracking-tight text-[#F5F2ED] sm:text-xl"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          {project.title}
        </h3>
        <p className="line-clamp-1 max-w-2xl text-[0.8rem] leading-relaxed text-[#F5F2ED]/60 sm:line-clamp-2">
          {project.description}
        </p>

        {project.siteUrl && (
          <a
            href={`https://${project.siteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto relative z-[3] mt-0.5 inline-flex w-fit items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.24em] text-[#F5F2ED]/50 underline-offset-4 transition-colors hover:text-[#F5F2ED] hover:underline focus-visible:text-[#F5F2ED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F2ED]/60"
          >
            ver no ar ↗
          </a>
        )}
      </div>

      {/* Ação (direita) — rótulo no desktop, seta sempre. */}
      <div className="pointer-events-none ml-auto flex flex-shrink-0 items-center gap-3 self-center pl-1 sm:pl-3">
        <span className="hidden text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#F5F2ED] transition-colors group-hover:text-[#FB3640] lg:inline">
          Ver projeto
        </span>
        <svg
          aria-hidden
          width="11"
          height="11"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="text-[#F5F2ED]/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#FB3640] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          <polygon points="3,2 14,8 3,14" />
        </svg>
      </div>
    </article>
  );
}

/** <img> com fallback quando o asset falha (mesma resiliência da Paisagem). */
function CardImage({ src, alt }: { src?: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0d130f]">
        <svg aria-hidden width="32" height="32" viewBox="0 0 16 16" fill="none">
          <polygon
            points="8,2 14,14 2,14"
            stroke="#F5F2ED"
            strokeOpacity="0.18"
            strokeWidth="0.6"
          />
        </svg>
      </div>
    );
  }
  return (
    // biome-ignore lint/a11y/useAltText: alt prop is forwarded
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}
