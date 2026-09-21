import "./_still";
import { LpProof } from "cbm-port";
import { LANDING } from "./_fixtures";

/** Canônico — os dois cases do segmento arquitetura, como no repo. */
export function Canonico() {
  return <LpProof lp={LANDING} />;
}

/** Três cases — a grade ganha uma terceira coluna. */
export function TresCases() {
  const lp = {
    ...LANDING,
    caseSlugs: ["mj-engenharia", "estudio-lentz", "forma-viva"],
  };
  return <LpProof lp={lp} />;
}
