# Vitrine de Projetos `/projetos` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar uma rota `/projetos` — vitrine escura on-brand, compartilhável, com projetos publicados agrupados em faixas por tipo e filtro por chips, lendo `data/cases.ts`.

**Architecture:** Server Component (`app/projetos/page.tsx`) lê e agrupa os dados e define metadata/OG; uma única ilha client (`ProjetosGallery`) controla o filtro alternando a visibilidade das faixas. Componentes de apresentação (`ProjetoCard`, `TypeBand`, `FilterChips`, header/footer) reusam o design system existente. Aditivo: não toca na Paisagem imersiva.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS 3, TypeScript. Fontes Panchang/Satoshi já carregadas. Sem libs novas.

## Global Constraints

- **Sem dependências novas.** Só o que já está no `package.json`.
- **Reusar o design system:** cores do namespace `cbm` (Tailwind), fontes `Panchang`/`Satoshi`, motivos HUD/triângulo. Sem tokens/cores novos.
- **Não tocar na Paisagem imersiva** (`components/zones/ProjectLandscape/*` só pode ser editado para re-exportar config extraída, sem mudança visual).
- **Só projetos `status === "published"`** aparecem na vitrine.
- **Ordem das faixas (fixa):** `landing` → `institucional` → `webapp` → `ecommerce`.
- **Rótulos das faixas:** `landing` → "Landing Pages", `institucional` → "Sites Institucionais", `webapp` → "Aplicações Web", `ecommerce` → "Lojas (E-commerce)".
- **Cor por tipo:** `institucional #FB3640`, `landing #D9A15B`, `webapp #5FB0A3`, `ecommerce #A98BC9`.
- **A11y/perf:** contraste ≥4.5:1; alvos de toque ≥44px; `prefers-reduced-motion` respeitado; foco de teclado visível; imagens `loading="lazy"` + `aspect-ratio` (sem CLS); cor nunca é o único sinal.
- **Animação:** só `transform`/`opacity`; durações 150–300ms; ease-out.
- **Sem suíte de testes no projeto.** Verificação por tarefa = `npm run typecheck` && `npm run lint` && `npm run build`, mais checagem visual em `npm run dev`.
- **Voz da casa preservada** (tom editorial atual, incluindo travessões).
- **WhatsApp:** `WHATSAPP_NUMBER = "5548999916638"` (+55 48 99991-6638). E-mail de fallback: `matheusmendes077@gmail.com`.

---

### Task 1: Extrair config de tipos de projeto para módulo leve

Hoje `PROJECT_TYPE_COLOR` vive em `components/zones/ProjectLandscape/config.ts` (módulo que arrasta dependências 3D). A vitrine precisa de cor + rótulo + ordem sem importar o módulo WebGL. Criar `lib/projectTypes.ts` e re-exportar a cor do config 3D para não duplicar.

**Files:**
- Create: `lib/projectTypes.ts`
- Modify: `components/zones/ProjectLandscape/config.ts` (remover a const literal `PROJECT_TYPE_COLOR`, re-exportar de `@/lib/projectTypes`)

**Interfaces:**
- Produces:
  - `PROJECT_TYPE_COLOR: Record<ProjectType, string>`
  - `PROJECT_TYPE_LABEL: Record<ProjectType, string>`
  - `PROJECT_TYPE_ORDER: ProjectType[]`

- [ ] **Step 1: Criar `lib/projectTypes.ts`**

```ts
import type { ProjectType } from "@/types/case";

/**
 * Cor de acento por tipo de projeto. Fonte única (a Paisagem 3D e a vitrine
 * `/projetos` consomem daqui). Dessaturada pra coesão com a marca.
 */
export const PROJECT_TYPE_COLOR: Record<ProjectType, string> = {
  institucional: "#FB3640",
  landing: "#D9A15B",
  webapp: "#5FB0A3",
  ecommerce: "#A98BC9",
} as const;

/** Rótulo comercial de cada faixa na vitrine. */
export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  landing: "Landing Pages",
  institucional: "Sites Institucionais",
  webapp: "Aplicações Web",
  ecommerce: "Lojas (E-commerce)",
} as const;

/** Ordem fixa e intencional das faixas. */
export const PROJECT_TYPE_ORDER: ProjectType[] = [
  "landing",
  "institucional",
  "webapp",
  "ecommerce",
];
```

