# Portfólio estático `/portfolio` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a rota `/portfolio` — uma landing page estática, legível em ~60 segundos, que reusa o design system existente e não duplica nenhum dado.

**Architecture:** Server Components por padrão em `app/portfolio/page.tsx`, compondo 6 blocos de `components/portfolio/`. Só o header e o hero são client (âncoras com scroll suave e uma timeline GSAP de entrada). O resto é HTML estático envolvido pelo `Reveal` (IntersectionObserver) que já existe. Nenhum import puxa `three` ou `@react-three/*`, então o code splitting do App Router mantém a stack WebGL fora do bundle dessa rota.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5.7, Tailwind 3.4, GSAP 3.12 (só no hero).

**Spec:** `docs/superpowers/specs/2026-08-11-portfolio-estatico-design.md`

## Global Constraints

- **Sem test runner no projeto.** `package.json` não tem framework de teste. A verificação de cada task é: `npm run typecheck`, `npm run lint` e inspeção da rota no browser (`npm run dev` → `http://localhost:3000/portfolio`). Não invente um test runner; não adicione dependências.
- **Paleta (tokens `cbm` do Tailwind):** `cbm-black #000F08`, `cbm-forest #070B08`, `cbm-white #F5F2ED`, `cbm-red #FB3640`.
- **Fontes:** `font-display` = Panchang, `font-body` = Satoshi. Já carregadas em `app/layout.tsx` via Fontshare. Não adicione `<link>` novo.
- **Idioma:** todo copy visível em português do Brasil.
- **Contato:** sempre via `lib/contact.ts` (`waLink()`, `INSTAGRAM_URL`, `INSTAGRAM_HANDLE`). Nunca hardcode número ou URL.
- **Zero WebGL:** nenhum arquivo em `components/portfolio/` nem `app/portfolio/` pode importar `three`, `@react-three/fiber`, `@react-three/drei`, ou qualquer coisa de `components/zones/` e `components/three/`.
- **Zero copy duplicado:** todo texto de projeto/serviço/processo/sobre vem de `data/`.
- **`prefers-reduced-motion: reduce`** desliga toda animação; o conteúdo aparece imediatamente.
- **Commits:** ao fim de cada task, mensagem em português, prefixo convencional (`feat:`, `refactor:`, `chore:`), terminando com:
  ```
  Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  ```

## Desvios conscientes em relação ao spec

Dois, ambos pequenos, para não introduzir dependências ou complexidade que o spec proíbe:

1. **`FEATURED_SLUG` fica exportado de `PortfolioHero.tsx`, mas quem resolve o projeto é a página (server).** O spec diz "constante no topo do componente, trocável em uma linha" — isso continua verdade. A diferença é que o `CaseProject` chega por prop, evitando que `data/cases.ts` inteiro (todo o copy dos 10 projetos) vá parar no bundle client só por causa de um projeto em destaque.

2. **A linha que conecta as etapas do Processo não se desenha com `scaleX`.** O spec pede "CSS puro dentro do `Reveal`", mas CSS sozinho não sabe quando o elemento entrou no viewport (`animation-timeline: view()` ainda não é suporte confiável), e o spec proíbe GSAP/ScrollTrigger fora do hero. A linha é estática e as 4 etapas entram em sequência com `Reveal` escalonado (`delay` de 0/80/160/240ms) — a leitura de progressão fica preservada.

## File Structure

**Criar:**

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `components/ui/Reveal.tsx` | client | (movido de `components/case/`) fade+slide+blur na entrada |
| `data/process.ts` | dados | as 4 etapas do método |
| `data/about.ts` | dados | statement, fundador, localização, 3 valores |
| `lib/portfolio.ts` | lib | `getPublishedCases()`, `frameLabel()` |
| `app/portfolio/page.tsx` | server | compõe os 6 blocos, exporta `metadata` |
| `components/portfolio/PortfolioHeader.tsx` | client | header fixo com âncoras |
| `components/portfolio/PortfolioHero.tsx` | client | primeira dobra + timeline GSAP |
| `components/portfolio/ProjectCard.tsx` | server | um card em `BrowserFrame` |
| `components/portfolio/ProjectGrid.tsx` | server | grade dos 6 publicados |
| `components/portfolio/ServicesList.tsx` | server | os 3 serviços |
| `components/portfolio/ProcessSteps.tsx` | server | as 4 etapas |
| `components/portfolio/AboutBlock.tsx` | server | statement + assinatura |
| `components/portfolio/ContactBlock.tsx` | server | fechamento |

**Modificar:**

| Arquivo | Mudança |
|---|---|
| `components/case/Reveal.tsx` | deletado (movido) |
| `components/case/CaseOverview.tsx`, `CaseResponsive.tsx`, `CaseReturnCTA.tsx`, `CaseScreens.tsx`, `CaseShowcase.tsx` | import do `Reveal` atualizado |
| `components/zones/ProcessSection/ProcessSection.tsx` | lê as etapas de `data/process.ts` |
| `components/zones/AboutSection/AboutSection.tsx` | lê copy de `data/about.ts` |
| `components/ui/WhatsAppFab.tsx` | não renderiza em `/portfolio` |

---

### Task 1: Mover `Reveal` para `components/ui/`

Ele nunca foi específico de case e agora tem dois consumidores. Comportamento idêntico — só muda o caminho.

**Files:**
- Create: `components/ui/Reveal.tsx`
- Delete: `components/case/Reveal.tsx`
- Modify: `components/case/CaseOverview.tsx:2`, `components/case/CaseResponsive.tsx:2`, `components/case/CaseReturnCTA.tsx:2`, `components/case/CaseScreens.tsx:2`, `components/case/CaseShowcase.tsx:2`

**Interfaces:**
- Produces: `Reveal({ children, delay?, className? })` de `@/components/ui/Reveal`. `delay` em ms, default `0`.

- [ ] **Step 1: Mover o arquivo preservando o histórico**

```bash
git mv components/case/Reveal.tsx components/ui/Reveal.tsx
```

- [ ] **Step 2: Atualizar os 5 imports**

Em cada um dos 5 arquivos, trocar a linha 2:

