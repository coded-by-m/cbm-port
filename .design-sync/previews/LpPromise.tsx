import "./_still";
import { LpPromise } from "cbm-port";
import { LANDING } from "./_fixtures";

export function Canonico() {
  return <LpPromise lp={LANDING} />;
}

/** Promessa mais longa — testa o `maxWidth: 20ch` e a quebra de linha. */
export function PromessaLonga() {
  const lp = {
    ...LANDING,
    promise:
      "Um site que faz sua obra ser encontrada, entendida e lembrada — não só vista.",
  };
  return <LpPromise lp={lp} />;
}
