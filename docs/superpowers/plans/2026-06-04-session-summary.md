# Session Summary — 2026-06-04

Sessão longa de design + implementação cobrindo terrain, parte 1 do portfólio (logo → philosophy), transição triangular e a entrada na Paisagem Digital com 3 projetos.

---

## 1. Limpeza do Experience Lab

**Auditoria de 12 experimentos → 8.** Removidos:
- `HeroToLandscape/` (validação cumprida)
- `SpatialComposition/` (validação cumprida)
- `CTAFormation/` (era só placeholder `return null`)
- `temporary-site/` (HTML estático solto)
- 31 PNGs de iteração na raiz
- `digital-landscape-v1` tirado do registro (componente segue existindo, consumido pelo OpeningSequence)

**Reordenação** ([lib/experiments.ts](../../lib/experiments.ts)):
- Lab ordenado pela jornada da home: `loading → intro → hero → paisagem`
- Cada experimento ganhou campo `stage` (tipado), agrupado visualmente em [app/lab/page.tsx](../../app/lab/page.tsx)

---

## 2. Terrain Mesh — refatoração completa

**De 3 layers stacked → 1 layer unificada.** O problema de "várias placas com buracos" foi resolvido colapsando background+midground+foreground numa única malha contínua.

### Mudanças em [components/lab/TerrainMesh/](../../components/lab/TerrainMesh/)

| Arquivo | Mudança |
|---|---|
| `config.ts` | Single layer `terrain`, footprint 50×36, segX×segZ ajustado (final 90×64 — triângulos visíveis), heightAmp=0.55, calmMin=0.78, jitter=0.22 |
| `config.ts NOISE` | octaves 5→3, contrast 1.1→1.3, gain 0.4 — terreno mais uniforme, sem espinhos. driftSpeedX/Z + timeWobble bumpados pra movimento ambiente visível |
| `useCursorHover.ts` (novo) | Substitui `useCursorParallax`. Raycaster ao plano y=0, lift localizado sob o cursor (radius 3.2, amplitude 0.28) |
| `geometry.ts updateTerrain` | Adicionou cálculo de lift bell-curve por vértice baseado em distância ao cursor |
| `TerrainScene.tsx` | Wire automático do useCursorHover (auto-aplica a todas as cenas que reusem TerrainScene) |
| `noise.ts` (novo) | Hash-based fBm 2D, sem dependências |

**Câmera:** ajustada de `(0, 3.4, 7.6)` → `(0, 5.2, 15)` olhando `(0, -0.8, -0.6)`. Mais distante, terreno como pano de fundo.

---

## 3. Opening Sequence — Parte 1 (Logo + Philosophy)

### Triangle Loader autoplay

Trocado o modelo scroll-driven (Lenis + ScrollTrigger) por timeline GSAP autoplay. Eliminou solavancos do scroll.

**Novo:**
- [`useOpeningTimeline.ts`](../../components/lab/OpeningSequence/useOpeningTimeline.ts) — orquestra HOLD (1.2s) → EXIT (2.3s) após build do logo
- Aceleração por clique/tecla (`timeScale × 2.5`) com filtro de modificadoras

**Recuo do logo** (em vez de ExitParticles):
- Logo encolhe (`recoilRef.scale` 1.0 → 0.6) durante o EXIT — sensação de "cortina recuando"
- ExitParticles.tsx **deletado**
- Particles atmosféricos convertidos pra mini-triângulos via `instancedMesh` (era `<points>`)

**Logo:** rotação no próprio eixo Y (era OrbitControls auto-rotate da câmera). Período 55s/volta.

**Bug de "travada" corrigido:** o fix anterior tinha `>` reusado em `timeline.to(..., ">")` — fazia tweens rodarem em sequência, não paralelo. Trocado por `addLabel("exit")` + posição `"exit"`. Plus: PhilosophySection pré-monta no início do useOpeningTimeline (não no meio do EXIT), evita jank de mount durante a animação.

### PhilosophySection polish

**Tipografia:** começou em Panchang (display humanista), depois trocado pra **Satoshi** (geometric sans premium) — combina com o vocabulário wireframe técnico do logo/terrain.

**Polish stack aplicado:**
- Word stagger entrance: cada palavra entra com blur + y-offset + opacity, stagger 0.09s, duração 1.0s, `power3.out`
- Ghost number gigante atrás (`13rem`, opacity 0.06) — marca editorial
- Barra de progresso contínua no DWELL (7s) em vez de jumps por statement
- Paleta coerente: warm gray `#97938b` em barra/dots, Signal Red só no CTA
- Statements multi-linha pra ar editorial:
  - "Cada pixel" / "é uma decisão."
  - "Design e código." / "Mesmo autor."
  - "A primeira impressão" / "não se repete."

