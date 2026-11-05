// Testes de lib/campaign.ts. Roda com: node --test scripts/campaign.test.mts
import { test } from "node:test";
import assert from "node:assert/strict";
import { messageWithCampaign, readCampaign } from "../lib/campaign.ts";

test("UTM legível vira a origem", () => {
  assert.equal(readCampaign("?utm_campaign=site-empresa"), "site-empresa");
});

test("utm_content tem preferência sobre utm_campaign", () => {
  assert.equal(readCampaign("?utm_campaign=site-empresa&utm_content=anuncio-2"), "anuncio-2");
});

test("gclid sozinho não vira origem", () => {
  assert.equal(readCampaign("?gclid=abc123"), null);
});

test("fbclid sozinho não vira origem", () => {
  assert.equal(readCampaign("?fbclid=abc123"), null);
});

test("gclid junto de UTM não atrapalha", () => {
  assert.equal(readCampaign("?gclid=abc123&utm_campaign=site-empresa"), "site-empresa");
});

test("sem campanha, a mensagem fica limpa", () => {
  assert.equal(messageWithCampaign("Olá", null), "Olá");
});

test("com campanha, a origem entra no fim da mensagem", () => {
  assert.equal(messageWithCampaign("Olá", "site-empresa"), "Olá (origem: site-empresa)");
});
