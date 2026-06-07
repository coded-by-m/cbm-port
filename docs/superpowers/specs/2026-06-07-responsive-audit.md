# Audit Responsivo — cbm-port (mobile + tablet)

**Data:** 2026-06-07 · **Método:** Playwright em 390×844 (mobile) e 768×1024 (tablet), capítulo a capítulo + páginas.

**Princípio:** *enhancement pra baixo*. O desktop (`lg:`) fica **congelado** — nunca editar as classes atuais. Mobile/tablet ganham overrides `sm:`/`md:` + um hook `useIsMobile` pros canvases. O desktop não pode degradar.

**Alvos:** mobile ≈ 360–430, tablet ≈ 768–1024. Breakpoints Tailwind: `sm` 640, `md` 768, `lg` 1024.

---

## Cross-cutting (afeta o site todo)

| # | Item | Severidade | Tratamento |
|---|------|-----------|-----------|
| C1 | **Sem navegação mobile/tablet** — `ChapterRail` é `hidden lg:flex` (some <1024). É o "não consigo sair/me orientar". | **CRÍTICO** | Criar escotilha mobile: padrão a decidir (dots laterais / barra inferior / drawer / hamburger). Reusa `HOME_CHAPTERS` + `jumpTo` (wipe) + `activeChapter`. |
| C2 | **WebGL Context Lost** ao navegar (visto no console, repetido). Em GPU de celular quebra cenas (pode explicar partes "em branco"). | **ALTO** | Dispose limpo no unmount do `LazySection` (gl.dispose/forceContextLoss); reduzir contextos simultâneos no mobile (rootMargin menor → menos cenas montadas); cap de DPR mobile. |
| C3 | `InteractionCue` persiste no footer ("ROLE — O CONVITE SE FORMA"). | BAIXO | Ocultar o cue ao chegar no footer/fim do cap. 8. |
| C4 | Scrollbar nativa visível na borda. | BAIXO | Esconder/estilizar (sem quebrar o scroll). |
| C5 | `favicon.ico` 404. | TRIVIAL | Adicionar favicon. |

---

## Home — por capítulo

| Cap | Estado mobile | Estado tablet | Ação |
|-----|--------------|--------------|------|
| 0 Logo | ✅ centralizado | ✅ | — |
| 1 Manifesto | ✅ texto legível, terreno, cue | ✅ | — |
| 2 Problema | ✅ headline grande mas cabe, grade | ✅ | — |
| 3 Serviços | ✅ cards empilham | ✅ empilham | LOW: avaliar 2-col no tablet |
| **4 Projetos** | ❌ **só terreno; fragmentos não enquadrados; card ausente** | ⚠️ card aparece, fragmentos não enquadrados | **CRÍTICO**: reframe responsivo da câmera/posição dos fragmentos + tamanho/posição do card window (hoje no canto, desktop-tuned). É a seção mais importante. |
| 5 Processo | ✅ estação 3D, headline grande, card | ✅ | LOW: headline grande |
| 6 Laboratório | ✅ botão + métricas empilham | ✅ | — |
| 7 Sobre | ✅ empilha (símbolo→conteúdo); headline bem alto | ✅ 2-col (símbolo esq / conteúdo dir) | LOW: reduzir o headline gigante no mobile |
| 8 Convite | ✅ headline cheeky + CTA + fragmentos convergindo | ✅ | (cue persiste = C3) |
| Footer | ✅ empilha (logo/status/nav/contato/©) | ✅ 3-col | **MEDIUM**: atalhos `G`/`C` não fazem sentido no touch (sem teclado) → ocultar no touch (manter só clicáveis) |

---

## Páginas

| Página | Estado | Ação |
|--------|--------|------|
| **/cases/[slug] — hero** | ❌ mobile: título "MACHADO PLATAFORMAS" **estoura** (cortado à direita); **eyebrow sobrepõe o botão fixo "← PAISAGEM"**. Tablet: título cabe (2 linhas). | **ALTO**: clamp/quebra do título no mobile + `padding-top` no hero pra não colidir com o back button fixo. |
| /cases — telas/responsivo/CTA | ✅ empilham (1-col); back button fixo sobrepõe conteúdo ao rolar (minor) | LOW |
| /lab | ✅ "← Início" ok, lista de experimentos com wrap; header (back + tagline) um pouco apertado | LOW: header mobile |

---

## Ordem de execução (proposta)

1. **C1 — Navegação mobile/tablet** (a escotilha). Destrava o "não consigo sair". **CRÍTICO**
2. **Cap. 4 — Projetos vitrine responsivo** (reframe câmera/fragmentos + card). **CRÍTICO** + é a seção-chave.
3. **C2 — WebGL Context Lost** (estabilidade). **ALTO**
4. **Case hero** (overflow do título + overlap do eyebrow/back). **ALTO**
5. **Footer atalhos no touch (Medium)** + C3 cue no footer + C4 scrollbar + C5 favicon.
6. **Polishes LOW**: Serviços 2-col tablet, headline Sobre/Processo no mobile, header /lab, back button do case.

Cada item é executado e validado (Playwright + device real) com aprovação por etapa. Desktop permanece intocado (`lg:`).