```tsx
import { Reveal } from "@/components/case/Reveal";
```

por:

```tsx
import { Reveal } from "@/components/ui/Reveal";
```

Arquivos: `components/case/CaseOverview.tsx`, `components/case/CaseResponsive.tsx`, `components/case/CaseReturnCTA.tsx`, `components/case/CaseScreens.tsx`, `components/case/CaseShowcase.tsx`.

- [ ] **Step 3: Verificar que nenhuma referência antiga sobrou**

Run: `grep -rn "components/case/Reveal" --include="*.tsx" --include="*.ts" .`
Expected: nenhuma saída.

- [ ] **Step 4: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam sem erro.

- [ ] **Step 5: Verificar que uma página de case ainda anima**

Run: `npm run dev`, abrir `http://localhost:3000/cases/machado-plataformas`, rolar.
Expected: as seções continuam entrando com fade + slide, igual a antes.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Reveal.tsx components/case/
git commit -m "refactor(ui): Reveal sai de case/ pra ui/

Ele nunca foi específico de case e agora tem um segundo consumidor
(a rota /portfolio). Comportamento inalterado.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Extrair copy do Processo e do Sobre para `data/`

O copy das 4 etapas está hardcoded em `ProcessSection.tsx` e o do Sobre em `AboutSection.tsx`. Extrair segue o padrão de `cases.ts`/`services.ts` e evita que a Home e o `/portfolio` divirjam. **Sem mudança visual na Home.**

**Files:**
- Create: `data/process.ts`
- Create: `data/about.ts`
- Modify: `components/zones/ProcessSection/ProcessSection.tsx:19-46`
- Modify: `components/zones/AboutSection/AboutSection.tsx:17-21`, `:246-292`

**Interfaces:**
- Produces (`@/data/process`): `interface ProcessStep { num: string; title: string; desc: string }`, `const PROCESS_STEPS: ProcessStep[]` (4 itens).
- Produces (`@/data/about`): `const ABOUT_STATEMENT: string`, `interface Founder { name: string; role: string; bio: string }`, `const FOUNDER: Founder`, `const LOCATION: string`, `interface AboutValue { title: string; desc: string }`, `const ABOUT_VALUES: AboutValue[]` (3 itens).

- [ ] **Step 1: Criar `data/process.ts`**

```ts
/**
 * As 4 etapas do método da Coded by M.
 *
 * Fonte única: consumido pela zona Processo da Home (jornada 3D) e pelo
 * bloco Processo da rota /portfolio. Mudar aqui muda nos dois.
 */

export interface ProcessStep {
  /** Numeração visível ("01".."04"). */
  num: string;
  title: string;
  /** Uma frase curta de método + uma de entregáveis. */
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

- [ ] **Step 2: Criar `data/about.ts`**

```ts
/**
 * Copy da seção Sobre.
 *
 * Fonte única: consumido pela zona Sobre da Home e pelo bloco Sobre da rota
 * /portfolio. Mudar aqui muda nos dois.
 */

/** Manifesto da marca — a headline do bloco Sobre. */
export const ABOUT_STATEMENT =
  "A Coded by M une design, tecnologia e pensamento estrutural pra construir uma presença digital à altura da empresa por trás dela.";

export interface Founder {
  name: string;
  role: string;
  bio: string;
}

export const FOUNDER: Founder = {
  name: "Matheus Mendes",
  role: "Fundador · Coded by M",
  bio: "Formado em Análise e Desenvolvimento de Sistemas, encontrei no web design o ponto onde técnica e estética se encontram. A Coded by M é onde levo isso a sério — cada projeto, uma busca por uma presença digital tão boa quanto a empresa por trás dela.",
};

export const LOCATION = "Florianópolis, Brasil";

export interface AboutValue {
  title: string;
  desc: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  { title: "Precisão", desc: "Cada pixel tem razão de existir." },
  { title: "Elegância", desc: "Sofisticação que não precisa gritar." },
  { title: "Detalhismo", desc: "O acabamento é o produto." },
];
```

- [ ] **Step 3: `ProcessSection.tsx` passa a ler de `data/process.ts`**

Remover o bloco das linhas 19–46 (a `interface Step` e a const `STEPS`) e adicionar o import junto dos outros no topo do arquivo:

```tsx
import { PROCESS_STEPS as STEPS } from "@/data/process";
```

O alias mantém o resto do arquivo (que usa `STEPS` em 8 lugares) intacto.

- [ ] **Step 4: `AboutSection.tsx` passa a ler de `data/about.ts`**

4a. Remover o bloco das linhas 17–21 (a const `VALUES`) e adicionar o import no topo:

```tsx
import {
  ABOUT_STATEMENT,
  ABOUT_VALUES as VALUES,
  FOUNDER,
  LOCATION,
} from "@/data/about";
```

4b. Na headline (linha ~247), trocar o texto literal pela constante:

```tsx
              {ABOUT_STATEMENT}
```

4c. No bloco do fundador, trocar os três literais:

```tsx
                {FOUNDER.name}
```

```tsx
                {FOUNDER.role}
```

```tsx
                {FOUNDER.bio}
```

4d. Na localização (linha ~291):

```tsx
                  {LOCATION}
```

- [ ] **Step 5: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam.

- [ ] **Step 6: Verificar que a Home não mudou visualmente**

Run: `npm run dev`, abrir `http://localhost:3000/lab` e navegar até as zonas Processo e Sobre (ou percorrer a Home até os capítulos 7 e 9).
Expected: as 4 etapas aparecem com o mesmo texto e a mesma animação; o Sobre mostra manifesto, "Matheus Mendes", "Fundador · Coded by M", a bio, "Florianópolis, Brasil" e os 3 valores — tudo idêntico a antes.

- [ ] **Step 7: Commit**

