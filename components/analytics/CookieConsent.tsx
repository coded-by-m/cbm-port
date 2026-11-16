"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, getConsent, setConsent } from "@/lib/analytics";
import { PRIVACY_PATH } from "@/data/privacidade";
import { cbm } from "@/lib/palette";

/**
 * Banner de consentimento de cookies (LGPD) — no design system da marca.
 *
 * Aparece só quando não há decisão salva. "Aceitar" libera GA4 + Meta Pixel
 * (via setConsent → Analytics reage e carrega os scripts); "Recusar" bloqueia.
 * Linguagem angular (border-radius 0), fundo escuro da paleta ativa (token `base`), acento vermelho raro.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
    // A escolha também pode ser feita em /privacidade.
    const hide = () => setVisible(false);
    window.addEventListener(CONSENT_EVENT, hide);
    return () => window.removeEventListener(CONSENT_EVENT, hide);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const strip = stripRef.current;
    if (!visible || !strip) {
      root.style.setProperty("--cbm-consent-height", "0px");
      return;
    }

    const update = () => {
      root.style.setProperty(
        "--cbm-consent-height",
        `${Math.ceil(strip.getBoundingClientRect().height)}px`,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(strip);
    return () => {
      observer.disconnect();
      root.style.setProperty("--cbm-consent-height", "0px");
    };
  }, [visible]);

  // As rotas /posts são telas de export (carrosséis) — sem chrome do site.
  if (pathname?.startsWith("/posts")) return null;
  if (!visible) return null;

  const decide = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      ref={stripRef}
      role="region"
      aria-label="Consentimento de cookies"
      className="cookie-strip"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        boxSizing: "border-box",
        background: cbm("base", 0.97),
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: `1px solid ${cbm("line")}`,
        boxShadow: "0 -10px 30px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="cookie-strip__inner"
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "10px clamp(16px,4vw,48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px 20px",
        }}
      >
        <p
          style={{
            margin: 0,
            maxWidth: "78ch",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: 1.5,
            color: cbm("gray-200"),
          }}
        >
          Cookies opcionais ajudam a medir o uso do site. Você pode aceitar ou
          recusar. {" "}
          <Link
            href={PRIVACY_PATH}
            className="focus-signal"
            style={{
              color: cbm("white"),
              textDecoration: "underline",
              textDecorationColor: cbm("red"),
              textUnderlineOffset: 3,
            }}
          >
            Política de privacidade
          </Link>
        </p>

        <div className="cookie-strip__actions" style={{ display: "flex", gap: 8, flex: "none" }}>
          <button
            type="button"
            className="focus-signal"
            onClick={() => decide("granted")}
            style={{
              minHeight: 40,
              background: cbm("white"),
              color: cbm("base"),
              border: `1px solid ${cbm("white")}`,
              borderRadius: 0,
              padding: "0 16px",
              fontFamily: "Panchang, sans-serif",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Aceitar
          </button>
          <button
            type="button"
            className="focus-signal"
            onClick={() => decide("denied")}
            style={{
              minHeight: 40,
              background: "transparent",
              color: cbm("white"),
              border: `1px solid ${cbm("gray-400")}`,
              borderRadius: 0,
              padding: "0 16px",
              fontFamily: "Panchang, sans-serif",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}
