"use client";

import type { ProjectType } from "@/types/case";
import { PROJECT_TYPE_COLOR, PROJECT_TYPE_LABEL } from "@/lib/projectTypes";

export type ChipValue = ProjectType | "all";

/**
 * Chips de filtro da vitrine. `types` = tipos com projeto publicado (vem do
 * page). Scroll horizontal com snap no mobile; alvos ≥44px.
 */
export function FilterChips({
  types,
  active,
  onSelect,
}: {
  types: ProjectType[];
  active: ChipValue;
  onSelect: (v: ChipValue) => void;
}) {
  const chips: { value: ChipValue; label: string; color: string }[] = [
    { value: "all", label: "Todos", color: "#FB3640" },
    ...types.map((t) => ({
      value: t as ChipValue,
      label: PROJECT_TYPE_LABEL[t],
      color: PROJECT_TYPE_COLOR[t],
    })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Filtrar projetos por tipo"
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x"
    >
      {chips.map((chip) => {
        const isActive = chip.value === active;
        return (
          <button
            key={chip.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(chip.value)}
            className={`flex min-h-[44px] flex-shrink-0 snap-start items-center gap-2 whitespace-nowrap border px-4 text-[0.7rem] uppercase tracking-[0.22em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2ED]/60 ${
              isActive
                ? "border-[#F5F2ED]/60 text-[#F5F2ED]"
                : "border-[#F5F2ED]/15 text-[#F5F2ED]/55 hover:border-[#F5F2ED]/35 hover:text-[#F5F2ED]/85"
            }`}
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: isActive ? chip.color : "transparent",
                border: isActive ? "none" : `1px solid ${chip.color}80`,
              }}
            />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
