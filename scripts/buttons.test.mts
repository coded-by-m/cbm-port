// Testes dos botões triangulares — roda com: node --test scripts/buttons.test.mts
//
// 1. A malha (triMesh) cobre o botão inteiro, sem buraco, sempre igual.
// 2. O texto dos botões é legível em todo estado, nas quatro paletas: as cores
//    são compostas com o alpha real (buttonSpec) sobre o fundo real.
import { test } from "node:test";
import assert from "node:assert/strict";
import { PALETTES, contrastRatio, type Palette } from "../lib/palette.ts";
import { meshTris } from "../components/ui/triMesh.ts";
import { MESH, FILL } from "../components/ui/buttonSpec.ts";

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (c: number[]) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
/** `top` com opacidade `a` por cima de `bottom`. */
const over = (top: string, a: number, bottom: string) => {
  const t = rgb(top);
  const b = rgb(bottom);
  return hex(t.map((v, i) => v * a + b[i] * (1 - a)));
};

const area = (t: [number, number][]) =>
  Math.abs((t[1][0] - t[0][0]) * (t[2][1] - t[0][1]) - (t[2][0] - t[0][0]) * (t[1][1] - t[0][1])) / 2;

test("meshTris é determinística", () => {
  assert.deepEqual(meshTris(394, 71, 30), meshTris(394, 71, 30));
});

test("meshTris tem 2·cols·rows triângulos e cobre a caixa sem buraco", () => {
  for (const [w, h, cell] of [[394, 71, 30], [230, 46, 22], [1200, 64, 30]]) {
    const tris = meshTris(w, h, cell);
    const cols = Math.max(2, Math.round(w / cell));
    const rows = Math.max(2, Math.round(h / cell));
    assert.equal(tris.length, 2 * cols * rows);
    const total = tris.reduce((s, t) => s + area(t), 0);
    assert.ok(Math.abs(total - w * h) < 0.5, `${w}x${h}: área ${total}`);
  }
});

test("meshTris de caixa vazia não gera nada", () => {
  assert.deepEqual(meshTris(0, 0, 30), []);
});

const each = (fn: (p: Palette) => void) => Object.values(PALETTES).forEach(fn);

test("MeshButton: rótulo AAA em repouso e no pior pixel do hover", () => {
  each(({ id, colors: c }) => {
    const bg = over(c.page, MESH.bgAlpha, c.page);
    // Repouso: filete apagado atrás da placa.
    const rest = over(c.white, MESH.restLines * (1 - MESH.plate), over(c.page, MESH.plate, bg));
    // Hover: filete aceso, atenuado pela placa — o pior pixel sob uma letra.
    const lit = over(c.white, MESH.litLines * (1 - MESH.plate), over(c.page, MESH.plate, bg));
    assert.ok(contrastRatio(c.white, rest) >= 7, `${id} repouso ${contrastRatio(c.white, rest).toFixed(2)}`);
    assert.ok(contrastRatio(c.white, lit) >= 7, `${id} hover ${contrastRatio(c.white, lit).toFixed(2)}`);
  });
});

test("MeshButton: sem a placa o hover reprovaria (a placa é necessária)", () => {
  const c = PALETTES.neutro.colors;
  const lit = over(c.white, MESH.litLines, c.page);
  assert.ok(contrastRatio(c.white, lit) < 4.5);
});

test("MeshButton: seta e foco vermelhos ≥ 3:1 sobre o fundo", () => {
  each(({ id, colors: c }) => {
    const bg = over(c.page, MESH.bgAlpha, c.page);
    assert.ok(contrastRatio(c.red, bg) >= 3, `${id} ${contrastRatio(c.red, bg).toFixed(2)}`);
  });
});

test("FillButton: texto AA em toda mistura vermelho → off-white", () => {
  each(({ id, colors: c }) => {
    for (let a = 0; a <= 1.0001; a += 0.05) {
      const bg = over(c.white, a, c.red);
      const r = contrastRatio(c.page, bg);
      assert.ok(r >= 4.5, `${id} alpha ${a.toFixed(2)}: ${r.toFixed(2)}`);
    }
  });
});

test("FillButton: seta ≥ 3:1 nos dois estados", () => {
  each(({ id, colors: c }) => {
    assert.ok(contrastRatio(c.page, c.red) >= 3, `${id} repouso`);
    assert.ok(contrastRatio(c.red, c.white) >= 3, `${id} preenchido`);
  });
});

test("FillButton: tempos da onda coerentes", () => {
  assert.ok(FILL.span >= 800 && FILL.span <= 1400);
  assert.ok(FILL.exit < 1 && FILL.exit > 0);
});
