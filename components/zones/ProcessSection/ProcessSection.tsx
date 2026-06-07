"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const ProcessJourney = dynamic(() => import("./ProcessJourney"), {
  ssr: false,
});

/**
 * Seção PROCESSO — jornada do método como BEAT-STEPPER (mesmo padrão do
 * Manifesto/Problema). O scroll/wheel avança UMA etapa por vez (anti-skip +
 * cooldown); a câmera 3D pana suave até a estação (via `progressRef` tweenado),
 * a torre ativa acende e o card troca. Entra/sai pelo wipe da Home.
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

/** Valor de `progressRef` (0..1) que centraliza a câmera em cada estação. */
const STATION_PROGRESS = STEPS.map((_, i) => i / (STEPS.length - 1));
const SCROLL_THRESHOLD = 150;
const SCROLL_COOLDOWN = 1300;

export default function ProcessSection({
  inPage = false,
  live,
  onForward,
  onBack,
}: {
  inPage?: boolean;
  /** Capítulo ativo → entrada sincronizada com o wipe de chegada. */
  live?: boolean;
  /** Última etapa + scroll ↓ → próximo capítulo (wipe pro Laboratório). */
  onForward?: () => void;
  /** Primeira etapa + scroll ↑ → capítulo anterior (wipe pro Projetos). */
  onBack?: () => void;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0); // pan da câmera (lido pelo ProcessJourney)
  const scrollingRef = useRef(false); // revela a linha de energia durante o pan
  const stepTweenRef = useRef<gsap.core.Tween | null>(null);
  const transitioning = useRef(false);
  const activeRef = useRef(-1);
  const [activeStep, setActiveStep] = useState(-1);
  const [headerEntered, setHeaderEntered] = useState(false);

  const onForwardRef = useRef(onForward);
  onForwardRef.current = onForward;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  // Vai pra etapa: pana a câmera (tween do progressRef) e mostra a linha de
  // energia durante o movimento. `transitioning` segura o anti-skip.
  const goToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, STEPS.length - 1));
    if (clamped === activeRef.current) return;
    activeRef.current = clamped;
    setActiveStep(clamped);

    transitioning.current = true;
    scrollingRef.current = true;
    stepTweenRef.current?.kill();
    const proxy = { p: progressRef.current };
    stepTweenRef.current = gsap.to(proxy, {
      p: STATION_PROGRESS[clamped],
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        progressRef.current = proxy.p;
      },
      onComplete: () => {
        transitioning.current = false;
        scrollingRef.current = false;
      },
    });
  }, []);

  const next = useCallback(() => {
    if (activeRef.current >= STEPS.length - 1) onForwardRef.current?.();
    else goToStep(activeRef.current + 1);
  }, [goToStep]);

  const prev = useCallback(() => {
    if (activeRef.current <= 0) onBackRef.current?.();
    else goToStep(activeRef.current - 1);
  }, [goToStep]);

  // Entrada: em página, começa quando a seção fica ativa (após o wipe); no
  // /lab (sem `live`), no mount. Entra sempre da primeira estação.
  useEffect(() => {
    const start = inPage ? !!live : true;
    if (!start) return;
    stepTweenRef.current?.kill();
    progressRef.current = 0;
    activeRef.current = -1;
    setActiveStep(-1);
    setHeaderEntered(true);
    const t = setTimeout(() => goToStep(0), 450);
    return () => clearTimeout(t);
  }, [live, inPage, goToStep]);

  // Wheel-jack com anti-skip (uma etapa por gesto + cooldown).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let cooldown = false;
    const fire = (dir: number) => {
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, SCROLL_COOLDOWN);
      if (dir > 0) next();
      else prev();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown || transitioning.current) return;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accum = 0;
      }, 250);
      accum += e.deltaY;
      if (Math.abs(accum) < SCROLL_THRESHOLD) return;
      const dir = accum > 0 ? 1 : -1;
      accum = 0;
      fire(dir);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (cooldown || transitioning.current) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) < 40) return;
      touchY = e.touches[0].clientY;
      fire(dy > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [next, prev]);

  return (
    <section
      data-cursor="default"
      className={`bg-[#000F08] ${inPage ? "relative" : "absolute inset-0"}`}
      aria-labelledby="process-headline"
    >
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Jornada 3D */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <ProcessJourney
            progressRef={progressRef}
            scrollingRef={scrollingRef}
            active={live}
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
        <div className="absolute inset-x-0 top-0 z-10 px-6 pt-[12vh] text-center sm:pt-[14vh]">
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
                    <span className="h-[1px] w-8 bg-[#FB3640]/60" aria-hidden />
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
                        isActive || isPast ? SIGNAL : "rgba(245,242,237,0.25)",
                      transform: isActive
                        ? "rotate(45deg) scale(1.5)"
                        : "rotate(45deg) scale(1)",
                      boxShadow: isActive
                        ? "0 0 9px rgba(251,54,64,0.85)"
                        : "none",
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
    </section>
  );
}
