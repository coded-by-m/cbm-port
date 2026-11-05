"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { waLink } from "@/lib/contact";
import { messageWithCampaign, readCampaign } from "@/lib/campaign";
import { FillButton } from "@/components/ui/FillButton";

/**
 * Link do WhatsApp com a origem da campanha na mensagem. Sem isso o lead chega
 * anônimo e não dá pra saber qual anúncio pagou por ele.
 *
 * A leitura da URL acontece em `useEffect` de propósito: no servidor não há
 * `location`, e ler durante a renderização quebraria a hidratação.
 */
function useCampaignHref(message: string) {
  const [href, setHref] = useState(() => waLink(message));

  useEffect(() => {
    const campaign = readCampaign(window.location.search);
    setHref(waLink(messageWithCampaign(message, campaign)));
  }, [message]);

  return href;
}

/**
 * O CTA da landing, em três tamanhos. O evento de conversão sai pelo listener
 * global do `Analytics`, com `source` como `location`.
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
  const href = useCampaignHref(message);

  return (
    <FillButton
      href={href}
      target="_blank"
      size={size}
      data-cm-role="whatsapp"
      data-cm-id={source}
    >
      {label}
    </FillButton>
  );
}

/** O mesmo destino do CTA, como link de texto. */
export function LpWaLink({
  message,
  source,
  style,
  children,
}: {
  message: string;
  source: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const href = useCampaignHref(message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cm-role="whatsapp"
      data-cm-id={source}
      className="site-footer-link"
      style={style}
    >
      {children}
    </a>
  );
}
