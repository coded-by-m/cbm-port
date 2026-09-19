# Site novo — Fase 1: Fundação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preparar a fundação técnica do site novo — fontes auto-hospedadas, dados extraídos para `data/`, metadata de produção e controle de indexação — sem alterar nenhum pixel do que existe hoje.

**Architecture:** Seis tarefas independentes entre si, cada uma commitável sozinha. Nenhuma delas cria rota nova nem muda comportamento visual: são pré-requisitos que a Fase 2 (home + landings) vai consumir. O site continua funcionando idêntico em todos os commits.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, fontes Panchang + Satoshi (Fontshare).

**Spec:** `docs/superpowers/specs/2026-09-19-site-novo-e-landings-design.md`

## Global Constraints

- **Visual-neutro.** Nenhuma tarefa desta fase pode mudar a aparência de nenhuma página. Se algo mudar visualmente, é bug.
- **Não existe test runner no projeto.** `package.json` tem apenas `dev`, `build`, `start`, `lint`, `typecheck` — sem jest, vitest ou playwright. Esta fase é feita de mover arquivo, extrair constante e escrever config; não há lógica nova para testar em unidade. **A verificação de cada tarefa é:** `npm run typecheck` + `npm run lint` + `npm run build` passando, mais uma checagem no navegador quando a tarefa toca renderização. Não invente framework de teste — instalar um é decisão de escopo que não foi aprovada.
- **Não mover `app/page.tsx` nesta fase.** A troca da `/` acontece na Fase 2, atômica com a chegada da home nova. Mover agora deixaria a `/` quebrada ou duplicada entre commits.
- **A `/experiencia` ainda não existe nesta fase.** Não listar no sitemap.
- Cores: `base #000F08`, `white #F5F2ED`, `signal #FB3640`. Fontes: Panchang (display), Satoshi (body).
- Commitar direto na `main`, sem branch, um commit por tarefa.

## File Structure

| Arquivo | Responsabilidade | Tarefa |
|---|---|---|
| `components/ui/Reveal.tsx` | Animação de entrada no scroll (movido de `components/case/`) | 1 |
| `data/process.ts` | As 4 etapas do processo — fonte única | 2 |
| `data/about.ts` | Manifesto, fundador, localização e os 3 valores — fonte única | 3 |
| `public/fonts/*.woff2` | 8 arquivos de fonte auto-hospedados | 4 |
| `app/globals.css` | Ganha os 8 blocos `@font-face` | 4 |
| `app/layout.tsx` | Perde o `<link>` do Fontshare, ganha preload e metadata de produção | 4, 5 |
| `lib/site.ts` | URL canônica do site — fonte única | 5 |
| `app/robots.ts` | Regras de indexação | 6 |
| `app/sitemap.ts` | Rotas públicas | 6 |

---

### Task 1: Mover `Reveal` para `components/ui/`

`Reveal` nunca foi específico de case — é uma animação de entrada genérica. A Fase 2 vai usá-lo na home e nas landings, então ele precisa sair de `components/case/` antes.

**Files:**
- Move: `components/case/Reveal.tsx` → `components/ui/Reveal.tsx`
- Modify: `components/case/CaseOverview.tsx:2`, `components/case/CaseResponsive.tsx:2`, `components/case/CaseReturnCTA.tsx:2`, `components/case/CaseScreens.tsx:2`, `components/case/CaseShowcase.tsx:2`

**Interfaces:**
- Consumes: nada
- Produces: `import { Reveal } from "@/components/ui/Reveal"` — componente client, props `{ children: ReactNode; delay?: number; className?: string }`. Fase 2 depende deste caminho.

- [ ] **Step 1: Mover o arquivo preservando histórico**

```bash
git mv components/case/Reveal.tsx components/ui/Reveal.tsx
```

- [ ] **Step 2: Confirmar que os 5 imports quebraram**

```bash
npm run typecheck
```

Esperado: FALHA, com 5 erros `Cannot find module '@/components/case/Reveal'` — um em cada arquivo listado acima. Se aparecerem menos de 5, algum import foi escrito de outra forma; rode `grep -rn "case/Reveal" components app` e corrija todos.

- [ ] **Step 3: Atualizar os 5 imports**

```bash
grep -rl '@/components/case/Reveal' components app \
  | xargs sed -i 's|@/components/case/Reveal|@/components/ui/Reveal|g'
```