```bash
git add data/process.ts data/about.ts components/zones/ProcessSection/ProcessSection.tsx components/zones/AboutSection/AboutSection.tsx
git commit -m "refactor(data): copy do Processo e do Sobre sai pra data/

Segue o padrão de cases.ts e services.ts. A Home e a futura rota
/portfolio passam a ler da mesma fonte, sem risco de divergir.
Sem mudança visual.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `lib/portfolio.ts` — seleção de projetos e rótulo da barra

Duas regras do spec viram funções puras: só projetos publicados aparecem, e nenhuma barra de card mostra `.vercel.app`.

**Files:**
- Create: `lib/portfolio.ts`

**Interfaces:**
- Consumes: `cases` de `@/data/cases`, `CaseProject` de `@/types/case`.
- Produces: `getPublishedCases(): CaseProject[]`, `frameLabel(project: CaseProject): string`.

- [ ] **Step 1: Criar `lib/portfolio.ts`**

```ts
import { cases } from "@/data/cases";
import type { CaseProject } from "@/types/case";

/**
 * Helpers da rota /portfolio.
 *
 * Módulo sem dependência de React — pode ser importado tanto de Server
 * Components quanto de client sem arrastar nada junto.
 */

/**
 * Os projetos que aparecem na grade: só `status: "published"`, na ordem em
 * que estão em `data/cases.ts`. Os `coming-soon` ficam de fora.
 */
export function getPublishedCases(): CaseProject[] {
  return cases.filter((c) => c.status === "published");
}

/**
 * Rótulo da barra de URL do `BrowserFrame`.
 *
 * Domínio real quando o projeto tem um. Quando a URL ainda é a de preview
 * da Vercel (`*.vercel.app`), mostra o nome do projeto — a barra é parte da
 * apresentação, e um subdomínio gerado não comunica nada.
 */
export function frameLabel(project: CaseProject): string {
  const url = project.siteUrl;
  if (!url || url.endsWith(".vercel.app")) return project.title;
  return url;
}
```

- [ ] **Step 2: Verificar o comportamento das duas funções**

O projeto não tem runner de teste nem de script TS, então a verificação é por inspeção direta dos dados de entrada.

Run: `grep -n "status:\|siteUrl:" data/cases.ts`
Expected: exatamente 6 entradas com `status: "published"` (mj-engenharia, estudio-lentz, machado-plataformas, maison-etoile, forma-viva, estudio-monteiro) e 4 com `"coming-soon"`.

Confirme mentalmente o resultado de `frameLabel` para cada publicado:

| slug | `siteUrl` | rótulo esperado |
|---|---|---|
| `mj-engenharia` | `mj-engenharia-flame.vercel.app` | `MJ Engenharia` |
| `estudio-lentz` | `estudiolentz.com.br` | `estudiolentz.com.br` |
| `machado-plataformas` | `machadoplataformas.com.br` | `machadoplataformas.com.br` |
| `maison-etoile` | `lp-interiores.vercel.app` | `Maison Étoile Interiors` |
| `forma-viva` | `forma-viva.vercel.app` | `Atelier Forma Viva` |
| `estudio-monteiro` | `monteiro-nine.vercel.app` | `Estúdio Monteiro` |

Essa tabela é o critério de aceite visual da Task 6.

- [ ] **Step 3: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam.

- [ ] **Step 4: Commit**

```bash
git add lib/portfolio.ts
git commit -m "feat(portfolio): helpers de seleção e rótulo de barra

getPublishedCases() filtra os coming-soon; frameLabel() troca URLs
*.vercel.app pelo nome do projeto.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Header fixo + rota `/portfolio` abrindo

Primeira task que produz uma URL navegável. Cria o header, a página com `metadata`, e tira o `WhatsAppFab` global dessa rota (o header já tem o botão).

**Files:**
- Create: `components/portfolio/PortfolioHeader.tsx`
- Create: `app/portfolio/page.tsx`
- Modify: `components/ui/WhatsAppFab.tsx`

**Interfaces:**
- Consumes: `LogoMark` de `@/components/ui/LogoMark`, `waLink` de `@/lib/contact`.
- Produces: `PortfolioHeader()` (sem props). Âncoras alvo: `#projetos`, `#servicos`, `#sobre` — os blocos das tasks seguintes precisam desses `id`.

- [ ] **Step 1: Criar `components/portfolio/PortfolioHeader.tsx`**

```tsx
"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";
import { waLink } from "@/lib/contact";

/**
 * Header fixo do /portfolio.
 *
 * Logo à esquerda (volta pra experiência WebGL), âncoras e WhatsApp à
 * direita. No mobile as âncoras somem — sobra logo + botão.
 *
 * Client por causa do scroll suave: `scrollIntoView` respeita
 * prefers-reduced-motion via `behavior: "smooth"` do próprio browser, mas
 * checamos explicitamente pra garantir salto instantâneo quando pedido.
 */

const ANCHORS = [
  { href: "#projetos", label: "Projetos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
];

export function PortfolioHeader() {
  const jump = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-cbm-white/10 bg-cbm-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Coded by M — ir pra experiência"
          data-cursor="triangle"
          className="flex items-center gap-2.5 outline-none focus-visible:ring-1 focus-visible:ring-cbm-white/60"
        >
          <LogoMark size={22} />
          <span className="font-display text-sm font-semibold tracking-[0.2em] text-cbm-white">
            CbM
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <nav aria-label="Seções" className="hidden items-center gap-7 md:flex">
            {ANCHORS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                onClick={(e) => jump(e, a.href)}
                data-cursor="triangle"
                className="font-body text-[0.62rem] uppercase tracking-[0.26em] text-cbm-white/60 transition-colors hover:text-cbm-white focus-visible:text-cbm-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cbm-white/60"
              >
                {a.label}
              </a>
            ))}
          </nav>

          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="group inline-flex items-center gap-2 border border-cbm-white/15 px-4 py-2.5 font-display text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cbm-white transition-colors hover:border-cbm-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="text-cbm-red transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Criar `app/portfolio/page.tsx`**

Só com o header por enquanto. Os blocos entram nas tasks seguintes.

```tsx
import type { Metadata } from "next";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";

const TITLE = "Portfólio · Coded by M";
const DESCRIPTION =
  "Estúdio de web design e desenvolvimento em Florianópolis. Landing pages, sites institucionais e aplicações web — do conceito ao site no ar.";