- [ ] **Step 2: Re-exportar do config 3D (sem regressão visual)**

Em `components/zones/ProjectLandscape/config.ts`, remover o bloco literal:

```ts
export const PROJECT_TYPE_COLOR: Record<ProjectType, string> = {
  institucional: "#FB3640",
  landing: "#D9A15B",
  webapp: "#5FB0A3",
  ecommerce: "#A98BC9",
} as const;
```

e substituir por uma re-exportação (mantém o comentário acima do bloco):

```ts
export { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
```

Garantir que `import type { ProjectType }` no topo do config continue presente (ainda é usado por `FragmentSlot`/outros). Se após a remoção `ProjectType` ficar sem uso, remover o import para o lint não acusar.

- [ ] **Step 3: Verificar tipos, lint e build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: PASS, sem erros. Nenhuma mudança visual na Paisagem.

- [ ] **Step 4: Checagem visual rápida**

Run: `npm run dev` e abrir `/` — a Paisagem e o card devem manter as cores por tipo idênticas (apex/hairline). Encerrar o dev.

- [ ] **Step 5: Commit**

```bash
git add lib/projectTypes.ts components/zones/ProjectLandscape/config.ts
git commit -m "refactor(projetos): extrai PROJECT_TYPE_COLOR para lib/projectTypes

Move a cor por tipo do config 3D para um modulo leve e adiciona rotulo +
ordem das faixas. ProjectLandscape re-exporta a cor (sem regressao visual).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Seletor de dados — agrupar publicados por tipo

Função pura que transforma `cases` em faixas ordenadas, contendo só publicados, e descartando tipos sem projeto.

**Files:**
- Create: `lib/galleryData.ts`

**Interfaces:**
- Consumes: `cases` de `@/data/cases`; `PROJECT_TYPE_ORDER` de `@/lib/projectTypes`.
- Produces:
  - `interface ProjectBand { type: ProjectType; projects: CaseProject[] }`
  - `getPublishedBands(): ProjectBand[]`

- [ ] **Step 1: Criar `lib/galleryData.ts`**

```ts
import { cases } from "@/data/cases";
import { PROJECT_TYPE_ORDER } from "@/lib/projectTypes";
import type { CaseProject, ProjectType } from "@/types/case";

/** Uma faixa da vitrine: um tipo + seus projetos publicados. */
export interface ProjectBand {
  type: ProjectType;
  projects: CaseProject[];
}

/**
 * Faixas da vitrine `/projetos`: só projetos publicados, agrupados por tipo na
 * ordem de `PROJECT_TYPE_ORDER`. Tipos sem projeto publicado são descartados
 * (sem faixas vazias). Projetos sem `type` caem em "institucional" (default da
 * marca, coerente com a Paisagem).
 */
export function getPublishedBands(): ProjectBand[] {
  const published = cases.filter((c) => c.status === "published");
  return PROJECT_TYPE_ORDER.map((type) => ({
    type,
    projects: published.filter((c) => (c.type ?? "institucional") === type),
  })).filter((band) => band.projects.length > 0);
}
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 3: Sanity check do agrupamento**

Criar um script temporário `scratch-bands.mjs`? Não — em vez disso, validar via um log temporário no `page.tsx` da próxima task. Aqui só garantir compilação. (Sem suíte de testes; a verificação funcional ocorre na Task 8 ao renderizar.)

- [ ] **Step 4: Commit**

```bash
git add lib/galleryData.ts
git commit -m "feat(projetos): seletor getPublishedBands (publicados por tipo)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Componente `ProjetoCard`

Card de um projeto, reusando o vocabulário visual da Paisagem (brackets HUD, hairline por tipo, glifo-triângulo). Card inteiro → `/cases/[slug]` via stretched link; "ver no ar ↗" → `siteUrl` em nova aba sem aninhar âncoras.

**Files:**
- Create: `components/projetos/ProjetoCard.tsx`

**Interfaces:**
- Consumes: `CaseProject` de `@/types/case`; `PROJECT_TYPE_COLOR` de `@/lib/projectTypes`.
- Produces: `export function ProjetoCard({ project, featured }: { project: CaseProject; featured?: boolean }): JSX.Element`

- [ ] **Step 1: Criar `components/projetos/ProjetoCard.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";

