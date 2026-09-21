import "./_still";
import { LpHero } from "cbm-port";
import { LANDING } from "./_fixtures";

export function Canonico() {
  return <LpHero lp={LANDING} />;
}

/** Headline mais longa — o eixo que mais estica a composição do hero. */
export function HeadlineLonga() {
  const lp = {
    ...LANDING,
    headline:
      "Sua clínica merece um site tão bem cuidado quanto o atendimento que você oferece.",
    sub: "Sites e landing pages para clínicas e consultórios que querem parecer tão sérios quanto são — feitos do zero, sem template, com a apresentação que o seu trabalho já teria se fosse impresso.",
  };
  return <LpHero lp={lp} />;
}
