"use client";

import { type FragmentSlot } from "./config";

/**
 * Barra de progresso no topo da Paisagem.
 *
 * 6 segmentos finos representando a posição no tour. Ativo = linha branca
 * grossa; visitado = off-white/40; futuro = off-white/15. Click em segmento
 * snap para esse fragmento.
 *
 * Ordenado pelo ângulo orbital (sentido de rotação natural).
 */
export default function LandscapeProgressBar({
  slots,
  activeSlug,
  visitedSlugs,
  onSelect,
}: {
  slots: FragmentSlot[];
  activeSlug: string | null;
  visitedSlugs: Set<string>;
  onSelect: (slug: string) => void;
}) {
  const TWO_PI = Math.PI * 2;
  const angleOf = (s: FragmentSlot) =>
    ((Math.atan2(s.x, s.z) % TWO_PI) + TWO_PI) % TWO_PI;
  const ordered = [...slots].sort((a, b) => angleOf(a) - angleOf(b));

  return (
    <div className="pointer-events-none fixed left-1/2 top-8 z-30 -translate-x-1/2">
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {ordered.map((slot) => {
            const isActive = slot.slug === activeSlug;
            const isVisited = visitedSlugs.has(slot.slug);
            const idx = slot.index + 1;
            return (
              <button
                key={slot.slug}
                type="button"
                onClick={() => onSelect(slot.slug)}
                aria-label={`Projeto ${idx}`}
                aria-current={isActive ? "true" : undefined}
                className="group relative py-3 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F5F2ED]"
              >
                <span
                  className={`block h-[2px] transition-all duration-300 ${
                    isActive
                      ? "w-14 bg-[#F5F2ED]"
                      : isVisited
                        ? "w-10 bg-[#F5F2ED]/45 hover:bg-[#F5F2ED]/85"
                        : "w-10 bg-[#F5F2ED]/15 hover:bg-[#F5F2ED]/55"
                  }`}
                />
                <span className="absolute left-1/2 top-7 -translate-x-1/2 text-[0.5rem] uppercase tracking-[0.3em] text-[#F5F2ED]/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {`0${idx}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