- [ ] **Step 4: Verificar que passa**

```bash
npm run typecheck && npm run lint
```

Esperado: ambos passam, zero erro. Confirme também que não sobrou referência:

```bash
grep -rn "case/Reveal" components app
```

Esperado: nenhuma saída.

- [ ] **Step 5: Commit**

```bash
git add -A components/case components/ui
git commit -m "refactor(ui): move Reveal de components/case para components/ui

Reveal nunca foi especifico de case — e uma animacao de entrada generica.
A home nova e as landings vao consumi-lo, entao ele sai de case/ antes.
Comportamento inalterado.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Extrair `data/process.ts`

O copy das 4 etapas está hardcoded dentro de `ProcessSection.tsx`. A home nova e as landings vão mostrar as mesmas etapas — extrair impede que divirjam.

**Files:**
- Create: `data/process.ts`
- Modify: `components/zones/ProcessSection/ProcessSection.tsx` (remove a `interface Step` e a const `STEPS`, passa a importar)

**Interfaces:**
- Consumes: nada
- Produces: `import { PROCESS_STEPS, type ProcessStep } from "@/data/process"` — `ProcessStep = { num: string; title: string; desc: string }`, `PROCESS_STEPS: ProcessStep[]` com 4 itens. Fase 2 (bloco Processo da home e "Como funciona" da landing) depende destes nomes.

- [ ] **Step 1: Criar o arquivo de dados**

Crie `data/process.ts` com exatamente este conteúdo — o copy é copiado literalmente de `ProcessSection.tsx`, sem reescrever nada:

```ts
/**
 * As 4 etapas do processo da Coded by M.
 *
 * Fonte única: consumido pela zona Processo da experiência (/experiencia),
 * pelo bloco Processo da home e pelo "Como funciona" das landings de campanha.
 * Não duplique este copy em componente.
 */

export interface ProcessStep {
  /** Numeração visível. Ex: "01". */
  num: string;
  title: string;
  desc: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Estratégia",
    desc: "Antes de desenhar, entender. Diagnóstico, escopo e posicionamento.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Forma com intenção. Arquitetura, identidade e protótipo.",
  },
  {
    num: "03",
    title: "Código",
    desc: "Construído pra durar. Implementação, performance e qualidade.",
  },
  {
    num: "04",
    title: "Resultado",
    desc: "Não acaba no deploy. Mensuração, ajustes e evolução.",
  },
];
```

- [ ] **Step 2: Conferir que o copy bate caractere a caractere**

```bash
grep -E 'desc: "' data/process.ts
grep -E 'desc: "' components/zones/ProcessSection/ProcessSection.tsx
```

Esperado: as 4 linhas `desc:` idênticas entre os dois arquivos. Se divergirem (acento, reticência, travessão), corrija `data/process.ts` para bater com o original — **o original é a verdade**.

- [ ] **Step 3: Fazer `ProcessSection.tsx` consumir os dados**

Em `components/zones/ProcessSection/ProcessSection.tsx`:

1. Apague o bloco `interface Step { num: string; title: string; desc: string }` e a const `const STEPS: Step[] = [ ... ]` inteira (as 4 entradas).
2. Acrescente, junto aos outros imports do topo do arquivo:

```ts
import { PROCESS_STEPS, type ProcessStep } from "@/data/process";
```

3. Substitua os usos. O componente referencia `STEPS` e o tipo `Step`; troque por `PROCESS_STEPS` e `ProcessStep`:

```bash
sed -i 's/\bSTEPS\b/PROCESS_STEPS/g; s/\bStep\b/ProcessStep/g' \
  components/zones/ProcessSection/ProcessSection.tsx
```

Depois do `sed`, **leia o arquivo** e confira que ele não trocou nada indesejado — `Step` é uma palavra curta e pode aparecer dentro de outro identificador. Reverta manualmente qualquer substituição errada.

- [ ] **Step 4: Verificar**

```bash
npm run typecheck && npm run lint && npm run build
```

Esperado: os três passam. Depois, `npm run dev`, abra `http://localhost:3000`, navegue até o capítulo **Processo** e confira que as 4 etapas aparecem com o mesmo texto e o mesmo layout de antes.

- [ ] **Step 5: Commit**

