"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LiveScreenshot } from "@/components/case/LiveScreenshot";

/**
 * Screenshot tall (full-page) dentro de um frame, rolada PELO USUÁRIO via
 * posição do mouse: o topo do frame mostra o topo da página, a base mostra o
 * fim. Suave (não sequestra o scroll da página). Sai do frame → volta ao topo.
 *
 * Fallbacks:
 * - prefers-reduced-motion → imagem estática no topo (sem movimento).
 * - dispositivos sem hover (touch) → LiveScreenshot (auto-scroll suave), já que
 *   não há cursor pra mapear.
 *
 * onError → cai no `fallback`.
 */
export function CaseFrameScroll({
  src,
  alt,
  fallback = null,
  lazy = false,
  /** Duração do auto-scroll no fallback touch. */
  autoDurationSec = 32,
}: {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  lazy?: boolean;
  autoDurationSec?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const maxRef = useRef(0); // deslocamento máximo (px, >=0)
  const [offset, setOffset] = useState(0); // px (>=0; aplicado como translateY negativo)
  const [errored, setErrored] = useState(false);
  const [mode, setMode] = useState<"interactive" | "auto" | "static">(
    "interactive",
  );

  // Decide o modo conforme capacidade do dispositivo / preferências.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    setMode(reduce ? "static" : canHover ? "interactive" : "auto");
  }, []);

  const recalc = useCallback(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    maxRef.current = Math.max(0, img.clientHeight - frame.clientHeight);
  }, []);

  useEffect(() => {
    if (mode !== "interactive") return;
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [mode, recalc]);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== "interactive") return;
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const t = Math.min(
        1,
        Math.max(0, (e.clientY - rect.top) / rect.height),
      );
      setOffset(t * maxRef.current);
    },
    [mode],
  );

  const handleLeave = useCallback(() => setOffset(0), []);

  if (!src || errored) return <>{fallback}</>;

  // Touch / sem hover → auto-scroll suave (LiveScreenshot).
  if (mode === "auto") {
    return (
      <LiveScreenshot
        src={src}
        alt={alt}
        durationSec={autoDurationSec}
        lazy={lazy}
        fallback={fallback}
      />
    );
  }

  const interactive = mode === "interactive";

  return (
    <div
      ref={frameRef}
      className="group relative h-full w-full overflow-hidden"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={interactive ? { cursor: "ns-resize" } : undefined}
    >
      {/* biome-ignore lint/a11y/useAltText: alt é repassado */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        onLoad={recalc}
        onError={() => setErrored(true)}
        className="absolute left-0 top-0 w-full object-cover object-top"
        style={{
          transform: `translateY(-${offset}px)`,
          transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Dica de interação — pílula sutil que some ao passar o mouse. */}
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-[#F5F2ED]/75 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          <svg width="7" height="9" viewBox="0 0 8 10" aria-hidden>
            <polygon points="4,0 7,3 1,3" fill="#FB3640" />
            <polygon points="4,10 7,7 1,7" fill="#FB3640" />
          </svg>
          Role
        </span>
      )}
    </div>
  );
}
