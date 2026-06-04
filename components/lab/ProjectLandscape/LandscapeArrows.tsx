"use client";

/**
 * Setas de navegação + toggle de pause/play da Paisagem.
 *
 * Centralizado no bottom — pareia visualmente com a progress bar no topo
 * (top: status / bottom: controles). Triângulos vermelhos no mesmo
 * vocabulário do MeshButton.
 *
 * Toggle do meio mostra estado atual (pause icon = auto-rotate ligado,
 * play icon = pausado). Click alterna.
 */
export default function LandscapeArrows({
  paused,
  onPrev,
  onNext,
  onTogglePause,
}: {
  paused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
}) {
  const baseBtn =
    "group pointer-events-auto border border-[#F5F2ED]/20 bg-[#000F08]/40 p-3 backdrop-blur-sm transition-colors hover:border-[#F5F2ED]/70 hover:bg-[#000F08]/70 focus-visible:border-[#F5F2ED] focus-visible:outline-none";

  return (
    <div className="pointer-events-none fixed bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Projeto anterior"
        className={baseBtn}
      >
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="#FB3640"
          className="block group-hover:animate-[spin_1.4s_linear_infinite]"
          style={{ transform: "rotate(180deg)" }}
        >
          <polygon points="3,2 14,8 3,14" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onTogglePause}
        aria-label={paused ? "Retomar tour automático" : "Pausar tour automático"}
        aria-pressed={paused}
        className={baseBtn}
      >
        {paused ? (
          // Play icon (triangle pointing right) — indica "click pra rodar"
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="#F5F2ED"
            className="block opacity-80 group-hover:opacity-100"
          >
            <polygon points="4,3 13,8 4,13" />
          </svg>
        ) : (
          // Pause icon (duas barras verticais) — indica "click pra pausar"
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="#F5F2ED"
            className="block opacity-80 group-hover:opacity-100"
          >
            <rect x="3.5" y="3" width="3" height="10" />
            <rect x="9.5" y="3" width="3" height="10" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Próximo projeto"
        className={baseBtn}
      >
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="#FB3640"
          className="block group-hover:animate-[spin_1.4s_linear_infinite]"
        >
          <polygon points="3,2 14,8 3,14" />
        </svg>
      </button>
    </div>
  );
}
