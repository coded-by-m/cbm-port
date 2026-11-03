# Lab de revisão + paleta sem verde: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar as cores do código e levá-las para variáveis CSS alimentadas por `lib/palette.ts`, e montar `/lab/revisao`, onde a paleta troca ao vivo sobre os componentes reais, a cena 3D e os posts.

**Architecture:** `lib/palette.ts` guarda as quatro paletas (Atual, Neutro, Quente, Puro). O `app/layout.tsx` injeta as variáveis da `ACTIVE_PALETTE` (`"atual"`), e com isso a produção fica com os mesmos pixels. O Tailwind e todas as cores escritas direto passam a ler `--cbm-*`. O lab sobrescreve as variáveis no `<html>`. A cena 3D lê as variáveis na montagem (`paletteHex`), e o lab a remonta a cada troca. Os componentes do lab vêm dos previews de `.design-sync/previews/`, os mesmos que vão para o Claude Design.

**Tech Stack:** Next 14 (app router), React 18, Tailwind 3.4, three/R3F, Node 24 (`node --test` com remoção de tipos nativa).

## Global Constraints

- O vermelho `#FB3640`, o hover `#C42030` e o off-white `#F5F2ED` são fixos em todas as paletas.
- `ACTIVE_PALETTE = "atual"` até o Matheus escolher no lab. Até lá, a produção mantém os mesmos valores visuais. Só são aceitas variações de 1 ou 2 níveis de RGB na fusão de tons quase iguais (tabela da Task 4).
- `border-radius: 0` continua regra.
- `app/ui-lab/` não é tocado. É o "antes".
- Arquivos com trabalho em andamento do Matheus (`components/analytics/CookieConsent.tsx`, `components/ui/WhatsAppFab.tsx`, `app/posts/machado/`): editar as cores, mas **não commitar**. Eles ficam para o Matheus commitar junto com o trabalho dele.
- Os commits terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `lib/palette.ts` (novo) | Tipos, as 4 paletas, `ACTIVE_PALETTE`, `cbm()`, `paletteCss()`, `paletteHex()`, `applyPalette()`, `contrastRatio()` |
| `scripts/palette.test.mts` (novo) | Testes de `lib/palette.ts` (`node --test`) |
| `scripts/check-green.mjs` (novo) | Falha se existir literal de cor escuro com viés verde fora de `app/ui-lab` |
| `app/layout.tsx` | Injeta `<style id="cbm-palette">` com `paletteCss(ACTIVE)` |
| `tailwind.config.ts` | `cbm.*` passa a ler `rgb(var(--cbm-*) / <alpha-value>)` |
| `next.config.js`, `tsconfig.json` | Alias `cbm-port` → `.design-sync/entry.tsx`. `_still` vira módulo vazio no Next |
| `app/lab/revisao/*` (novo) | Página, barra de paleta, `Item` com ID, registro de previews, seções |
| ~70 arquivos em `app/`, `components/`, `.design-sync/` | Troca das cores escritas direto por tokens |

---

### Task 1: `lib/palette.ts` com testes

**Files:**
- Create: `lib/palette.ts`
- Test: `scripts/palette.test.mts`

**Interfaces:**
- Produces:
  - `type Token = SurfaceToken | GrayToken | SupportToken | FixedToken`
  - `type PaletteId = "atual" | "neutro" | "quente" | "puro"`
  - `PALETTES: Record<PaletteId, Palette>` (`Palette = { id; label; note; colors: Record<Token, string /* #RRGGBB */> }`)
  - `TOKENS: readonly Token[]`, `ACTIVE_PALETTE: PaletteId`
  - `cbm(token: Token, alpha?: number): string` → `"rgb(var(--cbm-base))"` / `"rgb(var(--cbm-base) / 0.8)"`
  - `paletteCss(id: PaletteId): string` → `":root{--cbm-base:4 8 6;…}"`
  - `paletteHex(token: Token): string` → hex lido da variável CSS no cliente, ou da `ACTIVE_PALETTE` no servidor
  - `applyPalette(id: PaletteId | null): void` → escreve ou limpa as variáveis no `<html>` e dispara `cbm:palette`
  - `contrastRatio(a: string, b: string): number`

- [ ] **Step 1: Escrever os testes**

