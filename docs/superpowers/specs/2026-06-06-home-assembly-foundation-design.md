# Design — Fundação da Home (montagem real)

**Data:** 2026-06-06
**Fase:** transição de *construir zonas* → *compor a página*
**Escopo:** Fundação primeiro. Entregar uma Home navegável de ponta a ponta com scroll nativo. Sem Lenis, sem transições elaboradas, sem perf/mobile pass dedicado.

Antecede: as 11 zonas já estão construídas e validadas isoladas no `/lab` (ver `docs/superpowers/plans/2026-06-05-next-session-home-assembly.md`).

---

## Objetivo

Transformar `app/page.tsx` (hoje placeholder) na Home completa, empilhando as zonas na ordem da jornada, em fluxo de página, com corte simples entre seções.

## Decisões resolvidas (brainstorm)

1. **Escopo:** fundação primeiro (Home navegável end-to-end; sem transições elaboradas/Lenis/perf/mobile).
2. **Ordem da jornada:** `Problema → Serviços → Paisagem` (segue o roadmap e o código atual — resolve a contradição com o `STAGE_ORDER` de `lib/experiments.ts`, que tinha Serviços/Paisagem invertidos). **`STAGE_ORDER` deve ser corrigido** pra refletir isto.
3. **Acoplamentos existentes preservados:** Problema já monta Serviços no seu outro; CTA já inclui Footer; OpeningSequence já compõe loading+intro+hero. Mantidos como estão.
4. **Canvas:** mount/unmount por viewport via wrapper `<LazySection>`. Canvas-compartilhado fica pra depois (só se a perf exigir).

---

## Arquitetura

### Seções top-level (7)

Várias zonas já compõem sub-zonas internamente, então o stack top-level tem 7 itens, não 11:

| # | Componente | Cobre | Tipo |
|---|------------|-------|------|
| 1 | `OpeningSequence` | loading + intro + hero | entry-animated |
| 2 | `ProblemSection` | problema → outro monta Serviços | **scroll-driven** |
| 3 | `ProjectLandscape` | paisagem | scroll/orbital |
| 4 | `LabSection` | laboratório (teaser /lab) | entry-animated |
| 5 | `ProcessSection` | processo (jornada 3D) | **scroll-driven** |
| 6 | `AboutSection` | sobre | entry-animated |
| 7 | `CTASection` | cta + footer | **scroll-driven** |

### `app/page.tsx`

Empilhamento vertical em fluxo normal:

```tsx
<main>
  <LazySection><OpeningSequence /></LazySection>
  <LazySection><ProblemSection /></LazySection>
  <LazySection><ProjectLandscape /></LazySection>
  <LazySection><LabSection /></LazySection>
  <LazySection><ProcessSection /></LazySection>
  <LazySection><AboutSection /></LazySection>
  <LazySection><CTASection /></LazySection>
</main>
```

Transições entre seções = **corte simples** (a seção entra no viewport via scroll nativo da página). Sem transições cross-zone nesta fase.

---

## Componente central: `useSectionScrollProgress(ref)`

**Maior risco técnico da montagem.** As 3 zonas scroll-driven (Problema, Processo, CTA) hoje leem o scroll de um scroller interno próprio. Precisam ler o scroll **relativo da própria seção dentro da página**.

### Insight que torna o refactor mínimo

O markup das zonas scroll-driven **já é** `div alto (Nvh)` + filho `sticky top-0 h-screen`. Hoje o que está errado é só a *fonte* do scroll: um `<section className="absolute inset-0 overflow-y-auto">` com scroller interno.

Trocar `absolute inset-0 overflow-y-auto` → `relative` faz o `sticky top-0` grudar contra o **scroll da janela** automaticamente. A geometria sticky+alto continua idêntica.

### O helper

```ts
// hooks/useSectionScrollProgress.ts
// Retorna um ref mutável (0..1) = quanto a janela percorreu DENTRO da seção.
// Atualiza via listener de scroll passivo + rAF (sem re-render por frame).
function useSectionScrollProgress(sectionRef): MutableRefObject<number> {
  const progress = useRef(0);
  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight; // "altura extra" do sticky
      progress.current = travel > 0
        ? Math.max(0, Math.min(1, -rect.top / travel))
        : 0;
    };
    // scroll passivo + resize; rAF coalescido
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return cleanup;
  }, [sectionRef]);
  return progress;
}
```

