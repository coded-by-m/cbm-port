import "./_still";
import { SectionHead } from "cbm-port";

// Cabeçalho padrão de seção: label implícito no heading + h2 + linha de
// apoio opcional. `heading` e `sub` são o eixo — o `sub` muda a composição
// de duas linhas pra três.

export function ComLinhaDeApoio() {
  return (
    <div style={{ padding: "36px 32px", maxWidth: 620 }}>
      <SectionHead
        heading="Projetos que já foram ao ar"
        sub="Do conceito ao site no ar. Cada case mostra o desafio, a decisão e o resultado."
      />
    </div>
  );
}

/** Sem `sub` — o parágrafo de apoio some, só o heading fica. */
export function SoHeading() {
  return (
    <div style={{ padding: "36px 32px", maxWidth: 620 }}>
      <SectionHead heading="Como o processo funciona" />
    </div>
  );
}
