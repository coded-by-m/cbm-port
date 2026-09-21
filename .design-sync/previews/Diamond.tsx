import "./_still";
import { Diamond } from "cbm-port";

// O losango de 7px é o marcador recorrente da marca — canto de section head,
// bullet de lista, indicador de item ativo. Sozinho ele é pontual demais;
// a variação que importa é o tamanho, e o estado preenchido x contorno.

export function Escala() {
  return (
    <div style={{ padding: 28, display: "flex", alignItems: "center", gap: 24 }}>
      <Diamond size={7} />
      <Diamond size={16} />
      <Diamond size={28} />
      <Diamond size={44} />
    </div>
  );
}

/** Preenchido (default) x contorno — o mesmo losango, os dois estados reais. */
export function PreenchidoOuContorno() {
  return (
    <div style={{ padding: 28, display: "flex", alignItems: "center", gap: 24 }}>
      <Diamond size={28} filled />
      <Diamond size={28} filled={false} />
    </div>
  );
}

/** Fora do vermelho de sinal — usado quando o marcador acompanha texto claro. */
export function CorPersonalizada() {
  return (
    <div style={{ padding: 28, display: "flex", alignItems: "center", gap: 24 }}>
      <Diamond size={22} color="#F5F2ED" />
      <Diamond size={22} color="#F5F2ED" filled={false} />
      <Diamond size={22} color="#FB3640" />
    </div>
  );
}
