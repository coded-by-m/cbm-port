"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";

const FooterLandscape = dynamic(() => import("./FooterLandscape"), {
  ssr: false,
});

const SAT = '"Satoshi", sans-serif';
const PAN = '"Panchang", sans-serif';

/** Acentos cicláveis pela tecla C. */
const ACCENTS = ["#FB3640", "#F5F2ED", "#C8C4BE"];

const NAV = [
  { label: "Início", href: "/", external: false },
  { label: "Laboratório", href: "/lab", external: false },
  { label: "Contato", href: "https://wa.me/5548988354350", external: true },
  {
    label: "Instagram",
    href: "https://instagram.com/codedbymstudio",
    external: true,
  },
];

/** Posições (%) das linhas do grid técnico (toggle G) + crosshairs. */
const COLS = [22, 50, 78];
const ROWS = [42, 74];

/**
 * Footer-showpiece (zona 11) — paisagem triangulada da marca subindo da base +
 * wordmark gigante "Coded by M" + grid técnico com crosshairs (tecla G) +
 * acento ciclável (tecla C). Status/waitlist, nav, contato. Tudo entra ao
 * ficar à vista; a paisagem congela fora dela.
 */
export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);
  const [gridOn, setGridOn] = useState(false);
  const [accentIdx, setAccentIdx] = useState(0);
  const accent = ACCENTS[accentIdx];

  // À vista → entrada (latch) + paisagem ativa + atalhos armados.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setInView(e.isIntersecting);
          if (e.isIntersecting) setEntered(true);
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Atalhos: G (grid) / C (cor) — só com o footer à vista, sem combos/inputs.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      if (k === "g") {
        e.preventDefault();
        setGridOn((v) => !v);
      } else if (k === "c") {
        e.preventDefault();
        setAccentIdx((i) => (i + 1) % ACCENTS.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView]);

  const rise = (delay: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${delay}ms`,
  });

  return (
    <footer
      ref={rootRef}
      className="relative w-full overflow-hidden bg-[#000F08]"
      style={{ minHeight: "86vh" }}
    >
      {/* Paisagem triangulada subindo da base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[72%]">
        <FooterLandscape active={inView} />
      </div>

      {/* Wordmark gigante (marca d'água atravessando a base) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex items-end justify-center overflow-hidden">
        <span
          className="select-none whitespace-nowrap leading-[0.76] text-[#F5F2ED]"
          style={{
            fontFamily: PAN,
            fontWeight: 800,
            fontSize: "19vw",
            letterSpacing: "-0.04em",
            opacity: entered ? 0.07 : 0,
            transform: entered ? "translateY(0)" : "translateY(44px)",
            transition: "opacity 1.1s ease-out, transform 1.1s ease-out",
          }}
        >
          Coded by M
        </span>
      </div>

      {/* Grid técnico + crosshairs (toggle G) */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{ opacity: gridOn ? 1 : 0, transition: "opacity 0.4s ease-out" }}
        aria-hidden
      >
        {COLS.map((x) => (
          <div
            key={`v${x}`}
            className="absolute bottom-0 top-0 w-px"
            style={{ left: `${x}%`, background: accent, opacity: 0.14 }}
          />
        ))}
        {ROWS.map((y) => (
          <div
            key={`h${y}`}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${y}%`, background: accent, opacity: 0.14 }}
          />
        ))}
        {COLS.map((x) =>
          ROWS.map((y) => (
            <span
              key={`c${x}-${y}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[13px] leading-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                color: accent,
                opacity: 0.55,
              }}
            >
              +
            </span>
          )),
        )}
      </div>

      {/* Conteúdo (topo) */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pb-10 pt-16 sm:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Coluna 1 — marca + status/waitlist */}
          <div style={rise(0)}>
            <div className="flex items-center gap-3">
              <LogoMark size={26} />
              <span
                className="text-[0.72rem] uppercase tracking-[0.35em] text-[#F5F2ED]/75"
                style={{ fontFamily: SAT, fontWeight: 600 }}
              >
                Coded by M
              </span>
            </div>
            <div className="mt-7 flex flex-col gap-2.5">
              {["Aceitando projetos", "Agenda 2026 limitada"].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <span
                    className="block h-2 w-2 animate-pulse"
                    style={{ background: accent }}
                    aria-hidden
                  />
                  <span
                    className="text-[0.7rem] uppercase tracking-[0.25em] text-[#F5F2ED]/70"
                    style={{ fontFamily: SAT, fontWeight: 500 }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 2 — nav */}
          <nav className="flex flex-col" aria-label="Rodapé" style={rise(120)}>
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                data-cursor="triangle"
                className="group flex items-center justify-between border-b border-[#F5F2ED]/10 py-3 text-[0.95rem] text-[#F5F2ED]/70 transition-colors hover:text-[#F5F2ED]"
                style={{ fontFamily: PAN, fontWeight: 500 }}
              >
                <span>{item.label}</span>
                <span
                  className="-translate-x-1.5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ color: accent }}
                  aria-hidden
                >
                  →
                </span>
              </Link>
            ))}
          </nav>

          {/* Coluna 3 — contato + atalhos */}
          <div className="flex flex-col gap-6" style={rise(240)}>
            <div
              className="flex flex-col gap-1.5 text-[0.8rem] text-[#F5F2ED]/60"
              style={{ fontFamily: SAT, fontWeight: 400 }}
            >
              <a
                href="https://wa.me/5548988354350"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="triangle"
                className="transition-colors hover:text-[#F5F2ED]"
              >
                WhatsApp · +55 48 98835-4350
              </a>
              <a
                href="https://instagram.com/codedbymstudio"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="triangle"
                className="transition-colors hover:text-[#F5F2ED]"
              >
                @codedbymstudio
              </a>
              <span className="uppercase tracking-[0.2em] text-[#F5F2ED]/40">
                Florianópolis · BR
              </span>
            </div>

            {/* Atalhos funcionais */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setGridOn((v) => !v)}
                data-cursor="triangle"
                className="flex items-center gap-2.5 text-[0.7rem] text-[#F5F2ED]/45 transition-colors hover:text-[#F5F2ED]/80"
              >
                <kbd
                  className="grid h-5 w-5 place-items-center border text-[0.65rem]"
                  style={{ borderColor: `${accent}66`, color: accent }}
                >
                  G
                </kbd>
                <span
                  className="uppercase tracking-[0.2em]"
                  style={{ fontFamily: SAT }}
                >
                  {gridOn ? "ocultar grid" : "mostrar grid"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAccentIdx((i) => (i + 1) % ACCENTS.length)}
                data-cursor="triangle"
                className="flex items-center gap-2.5 text-[0.7rem] text-[#F5F2ED]/45 transition-colors hover:text-[#F5F2ED]/80"
              >
                <kbd
                  className="grid h-5 w-5 place-items-center border text-[0.65rem]"
                  style={{ borderColor: `${accent}66`, color: accent }}
                >
                  C
                </kbd>
                <span
                  className="uppercase tracking-[0.2em]"
                  style={{ fontFamily: SAT }}
                >
                  trocar cor
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* © / tagline */}
        <div
          className="mt-12 flex flex-col gap-3 border-t border-[#F5F2ED]/10 pt-7 text-[0.72rem] text-[#F5F2ED]/40 sm:flex-row sm:items-center sm:justify-between"
          style={{ fontFamily: SAT, fontWeight: 400, ...rise(360) }}
        >
          <span
            className="uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            Construído, não montado.
          </span>
          <span className="tracking-[0.1em]">
            © 2026 Coded by M · Designed + coded by M
          </span>
        </div>
      </div>
    </footer>
  );
}
