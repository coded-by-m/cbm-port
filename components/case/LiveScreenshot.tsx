"use client";

import { useRef, useState, type ReactNode } from "react";
import { shotScrollKeyframes, useShotScroll } from "@/hooks/useShotScroll";

/**
 * Screenshot tall (full-page) que rola verticalmente sozinha, devagar, em loop:
 * desce até o rodapé e volta. Distância e velocidade saem do tamanho real
 * da imagem no quadro (ver useShotScroll).
 * onError → cai no `fallback`. Pausa em prefers-reduced-motion.
 */
export function LiveScreenshot({
  src,
  poster,
  alt,
  fallback = null,
  lazy = false,
}: {
  src?: string;
  /** Primeiro quadro leve do `src`, pintado atrás enquanto ele baixa. */
  poster?: string;
  alt: string;
  fallback?: ReactNode;
  /** Abaixo da dobra → carrega só quando perto (perf). Hero deve ficar eager. */
  lazy?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useShotScroll(imgRef);

  if (!src || errored) return <>{fallback}</>;
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Pôster: o primeiro quadro, leve e prioritário. Fica ATRÁS do print
          com os mesmos pixels no topo — aparece antes e é coberto sem salto.
          `fetchpriority` em minúsculas: o React 18 não conhece a prop. */}
      {poster && (
        // biome-ignore lint/a11y/useAltText: decorativo, o alt fica no print
        <img
          src={poster}
          alt=""
          aria-hidden
          decoding="async"
          {...{ fetchpriority: "high" }}
          className="absolute left-0 top-0 w-full"
        />
      )}
      {/* biome-ignore lint/a11y/useAltText: alt é repassado */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        onError={() => setErrored(true)}
        className="live-shot absolute left-0 top-0 w-full object-cover object-top"
      />
      <style>{`
        ${shotScrollKeyframes("live-shot-scroll")}
        .live-shot {
          animation: live-shot-scroll var(--shot-dur, 30s) ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .live-shot { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
