# Melhorias na seção de Projetos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enriquecer a seção de Projetos da Home com cues de navegação completos, um atalho "Ver projetos" para o visitante impaciente, +3 cases reais (−1 placeholder, total 8 fragmentos) e cor sutil por tipo de projeto.

**Architecture:** Mudanças incrementais sobre a vitrine orbital existente (`components/zones/ProjectLandscape`) e o sistema de capítulos da Home (`components/home`, `lib/homeChapters`). Nenhuma reescrita: estendemos o modelo de dados (`CaseProject` ganha `type` e `stack`), tornamos a geometria do anel agnóstica à contagem, e adicionamos cor por tipo no apex do fragmento + reforços leves na UI.

**Tech Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Three.js / react-three-fiber · GSAP · Tailwind CSS.

## Global Constraints

- **Sem test runner no projeto** (não há jest/vitest). Verificação de cada task = `npm run typecheck` (sem erros) + `npm run lint` (limpo) + check visual via `npm run dev` quando a mudança for visual. Tasks que mexem em dados/rotas rodam também `npm run build`. **Não** introduzir framework de teste.
- **Commit direto na `main`**, um commit por task (preferência do usuário). Mensagens em pt-BR, prefixo convencional (`feat:`, `refactor:`, `fix:`).
- **Preservar o visual atual** — estas mudanças são aditivas; não redesenhar componentes existentes além do escopo descrito.
- **Cor da marca:** fundo `#000F08`, off-white `#F5F2ED`, vermelho-sinal `#FB3640`, terrain-mid `#6b7a72`.
- **Paleta de tipos (apex):** institucional `#FB3640` · landing `#D9A15B` · webapp `#5FB0A3` · ecommerce `#A98BC9`.
- **Assets já capturados** em `public/cases/<slug>/` (`.jpeg`): `maison-etoile`, `forma-viva`, `estudio-monteiro`. Cada um tem `desktop-tall`, `mobile-tall`, `hero-1`, `hero-2`; `forma-viva` e `estudio-monteiro` também têm `gallery-1`.

---

### Task 1: Modelo de tipo de projeto + mapa de cor

**Files:**
- Modify: `types/case.ts`
- Modify: `components/zones/ProjectLandscape/config.ts`

**Interfaces:**
- Produces: `ProjectType` (union em `types/case.ts`); `CaseProject.type?: ProjectType`; `CaseProject.stack?: string[]`; `PROJECT_TYPE_COLOR: Record<ProjectType, string>` (export em `config.ts`).

- [ ] **Step 1: Adicionar `ProjectType`, `type` e `stack` ao `CaseProject`**

Em `types/case.ts`, adicionar o union e os dois campos opcionais ao fim da interface:

```ts
/** Tipo de entrega do projeto — dirige a cor sutil do fragmento na vitrine. */
export type ProjectType = "institucional" | "landing" | "webapp" | "ecommerce";
```

E dentro de `interface CaseProject`, após `preview?`:

```ts
  /**
   * Tipo de entrega — dirige a cor do apex do fragmento na Paisagem.
   * Omitido → tratado como "institucional" (cor vermelha da marca).
   */
  type?: ProjectType;
  /** Stack técnica exibida na página de case (ex.: ["Next.js", "React"]). */
  stack?: string[];
```

- [ ] **Step 2: Adicionar o mapa de cor por tipo em `config.ts`**

Em `components/zones/ProjectLandscape/config.ts`, adicionar o import do tipo no topo (junto aos imports existentes) e o mapa logo após o bloco `STATUS_VISUAL`:

```ts
import type { ProjectType } from "@/types/case";
```

```ts
/**
 * Cor do apex do fragmento por tipo de projeto. Dessaturada pra coesão com a
 * marca — só o apex carrega a cor; arestas/nós continuam off-white.
 * Coming-soon ignora isto (apex vira off-white via STATUS_VISUAL).
 */
export const PROJECT_TYPE_COLOR: Record<ProjectType, string> = {
  institucional: "#FB3640",
  landing: "#D9A15B",
  webapp: "#5FB0A3",
  ecommerce: "#A98BC9",
} as const;
```

- [ ] **Step 3: Verificar typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: sem erros (campos são opcionais; nada consome ainda).

- [ ] **Step 4: Commit**

```bash
git add types/case.ts components/zones/ProjectLandscape/config.ts
git commit -m "feat(projetos): tipo de projeto + mapa de cor por tipo"
```

---

### Task 2: Dados — +3 cases reais, −1 placeholder, `type` em todos