```ts
// scripts/palette.test.mts — roda com: node --test scripts/palette.test.mts
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
  assert.ok(Math.abs(contrastRatio("#FB3640", "#F5F2ED") - 3.15) < 0.05);
});

test("corpo e secundário passam AA sobre base nas candidatas", () => {
  for (const id of ["neutro", "quente", "puro"] as const) {
    const c = PALETTES[id].colors;
    assert.ok(contrastRatio(c["gray-200"], c.base) >= 4.5, `${id} gray-200`);
    assert.ok(contrastRatio(c["gray-400"], c.base) >= 4.5, `${id} gray-400`);
  }
});
```

- [ ] **Step 2: Rodar e ver falhar.** `node --test scripts/palette.test.mts` deve dar FAIL com "Cannot find module …/lib/palette.ts".

- [ ] **Step 3: Implementar `lib/palette.ts`**

```ts
/**
 * Fonte única das cores da Coded by M.
 *
 * Cada paleta vira variáveis CSS `--cbm-<token>` com canais RGB separados por
 * espaço ("4 8 6"), o formato que o Tailwind precisa para `/<alpha-value>`.
 * O código nunca escreve a cor: usa `cbm("base")` em estilo inline, a classe
 * `cbm-*` no Tailwind ou `paletteHex("base")` onde só um hex serve (three.js).
 *
 * `ACTIVE_PALETTE` é o que o site em produção usa. As outras existem para o
 * /lab/revisao comparar ao vivo.
 */

export const SURFACE_TOKENS = [
  "page", "sunken", "base", "surface", "raised", "drawer",
  "frame-bar", "frame", "card", "border", "border-active", "line",
] as const;
export const GRAY_TOKENS = [
  "gray-50", "gray-100", "gray-200", "gray-300", "gray-400",
  "gray-500", "gray-600", "gray-700", "gray-800", "gray-900",
] as const;
export const SUPPORT_TOKENS = ["success", "warning", "info", "accent-2"] as const;
export const FIXED_TOKENS = ["white", "red", "red-dark"] as const;
export const TOKENS = [...SURFACE_TOKENS, ...GRAY_TOKENS, ...SUPPORT_TOKENS, ...FIXED_TOKENS] as const;

export type Token = (typeof TOKENS)[number];
export type PaletteId = "atual" | "neutro" | "quente" | "puro";
export interface Palette {
  id: PaletteId;
  label: string;
  note: string;
  colors: Record<Token, string>;
}

const FIXED = { white: "#F5F2ED", red: "#FB3640", "red-dark": "#C42030" } as const;
const SUPPORT = { success: "#4CC38A", warning: "#F2B33D", info: "#5B9BF0", "accent-2": "#8FB3C9" } as const;

const NEUTRAL_GRAYS = {
  "gray-50": "#F2F2F2", "gray-100": "#E5E5E5", "gray-200": "#C9C9C9", "gray-300": "#ADADAD",
  "gray-400": "#8F8F8F", "gray-500": "#737373", "gray-600": "#575757", "gray-700": "#3D3D3D",
  "gray-800": "#262626", "gray-900": "#171717",
} as const;

export const PALETTES: Record<PaletteId, Palette> = {
  atual: {
    id: "atual",
    label: "Atual",
    note: "Produção hoje: preto com viés verde.",
    colors: {
      page: "#000F08", sunken: "#020504", base: "#040806", surface: "#070B08",
      raised: "#070C09", drawer: "#080D0A", "frame-bar": "#070D09", frame: "#0A120C",
      card: "#0E1810", border: "#111511", "border-active": "#1A2418", line: "#1A2A1E",
      "gray-50": "#F0EDE8", "gray-100": "#E8E4DE", "gray-200": "#C8C4BE", "gray-300": "#A9A59F",
      "gray-400": "#8A8780", "gray-500": "#6E6B66", "gray-600": "#4A4844", "gray-700": "#34332F",
      "gray-800": "#1E1E1A", "gray-900": "#121210",
      ...SUPPORT, ...FIXED,
    },
  },
  neutro: {
    id: "neutro",
    label: "Neutro",
    note: "Quase preto sem matiz; cinzas neutros.",
    colors: {
      page: "#0A0A0A", sunken: "#050505", base: "#0A0A0A", surface: "#0F0F0F",
      raised: "#121212", drawer: "#141414", "frame-bar": "#121212", frame: "#171717",
      card: "#1A1A1A", border: "#1C1C1C", "border-active": "#2A2A2A", line: "#262626",
      ...NEUTRAL_GRAYS, ...SUPPORT, ...FIXED,
    },
  },
  quente: {
    id: "quente",
    label: "Quente",
    note: "Quase preto grafite-marrom; cinzas quentes como o off-white.",
    colors: {
      page: "#0C0B0A", sunken: "#070605", base: "#0C0B0A", surface: "#12100F",
      raised: "#151311", drawer: "#171513", "frame-bar": "#151311", frame: "#1B1917",
      card: "#1E1B18", border: "#1F1C19", "border-active": "#2E2A26", line: "#2A2622",
      "gray-50": "#F0EDE8", "gray-100": "#E8E4DE", "gray-200": "#C8C4BE", "gray-300": "#ABA79F",
      "gray-400": "#8F8B84", "gray-500": "#74716B", "gray-600": "#5A5752", "gray-700": "#403E3A",
      "gray-800": "#292725", "gray-900": "#181716",
      ...SUPPORT, ...FIXED,
    },
  },
  puro: {
    id: "puro",
    label: "Puro",
    note: "#000 no fundo; sunken e base achatam no mesmo preto.",
    colors: {
      page: "#000000", sunken: "#000000", base: "#000000", surface: "#0B0B0B",
      raised: "#0E0E0E", drawer: "#101010", "frame-bar": "#0E0E0E", frame: "#141414",
      card: "#161616", border: "#1A1A1A", "border-active": "#262626", line: "#222222",
      ...NEUTRAL_GRAYS, ...SUPPORT, ...FIXED,
    },
  },
};

export const ACTIVE_PALETTE: PaletteId = "atual";
export const PALETTE_EVENT = "cbm:palette";

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

/** Cor do token para estilo inline. Responde à troca de paleta. */
export function cbm(token: Token, alpha?: number): string {
  return alpha === undefined
    ? `rgb(var(--cbm-${token}))`
    : `rgb(var(--cbm-${token}) / ${alpha})`;
}

/** Bloco `:root{…}` de uma paleta. Injetado no layout raiz. */
export function paletteCss(id: PaletteId): string {
  const c = PALETTES[id].colors;
  return `:root{${TOKENS.map((t) => `--cbm-${t}:${channels(c[t])};`).join("")}}`;
}

/**
 * Hex do token no momento da chamada. Para quem não aceita `var()` (three.js).
 * Não reage sozinho à troca: quem usa precisa remontar (o lab remonta a cena).
 */
export function paletteHex(token: Token): string {
  if (typeof document !== "undefined") {
    const v = getComputedStyle(document.documentElement).getPropertyValue(`--cbm-${token}`).trim();
    const parts = v.split(/\s+/).map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n)))
      return "#" + parts.map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
  }
  return PALETTES[ACTIVE_PALETTE].colors[token];
}

/** Sobrescreve as variáveis no <html> (lab). `null` volta à paleta ativa. */
export function applyPalette(id: PaletteId | null): void {
  const root = document.documentElement;
  for (const t of TOKENS) {
    if (id === null) root.style.removeProperty(`--cbm-${t}`);
    else root.style.setProperty(`--cbm-${t}`, channels(PALETTES[id].colors[t]));
  }
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT, { detail: id ?? ACTIVE_PALETTE }));
}

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Razão de contraste WCAG entre dois #RRGGBB. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
```

