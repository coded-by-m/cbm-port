# Roadmap — Próxima Sessão

**Data:** 2026-06-05
**Status:** sessão de Serviços encerrada e commitada (44 commits no `origin/main`).

---

## ✅ Concluído até aqui

### Sessão 2026-06-03 → 2026-06-05
- **OpeningSequence:** Logo + Philosophy + Triangle Flip 3D
- **ProjectLandscape (Paisagem Digital):**
  - Orbital mode, 6 fragmentos, faísca tetraedro 3D
  - Card fixo bottom-right (counter, status, mailto coming-soon)
  - Controles: drag, snap, auto-rotate, hint, progress bar
  - Pause toggle, arrows laterais, keyboard nav, ARIA
- **Philosophy fixes:** espaço entre palavras + piscada do MeshButton
- **ServicesSection (Serviços):** 🆕
  - 3 cards expandíveis (acordeon) — Landing/Institucional/Aplicações
  - Mini-scenes 3D específicas por card:
    - Landing: página única + highlight scanner viajando
    - Institucional: torre 6 andares flutuantes + partículas em espiral
    - Aplicações: mind map 3D com tubos curvos + nós pulsantes
  - Layout flex com itens-start, min-h-540px, CTA mt-auto
  - Background terrain mesh transparente + vignette overlay
  - Header com section number, red bar accent, sub com linha decorativa
  - Click-outside-to-close + Esc
  - Data normalizada (5 includes uniformes)

### Status do projeto na Home
| # | Zona | vh | Status |
|---|------|----|----|
| 1 | LOADING | 100 | ✅ TriangleLoader |
| 2 | INTRO | (absorvido) | ✅ no logo build |
| 3 | HERO | (absorvido) | ✅ na Philosophy |
| 4 | **PROBLEMA** | 80 | 🟢 a fazer |
| 5 | **SERVIÇOS** | 100 | ✅ feito |
| 6 | PAISAGEM | auto | ✅ orbital |
| 7 | **LABORATÓRIO** | 100 | 🟢 a fazer |
| 8 | **PROCESSO** | 100 | 🟢 a fazer |
| 9 | **SOBRE** | 120 | 🟢 a fazer |
| 10 | **CTA FINAL** | 150 | 🟢 a fazer |
| 11 | **FOOTER** | — | 🟢 a fazer |

---

## 🎯 Próxima sessão sugerida

**Pegar uma das duas próximas naturais:**

### Opção A — Problema (recomendada)
**Por quê:** vem ANTES dos Serviços na ordem da Home, e é uma zona de diagnóstico narrativo. Curtas, dá ritmo. Permite testar o padrão `<HomeCanvas>` partilhado vs canvas-por-zona.

**Conceito:** field de cubos genéricos idênticos. UM cubo no centro transforma em torre triangulada (preview da Paisagem). Lê "esse é o que você se torna com a gente." Eco do reposicionamento.

**Spec já detalhado em:** [docs/superpowers/plans/2026-06-05-home-roadmap-master.md](2026-06-05-home-roadmap-master.md) (seção 4 PROBLEMA)

### Opção B — Processo
**Por quê:** mais simples (HTML + SVG, sem Canvas pesado). Bom pra ganhar momentum se quiser uma sessão produtiva sem riscos técnicos. Foco em copy, micro-interações de scroll, e SVG line drawing.

**Conceito:** SVG line + 4 nodes em horizontal (Estratégia → Design → Código → Resultado). `stroke-dashoffset` animation conforme scroll. Cada node pulsa quando ativo. Click no node → tooltip/scroll suave.

**Spec já detalhado em:** [docs/superpowers/plans/2026-06-05-home-roadmap-master.md](2026-06-05-home-roadmap-master.md) (seção 8 PROCESSO)

### Opção C — Refinar/expandir Serviços
**Por quê:** se quiser aprofundar antes de avançar. Possibilidades:
- Pages dedicadas `/servicos/[slug]` (atualmente abre só acordeon)
- Casos relacionados linkados por serviço
- Reviews/testimonials inline no expanded
- A/B test do card layout (vertical vs horizontal por serviço)

---