```bash
git add data/process.ts components/zones/ProcessSection/ProcessSection.tsx
git commit -m "refactor(data): extrai as 4 etapas do processo para data/process.ts

O copy estava hardcoded em ProcessSection. A home nova e as landings vao
mostrar as mesmas etapas — fonte unica impede que divirjam.
Sem mudanca visual.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Extrair `data/about.ts`

Mesma razão da Task 2: o manifesto, o bloco do fundador e os 3 valores estão hardcoded em `AboutSection.tsx` e a home nova vai repeti-los.

**Files:**
- Create: `data/about.ts`
- Modify: `components/zones/AboutSection/AboutSection.tsx` (remove a const `VALUES` e os literais de manifesto/fundador/localização)

**Interfaces:**
- Consumes: nada
- Produces: `import { ABOUT, VALUES, type Value } from "@/data/about"` — `ABOUT = { manifesto: string; founder: { name: string; role: string; bio: string }; location: string }` e `VALUES: Value[]` com `Value = { title: string; desc: string }`. Fase 2 (bloco Sobre da home) depende destes nomes.

- [ ] **Step 1: Criar o arquivo de dados**

Crie `data/about.ts`. O copy é copiado literalmente de `AboutSection.tsx` (manifesto na `<h2 id="about-headline">`, bloco do fundador, localização, e a const `VALUES`):

```ts
/**
 * Conteúdo da seção Sobre da Coded by M.
 *
 * Fonte única: consumido pela zona Sobre da experiência (/experiencia) e pelo
 * bloco Sobre da home. Não duplique este copy em componente.
 */

export interface Value {
  title: string;
  desc: string;
}

export const ABOUT = {
  manifesto:
    "A Coded by M une design, tecnologia e pensamento estrutural pra construir uma presença digital à altura da empresa por trás dela.",
  founder: {
    name: "Matheus Mendes",
    role: "Fundador · Coded by M",
    bio: "Formado em Análise e Desenvolvimento de Sistemas, encontrei no web design o ponto onde técnica e estética se encontram. A Coded by M é onde levo isso a sério — cada projeto, uma busca por uma presença digital tão boa quanto a empresa por trás dela.",
  },
  location: "Florianópolis, Brasil",
} as const;

export const VALUES: Value[] = [
  { title: "Precisão", desc: "Cada pixel tem razão de existir." },
  { title: "Elegância", desc: "Sofisticação que não precisa gritar." },
  { title: "Detalhismo", desc: "O acabamento é o produto." },
];
```

- [ ] **Step 2: Fazer `AboutSection.tsx` consumir os dados**

Em `components/zones/AboutSection/AboutSection.tsx`:

1. Apague a const `VALUES` do topo do arquivo (as 3 entradas).
2. Acrescente junto aos imports:

```ts
import { ABOUT, VALUES } from "@/data/about";
```

3. Substitua os quatro literais de texto pelas referências. No JSX:
   - O texto dentro da `<h2 id="about-headline">` vira `{ABOUT.manifesto}`
   - `Matheus Mendes` vira `{ABOUT.founder.name}`
   - `Fundador · Coded by M` vira `{ABOUT.founder.role}`
   - O parágrafo da bio vira `{ABOUT.founder.bio}`
   - `Florianópolis, Brasil` vira `{ABOUT.location}`

Não mexa em nenhuma `className` nem em nenhum `style` — só o conteúdo textual sai.

- [ ] **Step 3: Confirmar que nenhum literal ficou para trás**

```bash
grep -nE "Matheus Mendes|Florianópolis, Brasil|pensamento estrutural|Análise e Desenvolvimento" \
  components/zones/AboutSection/AboutSection.tsx
```

Esperado: nenhuma saída. Se aparecer algo, ainda há copy hardcoded — troque pela referência.

- [ ] **Step 4: Verificar**

```bash
npm run typecheck && npm run lint && npm run build
```

Esperado: os três passam. Depois, `npm run dev`, navegue até o capítulo **Sobre** e confira que manifesto, nome, cargo, bio, localização e os 3 valores aparecem idênticos.

- [ ] **Step 5: Commit**

```bash
git add data/about.ts components/zones/AboutSection/AboutSection.tsx
git commit -m "refactor(data): extrai manifesto, fundador e valores para data/about.ts

Mesma razao do process.ts: a home nova repete este copy e fonte unica
impede divergencia. Sem mudanca visual.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Auto-hospedar as fontes

