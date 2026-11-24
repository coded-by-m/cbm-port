import type { CaseProject } from "@/types/case";
import { TriArrow } from "@/components/ui/TriArrow";

/**
 * Faixa fixa na base da tela com o projeto em cena: o resumo e o atalho pro
 * site no ar. É fixa pra que a lista nunca mude de altura durante o scroll.
 *
 * Complemento, não caminho único: o mesmo link "no ar" existe na página do
 * case. Fora de cena ela sai do tab e da árvore de acessibilidade.
 */
export function IndexDock({
  project,
  index,
  total,
  visible,
}: {
  project: CaseProject;
  index: number;
  total: number;
  visible: boolean;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <aside
      className={visible ? "pi-dock is-on" : "pi-dock"}
      aria-label="Projeto em destaque"
      aria-hidden={!visible}
    >
      <span className="pi-dock-count" aria-hidden>
        {pad(index + 1)}
        <span> / {pad(total)}</span>
      </span>
      {/* `key` remonta o texto a cada troca: é o que dispara o fade. */}
      <p key={project.slug} className="pi-dock-text">
        {project.description}
      </p>
      {project.siteUrl && (
        <a
          href={`https://${project.siteUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="pi-dock-link"
          aria-label={`Abrir o site ${project.title} no ar, em nova aba`}
          data-cm-role="secondary-cta"
          data-cm-id={`live-${project.slug}`}
        >
          No ar <TriArrow dir="up-right" />
        </a>
      )}
    </aside>
  );
}
