"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_CHAPTERS } from "@/lib/homeChapters";
import { LogoMark } from "@/components/ui/LogoMark";
import { railSub } from "@/lib/railProgress";

const SIGNAL = "#FB3640";
const OFF_WHITE = "#F5F2ED";
const SAT = '"Satoshi", sans-serif';
const ROW = 32; // altura de cada botão (px) — geometria determinística
const TOTAL = HOME_CHAPTERS.length;
const TRACK = (TOTAL - 1) * ROW;
const TOP0 = ROW / 2; // centro do primeiro marcador
const W_OPEN = 224; // largura do menu aberto
const W_SHUT = 20; // largura colapsada (só os triângulos)
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Navbar global da Home — trilha de capítulos na borda direita.
 *
 * Colapsada: só os triângulos (linguagem da marca) + um fio de progresso que
 * preenche conforme rola (a cabeça desliza = indicador ativo; sub-progresso
 * dos steppers via railSub). Hover → vira um MENU de botões clicáveis (nº +
 * nome, com fundo/hover por linha). Clique navega com o wipe da marca; drag
 * varre os capítulos. Âncora de marca no topo volta ao Logo. Teclado tratado
 * no HomeExperience.
 */
export function ChapterRail({
  active,
  onJump,
}: {
  active: number;
  onJump: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
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
  // Drag-to-scrub que NÃO engole o clique: só captura depois de um movimento
  // real (>6px). Tap → o onClick do botão navega normalmente.
  const onPointerDown = (e: React.PointerEvent) => {
    startYRef.current = e.clientY;
    draggingRef.current = false;
    movedRef.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) {
      if (Math.abs(e.clientY - startYRef.current) < 6) return;
      draggingRef.current = true;
      movedRef.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
    setPreview(indexFromY(e.clientY));
  };
  const endDrag = () => {
    if (draggingRef.current && preview !== null) onJump(preview);
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
        className="pointer-events-auto mb-3.5 mr-1 opacity-45 transition-opacity duration-300 hover:opacity-100"
      >
        <LogoMark size={18} />
      </button>

      {/* Trilha / menu — única zona interativa. */}
      <div
        ref={markersRef}
        className="pointer-events-auto relative transition-[width] duration-300 ease-out"
        style={{ width: open ? W_OPEN : W_SHUT, height: TOTAL * ROW }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          setOpen(false);
          setHoverRow(null);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Painel de fundo (só no hover) — glass + brackets HUD */}
        <div
          className="pointer-events-none absolute -inset-y-2.5 left-[-6px] right-[-8px] rounded-md border transition-opacity duration-300"
          style={{
            opacity: open ? 1 : 0,
            background:
              "linear-gradient(270deg, rgba(0,15,8,0.94) 0%, rgba(0,15,8,0.72) 100%)",
            borderColor: "rgba(245,242,237,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 22px 55px -22px rgba(0,0,0,0.65)",
          }}
          aria-hidden
        >
          <span className="absolute left-1.5 top-1.5 h-2 w-2 border-l border-t border-[#FB3640]/55" />
          <span className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b border-r border-[#FB3640]/55" />
        </div>

        {/* Linha base + fill + cabeça (indicador deslizante) */}
        <div
          className="pointer-events-none absolute w-px"
          style={{
            right: 6,
            top: TOP0,
            height: TRACK,
            background: "rgba(245,242,237,0.12)",
          }}
          aria-hidden
        />
        <div
          ref={fillRef}
          className="pointer-events-none absolute w-px"
          style={{ right: 6, top: TOP0, height: 0, background: SIGNAL }}
          aria-hidden
        />
        <div
          ref={headRef}
          className="pointer-events-none absolute h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full"
          style={{
            right: 6,
            top: TOP0,
            background: SIGNAL,
            boxShadow: `0 0 7px ${SIGNAL}`,
          }}
          aria-hidden
        />

        {/* Barra ativa deslizante (esquerda do menu aberto) */}
        <div
          className="pointer-events-none absolute left-0 w-[2px] rounded-full transition-[top,opacity] duration-300 ease-out"
          style={{
            top: shown * ROW + 8,
            height: ROW - 16,
            background: SIGNAL,
            boxShadow: `0 0 9px ${SIGNAL}`,
            opacity: open ? 1 : 0,
          }}
          aria-hidden
        />

        {HOME_CHAPTERS.map((ch, i) => {
          const isActive = i === shown;
          const isPast = i < shown;
          const isRowHover = hoverRow === i;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                if (!movedRef.current) onJump(i);
              }}
              onMouseEnter={() => setHoverRow(i)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Ir para ${ch.label}`}
              data-cursor="triangle"
              className="group/row relative z-10 flex w-full items-center justify-end gap-2.5 overflow-hidden rounded pr-1.5 transition-colors duration-200"
              style={{
                height: ROW,
                background:
                  open && (isActive || isRowHover)
                    ? "rgba(245,242,237,0.06)"
                    : "transparent",
              }}
            >
              <div
                className="flex items-center gap-2.5 transition-[opacity,transform] duration-300 ease-out"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(10px)",
                  transitionDelay: open ? `${i * 22}ms` : "0ms",
                }}
              >
                <span
                  className="whitespace-nowrap text-[0.5rem] tabular-nums tracking-[0.15em]"
                  style={{
                    fontFamily: SAT,
                    fontWeight: 600,
                    color: isActive ? SIGNAL : "rgba(251,54,64,0.5)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="whitespace-nowrap text-[0.62rem] uppercase tracking-[0.22em]"
                  style={{
                    fontFamily: SAT,
                    fontWeight: 500,
                    color: isActive
                      ? "rgba(245,242,237,0.98)"
                      : isRowHover
                        ? "rgba(245,242,237,0.9)"
                        : "rgba(245,242,237,0.55)",
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
                style={{
                  transform: isActive
                    ? "scale(1.5)"
                    : isRowHover
                      ? "scale(1.25)"
                      : "scale(1)",
                }}
              >
                <polygon
                  points="9,1 9,9 1,5"
                  fill={isActive || isPast ? SIGNAL : "transparent"}
                  stroke={isActive || isPast ? SIGNAL : OFF_WHITE}
                  strokeWidth="1"
                  opacity={isActive ? 1 : isPast ? 0.55 : isRowHover ? 0.9 : 0.4}
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
