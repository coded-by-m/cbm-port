import "./_still";
import { MeshButton } from "cbm-port";

// O botao da marca. "Malha que acorda": a malha triangulada (a mesma do
// terreno e do logo) fica quase apagada em repouso e acende so em volta do
// cursor. Num card estatico o que se ve e o repouso — que e o estado real do
// botao na maior parte do tempo. Uma placa escura esfumada fica atras do
// rotulo: nenhuma linha cruza as letras.
//
// Eixos que valem varrer: tamanho (lg/sm), seta, rotulo e link (href).

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

/** `sm`: acoes em contexto, como "ver o site no ar" num case. */
export function Pequeno() {
  return (
    <div style={linha}>
      <MeshButton label="Ver o site no ar" size="sm" />
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

/** Com `href` vira link de verdade (`<a>`), com o mesmo visual. */
export function ComoLink() {
  return (
    <div style={linha}>
      <MeshButton label="Começar meu projeto" href="https://wa.me/5548999916638" target="_blank" />
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

/** Desabilitado: a malha fica, o botao para de responder. */
export function Desabilitado() {
  return (
    <div style={linha}>
      <MeshButton label="Enviando…" disabled />
    </div>
  );
}
