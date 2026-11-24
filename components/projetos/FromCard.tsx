"use client";

import { useEffect, useState, type ReactNode } from "react";
import { waLink } from "@/lib/contact";
import { TriArrow } from "@/components/ui/TriArrow";
import { CARD_WA_MESSAGE, PORTFOLIO_WA_MESSAGE } from "@/data/projetos";

const KEY = "cbm:cartao";

/**
 * A pessoa chegou pelo QR do cartão impresso?
 *
 * O QR aponta pra `/projetos?utm_source=cartao&utm_medium=print`. A marca
 * fica na sessão, pra saudação continuar quando ela abre um case e volta.
 * Começa `false` (é o que o servidor renderiza) e só liga depois de hidratar:
 * a página continua estática e quem vem do Google nunca vê a troca.
 */
export function useFromCard() {
  const [fromCard, setFromCard] = useState(false);
  useEffect(() => {
    const viaUrl = new URLSearchParams(window.location.search).get("utm_source") === "cartao";
    let viaSession = false;
    try {
      if (viaUrl) sessionStorage.setItem(KEY, "1");
      viaSession = sessionStorage.getItem(KEY) === "1";
    } catch {
      // Armazenamento bloqueado (aba anônima etc.): vale só a URL.
    }
    if (viaUrl || viaSession) setFromCard(true);
  }, []);
  return fromCard;
}

/** Texto que troca pra versão do cartão. Sem cartão, fica o texto padrão. */
export function CardText({ card, children }: { card: string; children: ReactNode }) {
  return <>{useFromCard() ? card : children}</>;
}

/**
 * O par de contato da abertura: WhatsApp e "Salvar contato" (vCard).
 *
 * Vindo do cartão, a mensagem do WhatsApp diz isso, e o `data-cm-id` muda,
 * pra o tracker separar quem chegou pelo impresso.
 */
export function OpeningContact() {
  const fromCard = useFromCard();
  return (
    <div className="pi-contact">
      <a
        href={waLink(fromCard ? CARD_WA_MESSAGE : PORTFOLIO_WA_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="pi-contact-btn is-primary"
        data-cm-role="whatsapp"
        data-cm-id={fromCard ? "projetos-cartao-whatsapp" : "projetos-opening-whatsapp"}
      >
        WhatsApp <TriArrow dir="up-right" />
      </a>
      <a
        href="/contato.vcf"
        className="pi-contact-btn"
        data-cm-role="secondary-cta"
        data-cm-id={fromCard ? "projetos-cartao-vcard" : "projetos-opening-vcard"}
      >
        Salvar contato
      </a>
    </div>
  );
}
