import "./_still";
import { MeshButton } from "cbm-port";

// O botao principal do sistema. A malha triangulada por tras nao e enfeite: e a
// mesma gramatica do terreno da experiencia, trazida para o controle. Ela anima
// em repouso e responde ao ponteiro — num card estatico o que se ve e a malha
// em repouso, que ja e o essencial.
//
// O eixo que vale varrer e o rotulo (o botao dimensiona pelo texto, palavra a
// palavra) e a presenca da seta.

const linha = {
  padding: "32px 28px",
  display: "flex",
  gap: 20,
  flexWrap: "wrap" as const,
  alignItems: "center",
};

export function Canonico() {
  return (
    <div style={linha}>
      <MeshButton label="Falar sobre o meu projeto" />
    </div>
  );
}

/** Sem a seta, para quando o botao nao leva para fora da pagina. */
export function SemSeta() {
  return (
    <div style={linha}>
      <MeshButton label="Ver projetos" showArrow={false} />
    </div>
  );
}

/** O botao se dimensiona pelo rotulo — curto e longo lado a lado. */
export function Rotulos() {
  return (
    <div style={{ ...linha, flexDirection: "column", alignItems: "flex-start" }}>
      <MeshButton label="Entrar" />
      <MeshButton label="Começar um projeto" />
      <MeshButton label="Conversar sobre uma landing page de conversão" />
    </div>
  );
}

/** Desabilitado: a malha continua, o botao para de responder. */
export function Desabilitado() {
  return (
    <div style={linha}>
      <MeshButton label="Enviando…" disabled />
    </div>
  );
}
