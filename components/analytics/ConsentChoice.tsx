"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentValue } from "@/lib/analytics";
import { PANCHANG, SATOSHI } from "@/components/site/shared";
import { cbm } from "@/lib/palette";

const STATUS: Record<ConsentValue | "none", string> = {
  granted: "Sua escolha atual: cookies aceitos.",
  denied: "Sua escolha atual: cookies recusados.",
  none: "Você ainda não escolheu.",
};

const BUTTON: React.CSSProperties = {
  minHeight: 44,
  padding: "0 18px",
  background: "transparent",
  color: "#F5F2ED",
  border: "1px solid rgba(245,242,237,0.38)",
  borderRadius: 0,
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
};

/**
 * Muda a escolha de cookies depois de decidida. A recusa recarrega a página:
 * scripts já carregados só saem assim.
 */
export function ConsentChoice() {
  const [consent, setState] = useState<ConsentValue | null>(null);

  useEffect(() => setState(getConsent()), []);

  const decide = (value: ConsentValue) => {
    setConsent(value);
    setState(value);
    if (value === "denied") window.location.reload();
  };

  return (
    <div style={{ marginTop: 18 }}>
      <p
        aria-live="polite"
        style={{ margin: 0, fontFamily: SATOSHI, fontSize: 15, color: cbm("gray-200") }}
      >
        {STATUS[consent ?? "none"]}
      </p>
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" onClick={() => decide("granted")} style={BUTTON}>
          Aceitar cookies
        </button>
        <button type="button" onClick={() => decide("denied")} style={BUTTON}>
          Recusar cookies
        </button>
      </div>
    </div>
  );
}
