"use client";

import { useState, type ReactNode } from "react";

/**
 * Screenshot tall (full-page) que rola verticalmente sozinha, devagar, em loop.
 * onError → cai no `fallback`. Pausa em prefers-reduced-motion.
 */
export function LiveScreenshot({
  src,
  alt,
  fallback = null,
  durationSec = 35,
  lazy = false,
}: {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  durationSec?: number;
  /** Abaixo da dobra → carrega só quando perto (perf). Hero deve ficar eager. */
  lazy?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) return <>{fallback}</>;
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* biome-ignore lint/a11y/useAltText: alt é repassado */}
      <img
        src={src}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        onError={() => setErrored(true)}
        className="live-shot absolute left-0 top-0 w-full object-cover object-top"
        style={{ animationDuration: `${durationSec}s` }}
      />
      <style>{`
        @keyframes live-shot-scroll {
          0% { transform: translateY(0); }
          50% { transform: translateY(-62%); }
          100% { transform: translateY(0); }
        }
        .live-shot {
          animation-name: live-shot-scroll;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .live-shot { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
