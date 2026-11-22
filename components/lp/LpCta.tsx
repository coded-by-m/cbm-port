"use client";

import { useEffect, useState } from "react";
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
export function useCampaignHref(message: string) {
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
