// Testes de lib/palette.ts — roda com: node --test scripts/palette.test.mts
// (.mts fica fora do `include` do tsconfig, por isso o import com extensão.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { PALETTES, TOKENS, cbm, paletteCss, contrastRatio } from "../lib/palette.ts";

test("toda paleta define todos os tokens em #RRGGBB", () => {
  for (const p of Object.values(PALETTES))
    for (const t of TOKENS) assert.match(p.colors[t], /^#[0-9A-F]{6}$/, `${p.id}.${t}`);
});

test("vermelho e off-white são fixos", () => {
  for (const p of Object.values(PALETTES)) {
    assert.equal(p.colors.white, "#F5F2ED");
    assert.equal(p.colors.red, "#FB3640");
    assert.equal(p.colors["red-dark"], "#C42030");
  }
});

test("'atual' preserva os valores de produção", () => {
  const c = PALETTES.atual.colors;
  assert.equal(c.page, "#000F08");
  assert.equal(c.base, "#040806");
  assert.equal(c.surface, "#070B08");
  assert.equal(c.border, "#111511");
  assert.equal(c["gray-400"], "#8A8780");
});

test("candidatas novas não têm viés verde", () => {
  for (const id of ["neutro", "quente", "puro"] as const)
    for (const [t, hex] of Object.entries(PALETTES[id].colors)) {
      if (["success", "accent-2", "info"].includes(t)) continue;
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      assert.ok(!(g > r && g > b), `${id}.${t} ${hex}`);
    }
});

test("cbm() monta var com e sem alpha", () => {
  assert.equal(cbm("base"), "rgb(var(--cbm-base))");
  assert.equal(cbm("base", 0.8), "rgb(var(--cbm-base) / 0.8)");
});

test("paletteCss emite canais separados por espaço", () => {
  assert.match(paletteCss("atual"), /--cbm-base:4 8 6;/);
});

test("contrastRatio bate com valores conhecidos", () => {
  assert.equal(Math.round(contrastRatio("#000000", "#FFFFFF")), 21);
  // Vermelho sobre off-white: 3.30:1 (reprova AA para texto, como a marca já trata).
  assert.ok(Math.abs(contrastRatio("#FB3640", "#F5F2ED") - 3.3) < 0.05);
});

test("corpo e secundário passam AA sobre base nas candidatas", () => {
  for (const id of ["neutro", "quente", "puro"] as const) {
    const c = PALETTES[id].colors;
    assert.ok(contrastRatio(c["gray-200"], c.base) >= 4.5, `${id} gray-200`);
    assert.ok(contrastRatio(c["gray-400"], c.base) >= 4.5, `${id} gray-400`);
  }
});
