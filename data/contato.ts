/**
 * Copy de /contato (AEO-2, 2026-10-30).
 *
 * O FAQ visível e o `FAQPage` saem do mesmo array. Sem e-mail, rua, CEP,
 * horário ou depoimento: nada disso está publicado.
 */

import { PUBLIC_PRICE, type FaqItem } from "@/data/servicePages";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

export const CONTATO_TITLE = "Contato · Coded by M, web design em Florianópolis";

export const CONTATO_DESCRIPTION = `Fale com a Coded by M pelo WhatsApp ${WHATSAPP_DISPLAY}. Estúdio de web design em Florianópolis, atendendo empresas de todo o Brasil. Orçamento sem compromisso.`;

export const CONTATO_H1 = "Fale com a Coded by M";

export const CONTATO_LEAD =
  "A Coded by M é um estúdio de web design em Florianópolis (SC). O jeito mais rápido de falar comigo é pelo WhatsApp: você conta o projeto e eu respondo com valor e prazo antes de qualquer compromisso.";

export const CONTATO_ONDE =
  "O estúdio fica em Florianópolis e atende empresas de todo o Brasil de forma remota. As reuniões são online.";

export const CONTATO_MENSAGEM_INTRO = "Para eu responder mais rápido com valor e prazo:";

export const CONTATO_MENSAGEM = [
  "O que a empresa faz e qual o objetivo do site",
  "Se precisa de landing page ou site institucional",
  "Referências que você gosta, se tiver",
  "Prazo desejado",
] as const;

/** Frase até "Detalhes em". Os links de serviço entram na página, depois dela. */
export const CONTATO_INVESTIMENTO = `Landing page a partir de ${PUBLIC_PRICE.landing.display}. Site institucional a partir de ${PUBLIC_PRICE.institucional.display}. O valor final depende do projeto e é fechado no WhatsApp antes de começar. Detalhes em`;

export const CONTATO_FAQ: FaqItem[] = [
  {
    q: "Quanto tempo leva para eu receber resposta?",
    a: "Respondo no mesmo dia pelo WhatsApp.",
  },
  {
    q: "O orçamento tem custo?",
    a: "Não. O orçamento é gratuito e sem compromisso: você recebe valor e prazo antes de decidir.",
  },
  {
    q: "Atendem empresas fora de Santa Catarina?",
    a: "Sim, atendo todo o Brasil de forma remota.",
  },
];
