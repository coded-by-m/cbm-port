# Roadmap — Próxima Sessão

**Data:** 2026-06-05 (fim da sessão de zonas)
**Status:** as 11 zonas da Home estão construídas e validadas no Experience Lab. `origin/main` atualizado (push feito).

---

## ✅ Concluído nesta sessão (2026-06-05)

Fechamos **todas as zonas restantes** da Home, cada uma como experimento isolado no `/lab`:

| # | Zona | Stage (lab) | Commit |
|---|------|-------------|--------|
| 4 | **Problema** | `problema` | `0b85c74` |
| 7 | **Laboratório** | `laboratorio` | `7b31b84` |
| 8 | **Processo** | `processo` | `bffa57c` |
| 9 | **Sobre** | `sobre` | `41c66c4` |
| 10-11 | **CTA Final + Footer** | `cta` | `5b778b3` |

### Status de TODAS as zonas
| # | Zona | Status |
|---|------|--------|
| 1 | LOADING (TriangleLoader) | ✅ |
| 2-3 | INTRO/HERO (OpeningSequence + Philosophy) | ✅ |
| 4 | PROBLEMA (cubos → torre triangulada + storytelling 4 beats) | ✅ |
| 5 | SERVIÇOS (3 cards + mini-scenes 3D) | ✅ |
| 6 | PAISAGEM (orbital, 6 fragmentos) | ✅ |
| 7 | LABORATÓRIO (teaser /lab, campo residual de fragmentos) | ✅ |
| 8 | PROCESSO (jornada 3D, 4 formas distintas, scroll-snap) | ✅ |
| 9 | SOBRE (LogoMark + manifesto + fundador + 3 valores) | ✅ |
| 10 | CTA FINAL (CTAFormation: 60 fragmentos → símbolo CbM) | ✅ |
| 11 | FOOTER (logo + nav + copyright) | ✅ |

**Todas isoladas no `/lab`. A Home real (`app/page.tsx`) ainda é placeholder.**

---

## 🎯 Próxima sessão: MONTAR A HOME REAL

O trabalho agora muda de natureza: de **construir zonas** para **compor a página**.

### Objetivo
Transformar `app/page.tsx` (hoje placeholder) na Home completa, juntando as 11 zonas na ordem da jornada, com as transições entre elas.

### Decisões de arquitetura a resolver (brainstormar no início)
1. **Estratégia de composição:**
   - (A) Scroll único contínuo com todas as zonas empilhadas (cada uma `min-h-screen` ou altura própria), Lenis pra smooth scroll.
   - (B) Sistema de "capítulos" com snap entre zonas.
   - (C) Híbrido: algumas zonas sticky/scroll-driven (Problema, Processo, CTA), outras em fluxo normal.
   - **Recomendação inicial:** (C) — respeita o que cada zona já é. As scroll-driven (Problema/Processo/CTA) já têm scroller interno próprio; precisam virar seções no fluxo da página, não `absolute inset-0`.

2. **Refactor necessário — `absolute inset-0` → fluxo de página:**
   - HOJE cada zona é `absolute inset-0` (pra preencher a tela do experimento no /lab).
   - Na Home real precisam virar `relative` em fluxo vertical, com altura própria (`min-h-screen` / `h-[Xvh]`).
   - **Cuidado:** as zonas scroll-driven (Problema, Processo, CTA) usam um scroller interno (`overflow-y-auto` + sticky). Na Home, o scroll é o da PÁGINA. Precisam ser reescritas pra ler o **scroll progress relativo da própria seção dentro da página** (via IntersectionObserver + getBoundingClientRect, ou GSAP ScrollTrigger), não `el.scrollTop`.
   - Esse é o **maior risco técnico** da montagem. Talvez valha um helper `useSectionScrollProgress(ref)` compartilhado.