const OG_IMAGE = "/cases/machado/desktop-tall.webp";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-dvh bg-cbm-black text-cbm-white">
      <PortfolioHeader />
      <main className="pt-16" />
    </div>
  );
}
```

- [ ] **Step 3: `WhatsAppFab` não renderiza em `/portfolio`**

O componente já é client. Adicionar o `usePathname` e o early return:

```tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/contact";
```

Dentro da função, logo após o `useState` e o `useEffect` (hooks nunca podem ficar depois de um return condicional):

```tsx
  const pathname = usePathname();

  // /portfolio já tem o botão de WhatsApp no header — dois seria ruído.
  if (pathname === "/portfolio") return null;
```

- [ ] **Step 4: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam.

- [ ] **Step 5: Verificar a rota no browser**

Run: `npm run dev`, abrir `http://localhost:3000/portfolio`.
Expected:
- Fundo `#000F08`, header fixo no topo com logo + "CbM" à esquerda.
- No desktop: "Projetos · Serviços · Sobre" e o botão WhatsApp à direita.
- Estreitando pra <768px: as âncoras somem, sobram logo e botão.
- **Nenhum botão flutuante de WhatsApp no canto inferior direito.**
- Em `http://localhost:3000/projetos`, o botão flutuante **continua aparecendo**.
- Clicar em "Projetos" no header não faz nada e não quebra (o alvo ainda não existe).

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/PortfolioHeader.tsx app/portfolio/page.tsx components/ui/WhatsAppFab.tsx
git commit -m "feat(portfolio): rota /portfolio com header fixo

Header minimalista com logo, âncoras e WhatsApp. Metadata própria com
OG image — a página existe pra ser mandada por link. O FAB global sai
dessa rota pra não duplicar o botão.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Hero — primeira dobra com timeline GSAP

Statement à esquerda, projeto em destaque à direita, visível sem rolar.

**Files:**
- Create: `components/portfolio/PortfolioHero.tsx`
- Modify: `app/portfolio/page.tsx`

**Interfaces:**
- Consumes: `BrowserFrame` de `@/components/case/BrowserFrame`, `frameLabel` de `@/lib/portfolio`, `waLink` de `@/lib/contact`, `CaseProject` de `@/types/case`.
- Produces: `FEATURED_SLUG: string` (const exportada, default `"mj-engenharia"`) e `PortfolioHero({ project }: { project: CaseProject | undefined })`. Quando `project` é `undefined`, o hero renderiza só a coluna de texto — a página não quebra.

- [ ] **Step 1: Criar `components/portfolio/PortfolioHero.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { waLink } from "@/lib/contact";
import { frameLabel } from "@/lib/portfolio";
import type { CaseProject } from "@/types/case";

/**
 * Projeto em destaque na primeira dobra. Trocar aqui troca o hero.
 * A página resolve o slug e passa o `CaseProject` por prop — assim o copy
 * dos outros 9 projetos não vai pro bundle client.
 */
export const FEATURED_SLUG = "mj-engenharia";

/** `useLayoutEffect` no browser, `useEffect` no SSR (evita o warning do React). */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Primeira dobra do /portfolio.
 *
 * Timeline GSAP de ~1s rodando uma vez na entrada: eyebrow → statement →
 * linha de apoio → CTA → o frame subindo com leve scale. Tudo dentro de
 * `gsap.matchMedia()`, então com prefers-reduced-motion nada anima e o
 * conteúdo já nasce visível (o markup é visível por padrão; a timeline é
 * que esconde e revela, antes do primeiro paint).
 */
export function PortfolioHero({ project }: { project: CaseProject | undefined }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        animate: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { animate } = context.conditions as { animate: boolean };
        if (!animate) return;

        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(q("[data-hero='eyebrow']"), { opacity: 0, y: 10, duration: 0.45 })
          .from(q("[data-hero='statement']"), { opacity: 0, y: 22, duration: 0.7 }, "-=0.2")
          .from(q("[data-hero='support']"), { opacity: 0, y: 16, duration: 0.6 }, "-=0.42")
          .from(q("[data-hero='cta']"), { opacity: 0, y: 14, duration: 0.55 }, "-=0.38")
          .from(
            q("[data-hero='frame']"),
            { opacity: 0, y: 34, scale: 0.97, duration: 0.85 },
            "-=0.5",
          );
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-cursor="default"
      aria-labelledby="portfolio-hero-headline"
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-28 lg:pt-24"
    >
      {/* Coluna de texto */}
      <div>
        <div data-hero="eyebrow" className="flex items-center gap-4">
          <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
          <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
            Coded by M · Florianópolis
          </p>
        </div>

        <h1
          id="portfolio-hero-headline"
          data-hero="statement"
          className="mt-7 max-w-xl font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.025em] text-cbm-white"
        >
          Uma presença digital à altura da empresa por trás dela.
        </h1>

        <p
          data-hero="support"
          className="mt-6 max-w-lg font-body text-[clamp(0.95rem,1.4vw,1.1rem)] font-light leading-relaxed text-cbm-white/65"
        >
          Landing pages, sites institucionais e aplicações web. Estratégia,
          design e código sob o mesmo teto — do diagnóstico ao site no ar.
        </p>

        <div data-hero="cta" className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="inline-flex items-center gap-2.5 bg-cbm-red px-7 py-4 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cbm-white transition-colors hover:bg-cbm-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            Começar um projeto
            <span aria-hidden>↗</span>
          </a>
          <a
            href="#projetos"
            data-cursor="triangle"
            className="inline-flex items-center gap-2 border-b border-cbm-white/25 pb-1 font-body text-[0.68rem] uppercase tracking-[0.22em] text-cbm-white/70 transition-colors hover:border-cbm-red hover:text-cbm-white focus-visible:text-cbm-white focus-visible:outline-none"
          >
            Ver projetos
          </a>
        </div>
      </div>

      {/* Projeto em destaque */}
      {project && (
        <div data-hero="frame">
          <Link
            href={`/cases/${project.slug}`}
            aria-label={`Ver o projeto ${project.title}`}
            data-cursor="triangle"
            className="group block outline-none focus-visible:ring-2 focus-visible:ring-cbm-red"
          >
            <BrowserFrame url={frameLabel(project)}>
              <div className="aspect-[16/11] w-full overflow-hidden bg-cbm-forest">
                {project.preview?.desktop && (
                  // biome-ignore lint/a11y/useAltText: alt está definido abaixo
                  <img
                    src={project.preview.desktop}
                    alt={`${project.title} — preview do site`}
                    className="w-full object-cover object-top"
                  />
                )}
              </div>
            </BrowserFrame>
            <p className="mt-4 font-body text-[0.62rem] uppercase tracking-[0.28em] text-cbm-white/45">
              {project.meta.tipo} · {project.meta.setor}
            </p>
          </Link>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Plugar o hero na página**

Em `app/portfolio/page.tsx`, adicionar os imports:

```tsx
import { PortfolioHero, FEATURED_SLUG } from "@/components/portfolio/PortfolioHero";
import { getCaseBySlug } from "@/data/cases";
```

e trocar o `<main>` vazio por:

```tsx
      <main className="pt-16">
        <PortfolioHero project={getCaseBySlug(FEATURED_SLUG)} />
      </main>
