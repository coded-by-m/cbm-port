import "./_still";
import { LogoMark } from "cbm-port";

// Sozinho, no tamanho default (26), a marca sai minúscula demais para uma
// célula de card — por isso toda variação aqui passa `size` explícito.

export function Escala() {
  return (
    <div style={{ padding: 32, display: "flex", alignItems: "flex-end", gap: 28 }}>
      <LogoMark size={28} />
      <LogoMark size={56} />
      <LogoMark size={96} />
    </div>
  );
}

/** Uso canônico: a marca isolada, no tamanho que ela ganha num rodapé ou splash. */
export function Assinatura() {
  return (
    <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
      <LogoMark size={140} />
    </div>
  );
}
