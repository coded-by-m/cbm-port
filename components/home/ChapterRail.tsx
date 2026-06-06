"use client";

import { HOME_CHAPTERS } from "@/lib/homeChapters";

const SIGNAL = "#FB3640";
const OFF_WHITE = "#F5F2ED";

/**
 * Espinha global da Home — trilha de capítulos fixa na borda direita.
 *
 * Resolve de uma vez: "isto é uma página de scroll", "onde estou" e "quanto
 * falta". Cada capítulo é um triângulo (linguagem da marca); o ativo acende em
 * signal red com o label visível. Clique navega pro capítulo. Desktop only —
 * no mobile o cue inferior carrega a orientação sozinho.
 */
export function ChapterRail({
  active,
  onJump,
}: {
  active: number;
  onJump: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Capítulos da página"
      className="fixed right-5 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {HOME_CHAPTERS.map((chapter, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() => onJump(i)}
            aria-current={isActive ? "true" : undefined}
            aria-label={`Ir para ${chapter.label}`}
            data-cursor="triangle"
            className="group flex items-center gap-3 bg-transparent"
          >
            <span
              className="text-[0.5rem] uppercase tracking-[0.3em] tabular-nums transition-all duration-300 group-hover:opacity-100"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 500,
                color: isActive ? "rgba(245,242,237,0.9)" : "rgba(245,242,237,0.5)",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(0)" : "translateX(4px)",
              }}
            >
              {chapter.label}
            </span>
            <svg
              aria-hidden
              width="9"
              height="9"
              viewBox="0 0 10 10"
              className="transition-all duration-300"
              style={{
                transform: isActive ? "scale(1.5) rotate(0deg)" : "scale(1)",
              }}
            >
              {/* Triângulo apontando pra esquerda (em direção ao conteúdo). */}
              <polygon
                points="9,1 9,9 1,5"
                fill={isActive || isPast ? SIGNAL : "transparent"}
                stroke={isActive || isPast ? SIGNAL : OFF_WHITE}
                strokeWidth="1"
                opacity={isActive ? 1 : isPast ? 0.55 : 0.3}
              />
            </svg>
          </button>
        );
      })}

      <span
        className="mt-1.5 text-[0.5rem] tabular-nums tracking-[0.2em]"
        style={{
          fontFamily: '"Satoshi", sans-serif',
          fontWeight: 500,
          color: "rgba(245,242,237,0.4)",
        }}
      >
        {String(active + 1).padStart(2, "0")} / {String(HOME_CHAPTERS.length).padStart(2, "0")}
      </span>
    </nav>
  );
}