**Scroll do PhilosophySection** — acumulação de delta + threshold (80) + cooldown 750ms. Trackpad lento não pula frases por acaso, mouse wheel responde instantâneo.

**DWELL** estendido pra 7s (era 4s). Click anywhere também avança (cooldown 600ms).

---

## 4. MeshButton — botão principal do design system

**Promovido a componente UI principal.** Era inline `CtaMeshButton` na PhilosophySection; virou [components/ui/MeshButton.tsx](../../components/ui/MeshButton.tsx).

**Anatomia:**
- Malha 14×4 triangulada procedural como fundo (seed=137, mesma família do terreno)
- Halo radial seguindo o cursor (DOM direto via setAttribute, zero re-renders)
- Animação ambiente da malha via rAF — vértices internos ondulam em sin/cos waves
- Border off-white/55 → /100 hover, backdrop-blur-sm, fundo `#000F08/60`
- Satoshi 500, uppercase, tracking 0.3em
- Seta Signal Red com slide no hover

**API:**
```tsx
<MeshButton label="Ver projetos" onClick={...} />
<MeshButton label="..." showArrow={false} className="..." />
```

Memória salva em `project_mesh_button_primary.md` — supersede `BtnPrimary` do V1 pra CTAs primários.

---

## 5. CursorTriangle — cursor global do site

[components/cursor/CursorTriangle.tsx](../../components/cursor/CursorTriangle.tsx) — montado em [app/layout.tsx](../../app/layout.tsx) (global).

- Triângulo SVG wireframe 20×20 segue o mouse com lerp
- Ativa sobre `<canvas>` OU qualquer ancestral com `data-cursor="triangle"`
- Esconde cursor nativo via CSS scoped (`html.cursor-triangle-active canvas, [data-cursor="triangle"] *`)
- Touch detect (não monta em `pointer: coarse`)
- Reduced motion desativa o spin

`data-cursor="triangle"` marcado em:
- `OpeningSequence.tsx` root
- `PhilosophySection.tsx` root

---

## 6. Triangle Flip Transition

Quando o usuário clica no MeshButton da última frase, em vez de transição abrupta:

- Wrapper com `perspective: 1500px`
- Card interno `transform-style: preserve-3d`
- Front: PhilosophySection (mantém estado visual atual)
- Back: ProjectLandscape (pré-rotacionado 180° no eixo)
- GSAP anima `rotate3d(0.5, 0.866, 0, 0deg → 180deg)` — **eixo a 60°, eco visual a uma aresta de triângulo equilátero**
- Duração: 1.2s `power3.inOut`. Reduced motion → 0.4s linear

**Bug fix do flip:** estrutura refatorada pra manter Philosophy + Landscape mounted através das fases (`philosophy`, `flipping`, `landscape`). Evita unmount/remount, garante que o flip aconteça sobre conteúdo já pintado, não em cima de Canvas em loading.

**Arquivos novos:**
- [`useFlipTransition.ts`](../../components/lab/OpeningSequence/useFlipTransition.ts) — orquestra a timeline GSAP do flip
- `FLIP` constants em [config.ts](../../components/lab/OpeningSequence/config.ts)

---

## 7. ProjectLandscape — Paisagem com 3 projetos

Substitui o `DigitalLandscape` (1 fragmento centralizado) na fase final da Opening Sequence.

### Estrutura

```
components/lab/ProjectLandscape/
 ├─ ProjectLandscape.tsx     — orquestrador (wrapper + Canvas + scroll + card)
 ├─ LandscapeScene.tsx       — cena 3D (TerrainScene + 3 fragments + camera)
 ├─ ProjectFragment.tsx      — fragmento triangulado + hover/click
 ├─ ProjectCard.tsx          — HTML overlay com dual preview
 ├─ CardMeshPlaceholder.tsx  — placeholder triangulado scrollavel
 ├─ useProjectScrollCamera.ts — câmera dirigida por scroll
 ├─ config.ts                — slots, keyframes, card constants
 └─ index.ts
```

### Dados

[types/case.ts](../../types/case.ts) + [data/cases.ts](../../data/cases.ts):
- Campo `status: "published" | "coming-soon"`
- Campo `preview?: { desktop: string; mobile: string }`
- 3 cases: Machado Plataformas (published) + Estúdio Mendes + Rota Clínica (ambos coming-soon)

### Layout (versão final desta sessão)

