import "./_still";
import { FillButton } from "cbm-port";

// O CTA de conversao. Vermelho solido em repouso; no hover a malha
// triangulada se pinta de off-white a partir do ponto por onde o cursor
// entrou (e recolhe para o ponto de saida). O texto fica escuro o tempo todo
// — legivel sobre o vermelho, o off-white e qualquer mistura no meio.
//
// Sempre e link (`<a>`): todos os usos levam ao WhatsApp. Num card estatico
// aparece o repouso.

const linha = {
  padding: "32px 28px",
  display: "flex",
  gap: 20,
  flexWrap: "wrap" as const,
  alignItems: "center",
};

const WA = "https://wa.me/5548999916638";

export function Canonico() {
  return (
    <div style={linha}>
      <FillButton href={WA} target="_blank">
        Começar meu projeto
      </FillButton>
    </div>
  );
}

/** Os tres tamanhos das landings: lg (hero e fechamento), md, sm (FAQ). */
export function Tamanhos() {
  return (
    <div style={linha}>
      <FillButton href={WA} size="lg">Falar sobre o meu escritório</FillButton>
      <FillButton href={WA} size="md">Falar sobre o meu projeto</FillButton>
      <FillButton href={WA} size="sm">Falar no WhatsApp</FillButton>
    </div>
  );
}

/** Largura total, como no hero da home. */
export function LarguraTotal() {
  return (
    <div style={{ ...linha, display: "block", maxWidth: 420 }}>
      <FillButton href={WA} full>
        Começar meu projeto
      </FillButton>
    </div>
  );
}

/** Com o triangulo: escuro sobre o vermelho, vermelho depois do preenchimento. */
export function ComSeta() {
  return (
    <div style={linha}>
      <FillButton href={WA} showArrow>
        Começar meu projeto
      </FillButton>
    </div>
  );
}
