"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { MeshButton } from "@/components/ui/MeshButton";
import { EXPERIMENTS } from "@/lib/experiments";

const LabResidualField = dynamic(() => import("./LabResidualField"), {
  ssr: false,
});

/**
 * Seção LABORATÓRIO da Home — teaser do Experience Lab (zona 7).
 *
 * Momento de "bastidor": prova rigor técnico e cria curiosidade pra `/lab`.
 * Campo residual de fragmentos triangulados decorativo ao fundo + conteúdo
 * (eyebrow/headline/sub/CTA) + bloco de métricas.
 *
 * Entry-animated (IntersectionObserver) — zona leve, sem scroll-driven.
 */
export default function LabSection() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  const readyCount = EXPERIMENTS.filter((e) => e.status === "ready").length;

  const metrics = [
    { value: String(readyCount), label: "Experimentos" },
    { value: "~12k", label: "Linhas de código" },
    { value: "R3F · GSAP · TS", label: "Stack" },
  ];

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
      { threshold: 0.35 },
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
      data-cursor="triangle"
      className="absolute inset-0 overflow-hidden bg-[#000F08]"
      aria-labelledby="lab-headline"
    >
      {/* Campo residual de fragmentos */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <LabResidualField />
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,15,8,0.78) 0%, rgba(0,15,8,0.25) 30%, rgba(0,15,8,0.25) 60%, rgba(0,15,8,0.92) 100%)",
        }}
        aria-hidden
      />

      <div
        ref={rootRef}
        className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Conteúdo principal */}
          <div className="max-w-xl">
            <div className="flex items-center gap-4" style={reveal(0, 10)}>
              <span className="h-[1px] w-12 bg-[#FB3640]/70" aria-hidden />
              <p
                className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                Bastidor
              </p>
            </div>

            <h2
              id="lab-headline"
              className="mt-7 text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.04] text-[#F5F2ED]"
              style={{
                fontFamily: '"Panchang", sans-serif',
                fontWeight: 700,
                letterSpacing: "-0.026em",
                ...reveal(120),
              }}
            >
              Onde validamos antes de construir.
            </h2>

            <p
              className="mt-5 max-w-md text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-[#F5F2ED]/60"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 300,
                ...reveal(240, 12),
              }}
            >
              {readyCount} experimentos técnicos pra reduzir risco e garantir
              entrega.
            </p>

            <div className="mt-9" style={reveal(360, 12)}>
              <MeshButton
                label="Visitar Laboratório"
                onClick={() => router.push("/lab")}
                aria-label="Visitar o Experience Lab"
              />
            </div>
          </div>

          {/* Lab Metrics */}
          <div
            className="mt-16 grid max-w-2xl grid-cols-1 gap-8 border-t border-[#F5F2ED]/10 pt-8 sm:grid-cols-3"
            style={reveal(480, 12)}
          >
            {metrics.map((m) => (
              <div key={m.label}>
                <p
                  className="text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none text-[#F5F2ED]"
                  style={{
                    fontFamily: '"Panchang", sans-serif',
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.value}
                </p>
                <p
                  className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/45"
                  style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
                >
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
