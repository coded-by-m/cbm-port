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
export function InteractionCue({ active }: { active: number }) {
  const chapter = HOME_CHAPTERS[active];
  const [visible, setVisible] = useState(true);
  // No mobile, Projetos (bottom-sheet card) e Convite (vira hero auto-formado,
  // não scroll-driven) tornam a cue redundante/imprecisa — ocultamos nesses
  // capítulos pra não colidir nem mentir ("o convite se forma" já aconteceu).
  const [hideForCard, setHideForCard] = useState(false);
  // No fim da jornada (footer à vista), a cue "Role — o convite se forma" já
  // cumpriu o papel — esconde pra não persistir sobre o rodapé.
  const [footerInView, setFooterInView] = useState(false);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // O <footer> só monta ao entrar no último capítulo; re-tenta observar quando
  // `active` muda. Esconde a cue enquanto o rodapé estiver visível.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) {
      setFooterInView(false);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setFooterInView(e.isIntersecting);
      },
      { threshold: 0.05 },
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, [active]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const apply = () =>
      setHideForCard(
        // Convite agora é hero auto-formado (tem cue própria) → esconde sempre.
        // Projetos: só no mobile (lá o bottom-sheet card ocupa o rodapé).
        chapter?.id === "convite" ||
          (mql.matches && chapter?.id === "projetos"),
      );
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [chapter?.id]);

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

  if (!chapter.cue || hideForCard || footerInView) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-7 z-[60] flex justify-center px-6"
      aria-hidden={!visible}
    >
      <div
        className="flex flex-col items-center gap-1 transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex items-center gap-3">
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
        </div>
        {chapter.gestures && chapter.gestures.length > 0 && (
          <span
            className="text-[0.5rem] uppercase tracking-[0.28em] text-[#F5F2ED]/40"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            {chapter.gestures.join("  ·  ")}
          </span>
        )}
      </div>
    </div>
  );
}
