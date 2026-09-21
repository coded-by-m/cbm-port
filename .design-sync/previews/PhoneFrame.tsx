import "./_still";
import { PhoneFrame } from "cbm-port";
import { SHOT_MOBILE } from "./_fixtures";

// Bezel + notch. Como a BrowserFrame, so faz sentido com a captura dentro.

export function ComCaptura() {
  return (
    <div style={{ padding: 28, maxWidth: 300 }}>
      <PhoneFrame>
        <img
          src={SHOT_MOBILE}
          alt="Captura mobile do site"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </PhoneFrame>
    </div>
  );
}

/** Ao lado do desktop, que e como a pagina de case usa os dois. */
export function AoLadoDoDesktop() {
  return (
    <div style={{ padding: 28, display: "flex", gap: 24, alignItems: "flex-end", maxWidth: 820 }}>
      <div style={{ flex: "0 0 220px" }}>
        <PhoneFrame>
          <img src={SHOT_MOBILE} alt="Captura mobile" style={{ display: "block", width: "100%", height: "auto" }} />
        </PhoneFrame>
      </div>
      <p style={{ color: "#8A8780", fontSize: 13, lineHeight: 1.6, margin: 0, maxWidth: 320 }}>
        A moldura de celular entra na seção responsiva das páginas de case, ao
        lado da captura de desktop, para mostrar a mesma página nas duas larguras.
      </p>
    </div>
  );
}