3. **Transições entre zonas** (já especificadas no master roadmap, seção "Transições"):
   - Paisagem → Problema: fragments dissolvem · cubos aparecem
   - Problema → Serviços: torre completa · cards build
   - etc. Avaliar quais valem implementar vs corte simples (fade).

4. **Canvas compartilhado vs por-zona:**
   - HOJE cada zona tem seu próprio `<Canvas>`. Numa Home com várias zonas 3D simultâneas no DOM, isso é **caro** (vários contextos WebGL).
   - Avaliar: `<HomeCanvas>` fixo único que troca a cena conforme o scroll, OU manter canvas por-zona mas **montar/desmontar** conforme entram no viewport (IntersectionObserver + unmount).
   - **Recomendação:** montar/desmontar por viewport primeiro (mais simples); HomeCanvas partilhado só se a perf exigir.

### Ordem sugerida da montagem
1. Brainstorm da estratégia (A/B/C) + decisão do canvas.
2. Criar `useSectionScrollProgress` (helper pro scroll relativo).
3. Refatorar as 3 zonas scroll-driven (Problema, Processo, CTA) pra usar o helper.
4. Montar `app/page.tsx` empilhando as zonas na ordem 1→11.
5. Lenis (smooth scroll) + ajuste de alturas.
6. Transições entre zonas (começar pelas mais simples/fade).
7. Performance pass (mount/unmount de canvas por viewport).
8. Mobile pass geral.

---

## 🐛 Lições desta sessão (Processo + CTA)

1. **Progresso amortecido = suavidade global.** Em vez de cada animação ler o scroll cru (jerky), um `ProgressSmoother` (lerp por frame) que todos consomem deixa tudo manteigoso. Pattern reaproveitável na Home.
2. **`depthTest={false}`** em geometrias que devem ficar SEMPRE por cima do terreno (torres, linhas, faíscas) — senão o terreno "come" o fragmento.
3. **Dois `next dev` no mesmo projeto corrompem o `.next/cache`** (race no rename `0.pack.gz_`). Sintoma: 404/500 em rotas que compilavam. Fix: matar todos os servers, `rm -rf .next`, subir UM só. (Reforço da lição #5 da sessão anterior.)
4. **scroll-snap `mandatory`** dá "ponto de chegada" firme; `proximity` é gentil demais quando se quer sentir a parada.
5. **Geometria genérica de arestas:** pra reusar o edge-pulse (tetraedro percorrendo arestas) em formas diferentes, gerar o caminho via greedy-walk sobre os pares de arestas do `EdgesGeometry`.
6. **TerrainLayer é reusável sem o TerrainScene** (que controla a câmera via `useCinematicCamera`). Pra cenas com câmera própria, renderizar `LAYERS.map(TerrainLayer)` direto + `useCursorHover` opcional pro hover.

---

## 📋 Estado técnico

### Componentes de zona (todos em `components/lab/`)
- `OpeningSequence/` · `ProjectLandscape/` · `ProblemSection/` · `ServicesSection/`
- `LabSection/` · `ProcessSection/` · `AboutSection/` · `CTASection/` (+ `Footer`)
- Base reusável: `TriangleLoader/` · `TerrainMesh/` · `ProjectFragments/` · `Pyramid/`
- DS: `components/ui/` (`MeshButton`, `LogoMark`)

### Dados/registro
- `lib/experiments.ts` — registry do /lab (todas as zonas listadas, stages na ordem da jornada)
- `data/cases.ts` · `data/services.ts`

### Contato
- WhatsApp do estúdio: **5548988354350** (usado no CTA e Footer)

### Quando começar a próxima sessão
1. `git pull origin main`
2. Restart limpo: matar dev servers órfãos → `rm -rf .next` → `npx next dev` (UM só)
3. Ler [master roadmap](2026-06-05-home-roadmap-master.md) seção "Transições" + este doc
4. Brainstorm da estratégia de composição ANTES de tocar `app/page.tsx`
