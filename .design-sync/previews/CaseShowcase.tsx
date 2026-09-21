import "./_still";
import { CaseShowcase } from "cbm-port";
import { CASE } from "./_fixtures";

/** Desktop3d + mobile3d sobreposto, gradiente tingido pela paleta do case. */
export function Canonico() {
  return (
    <div style={{ padding: 0 }}>
      <CaseShowcase project={CASE} />
    </div>
  );
}

/** Sem mobile3d: só a peça central, sem o overlay no canto. */
export function SoDesktop() {
  const soDesktop = { ...CASE, mockups: { ...CASE.mockups, mobile3d: undefined } };
  return (
    <div style={{ padding: 0 }}>
      <CaseShowcase project={soDesktop} />
    </div>
  );
}

/** Paleta diferente (tons quentes e saturados): confirma que o gradiente muda com a marca capturada. */
export function PaletteQuente() {
  const quente = { ...CASE, palette: ["#fff5eb", "#ff8a3d", "#ff5a1f", "#ff2d00"] };
  return (
    <div style={{ padding: 0 }}>
      <CaseShowcase project={quente} />
    </div>
  );
}