/**
 * Card de projeto na vitrine `/projetos`.
 *
 * - Card inteiro → /cases/[slug] (stretched link: <Link> absoluto cobrindo a
 *   área; conteúdo com pointer-events-none).
 * - "Ver no ar ↗" → siteUrl em nova aba; re-habilita pointer-events e sobe no
 *   z-index pra não conflitar com o stretched link (sem aninhar <a>).
 * - `featured`: primeiro card da faixa, ocupa mais espaço (imagem maior).
 */
export function ProjetoCard({
  project,
  featured = false,
}: {
  project: CaseProject;
  featured?: boolean;
}) {
  const typeColor = project.type ? PROJECT_TYPE_COLOR[project.type] : "#FB3640";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden border border-[#F5F2ED]/15 bg-[#070B08] transition-colors duration-300 hover:border-[#F5F2ED]/40 focus-within:border-[#F5F2ED]/50 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Stretched link: clique do card → case. */}
      <Link
        href={`/cases/${project.slug}`}
        aria-label={`Ver projeto ${project.title}`}
        className="absolute inset-0 z-[1] outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B08]"
      />

      {/* Brackets HUD nos cantos — assinatura da marca. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 border-l border-t border-[#FB3640]" />
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 border-r border-t border-[#F5F2ED]/35" />
        <span className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 border-b border-l border-[#F5F2ED]/35" />
        <span className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 border-b border-r border-[#F5F2ED]/35" />
      </div>

      {/* Imagem (reserva espaço via aspect-ratio → sem CLS). */}
      <div className="pointer-events-none relative aspect-[16/10] w-full overflow-hidden border-b border-[#F5F2ED]/12">
        <CardImage
          src={project.preview?.desktop}
          alt={`${project.title} — preview`}
        />
      </div>

      {/* Texto. */}
      <div className="pointer-events-none flex flex-1 flex-col gap-2 p-5">
        <p className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.32em] text-[#97938b]">
          <span
            aria-hidden
            className="inline-block h-[2px] w-3.5 flex-shrink-0"
            style={{ backgroundColor: typeColor }}
          />
          {project.meta.setor} · {project.meta.ano}
        </p>
        <h3
          className={`leading-tight tracking-tight text-[#F5F2ED] ${
            featured ? "text-xl" : "text-lg"
          }`}
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          {project.title}
        </h3>
        <p className="line-clamp-2 text-[0.8rem] leading-relaxed text-[#F5F2ED]/65">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#F5F2ED] transition-colors group-hover:text-[#FB3640]">
            Ver projeto
            <svg
              aria-hidden
              width="11"
              height="11"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <polygon points="3,2 14,8 3,14" />
            </svg>
          </span>

          {project.siteUrl && (
            <a
              href={`https://${project.siteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative z-[3] inline-flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.24em] text-[#F5F2ED]/55 underline-offset-4 transition-colors hover:text-[#F5F2ED] hover:underline focus-visible:text-[#F5F2ED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F2ED]/60"
            >
              ver no ar ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** <img> com fallback quando o asset falha (mesma resiliência da Paisagem). */
function CardImage({ src, alt }: { src?: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0d130f]">
        <svg aria-hidden width="40" height="40" viewBox="0 0 16 16" fill="none">
          <polygon
            points="8,2 14,14 2,14"
            stroke="#F5F2ED"
            strokeOpacity="0.18"
            strokeWidth="0.6"
          />
        </svg>
      </div>
    );
  }
  return (
    // biome-ignore lint/a11y/useAltText: alt prop is forwarded
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );
}
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/projetos/ProjetoCard.tsx
git commit -m "feat(projetos): ProjetoCard com vocabulario HUD da Paisagem

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Componente `TypeBand`

Uma faixa: rótulo + numeral-fantasma Panchang + contagem + grade de cards (1º destaque).

**Files:**
- Create: `components/projetos/TypeBand.tsx`

**Interfaces:**
- Consumes: `ProjectBand` de `@/lib/galleryData`; `PROJECT_TYPE_LABEL` de `@/lib/projectTypes`; `ProjetoCard`.
- Produces: `export function TypeBand({ band, index, hidden }: { band: ProjectBand; index: number; hidden?: boolean }): JSX.Element`

- [ ] **Step 1: Criar `components/projetos/TypeBand.tsx`**

```tsx
import type { ProjectBand } from "@/lib/galleryData";
import { PROJECT_TYPE_LABEL } from "@/lib/projectTypes";
import { ProjetoCard } from "./ProjetoCard";

/**
 * Faixa de um tipo na vitrine. Numeral-fantasma Panchang atrás do rótulo
 * (anti-monotonia). `hidden` controla a visibilidade pelo filtro de chips —
 * a faixa fica no HTML (bom pra SEO), só some via CSS.
 */
export function TypeBand({
  band,
  index,
  hidden = false,
}: {
  band: ProjectBand;
  index: number;
  hidden?: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <section
      aria-label={PROJECT_TYPE_LABEL[band.type]}
      className={hidden ? "hidden" : "block"}
    >
      {/* Cabeçalho da faixa. */}
      <div className="relative mb-6 flex items-end justify-between border-b border-[#F5F2ED]/12 pb-3">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-1 -top-6 select-none leading-none"
          style={{
            fontFamily: '"Panchang", sans-serif',
            fontWeight: 700,
            fontSize: "3.5rem",
            color: "rgba(245,242,237,0.06)",
          }}
        >
          {num}
        </span>
        <h2
          className="relative text-sm uppercase tracking-[0.3em] text-[#F5F2ED]"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          {PROJECT_TYPE_LABEL[band.type]}
        </h2>
        <span className="text-xs tabular-nums text-[#F5F2ED]/45">
          ({band.projects.length})
        </span>
      </div>

      {/* Grade: 1º card destaque (2 col no desktop), demais 1 col. */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {band.projects.map((project, i) => (
          <ProjetoCard
            key={project.slug}
            project={project}
            featured={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/projetos/TypeBand.tsx
git commit -m "feat(projetos): TypeBand (faixa por tipo com numeral-fantasma)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Componente `FilterChips`

Chips de filtro: `Todos` + um chip por tipo presente nas faixas. Chip ativo realça com a cor do tipo.

**Files:**
- Create: `components/projetos/FilterChips.tsx`

**Interfaces:**
- Consumes: `ProjectType` de `@/types/case`; `PROJECT_TYPE_LABEL`, `PROJECT_TYPE_COLOR` de `@/lib/projectTypes`.
- Produces: `type ChipValue = ProjectType | "all";` e `export function FilterChips({ types, active, onSelect }: { types: ProjectType[]; active: ChipValue; onSelect: (v: ChipValue) => void }): JSX.Element`

- [ ] **Step 1: Criar `components/projetos/FilterChips.tsx`**

```tsx
"use client";

import type { ProjectType } from "@/types/case";
import { PROJECT_TYPE_COLOR, PROJECT_TYPE_LABEL } from "@/lib/projectTypes";

export type ChipValue = ProjectType | "all";

/**
 * Chips de filtro da vitrine. `types` = tipos com projeto publicado (vem do
 * page). Scroll horizontal com snap no mobile; alvos ≥44px.
 */
export function FilterChips({
  types,
  active,
  onSelect,
}: {
  types: ProjectType[];
  active: ChipValue;
  onSelect: (v: ChipValue) => void;
}) {
  const chips: { value: ChipValue; label: string; color: string }[] = [
    { value: "all", label: "Todos", color: "#FB3640" },
    ...types.map((t) => ({
      value: t as ChipValue,
      label: PROJECT_TYPE_LABEL[t],
      color: PROJECT_TYPE_COLOR[t],
    })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Filtrar projetos por tipo"
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x"
    >
      {chips.map((chip) => {
        const isActive = chip.value === active;
        return (
          <button
            key={chip.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(chip.value)}
            className={`flex min-h-[44px] flex-shrink-0 snap-start items-center gap-2 whitespace-nowrap border px-4 text-[0.7rem] uppercase tracking-[0.22em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2ED]/60 ${
              isActive
                ? "border-[#F5F2ED]/60 text-[#F5F2ED]"
                : "border-[#F5F2ED]/15 text-[#F5F2ED]/55 hover:border-[#F5F2ED]/35 hover:text-[#F5F2ED]/85"
            }`}
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: isActive ? chip.color : "transparent",
                border: isActive ? "none" : `1px solid ${chip.color}80`,
              }}
            />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/projetos/FilterChips.tsx
git commit -m "feat(projetos): FilterChips (Todos + tipos com projeto)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Header e Footer da vitrine

Topo fino sticky (logo + título + link "experiência ↗") e rodapé CTA (WhatsApp + e-mail fallback).

**Files:**
- Create: `components/projetos/GalleryHeader.tsx`
- Create: `components/projetos/GalleryFooter.tsx`

**Interfaces:**
- Produces: `export function GalleryHeader(): JSX.Element`; `export function GalleryFooter(): JSX.Element`

- [ ] **Step 1: Criar `components/projetos/GalleryHeader.tsx`**

```tsx
import Link from "next/link";

/** Topo fino e sticky da vitrine. Link de volta pra Paisagem imersiva. */
export function GalleryHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#F5F2ED]/10 bg-[#000F08]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-sm tracking-[0.2em] text-[#F5F2ED]"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
        >
          ·CbM
        </Link>
        <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[#F5F2ED]/45">
          Projetos
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-[#F5F2ED]/60 transition-colors hover:text-[#F5F2ED] focus-visible:text-[#F5F2ED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F2ED]/60"
        >
          experiência <span aria-hidden style={{ color: "#FB3640" }}>↗</span>
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Criar `components/projetos/GalleryFooter.tsx`**

```tsx
/** Rodapé CTA da vitrine. WhatsApp primário + e-mail secundário. */
const WHATSAPP_NUMBER = "5548999916638"; // +55 48 99991-6638
const EMAIL = "matheusmendes077@gmail.com";

export function GalleryFooter() {
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Olá! Vi o portfólio da Coded by M e gostaria de conversar sobre um projeto.",
  )}`;
  return (
    <footer className="mt-20 border-t border-[#F5F2ED]/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <p
          className="text-2xl leading-tight text-[#F5F2ED]"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 500 }}
        >
          Tem um projeto em mente?
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#FB3640]/60 bg-[#FB3640]/10 px-6 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[#F5F2ED] transition-colors duration-300 hover:border-[#FB3640] hover:bg-[#FB3640] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640]"
          >
            Falar no WhatsApp
            <span aria-hidden>↗</span>
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Projeto — Coded by M")}`}
            className="text-[0.65rem] uppercase tracking-[0.24em] text-[#F5F2ED]/55 underline-offset-4 transition-colors hover:text-[#F5F2ED] hover:underline focus-visible:text-[#F5F2ED] focus-visible:outline-none"
          >
            ou e-mail
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verificar tipos e lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/projetos/GalleryHeader.tsx components/projetos/GalleryFooter.tsx
git commit -m "feat(projetos): header sticky + footer CTA (WhatsApp/email)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: `ProjetosGallery` (ilha client) — filtro + faixas

Componente client que recebe as faixas já montadas e controla o chip ativo, alternando a visibilidade das faixas. Inclui a intro (título + subtítulo) e os chips.

**Files:**
- Create: `components/projetos/ProjetosGallery.tsx`

**Interfaces:**
- Consumes: `ProjectBand` de `@/lib/galleryData`; `FilterChips` + `ChipValue`; `TypeBand`.
- Produces: `export function ProjetosGallery({ bands }: { bands: ProjectBand[] }): JSX.Element`

- [ ] **Step 1: Criar `components/projetos/ProjetosGallery.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { ProjectBand } from "@/lib/galleryData";
import { FilterChips, type ChipValue } from "./FilterChips";
import { TypeBand } from "./TypeBand";

/**
 * Corpo client da vitrine. As faixas chegam prontas do Server Component; aqui
 * só controlamos o filtro (chip ativo) alternando a visibilidade via CSS — as
 * faixas continuam no HTML inicial (SEO + funciona sem JS no estado "Todos").
 */
export function ProjetosGallery({ bands }: { bands: ProjectBand[] }) {
  const [active, setActive] = useState<ChipValue>("all");
  const types = bands.map((b) => b.type);

  return (
    <main className="mx-auto min-h-dvh max-w-6xl px-5 pb-10 pt-12">
      {/* Intro. */}
      <div className="mb-8">
        <h1
          className="text-4xl leading-none tracking-tight text-[#F5F2ED] md:text-5xl"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
        >
          Projetos
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#F5F2ED]/60">
          Seleção de trabalhos por tipo de entrega — do conceito ao site no ar.
        </p>
      </div>

      {/* Filtro. */}
      <div className="mb-12">
        <FilterChips types={types} active={active} onSelect={setActive} />
      </div>

      {/* Faixas. */}
      <div className="flex flex-col gap-16">
        {bands.map((band, i) => (
          <TypeBand
            key={band.type}
            band={band}
            index={i}
            hidden={active !== "all" && active !== band.type}
          />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar tipos e lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/projetos/ProjetosGallery.tsx
git commit -m "feat(projetos): ProjetosGallery (intro + filtro + faixas)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Rota `app/projetos/page.tsx` + metadata/OG

Server Component que monta as faixas, define metadata/OG própria da rota e renderiza header + gallery + footer.

**Files:**
- Create: `app/projetos/page.tsx`

**Interfaces:**
- Consumes: `getPublishedBands` de `@/lib/galleryData`; `GalleryHeader`, `ProjetosGallery`, `GalleryFooter`.

- [ ] **Step 1: Criar `app/projetos/page.tsx`**

```tsx
import type { Metadata } from "next";
import { getPublishedBands } from "@/lib/galleryData";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { GalleryFooter } from "@/components/projetos/GalleryFooter";
import { ProjetosGallery } from "@/components/projetos/ProjetosGallery";

export const metadata: Metadata = {
  title: "Projetos · Coded by M",
  description:
    "Seleção de projetos da Coded by M — landing pages e sites institucionais premium, do conceito ao site no ar.",
  openGraph: {
    title: "Projetos · Coded by M",
    description:
      "Seleção de projetos da Coded by M — landing pages e sites institucionais premium.",
    type: "website",
    images: ["/cases/machado/desktop-tall.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projetos · Coded by M",
    description:
      "Seleção de projetos da Coded by M — landing pages e sites institucionais premium.",
    images: ["/cases/machado/desktop-tall.webp"],
  },
};

export default function ProjetosPage() {
  const bands = getPublishedBands();
  return (
    <div className="min-h-dvh bg-[#000F08] text-[#F5F2ED]">
      <GalleryHeader />
      <ProjetosGallery bands={bands} />
      <GalleryFooter />
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos, lint e build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: PASS; a rota `/projetos` aparece na lista de rotas do build como estática.

- [ ] **Step 3: Checagem visual no dev**

Run: `npm run dev` e abrir `/projetos`. Verificar:
- Faixas "Landing Pages" e "Sites Institucionais" renderizam com seus projetos publicados.
- Chips filtram (Todos / Landing Pages / Sites Institucionais).
- Card → `/cases/[slug]`; "ver no ar ↗" abre o site em nova aba.
- Header sticky e footer com CTA WhatsApp.
Encerrar o dev.

- [ ] **Step 4: Commit**

```bash
git add app/projetos/page.tsx
git commit -m "feat(projetos): rota /projetos com metadata/OG propria

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Passe de responsivo, a11y e reduced-motion

Validar e ajustar nos 3 breakpoints, conferir foco/contraste e a entrada em stagger respeitando `prefers-reduced-motion`.

**Files:**
- Modify (se necessário após inspeção): `components/projetos/TypeBand.tsx`, `components/projetos/ProjetoCard.tsx`, `components/projetos/ProjetosGallery.tsx`

**Interfaces:**
- Sem novas exportações.

- [ ] **Step 1: Adicionar entrada em stagger na grade (atrás de reduced-motion)**

Em `components/projetos/TypeBand.tsx`, dar uma classe utilitária de entrada aos cards usando o keyframe já existente em `globals.css` (`landscape-ui-enter`, que já respeita `prefers-reduced-motion`). Aplicar com `animationDelay` por índice:

No `.map` dos cards, envolver cada `ProjetoCard` num wrapper com a classe e delay:

```tsx
{band.projects.map((project, i) => (
  <div
    key={project.slug}
    className="landscape-ui-stagger"
    style={{ animationDelay: `${i * 0.04}s` }}
  >
    <ProjetoCard project={project} featured={i === 0} />
  </div>
))}
```

Remover o `key` antigo do `ProjetoCard` (a key passa pro wrapper). O `md:col-span-2` do destaque precisa ficar no wrapper agora, então passar `featured` também influencia o wrapper:

```tsx
{band.projects.map((project, i) => (
  <div
    key={project.slug}
    className={`landscape-ui-stagger ${i === 0 ? "md:col-span-2" : ""}`}
    style={{ animationDelay: `${i * 0.04}s` }}
  >
    <ProjetoCard project={project} featured={i === 0} />
  </div>
))}
```

E remover o `md:col-span-2` de dentro do `ProjetoCard` (a className `featured ? "md:col-span-2" : ""`), trocando por string vazia, já que o span agora é do wrapper:

```tsx
className={`group relative flex h-full flex-col overflow-hidden border border-[#F5F2ED]/15 bg-[#070B08] transition-colors duration-300 hover:border-[#F5F2ED]/40 focus-within:border-[#F5F2ED]/50`}
```

(`h-full` garante que o card preencha o wrapper na grade.)

- [ ] **Step 2: Verificar tipos, lint e build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 3: Checagem responsiva e a11y no dev**

Run: `npm run dev`. Em `/projetos`:
- Larguras 375 / 768 / 1024: grade colapsa 1→2→3 colunas; chips rolam no mobile; sem scroll horizontal no conteúdo.
- Tab navega por chips → cards (link do card) → "ver no ar" → CTA do footer, com foco visível em cada um.
- Com `prefers-reduced-motion` ativo (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce): cards aparecem sem animação e o zoom no hover não ocorre.
Encerrar o dev.

- [ ] **Step 4: Commit**

```bash
git add components/projetos/TypeBand.tsx components/projetos/ProjetoCard.tsx
git commit -m "feat(projetos): entrada em stagger + passe responsivo/a11y

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Rota `/projetos` Server Component + ilha client → Tasks 7, 8. ✔
- Faixas por tipo, ordem fixa, só publicados, sem faixas vazias → Tasks 2, 4. ✔
- Filtro por chips (Todos + tipos com projeto) → Tasks 5, 7. ✔
- Card → case; "ver no ar" → siteUrl sem aninhar âncoras; só com siteUrl → Task 3. ✔
- Vocabulário visual (HUD, hairline, triângulo, numeral-fantasma) → Tasks 3, 4. ✔
- Header sticky + footer CTA WhatsApp → Task 6. ✔
- Metadata/OG própria → Task 8. ✔
- Refactor `PROJECT_TYPE_COLOR` → `lib/projectTypes.ts` sem regressão → Task 1. ✔
- Responsivo / a11y / reduced-motion / CLS / foco → Tasks 3, 5, 9. ✔
- Rótulos comerciais → Task 1 (`PROJECT_TYPE_LABEL`). ✔

**Placeholder scan:** `WHATSAPP_NUMBER` é o único placeholder, intencional e sinalizado (pendência de input do usuário, declarada no spec e no Global Constraints). OG usa um asset existente (`/cases/machado/desktop-tall.webp`) até haver uma OG dedicada. Sem TODOs vagos.

**Type consistency:** `ProjectBand`, `getPublishedBands`, `ChipValue`, `ProjetoCard({project, featured})`, `TypeBand({band, index, hidden})`, `FilterChips({types, active, onSelect})`, `ProjetosGallery({bands})` — usados de forma consistente entre tasks. `PROJECT_TYPE_COLOR/LABEL/ORDER` definidos na Task 1 e consumidos depois. ✔

## Pendência de input do usuário

- ~~Número do WhatsApp~~ — fornecido: `5548999916638`.
- (Opcional, futuro) Imagem OG dedicada (1200×630); por ora reusa um preview
  existente. O usuário vai adicionar 5/6 projetos depois — a vitrine os mostra
  automaticamente assim que entrarem em `data/cases.ts` como `published`.
```
