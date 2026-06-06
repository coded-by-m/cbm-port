"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MeshButton } from "@/components/ui/MeshButton";
import { useSectionScrollProgress } from "@/hooks/useSectionScrollProgress";
import Footer from "./Footer";

const CTAFormation = dynamic(() => import("./CTAFormation"), { ssr: false });

/** WhatsApp do estúdio + mensagem pré-preenchida. */
const WHATSAPP =
  "https://wa.me/5548988354350?text=" +
  encodeURIComponent("Olá! Quero iniciar um projeto com a Coded by M.");

/**
 * Seção CTA FINAL da Home — clímax/conversão (zona 10).
 *
 * Scroll-driven (sticky): fragmentos convergem pra formar o símbolo CbM
 * (CTAFormation) enquanto as headlines surgem (word-stagger) e o MeshButton
 * aparece na formação. Tom cheeky/confiante.
 */
const HEAD_1 = ["Seu", "site", "atual", "está", "ótimo."];
const HEAD_2 = ["Para", "2014."];

/**
 * @param inPage `false` (default) → scroller interno (uso isolado no /lab).
 *   `true` → fluxo de página (Home), lê o scroll relativo da seção.
 */
export default function CTASection({
  inPage = false,
  live,
  onBack,
}: {
  inPage?: boolean;
  /** Capítulo ativo → congela o canvas fora dele + arma o wipe de voltar. */
  live?: boolean;
  /** Rolar ↑ no TOPO → capítulo anterior (wipe pro Sobre). */
  onBack?: () => void;
} = {}) {
  // Container de scroll interno (só usado no modo /lab).
  const scrollerRef = useRef<HTMLDivElement>(null);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  // Trilho alto (h-[240vh]) — fonte do progress nos dois modos.
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const lastHRef = useRef(false);
  const lastBRef = useRef(false);
  const lastCRef = useRef(false);
  const [headlinesIn, setHeadlinesIn] = useState(false);
  const [bodyIn, setBodyIn] = useState(false);
  const [ctaIn, setCtaIn] = useState(false);

  // Mesma lógica de antes; só a fonte do `p` mudou (helper relativo à seção).
  useSectionScrollProgress(trackRef, (p) => {
    progressRef.current = Math.max(0, Math.min(1, p));

    const h = p > 0.5;
    const b = p > 0.62;
    const c = p > 0.82;
    if (h !== lastHRef.current) {
      lastHRef.current = h;
      setHeadlinesIn(h);
    }
    if (b !== lastBRef.current) {
      lastBRef.current = b;
      setBodyIn(b);
    }
    if (c !== lastCRef.current) {
      lastCRef.current = c;
      setCtaIn(c);
    }
  });

  const wordStyle = (i: number, shown: boolean) => ({
    display: "inline-block",
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
    transitionDelay: `${i * 70}ms`,
  });

  // Wipe ao subir do TOPO → capítulo anterior (Sobre). É a finale (com footer),
  // então só trata o topo↑; descer rola livre até o footer.
  useEffect(() => {
    if (!inPage || !live) return;
    const el = scrollerRef.current;
    if (!el) return;
    let cooldown = false;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      if (cooldown) return;
      const rect = el.getBoundingClientRect();
      const atTop = rect.top >= -2;
      if (e.deltaY < 0 && atTop) {
        e.preventDefault();
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          accum = 0;
        }, 200);
        accum += e.deltaY;
        if (accum < -90) {
          cooldown = true;
          setTimeout(() => {
            cooldown = false;
          }, 1100);
          accum = 0;
          onBackRef.current?.();
        }
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

  return (
    <section
      ref={scrollerRef}
      data-cursor="triangle"
      className={`bg-[#000F08] ${
        inPage ? "relative" : "absolute inset-0 overflow-y-auto"
      }`}
      aria-labelledby="cta-headline"
    >
      <div ref={trackRef} className="relative h-[240vh]">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          {/* Formação 3D — campo ambiente + energia convergindo pro CTA. */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <CTAFormation progressRef={progressRef} active={!!live} />
          </div>

          {/* Vignette pra legibilidade da copy sobre o símbolo */}
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,15,8,0.35) 0%, rgba(0,15,8,0.78) 60%, rgba(0,15,8,0.94) 100%)",
            }}
            aria-hidden
          />

          {/* Copy + CTA */}
          <div className="relative z-10 px-6 text-center">
            <h2
              id="cta-headline"
              className="text-[clamp(2.2rem,6vw,4.4rem)] leading-[1.02] text-[#F5F2ED]"
              style={{
                fontFamily: '"Panchang", sans-serif',
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              <span className="block">
                {HEAD_1.map((w, i) => (
                  <span key={i} style={wordStyle(i, headlinesIn)}>
                    {w}
                    {i < HEAD_1.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
              <span className="mt-1 block">
                {HEAD_2.map((w, i) => (
                  <span
                    key={i}
                    style={{
                      ...wordStyle(HEAD_1.length + i, headlinesIn),
                      color: "#FB3640",
                    }}
                  >
                    {w}
                    {i < HEAD_2.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            </h2>

            <p
              className="mx-auto mt-7 max-w-md text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-[#F5F2ED]/85"
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontWeight: 300,
                opacity: bodyIn ? 1 : 0,
                transform: bodyIn ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              }}
            >
              O mercado evoluiu. Sua presença digital também deveria.
            </p>

            <div
              className="mt-10 flex justify-center"
              style={{
                opacity: ctaIn ? 1 : 0,
                transform: ctaIn ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
                pointerEvents: ctaIn ? "auto" : "none",
              }}
            >
              <MeshButton
                label="Iniciar Projeto"
                onClick={() => window.open(WHATSAPP, "_blank", "noopener")}
                aria-label="Iniciar projeto pelo WhatsApp"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer — fecho da página (aparece ao rolar até o fim) */}
      <Footer />
    </section>
  );
}
