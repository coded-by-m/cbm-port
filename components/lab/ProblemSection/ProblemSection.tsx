"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  useSectionScrollProgress,
  scrollToSectionProgress,
} from "@/hooks/useSectionScrollProgress";

const GenericGrid = dynamic(() => import("./GenericGrid"), { ssr: false });

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

/**
 * @param inPage `false` (default) → scroller interno (uso isolado no /lab).
 *   `true` → fluxo de página (Home), lê o scroll relativo da seção.
 */
export default function ProblemSection({
  inPage = false,
}: {
  inPage?: boolean;
} = {}) {
  // Container de scroll interno (só usado no modo /lab).
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Trilho alto (h-[520vh]) — fonte do progress nos dois modos.
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const outroRef = useRef(0);
  const hoveredRef = useRef(false);
  // Últimos valores emitidos — guard anti re-render por frame.
  const lastBeatRef = useRef(-1);
  const lastReadyRef = useRef(false);
  const lastOutroRef = useRef(-1);
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

  // Scroll progress relativo da seção (interno no /lab, janela na Home) → beats,
  // construção da torre e outro. A matemática (thresholds, fases) é a mesma de
  // antes; só a fonte do `raw` mudou.
  useSectionScrollProgress(trackRef, (raw) => {
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
    if (outroQ !== lastOutroRef.current) {
      lastOutroRef.current = outroQ;
      setOutroProgress(outroQ);
    }

    let nextBeat = 0;
    for (let i = 0; i < BEATS.length; i++) {
      if (p >= BEATS[i].start) nextBeat = i;
    }
    if (nextBeat !== lastBeatRef.current) {
      lastBeatRef.current = nextBeat;
      setActiveBeat(nextBeat);
    }
    const nextReady = p >= 0.95 && outro < 0.05;
    if (nextReady !== lastReadyRef.current) {
      lastReadyRef.current = nextReady;
      setReadyToAdvance(nextReady);
    }
  });

  // Click no indicator vai pro beat (raw = p * DRAW_END).
  const goToBeat = (beatIdx: number) => {
    const targetRaw = (BEATS[beatIdx].start + 0.02) * DRAW_END;
    scrollToSectionProgress(trackRef, targetRaw, inPage ? null : scrollerRef.current);
  };

  // Click no centro quando a torre está pronta: scrolla pro outro.
  const advance = () => {
    scrollToSectionProgress(trackRef, OUTRO_END, inPage ? null : scrollerRef.current);
  };

  return (
    <section
      ref={scrollerRef}
      data-cursor="default"
      className={`bg-[#000F08] ${
        inPage ? "relative" : "absolute inset-0 overflow-y-auto"
      }`}
      aria-labelledby="problem-headline"
    >
      {/* Altura generosa: ~420vh de travel espalha os 4 beats por bastante
          scroll, então cada frase exige movimento deliberado (anti-flick). */}
      <div ref={trackRef} className="relative h-[520vh]">
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

          {/* Serviços foi DESACOPLADO: agora é capítulo próprio na Home, com
              transição independente. O outro do Problema só faz os cubos
              sumirem (via outroRef → GenericGrid), deixando a torre isolada. */}
        </div>
      </div>
    </section>
  );
}
