# Case Page (Device Showcase) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar `/cases/[slug]` num showcase premium e técnico que mostra o site (desktop + responsivo) em molduras de device com scroll vivo, reveals e toques triangulados da marca.

**Architecture:** Componentes primitivos isolados (`BrowserFrame`, `PhoneFrame`, `LiveScreenshot`, `Reveal`) compostos por seções (`CaseHero` refatorado, `CaseScreens`, `CaseResponsive`, `CaseOverview`/`CaseReturnCTA` refinados). Server Components para layout/texto; Client Components só onde há interação (scroll/reveal/animação).

**Tech Stack:** Next 14 App Router, React, Tailwind, GSAP (já dep), Three/R3F (mesh do hero, reuso de `TerrainBackground`).

**Verificação (sem test runner neste repo):** cada tarefa termina com `npx tsc --noEmit` (compila) + checagem visual manual no `localhost:3000` + commit. Playwright só sob pedido do usuário.

**Spec:** `docs/superpowers/specs/2026-06-06-case-page-device-showcase-design.md`

**Tokens da marca:** off-white `#F5F2ED`, signal-red `#FB3640`, deep-green `#000F08`, chrome `#0E1810`. Fontes: `font-display` (Panchang), `font-body` (Satoshi). Classes `cbm-*` já existem no Tailwind (usadas pelas seções atuais).

---

## File Structure

- **Criar:**
  - `components/case/Reveal.tsx` — wrapper de entrada no scroll.
  - `components/case/LiveScreenshot.tsx` — screenshot que rola sozinha + fallback.
  - `components/case/BrowserFrame.tsx` — moldura de browser.
  - `components/case/PhoneFrame.tsx` — moldura de celular.
  - `components/case/CaseScreens.tsx` — seção "As telas" (grade de recortes).
  - `components/case/CaseResponsive.tsx` — seção "Responsivo" (phone + mobile-tall).
- **Modificar:**
  - `types/case.ts` — `+ siteUrl?: string`.
  - `data/cases.ts` — `siteUrl` da Machado.
  - `components/case/CaseHero.tsx` — usa `BrowserFrame`+`LiveScreenshot`+mesh; remove colagem.
  - `components/case/CaseOverview.tsx` — envolve em `Reveal`.
  - `components/case/CaseReturnCTA.tsx` — envolve em `Reveal`.
  - `app/cases/[slug]/page.tsx` — compõe novas seções + fade-in.
- **Remover:**
  - `components/case/CaseHeroCollage.tsx`
  - `components/case/CaseGallery.tsx`

---

### Task 1: `Reveal` (entrada no scroll)

**Files:**
- Create: `components/case/Reveal.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Anima a entrada no scroll: fade + sobe + blur→nítido quando entra no viewport.
 * Respeita prefers-reduced-motion (aparece instantâneo). `delay` em ms p/ stagger.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        filter: shown ? "blur(0px)" : "blur(6px)",
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/Reveal.tsx
git commit -m "feat(case): Reveal — entrada no scroll (reusável)"
```

---

### Task 2: `LiveScreenshot` (screenshot que rola sozinha)

