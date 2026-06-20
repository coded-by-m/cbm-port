"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const TriangleLoader = dynamic(
  () => import("@/components/zones/TriangleLoader/TriangleLoader"),
  { ssr: false },
);

/** Tempo (ms) entre a marca terminar de construir e o selo "Coded by M"
 *  aparecer — só então o scroll é liberado (a intro concluiu de verdade). */
const SETTLE_MS = 1100;

/**
 * Capítulo 1 — Logo (intro travada). A marca CbM se constrói (TriangleLoader),
 * descansa com o selo "Coded by M" e SÓ ENTÃO o scroll é liberado, com o
 * indicador "Role para continuar". O usuário não passa pro Manifesto sem a
 * animação concluir (build + selo).
 *
 * @param onComplete chamado quando a intro conclui (libera o scroll na Home).
 */
export function LogoIntro({
  onComplete,
  onSkipToProjects,
}: {
  onComplete?: () => void;
  onSkipToProjects?: () => void;
}) {
  const [built, setBuilt] = useState(false); // marca construída → selo aparece
  const [ready, setReady] = useState(false); // intro concluída → scroll liberado
  const doneRef = useRef(false);

  const handleBuilt = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setBuilt(true);
    // Segura o destrave até o selo concluir de aparecer — aí libera o scroll
    // e mostra o "Role para continuar" (no mesmo instante, sem contradição).
    window.setTimeout(() => {
      setReady(true);
      onComplete?.();
    }, SETTLE_MS);
  };

  return (
    <div
      data-cursor="triangle"
      className="relative h-screen w-full overflow-hidden bg-[#000F08]"
    >
      <TriangleLoader onComplete={handleBuilt} />

      {/* Selo da marca */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[18vh]"
        style={{ opacity: built ? 1 : 0, transition: "opacity 1s ease" }}
      >
        <p className="text-[0.65rem] font-light uppercase tracking-[0.5em] text-[#F5F2ED]/70">
          Coded by M
        </p>
        {/* Descritor — diz ao usuário do que o site se trata. Subordinado ao
            selo (menor, mais discreto); "&" no vermelho da marca. */}
        <p
          className="mt-2.5 text-[0.5rem] uppercase tracking-[0.32em] text-[#F5F2ED]/40"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          Web Design <span style={{ color: "#FB3640" }}>&</span> Desenvolvimento
        </p>
      </div>

      {/* Atalho do impaciente — aviso + ação pra pular a experiência e ir
          direto à vitrine de Projetos. Aparece quando a marca termina de
          construir (built). Container não captura clique; só o botão. */}
      {onSkipToProjects && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[12vh] z-10 flex flex-col items-center gap-3 px-6"
          style={{ opacity: built ? 1 : 0, transition: "opacity 0.8s ease" }}
        >
          <p
            className="text-center text-[0.5rem] uppercase tracking-[0.32em] text-[#F5F2ED]/35"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            Sem tempo pra experiência completa?
          </p>
          <button
            type="button"
            onClick={onSkipToProjects}
            data-cursor="triangle"
            className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-[#F5F2ED]/20 px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.28em] text-[#F5F2ED]/70 transition-all duration-500 hover:border-[#F5F2ED]/45 hover:text-[#F5F2ED]"
            style={{
              fontFamily: '"Satoshi", sans-serif',
              fontWeight: 500,
              pointerEvents: built ? "auto" : "none",
            }}
          >
            Ir direto aos projetos
            <svg aria-hidden width="9" height="9" viewBox="0 0 10 10">
              <polygon points="2,1 9,5 2,9" fill="#FB3640" />
            </svg>
          </button>
        </div>
      )}

      {/* Indicador "role para continuar" — só quando o scroll é liberado
          (ready), pra não convidar a rolar com o lock ainda ativo. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2.5"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        <span
          className="text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/45"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          Role para continuar
        </span>
        <svg
          width="10"
          height="12"
          viewBox="0 0 10 12"
          aria-hidden
          style={{ animation: "logo-scroll-bob 1.6s ease-in-out infinite" }}
        >
          <polygon points="1,3 9,3 5,11" fill="#FB3640" />
        </svg>
      </div>

      <style>{`@keyframes logo-scroll-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }`}</style>
    </div>
  );
}
