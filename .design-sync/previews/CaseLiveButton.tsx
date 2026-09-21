import "./_still";
import { CaseLiveButton } from "cbm-port";
import { CASE, CASE_B } from "./_fixtures";

function Cell({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 32 }}>{children}</div>;
}

/** Uso canônico: fim do hero, rótulo padrão, domínio real do case. */
export function Canonico() {
  return (
    <Cell>
      <CaseLiveButton url={CASE.siteUrl} />
    </Cell>
  );
}

/** Rótulo customizado — o eixo que mais muda a leitura do CTA. */
export function RotuloCustom() {
  return (
    <Cell>
      <CaseLiveButton url={CASE_B.siteUrl} label="Ver o Estúdio Lentz no ar" />
    </Cell>
  );
}

/** Composição real: como aparece no CTA de retorno, ao fim da página de case. */
export function NoContextoDoRetorno() {
  return (
    <div style={{ padding: 48, textAlign: "center", background: "#000F08" }}>
      <p
        className="font-display"
        style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(251,54,64,0.6)",
        }}
      >
        Veja ao vivo
      </p>
      <h2
        className="font-display"
        style={{
          marginTop: 14,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          color: "#F5F2ED",
        }}
      >
        Nada substitui
        <br />
        ver funcionando
      </h2>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
        <CaseLiveButton url={CASE.siteUrl} />
      </div>
    </div>
  );
}