**Files:**
- Create: `components/case/LiveScreenshot.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
"use client";

import { useState, type ReactNode } from "react";

/**
 * Screenshot tall (full-page) que rola verticalmente sozinha, devagar, em loop.
 * onError → cai no `fallback`. Pausa em prefers-reduced-motion.
 */
export function LiveScreenshot({
  src,
  alt,
  fallback = null,
  durationSec = 35,
}: {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  durationSec?: number;
}) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) return <>{fallback}</>;
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* biome-ignore lint/a11y/useAltText: alt é repassado */}
      <img
        src={src}
        alt={alt}
        onError={() => setErrored(true)}
        className="live-shot absolute left-0 top-0 w-full object-cover object-top"
        style={{ animationDuration: `${durationSec}s` }}
      />
      <style>{`
        @keyframes live-shot-scroll {
          0% { transform: translateY(0); }
          50% { transform: translateY(-62%); }
          100% { transform: translateY(0); }
        }
        .live-shot {
          animation-name: live-shot-scroll;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .live-shot { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/LiveScreenshot.tsx
git commit -m "feat(case): LiveScreenshot — screenshot full-page com scroll vivo + fallback"
```

---

### Task 3: `BrowserFrame` (moldura de browser)

**Files:**
- Create: `components/case/BrowserFrame.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
import type { ReactNode } from "react";

/**
 * Moldura de browser (chrome mac): barra com 3 dots (1 signal-red) + pill de URL.
 * Bracket triangular vermelho no canto. Corpo em overflow-hidden.
 */
export function BrowserFrame({
  url,
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border border-[#F5F2ED]/15 bg-[#0E1810] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-3 border-b border-[#F5F2ED]/10 bg-[#0b130d] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FB3640]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F5F2ED]/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F5F2ED]/25" />
        </span>
        {url && (
          <span className="ml-1 truncate rounded-sm bg-[#F5F2ED]/[0.06] px-3 py-1 font-body text-[10px] tracking-wide text-[#F5F2ED]/50">
            {url}
          </span>
        )}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 h-3 w-3 border-b border-r border-[#FB3640]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/BrowserFrame.tsx
git commit -m "feat(case): BrowserFrame — moldura de browser on-brand"
```

---

### Task 4: `PhoneFrame` (moldura de celular)

**Files:**
- Create: `components/case/PhoneFrame.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
import type { ReactNode } from "react";

/** Moldura de celular: bezel arredondado + notch, conteúdo em overflow-hidden. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[34px] border-[6px] border-[#0E1810] bg-[#0E1810] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] ring-1 ring-[#F5F2ED]/15">
      <span
        aria-hidden
        className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-[#F5F2ED]/25"
      />
      <div className="overflow-hidden rounded-[28px]">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/PhoneFrame.tsx
git commit -m "feat(case): PhoneFrame — moldura de celular on-brand"
```

---

### Task 5: Dado — `siteUrl` no tipo e na Machado

**Files:**
- Modify: `types/case.ts`
- Modify: `data/cases.ts`

- [ ] **Step 1: Adicionar `siteUrl` ao tipo**

Em `types/case.ts`, dentro de `interface CaseProject`, após `status?: ...` e antes de `preview?`:

```ts
  /** Domínio exibido na barra do BrowserFrame (ex.: "machadoplataformas.com.br"). */
  siteUrl?: string;
```

- [ ] **Step 2: Setar na Machado**

Em `data/cases.ts`, no objeto `machado-plataformas`, logo após a linha `status: "published",` adicione:

```ts
    siteUrl: "machadoplataformas.com.br",
```

> Se o domínio real for outro, troque aqui. Cases sem `siteUrl` → a pill some.

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 4: Commit**

```bash
git add types/case.ts data/cases.ts
git commit -m "feat(case): campo siteUrl (pill de URL do BrowserFrame)"
```

---

### Task 6: Refatorar `CaseHero` (browser frame + mesh + cascata)

**Files:**
- Modify: `components/case/CaseHero.tsx`

- [ ] **Step 1: Reescrever o componente**

Substitua TODO o conteúdo de `components/case/CaseHero.tsx` por:

```tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { CaseProject } from "@/types/case";
import { ProjectFacts } from "@/components/case/ProjectFacts";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { LiveScreenshot } from "@/components/case/LiveScreenshot";
import { LogoMark } from "@/components/ui/LogoMark";

// Mesh triangulado sutil atrás do hero (toque 3D, coesão com a Home).
const TerrainBackground = dynamic(
  () =>
    import("@/components/zones/ServicesSection/TerrainBackground").then(
      (m) => m.default,
    ),
  { ssr: false },
);

export function CaseHero({ project }: { project: CaseProject }) {
  // Cascata de entrada no load.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const step = (i: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease-out ${i * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`,
  });

  return (
    <section
      className="relative flex flex-col lg:grid lg:min-h-screen"
      style={{
        gridTemplateColumns: "1fr 1.1fr",
        background: "#000F08",
        borderBottom: "1px solid rgba(245,242,237,0.06)",
      }}
    >
      {/* Mesh triangulado sutil de fundo */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]">
        <TerrainBackground />
      </div>

      {/* Text side */}
      <div
        className="relative z-10 flex flex-col justify-between px-6 py-12 sm:px-12 sm:py-16 xl:px-16 xl:py-20"
        style={{ borderRight: "1px solid rgba(245,242,237,0.06)" }}
      >
        <div>
          <div className="mb-6 flex items-center gap-3" style={step(0)}>
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/75">
              {project.eyebrow}
            </p>
          </div>

          <h1
            className="font-display font-black uppercase text-cbm-white"
            style={{
              fontSize: "clamp(32px,4.5vw,60px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              ...step(1),
            }}
          >
            {project.title}
          </h1>

          <p
            className="mt-6 max-w-[360px] font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400"
            style={step(2)}
          >
            {project.description}
          </p>

          <div style={step(3)}>
            <ProjectFacts meta={project.meta} />
          </div>
        </div>

        <div className="mt-10" style={step(4)}>
          <Link
            href="#overview"
            className="group inline-flex cursor-pointer flex-col items-start gap-[3px]"
          >
            <span className="inline-flex items-center gap-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-white/90 transition-colors duration-200 group-hover:text-cbm-white">
              Ver o Case
              <span
                className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100"
                aria-hidden="true"
              >
                ↓
              </span>
            </span>
            <span className="block h-px w-full origin-left scale-x-0 bg-cbm-red transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
          </Link>
        </div>
      </div>

      {/* Visual side — browser frame com o desktop rolando */}
      <div className="relative z-10 flex min-h-[320px] items-center justify-center p-6 sm:p-10 lg:min-h-0">
        <div
          className="w-full max-w-[640px]"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1)" : "scale(0.97)",
            transition:
              "opacity 0.8s ease-out 0.25s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s",
          }}
        >
          <BrowserFrame url={project.siteUrl}>
            <div className="aspect-[16/10] w-full">
              <LiveScreenshot
                src={project.preview?.desktop}
                alt={`${project.title} — site desktop`}
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-[#070B08] opacity-20">
                    <LogoMark size={40} />
                  </div>
                }
              />
            </div>
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
```

> Nota: o import do `TerrainBackground` assume `export default` em `components/zones/ServicesSection/TerrainBackground.tsx`. Se o nome de export for outro, ajuste o `.then((m) => m.default)`.

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Checagem visual** — `localhost:3000/cases/machado-plataformas`: hero com texto cascateando à esquerda, browser frame à direita com o desktop rolando, mesh sutil ao fundo.

- [ ] **Step 4: Commit**

```bash
git add components/case/CaseHero.tsx
git commit -m "feat(case): CaseHero com BrowserFrame + scroll vivo + mesh + cascata"
```

---

### Task 7: `CaseScreens` (seção "As telas")

**Files:**
- Create: `components/case/CaseScreens.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/case/Reveal";

/**
 * Grade de recortes do site (hero-* + gallery-*) em painéis emoldurados com
 * brackets, composição assimétrica (a cada 3, um painel largo). Reveal stagger.
 * Some se não houver imagens.
 */
export function CaseScreens({ project }: { project: CaseProject }) {
  const shots = [...project.heroImages, ...project.gallery].filter(Boolean);
  if (shots.length === 0) return null;

  return (
    <section
      className="border-b px-6 py-16 sm:px-12 sm:py-20 xl:px-16 xl:py-24"
      style={{ background: "#000F08", borderColor: "rgba(245,242,237,0.06)" }}
    >
      <div className="mb-10 flex items-center gap-3">
        <span
          className="block h-px w-5 flex-shrink-0"
          style={{ background: "rgba(251,54,64,0.4)" }}
        />
        <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
          As Telas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shots.map((src, i) => {
          const wide = i % 3 === 0; // a cada 3, painel largo
          return (
            <Reveal
              key={src + i}
              delay={(i % 2) * 90}
              className={wide ? "sm:col-span-2" : ""}
            >
              <div className="group relative overflow-hidden border border-[#F5F2ED]/12 bg-[#070B08]">
                {/* brackets HUD */}
                <span className="pointer-events-none absolute left-1.5 top-1.5 z-10 h-2.5 w-2.5 border-l border-t border-[#F5F2ED]/40" />
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 h-2.5 w-2.5 border-b border-r border-[#FB3640]/70" />
                {/* biome-ignore lint/a11y/useAltText: decorativo */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
                    wide ? "aspect-[16/7]" : "aspect-[16/10]"
                  }`}
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/CaseScreens.tsx
git commit -m "feat(case): CaseScreens — grade triangulada de recortes com reveal"
```

---

### Task 8: `CaseResponsive` (seção "Responsivo")

**Files:**
- Create: `components/case/CaseResponsive.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/case/Reveal";
import { PhoneFrame } from "@/components/case/PhoneFrame";
import { LiveScreenshot } from "@/components/case/LiveScreenshot";
import { LogoMark } from "@/components/ui/LogoMark";

/** Seção que mostra a versão mobile no PhoneFrame (mobile-tall rolando). */
export function CaseResponsive({ project }: { project: CaseProject }) {
  const mobile = project.preview?.mobile;
  if (!mobile) return null;

  return (
    <section
      className="border-b px-6 py-16 sm:px-12 sm:py-20 xl:px-16 xl:py-24"
      style={{ background: "#000F08", borderColor: "rgba(245,242,237,0.06)" }}
    >
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-24">
        <Reveal className="max-w-[360px] text-center lg:text-left">
          <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
              Responsivo
            </p>
          </div>
          <h2
            className="font-display font-bold tracking-[-0.02em] text-cbm-white"
            style={{ fontSize: "clamp(22px,2.6vw,32px)", lineHeight: 1.1 }}
          >
            Pensado pra qualquer tela.
          </h2>
          <p className="mt-4 font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400">
            A mesma precisão no mobile — layout, hierarquia e performance
            adaptados, sem perder a identidade.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="w-[230px] sm:w-[260px]">
            <PhoneFrame>
              <div className="aspect-[9/16] w-full">
                <LiveScreenshot
                  src={mobile}
                  alt={`${project.title} — site mobile`}
                  durationSec={28}
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-[#070B08] opacity-20">
                      <LogoMark size={32} />
                    </div>
                  }
                />
              </div>
            </PhoneFrame>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/CaseResponsive.tsx
git commit -m "feat(case): CaseResponsive — PhoneFrame + mobile-tall rolando"
```

---

### Task 9: Refinar `CaseOverview` (Reveal)

**Files:**
- Modify: `components/case/CaseOverview.tsx`

- [ ] **Step 1: Envolver os dois blocos em `Reveal`**

No topo do arquivo, adicione o import:

```tsx
import { Reveal } from "@/components/case/Reveal";
```

Troque o `<div className="flex-1">` (bloco editorial esquerdo) para começar com `<Reveal className="flex-1">` e feche com `</Reveal>` no lugar do `</div>` correspondente. Faça o mesmo com o bloco direito `<div className="w-full lg:w-[280px] lg:flex-shrink-0">` → `<Reveal className="w-full lg:w-[280px] lg:flex-shrink-0" delay={120}>` ... `</Reveal>`.

Resultado do corpo do `<div className="mx-auto ...">`:

```tsx
        <Reveal className="flex-1">
          {/* ...conteúdo editorial existente (eyebrow, h2, body) inalterado... */}
        </Reveal>

        <Reveal className="w-full lg:w-[280px] lg:flex-shrink-0" delay={120}>
          {/* ...bloco "Desafio" existente inalterado... */}
        </Reveal>
```

> Mantenha o conteúdo interno (textos, classes) exatamente como está; só troque as tags `div` externas desses dois blocos por `Reveal` com as props acima.

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/CaseOverview.tsx
git commit -m "feat(case): CaseOverview com reveal no scroll"
```

---

### Task 10: Refinar `CaseReturnCTA` (Reveal)

**Files:**
- Modify: `components/case/CaseReturnCTA.tsx`

- [ ] **Step 1: Envolver o conteúdo em `Reveal`**

Adicione no topo:

```tsx
import { Reveal } from "@/components/case/Reveal";
```

Envolva o conteúdo interno da `<section>` (eyebrow + h2 + p + Link) num único `<Reveal>`:

```tsx
    <section className="flex flex-col items-center justify-center gap-5 px-8 py-32 text-center" style={{ background: "#000F08", borderTop: "1px solid rgba(245,242,237,0.06)" }}>
      <Reveal className="flex flex-col items-center gap-5">
        {/* ...eyebrow, h2, p, Link existentes inalterados... */}
      </Reveal>
    </section>
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add components/case/CaseReturnCTA.tsx
git commit -m "feat(case): CaseReturnCTA com reveal"
```

---

### Task 11: Compor a página + fade-in

**Files:**
- Modify: `app/cases/[slug]/page.tsx`

- [ ] **Step 1: Reescrever o `main` com as novas seções**

Em `app/cases/[slug]/page.tsx`, troque os imports de seção e o JSX do `main`:

Imports (substitua o bloco de imports de componentes de case):

```tsx
import { CaseHero } from "@/components/case/CaseHero";
import { CaseOverview } from "@/components/case/CaseOverview";
import { CaseScreens } from "@/components/case/CaseScreens";
import { CaseResponsive } from "@/components/case/CaseResponsive";
import { CaseReturnCTA } from "@/components/case/CaseReturnCTA";
```

JSX do return:

```tsx
  return (
    <main className="case-fade-in" style={{ background: "#000F08", minHeight: "100vh" }}>
      <CaseHero project={project} />
      <CaseOverview project={project} />
      <CaseScreens project={project} />
      <CaseResponsive project={project} />
      <CaseReturnCTA />
      <style>{`
        @keyframes case-fade-in { from { opacity: 0 } to { opacity: 1 } }
        .case-fade-in { animation: case-fade-in 0.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .case-fade-in { animation: none; } }
      `}</style>
    </main>
  );
```

> `CaseGallery` sai (fundido em `CaseScreens`). `inline <style>` num Server Component renderiza ok (string estática).

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 3: Checagem visual** — `localhost:3000/cases/machado-plataformas`: ordem Hero → Visão geral → As Telas → Responsivo → Voltar, com fade-in da página e reveals ao rolar.

- [ ] **Step 4: Commit**

```bash
git add app/cases/[slug]/page.tsx
git commit -m "feat(case): compõe Hero/Overview/Screens/Responsive/Return + fade-in"
```

---

### Task 12: Remover componentes obsoletos

**Files:**
- Delete: `components/case/CaseHeroCollage.tsx`
- Delete: `components/case/CaseGallery.tsx`

- [ ] **Step 1: Confirmar que não há mais imports**

Run: `rg "CaseHeroCollage|CaseGallery" components app` (ou Grep).
Expected: nenhum resultado (já trocados nas tasks 6 e 11).

- [ ] **Step 2: Remover os arquivos**

```bash
git rm components/case/CaseHeroCollage.tsx components/case/CaseGallery.tsx
```

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` → EXIT 0.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(case): remove CaseHeroCollage e CaseGallery (fundidos)"
```

---

### Task 13: Verificação final + lint

**Files:** —

- [ ] **Step 1: Typecheck + lint completos**

Run: `npx tsc --noEmit` → EXIT 0.
Run: `npm run lint` (se existir) → sem erros novos.

- [ ] **Step 2: Checklist visual manual (`localhost:3000`)**

- [ ] Hero: texto cascateia, BrowserFrame com desktop rolando, mesh sutil, pill com `machadoplataformas.com.br`.
- [ ] Visão geral: reveal ao entrar; "Desafio" no bloco lateral.
- [ ] As Telas: grade com painéis (1 largo a cada 3), brackets, reveal stagger, hover scale.
- [ ] Responsivo: PhoneFrame com mobile rolando + texto.
- [ ] Voltar: reveal + link `/`.
- [ ] **Mobile** (viewport ~390px): hero empilha, frames encolhem, grade vira 1 coluna.
- [ ] **Degradação:** abrir um case coming-soon (ex.: `/cases/estudio-mendes`) → não quebra (placeholders/seções ocultas), sem imagem quebrada.

- [ ] **Step 3: Avisar o usuário** o que testar e aguardar feedback. (Sem commit — verificação.)

---

## Self-Review (preenchido pelo autor do plano)

- **Cobertura do spec:** Hero device frame (T6), Overview (T9), As Telas/desktop (T7), Responsivo (T8), Return (T10), page+fade (T11), siteUrl (T5), primitivos Reveal/LiveScreenshot/BrowserFrame/PhoneFrame (T1-4), remoção dos antigos (T12), degradação + mobile (T13). ✓
- **Placeholders:** nenhum "TODO/TBD"; código completo em cada step. ✓
- **Consistência de tipos:** `CaseProject.siteUrl?` (T5) usado em `BrowserFrame url` (T3/T6); `LiveScreenshot` props (`src?`, `alt`, `fallback`, `durationSec`) idênticas em T2/T6/T8; `Reveal` props (`children`, `delay`, `className`) idênticas em T1/T7/T8/T9/T10. ✓
- **Ponto a confirmar em execução:** export real de `TerrainBackground` (default vs nomeado) — ajustar o dynamic import na T6 se necessário.
