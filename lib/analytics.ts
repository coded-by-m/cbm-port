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
 * Eventos de conversão.
 *
 * O Coded Insights (https://insights.codedbym.com/api/collect/v1) NÃO lê o
 * GA4. O `track()` público do tracker só aceita nome customizado com
 * separador (`.` `:` ou `-`): `track("whatsapp_click")` e
 * `track("project_view")` são descartados em silêncio. E o coletor responde
 * 400 `unsafe_property` — e joga o lote inteiro fora — se o evento trouxer
 * `location`, `project` ou `transport_type`.
 *
 * Por isso o destino first-party recebe o nome do protocolo e o "onde" em
 * `element_id` (o `data-cm-id`). O GA4, só depois do consentimento, recebe
 * `location` / `project` com `transport_type: "beacon"`.
 *
 * Nada de telefone, e-mail ou texto livre: o token do coletor não leva `@`
 * nem 6+ dígitos seguidos.
 */
export type TrackName =
  | "whatsapp_click"
  | "email_click"
  | "form_submit"
  | "project_view";

export interface TrackParams {
  /** `data-cm-id` do link (hero, footer, floating…). Não é dado pessoal. */
  location?: string;
  /** Slug do case. Vira `element_id` do custom event `project.view`. */
  project?: string;
  /** `data-cm-section` onde o clique aconteceu. */
  section?: string;
  form_id?: string;
  form_role?: string;
}

/** Token do protocolo v1. Fora disto o coletor recusa o lote. */
const INSIGHT_TOKEN = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,119}$/;

export function insightToken(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (!v || v.includes("@") || /\d{6,}/.test(v)) return undefined;
  return INSIGHT_TOKEN.test(v) ? v : undefined;
}

export interface InsightsEvent {
  name: string;
  properties: Record<string, string>;
  urgency: "urgent" | "normal";
}

/**
 * Traduz o nome que o plano pede para o que o coletor aceita.
 * `project_view` vira `custom_event` com `name: "project.view"` —
 * o protocolo recusa o nome com underscore.
 */
export function insightsEventFor(
  name: TrackName,
  params: TrackParams,
): InsightsEvent | null {
  const section = insightToken(params.section);
  if (name === "whatsapp_click" || name === "email_click") {
    const properties: Record<string, string> = {
      element_id: insightToken(params.location) ?? "unknown",
      element_role: name === "email_click" ? "email" : "whatsapp",
    };
    if (section) properties.section_role = section;
    return { name, properties, urgency: "urgent" };
  }
  if (name === "form_submit") {
    const properties: Record<string, string> = {};
    const formId = insightToken(params.form_id);
    const formRole = insightToken(params.form_role);
    if (formId) properties.form_id = formId;
    if (formRole) properties.form_role = formRole;
    if (section) properties.section_role = section;
    return { name: "form_submit", properties, urgency: "urgent" };
  }
  const project = insightToken(params.project);
  if (!project) return null;
  const properties: Record<string, string> = {
    name: "project.view",
    element_id: project,
  };
  if (section) properties.section_role = section;
  return { name: "custom_event", properties, urgency: "normal" };
}

type PendingInsight = InsightsEvent;
const pendingInsights: PendingInsight[] = [];
let flushingInsights = false;

function flushInsights() {
  if (typeof window === "undefined") return;
  const emit = window.__codedInsightsInternals?.emit;
  if (!emit) return;
  flushingInsights = false;
  const batch = pendingInsights.splice(0);
  for (const item of batch) emit(item.name, item.properties, { urgency: item.urgency });
}

/** Envia já, ou guarda até o tracker `defer` terminar de carregar. */
function emitInsights(event: InsightsEvent) {
  if (typeof window === "undefined") return;
  const emit = window.__codedInsightsInternals?.emit;
  if (!emit) {
    pendingInsights.push(event);
    if (flushingInsights) return;
    flushingInsights = true;
    const started = Date.now();
    const tick = () => {
      if (window.__codedInsightsInternals?.emit) {
        flushInsights();
        return;
      }
      if (Date.now() - started > 8000) {
        flushingInsights = false;
        pendingInsights.splice(0);
        return;
      }
      window.setTimeout(tick, 200);
    };
    window.setTimeout(tick, 200);
    return;
  }
  emit(event.name, event.properties, { urgency: event.urgency });
}

function gtagEvent(name: string, params: Record<string, string>) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "granted") return;
  window.gtag?.("event", name, { ...params, transport_type: "beacon" });
}

/**
 * Um evento de conversão. Seguro no SSR (não toca `window` se não houver).
 * O flush do Insights é urgente nos cliques — `fetch` com `keepalive`, o
 * equivalente ao beacon — e sai antes da navegação.
 */
export function trackEvent(name: TrackName, params: TrackParams = {}) {
  const event = insightsEventFor(name, params);
  if (event) emitInsights(event);
  if (typeof window === "undefined") return;
  if (name === "whatsapp_click" || name === "email_click") {
    const location = event?.properties.element_id ?? "unknown";
    gtagEvent(name, { location });
    if (name === "whatsapp_click" && getConsent() === "granted") {
      window.gtag?.("event", "generate_lead", {
        event_category: "contato",
        event_label: location,
        transport_type: "beacon",
      });
      window.fbq?.("track", "Lead", { content_name: location });
    }
    return;
  }
  if (name === "form_submit") {
    const formId = event?.properties.form_id;
    gtagEvent("form_submit", formId ? { form_id: formId } : {});
    return;
  }
  const project = event?.properties.element_id;
  if (project) gtagEvent("project_view", { project });
}

/** Clique de contato. `location` é o `data-cm-id`, nunca o número ou o e-mail. */
export function trackContact(kind: "whatsapp" | "email", location: string, section?: string) {
  trackEvent(kind === "email" ? "email_click" : "whatsapp_click", { location, section });
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
 * Abertura de um case. No Insights sai como `custom_event` `project.view`
 * (o protocolo recusa o nome `project_view`). No GA4, com consentimento,
 * o nome continua `project_view`.
 */
export function trackProjectView(slug: string) {
  trackEvent("project_view", { project: slug });
}
