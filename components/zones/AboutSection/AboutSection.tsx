"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LogoMark } from "@/components/ui/LogoMark";

const AboutTerrain = dynamic(() => import("./AboutTerrain"), { ssr: false });

/**
 * Seção SOBRE da Home — humaniza a marca (zona 9).
 *
 * Coluna esquerda: símbolo CbM wireframe. Direita: manifesto + fundador +
 * localização. Abaixo: 3 valores. 3D off (apenas terrain residual estático).
 * Entry-animated (IntersectionObserver) — zona leve, sem scroll-driven.
 */

const VALUES = [
  { title: "Precisão", desc: "Cada pixel tem razão de existir." },
  { title: "Elegância", desc: "Sofisticação que não precisa gritar." },
  { title: "Detalhismo", desc: "O acabamento é o produto." },
];

/**
 * @param inPage `false` (default) → scroller interno (uso isolado no /lab).
 *   `true` → fluxo de página (Home): `relative min-h-screen` (sem scroller
 *   interno que prenderia o scroll) e fundos `absolute` presos à seção.
 */
export default function AboutSection({
  inPage = false,
  live,
  onForward,
  onBack,
}: {
  inPage?: boolean;
  /** Capítulo ativo → entrada sincronizada com o wipe + wipe nas bordas. */
  live?: boolean;
  /** Rolar ↓ no FIM → próximo capítulo (wipe pro Convite). */
  onForward?: () => void;
  /** Rolar ↑ no TOPO → capítulo anterior (wipe pro Laboratório). */
  onBack?: () => void;
} = {}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const onForwardRef = useRef(onForward);
  onForwardRef.current = onForward;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  // Entrada: sincronizada com o wipe (`live`); IntersectionObserver de fallback.
  useEffect(() => {
    if (live) {
      setEntered(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setEntered(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setEntered(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [live]);

  // Wipe nas BORDAS (como o Serviços): rola livre por dentro; no fim ↓ → wipe
  // pro próximo capítulo, no topo ↑ → wipe pro anterior. Não trava no meio.
  useEffect(() => {
    if (!inPage || !live) return;
    const el = sectionRef.current;
    if (!el) return;
    let cooldown = false;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const fire = (fn?: () => void) => {
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, 1100);
      accum = 0;
      fn?.();
    };
    const onWheel = (e: WheelEvent) => {
      if (cooldown) return;
      const rect = el.getBoundingClientRect();
      const atBottom = rect.bottom <= window.innerHeight + 2;
      const atTop = rect.top >= -2;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accum = 0;
      }, 200);
      if (e.deltaY > 0 && atBottom) {
        e.preventDefault();
        accum += e.deltaY;
        if (accum > 90) fire(onForwardRef.current);
      } else if (e.deltaY < 0 && atTop) {
        e.preventDefault();
        accum += e.deltaY;
        if (accum < -90) fire(onBackRef.current);
      } else {
        accum = 0;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [inPage, live]);

  const reveal = (delay: number, y = 14) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : `translateY(${y}px)`,
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      data-cursor="default"
      className={`bg-[#000F08] ${
        inPage ? "relative min-h-screen" : "absolute inset-0 overflow-y-auto"
      }`}
      aria-labelledby="about-headline"
    >
      {/* Terrain residual sutil. Na Home (`inPage`) os fundos são `absolute`
          pra ficarem presos à seção; isolados (lab) são `fixed` no viewport. */}
      <div
        className={`pointer-events-none ${
          inPage ? "absolute" : "fixed"
        } inset-0 z-0 opacity-[0.08]`}
      >
        <AboutTerrain />
      </div>
      <div
        className={`pointer-events-none ${
          inPage ? "absolute" : "fixed"
        } inset-0 z-[1]`}
        style={{
          background:
            "linear-gradient(180deg, rgba(0,15,8,0.7) 0%, rgba(0,15,8,0) 26%, rgba(0,15,8,0) 74%, rgba(0,15,8,0.85) 100%)",
        }}
        aria-hidden
      />

      <div
        ref={rootRef}
        className="relative z-10 mx-auto flex min-h-full max-w-[1200px] flex-col justify-center px-6 py-24 sm:px-10"
      >
        {/* Bloco principal: símbolo + manifesto/fundador */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[260px_1fr] md:gap-16">
          {/* Coluna esquerda — símbolo CbM */}
          <div
            className="flex justify-center md:justify-start"
            style={reveal(0, 16)}
          >
            <div className="group relative grid h-[200px] w-[200px] place-items-center border border-[#F5F2ED]/10 transition-colors duration-500 hover:border-[#F5F2ED]/30 sm:h-[240px] sm:w-[240px]">
              <span
                className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[#FB3640]/50 transition-colors duration-500 group-hover:border-[#FB3640]"
                aria-hidden
              />
              <span
                className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#FB3640]/50 transition-colors duration-500 group-hover:border-[#FB3640]"
                aria-hidden
              />
              <LogoMark size={84} />
            </div>
          </div>

          {/* Coluna direita — manifesto + fundador */}
          <div>
            <div className="flex items-center gap-4" style={reveal(120, 10)}>
              <span className="h-[1px] w-12 bg-[#FB3640]/70" aria-hidden />
              <p
                className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                Sobre
              </p>
            </div>

            <h2
              id="about-headline"
              className="mt-6 max-w-xl text-[clamp(1.4rem,2.5vw,2.1rem)] leading-[1.32] text-[#F5F2ED]"
              style={{
                fontFamily: '"Panchang", sans-serif',
                fontWeight: 600,
                letterSpacing: "-0.015em",
                ...reveal(220),
              }}
            >
              A Coded by M une design, tecnologia e pensamento estrutural pra
              construir uma presença digital à altura da empresa por trás dela.
            </h2>

            {/* Fundador */}
            <div
              className="mt-9 max-w-lg border-t border-[#F5F2ED]/10 pt-7"
              style={reveal(340, 12)}
            >
              <p
                className="text-[1.05rem] text-[#F5F2ED]"
                style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
              >
                Matheus Mendes
              </p>
              <p
                className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-[#F5F2ED]/45"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                Fundador · Coded by M
              </p>
              <p
                className="mt-4 text-[0.95rem] leading-relaxed text-[#F5F2ED]/65"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 300 }}
              >
                Formado em Análise e Desenvolvimento de Sistemas, encontrei no
                web design o ponto onde técnica e estética se encontram. A Coded
                by M é onde levo isso a sério — cada projeto, uma busca por uma
                presença digital tão boa quanto a empresa por trás dela.
              </p>

              {/* Localização */}
              <div className="mt-5 flex items-center gap-2.5">
                <span
                  className="block h-[7px] w-[7px] rotate-45 bg-[#FB3640]"
                  aria-hidden
                />
                <p
                  className="text-[0.7rem] uppercase tracking-[0.25em] text-[#F5F2ED]/50"
                  style={{
                    fontFamily: '"Satoshi", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Florianópolis, Brasil
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 valores */}
        <div
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-[#F5F2ED]/10 bg-[#F5F2ED]/10 sm:grid-cols-3"
          style={reveal(460, 12)}
        >
          {VALUES.map((v) => (
            <div key={v.title} className="group/v bg-[#000F08] p-7">
              <p
                className="text-[clamp(1.15rem,1.8vw,1.5rem)] text-[#F5F2ED] transition-colors duration-300 group-hover/v:text-[#FB3640]"
                style={{
                  fontFamily: '"Panchang", sans-serif',
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {v.title}
              </p>
              <p
                className="mt-2 text-[0.85rem] leading-relaxed text-[#F5F2ED]/55"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 300 }}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
