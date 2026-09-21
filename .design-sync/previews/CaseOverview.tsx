import "./_still";
import { CaseOverview } from "cbm-port";
import { CASE, CASE_B } from "./_fixtures";

export function Canonico() {
  return (
    <div style={{ padding: 0 }}>
      <CaseOverview project={CASE} />
    </div>
  );
}

/** Segundo case (institucional): texto diferente, mesma estrutura de heading/body/challenge. */
export function Institucional() {
  return (
    <div style={{ padding: 0 }}>
      <CaseOverview project={CASE_B} />
    </div>
  );
}

/** Overview com um terceiro parágrafo, pra checar a coluna de texto com mais massa. */
export function TextoLongo() {
  const longo = {
    ...CASE,
    overview: {
      ...CASE.overview,
      body: [
        ...CASE.overview.body,
        "O resultado: uma página que fala a língua técnica de quem aprova e a língua clara de quem contrata — sem escolher entre as duas.",
      ],
    },
  };
  return (
    <div style={{ padding: 0 }}>
      <CaseOverview project={longo} />
    </div>
  );
}
