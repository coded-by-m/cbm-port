import "./_still";
import { LogoMarkSvg } from "cbm-port";

// Default (size=16) é o tamanho de uso real ao lado do nome no header — mas
// sozinho na célula ele lê como um ponto. A variação que vale mostrar é a
// escala, e o modo `size` relativo (string) usado em quadros que encolhem.

export function Escala() {
  return (
    <div style={{ padding: 32, display: "flex", alignItems: "flex-end", gap: 28 }}>
      <LogoMarkSvg size={24} />
      <LogoMarkSvg size={56} />
      <LogoMarkSvg size={96} />
    </div>
  );
}

/** Traço mais fino ou mais grosso — `stroke` controla a espessura do desenho. */
export function Espessura() {
  return (
    <div style={{ padding: 32, display: "flex", alignItems: "flex-end", gap: 28 }}>
      <LogoMarkSvg size={72} stroke={6} />
      <LogoMarkSvg size={72} stroke={12} />
      <LogoMarkSvg size={72} stroke={20} />
    </div>
  );
}

/** `size` em string: a largura acompanha o quadro pai, não um número fixo. */
export function TamanhoRelativo() {
  return (
    <div style={{ padding: 32, width: 160 }}>
      <LogoMarkSvg size="100%" stroke={10} />
    </div>
  );
}
