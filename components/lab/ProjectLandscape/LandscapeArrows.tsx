"use client";

/**
 * Setas de navegação esquerda/direita da Paisagem.
 *
 * Triângulos SVG no mesmo vocabulário do MeshButton (signal red + spin no
 * hover), posicionados nas laterais centro-vertical do viewport. Click chama
 * `onPrev` / `onNext` que disparam o snap pra fragmento adjacente.
 */
export default function LandscapeArrows({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Projeto anterior"
        className="group pointer-events-auto fixed left-6 top-1/2 z-30 -translate-y-1/2 border border-[#F5F2ED]/20 bg-[#000F08]/40 p-4 backdrop-blur-sm transition-colors hover:border-[#F5F2ED]/70 hover:bg-[#000F08]/70"
      >
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="#FB3640"
          className="block transition-transform group-hover:animate-[spin_1.4s_linear_infinite]"
          style={{ transform: "rotate(180deg)" }}
        >
          <polygon points="3,2 14,8 3,14" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Próximo projeto"
        className="group pointer-events-auto fixed right-6 top-1/2 z-30 -translate-y-1/2 border border-[#F5F2ED]/20 bg-[#000F08]/40 p-4 backdrop-blur-sm transition-colors hover:border-[#F5F2ED]/70 hover:bg-[#000F08]/70"
      >
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="#FB3640"
          className="block transition-transform group-hover:animate-[spin_1.4s_linear_infinite]"
        >
          <polygon points="3,2 14,8 3,14" />
        </svg>
      </button>
    </>
  );
}
