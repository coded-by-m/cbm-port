"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useOpeningTimeline } from "./useOpeningTimeline";
import { useFlipTransition } from "./useFlipTransition";
import { DevPhaseTimeline } from "./DevPhaseTimeline";
import { FLIP } from "./config";

const TriangleLoader = dynamic(
  () => import("@/components/lab/TriangleLoader/TriangleLoader"),
  { ssr: false },
);

const PhilosophySection = dynamic(
  () =>
    import("@/components/lab/PhilosophySection").then(
      (m) => m.PhilosophySection,
    ),
  { ssr: false },
);

const ProjectLandscape = dynamic(
  () =>
    import("@/components/lab/ProjectLandscape").then(
      (m) => m.ProjectLandscape,
    ),
  { ssr: false },
);

type Phase = "logo" | "philosophy" | "flipping" | "landscape";

/**
 * Opening Sequence — Parte 1 do portfólio.
 *
 * Fluxo: logo → philosophy → triangle flip 3D → landscape.
 *
 * **Estabilidade entre fases:** PhilosophySection e ProjectLandscape são
 * montadas dentro do wrapper 3D assim que a Philosophy entra. Quando o
 * usuário clica no CTA, só a rotação é animada — não há mount/unmount, o
 * conteúdo já está pintado. Crítico pra que o flip aconteça sobre conteúdo
 * pronto, não sobre Canvas em loading.
 */
/**
 * @param inPage `true` na Home (esconde a DevPhaseTimeline, que é ferramenta
 *   de iteração só do /lab). Default `false` → mostra no lab (em dev).
 */
export default function OpeningSequence({
  inPage = false,
}: {
  inPage?: boolean;
} = {}) {
  const logoRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const flipCardRef = useRef<HTMLDivElement>(null);
  const exitProgress = useRef(0);

  const [phase, setPhase] = useState<Phase>("logo");
  const [buildComplete, setBuildComplete] = useState(false);

  const handleLogoComplete = useCallback(() => {
    setBuildComplete(true);
  }, []);

  const handlePhilosophyVisible = useCallback(() => {
    setPhase("philosophy");
  }, []);

  const handlePhilosophyComplete = useCallback(() => {
    if (inPage) {
      // Herói aparado (Home): sem flip pra vitrine — a Paisagem é dona dos
      // projetos. Libera o scroll-jack do manifesto rolando pra próxima seção.
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      return;
    }
    setPhase("flipping");
  }, [inPage]);

  const handleFlipComplete = useCallback(() => {
    setPhase("landscape");
  }, []);

  // Dev jump — pula direto pra qualquer fase, sem esperar animações.
  const handleDevJump = useCallback((target: Phase) => {
    setPhase(target);
    if (target === "logo") {
      setBuildComplete(false);
      exitProgress.current = 0;
    } else {
      setBuildComplete(true);
    }
    // Reseta o transform do flip se voltar pra philosophy ou logo.
    const card = flipCardRef.current;
    if (card && target !== "flipping") {
      card.style.transform =
        target === "landscape"
          ? `rotate3d(${FLIP.AXIS_X}, ${FLIP.AXIS_Y}, 0, 180deg)`
          : "none";
    }
  }, []);

  useOpeningTimeline(
    { logo: logoRef, philosophy: philosophyRef },
    exitProgress,
    buildComplete,
    handlePhilosophyVisible,
  );

  useFlipTransition(flipCardRef, phase === "flipping", handleFlipComplete);

  const showLogo = phase === "logo";
  const showPhilosophy =
    phase === "philosophy" || phase === "flipping";
  const showLandscape =
    phase === "philosophy" || phase === "flipping" || phase === "landscape";

  return (
    <>
      {!inPage && <DevPhaseTimeline active={phase} onJump={handleDevJump} />}

      {/* Logo phase: render isolado (sem flip wrapper). */}
      {showLogo && (
        <div
          data-cursor="triangle"
          className="absolute inset-0 overflow-hidden"
        >
          <div ref={logoRef} className="absolute inset-0">
            <TriangleLoader
              onComplete={handleLogoComplete}
              exitProgress={exitProgress}
            />
          </div>

          {/* Philosophy mount hint (mounted via useOpeningTimeline durante o exit). */}
          <div
            ref={philosophyRef}
            className="absolute inset-0"
            style={{ opacity: 0 }}
          />

          <div
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[16vh]"
            style={{
              opacity: buildComplete ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          >
            <p className="text-[0.65rem] font-light uppercase tracking-[0.5em] text-[#F5F2ED]/70">
              Coded by M
            </p>
          </div>
        </div>
      )}

      {/* Philosophy + Landscape: estrutura estável com flip wrapper. */}
      {!showLogo && (
        <div
          data-cursor="triangle"
          className="absolute inset-0 overflow-hidden"
          style={{ perspective: `${FLIP.PERSPECTIVE}px` }}
        >
          <div
            ref={flipCardRef}
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform:
                phase === "landscape"
                  ? `rotate3d(${FLIP.AXIS_X}, ${FLIP.AXIS_Y}, 0, 180deg)`
                  : undefined,
            }}
          >
            {/* Front — Philosophy. */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              {showPhilosophy && (
                <PhilosophySection onComplete={handlePhilosophyComplete} />
              )}
            </div>

            {/* Back — ProjectLandscape (pré-rotacionado pra ficar correto no flip). */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: `rotate3d(${FLIP.AXIS_X}, ${FLIP.AXIS_Y}, 0, 180deg)`,
              }}
            >
              {/* Na Home (`inPage`) a vitrine NUNCA monta aqui — vive só na
                  seção Paisagem (evita duplicação + contexto WebGL extra). */}
              {showLandscape && !inPage && <ProjectLandscape />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
