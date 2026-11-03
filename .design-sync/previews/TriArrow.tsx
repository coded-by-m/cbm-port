import "./_still";
import { TriArrow } from "cbm-port";

// A seta da marca: o triangulo dos botoes no lugar de setas de texto. Herda
// cor e tamanho do texto ao lado (currentColor, em) e avanca na propria
// direcao no hover de um link.

const SATOSHI = '"Satoshi", sans-serif';
const PANCHANG = '"Panchang", sans-serif';

const link = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  color: "#F5F2ED",
  textDecoration: "none",
} as const;

/** As tres direcoes, em corpo de link. */
export function Direcoes() {
  return (
    <div style={{ padding: 32, display: "grid", gap: 18, fontFamily: SATOSHI, fontSize: 16 }}>
      <a href="#" style={link}>
        Ver todos os projetos <TriArrow dir="right" style={{ color: "#FB3640" }} />
      </a>
      <a href="#" style={link}>
        <TriArrow dir="left" style={{ color: "#FB3640" }} /> Todos os projetos
      </a>
      <a href="#" style={link}>
        @codedbymstudio <TriArrow dir="up-right" style={{ color: "#FB3640" }} />
      </a>
    </div>
  );
}

/** Acompanha o corpo do texto: micro-label, corpo e titulo. */
export function Tamanhos() {
  return (
    <div style={{ padding: 32, display: "grid", gap: 20, color: "#F5F2ED" }}>
      <span style={{ fontFamily: SATOSHI, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>
        Case <TriArrow dir="up-right" style={{ color: "#FB3640" }} />
      </span>
      <span style={{ fontFamily: SATOSHI, fontSize: 16 }}>
        Site institucional sob medida <TriArrow dir="right" style={{ color: "#FB3640" }} />
      </span>
      <span style={{ fontFamily: PANCHANG, fontWeight: 700, fontSize: 28 }}>
        Próximo: Estúdio Lentz <TriArrow dir="right" style={{ color: "#FB3640" }} />
      </span>
    </div>
  );
}
