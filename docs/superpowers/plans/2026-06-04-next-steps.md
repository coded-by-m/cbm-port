# Próximos Passos — pós sessão 2026-06-04

Roadmap em camadas, da menor pra maior. Cada item é um trabalho independente que pode ser pego em qualquer ordem (com algumas dependências marcadas).

---

## 🟢 Camada 1 — Acabamento curto (1–2 sessões cada)

### 1.1 Imagens reais do Machado Plataformas
**Por que:** o card de preview hoje só renderiza placeholder triangulado. Com imagens reais o usuário sente o impacto.

**Como:**
- Criar `public/cases/machado/` com:
  - `desktop-tall.png` (~1600×6000px, screenshot da home inteira)
  - `mobile-tall.png` (~400×2400px, screenshot mobile vertical)
- Em [data/cases.ts](../../data/cases.ts) preencher:
  ```ts
  preview: {
    desktop: "/cases/machado/desktop-tall.png",
    mobile: "/cases/machado/mobile-tall.png",
  }
  ```
- A animação de scroll já está configurada (CSS keyframe `card-preview-img-scroll`)

**Cuidado:** otimizar peso das imagens — `next/image` não é usado no card hoje (pq são tall). Usar webp ou avif. Ideal <300KB cada.

### 1.2 Mobile do card de preview
**Por que:** hoje só funciona desktop. Em mobile o card 480px é maior que o viewport.

**Como:**
- Em [ProjectCard.tsx](../../components/lab/ProjectLandscape/ProjectCard.tsx) detectar viewport pequeno
- Variante mobile: card vira full-width bottom sheet (`position: fixed; bottom: 0; left: 0; right: 0`)
- Layout flex muda de horizontal (desktop+mobile lado a lado) pra vertical empilhado
- Hover dos fragmentos vira "tap to activate" no mobile

**Trade-off:** o card ancorado em projeção 3D-2D não faz sentido em telas pequenas — preview fixo na base é mais funcional.

### 1.3 Outros 2 cases (Estúdio Mendes + Rota Clínica)
**Por que:** hoje são placeholders genéricos. Mesmo sem projeto real, podem ter:
- Mockup conceitual (Figma export ou placeholder gráfico real)
- Descrição mais específica do que o projeto será
- Setor + tipo refinados

**Como:** preencher os campos em [data/cases.ts](../../data/cases.ts). Quando virar real, mudar `status: "coming-soon" → "published"` e adicionar `preview`.

### 1.4 Slideshow entre fragmentos
**Por que:** hoje só o central abre auto. O usuário não vê os outros sem mover o mouse.

**Como:** em [ProjectLandscape.tsx](../../components/lab/ProjectLandscape/ProjectLandscape.tsx) adicionar useEffect que rotaciona `activeSlug` entre os 3 a cada N segundos (ex: 8s). Pausa quando usuário interage manualmente.

---

## 🟡 Camada 2 — Construção das outras seções da home (3–5 sessões cada)

A Opening Sequence (Logo + Philosophy + Paisagem) cobre as **primeiras 3 zonas** da home prevista em [docs/09-home-integration-plan.md](../../09-home-integration-plan.md). Faltam **6 zonas:**

```
[✅ LOADING]      — Triangle Loader (autoplay)
[✅ INTRO]        — (era Triangle Lines, hoje absorvido no logo build)
[✅ HERO]         — (era hero copy, hoje absorvido na Philosophy)
[✅ PHILOSOPHY]   — 3 frases + ghost numbers
[ ] PROBLEMA      — copy HTML, fundo residual          (80vh)
[ ] SERVIÇOS     — cards HTML com build de borda      (100vh)
[✅ PAISAGEM]    — ProjectLandscape (3 fragmentos)
[ ] LABORATÓRIO  — HTML principal, 3D residual         (100vh)
[ ] PROCESSO     — HTML + SVG linha, sem canvas ativo  (100vh)
[ ] SOBRE        — HTML puro, 3D off                   (120vh)
[ ] CTA FINAL    — CTAFormation + copy + botão         (150vh)
```

**Sugestão de ordem:**

### 2.1 SERVIÇOS — cards com build de borda
Próximo passo natural depois da Paisagem. Cards HTML com efeito de "construção de borda" (stroke-dashoffset animation), grid de 3-4 serviços. Sem 3D — o Lab ja validou que cards HTML respiram dentro do site.

### 2.2 PROCESSO — linha SVG narrativa
Página com texto + linha animada SVG que conecta etapas. Storytelling de "como trabalhamos" — Discovery → Design → Build → Handoff.