**É a tarefa de maior impacto da fase.** Hoje `layout.tsx` carrega Panchang e Satoshi por um `<link rel="stylesheet">` apontando para `api.fontshare.com`, com 7 pesos de Panchang e 4 de Satoshi. É um stylesheet de terceiro que bloqueia a renderização: antes do primeiro pixel, o navegador resolve DNS, negocia TLS, baixa o CSS e só então descobre quais arquivos buscar.

**Por que `@font-face` manual e não `next/font/local`:** existem **123 usos de `fontFamily: "Panchang"` / `"Satoshi"` inline em 28 arquivos**. `next/font/local` gera um nome de família com hash, o que quebraria todos os 123 de uma vez. O `@font-face` manual preserva os nomes literais e é visual-neutro — que é a restrição desta fase.

**Files:**
- Create: `public/fonts/` com 8 arquivos `.woff2`
- Modify: `app/globals.css` (acrescenta os `@font-face` no topo)
- Modify: `app/layout.tsx` (remove o `<link>` do Fontshare e o `preconnect`; acrescenta 3 `<link rel="preload">`)
- Modify: `components/case/CaseHero.tsx:76`, `components/case/CaseReturnCTA.tsx:20` (`font-black` → `font-extrabold`)

**Interfaces:**
- Consumes: nada
- Produces: as famílias `"Panchang"` (pesos 500, 600, 700, 800) e `"Satoshi"` (pesos 300, 400, 500, 700) disponíveis globalmente pelos mesmos nomes de hoje. Nenhum consumidor muda.

- [ ] **Step 1: Baixar os 8 arquivos de fonte**

Os pesos foram escolhidos a partir do uso real no código: Panchang cobre `h3` (500), `h2`/`ui` (600), `h1` (700) e `display` (800); Satoshi cobre `body-sm`/`body-lg` (300), `body` (400), `label`/`ui` (500) e negrito (700).

```bash
mkdir -p public/fonts
for w in 500 600 700 800; do
  url=$(curl -s "https://api.fontshare.com/v2/css?f%5B%5D=panchang@$w" \
        | grep -oE "//cdn\.fontshare\.com/[^']+\.woff2" | head -1)
  curl -s "https:$url" -o "public/fonts/Panchang-$w.woff2"
done
for w in 300 400 500 700; do
  url=$(curl -s "https://api.fontshare.com/v2/css?f%5B%5D=satoshi@$w" \
        | grep -oE "//cdn\.fontshare\.com/[^']+\.woff2" | head -1)
  curl -s "https:$url" -o "public/fonts/Satoshi-$w.woff2"
done
ls -la public/fonts/
```

Esperado: 8 arquivos, cada um entre ~15 KB e ~60 KB. **Se algum sair com menos de 5 KB, o download falhou** (provavelmente uma página de erro em vez do binário) — apague e repita esse peso.

- [ ] **Step 2: Declarar os `@font-face`**

No **topo** de `app/globals.css`, antes das diretivas `@tailwind`, insira:

```css
/* Fontes auto-hospedadas — substituem o stylesheet bloqueante do Fontshare.
   Os nomes de família são os literais "Panchang" e "Satoshi" de propósito:
   existem 123 usos de fontFamily inline no código que dependem deles. */
@font-face { font-family: "Panchang"; src: url("/fonts/Panchang-500.woff2") format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: "Panchang"; src: url("/fonts/Panchang-600.woff2") format("woff2"); font-weight: 600; font-style: normal; font-display: swap; }
@font-face { font-family: "Panchang"; src: url("/fonts/Panchang-700.woff2") format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: "Panchang"; src: url("/fonts/Panchang-800.woff2") format("woff2"); font-weight: 800; font-style: normal; font-display: swap; }
@font-face { font-family: "Satoshi"; src: url("/fonts/Satoshi-300.woff2") format("woff2"); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: "Satoshi"; src: url("/fonts/Satoshi-400.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: "Satoshi"; src: url("/fonts/Satoshi-500.woff2") format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: "Satoshi"; src: url("/fonts/Satoshi-700.woff2") format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }
```

- [ ] **Step 3: Trocar o `<link>` do Fontshare por preloads**

Em `app/layout.tsx`, **apague** o bloco inteiro do `<head>` (o `<link rel="preconnect">` e o `<link rel="stylesheet">` do Fontshare) e coloque no lugar:

```tsx
<head>
  <link rel="preload" href="/fonts/Satoshi-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  <link rel="preload" href="/fonts/Panchang-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  <link rel="preload" href="/fonts/Panchang-800.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
</head>
```

Só três preloads, de propósito: são os pesos que aparecem na primeira dobra. Precarregar os oito desperdiçaria banda justamente no momento crítico. O `crossOrigin="anonymous"` é obrigatório mesmo sendo mesma origem — sem ele o preload não casa com a requisição que a fonte faz, e o arquivo é baixado duas vezes.

- [ ] **Step 4: Corrigir os dois `font-black`**

`font-black` é peso 900 e **não existe em nenhuma das duas famílias** — hoje o navegador sintetiza a partir do 800. Tornar explícito:

```bash
sed -i 's/font-display font-black/font-display font-extrabold/' \
  components/case/CaseHero.tsx components/case/CaseReturnCTA.tsx
grep -rn "font-black" components app
```

Esperado do `grep`: nenhuma saída.

- [ ] **Step 5: Verificar que o Fontshare sumiu e o visual não mudou**

```bash
grep -rn "fontshare" app components
npm run typecheck && npm run lint && npm run build
```

Esperado do `grep`: nenhuma saída. Os três comandos passam.

Depois, `npm run dev` e, com o DevTools aberto na aba **Network**, filtrando por `Font`:
1. Recarregue `http://localhost:3000` com cache desabilitado.
2. Esperado: **nenhuma requisição para `fontshare.com`**, e os arquivos `.woff2` vindo de `localhost`.
3. Compare o hero, os títulos de capítulo e o corpo com uma aba aberta na versão anterior (`git stash` + reload, se precisar). Os dois `font-black` de case podem ficar um fio menos encorpados, porque a síntese do navegador desaparece — confira em `/cases/mj-engenharia` e confirme que está aceitável.

- [ ] **Step 6: Commit**

```bash
git add public/fonts app/globals.css app/layout.tsx components/case/CaseHero.tsx components/case/CaseReturnCTA.tsx
git commit -m "perf(fonts): auto-hospeda Panchang e Satoshi, remove o Fontshare

O <link> do api.fontshare.com bloqueava a renderizacao com DNS + TLS + CSS
de terceiro antes do primeiro pixel. Agora sao 8 woff2 locais declarados em
@font-face, com preload dos 3 pesos da primeira dobra.

@font-face manual em vez de next/font/local de proposito: ha 123 usos de
fontFamily inline com os nomes literais Panchang/Satoshi, e next/font gera
nome com hash — quebraria todos.

font-black (900) nao existe em nenhuma das familias e estava sendo
sintetizado; virou font-extrabold (800), que e o que ja renderizava.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Metadata de produção

O `layout.tsx` ainda carrega o título placeholder `"Coded by M — Experience Lab"`, herdado da época em que o projeto era um laboratório. Não há `metadataBase`, então toda imagem de OG declarada com caminho relativo (as de `/projetos`) resolve errado quando compartilhada.

**Files:**
- Create: `lib/site.ts`
- Modify: `app/layout.tsx` (o objeto `metadata`)

**Interfaces:**
- Consumes: nada
- Produces: `import { SITE_URL, SITE_NAME } from "@/lib/site"` — `SITE_URL: string` (sem barra final), `SITE_NAME: string`. Fase 2 (metadata da home e das landings, `robots.ts`, `sitemap.ts`) depende destes nomes.

> **Confirmar com o dono do projeto antes de commitar:** o domínio `codedbym.com` foi tirado dos carrosséis de Instagram (`app/posts/apresentacao/slides.tsx:438`) e de `docs/11-home-wireframe.md`. Se o site ainda estiver num `.vercel.app`, ajuste o default — ou defina `NEXT_PUBLIC_SITE_URL` no ambiente, que o código já respeita.

- [ ] **Step 1: Criar `lib/site.ts`**

```ts
/**
 * Identidade do site — fonte única.
 *
 * SITE_URL é usada por metadataBase, robots.ts e sitemap.ts. Sem barra final:
 * o Next concatena os caminhos e duas barras quebram a URL canônica.
 * Sobrescrevível por ambiente (preview da Vercel, staging) sem editar código.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://codedbym.com"
).replace(/\/$/, "");

export const SITE_NAME = "Coded by M";
```

- [ ] **Step 2: Substituir o objeto `metadata` em `app/layout.tsx`**

Troque o `export const metadata` atual por:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Coded by M — Webdesign e websoftware sob medida",
    template: "%s · Coded by M",
  },
  description:
    "Estúdio de webdesign e websoftware em Florianópolis. Landing pages, sites institucionais e aplicações web construídos sob medida — do conceito ao site no ar.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    title: "Coded by M — Webdesign e websoftware sob medida",
    description:
      "Estúdio de webdesign e websoftware em Florianópolis. Landing pages, sites institucionais e aplicações web construídos sob medida.",
    images: ["/cases/machado/desktop-tall.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coded by M — Webdesign e websoftware sob medida",
    description:
      "Estúdio de webdesign e websoftware em Florianópolis. Landing pages, sites institucionais e aplicações web construídos sob medida.",
    images: ["/cases/machado/desktop-tall.webp"],
  },
};
```

E acrescente o import no topo:

```ts
import { SITE_URL, SITE_NAME } from "@/lib/site";
```

O `template: "%s · Coded by M"` faz `/projetos` — que já declara `title: "Projetos · Coded by M"` — ficar com o sufixo duplicado. Corrija em `app/projetos/page.tsx`: troque o `title` do `metadata` e do `openGraph`/`twitter` de `"Projetos · Coded by M"` para apenas `"Projetos"`.

- [ ] **Step 3: Confirmar que a imagem de OG existe**

```bash
ls -la public/cases/machado/desktop-tall.webp
```

Esperado: o arquivo existe. Se não existir, rode `ls public/cases/*/desktop-tall.webp` e use um que exista, ajustando as três ocorrências do caminho.

- [ ] **Step 4: Verificar**

```bash
npm run typecheck && npm run lint && npm run build
```

Esperado: os três passam. Depois, `npm run dev`, abra `http://localhost:3000` e confira no DevTools (aba Elements, dentro de `<head>`):
- `<title>` diz `Coded by M — Webdesign e websoftware sob medida`, não mais "Experience Lab".
- `<meta property="og:image">` tem URL **absoluta** começando com `https://codedbym.com`.

