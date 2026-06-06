# Spec — Refactor da página de Case (Device Showcase)

**Data:** 2026-06-06
**Escopo:** `/cases/[slug]` (validado com `machado-plataformas`)
**Objetivo:** UX/UI impecáveis e técnicas, mostrando o **máximo do site (desktop + responsivo)** de forma **clara e organizada**, coeso com a identidade premium/triangulada do Coded by M.

## Contexto

A página de case hoje é editorial **estática**: `CaseHero` (texto + colagem de 5 imagens), `CaseOverview` (texto + bloco "Desafio"), `CaseGallery` (grade de 5), `CaseReturnCTA`. Sem movimento, sem device frames, sem a estética triangulada/WebGL do resto do site — visualmente inconsistente com a Home.

Já existem assets reais em `public/cases/machado/`: `desktop-tall.webp` (home full-page desktop), `mobile-tall.webp` (home full-page mobile), `hero-1..5.webp` e `gallery-1..5.webp` (10 recortes de seção, desktop).

## Direção

**Abordagem A — Device Showcase:** o site aparece dentro de **molduras de device** (browser + celular) com **scroll vivo**, intercalado com os recortes de tela em grade triangulada, tudo com **reveals no scroll** e toques da marca (signal-red, brackets, mesh triangulado sutil). Mistura equilibrada de movimento/craft + toque 3D + apresentação técnica. **Sem** métricas, processo, depoimento ou antes/depois (mantém o template consistente entre todos os cases).

## Estrutura da página (template, top → bottom)

1. **Hero** — esquerda: eyebrow `03 / CASE STUDY`, título, descrição, `ProjectFacts` (cliente·setor·tipo·ano), cue "ver o case ↓". Direita: `BrowserFrame` com `LiveScreenshot(desktop-tall)` rolando. Mesh triangulado sutil atrás (toque 3D).
2. **Visão geral** — `heading` + `body` (texto editorial) + bloco "Desafio". Mesmo conteúdo de hoje, refinado, com `Reveal`.
3. **As telas (desktop)** — `hero-1..5` + `gallery-1..5` em **grade triangulada assimétrica** de painéis emoldurados, com `Reveal` em stagger.
4. **Responsivo** — `PhoneFrame` com `LiveScreenshot(mobile-tall)` rolando, label "Responsivo". (Hoje só há 1 asset mobile; layout aceita mais telas depois.)
5. **Voltar** — `CaseReturnCTA` refinado → `/`.

## Componentes

### Primitivos (novos, `components/case/`)
- **`BrowserFrame`** — moldura de browser: barra ~36px (`#0E1810`, borda `#F5F2ED`/15), 3 dots (1 em signal-red), pill de URL (bg off-white/8, domínio em Satoshi). Corpo em overflow-hidden. Sombra + bracket triangular vermelho no canto. Props: `children`, `url?`.
- **`PhoneFrame`** — bezel arredondado (radius ~32px, borda escura ~8px), dica de notch, sombra. Props: `children`.
- **`LiveScreenshot`** — `<img>` da screenshot tall que rola sozinha (translateY 0→−X%→0, ~35s, ease-in-out, infinito), overflow-hidden, **onError → placeholder triangulado**. Pausa em `prefers-reduced-motion`. Props: `src`, `alt`, `fallback?`. Componente **novo**, baseado no padrão de scroll do preview do card (`ProjectCard`); o card **não é refatorado** agora (pode adotar o `LiveScreenshot` depois, sem pressa).
- **`Reveal`** — wrapper de entrada no scroll: fade + sobe (24px→0) + blur 6px→0 via IntersectionObserver (threshold ~0.2), `power3.out`, ~0.7s, com `delay?` pra stagger. Respeita reduced-motion (set instantâneo). Props: `children`, `delay?`.

### Seções
- **`CaseHero`** *(refatora)* — esquerda texto/meta; direita `BrowserFrame` + `LiveScreenshot(desktop-tall)`. Entrada: texto cascateia (eyebrow→título→desc→facts) + frame fade/scale. Mesh triangulado sutil atrás.
- **`CaseOverview`** *(refina)* — mesmo conteúdo + `Reveal` + tipografia trabalhada.
- **`CaseScreens`** *(novo)* — seção 3; `hero-*` + `gallery-*` em grade triangulada com `Reveal` stagger; cada painel emoldurado com brackets. Funde a antiga `CaseGallery`.
- **`CaseResponsive`** *(novo)* — seção 4; `PhoneFrame` + `LiveScreenshot(mobile-tall)` + label.
- **`CaseReturnCTA`** *(refina)* — mesma função, visual + `Reveal`.

### Removidos/fundidos
- `CaseHeroCollage` — substituído pelo `BrowserFrame` no hero.
- `CaseGallery` — fundido em `CaseScreens` (o dado `gallery` continua usado).

## Movimento + visual

- **Scroll vivo:** ~35s, ease-in-out, infinito; pausa em reduced-motion.
- **Reveal:** fade+rise+blur, IntersectionObserver, `power3.out` ~0.7s, stagger 0.1s na grade.
- **Triangulado/signal-red:** eyebrows com barra vermelha+label; brackets HUD nos cantos de frames/painéis; divisores com marcador triangular; grade assimétrica.
- **Toque 3D:** `TerrainBackground` reusado atrás do hero, opacity ~0.12 (sutil, sem competir com os screenshots).
- **Entrada na página:** fade-in suave ao abrir o case.

## Dados & degradação

- **Dado:** adiciona `siteUrl?: string` ao `CaseProject` (pill de URL). Demais campos já existem.
- **Degradação:**
  - Sem `preview` → hero/responsivo caem em placeholder triangulado (sem frame vazio).
  - `heroImages`/`gallery` vazios → `CaseScreens` mostra só o que tem (ou some se zero).
  - Imagem 404 → onError → placeholder (nunca quebra).
  - Case "coming-soon" (gerado por `generateStaticParams`, não linkado) → renderiza texto + placeholders, sem seções vazias.
- **Responsividade da página:** hero split empilha no mobile; frames encolhem; grade → 1 coluna.

## Escopo de arquivos

- **Novos:** `components/case/BrowserFrame.tsx`, `PhoneFrame.tsx`, `LiveScreenshot.tsx`, `Reveal.tsx`, `CaseScreens.tsx`, `CaseResponsive.tsx`.
- **Modificados:** `CaseHero.tsx`, `CaseOverview.tsx`, `CaseReturnCTA.tsx`, `app/cases/[slug]/page.tsx`, `types/case.ts` (+`siteUrl`), `data/cases.ts` (+`siteUrl` Machado).
- **Removidos:** `CaseHeroCollage.tsx`, `CaseGallery.tsx`.

## Verificação

- `tsc --noEmit` + lint (local).
- Usuário testa em `localhost:3000`: case Machado em desktop **e** viewport mobile; confirma que um case "coming-soon" não quebra. Playwright só sob pedido.

## Fora de escopo (depois)

- Wipe de transição entre rotas (`/` ↔ `/cases/[slug]`).
- Capturar telas mobile adicionais.
- Antes/depois, métricas, processo, depoimento.
