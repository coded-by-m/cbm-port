"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const GenericGrid = dynamic(() => import("./GenericGrid"), { ssr: false });
const ServicesSection = dynamic(
  () =>
    import("@/components/lab/ServicesSection").then((m) => m.ServicesSection),
  { ssr: false },
);

/**
 * Seção PROBLEMA da Home — diagnóstico narrativo em 4 beats.
 *
 * Arc: Diagnóstico → Reconhecimento → Quebra → Resolução. Cada beat
 * aparece num threshold de scroll progress e substitui o anterior via
 * crossfade CSS. Mesmo scroll que driva a transformação 3D do cubo
 * central.
 *
 * Interação extra:
 *  - Indicator vertical à direita (4 dots). Click → vai pro beat.
 *  - Overlay sobre o cubo central: hover sinaliza pra torre pulsar.
 *    Quando progress >= 0.85, click vira navegação pra Serviços
 *    (scrolla pro fim do scroller, mimic da próxima zona).
 *
 * Layout sticky: 180vh internos. Conteúdo permanece visível enquanto
 * scroll driva o progress.
 */

interface Beat {
  /** Threshold de progress que ativa este beat. */
  start: number;
  /** Headline (Panchang). */
  headline: string;
  /** Sub (Satoshi). */
  sub: string;
}

/**
 * Mapeamento do scroll (raw 0..1) em duas fases:
 *  - [0, DRAW_END]: a torre se constrói (progress 0→1).
 *  - [OUTRO_START, OUTRO_END]: outro — cubos fazem fade-out escalonado
 *    (borda→centro) e os cards de Serviços se montam por cima.
 * O gap entre DRAW_END e OUTRO_START deixa a torre "respirar" isolada.
 */
const DRAW_END = 0.56;
const OUTRO_START = 0.64;
const OUTRO_END = 0.9;
const smoothstep = (x: number) => x * x * (3 - 2 * x);

const BEATS: Beat[] = [
  {
    start: 0,
    headline: "A maioria dos sites parece igual.",
    sub: "Pouca personalidade. Pouca diferenciação. Pouco impacto.",
  },
  {
    start: 0.22,
    headline: "Genéricos. Esquecíveis.",
    sub: "Templates reciclados. Hero clichê. Copy de IA.",
  },
  {
    start: 0.5,
    headline: "Até que um deles vira outra coisa.",
    sub: "Estrutura. Identidade. Intenção.",
  },
  {
    start: 0.78,
    headline: "Esse é o que você se torna.",
    sub: "Construído pra ser único — não pra parecer pronto.",
  },
];

