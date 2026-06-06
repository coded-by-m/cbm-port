"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { MeshButton } from "@/components/ui/MeshButton";
import { EXPERIMENTS } from "@/lib/experiments";

const LabResidualField = dynamic(() => import("./LabResidualField"), {
  ssr: false,
});

const SCROLL_THRESHOLD = 150;
const SCROLL_COOLDOWN = 1100;

/**
 * Seção LABORATÓRIO da Home — teaser do Experience Lab.
 *
 * Tela única wipe-connected: o wheel navega entre capítulos (↓ Sobre, ↑
 * Processo) via wipe, nunca trava no meio. Entrada sincronizada com o wipe
 * (`live`). Campo residual de fragmentos ao fundo + conteúdo + métricas.
 */
export default function LabSection({
  live,
  onForward,
  onBack,
}: {
  /** Capítulo ativo → entrada sincronizada + wheel-jack ligado. */
  live?: boolean;
  /** Wheel ↓ → próximo capítulo (wipe pro Sobre). */
  onForward?: () => void;
  /** Wheel ↑ → capítulo anterior (wipe pro Processo). */
  onBack?: () => void;
} = {}) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const onForwardRef = useRef(onForward);
  onForwardRef.current = onForward;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const readyCount = EXPERIMENTS.filter((e) => e.status === "ready").length;

  const metrics = [
    { value: String(readyCount), label: "Experimentos" },
    { value: "100%", label: "Código próprio" },
    { value: "R3F · GSAP · TS", label: "Stack" },
  ];

  // Entrada: sincronizada com o wipe (`live`); IntersectionObserver de fallback
  // (caso renderize sem `live`).
  useEffect(() => {
    if (live) {
      setEntered(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
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
  }, [live]);

  // Wheel-jack: tela única → o wheel navega o capítulo (wipe). Só quando ativa.
  useEffect(() => {
    if (!live) return;
    const el = sectionRef.current;
    if (!el) return;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let cooldown = false;
    const fire = (dir: number) => {
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, SCROLL_COOLDOWN);
      if (dir > 0) onForwardRef.current?.();
      else onBackRef.current?.();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown) return;
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
      if (cooldown) return;
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
  }, [live]);

  const reveal = (delay: number, y = 14) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : `translateY(${y}px)`,
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
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

      <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10">
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
              Validamos a técnica antes de construir.
            </h2>

            <p
              className="mt-5 max-w-md text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-[#F5F2ED]/65"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 300,
                ...reveal(240, 12),
              }}
            >
              {readyCount} experimentos isolados — cada efeito e interação é
              provado aqui antes de entrar num projeto real.
            </p>

            <div className="mt-9" style={reveal(360, 12)}>
              <MeshButton
                label="Entrar no Laboratório"
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
              <div key={m.label} className="group/metric">
                <p
                  className="text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none text-[#F5F2ED] transition-colors duration-300 group-hover/metric:text-[#FB3640]"
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
