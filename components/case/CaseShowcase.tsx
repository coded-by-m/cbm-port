import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/case/Reveal";

/**
 * Showcase dos mockups 3D — o "momento herói" da página de case.
 * desktop-3d grande e centrado, com mobile-3d sobreposto no canto, sobre um
 * gradiente radial sutil derivado da paleta da marca capturada.
 * Some se o projeto não tiver `mockups.desktop3d`.
 */
export function CaseShowcase({ project }: { project: CaseProject }) {
  const { mockups, palette, title } = project;
  if (!mockups?.desktop3d) return null;

  // Gradiente puxando a paleta da marca (com fallback pro verde da Home).
  const tint = palette?.[3] ?? palette?.[2] ?? "#073b4c";
  const tint2 = palette?.[2] ?? palette?.[1] ?? "#0b2a36";

  return (
    <section
      className="relative overflow-hidden border-b px-6 py-20 sm:px-12 sm:py-24 xl:px-16 xl:py-28"
      style={{ background: "#000F08", borderColor: "rgba(245,242,237,0.06)" }}
    >
      {/* Gradiente radial sutil derivado da marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 30%, ${tint}26 0%, ${tint2}14 38%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <Reveal>
          <div className="mb-12 flex items-center gap-3">
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <h2 className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
              Mockups
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-[920px]">
            {/* Desktop 3D — peça central */}
            {/* biome-ignore lint/a11y/useAltText: alt repassado */}
            <img
              src={mockups.desktop3d}
              alt={`${title} — mockup 3D desktop`}
              loading="lazy"
              decoding="async"
              className="w-full select-none drop-shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]"
            />

            {/* Mobile 3D — sobreposto no canto inferior */}
            {mockups.mobile3d && (
              // biome-ignore lint/a11y/useAltText: alt repassado
              <img
                src={mockups.mobile3d}
                alt={`${title} — mockup 3D mobile`}
                loading="lazy"
                decoding="async"
                className="absolute -bottom-6 right-0 w-[26%] max-w-[200px] select-none drop-shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] sm:-bottom-8 sm:right-2"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
