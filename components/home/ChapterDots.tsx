"use client";

import { HOME_CHAPTERS } from "@/lib/homeChapters";

const SIGNAL = "#FB3640";

/**
 * Escotilha de navegação no mobile/tablet (`<lg`) — versão enxuta da
 * ChapterRail: uma coluna de diamantes (linguagem das beat-dots da marca) na
 * borda direita. Toca num diamante → pula pro capítulo (wipe via `onJump`).
 * O ativo acende em signal-red; passados preenchidos; futuros em contorno.
 * Área de toque generosa (28px) mesmo com o diamante pequeno.
 */
export function ChapterDots({
  active,
  onJump,
}: {
  active: number;
  onJump: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Capítulos da página"
      className="fixed right-1.5 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-0.5 lg:hidden"
    >
      {HOME_CHAPTERS.map((ch, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Ir para ${ch.label}`}
            aria-current={isActive ? "true" : undefined}
            data-cursor="triangle"
            className="flex h-7 w-7 items-center justify-center bg-transparent"
          >
            <span
              className="block rotate-45 transition-all duration-300"
              style={{
                width: isActive ? 7 : 5,
                height: isActive ? 7 : 5,
                background: isActive || isPast ? SIGNAL : "transparent",
                border:
                  isActive || isPast
                    ? "none"
                    : "1px solid rgba(245,242,237,0.4)",
                boxShadow: isActive ? `0 0 7px ${SIGNAL}` : "none",
                transform: isActive
                  ? "rotate(45deg) scale(1.15)"
                  : "rotate(45deg)",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
