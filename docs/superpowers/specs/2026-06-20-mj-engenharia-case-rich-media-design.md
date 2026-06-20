# MJ Engenharia — Case novo + página de projeto com mídia rica

**Data:** 2026-06-20
**Status:** Aprovado (design)

## Contexto

O usuário capturou o site entregue **MJ Engenharia** (landing de engenharia de
prevenção contra incêndio, projetos aprovados no CBMSC/SC) com o **Coded Atlas**.
O material vive em `coded-atlas/mj-engenharia/` e traz recursos que a página de
case atual (`/cases/[slug]`) ainda não comporta:

- Mockups 3D renderizados: `desktop-3d`, `mobile-3d`, `browser`, `phone`
- Vídeos de scroll: `desktop-scroll.webm`, `mobile-scroll.webm`
- 15 seções desktop + 16 mobile recortadas
- Composições sociais (1:1, 9:16, 16:9) — **fora de escopo** (são assets de marketing)
- Paleta da marca: off-white `#fbfcfd` + petróleo `#073b4c`/`#0b2a36`/`#2b3a40`
- Fontes do site: Montserrat, Inter, Barlow Condensed

**Site:** `mj-engenharia-flame.vercel.app` · **Cliente:** MJ Engenharia ·
**Setor:** Engenharia / Prevenção contra Incêndio · **Ano:** 2026 ·
**Tipo:** `landing`

## Objetivo

Adicionar o MJ Engenharia como case publicado e **expandir a página de projeto**
pra aproveitar mídia rica (vídeo de scroll real + showcase de mockups 3D), sem
alterar o comportamento dos 4 cases existentes. Todos os campos novos são
opcionais e retrocompatíveis.

## Pipeline de assets (`public/cases/mj-engenharia/`)

Conversão com **ffmpeg** (única ferramenta disponível; sem cwebp/sharp/magick).
Meta: ~25 MB de origem → ~4 MB servidos.

| Destino | Origem | Tratamento |
|---|---|---|
| `desktop-tall.webp` | `screenshots/desktop-fullpage.png` | → webp q≈82 |
| `mobile-tall.webp` | `screenshots/mobile-fullpage.png` | → webp q≈82 |
| `hero-1..3.webp` | 3 melhores seções desktop (hero, soluções, segmentos) | → webp |
| `section-01..NN.webp` | ~6–8 seções desktop curadas (não as 15 cruas) | → webp |
| `mockup-desktop-3d.webp` | `mockups/desktop-3d.png` | → webp (preserva alpha) |
| `mockup-mobile-3d.webp` | `mockups/mobile-3d.png` | → webp (preserva alpha) |
| `mockup-browser.webp` | `mockups/browser.png` | → webp |
| `mockup-phone.webp` | `mockups/phone.png` | → webp |
| `scroll-desktop.webm` | `videos/desktop-scroll.webm` | recomprimir → ~1.5 MB |
| `scroll-mobile.webm` | `videos/mobile-scroll.webm` | recomprimir → ~1.5 MB |
| `cover.webp` | `thumbnails/cover.webp` | copiar |

WebP preserva transparência — os mockups 3D têm fundo transparente, então a
flag de alpha é obrigatória na conversão deles.

## Tipo `CaseProject` — campos novos (opcionais)

Em `types/case.ts`:

```ts
export interface CaseMockups {
  desktop3d?: string;
  mobile3d?: string;
  browser?: string;
  phone?: string;
}

export interface CaseVideo {
  /** .webm de scroll desktop — toca no BrowserFrame do hero. */
  desktop?: string;
  /** .webm de scroll mobile — toca no PhoneFrame do Responsivo. */
  mobile?: string;
}

// adicionados a CaseProject:
mockups?: CaseMockups;
video?: CaseVideo;
/** Recortes de seção pra grade "As Telas" (além de hero/gallery). */
sections?: string[];
/** Cores da marca capturada — tingem o gradiente do Showcase. */
palette?: string[];
```

## Componentes

### `CaseHero` (editado)
Quando `project.video?.desktop` existir, renderiza
`<video autoplay muted loop playsinline preload="metadata" poster={preview.desktop}>`
dentro do `BrowserFrame`, no lugar do `LiveScreenshot`. Sob
`prefers-reduced-motion`, não toca: mostra o `poster`/`desktop-tall` estático.
Sem vídeo, mantém o comportamento atual (LiveScreenshot). Extraído num pequeno
helper `CaseFrameMedia` pra reuso no Responsivo.

### `CaseShowcase` (novo)
Seção dedicada aos mockups 3D — o "momento herói" da página. Layout:
`mockup-desktop-3d` grande e centrado, com `mockup-mobile-3d` sobreposto no
canto inferior, sobre um gradiente radial sutil derivado de `palette` (tons
petróleo). Eyebrow "Mockups" no padrão visual das outras seções (traço vermelho
+ uppercase tracking). Entrada via `Reveal`. Some se `project.mockups` ausente.
Aparece entre `CaseOverview` e `CaseScreens`.

### `CaseScreens` (editado)
Passa a concatenar `project.sections` em `shots`
(`[...heroImages, ...sections, ...gallery]`). Sem `sections`, comportamento
idêntico ao atual.

### `CaseResponsive` (editado)
Quando `project.video?.mobile` existir, toca o `.webm` no `PhoneFrame` via o
mesmo helper `CaseFrameMedia` (autoplay/muted/loop/playsinline + fallback
reduced-motion). Sem vídeo, mantém o `LiveScreenshot` atual.

## Ordem da página (`app/cases/[slug]/page.tsx`)

```
CaseBackButton
CaseHero        (vídeo desktop)
CaseOverview
CaseShowcase    ← novo (mockups 3D)
CaseScreens     (hero + sections + gallery)
CaseResponsive  (vídeo mobile)
CaseReturnCTA
```

`CaseShowcase` é inserido condicionalmente; nos outros cases (sem `mockups`)
retorna `null` e a ordem fica idêntica à atual.

## Registro em `data/cases.ts`

Nova entrada `slug: "mj-engenharia"`, `type: "landing"`, `status: "published"`,
com `meta`, `stack` (Montserrat + Inter + Barlow Condensed, Next.js, Tailwind,
Vercel), `heroImages`, `sections`, `gallery`, `mockups`, `video`, `palette`,
`preview` e `siteUrl: "mj-engenharia-flame.vercel.app"`. Copy (`overview`,
`description`, `challenge`) rascunhada a partir do conteúdo real do site —
prevenção contra incêndio, escopo técnico ponta a ponta, aprovação CBMSC,
segmentos atendidos — e revisada pelo usuário.

## Fora de escopo

- Composições sociais (assets de marketing, não de portfólio)
- Mudar o layout dos 4 cases existentes
- Otimização via `next/image` (a página usa `<img>` simples por padrão)

## Critérios de sucesso

1. `/cases/mj-engenharia` renderiza com vídeo no hero, showcase 3D, grade de
   seções e vídeo mobile no responsivo.
2. Reduced-motion não toca vídeo nenhum (mostra poster estático).
3. Os 4 cases existentes renderizam exatamente como antes.
4. Peso total dos assets do case ≲ 5 MB.
5. `npm run build` passa (lint + types).
