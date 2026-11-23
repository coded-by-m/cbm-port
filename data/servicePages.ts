import { LP_OU_URL } from "@/data/landingOuInstitucional";
import { QUANTO_CUSTA_CRUMB, QUANTO_CUSTA_PATH } from "@/data/quantoCusta";

/**
 * Fatos comerciais compartilhados: preço público, respostas de FAQ que valem
 * para qualquer projeto e os utilitários de FAQ. As três páginas de serviço
 * que moravam aqui saíram em 2026-11-22 (redirecionam para a `/`).
 *
 * Fonte única: a FAQ visível e o JSON-LD `FAQPage` saem do mesmo array, então
 * o texto do robô é sempre o texto da página.
 *
 * ATENÇÃO — respostas marcadas com PREENCHER dependem de números que só o
 * Matheus tem (prazo, hospedagem). Elas NÃO aparecem no site nem no schema
 * enquanto tiverem o marcador (ver `isFilled`): melhor uma pergunta a menos
 * que uma resposta inventada.
 *
 * Preço público (Matheus, 2026-11-16): landing a partir de R$ 800 e site
 * institucional a partir de R$ 1.500. O valor final depende do projeto.
 * Arquitetura não tem número publicado — a resposta segue sem faixa.
 */

export interface FaqItem {
  q: string;
  /**
   * Resposta em texto. `{0}`, `{1}`… marcam um link de `links` no meio da
   * frase. Sem marcador, os links entram no fim como "Veja: …".
   */
  a: string;
  /** Links da resposta. No JSON-LD entra só o rótulo, nunca a URL nem HTML. */
  links?: { href: string; label: string }[];
}

export type FaqSegment =
  | { type: "text"; text: string }
  | { type: "link"; href: string; label: string };

/** Resposta pronta pra publicar — sem o marcador de rascunho. */
export function isFilled(f: FaqItem) {
  return !f.a.includes("PREENCHER");
}

/**
 * A resposta na ordem em que a página mostra. O schema usa o mesmo recorte,
 * só que em texto puro (rótulo do link, sem HTML e sem URL).
 */
export function faqAnswerSegments(f: FaqItem): FaqSegment[] {
  const links = f.links ?? [];
  if (links.length && /\{\d+\}/.test(f.a)) {
    const segments: FaqSegment[] = [];
    f.a.split(/\{(\d+)\}/).forEach((chunk, i) => {
      if (i % 2 === 0) {
        if (chunk) segments.push({ type: "text", text: chunk });
        return;
      }
      const link = links[Number(chunk)];
      if (link) segments.push({ type: "link", href: link.href, label: link.label });
    });
    return segments;
  }

  const segments: FaqSegment[] = [{ type: "text", text: f.a }];
  if (links.length) {
    segments.push({ type: "text", text: " Veja: " });
    links.forEach((link, i) => {
      if (i > 0) segments.push({ type: "text", text: " e " });
      segments.push({ type: "link", href: link.href, label: link.label });
    });
    segments.push({ type: "text", text: "." });
  }
  return segments;
}

/** Texto da resposta como o leitor vê, sem HTML — o mesmo vai pro schema. */
export function faqAnswerText(f: FaqItem) {
  return faqAnswerSegments(f)
    .map((segment) => (segment.type === "link" ? segment.label : segment.text))
    .join("");
}

/**
 * Pisos publicados. `amount` entra no Offer (`price` + BRL, sem separador).
 * `display` é o que a pessoa lê. Sem aggregateRating.
 */
export const PUBLIC_PRICE = {
  landing: { amount: "800", display: "R$ 800" },
  institucional: { amount: "1500", display: "R$ 1.500" },
} as const;

/**
 * Respostas que valem para qualquer projeto. Uma constante só, para a home, as
 * guias e a landing dizerem a mesma coisa.
 */
export const HOSPEDAGEM_INCLUSA: FaqItem = {
  q: "Hospedagem e domínio estão inclusos?",
  a: "Sim, no primeiro ano. A hospedagem fica por minha conta, e o domínio é registrado no nome da sua empresa. Os dois estão incluídos no valor do projeto durante o primeiro ano.",
};

export const PLANO_MENSAL =
  "Existe um plano mensal opcional de suporte e atualizações, com valor que depende do serviço.";

/** Matheus, 2026-11-16: emite contrato e nota fiscal em todo projeto. */
export const CONTRATO_NF: FaqItem = {
  q: "Tem contrato e nota fiscal?",
  a: "Sim. Emito contrato e nota fiscal em todo projeto. Valor e prazo são fechados antes de começar.",
};

/** Matheus, 2026-11-16: o layout muda até o cliente aprovar. */
export const LAYOUT_AJUSTES: FaqItem = {
  q: "E se eu não gostar do layout?",
  a: "O layout é ajustado até ficar do seu agrado. Você acompanha o desenho na etapa de design, antes de o código começar.",
};

export const GARANTIA_GOOGLE: FaqItem = {
  q: "Vocês garantem o primeiro lugar no Google?",
  a: "Não, e ninguém pode garantir. O que entra em todo projeto é o SEO técnico: páginas leves, metadados e dados estruturados prontos para o Google desde o primeiro dia. A posição depende também da concorrência e do conteúdo.",
};

/** A objeção ao estúdio solo, respondida com o que já é fato publicado. */
export const ESTUDIO_SOLO: FaqItem = {
  q: "O estúdio é de uma pessoa só. E se eu quiser trocar de fornecedor?",
  a: "Você fala direto com quem desenha e programa, sem repasse para terceiros. E não fica preso: o domínio é registrado no nome da sua empresa e, na entrega, código e acessos ficam com você.",
};

/** Matheus, 2026-11-16: todo cliente que fecha recebe acesso ao Coded Insights. */
export const PAINEL_VISITAS =
  "quantas pessoas entram no site, de onde vêm e quantas clicam no WhatsApp";

export const INSTITUCIONAL_PRECO = `A partir de ${PUBLIC_PRICE.institucional.display}. O valor final depende do projeto: páginas, conteúdo e integrações mudam o valor. Escopo e prazo no orçamento antes de começar.`;
