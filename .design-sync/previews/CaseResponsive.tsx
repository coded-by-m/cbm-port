import "./_still";
import { CaseResponsive } from "cbm-port";
import { CASE, CASE_B } from "./_fixtures";

export function Canonico() {
  return (
    <div style={{ padding: 0 }}>
      <CaseResponsive project={CASE} />
    </div>
  );
}

/** Segundo case (institucional): mesmo layout de PhoneFrame, texto diferente. */
export function Institucional() {
  return (
    <div style={{ padding: 0 }}>
      <CaseResponsive project={CASE_B} />
    </div>
  );
}
