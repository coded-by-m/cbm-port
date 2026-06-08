"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MeshButton } from "@/components/ui/MeshButton";
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
  const progressRef = useRef(0); // 0..1 da formação do símbolo
  const formedRef = useRef(false); // formação concluída → libera o gesto pro footer

  const [headlinesIn, setHeadlinesIn] = useState(false);
  const [bodyIn, setBodyIn] = useState(false);
  const [ctaIn, setCtaIn] = useState(false);

  // O Convite é uma seção TRAVADA (como as outras): ao ficar ativo, a formação
  // 3D roda sozinha (~2s, "o convite se forma") e a copy entra em cascata —
  // independe de scroll (200vh sticky era frágil no touch e fazia o convite
  // "não aparecer / pular pro footer"). Depois de formado, um gesto pra baixo
  // leva ao footer (tratado no handler abaixo). Dirigido por rAF (auto-contido).
  useEffect(() => {
    const start = inPage ? !!live : true;
    formedRef.current = false;
    if (!start) {
      progressRef.current = 0;
      setHeadlinesIn(false);
      setBodyIn(false);
      setCtaIn(false);
      return;
    }
    const DURATION = 2000;
    // power2.inOut
    const ease = (x: number) =>
      x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const k = Math.min(1, (now - t0) / DURATION);
      progressRef.current = ease(k);
      if (k < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        formedRef.current = true;
      }
    };
    raf = requestAnimationFrame(tick);
    const timers = [
      setTimeout(() => setHeadlinesIn(true), 300),
      setTimeout(() => setBodyIn(true), 750),
      setTimeout(() => setCtaIn(true), 1150),
    ];
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [live, inPage]);

  const wordStyle = (i: number, shown: boolean) => ({
    display: "inline-block",
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
    transitionDelay: `${i * 70}ms`,
  });

  // Seção TRAVADA (como as outras), anti-skip + cooldown: enquanto o convite
  // preenche a tela (topo), o gesto pra BAIXO — depois de formado — leva ao
  // footer (scroll controlado); pra CIMA volta pro Sobre (wipe). No footer
  // libera o scroll normal.
  useEffect(() => {
    if (!inPage || !live) return;
    const el = scrollerRef.current;
    if (!el) return;
    let cooldown = false;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const atTop = () => el.getBoundingClientRect().top >= -2;
    const footerShown = () => {
      const f = el.querySelector("footer");
      return f ? f.getBoundingClientRect().top < window.innerHeight * 0.5 : false;
    };
    const goFooter = () =>
      el
        .querySelector("footer")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    const fire = (fn: () => void) => {
      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, 1100);
      accum = 0;
      fn();
    };

    const onWheel = (e: WheelEvent) => {
      if (cooldown || !atTop()) return;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accum = 0;
      }, 200);
      if (e.deltaY < 0) {
        e.preventDefault();
        accum += e.deltaY;
        if (accum < -90) fire(() => onBackRef.current?.());
      } else if (e.deltaY > 0 && formedRef.current && !footerShown()) {
        e.preventDefault();
        accum += e.deltaY;
        if (accum > 90) fire(goFooter);
      }
    };

    // Touch: 1 gesto = 1 ação. Swipe ↑ (rolar p/ baixo) formado → footer;
    // swipe ↓ (rolar p/ cima) no topo → Sobre.
    let touchY = 0;
    let fired = false;
    let startTop = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      fired = false;
      startTop = atTop();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (cooldown || fired || !startTop) return;
      const dy = touchY - e.touches[0].clientY; // >0 = swipe up = scroll down
      if (dy > 45 && formedRef.current && !footerShown()) {
        e.preventDefault();
        fired = true;
        fire(goFooter);
      } else if (dy < -45) {
        e.preventDefault();
        fired = true;
        fire(() => onBackRef.current?.());
      }
    };
    const onTouchEnd = () => {
      fired = false;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
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
      <div className="relative min-h-screen">
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
                label="Começar meu projeto"
                onClick={() => window.open(WHATSAPP, "_blank", "noopener")}
                aria-label="Começar meu projeto pelo WhatsApp"
              />
            </div>
          </div>

          {/* Cue — aparece DEPOIS de formado, convidando o gesto pra baixo que
              leva ao footer (a seção é travada, não rola livre). */}
          <div
            className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5"
            style={{
              opacity: ctaIn ? 1 : 0,
              transform: ctaIn ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              transitionDelay: ctaIn ? "500ms" : "0ms",
            }}
            aria-hidden
          >
            <span
              className="text-[0.6rem] uppercase tracking-[0.35em] text-[#F5F2ED]/55"
              style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
            >
              Role para continuar
            </span>
            <span className="block h-2.5 w-2.5 rotate-45 animate-bounce border-b border-r border-[#FB3640]" />
          </div>
        </div>
      </div>

      {/* Footer — fecho da página (aparece ao rolar até o fim) */}
      <Footer />
    </section>
  );
}
