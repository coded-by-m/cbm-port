import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/case/Reveal";

/**
 * Grade de recortes do site (hero-* + gallery-*) em painéis emoldurados com
 * brackets, composição assimétrica (a cada 3, um painel largo). Reveal stagger.
 * Some se não houver imagens.
 */
export function CaseScreens({ project }: { project: CaseProject }) {
  const shots = [...project.heroImages, ...project.gallery].filter(Boolean);
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
        <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
          As Telas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shots.map((src, i) => {
          const wide = i % 3 === 0; // a cada 3, painel largo
          return (
            <Reveal
              key={src + i}
              delay={(i % 2) * 90}
              className={wide ? "sm:col-span-2" : ""}
            >
              <div className="group relative overflow-hidden border border-[#F5F2ED]/12 bg-[#070B08]">
                {/* brackets HUD */}
                <span className="pointer-events-none absolute left-1.5 top-1.5 z-10 h-2.5 w-2.5 border-l border-t border-[#F5F2ED]/40" />
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 h-2.5 w-2.5 border-b border-r border-[#FB3640]/70" />
                {/* biome-ignore lint/a11y/useAltText: decorativo */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
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
