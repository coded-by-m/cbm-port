"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GITHUB_URL,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  waLink,
} from "@/lib/contact";
import { NAV_LINKS } from "@/data/home";
import { SURFACE } from "./shared";
import { cbm } from "@/lib/palette";
import { TriArrow } from "@/components/ui/TriArrow";
import { MeshButton } from "@/components/ui/MeshButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");

const SATOSHI = '"Satoshi", sans-serif';
const PANCHANG = '"Panchang", sans-serif';


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
  { label: "GitHub", href: GITHUB_URL },
  { label: "WhatsApp", href: WA, cmId: "menu-social-whatsapp", cmRole: "whatsapp" },
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

  const [activeId, setActiveId] = useState<string>("top");

  const close = useCallback(() => setOpen(false), []);

  /**
   * Marcador de seção ativa — o losango vermelho acompanha o que está à
   * vista, mesmo vocabulário do ChapterRail da experiência.
   *
   * `rootMargin` puxa a linha de corte pro terço superior: sem isso a seção
   * só "ativa" quando o topo dela sai da tela, e o marcador fica sempre um
   * passo atrás de onde a pessoa está lendo.
   */
  useEffect(() => {
    const secs = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!secs.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (!vis.length) return;
        // A que ocupa mais da faixa observada vence.
        const top = vis.reduce((a, b) =>
          b.intersectionRatio > a.intersectionRatio ? b : a,
        );
        setActiveId(top.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    secs.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

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
          background: scrolled ? cbm("base", 0.9) : "transparent",
          borderBottom: `1px solid ${scrolled ? cbm("border") : "transparent"}`,
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
              <span className="site-header-word" style={{ whiteSpace: "nowrap" }}>
                Coded <span style={{ color: "#FB3640" }}>by</span> M
              </span>
            </a>
          </div>

          <MeshButton
            label="WhatsApp"
            size="sm"
            showArrow={false}
            lead={<WhatsAppIcon />}
            href={WA}
            target="_blank"
            data-cm-role="whatsapp"
            data-cm-id="header-whatsapp"
            style={{ flex: "none" }}
          />
        </div>
      </header>

      <div
        onClick={close}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 55,
          background: cbm("base", 0.72),
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
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              aria-current={activeId === l.id ? "true" : undefined}
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
                color: "#F5F2ED",
                textDecoration: "none",
                transition:
                  "color 200ms ease, padding-left 300ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {l.label}
              {activeId === l.id && (
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    width: 9,
                    height: 9,
                    flex: "none",
                    background: "#FB3640",
                    transform: "rotate(45deg)",
                  }}
                />
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
                color: cbm("gray-400"),
              }}
            >
              (Whatsapp)
            </span>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              data-cm-role="whatsapp"
              data-cm-id="menu-whatsapp"
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
                color: cbm("gray-400"),
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
                  data-cm-id={"cmId" in s ? s.cmId : undefined}
                  data-cm-role={"cmRole" in s ? s.cmRole : undefined}
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
                  <span style={{ fontSize: 12, color: "#FB3640" }}><TriArrow dir="up-right" /></span>
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
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: cbm("gray-400"),
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
