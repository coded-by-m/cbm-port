"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  useSectionScrollProgress,
  scrollToSectionProgress,
} from "@/hooks/useSectionScrollProgress";

const ProcessJourney = dynamic(() => import("./ProcessJourney"), {
  ssr: false,
});

/**
 * Seção PROCESSO da Home — jornada 3D (zona 8).
 *
 * 4 torres trianguladas em linha sobre o terreno da marca. A câmera desliza
 * lateralmente com o scroll (sticky), enquadrando cada etapa; a torre ativa
 * acende e o card HTML da etapa troca em sincronia. Linha de energia com
 * faísca conecta as estações.
 *
 * Pan lateral + overlay sincronizado (um card por vez).
 */

interface Step {
  num: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Estratégia",
    desc: "Antes de desenhar, entender. Diagnóstico, escopo e posicionamento.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Forma com intenção. Arquitetura, identidade e protótipo.",
  },
  {
    num: "03",
    title: "Código",
    desc: "Construído pra durar. Implementação, performance e qualidade.",
  },
  {
    num: "04",
    title: "Resultado",
    desc: "Não acaba no deploy. Mensuração, ajustes e evolução.",
  },
];

const OFF_WHITE = "#F5F2ED";
const SIGNAL = "#FB3640";

/**
 * @param inPage `false` (default) → scroller interno (uso isolado no /lab).
 *   `true` → fluxo de página (Home), lê o scroll relativo da seção.
 */