```

- [ ] **Step 3: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam.

- [ ] **Step 4: Verificar a entrada no browser**

Run: `npm run dev`, abrir `http://localhost:3000/portfolio` e recarregar.
Expected:
- Sem rolar: eyebrow, headline, linha de apoio, os dois CTAs e o `BrowserFrame` da MJ Engenharia, todos visíveis.
- A entrada acontece em cascata, terminando em ~1s. Sem flash de conteúdo desalinhado antes de animar.
- A barra do frame mostra **`MJ Engenharia`** (não `mj-engenharia-flame.vercel.app`).
- Clicar no frame vai pra `/cases/mj-engenharia`.
- Abaixo de 1024px o layout empilha: texto em cima, frame embaixo.

- [ ] **Step 5: Verificar reduced-motion**

No Chrome DevTools: `Cmd/Ctrl+Shift+P` → "Emulate CSS prefers-reduced-motion: reduce". Recarregar.
Expected: todo o hero aparece imediatamente, sem nenhuma animação de entrada.

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/PortfolioHero.tsx app/portfolio/page.tsx
git commit -m "feat(portfolio): hero com projeto em destaque

Statement à esquerda, BrowserFrame à direita, tudo visível sem rolar.
Timeline GSAP de ~1s dentro de matchMedia — com reduced-motion a página
abre pronta. FEATURED_SLUG troca o destaque em uma linha.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Grade de projetos

Os 6 publicados em `BrowserFrame`, dois por linha no desktop.

**Files:**
- Create: `components/portfolio/ProjectCard.tsx`
- Create: `components/portfolio/ProjectGrid.tsx`
- Modify: `app/portfolio/page.tsx`

**Interfaces:**
- Consumes: `getPublishedCases`, `frameLabel` de `@/lib/portfolio`; `BrowserFrame`; `Reveal` de `@/components/ui/Reveal`.
- Produces: `ProjectCard({ project }: { project: CaseProject })` e `ProjectGrid()` (sem props, lê os dados sozinha). `ProjectGrid` renderiza a `<section id="projetos">`.

- [ ] **Step 1: Criar `components/portfolio/ProjectCard.tsx`**

O hover é 100% CSS: o card levanta, a borda vai pro vermelho e o screenshot `desktop-tall` desliza revelando o resto da página.

```tsx
import Link from "next/link";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { frameLabel } from "@/lib/portfolio";
import type { CaseProject } from "@/types/case";

/**
 * Um projeto na grade do /portfolio.
 *
 * Server Component — não sabe de onde veio o `project`. Todo o movimento é
 * CSS: no hover o card levanta, a borda acende no vermelho e o screenshot
 * (que é uma captura da página inteira, bem mais alta que a janela) desliza
 * pra cima revelando o resto do site. `motion-reduce:` desliga tudo.
 */
export function ProjectCard({ project }: { project: CaseProject }) {
  return (
    <Link
      href={`/cases/${project.slug}`}
      aria-label={`Ver o projeto ${project.title}`}
      data-cursor="triangle"
      className="group block outline-none transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-cbm-red motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="transition-colors duration-500 [&>div]:border-cbm-white/15 group-hover:[&>div]:border-cbm-red/60">
        <BrowserFrame url={frameLabel(project)}>
          <div className="aspect-[16/11] w-full overflow-hidden bg-cbm-forest">
            {project.preview?.desktop ? (
              // biome-ignore lint/a11y/useAltText: alt está definido abaixo
              <img
                src={project.preview.desktop}
                alt={`${project.title} — preview do site`}
                loading="lazy"
                className="w-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:-translate-y-[38%] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                style={{ transformOrigin: "top" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg aria-hidden width="36" height="36" viewBox="0 0 16 16" fill="none">
                  <polygon
                    points="8,2 14,14 2,14"
                    stroke="#F5F2ED"
                    strokeOpacity="0.18"
                    strokeWidth="0.6"
                  />
                </svg>
              </div>
            )}
          </div>
        </BrowserFrame>
      </div>

      <div className="mt-5">
        <p className="font-body text-[0.58rem] uppercase tracking-[0.3em] text-cbm-white/45">
          {project.meta.setor} · {project.meta.ano}
        </p>
        <h3 className="mt-2.5 font-display text-[1.35rem] font-semibold tracking-[-0.015em] text-cbm-white transition-colors duration-300 group-hover:text-cbm-red">
          {project.title}
        </h3>
        <p className="mt-2 max-w-xl font-body text-[0.88rem] font-light leading-relaxed text-cbm-white/60 line-clamp-2">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
```

**Nota sobre o `-38%`:** as capturas `desktop-tall` são páginas inteiras, com alturas diferentes entre projetos, então não dá pra calcular um deslocamento exato sem container queries. `-38%` desliza o bastante pra revelar as seções seguintes em todos os 6 sem chegar ao rodapé de nenhum. Se algum card ficar estranho no hover, ajuste só esse número.

- [ ] **Step 2: Criar `components/portfolio/ProjectGrid.tsx`**