- 3 slots achatados: x=-7/0/+7, **z=0** em todos
- Scale uniforme 2.6× (sem destaque por tamanho)
- `useFragmentBuild(0)` em todos — zero stagger, surgem juntos
- `FRAGMENT_VISUAL` override local da paleta — edges `#F5F2ED` opacity 0.55, hover 1.0, edgeWidth 1.8 (presença real, não fantasma)
- Apex permanentemente 1.4× (cabeça vermelha sempre lê)

### Câmera de scroll (3 keyframes)

- 0%: pos(-4, 5.2, 13), tgt(-7, -0.5, 0)
- 50%: pos(0, 5.2, 13), tgt(0, -0.5, 0)
- 100%: pos(+4, 5.2, 13), tgt(+7, -0.5, 0)

Smoothstep entre keyframes — câmera "respira" entre fragmentos.

### Dual preview card

- Largura 480px, layout flex: desktop (16:10, 3/4 da largura) + mobile (9:16, 1/4)
- Eyebrow (setor + ano) + título Satoshi 500 + descrição + link "Ver projeto →"
- Border `#F5F2ED/30`, fundo `#000F08/85`, backdrop-blur-md
- Hover do card aumenta border opacity
- Click: Link pra `/cases/[slug]` (published) ou no-op (coming-soon)

### Preview "site passando"

- Container `aspect-[16/10]` overflow-hidden
- SVG/img tem altura ~3.6× container
- CSS keyframe `card-preview-scroll` anima translateY 0% → -260% → 0% em 18s
- `CardMeshPlaceholder` rola a malha triangulada
- Quando o usuário fornecer `preview.desktop/mobile`, o `<img>` rola via `.card-preview-img`

### Auto-active fragment

Quando entra na landscape, após 1s o fragmento central (Estúdio Mendes) é ativado automaticamente. Usuário já chega com o card aberto + preview rodando.

---

## 8. DevPhaseTimeline — barra de skip de fases

[components/lab/OpeningSequence/DevPhaseTimeline.tsx](../../components/lab/OpeningSequence/DevPhaseTimeline.tsx) — flutuante no topo da tela.

- 3 botões: Logo / Philosophy / Landscape
- Click pula direto pra fase (zera timers, ajusta transforms do flip)
- Esconde em produção (`process.env.NODE_ENV === "production"`)
- Cursor nativo na barra (não triangular) — modo "ferramenta"

---

## 9. Arquivos tocados nessa sessão

**Novos:**
- `components/cursor/CursorTriangle.tsx`
- `components/ui/MeshButton.tsx`
- `components/lab/OpeningSequence/config.ts`
- `components/lab/OpeningSequence/useOpeningTimeline.ts`
- `components/lab/OpeningSequence/useFlipTransition.ts`
- `components/lab/OpeningSequence/DevPhaseTimeline.tsx`
- `components/lab/TerrainMesh/noise.ts`
- `components/lab/TerrainMesh/useCursorHover.ts`
- `components/lab/ProjectLandscape/*` (8 arquivos)

**Modificados:**
- `app/lab/page.tsx`
- `app/layout.tsx`
- `components/lab/OpeningSequence/OpeningSequence.tsx`
- `components/lab/PhilosophySection/PhilosophySection.tsx`
- `components/lab/TerrainMesh/*` (6 arquivos)
- `components/lab/TriangleLoader/*` (5 arquivos)
- `data/cases.ts`
- `lib/experiments.ts`
- `types/case.ts`

**Deletados:**
- 9 arquivos de experimentos descartados (HeroToLandscape, SpatialComposition, CTAFormation)
- `useOpeningScroll.ts` (substituído por timeline)
- `ExitParticles.tsx` (substituído por recoil)

---

## 10. Specs documentados

- `docs/superpowers/specs/2026-06-03-opening-sequence-autoplay-design.md`
- `docs/superpowers/specs/2026-06-04-landscape-flip-transition-design.md`

---

## Estado atual

**Fluxo cinematográfico completo do site (testável via `/lab` → `opening-sequence`):**

```
Logo build (~4.3s)
  → Hold (1.2s) com pulse nos pontos
  → Exit (2.3s) — recoil + crossfade pra Philosophy
  → Philosophy: 3 frases multi-linha + ghost number + CTA MeshButton
  → Click no CTA: Triangle Flip 3D (1.2s, eixo 60°)
  → ProjectLandscape: 3 fragmentos uniformes em row
  → 1s depois: fragmento central auto-ativa, card abre com preview rolando
  → Hover em qualquer fragmento: card muda pra ele
  → Click Machado: /cases/machado-plataformas
  → Click Estúdio/Rota: card persistente "Em breve"
```

**DevPhaseTimeline** no topo permite pular pra qualquer fase pra iteração rápida.

Type check passando em todas as mudanças.
