import "./_still";
import { WhatsAppFab } from "cbm-port";

// Não recebe props. O botão é `position: fixed`, então a história canônica é
// o componente sozinho num wrapper `position: relative` com altura — sem
// isso ele escapa do card e ancora no canto da folha inteira.
//
// O fade de entrada usa `setTimeout(900)` fixo (não é prop) — pelo tempo que
// leva pra carregar as fontes da marca antes da captura, os 900ms já
// passaram e o botão chega visível.

export function Isolado() {
  return (
    <div style={{ position: "relative", minHeight: 220, background: "#000F08" }}>
      <WhatsAppFab />
    </div>
  );
}

/** Em contexto: o fab sobre um pedaço de página, como aparece no site real. */
export function SobreConteudo() {
  return (
    <div style={{ position: "relative", minHeight: 260, background: "#000F08", padding: 24 }}>
      <p
        style={{
          maxWidth: 360,
          fontFamily: '"Satoshi", sans-serif',
          fontSize: 14,
          lineHeight: 1.6,
          color: "#C8C4BE",
        }}
      >
        Presente em todas as páginas, exceto na home, na experiência e nas
        landings de campanha — que já têm o próprio caminho de contato.
      </p>
      <WhatsAppFab />
    </div>
  );
}
