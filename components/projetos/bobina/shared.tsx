"use client";

import Link from "next/link";
import { waLink } from "@/lib/contact";
import { TriArrow } from "@/components/ui/TriArrow";
import { useFromCard } from "@/components/projetos/FromCard";
import { CARD_WA_MESSAGE, PORTFOLIO_WA_MESSAGE } from "@/data/projetos";

export interface BbShot {
  src: string;
  w: number;
  h: number;
}

/** Um dos outros sites, na lista "ver mais". */
export interface BbOther {
  slug: string;
  title: string;
  concept: boolean;
  setor: string;
  thumb: string;
}

export interface BbProject {
  slug: string;
  title: string;
  concept: boolean;
  setor: string;
  ano: string;
  line: string;
  siteUrl?: string;
  tall: BbShot;
  top: BbShot;
}

/** "Conceitual" vem sempre escrito; cliente real diz que está no ar. */
export function status(p: { concept: boolean }) {
  return p.concept ? "Estudo conceitual" : "Cliente · no ar";
}

export function siteHref(p: BbProject) {
  return p.siteUrl ? `https://${p.siteUrl}` : undefined;
}

function Mark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="bb-mark-tri">
      <path
        d="M8 1.8 14.6 13.9H1.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function BbHeader() {
  const fromCard = useFromCard();
  return (
    <header className="bb-header">
      <Link href="/" className="bb-mark" aria-label="Coded by M, início">
        <Mark />
        <span>Coded by M</span>
      </Link>
      <a
        className="bb-header-wa"
        href={waLink(fromCard ? CARD_WA_MESSAGE : PORTFOLIO_WA_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        data-cm-role="whatsapp"
        data-cm-id={
          fromCard
            ? "projetos-cartao-header-whatsapp"
            : "projetos-header-whatsapp"
        }
      >
        WhatsApp <TriArrow dir="up-right" />
      </a>
    </header>
  );
}

/** A primeira frase. Vindo do cartão, quem fala é o Matheus. */
export function BbLead({ className = "" }: { className?: string }) {
  const fromCard = useFromCard();
  return (
    <div className={`bb-lead ${className}`}>
      <h1 className="bb-h1">
        {fromCard ? (
          <>
            Oi, sou o Matheus. <span>Esses sites eu fiz.</span>
          </>
        ) : (
          <>
            Três sites que eu fiz <span>do zero.</span>
          </>
        )}
      </h1>
      <p className="bb-sub">
        {fromCard
          ? "A Coded by M é meu estúdio"
          : "Sou o Matheus, da Coded by M,"}{" "}
        em Florianópolis. Desenho e programo sites e landing pages sob medida,
        sem template.
      </p>
    </div>
  );
}

export function BbContact({ compact = false }: { compact?: boolean }) {
  const fromCard = useFromCard();
  return (
    <div className={`bb-contact${compact ? " is-compact" : ""}`}>
      <a
        className="bb-btn is-primary"
        href={waLink(fromCard ? CARD_WA_MESSAGE : PORTFOLIO_WA_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        data-cm-role="whatsapp"
        data-cm-id={
          fromCard ? "projetos-cartao-whatsapp" : "projetos-closing-whatsapp"
        }
      >
        Chamar no WhatsApp <TriArrow dir="up-right" />
      </a>
      <a
        className="bb-btn"
        href="/contato.vcf"
        data-cm-role="secondary-cta"
        data-cm-id={
          fromCard ? "projetos-cartao-vcard" : "projetos-closing-vcard"
        }
      >
        Salvar contato
      </a>
    </div>
  );
}

export function BbClosing() {
  return (
    <section className="bb-closing" data-cm-section="projetos-closing">
      <h2 className="bb-closing-h">
        Quando for a vez do seu, <span>me chama.</span>
      </h2>
      <p className="bb-sub">
        Você fala direto comigo, do orçamento à entrega. Tem contrato, nota
        fiscal e dá pra parcelar.
      </p>
      <BbContact />
      <Link href="/" className="bb-more">
        Conhecer o estúdio <TriArrow />
      </Link>
    </section>
  );
}

export function ProjectLinks({ p }: { p: BbProject }) {
  const href = siteHref(p);
  return (
    <div className="bb-links">
      <Link
        href={`/cases/${p.slug}`}
        className="bb-link"
        data-cm-role="secondary-cta"
        data-cm-id={`case-${p.slug}`}
      >
        Ver como foi feito <TriArrow />
      </Link>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bb-link is-quiet"
          data-cm-role="outbound"
          data-cm-id={`site-${p.slug}`}
        >
          Visitar o site <TriArrow dir="up-right" />
        </a>
      )}
    </div>
  );
}