### Contrato do refactor por zona

Para Problema, Processo e CTA, o refactor é uniforme:

1. `<section className="absolute inset-0 overflow-y-auto …">` → `<section className="relative …">` (remove o scroller interno; mantém o `bg`).
2. Remover o `useEffect` que lê `el.scrollTop`; substituir pela leitura de `useSectionScrollProgress(sectionRef)`.
3. A matemática interna (beats, outro, draw da torre/linha, thresholds como `DRAW_END`/`OUTRO_START`) **não muda** — ela já consome um `raw` 0..1; só troca a origem.
4. Ações de navegação que faziam `el.scrollTo` (ex.: `goToBeat`, `advance` no ProblemSection) passam a usar `window.scrollTo` calculando o offset absoluto da seção (`el.offsetTop + progressAlvo * travel`).

**Por que é uniforme:** as 3 zonas têm padrão idêntico — `div h-[Nvh]` + `sticky top-0` + `el.scrollTop / (scrollHeight − clientHeight)`. Mesma transformação nas 3.

---

## Componente: `<LazySection>`

Wrapper que controla o ciclo de vida do conteúdo 3D pesado por viewport.

- **Responsabilidade única:** montar `children` quando a seção está a ~1 viewport de entrar; desmontar ao sair (com margem de histerese pra evitar thrash em scroll de borda).
- **Mecanismo:** `IntersectionObserver` com `rootMargin` generoso (ex.: `100% 0px`). Estado `isActive`; renderiza um placeholder de mesma altura quando inativo (evita pulo de layout / salto do scrollbar).
- **Interface:** `<LazySection minHeight?><Zona /></LazySection>`. A `minHeight` reserva o espaço da zona enquanto desmontada (default `100vh`; zonas scroll-driven passam a própria altura, ex. `520vh`).
- **Depende de:** só do DOM (IntersectionObserver). Não conhece as zonas.

Trade-off aceito: cenas remontam ao revisitar (re-init do canvas). Aceitável na fundação; HomeCanvas compartilhado resolveria isso depois se incomodar.

---

## Mudanças de dados/config

- `lib/experiments.ts`: corrigir `STAGE_ORDER` pra `… problema, servicos, paisagem …` (alinhar com a jornada canônica). Não afeta o `/lab` além da ordem de listagem.

---

## Ordem de implementação

1. Criar `useSectionScrollProgress(ref)` + teste de sanidade isolado.
2. Criar `<LazySection>`.
3. Refatorar **ProblemSection** (a mais complexa — tem outro com Serviços embutido) pra usar o helper. Validar no `/lab` que continua idêntica.
4. Refatorar **ProcessSection** e **CTASection** (mesmo contrato).
5. Montar `app/page.tsx` empilhando as 7 seções com `<LazySection>`.
6. Corrigir `STAGE_ORDER`.
7. Smoke test end-to-end: rolar a Home inteira, ver cada zona entrar/sair, scroll-driven respondendo ao scroll da página.

## Critérios de sucesso

- [ ] `app/page.tsx` renderiza as 7 seções na ordem canônica, navegável por scroll nativo de ponta a ponta.
- [ ] As 3 zonas scroll-driven respondem ao scroll **da página** (não a um scroller interno) e mantêm a animação idêntica ao `/lab`.
- [ ] Sem múltiplos contextos WebGL vivos ao mesmo tempo além das seções próximas ao viewport (via `<LazySection>`).
- [ ] Cada zona scroll-driven continua passando seu comportamento original quando isolada no `/lab` (refactor não regride o lab).
- [ ] Sem pulo de layout ao montar/desmontar seções (placeholder de altura reservada).

## Fora de escopo (fases futuras)

Lenis/smooth scroll · transições elaboradas cross-zona · perf pass profundo (HomeCanvas compartilhado) · mobile pass dedicado.

## Riscos

- **Sticky vs página:** se uma zona scroll-driven tiver wrapper extra que quebre o `sticky` em fluxo de página. Mitigação: refatorar uma (Problema) primeiro e validar antes das outras.
- **Histerese do `<LazySection>`:** margem mal calibrada pode desmontar uma zona scroll-driven no meio da animação. Mitigação: `rootMargin` generoso; testar nas bordas.
- **`window.scrollTo` nas ações de navegação:** offset absoluto precisa considerar `offsetTop` real da seção empilhada (muda vs o lab isolado).
