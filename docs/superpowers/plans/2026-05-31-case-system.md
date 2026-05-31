# Case System V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/cases/[slug]` page template with Case Hero, Project Facts, Overview, Gallery, and Return CTA — plus add a Case System section to the UI Lab.

**Architecture:** Static data layer (`types/case.ts` + `data/cases.ts`) feeds standalone React server components in `components/case/`. The dynamic route `app/cases/[slug]/page.tsx` composes all sections. UI Lab section 06 imports and previews each component.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, CBM design tokens.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `types/case.ts` | `CaseProject` interface |
| Create | `data/cases.ts` | Machado Plataformas sample data |
| Create | `components/ui/LogoMark.tsx` | Shared SVG mark (extracted from UI Lab) |
| Create | `components/case/CaseHeroCollage.tsx` | 5-panel asymmetric image grid |
| Create | `components/case/ProjectFacts.tsx` | 2×2 metadata grid |
| Create | `components/case/CaseHero.tsx` | Full split hero section |
| Create | `components/case/CaseOverview.tsx` | Overview + challenge block |
| Create | `components/case/CaseGallery.tsx` | Asymmetric print gallery |
| Create | `components/case/CaseReturnCTA.tsx` | Return to Paisagem Digital CTA |
| Create | `app/cases/[slug]/page.tsx` | Dynamic route, composes all sections |
| Modify | `app/ui-lab/page.tsx` | Add section 06 — Case System |

---

## Task 1: Type definition

**Files:**
- Create: `types/case.ts`

- [ ] **Create `types/case.ts`**

```typescript
export interface CaseMeta {
  cliente: string;
  setor: string;
  tipo: string;
  ano: string;
}

export interface CaseOverviewData {
  heading: string;
  body: string[];
  challenge: string;
}

export interface CaseProject {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: CaseMeta;
  heroImages: string[];
  overview: CaseOverviewData;
  gallery: string[];
}
```

- [ ] **Verify TypeScript accepts the file**

```bash
cd "C:\Dev\Coded by M\cbm-port" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add types/case.ts
git commit -m "feat(case): add CaseProject type definition"
```

---

## Task 2: Sample data

**Files:**
- Create: `data/cases.ts`

- [ ] **Create `data/cases.ts`**

```typescript
import type { CaseProject } from "@/types/case";

export const cases: CaseProject[] = [
  {
    slug: "machado-plataformas",
    eyebrow: "Web Design Premium / Case Study",
    title: "Machado Plataformas",
    description:
      "Site institucional premium para uma empresa técnica de implementos rodoviários, com foco em percepção de valor, clareza comercial e presença digital mais profissional.",
    meta: {
      cliente: "Machado Plataformas",
      setor: "Implementos Rodoviários",
      tipo: "Site Institucional",
      ano: "2025",
    },
    heroImages: ["", "", "", "", ""],
    overview: {
      heading: "O que foi construído e por quê",
      body: [
        "A Machado Plataformas é uma empresa técnica de alto valor real, mas com uma presença digital que não refletia sua capacidade. O site anterior comunicava commodity, não expertise.",
        "O projeto partiu de um diagnóstico claro: o problema não era o produto, era a percepção. A solução foi construir uma presença digital que transmitisse a seriedade e a precisão que a empresa já tinha internamente.",
        "Cada decisão de design — da hierarquia tipográfica ao sistema de cores — foi orientada por um único critério: o visitante precisa sentir confiança antes de ler a primeira linha.",
      ],
      challenge:
        "Empresa técnica de alto valor percebido como commodity. Presença digital genérica não refletia a capacidade real do negócio.",
    },
    gallery: ["", "", "", "", ""],
  },
];

export function getCaseBySlug(slug: string): CaseProject | undefined {
  return cases.find((c) => c.slug === slug);
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add data/cases.ts
git commit -m "feat(case): add Machado Plataformas sample data"
```

---

## Task 3: Shared LogoMark component

**Files:**
- Create: `components/ui/LogoMark.tsx`

- [ ] **Create `components/ui/LogoMark.tsx`**

```tsx
export function LogoMark({ size = 26 }: { size?: number }) {
  const h = Math.round((size * 161) / 142);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 142 161"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 148.039V59.0391L53.5 104.438"
        stroke="#F5F2ED"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M130.5 103.039V19.0391L85.5 67.2944"
        stroke="#F5F2ED"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 18.0391L130.5 147.039"
        stroke="#FB3640"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add components/ui/LogoMark.tsx
git commit -m "feat(ui): extract LogoMark as shared component"
```

---

## Task 4: CaseHeroCollage

