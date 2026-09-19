"use client";

import { useEffect, useRef, useState } from "react";

const LERP = 0.25;
const COLOR = "#97938b";
const SPIN_SECONDS = 6;

/**
 * Cursor triangular para zonas de Canvas 3D.
 *
 * Em qualquer página do site, escuta a posição do mouse e mostra um
 * pequeno triângulo wireframe quando o ponteiro está sobre um
 * `<canvas>` (qualquer cena Three.js). Sobre HTML normal, esconde-se
 * e libera o cursor nativo — assim o usuário lê texto/clica em botões
 * sem perder familiaridade.
 *
 * - Detecção: `document.elementFromPoint` por frame de movimento.
 * - Posição: interpolada (LERP) num `requestAnimationFrame` — dá a
 *   sensação de inércia comum em cursores premium.
 * - Touch: componente não monta em `(pointer: coarse)` (celulares
 *   não têm cursor).
 * - Reduced motion: spin contínuo desativado por media query CSS.
 *
 * Estrutura: SVG de 20×20 com um triângulo equilátero centrado no
 * pixel exato do ponteiro + um dot de 1px no centroide para precisão
 * de aim. Posicionado em `position: fixed` por cima de tudo.
 */
export function CursorTriangle() {
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia?.("(pointer: coarse)").matches;
    if (!isTouch) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    document.documentElement.classList.add("cursor-triangle-active");

    // O loop só roda quando há o que animar: invisível, aba oculta ou
    // posição já alcançada param o rAF. Antes ele girava a 60fps o tempo
    // todo, mesmo com o triângulo escondido sobre HTML comum.
    let rafId = 0;
    let running = false;

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      // Ativa sobre canvas 3D OU qualquer ancestral marcado com
      // `data-cursor="triangle"` (zonas HTML opt-in, ex: PhilosophySection).
      const overZone =
        el?.tagName === "CANVAS" ||
        el?.closest('[data-cursor="triangle"]') !== null;

      if (overZone !== visible.current) {
        visible.current = overZone;
        container.style.opacity = overZone ? "1" : "0";
      }
      if (visible.current) start();
    };

    const onLeave = () => {
      if (visible.current) {
        visible.current = false;
        container.style.opacity = "0";
      }
      stop();
    };

    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * LERP;
      current.current.y += dy * LERP;
      container.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      // Parado e invisível → nada a desenhar até o próximo movimento.
      if (!visible.current && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        running = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
      document.documentElement.classList.remove("cursor-triangle-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          marginLeft: -10,
          marginTop: -10,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 150ms ease",
          zIndex: 9999,
          willChange: "transform",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="-10 -10 20 20"
          style={{
            display: "block",
            animation: `cursor-triangle-spin ${SPIN_SECONDS}s linear infinite`,
          }}
        >
          <polygon
            points="0,-9.24 -8,4.62 8,4.62"
            fill="none"
            stroke={COLOR}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <circle cx={0} cy={0} r={1} fill={COLOR} />
        </svg>
      </div>
      <style>{`
        @keyframes cursor-triangle-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        html.cursor-triangle-active canvas,
        html.cursor-triangle-active [data-cursor="triangle"],
        html.cursor-triangle-active [data-cursor="triangle"] * {
          cursor: none;
        }
        @media (prefers-reduced-motion: reduce) {
          html.cursor-triangle-active svg[viewBox="-10 -10 20 20"] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
