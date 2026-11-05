// Testes da conversão do Google Ads. Roda com: node --test scripts/analytics.test.mts
// A query no import cria uma instância do módulo para cada estado do ambiente.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = "AW-123";
process.env.NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL = "abc";
const withAds = await import("../lib/analytics.ts?ads=on");

delete process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
delete process.env.NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL;
const withoutAds = await import("../lib/analytics.ts?ads=off");

function stubWindow(consent) {
  const calls = [];
  globalThis.window = {
    localStorage: { getItem: () => consent },
    gtag: (...args) => calls.push(args),
    fbq: () => {},
    __codedInsightsInternals: { emit: () => {} },
  };
  return calls;
}

const conversions = (calls) => calls.filter((c) => c[0] === "event" && c[1] === "conversion");

test("com consentimento e IDs, o clique no WhatsApp envia uma conversão", () => {
  const calls = stubWindow("granted");
  withAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.deepEqual(conversions(calls), [
    ["event", "conversion", { send_to: "AW-123/abc", transport_type: "beacon" }],
  ]);
});

test("com a recusa, nenhuma conversão sai", () => {
  const calls = stubWindow("denied");
  withAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.equal(conversions(calls).length, 0);
});

test("sem decisão sobre cookies, nenhuma conversão sai", () => {
  const calls = stubWindow(null);
  withAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.equal(conversions(calls).length, 0);
});

test("sem as variáveis, nenhuma conversão sai e o GA4 continua", () => {
  const calls = stubWindow("granted");
  withoutAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.equal(conversions(calls).length, 0);
  assert.ok(calls.some((c) => c[1] === "generate_lead"));
});

test("outro evento não vira conversão", () => {
  const calls = stubWindow("granted");
  withAds.trackEvent("email_click", { location: "footer" });
  assert.equal(conversions(calls).length, 0);
});
