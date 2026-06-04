"use client";

import type { FragmentSlot } from "./config";

/**
 * Indicadores discretos da posição no slideshow.
 *
 * Click muda o slug ativo (e, via orquestrador, marca o slideshow como
 * "released" — para de auto-rotar). Ordenados visualmente por `slot.x`
 * para bater com a ordem espacial dos fragmentos.
 */
export default function SlideshowDots({
  slots,
  activeSlug,
  onSelect,
}: {
  slots: FragmentSlot[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  // Ordena por ângulo orbital pra coincidir com a posição visual dos fragmentos.
  const TWO_PI = Math.PI * 2;
  const angleOf = (s: { x: number; z: number }) =>
    ((Math.atan2(s.x, s.z) % TWO_PI) + TWO_PI) % TWO_PI;
  const ordered = [...slots].sort((a, b) => angleOf(a) - angleOf(b));

  return (
    <div className="flex items-center gap-2" aria-label="Projetos">
      {ordered.map((slot) => {
        const isActive = slot.slug === activeSlug;
        return (
          <button
            key={slot.slug}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(slot.slug);
            }}
            className={`h-2 w-2 rounded-full border transition-all duration-300 ${
              isActive
                ? "border-[#F5F2ED] bg-[#F5F2ED] opacity-100"
                : "border-[#F5F2ED]/40 bg-transparent opacity-50 hover:border-[#F5F2ED]/80 hover:opacity-100"
            }`}
            aria-label={`Projeto ${slot.slug}`}
            aria-current={isActive ? "true" : undefined}
          />
        );
      })}
    </div>
  );
}