**Files:**
- Create: `components/case/CaseHeroCollage.tsx`

- [ ] **Create `components/case/CaseHeroCollage.tsx`**

Each panel: if `src` is non-empty render `<img>` filling the panel; otherwise render placeholder (dark bg + centered LogoMark at 20% opacity).

```tsx
import { LogoMark } from "@/components/ui/LogoMark";

function CollagePanel({
  src,
  className = "",
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ background: "#070B08", ...style }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center opacity-20">
          <LogoMark size={32} />
        </div>
      )}
    </div>
  );
}

export function CaseHeroCollage({ images }: { images: string[] }) {
  const [i0, i1, i2, i3, i4] = images;

  return (
    <div
      className="grid h-full"
      style={{
        gridTemplateColumns: "3fr 2fr",
        gridTemplateRows: "2fr 1.1fr 1.1fr",
        gap: "3px",
        padding: "3px",
        background: "#000F08",
      }}
    >
      {/* Panel 1 — tall, spans 2 rows */}
      <CollagePanel
        src={i0 ?? ""}
        style={{ gridRow: "1 / 3" }}
      />
      {/* Panel 2 — top right */}
      <CollagePanel src={i1 ?? ""} />
      {/* Panel 3 — mid right */}
      <CollagePanel src={i2 ?? ""} />
      {/* Panel 4 — bottom wide */}
      <CollagePanel src={i3 ?? ""} />
      {/* Panel 5 — bottom right */}
      <CollagePanel src={i4 ?? ""} />
    </div>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add components/case/CaseHeroCollage.tsx
git commit -m "feat(case): add CaseHeroCollage — 5-panel asymmetric image grid"
```

---

## Task 5: ProjectFacts

**Files:**
- Create: `components/case/ProjectFacts.tsx`

- [ ] **Create `components/case/ProjectFacts.tsx`**

```tsx
import type { CaseMeta } from "@/types/case";

export function ProjectFacts({ meta }: { meta: CaseMeta }) {
  const fields: { label: string; value: string }[] = [
    { label: "Cliente", value: meta.cliente },
    { label: "Setor",   value: meta.setor   },
    { label: "Tipo",    value: meta.tipo    },
    { label: "Ano",     value: meta.ano     },
  ];

  return (
    <div
      className="mt-10 border-t pt-8"
      style={{ borderColor: "rgba(245,242,237,0.06)" }}
    >
      <p className="mb-5 font-body text-[8px] uppercase tracking-[0.35em] text-cbm-gray-600">
        Projeto
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-600">
              {label}
            </p>
            <p className="mt-1 font-body text-[13px] font-medium text-cbm-gray-100">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add components/case/ProjectFacts.tsx
git commit -m "feat(case): add ProjectFacts — 2x2 metadata grid"
```

---

## Task 6: CaseHero

**Files:**
- Create: `components/case/CaseHero.tsx`

- [ ] **Create `components/case/CaseHero.tsx`**

Full split hero. Uses `CaseHeroCollage` and `ProjectFacts`. Text Link CTA pattern inline (same approved design, standalone — no import from UI Lab).

```tsx
import Link from "next/link";
import type { CaseProject } from "@/types/case";
import { CaseHeroCollage } from "@/components/case/CaseHeroCollage";
import { ProjectFacts } from "@/components/case/ProjectFacts";

export function CaseHero({ project }: { project: CaseProject }) {
  return (
    <section
      className="grid min-h-screen"
      style={{
        gridTemplateColumns: "1fr 1.1fr",
        background: "#000F08",
        borderBottom: "1px solid rgba(245,242,237,0.06)",
      }}
    >
      {/* ── Text side */}
      <div
        className="flex flex-col justify-between px-12 py-16 xl:px-16 xl:py-20"
        style={{ borderRight: "1px solid rgba(245,242,237,0.06)" }}
      >
        <div>
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/75">
              {project.eyebrow}
            </p>
          </div>

          {/* Title */}
          <h1
            className="font-display font-black uppercase text-cbm-white"
            style={{
              fontSize: "clamp(36px,4.5vw,60px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
            }}
          >
            {project.title}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-[360px] font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400">
            {project.description}
          </p>

          {/* Project Facts */}
          <ProjectFacts meta={project.meta} />
        </div>

        {/* CTA — Text Link CTA pattern (Button System V1 approved) */}
        <div className="mt-10">
          <Link
            href={`#overview`}
            className="group inline-flex cursor-pointer flex-col items-start gap-[3px]"
          >
            <span className="inline-flex items-center gap-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-white/90 transition-colors duration-200 group-hover:text-cbm-white">
              Ver o Case
              <span
                className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100"
                aria-hidden="true"
              >
                →
              </span>
            </span>
            <span className="block h-px w-full origin-left scale-x-0 bg-cbm-red transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
          </Link>
        </div>
      </div>

      {/* ── Visual side */}
      <CaseHeroCollage images={project.heroImages} />
    </section>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add components/case/CaseHero.tsx
