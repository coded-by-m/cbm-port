"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getConsent, setConsent } from "@/lib/analytics";
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
  const pathname = usePathname();

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
  }, []);

  // As rotas /posts são telas de export (carrosséis) — sem chrome do site.
  if (pathname?.startsWith("/posts")) return null;
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
        width: "min(calc(100vw - 24px), 380px)",
        boxSizing: "border-box",
        background: cbm("base", 0.94),
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(245,242,237,0.14)",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "0 18px 44px -12px rgba(0,0,0,0.8)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 300,
          fontSize: 13,
          lineHeight: 1.6,
          color: cbm("gray-300"),
        }}
      >
        Usamos cookies para medir o desempenho do site e entender como ele é
        usado. Você decide.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
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
            padding: "0 18px",
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
            padding: "0 18px",
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
