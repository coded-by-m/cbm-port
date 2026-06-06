"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_CHAPTERS } from "@/lib/homeChapters";

const SIGNAL = "#FB3640";

/**
 * Cue de interação por seção — diz ao usuário o verbo daquela seção
 * (rolar / arrastar / clicar) pra ele nunca ficar perdido sobre o que fazer.
 *
 * Comportamento: aparece ao entrar num capítulo, some após alguns segundos ou
 * ao rolar, e reaparece quando o usuário fica parado (idle). Seções passivas
 * (cue `null`, ex.: Sobre) não mostram nada.
 *
 * Na Abertura, além do verbo, oferece "Pular intro" — o manifesto sequestra o
 * scroll, então um escape explícito é control & freedom.
 */
export function InteractionCue({
  active,
  onSkipIntro,
}: {
  active: number;
  onSkipIntro: () => void;
}) {
  const chapter = HOME_CHAPTERS[active];
  const [visible, setVisible] = useState(true);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reaparece ao trocar de capítulo; auto-esconde após a leitura.
  useEffect(() => {
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), 3800);
    return () => clearTimeout(hide);
  }, [active]);

  // Some ao rolar; reaparece após o usuário ficar parado (idle).
  useEffect(() => {
    const onScroll = () => {
      setVisible(false);
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => setVisible(true), 4200);
    };
    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("scroll", onScroll, opts);
    return () => {
      window.removeEventListener("scroll", onScroll, opts);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, []);

  if (!chapter.cue) return null;
  const isOpening = active === 0;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-7 z-[60] flex justify-center px-6"
      aria-hidden={!visible}
    >
      <div
        className="flex items-center gap-3 transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <svg aria-hidden width="7" height="7" viewBox="0 0 10 10">
          {/* Triângulo apontando pra baixo — convida o gesto. */}
          <polygon points="1,2 9,2 5,9" fill={SIGNAL} />
        </svg>
        <span
          className="text-[0.6rem] uppercase tracking-[0.32em] text-[#F5F2ED]/70"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          {chapter.cue}
        </span>
        {isOpening && (
          <button
            type="button"
            onClick={onSkipIntro}
            data-cursor="triangle"
            className="pointer-events-auto ml-2 border-l border-[#F5F2ED]/20 pl-3 text-[0.6rem] uppercase tracking-[0.32em] text-[#F5F2ED]/45 transition-colors hover:text-[#F5F2ED]/90"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            Pular intro →
          </button>
        )}
      </div>
    </div>
  );
}
