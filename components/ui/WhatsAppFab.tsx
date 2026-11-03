"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/contact";
import { cbm } from "@/lib/palette";
import { MeshButton } from "@/components/ui/MeshButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Botão flutuante de WhatsApp — contato sempre a um toque, em todas as páginas.
 *
 * Fica no canto inferior-direito, fixo. Aparece com um fade suave logo no início
 * (sem competir com a construção cinematográfica da marca). Linguagem da marca:
 * pílula angular escura, glifo do WhatsApp, acento vermelho no hover.
 * z-40 → fica sob o painel de wipe (z-50) das transições da Home.
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Fora da home e da experiencia. Na experiencia o botao flutuante estragaria
  // justamente a peca que deveria impressionar; na home ele disputava o rodape
  // com o banner de consentimento e o CTA — e o header ja tem contato fixo.
  if (
    pathname === "/" ||
    pathname?.startsWith("/experiencia") ||
    // Landing de campanha tem CTA proprio, repetido: um botao flutuante de
    // contato ao lado dele disputa a mesma acao e dilui as duas.
    pathname?.startsWith("/lp") ||
    // As rotas /posts são telas de export (carrosséis) — sem chrome do site.
    pathname?.startsWith("/posts")
  )
    return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-[transform,opacity] duration-300"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      <MeshButton
        label="WhatsApp"
        size="sm"
        showArrow={false}
        lead={<WhatsAppIcon />}
        href={waLink()}
        target="_blank"
        data-cursor="triangle"
        data-cm-role="whatsapp"
        data-cm-id="floating-whatsapp"
        aria-label="Falar no WhatsApp"
        style={{ background: cbm("card", 0.95) }}
      />
    </div>
  );
}