**Files:**
- Modify: `data/cases.ts`

**Interfaces:**
- Consumes: `ProjectType`, `CaseProject.type`, `CaseProject.stack` (Task 1).
- Produces: array `cases` com 8 entradas; slugs `maison-etoile`, `forma-viva`, `estudio-monteiro` adicionados; `estudio-mendes` removido; `type` em todas.

- [ ] **Step 1: Importar o tipo e adicionar `type` às entradas existentes**

Em `data/cases.ts`, o import já é `import type { CaseProject } from "@/types/case";` — manter. Adicionar `type` a cada entrada existente que **fica**:
- `machado-plataformas`: adicionar `type: "institucional",` (após `status: "published"`).
- `rota-clinica`: adicionar `type: "webapp",`.
- `industrial-tba`: adicionar `type: "institucional",`.
- `ecommerce-tba`: adicionar `type: "ecommerce",`.
- `education-tba`: adicionar `type: "webapp",`.

- [ ] **Step 2: Remover o placeholder `estudio-mendes`**

Apagar o objeto inteiro cujo `slug: "estudio-mendes"` (o bloco `{ ... }` correspondente e a vírgula).

- [ ] **Step 3: Adicionar as 3 entradas reais publicadas**

Inserir estes 3 objetos no array `cases` (logo após `machado-plataformas`, pra publicados ficarem juntos no topo):

```ts
  {
    slug: "maison-etoile",
    eyebrow: "Landing Page Premium / Case Study",
    title: "Maison Étoile Interiors",
    description:
      "Landing page de alta conversão para um estúdio boutique de interiores de luxo em São Paulo — manifesto, portfólio e proposta numa única página cinematográfica.",
    meta: {
      cliente: "Maison Étoile Interiors",
      setor: "Design de Interiores",
      tipo: "Landing Page",
      ano: "2025",
    },
    type: "landing",
    stack: [
      "Next.js (App Router)",
      "React",
      "Tailwind CSS",
      "Marcellus + Hanken Grotesk",
      "Google Tag Manager",
      "Vercel",
    ],
    heroImages: [
      "/cases/maison-etoile/hero-1.jpeg",
      "/cases/maison-etoile/hero-2.jpeg",
    ],
    overview: {
      heading: "Uma página, uma decisão",
      body: [
        "A Maison Étoile Interiors é um estúdio boutique de interiores de alto padrão em São Paulo. O desafio era condensar reputação, método e portfólio numa única página que conduzisse o visitante certo até a solicitação de proposta.",
        "A landing foi construída como uma narrativa vertical: um hero cinematográfico que ancora o posicionamento, um manifesto que estabelece a voz, cinco diferenciais que justificam o preço e um portfólio em carrossel que prova a entrega — fechando num método claro e num convite direto.",
        "Tipografia serifada (Marcellus) sobre Hanken Grotesk dá o tom de luxo sereno; o ritmo de respiro entre seções sustenta a percepção de exclusividade do começo ao fim.",
      ],
      challenge:
        "Transformar um estúdio boutique de interiores em uma presença digital de página única que comunica exclusividade e conduz à solicitação de proposta sem dispersar o visitante.",
    },
    gallery: [],
    status: "published",
    siteUrl: "lp-interiores.vercel.app",
    preview: {
      desktop: "/cases/maison-etoile/desktop-tall.jpeg",
      mobile: "/cases/maison-etoile/mobile-tall.jpeg",
    },
  },
  {
    slug: "forma-viva",
    eyebrow: "Site Institucional / Case Study",
    title: "Atelier Forma Viva",
    description:
      "Site institucional multi-página para um atelier de arquitetura residencial em Santa Catarina — projetos, atelier e processo com navegação editorial e foco em luz e matéria.",
    meta: {
      cliente: "Atelier Forma Viva",
      setor: "Arquitetura",
      tipo: "Site Institucional",
      ano: "2026",
    },
    type: "institucional",
    stack: [
      "Next.js (App Router)",
      "React",
      "Tailwind CSS",
      "Raleway + Inter",
      "Vercel",
    ],
    heroImages: [
      "/cases/forma-viva/hero-1.jpeg",
      "/cases/forma-viva/hero-2.jpeg",
    ],
    overview: {
      heading: "Arquitetura como sistema navegável",
      body: [
        "O Atelier Forma Viva projeta residências e interiores em Santa Catarina a partir da relação entre luz, proporção e matéria. O site precisava organizar esse portfólio autoral num sistema multi-página sem perder a atmosfera de atelier.",
        "A arquitetura de informação separa projetos, atelier e processo em rotas próprias, com páginas de projeto individuais para cada obra. A navegação é editorial e contida — a imagem conduz, o texto sustenta.",
        "Raleway e Inter dão uma base tipográfica limpa e arejada; o ritmo de espaços negativos deixa cada projeto respirar, reforçando a ideia de espaços que respiram forma, luz e matéria.",
      ],
      challenge:
        "Estruturar o portfólio de um atelier de arquitetura em um site institucional navegável, com páginas de projeto individuais, sem perder a atmosfera autoral.",
    },
    gallery: ["/cases/forma-viva/gallery-1.jpeg"],
    status: "published",
    siteUrl: "forma-viva.vercel.app",
    preview: {
      desktop: "/cases/forma-viva/desktop-tall.jpeg",
      mobile: "/cases/forma-viva/mobile-tall.jpeg",
    },
  },
  {
    slug: "estudio-monteiro",
    eyebrow: "Site Institucional / Case Study",
    title: "Estúdio Monteiro",
    description:
      "Site institucional para um escritório de arquitetura autoral em São Paulo — design editorial escuro, tipografia serifada e obras selecionadas com páginas de projeto dedicadas.",
    meta: {
      cliente: "Estúdio Monteiro",
      setor: "Arquitetura",
      tipo: "Site Institucional",
      ano: "2025",
    },
    type: "institucional",
    stack: [
      "Next.js (App Router + Turbopack)",
      "React",
      "Tailwind CSS",
      "Fraunces + Hanken Grotesk",
      "Vercel",
    ],
    heroImages: [
      "/cases/estudio-monteiro/hero-1.jpeg",
      "/cases/estudio-monteiro/hero-2.jpeg",
    ],
    overview: {
      heading: "Permanência como linguagem",
      body: [
        "O Estúdio Monteiro projeta residências de alto padrão e ambientes corporativos em São Paulo, com mais de 40 obras desde 2009. O site institucional precisava transmitir permanência e autoria — não tendência.",
        "O sistema editorial é escuro, com tipografia serifada (Fraunces) e um acento terracota que assina os marcos. Obras selecionadas levam a páginas de projeto dedicadas; números de atuação ancoram a credibilidade logo no hero.",
        "O resultado é uma presença sóbria e adulta, em que o desenho é a linguagem e a obra é o argumento — coerente com o posicionamento do escritório.",
      ],
      challenge:
        "Dar a um escritório com 40+ obras uma presença digital que transmita permanência e autoria, organizando obras residenciais e corporativas num só sistema editorial.",
    },
    gallery: ["/cases/estudio-monteiro/gallery-1.jpeg"],
    status: "published",
    siteUrl: "monteiro-nine.vercel.app",
    preview: {
      desktop: "/cases/estudio-monteiro/desktop-tall.jpeg",
      mobile: "/cases/estudio-monteiro/mobile-tall.jpeg",
    },
  },
```