- [ ] **Step 4: Rodar e ver passar.** `node --test scripts/palette.test.mts` deve dar PASS nos 8 testes. Se o teste de AA reprovar alguma candidata, clarear o `gray-400` dela até passar e anotar o valor.

- [ ] **Step 5: Commit** `lib/palette.ts` e `scripts/palette.test.mts`, com a mensagem `feat(palette): fonte única das cores com 4 paletas candidatas`.

---

### Task 2: variáveis no layout e Tailwind lendo variáveis

**Files:**
- Modify: `app/layout.tsx` (dentro de `<head>`, ou do `<html>` se não houver head)
- Modify: `tailwind.config.ts`

**Interfaces:**
- Consumes: `paletteCss`, `ACTIVE_PALETTE`, `TOKENS` da Task 1.
- Produces: as classes `bg-cbm-<token>`, `text-cbm-<token>` e `border-cbm-<token>` para **todos** os tokens. `cbm-black` fica como alias de `page` e `cbm-forest` como alias de `surface`, para não quebrar o que já existe. Os aliases somem na Task 4.

- [ ] **Step 1:** Em `app/layout.tsx`, importar `{ ACTIVE_PALETTE, paletteCss }` de `@/lib/palette` e renderizar como primeiro filho do `<head>`:

```tsx
<style id="cbm-palette" dangerouslySetInnerHTML={{ __html: paletteCss(ACTIVE_PALETTE) }} />
```

