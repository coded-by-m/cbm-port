/**
 * Copy exclusivo de /sobre (AEO-4).
 *
 * A bio, o manifesto, o processo e os pilares continuam em `data/about.ts` e
 * `data/process.ts` — a home e a experiência não mudam. O lead, o FAQ visível
 * e o `FAQPage` saem daqui, do mesmo array, sem preço. O link para /contato
 * fica na página, fora deste FAQ.
 */

import type { FaqItem } from "@/data/servicePages";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

/** Primeira frase sob o H1. A home segue com `ABOUT.manifesto`. */
export const SOBRE_LEAD =
  "A Coded by M é o estúdio solo de Matheus Mendes em Florianópolis: landing pages e sites institucionais sob medida, com código próprio, para empresas em todo o Brasil. Une design, tecnologia e pensamento estrutural pra construir uma presença digital à altura da empresa por trás dela.";

export const SOBRE_FAQ: FaqItem[] = [
  {
    q: "Quem é a Coded by M?",
    a: "A Coded by M é um estúdio de web design em Florianópolis, liderado por Matheus Mendes. Faz landing pages e sites institucionais sob medida e atende empresas em todo o Brasil.",
  },
  {
    q: "Quem faz os projetos?",
    a: "Matheus Mendes, fundador, web designer e desenvolvedor. Formado em Análise e Desenvolvimento de Sistemas; cada projeto passa por estratégia, design, código e acompanhamento depois do deploy.",
  },
  {
    q: "Como falar com o estúdio?",
    a: `Pelo WhatsApp ${WHATSAPP_DISPLAY}. Não há loja física aberta ao público; o atendimento é remoto a partir de Florianópolis.`,
  },
];
