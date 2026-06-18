"use client";

/**
 * Atalho persistente "Ver projetos" — pill discreto no canto inferior-esquerdo
 * pra o visitante impaciente pular direto pra vitrine de qualquer seção. Cobre
 * desktop e mobile (a ChapterRail é só desktop). Escondido quando já se está em
 * Projetos. Aparece com fade via a prop `visible`.
 */
export function ProjectsShortcut({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="triangle"
      aria-label="Ir direto para os projetos"
      className="fixed bottom-6 left-6 z-[60] inline-flex items-center gap-2 border border-[#F5F2ED]/20 bg-[#000F08]/80 px-3.5 py-2 text-[0.55rem] uppercase tracking-[0.28em] text-[#F5F2ED]/75 backdrop-blur-md transition-all duration-500 hover:border-[#F5F2ED]/55 hover:text-[#F5F2ED]"
      style={{
        fontFamily: '"Satoshi", sans-serif',
        fontWeight: 500,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      Ver projetos
      <svg aria-hidden width="9" height="9" viewBox="0 0 10 10">
        <polygon points="2,1 9,5 2,9" fill="#FB3640" />
      </svg>
    </button>
  );
}
