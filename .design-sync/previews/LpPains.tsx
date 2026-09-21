import "./_still";
import { LpPains } from "cbm-port";
import { LANDING } from "./_fixtures";

/** Canônico — quatro dores, o teto do contrato ("3 ou 4 pontos de dor"). */
export function Canonico() {
  return <LpPains lp={LANDING} />;
}

/** Piso do contrato — três dores, pra ver a lista mais curta. */
export function TresDores() {
  const lp = { ...LANDING, pains: LANDING.pains.slice(0, 3) };
  return <LpPains lp={lp} />;
}
