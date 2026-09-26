"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/contact";
import { SURFACE } from "@/components/site/shared";

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
    pathname?.startsWith("/lp")
  )
    return null;

  const isHome = false;

  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="triangle"
      data-cm-role="whatsapp"
      data-cm-id="floating-whatsapp"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 border px-5 py-3.5 text-[#F5F2ED] shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-[transform,opacity,border-color] duration-300 hover:border-[#FB3640] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FB3640]"
      style={{
        background: isHome ? "rgba(7,12,9,0.95)" : "rgba(14,24,16,0.95)",
        borderColor: isHome ? "#111511" : "#1a2a1e",
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="text-[#FB3640] transition-transform duration-300 group-hover:scale-110"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span
        className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
        style={{ fontFamily: '"Panchang", sans-serif' }}
      >
        WhatsApp
      </span>
    </a>
  );
}
