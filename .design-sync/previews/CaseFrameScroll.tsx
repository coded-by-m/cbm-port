import "./_still";
import { CaseFrameScroll, BrowserFrame, PhoneFrame, LogoMark } from "cbm-port";
import { SHOT_DESKTOP, SHOT_MOBILE } from "./_fixtures";

/** Estado real de fallback quando o site ainda não tem preview capturado. */
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

/** Uso canônico: hero do case, dentro do BrowserFrame, largura próxima do real (~860px). */
export function Canonico() {
  return (
    <div style={{ padding: 28, maxWidth: 700 }}>
      <BrowserFrame url="mj-engenharia-flame.vercel.app">
        <div style={{ aspectRatio: "16/10", width: "100%" }}>
          <CaseFrameScroll
            src={SHOT_DESKTOP}
            alt="MJ Engenharia — site desktop"
          />
        </div>
      </BrowserFrame>
    </div>
  );
}

/** Mesmo componente, dentro do PhoneFrame (uso na seção Responsivo). */
export function NoPhoneFrame() {
  return (
    <div style={{ padding: 28, width: 260 }}>
      <PhoneFrame>
        <div style={{ aspectRatio: "9/16", width: "100%" }}>
          <CaseFrameScroll
            src={SHOT_MOBILE}
            alt="MJ Engenharia — site mobile"
            autoDurationSec={28}
          />
        </div>
      </PhoneFrame>
    </div>
  );
}

/** Sem `src` (ou erro de carregamento) → cai no fallback fornecido. */
export function SemPreview() {
  return (
    <div style={{ padding: 28, maxWidth: 700 }}>
      <BrowserFrame url="rota-clinica.com.br">
        <div style={{ aspectRatio: "16/10", width: "100%" }}>
          <CaseFrameScroll
            alt="Rota Clínica — site desktop"
            fallback={<FallbackPlaceholder />}
          />
        </div>
      </BrowserFrame>
    </div>
  );
}