export default function ProcessSection({
  inPage = false,
}: {
  inPage?: boolean;
} = {}) {
  // Container de scroll interno (só usado no modo /lab).
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Trilho alto (h-[560vh]) — fonte do progress nos dois modos.
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const scrollingRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastStepRef = useRef(-1);
  const [activeStep, setActiveStep] = useState(0);
  const [headerEntered, setHeaderEntered] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Header entry.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setHeaderEntered(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setHeaderEntered(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll progress → câmera (via ref) + etapa ativa + estado de scrolling.
  // Mesma lógica de antes; só a fonte do `raw` mudou (helper relativo à seção).
  useSectionScrollProgress(trackRef, (raw) => {
    const last = STEPS.length - 1;
    progressRef.current = Math.max(0, Math.min(1, raw));

    // Scrolling ativo → após ~160ms sem evento, considera parado (idle).
    scrollingRef.current = true;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      scrollingRef.current = false;
    }, 160);

    const step = Math.max(
      0,
      Math.min(last, Math.round(progressRef.current * last)),
    );
    if (step !== lastStepRef.current) {
      lastStepRef.current = step;
      setActiveStep(step);
    }
  });

  // Limpa o idle timer ao desmontar.
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Click no indicator → scrolla até o centro daquela etapa.
  const goToStep = (i: number) => {
    const target = i / (STEPS.length - 1);
    scrollToSectionProgress(trackRef, target, inPage ? null : scrollerRef.current);
  };

  return (
    <section
      ref={scrollerRef}
      data-cursor="default"
      className={`bg-[#000F08] ${
        inPage ? "relative" : "absolute inset-0 overflow-y-auto"
      }`}
      aria-labelledby="process-headline"
      // scroll-snap só faz efeito no scroller interno (lab); na Home o
      // scroller é a janela.
      style={inPage ? undefined : { scrollSnapType: "y mandatory" }}
    >
      <div ref={trackRef} className="relative h-[560vh]">
        {/* Snap markers — "travadinha"/ponto de chegada em cada estação.
            Posicionados no scrollTop que centraliza cada forma. proximity =
            pega suave só quando o usuário para perto, sem forçar. */}
        {STEPS.map((_, i) => (
          <div
            key={`snap-${i}`}
            aria-hidden
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{
              top: `${(i / (STEPS.length - 1)) * 460}vh`,
              scrollSnapAlign: "start",
            }}
          />
        ))}

        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Jornada 3D */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <ProcessJourney
              progressRef={progressRef}
              scrollingRef={scrollingRef}
            />
          </div>

          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,15,8,0.8) 0%, rgba(0,15,8,0) 28%, rgba(0,15,8,0) 60%, rgba(0,15,8,0.92) 100%)",
            }}
            aria-hidden
          />

          {/* Header — topo centralizado */}
          <div
            ref={headerRef}
            className="absolute inset-x-0 top-0 z-10 px-6 pt-[12vh] text-center sm:pt-[14vh]"
          >
            <div
              className="flex items-center justify-center gap-4"
              style={{
                opacity: headerEntered ? 1 : 0,
                transform: headerEntered ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              }}
            >
              <span className="h-[1px] w-10 bg-[#FB3640]/70" aria-hidden />
              <p
                className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                Método
              </p>
              <span className="h-[1px] w-10 bg-[#FB3640]/70" aria-hidden />
            </div>

            <h2
              id="process-headline"
              className="mx-auto mt-6 max-w-3xl text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.05] text-[#F5F2ED]"
              style={{
                fontFamily: '"Panchang", sans-serif',
                fontWeight: 700,
                letterSpacing: "-0.025em",
                opacity: headerEntered ? 1 : 0,
                transform: headerEntered ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                transitionDelay: "120ms",
              }}
            >
              Todo projeto percorre o mesmo caminho.
            </h2>

            <p
              className="mt-4 text-[clamp(0.95rem,1.3vw,1.1rem)] text-[#F5F2ED]/60"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 300,
                opacity: headerEntered ? 1 : 0,
                transform: headerEntered ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                transitionDelay: "240ms",
              }}
            >
              Estrutura clara. Sem improvisos.
            </p>
          </div>

          {/* Card da etapa ativa — inferior centralizado, crossfade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-[16vh] text-center">
            <div className="relative mx-auto h-[140px] max-w-xl sm:h-[120px]">
              {STEPS.map((step, i) => {
                const isActive = i === activeStep;
                return (
                  <div
                    key={step.num}
                    className="absolute inset-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0) scale(1)"
                        : i < activeStep
                        ? "translateY(-12px) scale(0.97)"
                        : "translateY(12px) scale(0.97)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.33,1,0.68,1), transform 0.55s cubic-bezier(0.33,1,0.68,1)",
                    }}
                    aria-hidden={!isActive}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span
                        className="text-[0.8rem] tabular-nums tracking-[0.2em]"
                        style={{
                          fontFamily: '"Panchang", sans-serif',
                          fontWeight: 600,
                          color: SIGNAL,
                        }}
                      >
                        {step.num}
                      </span>
                      <span
                        className="h-[1px] w-8 bg-[#FB3640]/60"
                        aria-hidden
                      />
                      <span
                        className="text-[clamp(1.4rem,2.4vw,2rem)]"
                        style={{
                          fontFamily: '"Panchang", sans-serif',
                          fontWeight: 700,
                          color: OFF_WHITE,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {step.title}
                      </span>
                    </div>
                    <p
                      className="mx-auto mt-3 max-w-md text-[clamp(0.9rem,1.3vw,1.05rem)] leading-relaxed text-[#F5F2ED]/65"
                      style={{
                        fontFamily: '"Satoshi", sans-serif',
                        fontWeight: 300,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Indicator 01–04 clicável */}
            <nav
              aria-label="Etapas do processo"
              className="pointer-events-auto mt-8 flex items-center justify-center gap-3"
            >
              {STEPS.map((step, i) => {
                const isActive = i === activeStep;
                const isPast = i < activeStep;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => goToStep(i)}
                    aria-label={`Ir pra etapa ${step.num} — ${step.title}`}
                    aria-current={isActive ? "true" : undefined}
                    data-cursor="triangle"
                    className="flex items-center gap-3 bg-transparent"
                  >
                    <span
                      className="block h-[6px] w-[6px] rotate-45"
                      style={{
                        background:
                          isActive || isPast
                            ? SIGNAL
                            : "rgba(245,242,237,0.25)",
                        transform: isActive
                          ? "rotate(45deg) scale(1.4)"
                          : "rotate(45deg) scale(1)",
                        transition: "all 0.35s ease-out",
                      }}
                    />
                    {i < STEPS.length - 1 && (
                      <span
                        className="block h-[1px] w-8"
                        style={{
                          background: isPast
                            ? "rgba(251,54,64,0.6)"
                            : "rgba(245,242,237,0.15)",
                          transition: "background 0.4s ease-out",
                        }}
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
