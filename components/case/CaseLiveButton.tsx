"use client";

import { MeshButton } from "@/components/ui/MeshButton";

/**
 * CTA principal do fim do case — abre o SITE AO VIVO do projeto em nova aba,
 * usando o MeshButton (botão principal do DS). `url` é o domínio (com ou sem
 * protocolo); normaliza pra https.
 */
export function CaseLiveButton({
  url,
  label = "Ver o site no ar",
  cmId = "case-live-site",
}: {
  url: string;
  label?: string;
  /** Token do Coded Insights: distingue cada posição do botão. */
  cmId?: string;
}) {
  const href = url.startsWith("http") ? url : `https://${url}`;
  return (
    <MeshButton
      label={label}
      aria-label={`Abrir o site ${url} em nova aba`}
      data-cm-role="secondary-cta"
      data-cm-id={cmId}
      onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
    />
  );
}
