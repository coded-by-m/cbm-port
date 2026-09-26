"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/ui/LogoMark";
import { waLink, INSTAGRAM_URL, INSTAGRAM_HANDLE, WHATSAPP_DISPLAY } from "@/lib/contact";

const FooterLandscape = dynamic(() => import("./FooterLandscape"), {
  ssr: false,
});

const SAT = '"Satoshi", sans-serif';
const PAN = '"Panchang", sans-serif';

/** Acento do rodapé — o sinal da marca. */
const ACCENT = "#FB3640";

const NAV_BASE = [
  { label: "Laboratório", href: "/lab", external: false },
  { label: "Contato", href: waLink(), external: true, cmId: "footer-nav-whatsapp" },
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    external: true,
  },
];

/**
 * Footer-showpiece (zona 11) — paisagem triangulada da marca subindo da base +
 * wordmark gigante "Coded by M", status/waitlist, nav e contato. Tudo entra
 * ao ficar à vista; a paisagem congela fora dela.
 *
 * O grid técnico e o acento ciclável (teclas G e C) foram removidos: viraram
 * afordância sem botão quando os atalhos saíram do rodapé.
 */
export default function Footer({
  /** Fundo do rodapé. Default = o da experiência; a home passa o seu. */
  background = "#000F08",
}: {
  background?: string;
} = {}) {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);
  const pathname = usePathname();
  // Na experiência o rodapé oferece a volta pra home; fora dela, a ida pra
  // experiência — o link nunca aponta pra página em que já se está.
  const isExperience = pathname?.startsWith("/experiencia") ?? false;
  const NAV = [
    isExperience
      ? { label: "Início", href: "/", external: false }
      : { label: "A Experiência", href: "/experiencia", external: false },
    ...NAV_BASE,
  ];

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

  const rise = (delay: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${delay}ms`,
  });

  return (
    <footer
      ref={rootRef}
      data-cm-section="footer"
      className="relative w-full overflow-hidden"
      style={{ background, minHeight: "86vh" }}
    >
      {/* Paisagem triangulada subindo da base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[72%]">
        <FooterLandscape active={inView} />
      </div>

      {/* Monograma gigante (marca d'água atravessando a base) — "CbM" mantém a
          altura sem transbordar como o nome inteiro fazia. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[2vh] z-[1] flex items-end justify-center overflow-hidden">
        <span
          className="select-none whitespace-nowrap leading-[0.72] text-[#F5F2ED]"
          style={{
            fontFamily: PAN,
            fontWeight: 800,
            fontSize: "26vw",
            letterSpacing: "-0.03em",
            opacity: entered ? 0.08 : 0,
            transform: entered ? "translateY(0)" : "translateY(44px)",
            transition: "opacity 1.1s ease-out, transform 1.1s ease-out",
          }}
        >
          CbM
        </span>
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
                    style={{ background: ACCENT }}
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
                data-cm-id={"cmId" in item ? item.cmId : undefined}
                data-cursor="triangle"
                className="group flex items-center justify-between border-b border-[#F5F2ED]/10 py-3 text-[0.95rem] text-[#F5F2ED]/70 transition-colors hover:text-[#F5F2ED]"
                style={{ fontFamily: PAN, fontWeight: 500 }}
              >
                <span>{item.label}</span>
                <span
                  className="-translate-x-1.5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ color: ACCENT }}
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
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                data-cm-role="whatsapp"
                data-cm-id="footer-whatsapp"
                data-cursor="triangle"
                className="transition-colors hover:text-[#F5F2ED]"
              >
                WhatsApp · {WHATSAPP_DISPLAY}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="triangle"
                className="transition-colors hover:text-[#F5F2ED]"
              >
                {INSTAGRAM_HANDLE}
              </a>
              <span className="uppercase tracking-[0.2em] text-[#F5F2ED]/40">
                Florianópolis · BR
              </span>
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
            style={{ color: ACCENT }}
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
