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
