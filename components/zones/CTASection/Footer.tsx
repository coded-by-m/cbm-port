"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * Footer da Home (zona 11) — fecho elegante + info técnica. HTML puro,
 * sem 3D. Logo + nav + localização/handle + copyright.
 */
const NAV = [
  { label: "Projetos", href: "/lab" },
  { label: "Laboratório", href: "/lab" },
  { label: "Sobre", href: "/lab" },
  { label: "Contato", href: "https://wa.me/5548988354350", external: true },
];

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-[#1a2a1e] bg-[#000F08] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        {/* Topo: logo + nav */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark size={26} />
            <span
              className="text-[0.7rem] uppercase tracking-[0.35em] text-[#F5F2ED]/70"
              style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
            >
              Coded by M
            </span>
          </div>

          <nav
            aria-label="Rodapé"
            className="flex flex-wrap gap-x-8 gap-y-3"
          >
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                data-cursor="triangle"
                className="text-[0.8rem] text-[#F5F2ED]/60 transition-colors hover:text-[#F5F2ED]"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 400 }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divisória */}
        <div className="my-9 h-px w-full bg-[#1a2a1e]" aria-hidden />

        {/* Base: localização/handle + copyright */}
        <div className="flex flex-col gap-4 text-[0.72rem] text-[#F5F2ED]/45 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-col gap-1 sm:flex-row sm:gap-6"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 400 }}
          >
            <span className="uppercase tracking-[0.2em]">
              Florianópolis, BR
            </span>
            <span className="tracking-[0.1em]">@codedbymstudio</span>
          </div>
          <div
            className="flex flex-col gap-1 sm:flex-row sm:gap-6 sm:text-right"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 400 }}
          >
            <span>Designed + coded by M</span>
            <span className="tracking-[0.1em]">© 2026 Coded by M</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