- [ ] **Step 2:** Em `tailwind.config.ts`, trocar o objeto `cbm` por um gerado:

```ts
import { TOKENS } from "./lib/palette";

const v = (t: string) => `rgb(var(--cbm-${t}) / <alpha-value>)`;
const cbm: Record<string, string | Record<string, string>> = Object.fromEntries(
  TOKENS.filter((t) => !t.startsWith("gray-")).map((t) => [t, v(t)]),
);
cbm.gray = Object.fromEntries(
  TOKENS.filter((t) => t.startsWith("gray-")).map((t) => [t.slice(5), v(t)]),
);
cbm.black = v("page");   // alias legado, sai na Task 4
cbm.forest = v("surface"); // alias legado, sai na Task 4
```

e usar `colors: { cbm }`.

- [ ] **Step 3: Verificar.** `npm run typecheck` sem erros novos (comparar com `git stash; npm run typecheck` se já houver erros antes) e `npm run build` concluindo. Abrir `/` e `/projetos` no `npm run dev`: visual idêntico.

- [ ] **Step 4: Commit** com a mensagem `feat(palette): tokens cbm lêem variáveis CSS`.

---

### Task 3: detector de verde

**Files:**
- Create: `scripts/check-green.mjs`

- [ ] **Step 1:** Escrever o script. Ele percorre `app`, `components`, `lib`, `hooks` e `.design-sync` (ignorando `node_modules`, `.next`, `ds-package` e `app/ui-lab`), casa `#RRGGBB`, `0xRRGGBB` e `rgb(a)(r,g,b`, marca como verde o que tiver `g > r && g >= b && max < 120`, imprime `arquivo:linha  literal` e sai com código 1 se houver ocorrência. `lib/palette.ts` também fica de fora, porque é a fonte declarada.
- [ ] **Step 2:** Rodar `node scripts/check-green.mjs` e confirmar que FALHA, listando ~187 ocorrências.
- [ ] **Step 3: Commit** com a mensagem `chore: detector de cor verde escrita direto no código`.

---

### Task 4: troca das cores escritas direto

**Mapeamento** (aplicado em todas as subtarefas):

| Literal encontrado | Token |
|---|---|
| `#000F08`, `rgb(a)(0,15,8…)`, `0x000f08` | `page` |
| `#040806`, `#050806`, `rgb(a)(4,8,6…)` | `base` |
| `#020504`, `#030403`, `rgb(a)(3,4,3…)` | `sunken` |
| `#070B08`, `#060A07` | `surface` |
| `#070C09`, `rgb(7,12,9)` | `raised` |
| `#080D0A` | `drawer` |
| `#070D09` | `frame-bar` |
| `#0A120C`, `#0B120D`, `#0B130D` | `frame` |
| `#0E1810`, `rgb(14,24,16)` | `card` |
| `#111511` | `border` |
| `#1A2418`, `#1E2721` | `border-active` |
| `#1A2A1E`, `#16271B`, `rgb(26,42,30)` | `line` |
| `#0a0a0a` (`TerrainMesh/config.ts` `fillLow`) | `page` |