```tsx
import { Reveal } from "@/components/ui/Reveal";
import { getPublishedCases } from "@/lib/portfolio";
import { ProjectCard } from "./ProjectCard";

/** Grade dos projetos publicados. Dois por linha no desktop, um no mobile. */
export function ProjectGrid() {
  const projects = getPublishedCases();

  return (
    <section
      id="projetos"
      data-cursor="default"
      aria-labelledby="portfolio-projetos-headline"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28"
    >
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
          <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
            Projetos
          </p>
        </div>
        <h2
          id="portfolio-projetos-headline"
          className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-cbm-white"
        >
          Sites no ar, com nome e endereço.
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 90}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Plugar na página**

Em `app/portfolio/page.tsx`, adicionar o import:

```tsx
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
```

e dentro do `<main>`, logo depois do `<PortfolioHero .../>`:

```tsx
        <ProjectGrid />
```

- [ ] **Step 4: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam.

- [ ] **Step 5: Verificar a grade no browser**

Run: `npm run dev`, abrir `http://localhost:3000/portfolio` e rolar até "Projetos".
Expected:
- **Exatamente 6 cards.** Nenhum "Em breve" / "Rota Clínica" / "Industrial" / "E-commerce" / "Educação".
- As barras mostram, na ordem: `MJ Engenharia`, `estudiolentz.com.br`, `machadoplataformas.com.br`, `Maison Étoile Interiors`, `Atelier Forma Viva`, `Estúdio Monteiro`. **Nenhuma contém `.vercel.app`.**
- Hover num card: ele levanta, a borda fica vermelha, o título fica vermelho e o screenshot desliza pra cima revelando mais da página.
- Clicar leva pra `/cases/<slug>` correspondente.
- Clicar em "Projetos" no header rola suave até a seção, sem o header cobrir o título (`scroll-mt-16`).
- Abaixo de 768px: uma coluna.

- [ ] **Step 6: Verificar reduced-motion**

Emular `prefers-reduced-motion: reduce` e recarregar.
Expected: os cards aparecem todos de uma vez ao rolar (sem fade/slide), e o hover não move nem desliza nada.

- [ ] **Step 7: Commit**

```bash
git add components/portfolio/ProjectCard.tsx components/portfolio/ProjectGrid.tsx app/portfolio/page.tsx
git commit -m "feat(portfolio): grade dos 6 projetos publicados

BrowserFrame por card, hover em CSS puro (card levanta, borda acende,
screenshot desliza). Barra mostra domínio real ou nome do projeto.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Serviços e Processo

Os 3 serviços de `data/services.ts` como cards de texto (sem as mini-cenas 3D da Home) e as 4 etapas de `data/process.ts` em linha horizontal.

**Files:**
- Create: `components/portfolio/ServicesList.tsx`
- Create: `components/portfolio/ProcessSteps.tsx`
- Modify: `app/portfolio/page.tsx`

**Interfaces:**
- Consumes: `SERVICES` de `@/data/services`, `PROCESS_STEPS` de `@/data/process`, `Reveal`.
- Produces: `ServicesList()` renderiza `<section id="servicos">`; `ProcessSteps()` renderiza `<section id="processo">`.

- [ ] **Step 1: Criar `components/portfolio/ServicesList.tsx`**

```tsx
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES } from "@/data/services";

/**
 * Os 3 serviços como cards de texto: índice, título, descrição e os 5
 * `includes`. Sem as mini-cenas 3D da Home — aqui a leitura é rápida.
 */
export function ServicesList() {
  return (
    <section
      id="servicos"
      data-cursor="default"
      aria-labelledby="portfolio-servicos-headline"
      className="border-y border-cbm-white/10 bg-cbm-forest/40"
    >
      <div className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
            <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
              Serviços
            </p>
          </div>
          <h2
            id="portfolio-servicos-headline"
            className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-cbm-white"
          >
            Do site de uma página ao sistema inteiro.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-cbm-white/10 bg-cbm-white/10 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug} delay={i * 90} className="bg-cbm-black">
              <article className="group h-full p-8 transition-colors duration-300 hover:bg-cbm-forest">
                <span
                  aria-hidden
                  className="mb-6 block h-2.5 w-2.5 border-r border-t border-cbm-red opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <p className="font-display text-[0.62rem] font-semibold tabular-nums tracking-[0.3em] text-cbm-red/75">
                  {service.index}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.2rem,1.9vw,1.55rem)] font-semibold tracking-[-0.01em] text-cbm-white">
                  {service.title}
                </h3>
                <p className="mt-3 font-body text-[0.92rem] font-light leading-relaxed text-cbm-white/60">
                  {service.description}
                </p>

                <ul className="mt-7 space-y-2.5">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 font-body text-[0.82rem] font-light text-cbm-white/55"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] block h-[5px] w-[5px] flex-shrink-0 rotate-45 bg-cbm-red/70"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Criar `components/portfolio/ProcessSteps.tsx`**

```tsx
import { Reveal } from "@/components/ui/Reveal";
import { PROCESS_STEPS } from "@/data/process";

/**
 * As 4 etapas do método em linha horizontal numerada. Vertical no mobile.
 *
 * A linha que liga as etapas é estática; a progressão é lida pela entrada
 * escalonada das etapas (`Reveal` com delay crescente). CSS sozinho não sabe
 * quando o bloco entrou no viewport, e o spec reserva o GSAP pro hero.
 */
export function ProcessSteps() {
  return (
    <section
      id="processo"
      data-cursor="default"
      aria-labelledby="portfolio-processo-headline"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28"
    >
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
          <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
            Método
          </p>
        </div>
        <h2
          id="portfolio-processo-headline"
          className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-cbm-white"
        >
          Todo projeto percorre o mesmo caminho.
        </h2>
      </Reveal>

      <div className="relative mt-16">
        {/* Linha condutora: horizontal no desktop, vertical no mobile. */}
        <span
          aria-hidden
          className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-cbm-white/12 md:left-0 md:top-[5px] md:h-px md:w-full"
        />

        <ol className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 80}>
              <li className="relative pl-8 md:pl-0 md:pt-8">
                <span
                  aria-hidden
                  className="absolute left-0 top-[3px] block h-2.5 w-2.5 rotate-45 bg-cbm-red md:top-0"
                />
                <p className="font-display text-[0.62rem] font-semibold tabular-nums tracking-[0.3em] text-cbm-red/75">
                  {step.num}
                </p>
                <h3 className="mt-2.5 font-display text-[clamp(1.15rem,1.8vw,1.45rem)] font-semibold tracking-[-0.01em] text-cbm-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 font-body text-[0.88rem] font-light leading-relaxed text-cbm-white/60">
                  {step.desc}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Plugar na página**

Em `app/portfolio/page.tsx`, adicionar os imports:

```tsx
import { ServicesList } from "@/components/portfolio/ServicesList";
import { ProcessSteps } from "@/components/portfolio/ProcessSteps";
```

e no `<main>`, depois de `<ProjectGrid />`:

```tsx
        <ServicesList />
        <ProcessSteps />
