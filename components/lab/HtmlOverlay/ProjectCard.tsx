"use client";

import { useEffect, useRef } from "react";
import { PROJECT_CARDS } from "./config";

/**
 * Card HTML do projeto — Camada de Overlay (fora do canvas).
 *
 * Conteúdo real e acessível: estrutura semântica, texto selecionável, link
 * navegável. No desktop flutua ancorado ao fragmento (posição definida
 * imperativamente via `setCardEl`); no mobile vira um painel inferior compacto
 * que não sai da tela.
 *
 * Visual técnico e discreto: sem glass genérico, sem neon, sem sombra pesada.
 */
export default function ProjectCard({
  activeId,
  isCompact,
  setCardEl,
  onClose,
}: {
  activeId: string | null;
  isCompact: boolean;
  setCardEl: (el: HTMLDivElement | null) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const card = activeId
    ? PROJECT_CARDS.find((item) => item.id === activeId)
    : null;
  const visible = Boolean(card);

  const attachRef = (el: HTMLDivElement | null) => {
    ref.current = el;
    setCardEl(el);
  };

  // Ao trocar para o painel compacto, limpa a posição absoluta herdada.
  useEffect(() => {
    if (isCompact && ref.current) {
      ref.current.style.left = "";
      ref.current.style.top = "";
    }
  }, [isCompact]);

  return (
    <div
      ref={attachRef}
      aria-hidden={!visible}
      className={[
        "z-20 transition-opacity duration-200 ease-out",
        isCompact ? "fixed inset-x-3 bottom-3" : "absolute left-0 top-0 will-change-transform",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      {card && (
        <article
          aria-label={`Projeto: ${card.title}`}
          className={[
            "pointer-events-auto border border-white/10 bg-[#0a0a0a]/95",
            "rounded-md border-l-2 border-l-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.28)]",
            isCompact ? "mx-auto max-w-sm p-4" : "w-52 p-3",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.32em] text-neutral-500">
                {card.type}
              </p>
              <h3 className="mt-1.5 text-sm font-light tracking-wide text-neutral-100">
                {card.title}
              </h3>
            </div>

            {isCompact && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="pointer-events-auto -mr-1 -mt-1 rounded p-1 text-neutral-500 transition-colors hover:text-neutral-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  ×
                </span>
              </button>
            )}
          </div>

          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            {card.description}
          </p>

          <a
            href={card.href}
            aria-label={`Ver estudo de caso de ${card.title}`}
            className="group mt-3 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:text-neutral-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            Ver estudo de caso
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </article>
      )}
    </div>
  );
}
