"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, getConsent, setConsent } from "@/lib/analytics";
import { PRIVACY_PATH } from "@/data/privacidade";

/**
 * Faixa de consentimento (LGPD), presa no rodapé da tela.
 *
 * "Aceitar" libera GA4, Google Ads e Meta Pixel. "Recusar", ou não
 * responder, deixa esses scripts fora da página. O Coded Insights não
 * entra aqui: não usa cookie e não recebe dado pessoal.
 *
 * A faixa nasce no HTML. O script do layout marca `data-consent` antes da
 * pintura, e o CSS esconde a faixa quando a escolha já existe, sem flash.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (getConsent() !== null) setVisible(false);
    const hide = () => setVisible(false);
    window.addEventListener(CONSENT_EVENT, hide);
    return () => window.removeEventListener(CONSENT_EVENT, hide);
  }, []);

  if (pathname?.startsWith("/posts")) return null;
  if (!visible) return null;

  const decide = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      className="cbm-cookie"
      role="dialog"
      aria-label="Consentimento de cookies"
    >
      <p>
        Usamos cookies para medir o uso do site. Você decide.{" "}
        <Link href={PRIVACY_PATH}>Política de privacidade</Link>
      </p>
      <div className="cbm-cookie-actions">
        <button type="button" className="cbm-cookie-accept" onClick={() => decide("granted")}>
          Aceitar
        </button>
        <button type="button" className="cbm-cookie-deny" onClick={() => decide("denied")}>
          Recusar
        </button>
      </div>
    </div>
  );
}
