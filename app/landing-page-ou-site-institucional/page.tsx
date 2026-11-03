import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT } from "@/data/about";
import {
  LP_OU_COMO,
  LP_OU_COMO_HEADING,
  LP_OU_CRUMB,
  LP_OU_CTA,
  LP_OU_CTA_HREF,
  LP_OU_DATE,
  LP_OU_DESCRIPTION,
  LP_OU_FAQ,
  LP_OU_H1,
  LP_OU_INST_HEADING,
  LP_OU_INST_ITEMS,
  LP_OU_INST_MORE,
  LP_OU_LEAD,
  LP_OU_LP_HEADING,
  LP_OU_LP_ITEMS,
  LP_OU_LP_MORE,
  LP_OU_MIGRAR,
  LP_OU_MIGRAR_HEADING,
  LP_OU_PATH,
  LP_OU_ROWS,
  LP_OU_TABLE_COLS,
  LP_OU_TABLE_HEADING,
  LP_OU_TABLE_NOTE,
  LP_OU_TITLE,
  type CopyPart,
} from "@/data/landingOuInstitucional";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_H3, PROSE_LINK, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  OG,
  OG_SIZE,
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  graph,
  webPageSchema,
} from "@/lib/seo";
import { FillButton } from "@/components/ui/FillButton";
import { cbm } from "@/lib/palette";

const LIST: CSSProperties = {
  ...PROSE_P,
  paddingLeft: "1.25em",
};

export const metadata: Metadata = {
  title: { absolute: LP_OU_TITLE },
  description: LP_OU_DESCRIPTION,
  alternates: { canonical: LP_OU_PATH },
  openGraph: {
    type: "article",
    locale: "pt_BR",
    siteName: "Coded by M",
    url: LP_OU_PATH,
    title: LP_OU_TITLE,
    description: LP_OU_DESCRIPTION,
    publishedTime: LP_OU_DATE,
    modifiedTime: LP_OU_DATE,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M, estúdio de web design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: LP_OU_TITLE,
    description: LP_OU_DESCRIPTION,
    images: [OG.home],
  },
};

function Copy({ parts, waId }: { parts: readonly CopyPart[]; waId?: string }) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.text}</span>;
        const wa = part.href.startsWith("https://wa.me/");
        return (
          <a
            key={i}
            href={part.href}
            style={PROSE_LINK}
            {...(wa
              ? {
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "data-cm-role": "whatsapp",
                  "data-cm-id": waId ?? "lp-ou-institucional-whatsapp",
                }
              : {})}
          >
            {part.label}
          </a>
        );
      })}
    </>
  );
}

/**
 * Artigo de comparação na raiz. O grafo segue o artigo de critérios:
 * WebPage, Article (autor = #founder), FAQPage do mesmo array visível e
 * BreadcrumbList. Server component: o HTML sai pronto, sem depender de JS.
 */
export default function LandingOuInstitucionalPage() {
  const published = LP_OU_DATE.split("-").reverse().join("/");

  return (
    <ProseShell label="Guia" current={LP_OU_PATH}>
      <JsonLd
        data={graph(
          webPageSchema({
            path: LP_OU_PATH,
            name: LP_OU_TITLE,
            description: LP_OU_DESCRIPTION,
          }),
          articleSchema({
            path: LP_OU_PATH,
            title: LP_OU_H1,
            description: LP_OU_DESCRIPTION,
            datePublished: LP_OU_DATE,
            dateModified: LP_OU_DATE,
          }),
          faqPageSchema(LP_OU_PATH, LP_OU_FAQ),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: LP_OU_CRUMB, path: LP_OU_PATH },
          ]),
        )}
      />
      <article>
        <nav
          aria-label="Trilha"
          style={{
            ...PROSE_P,
            marginTop: 0,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: cbm("gray-400"),
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Início
          </Link>
          <span aria-hidden style={{ margin: "0 10px", color: "#FB3640" }}>
            /
          </span>
          <span>{LP_OU_CRUMB}</span>
        </nav>

        <h1 style={{ ...PROSE_H1, marginTop: 22 }}>{LP_OU_H1}</h1>
        <p
          style={{
            ...PROSE_P,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: cbm("gray-400"),
          }}
        >
          {ABOUT.founder.name}
          {" · "}
          <time dateTime={LP_OU_DATE}>{published}</time>
        </p>
        <p style={{ ...PROSE_P, color: cbm("gray-100") }}>{LP_OU_LEAD}</p>

        <h2 style={PROSE_H2}>{LP_OU_TABLE_HEADING}</h2>
        <div className="site-price-scroll">
          <table className="site-price-table site-choice-table">
            <caption className="sr-only">{LP_OU_TABLE_HEADING}</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Critério</span>
                </th>
                {LP_OU_TABLE_COLS.map((col) => (
                  <th key={col} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LP_OU_ROWS.map((row) => (
                <tr key={row.criterio}>
                  <td data-label="">{row.criterio}</td>
                  <td data-label={LP_OU_TABLE_COLS[0]}>
                    <Copy parts={row.landing} />
                  </td>
                  <td data-label={LP_OU_TABLE_COLS[1]}>
                    <Copy parts={row.institucional} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={PROSE_P}>
          <Copy parts={LP_OU_TABLE_NOTE} />
        </p>

        <h2 style={PROSE_H2}>{LP_OU_LP_HEADING}</h2>
        <ul style={{ ...LIST, listStyle: "disc" }}>
          {LP_OU_LP_ITEMS.map((item) => (
            <li key={item} style={{ marginTop: 8 }}>
              {item}
            </li>
          ))}
        </ul>
        <p style={PROSE_P}>
          <Copy parts={LP_OU_LP_MORE} />
        </p>

        <h2 style={PROSE_H2}>{LP_OU_INST_HEADING}</h2>
        <ul style={{ ...LIST, listStyle: "disc" }}>
          {LP_OU_INST_ITEMS.map((item) => (
            <li key={item} style={{ marginTop: 8 }}>
              {item}
            </li>
          ))}
        </ul>
        <p style={PROSE_P}>
          <Copy parts={LP_OU_INST_MORE} />
        </p>

        <h2 style={PROSE_H2}>{LP_OU_MIGRAR_HEADING}</h2>
        <p style={PROSE_P}>{LP_OU_MIGRAR}</p>

        <h2 style={PROSE_H2}>{LP_OU_COMO_HEADING}</h2>
        <p style={PROSE_P}>{LP_OU_COMO}</p>
        <FillButton
          href={LP_OU_CTA_HREF}
          target="_blank"
          data-cm-role="whatsapp"
          data-cm-id="lp-ou-institucional-whatsapp-cta"
          style={{ marginTop: 28 }}
        >
          {LP_OU_CTA}
        </FillButton>

        <section>
          <h2 style={PROSE_H2}>Perguntas frequentes</h2>
          {LP_OU_FAQ.map((item) => (
            <div key={item.q}>
              <h3 style={PROSE_H3}>{item.q}</h3>
              <p style={{ ...PROSE_P, marginTop: 8 }}>{item.a}</p>
            </div>
          ))}
        </section>
      </article>
    </ProseShell>
  );
}
