import "./_still";
import { CaseHero } from "cbm-port";
import { CASE, CASE_B } from "./_fixtures";

export function Canonico() {
  return (
    <div style={{ padding: 0 }}>
      <CaseHero project={CASE} />
    </div>
  );
}

/** Sem `siteUrl`: some o CaseLiveButton do rodapé e a pill de domínio some do BrowserFrame. */
export function SemSiteAoVivo() {
  const semSite = { ...CASE, siteUrl: undefined };
  return (
    <div style={{ padding: 0 }}>
      <CaseHero project={semSite} />
    </div>
  );
}

/** Segundo case (institucional), pra variar título/eyebrow/domínio de verdade. */
export function Institucional() {
  return (
    <div style={{ padding: 0 }}>
      <CaseHero project={CASE_B} />
    </div>
  );
}
