import "./_still";
import { TriangleMark } from "cbm-port";

// O triângulo se desenha com `stroke-dashoffset` (1.1s) e depois gira devagar
// via CSS — não um estado React. `drawDelay=0` tira qualquer atraso extra:
// pelo tempo que as fontes da marca levam pra carregar, o traço já fechou
// quando a captura acontece.
//
// O SVG é 100% do pai (`width: 100%`, sem largura própria) — cada célula
// precisa de um wrapper com largura explícita, senão o triângulo esmaga pra
// zero.

export function Escala() {
  return (
    <div style={{ padding: 28, display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ width: 32 }}>
        <TriangleMark drawDelay={0} />
      </div>
      <div style={{ width: 56 }}>
        <TriangleMark drawDelay={0} />
      </div>
      <div style={{ width: 96 }}>
        <TriangleMark drawDelay={0} />
      </div>
    </div>
  );
}

/** Traço mais grosso e cor fora do vermelho de sinal — o sinal ao lado do nome. */
export function EspessuraECor() {
  return (
    <div style={{ padding: 28, display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ width: 64 }}>
        <TriangleMark drawDelay={0} strokeWidth={3} />
      </div>
      <div style={{ width: 64 }}>
        <TriangleMark drawDelay={0} strokeWidth={9} color="#F5F2ED" />
      </div>
    </div>
  );
}
