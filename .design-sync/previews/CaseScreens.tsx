import "./_still";
import { CaseScreens } from "cbm-port";
import { CASE } from "./_fixtures";

/**
 * 6 telas (3 hero + 3 sections): a grade completa, com o painel largo a cada
 * tres. Seis e o maximo que fecha inteiro no card — o teto de altura da captura
 * e 2000px, e a setima linha ficaria cortada pela metade.
 */
export function Canonico() {
  const seis = { ...CASE, sections: CASE.sections.slice(0, 3) };
  return (
    <div style={{ padding: 0 }}>
      <CaseScreens project={seis} />
    </div>
  );
}

/** Só heroImages (sem sections/gallery): grade curta, 3 telas. */
export function PoucasTelas() {
  const poucas = { ...CASE, sections: [], gallery: [] };
  return (
    <div style={{ padding: 0 }}>
      <CaseScreens project={poucas} />
    </div>
  );
}
