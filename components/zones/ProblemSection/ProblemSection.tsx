"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { railSub } from "@/lib/railProgress";

const GenericGrid = dynamic(() => import("./GenericGrid"), { ssr: false });

/**
 * Seção PROBLEMA — diagnóstico narrativo em 4 beats, como BEAT-STEPPER
 * (mesmo padrão controlado do Manifesto): o scroll/wheel avança UM beat por
 * vez (anti-skip + cooldown), e a torre triangulada se constrói EM ESTÁGIOS
 * junto com os beats (cubos genéricos → o "chosen one" se forma → fica único).
 *
 * Não é mais scroll-driven contínuo: a construção da torre (progressRef) e o
 * fade dos cubos (outroRef) são animados por GSAP a cada beat. Entradas/saídas
 * usam o wipe da Home (onBack → Manifesto, onForward → Serviços).
 */

interface Beat {
  headline: string;
  sub: string;
}

const BEATS: Beat[] = [
  {
    headline: "A maioria dos sites parece igual.",
    sub: "Pouca personalidade. Pouca diferenciação. Pouco impacto.",
  },
  {
    headline: "Genéricos. Esquecíveis.",
    sub: "Templates reciclados. Hero clichê. Copy de IA.",
  },
  {
    headline: "Até que um deles vira outra coisa.",
    sub: "Estrutura. Identidade. Intenção.",
  },
  {
    headline: "Esse é o que você se torna.",
    sub: "Construído pra ser único — não pra parecer pronto.",
  },
];

/** Construção da torre (progressRef 0..1) por beat — em estágios. */
const BEAT_BUILD = [0, 0.08, 0.62, 1];
/** Fade dos cubos genéricos (outroRef 0..1) por beat — o chosen one isola no fim. */
const BEAT_OUTRO = [0, 0, 0, 0.5];

/** Delta acumulado pra avançar (anti-flick/anti-fling). */
const SCROLL_THRESHOLD = 150;
/** Lockout entre avanços — força um beat por gesto. */
const SCROLL_COOLDOWN = 1300;