- [ ] **Step 4: Verificar typecheck + build (gera as rotas de case estáticas)**

Run: `npm run typecheck && npm run build`
Expected: build conclui; `generateStaticParams` agora emite 8 rotas incluindo `/cases/maison-etoile`, `/cases/forma-viva`, `/cases/estudio-monteiro`; sem `estudio-mendes`.

- [ ] **Step 5: Commit**

```bash
git add data/cases.ts public/cases/maison-etoile public/cases/forma-viva public/cases/estudio-monteiro
git commit -m "feat(projetos): +3 cases reais (Maison/Forma Viva/Monteiro), aposenta placeholder estudio-mendes"
```

---

### Task 3: Anel agnóstico à contagem (6 → 8 slots)

**Files:**
- Modify: `components/zones/ProjectLandscape/config.ts`

**Interfaces:**
- Consumes: nada novo.
- Produces: `FRAGMENT_SLOTS` com 8 elementos, ângulos a cada 45°, slugs casando com `data/cases.ts`. `INITIAL_ACTIVE_SLUG` inalterado (`machado-plataformas`).

- [ ] **Step 1: Reescrever a construção do anel pra usar a contagem**

Em `config.ts`, substituir a função `ringSlot` e o array `FRAGMENT_SLOTS` (bloco atual com 6 `ringSlot(...)`) por uma construção dirigida por uma lista de definições:

```ts
function ringSlot(
  index: number,
  count: number,
  def: { seed: number; slug: string },
): FragmentSlot {
  const angle = index * ((Math.PI * 2) / count);
  const r = 5.5;
  return {
    index,
    x: Math.sin(angle) * r,
    z: Math.cos(angle) * r,
    scale: FRAGMENT_SCALE,
    seed: def.seed,
    slug: def.slug,
  };
}

/**
 * Definições dos fragmentos na ordem de colocação no anel. Publicados e
 * "em breve" intercalados pra a cor por tipo se espalhar pela órbita.
 * Slugs casam com `data/cases.ts`.
 */
const FRAGMENT_DEFS: { seed: number; slug: string }[] = [
  { seed: 17, slug: "machado-plataformas" },
  { seed: 73, slug: "maison-etoile" },
  { seed: 137, slug: "forma-viva" },
  { seed: 211, slug: "estudio-monteiro" },
  { seed: 191, slug: "rota-clinica" },
  { seed: 257, slug: "industrial-tba" },
  { seed: 53, slug: "ecommerce-tba" },
  { seed: 113, slug: "education-tba" },
];

export const FRAGMENT_SLOTS: FragmentSlot[] = FRAGMENT_DEFS.map((def, i) =>
  ringSlot(i, FRAGMENT_DEFS.length, def),
);
```

Manter `const FRAGMENT_SCALE = 1.8;` acima (já existe). Manter `INITIAL_ACTIVE_SLUG = "machado-plataformas"`.

- [ ] **Step 2: Verificar typecheck**

Run: `npm run typecheck`
Expected: sem erros. `FRAGMENT_SLOTS.length === 8`. UI derivada (barra de progresso, setas, dots) itera o array → escala sozinha.

- [ ] **Step 3: Check visual da vitrine**

Run: `npm run dev` e abrir `http://localhost:3000/#projetos`. Verificar: 8 fragmentos no anel, auto-rotate suave, drag gira, barra de progresso com 8 segmentos, card troca por fragmento, snap funciona. Se os fragmentos parecerem apertados, subir `r` em `ringSlot` de `5.5` para `6.0`.

- [ ] **Step 4: Commit**

```bash
git add components/zones/ProjectLandscape/config.ts
git commit -m "refactor(projetos): anel agnóstico à contagem (8 fragmentos, 45°)"
```

---

### Task 4: Cor do apex por tipo no fragmento

**Files:**
- Modify: `components/zones/ProjectLandscape/ProjectFragment.tsx`
- Modify: `components/zones/ProjectLandscape/LandscapeScene.tsx`

**Interfaces:**
- Consumes: `PROJECT_TYPE_COLOR` (Task 1), `CaseProject.type` (Task 1).
- Produces: prop `apexColor?: string` em `ProjectFragment`.

- [ ] **Step 1: `ProjectFragment` aceita `apexColor` e usa cor por instância**

Em `ProjectFragment.tsx`:

1. Remover o `Color` compartilhado de módulo `apexColorBase` (linha `const apexColorBase = new Color(FRAGMENT_VISUAL.apexColor);`).
2. Adicionar a prop `apexColor` à assinatura do componente (com default):

```ts
  apexColor = FRAGMENT_VISUAL.apexColor,
```

e no tipo de props:

```ts
  /** Cor do apex por tipo de projeto (default = vermelho da marca). */
  apexColor?: string;
```

3. Criar uma `Color` por instância via `useMemo` (logo após `const geom = useMemo(...)`):

```ts
  const apexColorObj = useMemo(() => new Color(apexColor), [apexColor]);
```

4. No `useFrame`, na atribuição do apex (bloco `if (i === APEX_INDEX) { ... }`), trocar `apexColorBase` por `apexColorObj`:

```ts
        } else {
          ref.current.color.copy(apexColorObj).lerp(offWhite, d);
        }
```

(O ramo coming-soon → `offWhite` permanece igual.)

- [ ] **Step 2: `LandscapeScene` resolve e passa a cor por slot**

Em `LandscapeScene.tsx`:

1. Adicionar import:

```ts
import { FRAGMENT_SLOTS, FRAGMENT_VISUAL, MOBILE_MAX_WIDTH, ORBIT_MOBILE, PROJECT_TYPE_COLOR } from "./config";
```

(juntar com o import existente de `./config`; `FRAGMENT_VISUAL` é novo aqui.)

2. Dentro do `.map`, após resolver `caseProject`, computar a cor e passá-la:

```ts
        const apexColor =
          caseProject?.type != null
            ? PROJECT_TYPE_COLOR[caseProject.type]
            : FRAGMENT_VISUAL.apexColor;
```

