import "./_still";
import { BrowserFrame } from "cbm-port";
import { SHOT_DESKTOP } from "./_fixtures";

// A moldura e um invólucro: sozinha ela e so o chrome. O que a torna legivel
// num card e o conteudo dentro dela, que e sempre a captura de um site.

const shot = { display: "block", width: "100%", height: "auto" } as const;

export function ComEndereco() {
  return (
    <div style={{ padding: 28, maxWidth: 760 }}>
      <BrowserFrame url="mj-engenharia-flame.vercel.app">
        <img src={SHOT_DESKTOP} alt="Captura do site da MJ Engenharia" style={shot} />
      </BrowserFrame>
    </div>
  );
}

/** Sem `url` a barra fica so com os tres dots — usado quando o dominio nao importa. */
export function SemEndereco() {
  return (
    <div style={{ padding: 28, maxWidth: 760 }}>
      <BrowserFrame>
        <img src={SHOT_DESKTOP} alt="Captura de um site" style={shot} />
      </BrowserFrame>
    </div>
  );
}
