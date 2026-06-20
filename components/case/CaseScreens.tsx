import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/case/Reveal";

/**
 * Grade de recortes do site (hero-* + gallery-*) em painéis emoldurados com
 * brackets, composição assimétrica (a cada 3, um painel largo). Reveal stagger.
 * Some se não houver imagens.
 */
export function CaseScreens({ project }: { project: CaseProject }) {
  const shots = [
    ...project.heroImages,
    ...(project.sections ?? []),
    ...project.gallery,
  ].filter(Boolean);
  if (shots.length === 0) return null;

  return (
    <section
      className="border-b px-6 py-16 sm:px-12 sm:py-20 xl:px-16 xl:py-24"
      style={{ background: "#000F08", borderColor: "rgba(245,242,237,0.06)" }}
    >
      <div className="mb-10 flex items-center gap-3">
        <span
          className="block h-px w-5 flex-shrink-0"
          style={{ background: "rgba(251,54,64,0.4)" }}
        />
        <h2 className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
          As Telas{" "}
          <span className="tabular-nums text-cbm-gray-600">
            · {String(shots.length).padStart(2, "0")}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        {shots.map((src, i) => {
          const wide = i % 3 === 0; // a cada 3, painel largo
          return (
            <Reveal
              key={src + i}
              delay={(i % 2) * 90}
              className={wide ? "sm:col-span-2" : ""}
            >
              <div className="group relative overflow-hidden border border-[#F5F2ED]/15 bg-[#070B08] shadow-[0_14px_34px_-14px_rgba(0,0,0,0.7)] transition-colors duration-300 hover:border-[#F5F2ED]/30">
                {/* brackets HUD */}
                <span className="pointer-events-none absolute left-2 top-2 z-10 h-3 w-3 border-l border-t border-[#F5F2ED]/45" />
                <span className="pointer-events-none absolute bottom-2 right-2 z-10 h-3 w-3 border-b border-r border-[#FB3640]/75" />
                {/* índice da tela — reforça a separação entre as telas */}
                <span className="pointer-events-none absolute right-3 top-2.5 z-10 font-display text-[10px] tracking-[0.25em] text-[#F5F2ED]/40 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* biome-ignore lint/a11y/useAltText: decorativo */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
                    wide ? "aspect-[16/7]" : "aspect-[16/10]"
                  }`}
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