e adicionar `apexColor={apexColor}` às props do `<ProjectFragment .../>`.

- [ ] **Step 3: Verificar typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: sem erros.

- [ ] **Step 4: Check visual das cores**

Run: `npm run dev`, abrir `/#projetos`, girar a vitrine. Verificar: Maison Étoile com apex âmbar; cases institucionais com apex vermelho; coming-soon (industrial/educação/ecommerce/rota) com apex off-white quando "em breve". As cores devem ser sutis, só no apex.

- [ ] **Step 5: Commit**

```bash
git add components/zones/ProjectLandscape/ProjectFragment.tsx components/zones/ProjectLandscape/LandscapeScene.tsx
git commit -m "feat(projetos): cor do apex do fragmento por tipo de projeto"
```

---

### Task 5: Reforço de cor — barra de progresso + eyebrow do card

**Files:**
- Modify: `components/zones/ProjectLandscape/LandscapeProgressBar.tsx`
- Modify: `components/zones/ProjectLandscape/ProjectLandscape.tsx`
- Modify: `components/zones/ProjectLandscape/ProjectCard.tsx`

**Interfaces:**
- Consumes: `PROJECT_TYPE_COLOR`, `CaseProject.type`.
- Produces: prop `activeColor?: string` em `LandscapeProgressBar`.

- [ ] **Step 1: Barra de progresso aceita `activeColor`**

Em `LandscapeProgressBar.tsx`:

1. Adicionar `activeColor` às props:

```ts
  activeColor = "#F5F2ED",
```

e no tipo:

```ts
  /** Cor do segmento ativo (cor do tipo do projeto ativo). */
  activeColor?: string;
```

2. No segmento ativo, trocar a classe `bg-[#F5F2ED]` por estilo inline. A `<span>` do indicador vira:

```tsx
                <span
                  className={`block h-[2px] transition-all duration-300 ${
                    isActive
                      ? "w-14"
                      : isVisited
                        ? "w-10 bg-[#F5F2ED]/45 hover:bg-[#F5F2ED]/85"
                        : "w-10 bg-[#F5F2ED]/15 hover:bg-[#F5F2ED]/55"
                  }`}
                  style={isActive ? { backgroundColor: activeColor } : undefined}
                />
```

- [ ] **Step 2: `ProjectLandscape` resolve a cor ativa e passa pra barra**

Em `ProjectLandscape.tsx`:

1. Adicionar ao import de `./config`: `PROJECT_TYPE_COLOR`.
2. Após `const activeCase = ...` (perto do fim, antes do `return`), computar:

```ts
  const activeColor =
    activeCase?.type != null
      ? PROJECT_TYPE_COLOR[activeCase.type]
      : "#F5F2ED";
```

3. No JSX, passar `activeColor={activeColor}` ao `<LandscapeProgressBar .../>`.

- [ ] **Step 3: Eyebrow do card ganha um fio na cor do tipo**

Em `ProjectCard.tsx`:

1. Adicionar imports no topo: trocar a linha de import de `./config` para incluir `PROJECT_TYPE_COLOR`, e importar o tipo:

```ts
import { CARD, FRAGMENT_SLOTS, PROJECT_TYPE_COLOR, SLIDESHOW } from "./config";
```

2. Dentro de `renderContent`, após `const isComingSoon = ...`, computar a cor:

```ts
    const typeColor =
      !isComingSoon && project.type != null
        ? PROJECT_TYPE_COLOR[project.type]
        : null;
```

3. No bloco de texto, o eyebrow (`<p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#97938b]">`) recebe um fio colorido antes do texto. Substituir esse `<p>` por:

```tsx
          <p className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.4em] text-[#97938b]">
            {typeColor && (
              <span
                aria-hidden
                className="inline-block h-[2px] w-3.5 flex-shrink-0"
                style={{ backgroundColor: typeColor }}
              />
            )}
            {isComingSoon
              ? `Em breve · ${project.meta.setor}`
              : `${project.meta.setor} · ${project.meta.ano}`}
          </p>
```

- [ ] **Step 4: Verificar typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: sem erros.

- [ ] **Step 5: Check visual**

Run: `npm run dev`, `/#projetos`. Verificar: segmento ativo da barra de progresso assume a cor do tipo do projeto ativo; o card do projeto ativo mostra um fio colorido (cor do tipo) antes do eyebrow; coming-soon sem fio.

- [ ] **Step 6: Commit**