export default function ProblemSection({
  inPage = false,
  live,
  onForward,
  onBack,
}: {
  inPage?: boolean;
  live?: boolean;
  onForward?: () => void;
  onBack?: () => void;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0); // construção da torre (lido pelo GenericGrid)
  const outroRef = useRef(0); // fade dos cubos
  const hoveredRef = useRef(false);
  const buildTweenRef = useRef<gsap.core.Tween | null>(null);
  const transitioning = useRef(false);
  const activeRef = useRef(-1);
  const [activeBeat, setActiveBeat] = useState(-1);

  // Reporta o sub-progresso pra ChapterRail (preenche o marcador ativo).
  useEffect(() => {
    railSub.active = !!live;
    if (live) railSub.value = Math.max(0, activeBeat) / (BEATS.length - 1);
  }, [live, activeBeat]);
  useEffect(
    () => () => {
      railSub.active = false;
    },
    [],
  );
  const [isMobile, setIsMobile] = useState(false);

  const onForwardRef = useRef(onForward);
  onForwardRef.current = onForward;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Vai pro beat: anima a construção da torre + o fade dos cubos pro alvo,
  // segurando `transitioning` (anti-skip enquanto a torre se move).
  const goToBeat = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, BEATS.length - 1));
    if (clamped === activeRef.current) return;
    activeRef.current = clamped;
    setActiveBeat(clamped);

    transitioning.current = true;
    buildTweenRef.current?.kill();
    const proxy = { p: progressRef.current, o: outroRef.current };
    buildTweenRef.current = gsap.to(proxy, {
      p: BEAT_BUILD[clamped],
      o: BEAT_OUTRO[clamped],
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        progressRef.current = proxy.p;
        outroRef.current = proxy.o;
      },
      onComplete: () => {
        transitioning.current = false;
      },
    });
  }, []);

  const next = useCallback(() => {
    if (activeRef.current >= BEATS.length - 1) onForwardRef.current?.();
    else goToBeat(activeRef.current + 1);
  }, [goToBeat]);

  const prev = useCallback(() => {
    if (activeRef.current <= 0) onBackRef.current?.();
    else goToBeat(activeRef.current - 1);
  }, [goToBeat]);

  // Entrada: em página, começa quando a seção fica ativa (após o wipe revelar);
  // no /lab (sem `live`), começa no mount. Entra sempre do zero (reentrada limpa).
  useEffect(() => {
    const start = inPage ? !!live : true;
    if (!start) return;
    buildTweenRef.current?.kill();
    progressRef.current = 0;
    outroRef.current = 0;
    activeRef.current = -1;
    setActiveBeat(-1);
    const t = setTimeout(() => goToBeat(0), 450);
    return () => clearTimeout(t);
  }, [live, inPage, goToBeat]);

  // Wheel-jack com anti-skip (um beat por gesto + cooldown), igual ao Manifesto.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let cooldown = false;

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
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, SCROLL_COOLDOWN);
      if (dir > 0) next();
      else prev();
    };

    // Touch: 1 swipe = 1 beat. `fired` trava no gesto, libera no touchend.
    let touchY = 0;
    let fired = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      fired = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (fired || cooldown || transitioning.current) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) < 45) return;
      fired = true;
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, SCROLL_COOLDOWN);
      if (dy > 0) next();
      else prev();
    };
    const onTouchEnd = () => {
      fired = false;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [next, prev]);

  const atLast = activeBeat === BEATS.length - 1;

  return (
    <section
      data-cursor="default"
      className={`bg-[#000F08] ${inPage ? "relative" : "absolute inset-0"}`}
      aria-labelledby="problem-headline"
    >
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Canvas no fundo — torre triangulada construída por beat */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <GenericGrid
            progressRef={progressRef}
            outroRef={outroRef}
            hoveredRef={hoveredRef}
            isMobile={isMobile}
            active={live}
          />
        </div>

        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,15,8,0.55) 0%, rgba(0,15,8,0) 22%, rgba(0,15,8,0) 78%, rgba(0,15,8,0.7) 100%)",
          }}
          aria-hidden
        />

        {/* Overlay central — hover faz a torre pulsar; clique avança o beat
            (ou vai pro próximo capítulo no último). */}
        <button
          type="button"
          data-cursor="triangle"
          onMouseEnter={() => {
            hoveredRef.current = true;
          }}
          onMouseLeave={() => {
            hoveredRef.current = false;
          }}
          onClick={() => next()}
          aria-label={atLast ? "Avançar pra próxima seção" : "Avançar"}
          className="absolute left-1/2 top-1/2 z-[3] h-[220px] w-[170px] -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-transparent"
        />

        {/* Copy coluna esquerda — 4 beats com crossfade */}
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 sm:px-10">
          <div className="relative flex h-screen max-w-xl flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-4">
              <span
                className="text-[0.65rem] uppercase tracking-[0.35em] text-[#F5F2ED]/35"
                style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 500 }}
              >
                03
              </span>
              <span className="h-[1px] w-12 bg-[#FB3640]/70" aria-hidden />
              <p
                className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                Problema
              </p>
            </div>

            {/* Beat container — altura mínima evita pulo de layout */}
            <div className="relative mt-7 min-h-[280px] sm:min-h-[240px]">
              {BEATS.map((beat, i) => {
                const isActive = i === activeBeat;
                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : i < activeBeat
                          ? "translateY(-14px)"
                          : "translateY(14px)",
                      filter: isActive ? "blur(0px)" : "blur(6px)",
                      transition:
                        "opacity 0.6s ease-out, transform 0.6s ease-out, filter 0.6s ease-out",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    aria-hidden={!isActive}
                  >
                    <h2
                      id={i === 0 ? "problem-headline" : undefined}
                      className="text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.02] text-[#F5F2ED]"
                      style={{
                        fontFamily: '"Panchang", sans-serif',
                        fontWeight: 700,
                        letterSpacing: "-0.028em",
                      }}
                    >
                      {beat.headline}
                    </h2>
                    <p
                      className="mt-6 max-w-md text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-[#F5F2ED]/60"
                      style={{
                        fontFamily: '"Satoshi", sans-serif',
                        fontWeight: 300,
                      }}
                    >
                      {beat.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Progresso dos beats (dots) + hint — embaixo da copy, à ESQUERDA
                (não compete com a trilha global de capítulos na direita). */}
            <div className="mt-10 flex items-center gap-5">
              <div className="flex gap-2.5">
                {BEATS.map((_, i) => {
                  const isActive = i === activeBeat;
                  const isPast = i < activeBeat;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToBeat(i)}
                      aria-label={`Ir pro beat ${i + 1}`}
                      aria-current={isActive ? "true" : undefined}
                      data-cursor="triangle"
                      className="h-1.5 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: isActive ? "22px" : "6px",
                        backgroundColor:
                          isActive || isPast ? "#FB3640" : "#97938b",
                        opacity: isActive ? 1 : isPast ? 0.5 : 0.25,
                      }}
                    />
                  );
                })}
              </div>

              <span
                className="text-[0.6rem] uppercase tracking-[0.35em] text-[#FB3640]/85"
                style={{
                  fontFamily: '"Satoshi", sans-serif',
                  fontWeight: 500,
                  opacity: atLast ? 1 : 0,
                  transform: atLast ? "translateX(0)" : "translateX(-6px)",
                  transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                  pointerEvents: atLast ? "auto" : "none",
                }}
              >
                Role para seguir →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
