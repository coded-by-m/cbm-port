"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Progresso de scroll (0..1) de uma seção scroll-driven, medido pela posição
 * do seu "trilho" (o div alto interno) relativa ao viewport.
 *
 * Por que medir via `getBoundingClientRect` em vez do `scrollTop` de um
 * scroller interno: o rect é sempre relativo ao VIEWPORT, então o mesmo
 * cálculo funciona nos dois contextos onde a zona vive —
 *
 *  - **Lab** (`/lab`): a zona é um scroller interno (`absolute inset-0
 *    overflow-y-auto`) dentro de um `main overflow-hidden`. O scroll é do
 *    container interno.
 *  - **Home** (`app/page.tsx`): a zona está em fluxo de página (`relative`);
 *    o scroll é o da janela.
 *
 * Em ambos, conforme se rola, o trilho alto sobe e seu `rect.top` vai de ~0
 * a negativo. `travel = rect.height - innerHeight` é a "altura extra" que o
 * filho `sticky` percorre. Logo `progress = -rect.top / travel`.
 *
 * O listener usa **fase de captura** (`capture: true`) porque eventos
 * `scroll` não borbulham; capturar no `window` pega o scroll de qualquer
 * scroller — interno (lab) ou a própria janela (home) — com um só listener.
 *
 * @param trackRef ref pro div alto interno (`h-[Nvh]`), não pra `<section>`.
 *                 No lab a `<section>` é o scroller e seu rect fica fixo; é o
 *                 trilho interno que se move.
 * @param onProgress callback chamado (coalescido por rAF) a cada mudança de
 *                   scroll com o progress 0..1. A zona deriva seu estado aqui.
 */
export function useSectionScrollProgress(
  trackRef: RefObject<HTMLElement>,
  onProgress: (progress: number) => void,
): void {
  // Mantém o callback fresco sem recriar o efeito a cada render.
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;

    const compute = () => {
      raf = 0;
      const node = trackRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress =
        travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;
      onProgressRef.current(progress);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    // capture: true → pega scroll de qualquer scroller (interno ou janela).
    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("scroll", schedule, opts);
    window.addEventListener("resize", schedule);
    compute();

    return () => {
      window.removeEventListener("scroll", schedule, opts);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trackRef]);
}

/**
 * Rola suavemente até um `progress` (0..1) dentro de uma seção scroll-driven,
 * funcionando nos dois modos.
 *
 * Calcula o quanto o `rect.top` do trilho precisa mudar pra atingir
 * `-progress * travel` e aplica via `scrollBy` no container certo: a janela
 * (home) ou o scroller interno (lab).
 *
 * @param trackRef ref pro div alto interno.
 * @param progress alvo 0..1.
 * @param scroller container de scroll interno (lab); omita/`null` na home.
 */
export function scrollToSectionProgress(
  trackRef: RefObject<HTMLElement>,
  progress: number,
  scroller?: HTMLElement | null,
): void {
  const el = trackRef.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  const target = Math.max(0, Math.min(1, progress));
  // Queremos rect.top === -target*travel; delta a aplicar no scroll atual.
  const delta = rect.top + target * travel;
  if (scroller) {
    scroller.scrollBy({ top: delta, behavior: "smooth" });
  } else {
    window.scrollBy({ top: delta, behavior: "smooth" });
  }
}
