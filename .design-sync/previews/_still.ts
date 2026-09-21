// Faz o card mostrar o estado final, em vez de um quadro no meio da entrada.
//
// Nao e um componente: nenhum componente se chama _still, entao o conversor
// nunca usa este arquivo como entrada de preview. Ele e importado pelo efeito
// colateral — `import "./_still";` como PRIMEIRA linha do preview, antes do
// import do componente, para que o patch exista quando o React montar.
//
// Por que: o card e uma foto, tirada logo depois de `document.fonts.ready`.
// Componentes que entram com `Reveal` escalonado (`delay={i * 90}`) sao
// fotografados no meio da transicao — o primeiro item aparece solido e os
// seguintes saem lavados, o que le como defeito sem ser.
//
// O que se faz aqui NAO e desligar a animacao por fora: e responder
// `prefers-reduced-motion: reduce`, que e um estado de primeira classe deste
// design system. O proprio Reveal trata esse caso pulando direto para o estado
// final ("quem pediu menos movimento recebe o estado final"), e o mesmo vale
// para StrokeText e TriangleMark. Ou seja, o card mostra uma apresentacao que o
// sistema realmente entrega — a que ele entrega a quem pede menos movimento.

// Alguns componentes nao passam por media query nenhuma: nascem com opacity 0 e
// so trocam de estado num `setTimeout` de entrada — o WhatsAppFab espera 900 ms,
// o CaseHero 80 ms. Nao ha prop de bypass, e a foto e tirada antes disso, entao
// o card sai vazio. Aqui os temporizadores curtos disparam na hora.
//
// O escopo e estreito de proposito: os unicos `setTimeout` de toda a superficie
// sincronizada sao esses portoes de entrada (verificado por grep). Nao existe
// carrossel nem passo cronometrado que isto pudesse atropelar.
if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
  const nativo = window.setTimeout;
  window.setTimeout = ((fn: TimerHandler, atraso?: number, ...resto: unknown[]) =>
    nativo(fn, typeof atraso === "number" && atraso <= 1500 ? 0 : atraso, ...resto)
  ) as typeof window.setTimeout;
}

if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const nativo = window.matchMedia.bind(window);
  window.matchMedia = ((query: string) => {
    const mql = nativo(query);
    if (!/prefers-reduced-motion:\s*reduce/i.test(query)) return mql;
    return new Proxy(mql, {
      get(alvo, chave, receptor) {
        if (chave === "matches") return true;
        const valor = Reflect.get(alvo, chave, receptor);
        return typeof valor === "function" ? valor.bind(alvo) : valor;
      },
    });
  }) as typeof window.matchMedia;
}

export {};