```bash
git add components/zones/ProjectLandscape/LandscapeProgressBar.tsx components/zones/ProjectLandscape/ProjectLandscape.tsx components/zones/ProjectLandscape/ProjectCard.tsx
git commit -m "feat(projetos): reforço de cor por tipo na barra de progresso e no card"
```

---

### Task 6: Cues de navegação mais ricos

**Files:**
- Modify: `lib/homeChapters.ts`
- Modify: `components/home/InteractionCue.tsx`

**Interfaces:**
- Produces: `HomeChapter.gestures?: string[]`.

- [ ] **Step 1: `HomeChapter` ganha `gestures` e cada capítulo é preenchido**

Em `lib/homeChapters.ts`:

1. Adicionar ao interface `HomeChapter`:

```ts
  /** Gestos secundários daquela seção (todos os controles disponíveis). */
  gestures?: string[];
```

2. Preencher os capítulos com gestos (manter `id`, `label`, `cue` como estão; adicionar `gestures` onde fizer sentido):

```ts
export const HOME_CHAPTERS: HomeChapter[] = [
  { id: "logo", label: "Logo", cue: null },
  { id: "manifesto", label: "Manifesto", cue: "Role para avançar", gestures: ["↑ volta ao logo", "→ pula"] },
  { id: "problema", label: "Problema", cue: "Role para revelar", gestures: ["cada rolada constrói um beat"] },
  { id: "servicos", label: "Serviços", cue: "Clique para explorar", gestures: ["role nos cards", "↑↓ troca seção"] },
  { id: "projetos", label: "Projetos", cue: "Arraste para girar", gestures: ["clique abre o case", "← → navega", "espaço pausa"] },
  { id: "processo", label: "Processo", cue: "Role para percorrer", gestures: ["cada etapa é um beat"] },
  { id: "laboratorio", label: "Laboratório", cue: "Entre no laboratório", gestures: ["role para sair"] },
  { id: "sobre", label: "Sobre", cue: null },
  { id: "convite", label: "Convite", cue: "Role — o convite se forma" },
];
```

- [ ] **Step 2: `InteractionCue` renderiza verbo primário + gestos secundários**

Em `InteractionCue.tsx`, no `return`, dentro do `<div>` que tem o triângulo + `<span>` do `chapter.cue`, adicionar uma segunda linha dim com os gestos. Trocar o bloco interno (o `<div className="flex items-center gap-3 ...">`) por uma coluna:

```tsx
      <div
        className="flex flex-col items-center gap-1 transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex items-center gap-3">
          <svg aria-hidden width="7" height="7" viewBox="0 0 10 10">
            <polygon points="1,2 9,2 5,9" fill={SIGNAL} />
          </svg>
          <span
            className="text-[0.6rem] uppercase tracking-[0.32em] text-[#F5F2ED]/70"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            {chapter.cue}
          </span>
        </div>
        {chapter.gestures && chapter.gestures.length > 0 && (
          <span
            className="text-[0.5rem] uppercase tracking-[0.28em] text-[#F5F2ED]/40"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            {chapter.gestures.join("  ·  ")}
          </span>
        )}
      </div>
```

(O `<div>` externo `pointer-events-none fixed inset-x-0 bottom-7 ...` e a guarda `if (!chapter.cue || ...) return null;` ficam iguais.)

- [ ] **Step 3: Verificar typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: sem erros.

- [ ] **Step 4: Check visual dos cues**

Run: `npm run dev`. Percorrer as seções e confirmar: cada uma mostra o verbo primário + a linha de gestos secundários embaixo; some ao rolar, reaparece no idle; Projetos mostra "Arraste para girar · clique abre o case · ← → navega · espaço pausa". (No mobile, Projetos esconde o cue como hoje — comportamento preservado.)

- [ ] **Step 5: Commit**

```bash
git add lib/homeChapters.ts components/home/InteractionCue.tsx
git commit -m "feat(cues): instruções por seção mostram todos os gestos disponíveis"
```

---

### Task 7: Atalho "Ver projetos" (intro + persistente)

**Files:**
- Create: `components/home/ProjectsShortcut.tsx`
- Modify: `components/home/LogoIntro.tsx`
- Modify: `components/home/HomeExperience.tsx`

**Interfaces:**
- Consumes: `jumpTo` / `guidedScroll` existentes em `HomeExperience`.
- Produces: prop `onSkipToProjects?: () => void` em `LogoIntro`; componente `ProjectsShortcut` (`{ visible: boolean; onClick: () => void }`).

