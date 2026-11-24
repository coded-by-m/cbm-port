"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Entrada dos projetos: marca `is-in` em cada `[data-reveal]` quando ele
 * entra na tela (uma vez só); o CSS faz o resto. Vale pro primeiro também,
 * que já está na tela quando a página abre.
 *
 * Sem piscar: quem esconde é `REVEAL_BOOT`, inline, antes do primeiro quadro
 * (põe `bb-motion` no <html>). Se o JS não subir em 6s, ele mesmo desiste e
 * mostra tudo. Sem IntersectionObserver ou com "reduzir movimento", nada se
 * esconde. Chegando por navegação interna o script inline não roda; aí o
 * layout effect põe a classe, ainda antes da pintura.
 */
export const REVEAL_BOOT = `try{if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.classList.add("bb-motion");setTimeout(function(){if(!window.__bbReveal){window.__bbRevealOff=1;d.classList.remove("bb-motion")}},6000)}}catch(e){}`;

declare global {
  interface Window {
    __bbReveal?: boolean;
    __bbRevealOff?: number;
  }
}

export function useReveal(root: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    window.__bbReveal = true;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // O JS demorou e o boot já mostrou tudo: não esconde de novo.
    if (window.__bbRevealOff) return;
    html.classList.add("bb-motion");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          // O print só desenrola com a imagem pronta: senão a animação
          // passa inteira num quadro vazio enquanto ela ainda carrega.
          const img = e.target.querySelector("img");
          const show = () => e.target.classList.add("is-in");
          if (img && !img.complete) {
            img.addEventListener("load", show, { once: true });
            img.addEventListener("error", show, { once: true });
          } else show();
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const watch = () => items.forEach((it) => io.observe(it));

    // Chegando pelo cartão o QR cobre a tela: o primeiro projeto só entra
    // quando o mergulho termina, senão a onda passa escondida atrás do véu.
    let mo: MutationObserver | null = null;
    if (html.classList.contains("bb-qr")) {
      mo = new MutationObserver(() => {
        if (html.classList.contains("bb-qr")) return;
        mo?.disconnect();
        watch();
      });
      mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    } else watch();

    return () => {
      io.disconnect();
      mo?.disconnect();
      html.classList.remove("bb-motion");
    };
  }, [root]);
}
