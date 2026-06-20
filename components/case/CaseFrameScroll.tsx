"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { LiveScreenshot } from "@/components/case/LiveScreenshot";

/**
 * Screenshot tall (full-page) dentro de um frame, rolada PELO USUÁRIO com a
 * RODA do mouse: o cursor sobre o frame + girar a roda rola a imagem por dentro,
 * com amortecimento (lerp) e passo normalizado/previsível. Ao chegar no topo ou
 * no fim, a roda deixa de ser capturada e a página volta a rolar (end-release).
 *
 * Fallbacks:
 * - prefers-reduced-motion → imagem estática no topo (sem captura de roda).
 * - dispositivos sem hover (touch) → LiveScreenshot (auto-scroll suave).
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
  /** Sensibilidade: px de imagem por px de delta da roda. Ajuste fino do feel. */
  sensitivity = 5,
}: {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  lazy?: boolean;
  autoDurationSec?: number;
  sensitivity?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const maxRef = useRef(0); // deslocamento máximo (px, >=0)
  const targetRef = useRef(0); // alvo do scroll (px, 0..max)
  const currentRef = useRef(0); // posição suavizada aplicada (px)
  const rafRef = useRef<number | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
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
    // Mantém o alvo dentro dos limites se a imagem/frame mudou de tamanho.
    targetRef.current = Math.min(targetRef.current, maxRef.current);
  }, []);

  // Loop de amortecimento: aproxima current de target e aplica o transform.
  // Dorme quando assenta; acorda via ensureLoop() no wheel.
  const ensureLoop = useCallback(() => {
    if (rafRef.current != null) return;
    const tick = () => {
      const img = imgRef.current;
      const diff = targetRef.current - currentRef.current;
      currentRef.current += diff * 0.18;
      if (Math.abs(diff) < 0.5) {
        currentRef.current = targetRef.current;
        rafRef.current = null; // assentou → dorme
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
      if (img) img.style.transform = `translateY(-${currentRef.current}px)`;
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Listener wheel nativo (não-passivo) — só assim o preventDefault é confiável.
  useEffect(() => {
    if (mode !== "interactive") return;
    const frame = frameRef.current;
    if (!frame) return;

    const onWheel = (e: WheelEvent) => {
      const max = maxRef.current;
      if (max <= 0) return; // nada pra rolar → deixa a página

      // Normaliza linha→pixel e limita o delta por evento (anti-fling trackpad).
      const unit = e.deltaMode === 1 ? 16 : 1;
      const raw = Math.max(-100, Math.min(100, e.deltaY * unit));
      const next = Math.max(0, Math.min(max, targetRef.current + raw * sensitivity));

      // Sem mudança → está numa borda nessa direção → libera o scroll da página.
      if (next === targetRef.current) return;

      e.preventDefault();
      targetRef.current = next;
      if (!hasScrolled) setHasScrolled(true);
      ensureLoop();
    };

    frame.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", recalc);
    return () => {
      frame.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", recalc);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [mode, sensitivity, hasScrolled, ensureLoop, recalc]);

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
        style={{ transform: "translateY(0px)", willChange: "transform" }}
      />

      {/* Dica de interação — pílula sutil que some após o primeiro scroll. */}
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] text-[#F5F2ED]/75 backdrop-blur-sm transition-opacity duration-500"
          style={{
            fontFamily: '"Satoshi", sans-serif',
            fontWeight: 500,
            opacity: hasScrolled ? 0 : 1,
          }}
        >
          {/* Ícone de mouse com rodinha */}
          <svg width="9" height="13" viewBox="0 0 10 14" aria-hidden fill="none">
            <rect
              x="1"
              y="1"
              width="8"
              height="12"
              rx="4"
              stroke="#F5F2ED"
              strokeOpacity="0.7"
              strokeWidth="1.1"
            />
            <line
              x1="5"
              y1="3.4"
              x2="5"
              y2="5.4"
              stroke="#FB3640"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Role
        </span>
      )}
    </div>
  );
}