- [ ] **Step 1: Criar `ProjectsShortcut`**

Criar `components/home/ProjectsShortcut.tsx`:

```tsx
"use client";

/**
 * Atalho persistente "Ver projetos" — pill discreto no canto inferior-esquerdo
 * pra o visitante impaciente pular direto pra vitrine de qualquer seção. Cobre
 * desktop e mobile (a ChapterRail é só desktop). Escondido quando já se está em
 * Projetos. Aparece com fade via a prop `visible`.
 */
export function ProjectsShortcut({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="triangle"
      aria-label="Ir direto para os projetos"
      className="fixed bottom-6 left-6 z-[60] inline-flex items-center gap-2 border border-[#F5F2ED]/20 bg-[#000F08]/80 px-3.5 py-2 text-[0.55rem] uppercase tracking-[0.28em] text-[#F5F2ED]/75 backdrop-blur-md transition-all duration-500 hover:border-[#F5F2ED]/55 hover:text-[#F5F2ED]"
      style={{
        fontFamily: '"Satoshi", sans-serif',
        fontWeight: 500,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      Ver projetos
      <svg aria-hidden width="9" height="9" viewBox="0 0 10 10">
        <polygon points="2,1 9,5 2,9" fill="#FB3640" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 2: `LogoIntro` ganha o link "Ver projetos →"**

Em `LogoIntro.tsx`:

1. Adicionar a prop:

```ts
export function LogoIntro({
  onComplete,
  onSkipToProjects,
}: {
  onComplete?: () => void;
  onSkipToProjects?: () => void;
}) {
```

2. Adicionar o link discreto, visível quando a marca terminou de construir (`built`), pra capturar o impaciente sem quebrar a intro. Inserir logo após o bloco do selo da marca (o `<div ... pb-[18vh]>...</div>`):

```tsx
      {/* Atalho pro impaciente — aparece quando a marca terminou de construir. */}
      {onSkipToProjects && (
        <button
          type="button"
          onClick={onSkipToProjects}
          data-cursor="triangle"
          className="absolute right-6 top-6 z-10 inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-[#F5F2ED]/45 transition-all duration-500 hover:text-[#F5F2ED]"
          style={{
            fontFamily: '"Satoshi", sans-serif',
            fontWeight: 500,
            opacity: built ? 1 : 0,
            pointerEvents: built ? "auto" : "none",
          }}
        >
          Ver projetos
          <svg aria-hidden width="9" height="9" viewBox="0 0 10 10">
            <polygon points="2,1 9,5 2,9" fill="#FB3640" />
          </svg>
        </button>
      )}
```

- [ ] **Step 3: `HomeExperience` cria o callback e monta o atalho persistente**

Em `HomeExperience.tsx`:

1. Importar o componente:

```ts
import { ProjectsShortcut } from "./ProjectsShortcut";
```

2. Criar o callback de pular pra projetos (perto de `jumpTo`, após sua definição):

```ts
  // Atalho do impaciente: destrava a intro (se ativa) e posiciona na vitrine.
  const skipToProjects = useCallback(() => {
    setIntroDone(true);
    const place = () => {
      document
        .querySelector('[data-chapter-index="4"]')
        ?.scrollIntoView({ block: "start" });
    };
    // Dá um tick pro lock soltar / LazySection montar antes de posicionar.
    requestAnimationFrame(() => setTimeout(place, 80));
  }, []);
```

3. Passar `onSkipToProjects` pro `LogoIntro`:

```tsx
        <LogoIntro
          onComplete={() => setIntroDone(true)}
          onSkipToProjects={skipToProjects}
        />
```

4. Montar o atalho persistente dentro do bloco `introDone && (...)` (junto de `ChapterRail`/`ChapterDots`/`InteractionCue`):

```tsx
          <ProjectsShortcut
            visible={activeChapter !== 4}
            onClick={() => jumpTo(4)}
          />
```

- [ ] **Step 4: Verificar typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: sem erros.

- [ ] **Step 5: Check visual do atalho**

Run: `npm run dev`. Verificar:
- Na intro (cap. 0), após a marca construir, "Ver projetos" aparece no canto sup-direito; clicar destrava e leva à vitrine.
- Após a intro, o pill "Ver projetos" no canto inf-esquerdo aparece em qualquer seção; clicar leva à vitrine com wipe; ao entrar em Projetos (cap. 4) o pill some; ao sair, reaparece.

- [ ] **Step 6: Commit**

```bash
git add components/home/ProjectsShortcut.tsx components/home/LogoIntro.tsx components/home/HomeExperience.tsx
git commit -m "feat(home): atalho 'Ver projetos' na intro e persistente pro visitante impaciente"
```

---

### Task 8: Stack na página de case

**Files:**
- Modify: `components/case/ProjectFacts.tsx`
- Modify: `components/case/CaseHero.tsx`

**Interfaces:**
- Consumes: `CaseProject.stack` (Task 1).
- Produces: prop opcional `stack?: string[]` em `ProjectFacts`.

- [ ] **Step 1: `ProjectFacts` renderiza os chips de stack**

Em `ProjectFacts.tsx`, trocar a assinatura e adicionar o bloco de stack ao fim:

```tsx
import type { CaseMeta } from "@/types/case";

export function ProjectFacts({
  meta,
  stack,
}: {
  meta: CaseMeta;
  stack?: string[];
}) {
  const fields: { label: string; value: string }[] = [
    { label: "Cliente", value: meta.cliente },
    { label: "Setor",   value: meta.setor   },
    { label: "Tipo",    value: meta.tipo    },
    { label: "Ano",     value: meta.ano     },
  ];

  return (
    <div
      className="mt-9 border-t pt-7"
      style={{ borderColor: "rgba(245,242,237,0.08)" }}
    >
      <p className="mb-6 font-body text-[9px] uppercase tracking-[0.35em] text-cbm-gray-400">
        Projeto
      </p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-[440px]">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
              {label}
            </p>
            <p className="mt-1.5 font-body text-[15px] font-medium text-cbm-gray-100">
              {value}
            </p>
          </div>
        ))}
      </div>

      {stack && stack.length > 0 && (
        <div className="mt-7">
          <p className="mb-3 font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
            Stack
          </p>
          <div className="flex flex-wrap gap-2 max-w-[440px]">
            {stack.map((tech) => (
              <span
                key={tech}
                className="border border-[#F5F2ED]/15 px-2.5 py-1 font-body text-[11px] tracking-wide text-cbm-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: `CaseHero` passa `stack`**

Em `CaseHero.tsx`, trocar `<ProjectFacts meta={project.meta} />` por:

```tsx
            <ProjectFacts meta={project.meta} stack={project.stack} />
```

- [ ] **Step 3: Verificar typecheck + lint + build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: sem erros; páginas de case dos 3 novos geram com o bloco de stack.

- [ ] **Step 4: Check visual da página de case**

Run: `npm run dev`, abrir `/cases/maison-etoile`, `/cases/forma-viva`, `/cases/estudio-monteiro`. Verificar: hero, descrição, fatos do projeto, **bloco Stack com chips**, telas (hero/gallery), botão "ver ao vivo" (CaseLiveButton) apontando pra URL Vercel. Machado (`/cases/machado-plataformas`) sem bloco de stack (não tem `stack`) — segue normal.

- [ ] **Step 5: Commit**

```bash
git add components/case/ProjectFacts.tsx components/case/CaseHero.tsx
git commit -m "feat(case): bloco de stack técnica na página de projeto"
```

---

## Self-Review

**Cobertura do spec:**
- #1 cues ricos → Task 6 ✓
- #2 atalho (intro + persistente) → Task 7 ✓
- #3 +3 cases / −1 placeholder / anel 8 → Tasks 2 + 3 ✓
- #4 cor por tipo (apex + reforços) → Tasks 1 + 4 + 5 ✓
- Stack ("pegar stacks") → Task 8 ✓
- Assets capturados → consumidos em Task 2 ✓

**Decisão registrada:** `LandscapeHint` ("Arraste pra explorar") fica **inalterado** — é o toast de descoberta de primeira-vez (top-centro, ← →), distinto do cue persistente (rodapé). A leve sobreposição de verbo é aceitável; remover/editar seria over-engineering fora do valor pedido.

**Consistência de tipos:** `ProjectType` e `PROJECT_TYPE_COLOR` definidos na Task 1 e consumidos por nome idêntico nas Tasks 2/4/5. Prop `apexColor` (Task 4), `activeColor` (Task 5), `gestures` (Task 6), `onSkipToProjects`/`ProjectsShortcut` (Task 7), `stack` (Task 8) — todos definidos antes de serem consumidos.

**Ordem de dependência:** Task 1 (tipos) → Task 2 (dados) → Task 3 (anel) → Task 4 (apex) → Task 5 (reforços) → Tasks 6/7/8 (independentes entre si).