```

- [ ] **Step 4: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam.

- [ ] **Step 5: Verificar no browser**

Run: `npm run dev`, abrir `http://localhost:3000/portfolio` e rolar.
Expected:
- **Serviços:** 3 cards (Landing Pages, Sites Institucionais, Aplicações Web), cada um com índice, título, descrição e 5 bullets. Fundo levemente distinto do resto da página, separado por bordas. Hover escurece o card e acende o bracket vermelho.
- **Processo:** 4 etapas (Estratégia, Design, Código, Resultado) numeradas 01–04, em linha horizontal com a linha condutora acima dos losangos vermelhos.
- Clicar em "Serviços" no header rola até a seção certa.
- Abaixo de 768px: serviços viram uma coluna; processo vira vertical com a linha à esquerda.

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/ServicesList.tsx components/portfolio/ProcessSteps.tsx app/portfolio/page.tsx
git commit -m "feat(portfolio): blocos de serviços e processo

3 serviços como cards de texto (sem as mini-cenas 3D da Home) e as 4
etapas do método em linha. Todo o copy vem de data/.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Sobre e Contato

O statement da marca com a assinatura do fundador, e o fechamento com WhatsApp e Instagram.

**Files:**
- Create: `components/portfolio/AboutBlock.tsx`
- Create: `components/portfolio/ContactBlock.tsx`
- Modify: `app/portfolio/page.tsx`

**Interfaces:**
- Consumes: `ABOUT_STATEMENT`, `FOUNDER`, `LOCATION`, `ABOUT_VALUES` de `@/data/about`; `waLink`, `INSTAGRAM_URL`, `INSTAGRAM_HANDLE` de `@/lib/contact`; `LogoMark`; `Reveal`.
- Produces: `AboutBlock()` renderiza `<section id="sobre">`; `ContactBlock()` renderiza `<section id="contato">`.

- [ ] **Step 1: Criar `components/portfolio/AboutBlock.tsx`**

```tsx
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_STATEMENT, ABOUT_VALUES, FOUNDER, LOCATION } from "@/data/about";

/** Statement da marca, bloco-assinatura do fundador, localização e valores. */
export function AboutBlock() {
  return (
    <section
      id="sobre"
      data-cursor="default"
      aria-labelledby="portfolio-sobre-headline"
      className="border-y border-cbm-white/10 bg-cbm-forest/40"
    >
      <div className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
            <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
              Sobre
            </p>
          </div>
          <h2
            id="portfolio-sobre-headline"
            className="mt-6 max-w-3xl font-display text-[clamp(1.25rem,2.6vw,2.1rem)] font-semibold leading-[1.32] tracking-[-0.015em] text-cbm-white"
          >
            {ABOUT_STATEMENT}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 max-w-lg border-l-2 border-cbm-red/45 pl-6">
            <p className="font-display text-[1.05rem] font-semibold text-cbm-white">
              {FOUNDER.name}
            </p>
            <p className="mt-1 font-body text-[0.65rem] font-medium uppercase tracking-[0.3em] text-cbm-white/45">
              {FOUNDER.role}
            </p>
            <p className="mt-4 font-body text-[0.95rem] font-light leading-relaxed text-cbm-white/65">
              {FOUNDER.bio}
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <span aria-hidden className="block h-[7px] w-[7px] rotate-45 bg-cbm-red" />
              <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.25em] text-cbm-white/50">
                {LOCATION}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-cbm-white/10 bg-cbm-white/10 sm:grid-cols-3">
          {ABOUT_VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 90} className="bg-cbm-black">
              <div className="h-full p-7">
                <p className="font-display text-[0.6rem] font-semibold tabular-nums tracking-[0.3em] text-cbm-red/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-[clamp(1.1rem,1.7vw,1.4rem)] font-medium tracking-[-0.01em] text-cbm-white">
                  {value.title}
                </p>
                <p className="mt-2 font-body text-[0.85rem] font-light leading-relaxed text-cbm-white/55">
                  {value.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Criar `components/portfolio/ContactBlock.tsx`**

```tsx
import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/ui/LogoMark";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, waLink } from "@/lib/contact";

