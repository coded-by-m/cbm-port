"use client";

import type { ReactNode } from "react";
import { useCampaignHref } from "@/components/lp/LpCta";
import { FillButton } from "@/components/ui/FillButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * O CTA da landing `/criacao-de-sites`: um só tipo de ação, repetido.
 *
 * O ícone diz o canal sem alongar o rótulo, e o rótulo cabe em uma linha em
 * 390px (a versão anterior quebrava em três). `id` vira `data-cm-cta`
 * (evento `cta_click`) e `data-cm-id` (o "onde" do `whatsapp_click`): são
 * duas etapas do funil, medidas separadas pelo listener de `Analytics`.
 */
export function WaCta({
  id,
  message,
  label,
  shortLabel,
  size = "lg",
  full = false,
  wrap = false,
}: {
  id: string;
  message: string;
  label: string;
  /** Rótulo visível abaixo de 480px, quando o espaço é curto (cabeçalho). */
  shortLabel?: string;
  size?: "lg" | "sm";
  full?: boolean;
  /** Rótulo longo: deixa quebrar em duas linhas. */
  wrap?: boolean;
}) {
  const href = useCampaignHref(message);

  return (
    <FillButton
      href={href}
      target="_blank"
      size={size}
      full={full}
      className={["cs-cta", wrap ? "cs-cta--wrap" : "", shortLabel ? "cs-cta--short" : ""].filter(Boolean).join(" ")}
      aria-label={shortLabel ? `${label} pelo WhatsApp (abre em nova aba)` : undefined}
      data-cm-role="whatsapp"
      data-cm-id={id}
      data-cm-cta={id}
    >
      <span className="cs-cta-in">
        <WhatsAppIcon />
        <span>
          <span className="cs-cta-long">{label}</span>
          {shortLabel && <span className="cs-cta-short">{shortLabel}</span>}
          <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
        </span>
      </span>
    </FillButton>
  );
}

/** O mesmo destino, como link de texto (número no contato e no rodapé). */
export function WaLink({ id, message, children }: { id: string; message: string; children: ReactNode }) {
  const href = useCampaignHref(message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cs-link"
      data-cm-role="whatsapp"
      data-cm-id={id}
    >
      {children}
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}