### 2.3 SOBRE
HTML puro, foto + bio + manifesto. A seção mais simples. Mas a tipografia deve ser polidíssima.

### 2.4 PROBLEMA + LABORATÓRIO
Seções intercalares — copy curto com fundo 3D residual. Podem ser combinadas numa única session.

### 2.5 CTA FINAL
A "CTAFormation" planejada no spec original. Fragmentos triangulares convergem pra formar o símbolo CbM. Final cinematográfico. Use o MeshButton como bot principal.

---

## 🟠 Camada 3 — Página individual de case (3–4 sessões)

Hoje `/cases/[slug]/page.tsx` existe mas está esquemático. Reformulação completa do case page.

**Componentes existentes** ([components/case/](../../components/case/)):
- `CaseHero` + `CaseHeroCollage`
- `CaseOverview`
- `CaseGallery`
- `CaseReturnCTA`
- `ProjectFacts`

**Faltam:**
- Layout sólido — hoje os components têm placeholder data
- Galeria com lightbox ou scroll horizontal
- Bloco de "técnicas + tecnologias" usadas
- Próximo case na sequência (footer)
- Animations de entrada por seção

**Princípio:** a página individual deve ter o mesmo vocabulário visual da home (wireframe, malha, Satoshi, cursor triangular, MeshButton). Não é uma "página interna genérica."

---

## 🔴 Camada 4 — Refatorações e produção (várias sessões)

### 4.1 Performance audit
- Lighthouse + Core Web Vitals em mobile real
- Identificar Canvas duplicado (Philosophy tem TerrainBackground + ProjectLandscape pre-mounted = 2 contextos WebGL ativos)
- Considerar share de contexto Three.js entre cenas via render-target swapping
- Lazy load do ProjectLandscape: só pré-monta quando entrou na última frase da Philosophy

### 4.2 Migrar componentes "lab" pra estrutura de produção
Hoje muito coisa vive em `components/lab/` mas é usado em produção. Estrutura sugerida:

```
components/
 ├─ ui/                   — design system (MeshButton já está aqui)
 ├─ cursor/               — CursorTriangle (já está)
 ├─ sections/             — seções da home (Hero, Philosophy, Landscape, etc.)
 ├─ case/                 — componentes da case page
 └─ lab/                  — só experimentos isolados pra validação
```

Mover `OpeningSequence`, `PhilosophySection`, `ProjectLandscape`, `TerrainMesh` pra `sections/` quando estiverem estáveis.

### 4.3 SEO + metadata
- Open Graph image dinâmica (gerada via `@vercel/og` ou similar)
- Sitemap.xml
- robots.txt
- Schema.org / structured data nos cases
- Meta tags por case page

### 4.4 Acessibilidade
- Skip link pra pular animações
- ARIA labels nos botões
- Keyboard nav completa (fragments via Tab)
- Screen reader text describing o que está acontecendo nas animações
- Audit com axe-core

### 4.5 Testes
- Playwright tests pros fluxos críticos (opening sequence completa, flip, navigation pra case)
- Visual regression tests pra catch breakages no terrain/fragments

### 4.6 Production build
- Vercel deploy
- Analytics (PostHog ou Plausible)
- Error monitoring (Sentry)
- Domain + SSL

---

## 🎯 Recomendação de próxima sessão

Pegar 1.1 + 1.2 + 1.4 juntos (acabamento da Paisagem) — meio dia de trabalho, deixa a parte que já funciona **completa**. Depois ir pra 2.1 (Serviços) construindo a próxima zona da home.

A Paisagem hoje é o ponto mais ambicioso do site. Quanto mais polida ela estiver, melhor a história quando você for mostrar.

---

## Notas pessoais (do Claude)

**O que funcionou nessa sessão:**
- Iteração rápida em ciclo: ASKQUESTION → propor → implementar → ver → ajustar. Manteve o ritmo.
- Refatorações pequenas, escopadas. Type check entre cada etapa pegou tudo cedo.
- DevPhaseTimeline foi crucial pra dev — adicionar UI de skip cedo paga.

**Cuidados pra próxima:**
- Quando for fazer 2.1 (Serviços), revisar se as transições entre Paisagem → Serviços precisam de novo flip ou se vira scroll natural. A home não é uma sequência de flips — é um continuum, e nem toda zona merece um flip.
- O DevPhaseTimeline cobre só OpeningSequence. Quando outras zonas chegarem, considerar uma navegação dev mais ampla (ex: barra com todas as 9 zonas).
- Performance vai virar gargalo na zona LABORATÓRIO se ela tiver 3D residual sobreposto à Paisagem. Plan ahead.
