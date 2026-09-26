"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/contact";
import { trackLead } from "@/lib/analytics";
import { messageWithCampaign, readCampaign } from "@/lib/campaign";
import { PANCHANG, SURFACE } from "@/components/site/shared";

/**
 * O único CTA da landing, em três tamanhos.
 *
 * Faz duas coisas que o link cru não faz: dispara o evento de conversão antes
 * de sair, e anexa a origem da campanha à mensagem — sem isso o lead chega
 * anônimo e não dá pra saber qual anúncio pagou por ele.
 *
 * A leitura da URL acontece em `useEffect` de propósito: no servidor não há
 * `location`, e ler durante a renderização quebraria a hidratação.
 */
export function LpCta({
  label,
  message,
  size = "md",
  source,
}: {
  label: string;
  message: string;
  size?: "sm" | "md" | "lg";
  source: string;
}) {
  const [href, setHref] = useState(() => waLink(message));

  useEffect(() => {
    const campaign = readCampaign(window.location.search);
    setHref(waLink(messageWithCampaign(message, campaign)));
  }, [message]);

  const pad =
    size === "lg" ? "22px 44px" : size === "sm" ? "13px 22px" : "18px 32px";
  const font = size === "lg" ? 15 : size === "sm" ? 11 : 13;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="site-cta"
      data-cm-role="whatsapp"
      data-cm-id={source}
      onClick={() => trackLead(source)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FB3640",
        color: SURFACE.base,
        padding: pad,
        fontFamily: PANCHANG,
        fontWeight: 700,
        fontSize: font,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textAlign: "center",
        textDecoration: "none",
        transition: "background 150ms ease",
      }}
    >
      {label}
    </a>
  );
}