**Formas de troca:**
- Estilo inline e constantes JS: `cbm("token")` ou `cbm("token", alpha)`.
- Classe Tailwind arbitrária: `bg-[#0E1810]` → `bg-cbm-card`, `bg-[#040806]/90` → `bg-cbm-base/90`.
- CSS (`globals.css`): `#040806` → `rgb(var(--cbm-base))`, `rgba(4,8,6,.5)` → `rgb(var(--cbm-base) / .5)`.
- Template com `BASE_RGB`/`SUNKEN_RGB` (`rgba(${BASE_RGB},a)`): trocar o uso por `cbm("base", a)` / `cbm("sunken", a)`. As constantes ficam exportadas, mas com valor `"var(--cbm-base)"`, e a doc avisa que o uso certo é `rgb(${BASE_RGB} / a)`.
- three.js (`new Color(...)`, `<fog args>`, `color=` de material): `paletteHex("token")` **chamado no render ou dentro do componente**, nunca no topo do módulo. Para objetos de config como `FOG.color`, usar getter: `get color() { return paletteHex("page"); }`. `COLORS.background` que vai para `style` vira `cbm("page")`.
- `shared.tsx` `SURFACE`/`INK`: valores viram `cbm(...)`. `INK.ink` = `cbm("base")`, `INK.border` = `cbm("base", 0.14)`, `INK.card` = `cbm("base", 0.025)`. `SECTION.borderTop` = `` `1px solid ${cbm("border")}` ``.
- A cor do seletor de texto e os comentários que citam hex (`/* … #000F08 … */`) também mudam, para o detector não pegar e a doc não mentir.
- Remover os aliases `black`/`forest` do Tailwind: `cbm-black` → `cbm-page`, `cbm-forest` → `cbm-surface`.

**Subtarefas**, cada uma com um commit e cada uma diminuindo a saída de `check-green` só nos seus arquivos:

- [ ] **4a: base do site.** `app/globals.css`, `app/layout.tsx`, `components/site/*`, `components/home/*`, `app/experiencia`, `app/cases`, `app/lab/page.tsx`. Verificação: `/` e `/sobre` sem diferença visual.
- [ ] **4b: componentes.** `components/{case,projetos,lp,ui,service,analytics}`. Verificação: `/projetos`, um case, `/lp/...` sem diferença. **Não commitar** `CookieConsent.tsx` nem `WhatsAppFab.tsx`.
- [ ] **4c: cena 3D.** `components/zones/**`. Verificação: a home rola com o terreno, o fog e os cards iguais, sem erro no console.
- [ ] **4d: posts.** `app/posts/_shared/chrome.tsx` (`BLACK`→`cbm("page")`, `BORDER`→`cbm("line")`, `OUTLINE`→`cbm("line")`), `app/posts/*/slides.tsx` (`SCREEN`→`cbm("frame")`), `app/posts/*/[[...slug]]/page.tsx`. Verificação: `/posts/importancia/1` igual. **Não commitar** `app/posts/machado/`.
- [ ] **4e: design-sync.** `.design-sync/build-css.mjs` (base escura via variável, injetando `paletteCss` da `ACTIVE_PALETTE`, porque o bundle não passa pelo layout), `previews/*`, `shims/_shot.ts`.
- [ ] **Fechamento:** `node scripts/check-green.mjs` sai com 0. `npm run typecheck` e `npm run build` passam.

---

### Task 5: previews do design-sync importáveis pelo Next

**Files:**
- Modify: `next.config.js`
- Modify: `tsconfig.json`

- [ ] **Step 1:** Em `next.config.js`:

