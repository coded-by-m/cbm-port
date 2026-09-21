import "./_still";
import { LpFinal } from "cbm-port";
import { LANDING } from "./_fixtures";

export function Canonico() {
  return <LpFinal lp={LANDING} />;
}

/** CTA mais longo — testa o botão de fechamento com um rótulo maior. */
export function CtaLongo() {
  const lp = { ...LANDING, ctaLabel: "Quero apresentar minha obra assim" };
  return <LpFinal lp={lp} />;
}
