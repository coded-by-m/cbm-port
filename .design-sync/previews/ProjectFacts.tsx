import "./_still";
import { ProjectFacts } from "cbm-port";
import { CASE, CASE_B } from "./_fixtures";

// Largura próxima da coluna de texto do hero real (max-w-[460px]).
function Cell({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 28, maxWidth: 460, background: "#000F08" }}>{children}</div>;
}

/** Uso canônico: meta completa + stack técnica. */
export function ComStack() {
  return (
    <Cell>
      <ProjectFacts meta={CASE.meta} stack={CASE.stack} />
    </Cell>
  );
}

/** `stack` é opcional — sem ela, a seção "Stack" inteira some (estado real). */
export function SemStack() {
  return (
    <Cell>
      <ProjectFacts meta={CASE_B.meta} />
    </Cell>
  );
}