```js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { webpack }) {
    // O lab (/lab/revisao) renderiza os mesmos previews que vão ao Claude
    // Design. Eles importam do barrel "cbm-port", que aqui é o entry.tsx.
    config.resolve.alias["cbm-port"] = path.resolve(__dirname, ".design-sync/entry.tsx");
    // `_still` congela animação e adianta setTimeout para a foto do card. No
    // navegador isso atropelaria o resto da página: vira módulo vazio.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /previews[\\/]_still(\.ts)?$/,
        path.resolve(__dirname, "app/lab/revisao/_noop.ts"),
      ),
    );
    return config;
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2:** Em `tsconfig.json` `paths`: acrescentar `"cbm-port": ["./.design-sync/entry.tsx"]`.
- [ ] **Step 3:** Criar `app/lab/revisao/_noop.ts` com `export {};` e o comentário dizendo de onde é usado.
- [ ] **Step 4:** `npm run typecheck` sem erro novo.
- [ ] **Step 5: Commit** junto com a Task 6.

---

### Task 6: `/lab/revisao`

**Files:**
- Create: `app/lab/revisao/page.tsx` (client: monta a barra e as seções)
- Create: `app/lab/revisao/PaletteBar.tsx`
- Create: `app/lab/revisao/Item.tsx`
- Create: `app/lab/revisao/registry.ts`
- Create: `app/lab/revisao/sections/{Colors,Previews,Scene,Posts}.tsx`

**Interfaces:**
- Consumes: `PALETTES`, `TOKENS`, `applyPalette`, `PALETTE_EVENT`, `contrastRatio`, `cbm` (Task 1).
- `usePalette(): [PaletteId, (id: PaletteId) => void]`, em `PaletteBar.tsx`. Persiste em `localStorage["cbm-lab-palette"]` (com try/catch), chama `applyPalette`, e no unmount chama `applyPalette(null)` para não vazar para outras rotas na navegação do cliente.
- `<Item id="B-01" name="MeshButton · Canonico" width?>`: moldura com um rótulo mono pequeno no canto (`id · nome`), borda `cbm("border")` e conteúdo livre.
- `registry.ts`: `PREVIEW_GROUPS: { id: "B" | "C"; title: string; entries: { name: string; mod: Record<string, unknown>; wide?: boolean }[] }[]`, com `import * as X from "@/.design-sync/previews/X"`.
  - **B (Botões):** MeshButton, LpCta, CaseLiveButton, CaseBackButton, WhatsAppFab.
  - **C (Componentes):** todos os outros previews de `.design-sync/previews/`, exceto `_fixtures`, `_still` e os que estão em B. `wide: true` para seções inteiras (SiteHeader, Lp*, Case*, ProjetosGallery).
  - Os IDs são sequenciais por grupo, contando cada variante exportada que for função (`B-01`, `B-02`, …), na ordem do registro. Ordem estável: a mesma variante mantém o mesmo ID entre recarregamentos.

**Seções:**
1. **Cores (`K-`)**: para a paleta ativa, a grade de amostras de `SURFACE_TOKENS`, `GRAY_TOKENS`, `SUPPORT_TOKENS` e `FIXED_TOKENS`, cada uma com o nome do token e o hex. Os cinzas mostram também o contraste contra `base` e `surface`, com selo `AAA` (≥7), `AA` (≥4.5), `AA grande` (≥3) ou `—`. Embaixo, uma tabela comparando as 4 paletas lado a lado (as 12 superfícies).
2. **Botões (`B-`)** e 3. **Componentes (`C-`)**: `Previews` itera o grupo e renderiza `<Item>` por variante. Um erro de render em uma variante não derruba a página: um error boundary por `Item` mostra a mensagem no lugar.
4. **Cena 3D (`S-`)**: `S-01 TerrainMesh` e `S-02 FooterLandscape`, via `next/dynamic` com `ssr: false`, numa caixa de 480px de altura, com `key={paletteId}` para remontar na troca.
5. **Posts (`P-`)**: para cada carrossel (`apresentacao`, `importancia`, `projeto`, `machado`), importar `SLIDES`, `SLIDE_W` e `SLIDE_H` e renderizar cada slide em escala 0.25 (`transform: scale(.25)`, caixa 270×337,5), com ID `P-<carrossel>-<n>`.

**Barra fixa (topo, z-50):** botões das 4 paletas com label e `note`, a ativa marcada em vermelho, mais a âncora para cada seção. Fundo `cbm("page", 0.9)` com blur.

- [ ] **Step 1:** Criar `_noop.ts`, `Item.tsx`, `PaletteBar.tsx` e `registry.ts`.
- [ ] **Step 2:** Criar as seções e a `page.tsx`.
- [ ] **Step 3: Verificar no navegador** (`npm run dev`, `/lab/revisao`):
  - todas as seções renderizam, sem erro no console além dos avisos que já existem;
  - trocar para Neutro muda o fundo, os cards, os botões, a cena 3D e os posts;
  - ao sair para `/` pela navegação do cliente, a home volta à paleta Atual;
  - `node scripts/check-green.mjs` continua passando.
- [ ] **Step 4: Commit** Tasks 5 e 6 juntas, com a mensagem `feat(lab): /lab/revisao com troca de paleta ao vivo`.

---

### Task 7: atualizar a spec

- [ ] Na spec, a seção 4 "Botões" vira: "estados vistos ao vivo (hover/foco reais). Estados forçados ficam para a spec do sistema de botões". Também registrar que os componentes do lab vêm dos previews do design-sync. Commit.

---

## Depois deste plano (fora dele, depende da revisão)

1. O Matheus escolhe a paleta no lab, e `ACTIVE_PALETTE` muda (uma linha).
2. A revisão por ID gera ajustes pontuais e, se for o caso, a spec do sistema de botões.
3. `DESIGN-LANGUAGE.md` e `docs/10-design-system.md` são atualizados.
4. Envio ao Claude Design com `/design-sync`, antes de 14/12/2026.
