import "./_still";
import { CaseBackButton } from "cbm-port";

// CaseBackButton é `fixed left-5 top-5` — flutua sobre QUALQUER ponto do case,
// por isso o eixo de variação aqui é o conteúdo por trás dele, não o próprio
// botão (ele não tem props). O wrapper simula dois pontos do case onde ele
// aparece sobreposto: o topo (hero) e mais abaixo (grade de telas).
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        height: 280,
        overflow: "hidden",
        background: "#000F08",
      }}
    >
      {children}
    </div>
  );
}

export function SobreOHero() {
  return (
    <Stage>
      <CaseBackButton />
      <div style={{ padding: "78px 32px 0", maxWidth: 480 }}>
        <p
          className="font-display"
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(251,54,64,0.75)",
          }}
        >
          Landing Page Premium / Case Study
        </p>
        <h1
          className="font-display"
          style={{
            marginTop: 14,
            fontSize: 34,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "#F5F2ED",
          }}
        >
          MJ Engenharia
        </h1>
      </div>
    </Stage>
  );
}

export function SobreAGradeDeTelas() {
  return (
    <Stage>
      <CaseBackButton />
      <div
        style={{
          marginTop: 84,
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <div
          style={{
            aspectRatio: "16/10",
            border: "1px solid rgba(245,242,237,0.15)",
            background: "#070B08",
          }}
        />
        <div
          style={{
            aspectRatio: "16/10",
            border: "1px solid rgba(245,242,237,0.15)",
            background: "#070B08",
          }}
        />
      </div>
    </Stage>
  );
}
