import "./_still";
import { FilterChips } from "cbm-port";

// `types` sao os tipos com projeto publicado — na vitrine real vem da pagina.
// A cor de cada chip vem de PROJECT_TYPE_COLOR, e e por isso que o eixo que
// vale varrer aqui e o `active`: e ele que troca a cor do ponto e da borda.
//
// As varreduras usam tres tipos porque a fileira com os quatro passa da largura
// do card. Isso nao e defeito: o componente e um scroller horizontal com snap,
// e a ultima celula mostra a fileira cheia, como ela chega na vitrine.

const TRES = ["landing", "institucional", "webapp"] as const;
const TODOS = ["landing", "institucional", "webapp", "ecommerce"] as const;

const frame = { padding: "28px 24px", maxWidth: 820 };

export function SemFiltro() {
  return (
    <div style={frame}>
      <FilterChips types={[...TRES]} active="all" onSelect={() => {}} />
    </div>
  );
}

export function LandingPagesAtivo() {
  return (
    <div style={frame}>
      <FilterChips types={[...TRES]} active="landing" onSelect={() => {}} />
    </div>
  );
}

export function AplicacoesWebAtivo() {
  return (
    <div style={frame}>
      <FilterChips types={[...TRES]} active="webapp" onSelect={() => {}} />
    </div>
  );
}

/** Vitrine jovem: so um tipo publicado, entao so dois chips aparecem. */
export function PoucosTipos() {
  return (
    <div style={frame}>
      <FilterChips types={["institucional"]} active="all" onSelect={() => {}} />
    </div>
  );
}

/** Fileira cheia: passa da largura e rola na horizontal, com snap. */
export function FileiraCompleta() {
  return (
    <div style={frame}>
      <FilterChips types={[...TODOS]} active="ecommerce" onSelect={() => {}} />
    </div>
  );
}
