/**
 * Configuração de métricas — GA4 + Meta Pixel.
 *
 * IDs de pixel são públicos (ficam visíveis no HTML renderizado), então podem
 * viver no código. Env vars (NEXT_PUBLIC_*) permitem sobrescrever por ambiente
 * sem editar o código.
 *
 * Os scripts só carregam APÓS consentimento (LGPD) — ver components/analytics.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-VBTVTZXE9C";
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1776271733361459";

/** Chave do consentimento no localStorage e evento de mudança. */
export const CONSENT_KEY = "cbm-cookie-consent";
export const CONSENT_EVENT = "cbm-consent-change";

export type ConsentValue = "granted" | "denied";

/** Lê o consentimento salvo (só no client). */
export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

/** Salva o consentimento e notifica os listeners (Analytics reage sem reload). */
export function setConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/**
 * Dispara o evento de conversão antes de abrir o WhatsApp.
 *
 * Não prova que a pessoa mandou a mensagem — prova que ela pediu o contato.
 * Ainda assim é muito melhor que deixar o Meta otimizar por "clique em link
 * de saída", que é o sinal que ele usaria sem isto.
 *
 * Silencioso sem consentimento: os scripts nem existem, então `gtag` e `fbq`
 * são `undefined` e a chamada apenas não acontece.
 */
export function trackLead(source: string) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "granted") return;
  window.gtag?.("event", "generate_lead", {
    event_category: "contato",
    event_label: source,
  });
  window.fbq?.("track", "Lead", { content_name: source });
}