## 🐛 Lições aprendidas (sessão Serviços)

Coisas que pegaram bastante tempo — anotar pra evitar próxima sessão:

### 1. **Stale closure em useFrame**
R3F's `useFrame` captura closure no momento de subscribe. Se a função usa props que mudam (`active`), o callback pode ler valor stale.
- **Solução:** `activeRef.current = active` no top do componente, useFrame lê do ref
- **Pattern aplicado em:** ProjectLandscape (orbital), ServiceMiniScene (expansion)

### 2. **Aspect ratio variável → "teleport"**
Canvas `w-full h-fixed` muda aspect ratio drasticamente quando parent flex anima. Causa re-projection visível.
- **Solução:** canvas com **largura fixa** centralizado no card (`w-[260px] h-[170px]`)
- **Aplicação:** mini-canvases em Serviços

### 3. **Camera pullback cancela scale visual**
Aumentar camera Z compensa scale do model — resultado neutro visual.
- **Lesson:** se animação 3D precisa SER visível, escolher UM efeito dominante (scale OU pullback). Combinar com cuidado.

### 4. **Cada scene precisa de Camera Z específico**
Modelos com alturas diferentes (página 3.2 / torre 4.5 / mind map 2.5) precisam de camera Z diferente pra caber sem cortar.
- **Solução:** `CameraPullback` parametrizado (`baseZ`, `activeZ`)

### 5. **Cache HMR / build inconsistente**
Várias mudanças não apareceram até hard reload + restart server. Anti-pattern: rodar `npx next dev` em portas em sequência por dia inteiro.
- **Lesson:** quando algo "não funciona", primeiro restartar server limpo (`rm -rf .next && npx next dev`) ANTES de assumir bug no código.

### 6. **CSS transition-[grid-template-columns] inconsistente**
Tailwind arbitrary property pode não compilar/aplicar. Mover pra `style` inline com `transition: grid-template-columns 0.5s ease-out`.
- **Alternativa final:** trocar `display: grid` por `display: flex` com `flex-grow` animado (mais reliable).

---

## 📋 Estado técnico

### Stack
- Next.js 14.2.35
- React 18.3.1
- TypeScript 5.x
- @react-three/fiber 8.18, @react-three/drei
- GSAP 3.x
- Lenis (smooth scroll)
- Tailwind 3.x + tokens custom em `globals.css`

### Estrutura
```
app/
  page.tsx (home)
  lab/page.tsx (experimentos)
  cases/[slug]/page.tsx
components/
  lab/
    OpeningSequence/        (Logo + Philosophy + Flip)
    ProjectLandscape/       (Paisagem Digital orbital)
    ServicesSection/        (Serviços) 🆕
    TerrainMesh/
    TriangleLoader/
    PhilosophySection/
    ProjectFragments/
    HtmlOverlay/
    ScrollCamera/
    TriangleLines/
    Pyramid/
  case/ (case page components)
  ui/ (MeshButton, etc)
  cursor/ (CursorTriangle)
data/
  cases.ts (6 cases — 3 published, 3 coming-soon)
  services.ts (3 services normalizados)
docs/ (specs, plans, design system)
lib/
  experiments.ts (Lab registry)
```

### Component patterns estabelecidos
- **useExpansion via activeRef:** anti-stale-closure em useFrame
- **CameraPullback parametrizada:** controle de câmera por scene
- **IntersectionObserver:** entry stagger (cards, header)
- **grid-template-rows trick:** acordeon expand sem JS de altura
- **mt-auto:** alinhamento de CTA na base de cards homogêneos
- **flex-grow proporcional:** layout responsivo a estado expandido

---

## 🚦 Quando começar próxima sessão

**Antes de tudo:**
1. Hard reload (Ctrl+Shift+R) pra garantir
2. `git pull origin main` se mudou de máquina
3. Restart server limpo: `rm -rf .next && npx next dev`

**Decisão:** ler [master roadmap](2026-06-05-home-roadmap-master.md) e escolher entre Problema / Processo / outras opções da Camada 2.

**Recomendação:** começar com **Problema** — fecha o ciclo narrativo "diagnostico → soluções" antes da Paisagem que já existe.