Abra também `http://localhost:3000/projetos` e confirme que o `<title>` é `Projetos · Coded by M` — uma vez só, sem duplicar o sufixo.

- [ ] **Step 5: Commit**

```bash
git add lib/site.ts app/layout.tsx app/projetos/page.tsx
git commit -m "feat(seo): metadata de producao no layout root

Sai o placeholder \"Experience Lab\", entram titulo real com template,
description, metadataBase e OG/Twitter default. Sem metadataBase as imagens
de OG relativas resolviam errado ao compartilhar.

SITE_URL em lib/site.ts, sobrescrivivel por NEXT_PUBLIC_SITE_URL.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: `robots.ts`, `sitemap.ts` e `noindex` nas rotas internas

Hoje não existe nenhum controle de indexação. Na prática, `/posts/apresentacao`, `/posts/importancia`, `/posts/projeto`, `/lab` e `/ui-lab` são indexáveis — ou seja, os carrosséis de Instagram renderizados como página e os laboratórios internos podem entrar no índice do domínio.

**Files:**
- Create: `app/robots.ts`, `app/sitemap.ts`
- Modify: `app/lab/page.tsx`, `app/ui-lab/page.tsx`, `app/posts/apresentacao/[[...slug]]/page.tsx`, `app/posts/importancia/[[...slug]]/page.tsx`, `app/posts/projeto/[[...slug]]/page.tsx` (acrescenta `export const metadata` com `robots`)

**Interfaces:**
- Consumes: `SITE_URL` de `@/lib/site` (Task 5), `cases` de `@/data/cases`
- Produces: nada que tarefas posteriores consumam. A Fase 2 vai **acrescentar** `/experiencia` ao sitemap e `noindex` em `/lp/[segmento]`.

- [ ] **Step 1: Criar `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Rotas internas fora do índice: os laboratórios e os renderizadores de
 * carrossel de Instagram (que são ferramenta de produção, não conteúdo).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/lab", "/ui-lab", "/posts/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Criar `app/sitemap.ts`**

