"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";
import { waLink } from "@/lib/contact";

/**
 * Header fixo do /portfolio.
 *
 * Logo à esquerda (volta pra experiência WebGL), âncoras e WhatsApp à
 * direita. No mobile as âncoras somem — sobra logo + botão.
 *
 * Client por causa do scroll suave: checamos prefers-reduced-motion
 * explicitamente pra garantir salto instantâneo quando pedido.
 */

const ANCHORS = [
  { href: "#projetos", label: "Projetos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
];

export function PortfolioHeader() {
  const jump = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-cbm-white/10 bg-cbm-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Coded by M — ir pra experiência"
          data-cursor="triangle"
          className="flex items-center gap-2.5 outline-none focus-visible:ring-1 focus-visible:ring-cbm-white/60"
        >
          <LogoMark size={22} />
          <span className="font-display text-sm font-semibold tracking-[0.2em] text-cbm-white">
            CbM
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <nav aria-label="Seções" className="hidden items-center gap-7 md:flex">
            {ANCHORS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                onClick={(e) => jump(e, a.href)}
                data-cursor="triangle"
                className="font-body text-[0.62rem] uppercase tracking-[0.26em] text-cbm-white/60 transition-colors hover:text-cbm-white focus-visible:text-cbm-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cbm-white/60"
              >
                {a.label}
              </a>
            ))}
          </nav>

          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="group inline-flex items-center gap-2 border border-cbm-white/15 px-4 py-2.5 font-display text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cbm-white transition-colors hover:border-cbm-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
              className="text-cbm-red transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
