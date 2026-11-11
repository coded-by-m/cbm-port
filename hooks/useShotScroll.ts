"use client";

import { useEffect, type RefObject } from "react";

/**
 * Mede quanto um print de página inteira precisa subir pra mostrar o rodapé
 * dentro do quadro (o elemento pai da imagem) e grava no próprio `<img>`:
 *
 *   --shot-dist  distância em px (altura da imagem − altura do quadro)
 *   --shot-dur   duração da ida e volta, proporcional à distância
 *
 * Antes a animação descia um % fixo da altura da imagem: num print curto
 * passava do fim e mostrava área vazia, num longo nunca chegava ao rodapé,
 * e cada case rolava numa velocidade diferente.
 *
 * O teto de duração garante que prints muito longos ainda cheguem ao fim
 * num tempo razoável (rolam mais rápido em vez de nunca terminar).
 */
export function useShotScroll(
  imgRef: RefObject<HTMLImageElement>,
  { pxPerSec = 120, minSec = 12, maxSec = 60 } = {},
) {
  useEffect(() => {
    const img = imgRef.current;
    const frame = img?.parentElement;
    if (!img || !frame) return;

    const measure = () => {
      const dist = Math.max(0, img.clientHeight - frame.clientHeight);
      const dur = Math.min(maxSec, Math.max(minSec, (2 * dist) / pxPerSec));
      img.style.setProperty("--shot-dist", `${dist}px`);
      img.style.setProperty("--shot-dur", `${dur.toFixed(1)}s`);
    };

    measure();
    // A imagem muda de altura ao carregar; o quadro, ao redimensionar a tela.
    const ro = new ResizeObserver(measure);
    ro.observe(img);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [imgRef, pxPerSec, minSec, maxSec]);
}

/**
 * Keyframes da ida e volta, com uma pausa curta no topo e no rodapé.
 * Usar com `animation: <nome> var(--shot-dur, 30s) ease-in-out infinite`.
 */
export function shotScrollKeyframes(name: string) {
  return `
    @keyframes ${name} {
      0%, 4%    { transform: translateY(0); }
      46%, 54%  { transform: translateY(calc(var(--shot-dist, 0px) * -1)); }
      96%, 100% { transform: translateY(0); }
    }
  `;
}