git commit -m "feat(case): add CaseHero — split hero with collage and Project Facts"
```

---

## Task 7: CaseOverview

**Files:**
- Create: `components/case/CaseOverview.tsx`

- [ ] **Create `components/case/CaseOverview.tsx`**

```tsx
import type { CaseProject } from "@/types/case";

export function CaseOverview({ project }: { project: CaseProject }) {
  const { heading, body, challenge } = project.overview;

  return (
    <section
      id="overview"
      className="border-b px-12 py-20 xl:px-16 xl:py-24"
      style={{
        background: "#000F08",
        borderColor: "rgba(245,242,237,0.06)",
      }}
    >
      <div className="mx-auto flex max-w-[1200px] items-start gap-16 lg:gap-24">

        {/* Left — editorial text */}
        <div className="flex-1">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
              Visão Geral
            </p>
          </div>

          <h2
            className="font-display font-bold tracking-[-0.02em] text-cbm-white"
            style={{ fontSize: "clamp(24px,3vw,36px)", lineHeight: 1.1 }}
          >
            {heading}
          </h2>

          <div className="mt-6 flex max-w-[520px] flex-col gap-4">
            {body.map((paragraph, i) => (
              <p
                key={i}
                className="font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right — challenge block */}
        <div className="w-[280px] flex-shrink-0">
          <div className="border border-cbm-gray-800 p-6">
            <p className="mb-3 font-body text-[8px] uppercase tracking-[0.35em] text-cbm-gray-600">
              Desafio
            </p>
            <p className="font-body text-[13px] font-light leading-[1.75] text-cbm-gray-400">
              {challenge}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add components/case/CaseOverview.tsx
git commit -m "feat(case): add CaseOverview — editorial text + challenge block"
```

---

## Task 8: CaseGallery

**Files:**
- Create: `components/case/CaseGallery.tsx`

- [ ] **Create `components/case/CaseGallery.tsx`**

Asymmetric grid matching hero collage pattern. First item spans 2 rows.

```tsx
import type { CaseProject } from "@/types/case";
import { LogoMark } from "@/components/ui/LogoMark";

function GalleryPanel({ src }: { src: string }) {
  return (
    <div
      className="overflow-hidden"
      style={{ background: "#070B08", minHeight: 220 }}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" aria-hidden="true" />
      ) : (
        <div className="flex h-full w-full items-center justify-center opacity-20" style={{ minHeight: 220 }}>
          <LogoMark size={28} />
        </div>
      )}
    </div>
  );
}

export function CaseGallery({ project }: { project: CaseProject }) {
  const [g0, g1, g2, g3, g4] = project.gallery;

  return (
    <section
      className="border-b px-12 py-20 xl:px-16 xl:py-24"
      style={{
        background: "#000F08",
        borderColor: "rgba(245,242,237,0.06)",
      }}
    >
      <p className="mb-6 font-body text-[9px] uppercase tracking-[0.35em] text-cbm-gray-600">
        Resultado Visual
      </p>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: "3px",
          background: "#000F08",
        }}
      >
        {/* Main panel — spans 2 rows */}
        <div style={{ gridRow: "1 / 3" }}>
          <GalleryPanel src={g0 ?? ""} />
        </div>
        <GalleryPanel src={g1 ?? ""} />
        <GalleryPanel src={g2 ?? ""} />
        <GalleryPanel src={g3 ?? ""} />
        <GalleryPanel src={g4 ?? ""} />
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add components/case/CaseGallery.tsx
git commit -m "feat(case): add CaseGallery — asymmetric print grid"
```

---

## Task 9: CaseReturnCTA

**Files:**
- Create: `components/case/CaseReturnCTA.tsx`

- [ ] **Create `components/case/CaseReturnCTA.tsx`**

Ghost-style link back to the homepage (Paisagem Digital). Centered, no Primary CTA — the user chooses the next project in the 3D landscape.

```tsx
import Link from "next/link";

export function CaseReturnCTA() {
  return (
    <section
      className="flex flex-col items-center justify-center gap-5 px-8 py-32 text-center"
      style={{ background: "#000F08" }}
    >
      <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/60">
        Continuar Explorando
      </p>

      <h2
        className="font-display font-black text-cbm-white"
        style={{
          fontSize: "clamp(28px,3.5vw,44px)",
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
        }}
      >
        Voltar à<br />Paisagem Digital
      </h2>

      <p className="max-w-[320px] font-body text-[14px] font-light leading-[1.75] text-cbm-gray-400">
        Mais projetos aguardam na travessia. Cada fragmento é um trabalho construído.
      </p>

      {/* Ghost button — Typography only, reveals on hover */}
      <Link
        href="/"
        className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-gray-400 transition-colors duration-200 hover:text-cbm-white focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-white/20 focus-visible:outline-offset-[5px]"
      >
        ← Explorar a Paisagem
      </Link>
    </section>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add components/case/CaseReturnCTA.tsx
git commit -m "feat(case): add CaseReturnCTA — return to Paisagem Digital"
```

---

## Task 10: Dynamic route `/cases/[slug]`

**Files:**
- Create: `app/cases/[slug]/page.tsx`

- [ ] **Create `app/cases/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases, getCaseBySlug } from "@/data/cases";
import { CaseHero } from "@/components/case/CaseHero";
import { CaseOverview } from "@/components/case/CaseOverview";
import { CaseGallery } from "@/components/case/CaseGallery";
import { CaseReturnCTA } from "@/components/case/CaseReturnCTA";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = getCaseBySlug(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Coded by M`,
    description: project.description,
  };
}

export default function CasePage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getCaseBySlug(params.slug);
  if (!project) notFound();

  return (
    <main style={{ background: "#000F08", minHeight: "100vh" }}>
      <CaseHero project={project} />
      <CaseOverview project={project} />
      <CaseGallery project={project} />
      <CaseReturnCTA />
    </main>
  );
}
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Open in browser and verify the page renders**

Navigate to `http://localhost:3001/cases/machado-plataformas`.

Expected: page renders with hero (placeholder panels + editorial text), overview, gallery (placeholder panels), and return CTA. No console errors.

- [ ] **Verify 404 for unknown slug**

Navigate to `http://localhost:3001/cases/nao-existe`.

Expected: Next.js 404 page.

- [ ] **Commit**

```bash
git add app/cases/
git commit -m "feat(case): add /cases/[slug] dynamic route with Machado Plataformas"
```

---

## Task 11: UI Lab — Case System section

**Files:**
- Modify: `app/ui-lab/page.tsx`

- [ ] **Add `CaseProject` import data and update `SYSTEM_STATUS`**

At the top of `app/ui-lab/page.tsx`, add imports after the existing imports:

```tsx
import { CaseHero } from "@/components/case/CaseHero";
import { ProjectFacts } from "@/components/case/ProjectFacts";
import { CaseOverview } from "@/components/case/CaseOverview";
import { CaseGallery } from "@/components/case/CaseGallery";
import { CaseReturnCTA } from "@/components/case/CaseReturnCTA";
import { getCaseBySlug } from "@/data/cases";
```

Then in `SYSTEM_STATUS`, add after the `"Forms"` entry:

```tsx
{ label: "Case System",      status: "progress" },
```

- [ ] **Update the nav index in `LabPageHeader`**

In the nav index array inside `LabPageHeader`, add after `"05 — Playground"`:

```tsx
{ n: "06", label: "Case System", href: "#case-system" },
```

- [ ] **Update Playground label from `05` to `05` (already correct) and add the new SectionBlock**

Before the `{/* Footer */}` comment and after the closing `</SectionBlock>` of the Playground section, add:

```tsx
{/* ── 06 CASE SYSTEM ───────────────────────────────────────────────────── */}
<SectionBlock id="case-system" label="06 — Case System" title="Case System — V1">

  <p className="mb-12 max-w-[480px] font-body text-[13px] font-light leading-[1.75] text-cbm-gray-600">
    Destino final dos projetos da Paisagem Digital. Rota{" "}
    <code className="font-body text-[12px] text-cbm-red/60">/cases/[slug]</code>{" "}
    com split hero, galeria assimétrica e retorno ao 3D.
  </p>

  <div className="flex flex-col gap-16">

    {/* ── Case Hero */}
    <div>
      <CLabel>Case Hero V1 — Split 50/50 · collage 5 painéis · Project Facts</CLabel>
      <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
        {(() => {
          const project = getCaseBySlug("machado-plataformas");
          if (!project) return null;
          return <CaseHero project={project} />;
        })()}
      </div>
    </div>

    {/* ── Overview */}
    <div>
      <CLabel>Case Overview — texto editorial + bloco de desafio</CLabel>
      <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
        {(() => {
          const project = getCaseBySlug("machado-plataformas");
          if (!project) return null;
          return <CaseOverview project={project} />;
        })()}
      </div>
    </div>

    {/* ── Gallery */}
    <div>
      <CLabel>Case Gallery — grid assimétrico de prints</CLabel>
      <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
        {(() => {
          const project = getCaseBySlug("machado-plataformas");
          if (!project) return null;
          return <CaseGallery project={project} />;
        })()}
      </div>
    </div>

    {/* ── Return CTA */}
    <div>
      <CLabel>Case Return CTA — volta à Paisagem Digital</CLabel>
      <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
        <CaseReturnCTA />
      </div>
    </div>

  </div>
</SectionBlock>
```

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Open UI Lab and verify section 06 renders**

Navigate to `http://localhost:3001/ui-lab#case-system`.

Expected: Case Hero renders with editorial text left + 5 placeholder panels right. Overview, Gallery, ReturnCTA visible below.

- [ ] **Commit**

```bash
git add app/ui-lab/page.tsx
git commit -m "feat(ui-lab): add Case System section 06 with live component previews"
```

---

## Task 12: Wire Project Overlay CTA to case route

**Files:**
- Modify: `app/ui-lab/page.tsx` — update `PROJECT_SAMPLE.cta` logic

The `ProjectOverlayPanel` currently renders `data.cta` as a text label only. The overlay sample data has `cta: "View Case"`. Add the destination URL to the data contract so the overlay knows where to link.

- [ ] **Update `ProjectOverlayData` interface** to include an optional `ctaHref`

In `app/ui-lab/page.tsx`, find `interface ProjectOverlayData` and add:

```tsx
interface ProjectOverlayData {
  eyebrow:     string;
  title:       string;
  description: string;
  meta:        ProjectMeta[];
  cta:         string;
  ctaHref?:    string;   // ← add this
}
```

- [ ] **Update `PROJECT_SAMPLE`** to include the href:

```tsx
const PROJECT_SAMPLE: ProjectOverlayData = {
  eyebrow:     "Web Design Premium / Case Study",
  title:       "Machado Plataformas",
  description: "Site institucional premium para uma empresa técnica, com foco em percepção de valor, clareza comercial e presença digital mais profissional.",
  meta: [
    { label: "Cliente",  value: "Machado Plataformas"    },
    { label: "Setor",    value: "Implementos Rodoviários" },
    { label: "Tipo",     value: "Site Institucional"      },
    { label: "Status",   value: "Case Real"               },
  ],
  cta:     "View Case",
  ctaHref: "/cases/machado-plataformas",
};
```

- [ ] **Update `ProjectOverlayPanel` CTA to use `Link` when `ctaHref` is provided**

In `ProjectOverlayPanel`, find the CTA `<span>` block and replace with:

```tsx
{/* CTA */}
{data.ctaHref ? (
  <Link
    href={data.ctaHref}
    className="group inline-flex flex-col items-start gap-[3px]"
  >
    <span className="inline-flex items-center gap-[7px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-white/90 transition-colors duration-200 group-hover:text-cbm-white">
      {data.cta}
      <span className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100" aria-hidden="true">→</span>
    </span>
    <span className="block h-px w-full origin-left scale-x-0 bg-cbm-red transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
  </Link>
) : (
  <span className="group inline-flex cursor-pointer flex-col items-start gap-[3px]">
    <span className="inline-flex items-center gap-[7px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-white/90 transition-colors duration-200 group-hover:text-cbm-white">
      {data.cta}
      <span className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100" aria-hidden="true">→</span>
    </span>
    <span className="block h-px w-full origin-left scale-x-0 bg-cbm-red transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
  </span>
)}
```

Note: `Link` from `next/link` is already imported at the top of the file.

- [ ] **Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Test the link in browser**

Navigate to `http://localhost:3001/ui-lab#overlay-v1`. Click "View Case" in the active overlay preview.

Expected: navigates to `/cases/machado-plataformas`.

- [ ] **Commit**

```bash
git add app/ui-lab/page.tsx
git commit -m "feat(overlay): wire View Case CTA to /cases/machado-plataformas"
```

---

## Verification checklist

After all tasks are complete:

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `http://localhost:3001/cases/machado-plataformas` — renders hero, overview, gallery, return CTA
- [ ] `http://localhost:3001/cases/nao-existe` — returns 404
- [ ] `http://localhost:3001/ui-lab#case-system` — section 06 shows all 4 case components
- [ ] Clicking "View Case" in Project Overlay navigates to the case page
- [ ] Clicking "← Explorar a Paisagem" on the case page returns to `/`
