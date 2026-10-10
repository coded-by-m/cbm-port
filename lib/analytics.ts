/**
 * Configuração de métricas — GA4 + Meta Pixel.
 *
 * IDs de pixel são públicos (ficam visíveis no HTML renderizado), então podem
 * viver no código. Env vars (NEXT_PUBLIC_*) permitem sobrescrever por ambiente
 * sem editar o código.
 *
 * Os scripts só carregam APÓS consentimento (LGPD) — ver components/analytics.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-Q83X8CQL3X";
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
 * Clique de contato → GA4 (+ Lead no Meta, se for WhatsApp).
 *
 * Chamado pelo listener global do `Analytics`, não por cada botão: qualquer
 * link `wa.me`/`mailto:` do site dispara, inclusive os que ainda vão nascer.
 * `location` é o `data-cm-id` do link (o mesmo que o Coded Insights lê), ou a
 * seção onde ele está.
 *
 * O Coded Insights não passa por aqui: o tracker dele já captura esses cliques
 * sozinho, sem consentimento (first-party, sem cookie). O GA4 e o Meta só
 * existem depois do consentimento — sem ele `gtag`/`fbq` são `undefined`.
 *
 * `generate_lead` continua saindo junto do `whatsapp_click`: é o evento-chave
 * que o GA4 já conhece, e trocar o nome zeraria o histórico.
 *
 * Não prova que a pessoa mandou a mensagem — prova que ela pediu o contato.
 */
export function trackContact(kind: "whatsapp" | "email", location: string) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "granted") return;
  const params = { location, transport_type: "beacon" };
  if (kind === "email") {
    window.gtag?.("event", "email_click", params);
    return;
  }
  window.gtag?.("event", "whatsapp_click", params);
  window.gtag?.("event", "generate_lead", {
    event_category: "contato",
    event_label: location,
    transport_type: "beacon",
  });
  window.fbq?.("track", "Lead", { content_name: location });
}

/** O tipo de contato de um link, ou null se não for contato. */
export function contactKind(href: string): "whatsapp" | "email" | null {
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  if (url.protocol === "mailto:") return "email";
  if (url.protocol === "whatsapp:") return "whatsapp";
  return /(^|\.)(wa\.me|whatsapp\.com)$/.test(url.hostname) ? "whatsapp" : null;
}

/**
 * Abertura de um case. Vai pro GA4 (com consentimento) e pro Coded Insights
 * como evento próprio — o nome precisa de separador (`project.view`), regra
 * do tracker para eventos customizados.
 */
export function trackProjectView(slug: string) {
  if (typeof window === "undefined") return;
  window.codedInsights?.track("project.view", { element_id: slug });
  if (getConsent() !== "granted") return;
  window.gtag?.("event", "project_view", { project: slug });
}
