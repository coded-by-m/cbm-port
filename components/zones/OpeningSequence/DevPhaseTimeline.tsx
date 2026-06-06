"use client";

const PHASES = [
  { id: "logo", label: "Logo" },
  { id: "philosophy", label: "Philosophy" },
  { id: "landscape", label: "Landscape" },
] as const;

type PhaseId = (typeof PHASES)[number]["id"];

/**
 * Timeline de desenvolvimento — flutuante no topo da tela.
 *
 * Permite pular direto pra qualquer fase da Opening Sequence sem esperar
 * as animações cinematográficas (~9s no total). Útil pra iteração rápida
 * em partes específicas do flow.
 *
 * Esconde automaticamente em produção. Cursor nativo (não triangular) pra
 * fácil acesso.
 */
export function DevPhaseTimeline({
  active,
  onJump,
}: {
  active: PhaseId | "flipping";
  onJump: (phase: PhaseId) => void;
}) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] flex justify-center pt-3"
      style={{ cursor: "auto" }}
    >
      <div
        className="pointer-events-auto flex items-center gap-1 border border-[#F5F2ED]/15 bg-[#000F08]/85 px-2 py-1.5 backdrop-blur-md"
        style={{ cursor: "auto" }}
      >
        <p className="px-2 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#F5F2ED]/35">
          DEV
        </p>
        {PHASES.map((phase) => {
          const isActive =
            active === phase.id ||
            (phase.id === "landscape" && active === "flipping");
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onJump(phase.id)}
              className={[
                "border px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.25em] transition-colors",
                isActive
                  ? "border-[#F5F2ED]/60 bg-[#F5F2ED]/10 text-[#F5F2ED]"
                  : "border-[#F5F2ED]/15 text-[#F5F2ED]/55 hover:border-[#F5F2ED]/35 hover:text-[#F5F2ED]/85",
              ].join(" ")}
              style={{ cursor: "pointer" }}
            >
              {phase.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
