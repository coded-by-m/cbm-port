"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  WHATSAPP_DISPLAY,
  waLink,
} from "@/lib/contact";
import { NAV_LINKS } from "@/data/home";
import { BASE_RGB, SURFACE } from "./shared";

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");

const SATOSHI = '"Satoshi", sans-serif';
const PANCHANG = '"Panchang", sans-serif';

function WhatsAppIcon({
  size = 13,
  fill = SURFACE.base as string,
}: {
  size?: number;
  fill?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LogoMarkSvg({ size = 16, stroke = 12 }) {
  return (
    <svg
      width={size}
      height={(size * 161) / 142}
      viewBox="0 0 142 161"
      fill="none"
      aria-hidden="true"
    >
      <path d="M11.5 148.039V59.0391L53.5 104.438" stroke="#F5F2ED" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M130.5 103.039V19.0391L85.5 67.2944" stroke="#F5F2ED" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 18.0391L130.5 147.039" stroke="#FB3640" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "GitHub", href: GITHUB_URL },
  { label: "WhatsApp", href: WA },
];

/**
 * Header fixo + menu drawer da home estática.
 *
 * Transparente no topo; ao passar de 100px ganha fundo, blur e borda. O menu
 * é um painel lateral com os links grandes em Panchang, contato e redes —
 * fecha no Escape, no overlay e ao clicar num link.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Foco preso no drawer enquanto ele está aberto.
   *
   * Ao abrir, o foco vai pro botão de fechar; Tab e Shift+Tab circulam só
   * dentro do painel; Escape fecha; ao fechar, o foco volta pro hambúrguer —
   * quem navega por teclado não é jogado pro topo do documento.
   */
  useEffect(() => {
    const el = drawerRef.current;
    // `inert` sai ANTES do focus(): focar um elemento inerte é ignorado pelo
    // navegador, e era isso que fazia o foco nunca entrar no painel — e, por
    // consequência, escapar no Tab.
    if (open) el?.removeAttribute("inert");
    else el?.setAttribute("inert", "");

    if (!open) return;
    // Copiado pra variável: na limpeza, `burgerRef.current` pode já ter
    // mudado (react-hooks/exhaustive-deps).
    const burger = burgerRef.current;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const root = drawerRef.current;
      if (!root) return;
      const items = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [open, close]);


  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          height: 64,
          display: "flex",
          alignItems: "center",
          transition: "background 300ms ease, border-color 300ms ease",
          background: scrolled ? `rgba(${BASE_RGB},0.9)` : "transparent",
          borderBottom: `1px solid ${scrolled ? "#111511" : "transparent"}`,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 clamp(16px,3vw,32px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
            <button
              type="button"
              ref={burgerRef}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-drawer"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="site-burger"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 4,
                flex: "none",
                width: 44,
                height: 44,
                padding: "0 12px",
                background: "transparent",
                border: "1px solid rgba(245,242,237,0.28)",
                color: "#F5F2ED",
                cursor: "pointer",
                transition: "border-color 160ms ease, background 160ms ease",
              }}
            >
              <span style={{ display: "block", height: 1, width: "100%", background: "#F5F2ED" }} />
              <span style={{ display: "block", height: 1, width: "100%", background: "#F5F2ED" }} />
            </button>
            <a
              href="#top"
              style={{
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.005em",
                color: "#F5F2ED",
                display: "flex",
                alignItems: "center",
                gap: 10,
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              <LogoMarkSvg />
              <span style={{ whiteSpace: "nowrap" }}>
                Coded <span style={{ color: "#FB3640" }}>by</span> M
              </span>
            </a>
          </div>

          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="site-header-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flex: "none",
              background: "transparent",
              border: "1px solid rgba(245,242,237,0.28)",
              color: "#F5F2ED",
              padding: "11px 19px",
              fontFamily: PANCHANG,
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 150ms ease",
            }}
          >
            <WhatsAppIcon fill="#FB3640" />
            WhatsApp
          </a>
        </div>
      </header>

      <div
        onClick={close}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 55,
          background: `rgba(${BASE_RGB},0.72)`,
          backdropFilter: "blur(3px)",
          transition: "opacity 380ms ease, visibility 380ms",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
        }}
      />

      <aside
        id="site-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 56,
          boxSizing: "border-box",
          width: "min(100vw, clamp(340px,40vw,470px))",
          display: "flex",
          flexDirection: "column",
          background: SURFACE.drawer,
          borderRight: "1px solid rgba(245,242,237,0.1)",
          boxShadow: "0 0 90px rgba(0,0,0,0.9)",
          overflowY: "auto",
          // Sem `visibility` na transição: ela é discreta e só vira `visible`
          // no FIM dos 520ms — o focus() rodava antes, num elemento ainda
          // invisível, e o navegador o ignorava. Quem esconde do teclado e do
          // leitor de tela agora é o `inert`.
          transition:
            "transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease",
          transform: open ? "translateX(0)" : "translateX(calc(-100% - 16px))",
          opacity: open ? 1 : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "16px clamp(20px,2.6vw,32px)",
            borderBottom: "1px solid rgba(245,242,237,0.1)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: SATOSHI,
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#F5F2ED",
            }}
          >
            <span style={{ display: "block", width: 7, height: 7, flex: "none", background: "#FB3640" }} />
            Menu
          </span>
          <button
            type="button"
            ref={closeRef}
            onClick={close}
            aria-label="Fechar menu"
            className="site-drawer-close"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
              width: 44,
              height: 44,
              borderRadius: 9999,
              background: "transparent",
              border: "1px solid rgba(245,242,237,0.35)",
              color: "#F5F2ED",
              cursor: "pointer",
              fontFamily: SATOSHI,
              fontSize: 17,
              lineHeight: 1,
              transition:
                "border-color 180ms ease, background 180ms ease, transform 300ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            ✕
          </button>
        </div>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(28px,6vh,72px) clamp(20px,2.6vw,32px)",
          }}
        >
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="site-drawer-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "clamp(14px,2.2vh,22px) 0",
                borderBottom: "1px solid rgba(245,242,237,0.12)",
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: "clamp(26px,3.1vw,46px)",
                letterSpacing: "0.005em",
                lineHeight: 1.05,
                textTransform: "uppercase",
                minWidth: 0,
                overflowWrap: "anywhere",
                color: "#F5F2ED",
                textDecoration: "none",
                transition:
                  "color 200ms ease, padding-left 300ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {l.label}
              {i === 0 && (
                <span style={{ display: "block", width: 8, height: 8, flex: "none", background: "#FB3640" }} />
              )}
              {l.route && (
                <span style={{ fontSize: "0.5em", color: "#FB3640" }} aria-hidden>
                  ↗
                </span>
              )}
            </a>
          ))}
        </nav>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            padding: "0 clamp(20px,2.6vw,32px) clamp(28px,4vh,44px)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#9B9791",
              }}
            >
              (Whatsapp)
            </span>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="site-drawer-phone"
              style={{
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: "clamp(20px,2.4vw,27px)",
                letterSpacing: "-0.01em",
                color: "#FB3640",
                textDecoration: "none",
                transition: "color 160ms ease",
              }}
            >
              {WHATSAPP_DISPLAY}
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#9B9791",
              }}
            >
              (Social)
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-social"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 15,
                    color: "#F5F2ED",
                    textDecoration: "none",
                    transition: "color 160ms ease",
                  }}
                >
                  {s.label}
                  <span style={{ fontSize: 12, color: "#FB3640" }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              borderTop: "1px solid rgba(245,242,237,0.1)",
              paddingTop: 18,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#B4B0AA",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 6,
                  height: 6,
                  flex: "none",
                  background: "#FB3640",
                  transform: "rotate(45deg)",
                }}
              />
              Aceitando projetos
            </span>
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#9B9791",
                whiteSpace: "nowrap",
              }}
            >
              Florianópolis · SC
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
