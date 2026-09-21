import "./_still";
import { ProjetoGridCard } from "cbm-port";
import { CASE, CASE_B, CASE_SOON } from "./_fixtures";

// O card e uma celula de grade: fora dela ele estica. O wrapper reproduz a
// largura que a vitrine da a ele, que e onde as proporcoes fazem sentido.
function Cell({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 24, maxWidth: 420 }}>{children}</div>;
}

export function Publicado() {
  return (
    <Cell>
      <ProjetoGridCard project={CASE} index={0} />
    </Cell>
  );
}

export function OutroTipo() {
  return (
    <Cell>
      <ProjetoGridCard project={CASE_B} index={1} />
    </Cell>
  );
}

/** Sem `preview`, o card cai no placeholder triangulado — estado real. */
export function EmBreve() {
  return (
    <Cell>
      <ProjetoGridCard project={CASE_SOON} index={2} />
    </Cell>
  );
}

export function NaGrade() {
  return (
    <div
      style={{
        padding: 24,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,330px),1fr))",
        maxWidth: 1240,
        gap: 16,
      }}
    >
      <ProjetoGridCard project={CASE} index={0} />
      <ProjetoGridCard project={CASE_B} index={1} />
      <ProjetoGridCard project={CASE_SOON} index={2} />
    </div>
  );
}
