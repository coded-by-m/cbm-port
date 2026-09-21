import "./_still";
import { LpFaq } from "cbm-port";
import { LANDING } from "./_fixtures";

/** Canônico — três objeções, texto real da landing de arquitetura. */
export function Canonico() {
  return <LpFaq lp={LANDING} />;
}

/** Cinco objeções — o teto do contrato ("4 ou 5 objeções reais"). */
export function CincoObjecoes() {
  const lp = {
    ...LANDING,
    faq: [
      ...LANDING.faq,
      {
        q: "Preciso fornecer o texto pronto?",
        a: "Não. A gente parte de uma entrevista curta sobre seus projetos e eu estruturo o texto — você só revisa e ajusta o que quiser.",
      },
      {
        q: "O site funciona bem no celular?",
        a: "Sim. Todo projeto é desenhado primeiro pro celular, porque é de lá que a maioria dos seus visitantes vem — a versão de desktop é a adaptação, não o contrário.",
      },
    ],
  };
  return <LpFaq lp={lp} />;
}