export default function ProblemSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const outroRef = useRef(0);
  const hoveredRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);
  const [readyToAdvance, setReadyToAdvance] = useState(false);
  // Outro (0 = torre isolada, 1 = Serviços montado por cima).
  const [outroProgress, setOutroProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Scroll progress + active beat.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const computeBeat = (p: number) => {
      let beat = 0;
      for (let i = 0; i < BEATS.length; i++) {
        if (p >= BEATS[i].start) beat = i;
      }
      return beat;
    };

    let lastBeat = -1;
    let lastReady = false;
    let lastOutro = -1;

    const handleScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const raw = maxScroll > 0 ? el.scrollTop / maxScroll : 0;

      // Fase 1 — torre se constrói.
      const p = Math.max(0, Math.min(1, raw / DRAW_END));
      progressRef.current = p;

      // Fase 2 — outro: cubos somem + Serviços monta.
      const outro = Math.max(
        0,
        Math.min(1, (raw - OUTRO_START) / (OUTRO_END - OUTRO_START)),
      );
      outroRef.current = outro;
      // Quantiza pra evitar re-render a cada pixel (passo ~1%).
      const outroQ = Math.round(outro * 100) / 100;
      if (outroQ !== lastOutro) {
        lastOutro = outroQ;
        setOutroProgress(outroQ);
      }

      const nextBeat = computeBeat(p);
      if (nextBeat !== lastBeat) {
        lastBeat = nextBeat;
        setActiveBeat(nextBeat);
      }
      const nextReady = p >= 0.95 && outro < 0.05;
      if (nextReady !== lastReady) {
        lastReady = nextReady;
        setReadyToAdvance(nextReady);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Click no indicator vai pro beat. Calcula scrollTop equivalente.
  const goToBeat = (beatIdx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    // Inverso de p = raw / DRAW_END → raw = p * DRAW_END.
    const targetProgress = BEATS[beatIdx].start + 0.02;
    const targetScroll = targetProgress * DRAW_END * maxScroll;
    el.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  // Click no centro quando a torre está pronta: scrolla pro outro.
  const advance = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: OUTRO_END * maxScroll, behavior: "smooth" });
  };

  return (
    <section
      ref={scrollerRef}
      data-cursor="default"
      className="absolute inset-0 overflow-y-auto bg-[#000F08]"
      aria-labelledby="problem-headline"
    >
      {/* Altura generosa: ~420vh de travel espalha os 4 beats por bastante
          scroll, então cada frase exige movimento deliberado (anti-flick). */}
      <div className="relative h-[520vh]">
        <div className="sticky top-0 flex h-screen w-full items-center">
          {/* Canvas no fundo */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <GenericGrid
              progressRef={progressRef}
              outroRef={outroRef}
              hoveredRef={hoveredRef}
              isMobile={isMobile}
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

          {/* Hover/click overlay sobre o triângulo central — centralizado,
              alinhado com o foco da câmera. */}
          <button
            type="button"
            data-cursor="triangle"
            onMouseEnter={() => {
              hoveredRef.current = true;
            }}
            onMouseLeave={() => {
              hoveredRef.current = false;
            }}
            onClick={() => {
              if (readyToAdvance) advance();
            }}
            aria-label={
              readyToAdvance
                ? "Avançar pra próxima seção"
                : "Foco no chosen one"
            }
            className="absolute left-1/2 top-1/2 z-[3] h-[220px] w-[170px] -translate-x-1/2 -translate-y-1/2 bg-transparent"
            style={{
              cursor: readyToAdvance ? "pointer" : "default",
            }}
          />

          {/* Copy coluna esquerda — 4 beats sobrepostos com crossfade */}
          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 sm:px-10">
            <div className="relative max-w-xl">
              {/* Eyebrow fixo */}
              <div className="flex items-center gap-4">
                <span
                  className="text-[0.65rem] uppercase tracking-[0.35em] text-[#F5F2ED]/35"
                  style={{
                    fontFamily: '"Panchang", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  04
                </span>
                <span className="h-[1px] w-12 bg-[#FB3640]/70" aria-hidden />
                <p
                  className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
                  style={{
                    fontFamily: '"Satoshi", sans-serif',
                    fontWeight: 500,
                  }}
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
                          ? "translateY(-12px)"
                          : "translateY(12px)",
                        transition:
                          "opacity 0.55s ease-out, transform 0.55s ease-out",
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

              {/* Hint final, aparece quando readyToAdvance */}
              <div
                className="mt-10"
                style={{
                  opacity: readyToAdvance ? 1 : 0,
                  transform: readyToAdvance
                    ? "translateY(0)"
                    : "translateY(8px)",
                  transition:
                    "opacity 0.5s ease-out, transform 0.5s ease-out",
                  pointerEvents: readyToAdvance ? "auto" : "none",
                }}
              >
                <p
                  className="text-[0.6rem] uppercase tracking-[0.35em] text-[#FB3640]/85"
                  style={{
                    fontFamily: '"Satoshi", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Continue rolando — a marca se revela →
                </p>
              </div>
            </div>
          </div>

          {/* Indicator vertical à direita — desktop only */}
          <nav
            aria-label="Beats da seção"
            className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
          >
            {BEATS.map((_, i) => {
              const isActive = i === activeBeat;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToBeat(i)}
                  aria-label={`Ir pro beat ${i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  data-cursor="triangle"
                  className="group flex items-center gap-3 bg-transparent"
                >
                  <span
                    className="text-[0.55rem] uppercase tracking-[0.3em] tabular-nums"
                    style={{
                      fontFamily: '"Satoshi", sans-serif',
                      fontWeight: 500,
                      color: isActive
                        ? "rgba(245, 242, 237, 0.85)"
                        : "rgba(245, 242, 237, 0.25)",
                      transition: "color 0.3s ease-out",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="block h-[1px]"
                    style={{
                      width: isActive ? "32px" : "16px",
                      background: isActive
                        ? "#F5F2ED"
                        : "rgba(245, 242, 237, 0.3)",
                      transition:
                        "width 0.4s ease-out, background 0.3s ease-out",
                    }}
                  />
                </button>
              );
            })}
          </nav>

          {/* Outro — Serviços monta por cima conforme os cubos somem.
              Fade-in com o outroProgress; só monta quando o outro começa.
              IMPORTANTE: pointerEvents só liberam quando o fade termina
              (>= 1). Antes disso o overlay (que é um scroller próprio)
              roubaria o wheel e travaria o scroll do container pai no meio
              da transição. */}
          {outroProgress > 0.02 && (
            <div
              className="absolute inset-0 z-20"
              style={{
                opacity: smoothstep(outroProgress),
                pointerEvents: outroProgress >= 1 ? "auto" : "none",
              }}
              aria-hidden={outroProgress < 1}
            >
              <ServicesSection />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