Só as rotas públicas de hoje. **`/experiencia` ainda não existe** — quem a acrescenta é a Fase 2.

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cases } from "@/data/cases";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const caseRoutes = cases
    .filter((c) => c.status === "published")
    .map((c) => ({
      url: `${SITE_URL}/cases/${c.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projetos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...caseRoutes,
  ];
}
```

- [ ] **Step 3: Marcar as 5 rotas internas como `noindex`**

Em cada um destes arquivos — `app/lab/page.tsx`, `app/ui-lab/page.tsx`, `app/posts/apresentacao/[[...slug]]/page.tsx`, `app/posts/importancia/[[...slug]]/page.tsx`, `app/posts/projeto/[[...slug]]/page.tsx` — acrescente, depois dos imports:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

Se o arquivo **já exporta** `metadata`, não crie um segundo export: acrescente a chave `robots: { index: false, follow: false }` ao objeto existente. Se já importa `Metadata`, não duplique o import.

- [ ] **Step 4: Verificar**

```bash
npm run typecheck && npm run lint && npm run build
```

Esperado: os três passam. Depois, `npm run dev` e confira:

```bash
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml
```

Esperado do `robots.txt`: contém `Disallow: /lab`, `Disallow: /ui-lab`, `Disallow: /posts/` e a linha do `Sitemap:`.
Esperado do `sitemap.xml`: **8 URLs** — a raiz, `/projetos` e os 6 cases publicados. Nenhum `coming-soon`, nenhum `/lab`, nenhum `/posts`.

E confirme o `noindex` numa das rotas internas:

```bash
curl -s http://localhost:3000/lab | grep -i 'name="robots"'
```

Esperado: uma linha contendo `noindex`.

- [ ] **Step 5: Commit**

```bash
git add app/robots.ts app/sitemap.ts app/lab/page.tsx app/ui-lab/page.tsx app/posts
git commit -m "feat(seo): robots.ts, sitemap.ts e noindex nas rotas internas

O projeto nao tinha nenhum controle de indexacao: os carrosseis de Instagram
renderizados como pagina (/posts/*) e os laboratorios eram indexaveis.

Sitemap lista so as rotas publicas de hoje — / , /projetos e os 6 cases
publicados. /experiencia entra na fase 2.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Verificação final da fase

Depois das 6 tarefas, com tudo commitado:

- [ ] `npm run typecheck` — passa
- [ ] `npm run lint` — passa
- [ ] `npm run build` — passa
- [ ] `grep -rn "fontshare" app components` — sem saída
- [ ] `grep -rn "case/Reveal" components app` — sem saída
- [ ] `grep -rn "Experience Lab" app` — sem saída
- [ ] `curl -s localhost:3000/sitemap.xml` — 8 URLs
- [ ] Com o DevTools na aba Network filtrando `Font`: nenhuma requisição a terceiros
- [ ] A experiência em `/` navega pelos 9 capítulos igual a antes; Processo e Sobre com o mesmo texto
- [ ] `/projetos` e `/cases/mj-engenharia` inalteradas

## O que esta fase deixa pronto para a Fase 2

- `components/ui/Reveal.tsx` — a animação de entrada dos blocos da home e das landings.
- `data/process.ts` e `data/about.ts` — os dados dos blocos Processo e Sobre.
- Fontes locais e rápidas — o ganho de LCP que a landing de campanha precisa.
- `lib/site.ts` — a URL canônica que a metadata das novas rotas vai consumir.
- `robots.ts` e `sitemap.ts` — onde a Fase 2 acrescenta `/experiencia` e o `noindex` de `/lp/*`.

## Itens da spec que ficam explicitamente para a Fase 2

Não são esquecimento — cada um depende de algo que esta fase não cria:

| Item da spec | Por que não cabe aqui |
|---|---|
| Mover `app/page.tsx` → `app/experiencia/page.tsx` | A `/` ficaria quebrada ou duplicada entre commits. Acontece atômico com a chegada da home nova. |
| `WhatsAppFab` não renderizar em `/experiencia` | A rota ainda não existe. |
| `next/image` na `/` e nas `/lp/*` | As páginas ainda não existem. |
| Evento `Lead` no clique e UTM na mensagem do WhatsApp | Dependem dos CTAs das páginas novas. |
| Verificar ausência de `three` no bundle da `/` | Só faz sentido depois que a `/` deixar de ser a experiência. |
