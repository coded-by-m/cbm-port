"use client";

import Link from "next/link";
import { useState } from "react";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";

/**
 * Card de projeto na vitrine `/projetos`.
 *
 * - Card inteiro → /cases/[slug] (stretched link: <Link> absoluto cobrindo a
 *   área; conteúdo com pointer-events-none).
 * - "Ver no ar ↗" → siteUrl em nova aba; re-habilita pointer-events e sobe no
 *   z-index pra não conflitar com o stretched link (sem aninhar <a>).
 * - `featured`: primeiro card da faixa, ocupa mais espaço (imagem maior).
 */
export function ProjetoCard({
  project,
  featured = false,
}: {
  project: CaseProject;
  featured?: boolean;
}) {
  const typeColor = project.type ? PROJECT_TYPE_COLOR[project.type] : "#FB3640";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden border border-[#F5F2ED]/15 bg-[#070B08] transition-colors duration-300 hover:border-[#F5F2ED]/40 focus-within:border-[#F5F2ED]/50 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Stretched link: clique do card → case. */}
      <Link
        href={`/cases/${project.slug}`}
        aria-label={`Ver projeto ${project.title}`}
        className="absolute inset-0 z-[1] outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B08]"
      />

      {/* Brackets HUD nos cantos — assinatura da marca. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t border-[#FB3640]" />
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r border-t border-[#F5F2ED]/35" />
        <span className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 border-b border-l border-[#F5F2ED]/35" />
        <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 border-b border-r border-[#F5F2ED]/35" />
      </div>

      {/* Imagem (reserva espaço via aspect-ratio → sem CLS). */}
      <div className="pointer-events-none relative aspect-[16/10] w-full overflow-hidden border-b border-[#F5F2ED]/12">
        <CardImage
          src={project.preview?.desktop}
          alt={`${project.title} — preview`}
        />
      </div>

      {/* Texto. */}
      <div className="pointer-events-none flex flex-1 flex-col gap-2 p-5">
        <p className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.32em] text-[#97938b]">
          <span
            aria-hidden
            className="inline-block h-[2px] w-3.5 flex-shrink-0"
            style={{ backgroundColor: typeColor }}
          />
          {project.meta.setor} · {project.meta.ano}
        </p>
        <h3
          className={`leading-tight tracking-tight text-[#F5F2ED] ${
            featured ? "text-xl" : "text-lg"
          }`}
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          {project.title}
        </h3>
        <p className="line-clamp-2 text-[0.8rem] leading-relaxed text-[#F5F2ED]/65">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#F5F2ED] transition-colors group-hover:text-[#FB3640]">
            Ver projeto
            <svg
              aria-hidden
              width="11"
              height="11"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <polygon points="3,2 14,8 3,14" />
            </svg>
          </span>

          {project.siteUrl && (
            <a
              href={`https://${project.siteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative z-[3] inline-flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.24em] text-[#F5F2ED]/55 underline-offset-4 transition-colors hover:text-[#F5F2ED] hover:underline focus-visible:text-[#F5F2ED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F2ED]/60"
            >
              ver no ar ↗
            </a>
          )}
        </div>
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
        <svg aria-hidden width="40" height="40" viewBox="0 0 16 16" fill="none">
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
