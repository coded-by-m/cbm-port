import { Fragment, type CSSProperties } from "react";
import { PROJETOS_H1, PROJETOS_INTRO } from "@/data/projetos";

/**
 * Abertura da `/projetos`: o H1 sobe palavra por palavra de dentro de uma
 * máscara, com a cena já viva atrás.
 *
 * A animação é só CSS (`.pi-word`), então roda sem JS e some sob "reduzir
 * movimento". O `aria-label` devolve o título inteiro pro leitor de tela, que
 * senão leria palavra por palavra.
 */
export function IndexOpening({
  total,
  title = PROJETOS_H1,
}: {
  total: number;
  /** Só o /lab troca o título, pra testar headline de abertura. */
  title?: string;
}) {
  const words = title.split(" ");

  return (
    <div className="pi-opening">
      <p className="pi-count">
        <span aria-hidden className="pi-mark" />
        {String(total).padStart(2, "0")} projetos
      </p>
      <h1 className="pi-h1" aria-label={title}>
        {words.map((word, i) => (
          // O espaço fica FORA da máscara: dentro de um inline-block ele some.
          <Fragment key={i}>
            <span aria-hidden className="pi-word" style={{ "--i": i } as CSSProperties}>
              <span>{word}</span>
            </span>{" "}
          </Fragment>
        ))}
      </h1>
      <p className="pi-intro" style={{ "--i": words.length } as CSSProperties}>
        {PROJETOS_INTRO}
      </p>
    </div>
  );
}
