/**
 * Roda trabalho pesado depois que o texto da página já pode pintar.
 *
 * Espera a fonte (com teto, para não travar se o carregamento emperrar),
 * dois frames, e só então o idle do navegador. Título e CTA, que estão no
 * HTML, não disputam rede nem thread com 3D ou script de terceiro.
 */
export function deferUntilPaint(run: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  let cancelled = false;
  let idleId: number | undefined;
  let timer: number | undefined;

  const go = () => {
    if (cancelled) return;
    const ric = window.requestIdleCallback;
    if (ric) {
      idleId = ric(() => {
        if (!cancelled) run();
      }, { timeout: 2000 });
      return;
    }
    timer = window.setTimeout(() => {
      if (!cancelled) run();
    }, 1200);
  };

  const painted = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(go);
    });
  };

  const start = () => {
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const cap = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1500);
    });
    Promise.race([fonts.then(() => undefined), cap]).then(() => {
      if (!cancelled) painted();
    });
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", start);
    if (idleId !== undefined && window.cancelIdleCallback) {
      window.cancelIdleCallback(idleId);
    }
    if (timer !== undefined) window.clearTimeout(timer);
  };
}
