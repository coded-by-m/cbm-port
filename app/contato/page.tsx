import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CONTATO_DESCRIPTION,
  CONTATO_FAQ,
  CONTATO_H1,
  CONTATO_INVESTIMENTO,
  CONTATO_LEAD,
  CONTATO_MENSAGEM,
  CONTATO_MENSAGEM_INTRO,
  CONTATO_ONDE,
  CONTATO_TITLE,
} from "@/data/contato";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_H3, PROSE_LINK, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { PANCHANG, SURFACE } from "@/components/site/shared";
import {
  GOOGLE_MAPS_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/contact";
import { OG, OG_SIZE, ORG_ID, breadcrumbSchema, faqPageSchema, graph, webPageSchema } from "@/lib/seo";

/** wa.me sem texto pré-preenchido: é o href publicado no copy. */
const WA = `https://wa.me/${WHATSAPP_NUMBER}`;

const LIST: CSSProperties = {
  ...PROSE_P,
  paddingLeft: "1.25em",
};

export const metadata: Metadata = {
  title: { absolute: CONTATO_TITLE },
  description: CONTATO_DESCRIPTION,
  alternates: { canonical: "/contato" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Coded by M",
    url: "/contato",
    title: CONTATO_TITLE,
    description: CONTATO_DESCRIPTION,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M, estúdio de web design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: CONTATO_TITLE,
    description: CONTATO_DESCRIPTION,
    images: [OG.home],
  },
};

/**
 * Contato. NAP (WhatsApp, Maps, Instagram) vem de `lib/contact.ts`.
 * O FAQ visível e o FAQPage usam `CONTATO_FAQ`.
 */
export default function ContatoPage() {
  return (
    <ProseShell label="Contato" current="/contato">
      <JsonLd
        data={graph(
          {
            ...webPageSchema({
              path: "/contato",
              name: CONTATO_TITLE,
              description: CONTATO_DESCRIPTION,
              type: "ContactPage",
            }),
            mainEntity: { "@id": ORG_ID },
          },
          faqPageSchema("/contato", CONTATO_FAQ),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Contato", path: "/contato" },
          ]),
        )}
      />
      <div data-cm-section="contact">
        <h1 style={PROSE_H1}>{CONTATO_H1}</h1>
        <p style={{ ...PROSE_P, color: "#E8E4DE" }}>{CONTATO_LEAD}</p>

        <h2 style={PROSE_H2}>Canais</h2>
        <ul style={{ ...LIST, listStyle: "disc" }}>
          <li style={{ marginTop: 8 }}>
            {"WhatsApp: "}
            <a href={WA} target="_blank" rel="noopener noreferrer" style={PROSE_LINK} data-cm-role="whatsapp" data-cm-id="contato-whatsapp">
              {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li style={{ marginTop: 8 }}>
            {"Google Maps: "}
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" style={PROSE_LINK}>
              Coded by M no Maps
            </a>
          </li>
          <li style={{ marginTop: 8 }}>
            {"Instagram: "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={PROSE_LINK}>
              {INSTAGRAM_HANDLE}
            </a>
          </li>
        </ul>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="site-cta"
          data-cm-role="whatsapp"
          data-cm-id="contato-whatsapp-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: 28,
            background: "#FB3640",
            color: SURFACE.base,
            padding: "18px 32px",
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Chamar no WhatsApp
        </a>

        <h2 style={PROSE_H2}>Onde atendo</h2>
        <p style={PROSE_P}>{CONTATO_ONDE}</p>

        <h2 style={PROSE_H2}>O que mandar na primeira mensagem</h2>
        <p style={PROSE_P}>{CONTATO_MENSAGEM_INTRO}</p>
        <ol style={{ ...LIST, listStyle: "decimal" }}>
          {CONTATO_MENSAGEM.map((item) => (
            <li key={item} style={{ marginTop: 8 }}>
              {item}
            </li>
          ))}
        </ol>

        <h2 style={PROSE_H2}>Investimento</h2>
        <p style={PROSE_P}>
          {CONTATO_INVESTIMENTO}{" "}
          <Link href="/landing-page" style={PROSE_LINK}>
            Landing page
          </Link>
          {" e "}
          <Link href="/site-institucional" style={PROSE_LINK}>
            Site institucional
          </Link>
          .
        </p>

        <p style={{ ...PROSE_P, marginTop: 48 }}>
          <Link href="/sobre" style={PROSE_LINK}>
            Sobre o estúdio
          </Link>
          {" · "}
          <Link href="/projetos" style={PROSE_LINK}>
            Projetos
          </Link>
        </p>

        <section>
          <h2 style={PROSE_H2}>Perguntas frequentes</h2>
          {CONTATO_FAQ.map((item) => (
            <div key={item.q}>
              <h3 style={PROSE_H3}>{item.q}</h3>
              <p style={{ ...PROSE_P, marginTop: 8 }}>{item.a}</p>
            </div>
          ))}
        </section>
      </div>
    </ProseShell>
  );
}
