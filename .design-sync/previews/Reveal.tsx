import "./_still";
import { Reveal } from "cbm-port";

// Gesto de entrada por IntersectionObserver: dispara quando o elemento entra
// na viewport, depois transita 700-900ms conforme a variante. `delay={0}`
// tira qualquer atraso extra — o card já é pequeno, o observer dispara no
// primeiro frame, e o tempo de carga das fontes cobre a transição.

const box: React.CSSProperties = {
  padding: "14px 18px",
  border: "1px solid rgba(245,242,237,0.14)",
  fontFamily: '"Satoshi", sans-serif',
  color: "#F5F2ED",
  fontSize: 14,
};

/** Uso canônico: `up`, o padrão para texto corrido. */
export function Padrao() {
  return (
    <div style={{ padding: 32 }}>
      <Reveal delay={0}>
        <p style={box}>Sites e landing pages para escritórios que projetam espaço.</p>
      </Reveal>
    </div>
  );
}

/** As cinco variantes lado a lado — o eixo que mais muda a aparência. */
export function Variantes() {
  return (
    <div style={{ padding: 32, display: "flex", flexWrap: "wrap", gap: 14 }}>
      <Reveal delay={0} variant="up">
        <div style={box}>up</div>
      </Reveal>
      <Reveal delay={0} variant="scale">
        <div style={box}>scale</div>
      </Reveal>
      <Reveal delay={0} variant="wipe">
        <div style={box}>wipe</div>
      </Reveal>
      <Reveal delay={0} variant="side">
        <div style={box}>side</div>
      </Reveal>
      <Reveal delay={0} variant="draw">
        <div style={box}>draw</div>
      </Reveal>
    </div>
  );
}
