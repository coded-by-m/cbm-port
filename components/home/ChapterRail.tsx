"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_CHAPTERS } from "@/lib/homeChapters";
import { LogoMark } from "@/components/ui/LogoMark";
import { railSub } from "@/lib/railProgress";

const SIGNAL = "#FB3640";
const OFF_WHITE = "#F5F2ED";
const SAT = '"Satoshi", sans-serif';
const ROW = 30; // altura de cada marcador (px) — geometria determinística
const TOTAL = HOME_CHAPTERS.length;
const TRACK = (TOTAL - 1) * ROW;
const TOP0 = ROW / 2; // centro do primeiro marcador
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Navbar global da Home — trilha de capítulos na borda direita.
 *
 * Triângulos (linguagem da marca) + menu expansível no hover (nº · nome ·
 * descritor), linha de progresso contínua que preenche conforme rola/avança
 * (cabeça desliza = indicador ativo; sub-progresso dos steppers via railSub),
 * âncora de marca no topo (volta ao Logo) e drag-to-scrub. Clique navega com o
 * wipe da marca (via `onJump`). Teclado (↑/↓ · 1–9) tratado no HomeExperience.
 */
export function ChapterRail({
  active,
  onJump,
}: {
  active: number;
  onJump: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);

  // rAF: progresso contínuo (fill) + sub-progresso do capítulo ativo.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const a = activeRef.current;
      let sub = 0;
      if (railSub.active) {
        sub = clamp01(railSub.value);
      } else {
        const el = document.querySelector(`[data-chapter-index="${a}"]`);
        if (el) {
          const r = el.getBoundingClientRect();
          const scrollable = r.height - window.innerHeight;
          if (scrollable > 4) sub = clamp01(-r.top / scrollable);
        }
      }
      const fill = clamp01((a + sub) / (TOTAL - 1));
      if (fillRef.current) fillRef.current.style.height = `${fill * TRACK}px`;
      if (headRef.current) headRef.current.style.top = `${TOP0 + fill * TRACK}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const indexFromY = (clientY: number) => {
    const el = markersRef.current;
    if (!el) return active;
    const r = el.getBoundingClientRect();
    return Math.max(0, Math.min(TOTAL - 1, Math.floor((clientY - r.top) / ROW)));
  };
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    movedRef.current = false;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    movedRef.current = true;
    setPreview(indexFromY(e.clientY));
  };
  const endDrag = () => {
    if (draggingRef.current && movedRef.current && preview !== null) {
      onJump(preview);
    }
    draggingRef.current = false;
    setPreview(null);
  };

  const shown = preview !== null ? preview : active;

  return (
    <nav
      aria-label="Capítulos da página"
      className="pointer-events-none fixed right-5 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end lg:flex"
    >
      {/* Âncora de marca — volta ao topo (Logo). */}
      <button
        type="button"
        onClick={() => onJump(0)}
        data-cursor="triangle"
        aria-label="Voltar ao topo"
        className="pointer-events-auto mb-3.5 opacity-45 transition-opacity duration-300 hover:opacity-100"
      >
        <LogoMark size={18} />
      </button>

      {/* Trilha — única zona interativa (hover abre o menu; arrastar = scrub). */}
      <div
        ref={markersRef}
        className="pointer-events-auto relative flex flex-col items-end"
        style={{ height: TOTAL * ROW }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Linha base */}
        <div
          className="pointer-events-none absolute w-px"
          style={{
            right: 4,
            top: TOP0,
            height: TRACK,
            background: "rgba(245,242,237,0.12)",
          }}
          aria-hidden
        />
        {/* Fill (progresso) */}
        <div
          ref={fillRef}
          className="pointer-events-none absolute w-px"
          style={{ right: 4, top: TOP0, height: 0, background: SIGNAL }}
          aria-hidden
        />
        {/* Cabeça do progresso = indicador ativo deslizante */}
        <div
          ref={headRef}
          className="pointer-events-none absolute h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full"
          style={{
            right: 4,
            top: TOP0,
            background: SIGNAL,
            boxShadow: `0 0 7px ${SIGNAL}`,
          }}
          aria-hidden
        />

        {HOME_CHAPTERS.map((ch, i) => {
          const isActive = i === shown;
          const isPast = i < shown;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                if (!movedRef.current) onJump(i);
              }}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Ir para ${ch.label}`}
              data-cursor="triangle"
              className="relative flex items-center justify-end gap-2.5 bg-transparent"
              style={{ height: ROW }}
            >
              <div
                className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-out"
                style={{
                  maxWidth: open ? 380 : 0,
                  opacity: open ? 1 : 0,
                }}
              >
                {open && ch.cue && (
                  <span
                    className="text-[0.5rem] tracking-[0.12em] text-[#F5F2ED]/35"
                    style={{ fontFamily: SAT, fontWeight: 400 }}
                  >
                    {ch.cue}
                  </span>
                )}
                <span
                  className="text-[0.5rem] tabular-nums tracking-[0.2em]"
                  style={{
                    fontFamily: SAT,
                    fontWeight: 600,
                    color: isActive ? SIGNAL : "rgba(251,54,64,0.55)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[0.6rem] uppercase tracking-[0.25em]"
                  style={{
                    fontFamily: SAT,
                    fontWeight: 500,
                    color: isActive
                      ? "rgba(245,242,237,0.95)"
                      : "rgba(245,242,237,0.6)",
                  }}
                >
                  {ch.label}
                </span>
              </div>
              <svg
                aria-hidden
                width="9"
                height="9"
                viewBox="0 0 10 10"
                className="shrink-0 transition-transform duration-300"
                style={{ transform: isActive ? "scale(1.5)" : "scale(1)" }}
              >
                <polygon
                  points="9,1 9,9 1,5"
                  fill={isActive || isPast ? SIGNAL : "transparent"}
                  stroke={isActive || isPast ? SIGNAL : OFF_WHITE}
                  strokeWidth="1"
                  opacity={isActive ? 1 : isPast ? 0.55 : open ? 0.9 : 0.4}
                />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Orientação at-a-glance (não bloqueia conteúdo): nome + posição. */}
      <div className="pointer-events-none mt-2.5 flex flex-col items-end gap-0.5">
        <span
          className="text-[0.55rem] uppercase tracking-[0.25em] text-[#F5F2ED]/80"
          style={{ fontFamily: SAT, fontWeight: 500 }}
        >
          {HOME_CHAPTERS[active]?.label}
        </span>
        <span
          className="text-[0.5rem] tabular-nums tracking-[0.2em] text-[#F5F2ED]/40"
          style={{ fontFamily: SAT, fontWeight: 500 }}
        >
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(TOTAL).padStart(2, "0")}
        </span>
      </div>
    </nav>
  );
}