/** Fechamento: um convite direto, WhatsApp e Instagram. Sem formulário. */
export function ContactBlock() {
  return (
    <section
      id="contato"
      data-cursor="default"
      aria-labelledby="portfolio-contato-headline"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-24 text-center sm:px-8 lg:py-32"
    >
      <Reveal>
        <div className="flex justify-center">
          <LogoMark size={34} />
        </div>
        <h2
          id="portfolio-contato-headline"
          className="mx-auto mt-9 max-w-2xl font-display text-[clamp(1.6rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-cbm-white"
        >
          Vamos construir a sua.
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-[clamp(0.92rem,1.3vw,1.05rem)] font-light leading-relaxed text-cbm-white/60">
          Conta o que você tem em mente. Respondo com um diagnóstico honesto —
          e, se fizer sentido, com uma proposta.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="inline-flex items-center gap-2.5 bg-cbm-red px-8 py-4 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cbm-white transition-colors hover:bg-cbm-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            Falar no WhatsApp
            <span aria-hidden>↗</span>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="inline-flex items-center gap-2 border border-cbm-white/15 px-7 py-4 font-body text-[0.66rem] uppercase tracking-[0.2em] text-cbm-white/70 transition-colors hover:border-cbm-red hover:text-cbm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </Reveal>

      <p className="mt-16 font-body text-[0.6rem] uppercase tracking-[0.3em] text-cbm-white/30">
        Coded by M · Florianópolis, Brasil
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Plugar na página — versão final de `app/portfolio/page.tsx`**

O arquivo completo, com os 6 blocos na ordem:

```tsx
import type { Metadata } from "next";
import { getCaseBySlug } from "@/data/cases";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioHero, FEATURED_SLUG } from "@/components/portfolio/PortfolioHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { ServicesList } from "@/components/portfolio/ServicesList";
import { ProcessSteps } from "@/components/portfolio/ProcessSteps";
import { AboutBlock } from "@/components/portfolio/AboutBlock";
import { ContactBlock } from "@/components/portfolio/ContactBlock";

const TITLE = "Portfólio · Coded by M";
const DESCRIPTION =
  "Estúdio de web design e desenvolvimento em Florianópolis. Landing pages, sites institucionais e aplicações web — do conceito ao site no ar.";
const OG_IMAGE = "/cases/machado/desktop-tall.webp";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * Portfólio estático — a versão de leitura rápida da Home WebGL.
 *
 * Server Component. Nenhum import daqui puxa `three` ou `@react-three/*`;
 * o code splitting do App Router mantém a stack WebGL fora dessa rota.
 * Só `PortfolioHeader` e `PortfolioHero` são client.
 */
export default function PortfolioPage() {
  return (
    <div className="min-h-dvh bg-cbm-black text-cbm-white">
      <PortfolioHeader />
      <main className="pt-16">
        <PortfolioHero project={getCaseBySlug(FEATURED_SLUG)} />
        <ProjectGrid />
        <ServicesList />
        <ProcessSteps />
        <AboutBlock />
        <ContactBlock />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck e lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam.

- [ ] **Step 5: Verificar a página inteira no browser**

Run: `npm run dev`, abrir `http://localhost:3000/portfolio` e percorrer do topo ao fim.
Expected:
- Os 6 blocos na ordem: Hero → Projetos → Serviços → Processo → Sobre → Contato.
- Sobre mostra o mesmo manifesto e a mesma bio da Home (vindos de `data/about.ts`), mais os 3 valores.
- Contato: logo, "Vamos construir a sua.", botão de WhatsApp e link do Instagram.
- Clicar em WhatsApp abre `wa.me/5548999916638` com a mensagem pré-preenchida; Instagram abre `instagram.com/codedbymstudio`.
- Header: "Sobre" rola até o bloco Sobre.
- Nenhum botão flutuante de WhatsApp.

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/AboutBlock.tsx components/portfolio/ContactBlock.tsx app/portfolio/page.tsx
git commit -m "feat(portfolio): blocos de sobre e contato

Statement e assinatura do fundador vindos de data/about.ts; fechamento
com WhatsApp e Instagram de lib/contact.ts. Sem formulário.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Verificação final

Os critérios de sucesso do spec, um a um. Nada aqui é opcional — se algum falhar, corrija antes de fechar.

**Files:**
- Modify: nenhum (a menos que uma verificação falhe)

- [ ] **Step 1: Build de produção**

Run: `npm run build`
Expected: build completa sem erro; `/portfolio` aparece na tabela de rotas como estática (`○`).

- [ ] **Step 2: O bundle da rota não contém `three` nem `@react-three/*`**

Este é um requisito do spec, não um efeito colateral. Rode o script abaixo depois do build:

```bash
node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('.next/app-build-manifest.json', 'utf8'));
const key = Object.keys(m.pages).find(k => k.startsWith('/portfolio'));
if (!key) { console.error('ROTA NAO ENCONTRADA no manifest'); process.exit(1); }
const files = m.pages[key].filter(f => f.endsWith('.js'));
let bad = [];
for (const f of files) {
  const src = fs.readFileSync('.next/' + f, 'utf8');
  if (/three\.module|@react-three|react-three-fiber|THREE\.WebGLRenderer/.test(src)) bad.push(f);
}
console.log('chunks da rota:', files.length);
console.log(bad.length ? 'FALHOU — WebGL nos chunks: ' + bad.join(', ') : 'OK — nenhum three/@react-three no bundle de /portfolio');
process.exit(bad.length ? 1 : 0);
"
```

Expected: `OK — nenhum three/@react-three no bundle de /portfolio`, exit 0.

Se falhar, o culpado é um import em cadeia — rastreie com `grep -rn "from \"@/components/zones\|from \"@/components/three\|from \"three\"" components/portfolio app/portfolio` e corte.

- [ ] **Step 3: Os 6 publicados aparecem, nenhum coming-soon, nenhuma `.vercel.app`**

Run: `npm run start` (serve o build), abrir `http://localhost:3000/portfolio`.
Expected: 6 cards; nenhum "Em breve"; nenhuma barra com `.vercel.app` (confira contra a tabela da Task 3).

- [ ] **Step 4: Reduced-motion desliga tudo**

DevTools → "Emulate CSS prefers-reduced-motion: reduce" → recarregar e percorrer a página.
Expected: hero aparece pronto (sem cascata GSAP), seções aparecem sem fade/slide/blur, hover nos cards não move nada.

- [ ] **Step 5: Responsivo**

DevTools responsive, larguras 375px, 768px e 1440px.
Expected: 375px — hero empilhado, projetos em coluna, processo vertical, header só com logo + botão; 768px — projetos em 2 colunas, processo já horizontal; 1440px — layout completo, nada estourando a largura.

- [ ] **Step 6: As rotas existentes continuam funcionando**

Abrir e conferir: `http://localhost:3000/` (Home WebGL percorre os capítulos), `/projetos` (galeria com o FAB de WhatsApp visível), `/cases/machado-plataformas` (seções entram com o `Reveal`).
Expected: os três funcionam exatamente como antes das mudanças.

- [ ] **Step 7: Typecheck e lint finais**

Run: `npm run typecheck && npm run lint`
Expected: ambos passam, zero warning novo.

- [ ] **Step 8: Commit final (se alguma correção foi necessária)**

```bash
git add -A
git commit -m "chore(portfolio): ajustes da verificação final

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Se nada precisou mudar, não há commit — a task se encerra com as verificações registradas.
