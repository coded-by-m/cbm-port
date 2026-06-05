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

export default function AboutSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
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
  }, []);

  const reveal = (delay: number, y = 14) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : `translateY(${y}px)`,
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${delay}ms`,
  });

  return (
    <section
      data-cursor="default"
      className="absolute inset-0 overflow-y-auto bg-[#000F08]"
      aria-labelledby="about-headline"
    >
      {/* Terrain residual sutil */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]">
        <AboutTerrain />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
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
            <div className="relative grid h-[200px] w-[200px] place-items-center border border-[#F5F2ED]/10 sm:h-[240px] sm:w-[240px]">
              <span
                className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[#FB3640]/50"
                aria-hidden
              />
              <span
                className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#FB3640]/50"
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
              construir presença digital que reflete a qualidade real das
              empresas.
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
            <div key={v.title} className="bg-[#000F08] p-7">
              <p
                className="text-[clamp(1.15rem,1.8vw,1.5rem)] text-[#F5F2ED]"
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
