"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/analytics";

/**
 * Banner de consentimento de cookies (LGPD) — no design system da marca.
 *
 * Aparece só quando não há decisão salva. "Aceitar" libera GA4 + Meta Pixel
 * (via setConsent → Analytics reage e carrega os scripts); "Recusar" bloqueia.
 * Linguagem angular (border-radius 0), fundo #000F08, acento vermelho raro.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
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
        left: 16,
        bottom: 16,
        zIndex: 200,
        maxWidth: 460,
        background: "#0E1810",
        border: "1px solid #1a2a1e",
        borderLeft: "2px solid #FB3640",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 300,
          fontSize: 14,
          lineHeight: 1.6,
          color: "#C8C4BE",
        }}
      >
        Usamos cookies para medir o desempenho do site e entender como ele é
        usado. Você decide.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={() => decide("granted")}
          style={{
            background: "#FB3640",
            color: "#000F08",
            border: "none",
            borderRadius: 0,
            padding: "11px 22px",
            fontFamily: "Panchang, sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.15em",
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
            background: "transparent",
            color: "#F5F2ED",
            border: "1px solid #2a4a32",
            borderRadius: 0,
            padding: "11px 22px",
            fontFamily: "Panchang, sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.15em",
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
