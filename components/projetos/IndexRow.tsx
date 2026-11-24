import Link from "next/link";
import type { CSSProperties, FocusEvent, PointerEvent } from "react";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import { TriArrow } from "@/components/ui/TriArrow";

/**
 * Uma linha do índice: a linha inteira é o link do case.
 *
 * O numeral e a meta não levam a cor do tipo (em corpo pequeno ela não passa
 * AA sobre a capa); quem carrega a cor é o marcador quadrado, que é enfeite.
 */
export function IndexRow({
  project,
  index,
  active,
  rowRef,
  handlers,
}: {
  project: CaseProject;
  index: number;
  active: boolean;
  rowRef: (el: HTMLElement | null) => void;
  handlers: {
    onPointerEnter: (e: PointerEvent) => void;
    onFocus: (e: FocusEvent<HTMLElement>) => void;
    onBlur: () => void;
  };
}) {
  const color = PROJECT_TYPE_COLOR[project.type ?? "institucional"];
  const num = String(index + 1).padStart(2, "0");

  return (
    <li
      ref={rowRef}
      className={active ? "pi-row is-active" : "pi-row"}
      style={{ "--pi-color": color } as CSSProperties}
    >
      <Link
        href={`/cases/${project.slug}`}
        className="pi-row-link"
        data-cm-role="secondary-cta"
        data-cm-id={`case-${project.slug}`}
        {...handlers}
      >
        <span className="pi-kicker">
          <span aria-hidden className="pi-mark" />
          <span aria-hidden>{num}</span>
          <span>{project.meta.tipo}</span>
          <span className="pi-kicker-sector">{project.meta.setor}</span>
          <span>{project.meta.ano}</span>
          {project.concept && <span className="pi-tag">conceitual</span>}
        </span>
        <h3 className="pi-name">{project.title}</h3>
        <span aria-hidden className="pi-go">
          <TriArrow />
        </span>
      </Link>
    </li>
  );
}
