"use client";

import { useEffect, useState } from "react";
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
 *
 * Faixa baixa, e não um cartão: o cartão de antes cobria um quinto da tela no
 * celular e disputava a dobra com o botão de orçamento. Texto e botões ficam
 * na mesma linha quando cabem (cerca de 64px de altura) e quebram em duas no
 * celular (cerca de 90px).
 *
 * Aparece já na entrada, sem esperar a rolagem: a conversão do Google Ads só
 * é medida com consentimento, e quem clica no WhatsApp sem rolar ficaria de
 * fora.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
    // A escolha também pode ser feita em /privacidade.
    const hide = () => setVisible(false);
    window.addEventListener(CONSENT_EVENT, hide);
    return () => window.removeEventListener(CONSENT_EVENT, hide);
  }, []);

  if (!visible) return null;

  const decide = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      style={{
        position: "fixed",
        left: "clamp(12px,3vw,20px)",
        right: "auto",
        bottom: "clamp(12px,3vw,20px)",
        zIndex: 200,
        width: "min(calc(100vw - 24px), 580px)",
        boxSizing: "border-box",
        background: cbm("base", 0.94),
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(245,242,237,0.14)",
        padding: "10px 12px 10px 14px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "8px 16px",
        boxShadow: "0 18px 44px -12px rgba(0,0,0,0.8)",
      }}
    >
      <p
        style={{
          flex: "1 1 230px",
          margin: 0,
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 400,
          fontSize: 13,
          lineHeight: 1.45,
          color: cbm("gray-200"),
        }}
      >
        Usamos cookies para medir o uso do site.{" "}
        <Link
          href={PRIVACY_PATH}
          aria-label="Política de privacidade"
          className="focus-signal"
          style={{
            color: "#F5F2ED",
            textDecoration: "underline",
            textDecorationColor: "#FB3640",
            textUnderlineOffset: 3,
          }}
        >
          Privacidade
        </Link>
      </p>

      <div style={{ flex: "1 1 200px", display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => decide("granted")}
          style={{
            flex: 1,
            minHeight: 44,
            background: "rgba(245,242,237,0.94)",
            color: cbm("base"),
            border: "1px solid rgba(245,242,237,0.94)",
            borderRadius: 0,
            padding: "0 14px",
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => decide("denied")}
          style={{
            flex: 1,
            minHeight: 44,
            background: "transparent",
            color: "#F5F2ED",
            border: "1px solid rgba(245,242,237,0.38)",
            borderRadius: 0,
            padding: "0 14px",
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Recusar
        </button>
      </div>
    </div>
  );
}
