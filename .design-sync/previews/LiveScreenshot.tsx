import "./_still";
import { LiveScreenshot, BrowserFrame, PhoneFrame, LogoMark } from "cbm-port";
import { SHOT_DESKTOP, SHOT_MOBILE } from "./_fixtures";

/**
 * Nota sobre `durationSec`: a animação é um loop infinito (0% -> -62% -> 0%),
 * sem "estado final" — encurtar a duração pra quase-zero só tornaria a fase
 * capturada mais aleatória (o screenshot cai em qualquer ponto do loop curto).
 * Mantemos os valores reais de uso (28-32s): como a captura acontece logo após
 * o mount, a fase fica perto do topo da imagem — determinístico o bastante.
 */

function FallbackPlaceholder() {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#070B08",
        opacity: 0.2,
      }}
    >
      <LogoMark size={40} />
    </div>
  );
}

/** Uso real: fallback de dispositivos sem hover, dentro do PhoneFrame. */
export function NoPhoneFrame() {
  return (
    <div style={{ padding: 28, width: 260 }}>
      <PhoneFrame>
        <div style={{ aspectRatio: "9/16", width: "100%" }}>
          <LiveScreenshot
            src={SHOT_MOBILE}
            alt="MJ Engenharia — site mobile"
            durationSec={28}
          />
        </div>
      </PhoneFrame>
    </div>
  );
}

/** Mesmo componente no chrome de desktop (fallback do CaseFrameScroll no hero). */
export function NoBrowserFrame() {
  return (
    <div style={{ padding: 28, maxWidth: 700 }}>
      <BrowserFrame url="mj-engenharia-flame.vercel.app">
        <div style={{ aspectRatio: "16/10", width: "100%" }}>
          <LiveScreenshot
            src={SHOT_DESKTOP}
            alt="MJ Engenharia — site desktop"
            durationSec={32}
          />
        </div>
      </BrowserFrame>
    </div>
  );
}

/** Sem `src` (ou erro de carregamento) → cai no fallback fornecido. */
export function SemPreview() {
  return (
    <div style={{ padding: 28, maxWidth: 700 }}>
      <BrowserFrame url="rota-clinica.com.br">
        <div style={{ aspectRatio: "16/10", width: "100%" }}>
          <LiveScreenshot
            alt="Rota Clínica — site desktop"
            fallback={<FallbackPlaceholder />}
          />
        </div>
      </BrowserFrame>
    </div>
  );
}
