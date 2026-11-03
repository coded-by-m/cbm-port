import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT } from "@/data/about";
import {
  ESCOLHER_CHECKLIST_HEADING,
  ESCOLHER_CRUMB,
  ESCOLHER_CRITERIOS,
  ESCOLHER_CTA,
  ESCOLHER_CTA_HREF,
  ESCOLHER_DATE,
  ESCOLHER_DESCRIPTION,
  ESCOLHER_FAQ,
  ESCOLHER_H1,
  ESCOLHER_LEAD,
  ESCOLHER_PATH,
  ESCOLHER_PROXIMO,
  ESCOLHER_PROXIMO_HEADING,
  ESCOLHER_ROWS,
  ESCOLHER_TABLE_COLS,
  ESCOLHER_TABLE_HEADING,
  ESCOLHER_TITLE,
  type CopyPart,
} from "@/data/comoEscolherEmpresa";
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

const STRONG = { color: "#F5F2ED", fontWeight: 600 } as const;

export const metadata: Metadata = {
  title: { absolute: ESCOLHER_TITLE },
  description: ESCOLHER_DESCRIPTION,
  alternates: { canonical: ESCOLHER_PATH },
  openGraph: {
    type: "article",
    locale: "pt_BR",
    siteName: "Coded by M",
    url: ESCOLHER_PATH,
    title: ESCOLHER_TITLE,
    description: ESCOLHER_DESCRIPTION,
    publishedTime: ESCOLHER_DATE,
    modifiedTime: ESCOLHER_DATE,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M, estúdio de web design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: ESCOLHER_TITLE,
    description: ESCOLHER_DESCRIPTION,
    images: [OG.home],
  },
};

function Copy({ parts, waId }: { parts: readonly CopyPart[]; waId?: string }) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.text}</span>;
        if (part.type === "external") {
          const wa = part.href.startsWith("https://wa.me/");
          return (
            <a
              key={i}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              style={PROSE_LINK}
              {...(wa
                ? { "data-cm-role": "whatsapp", "data-cm-id": waId ?? "escolher-whatsapp" }
                : {})}
            >
              {part.label}
            </a>
          );
        }
        return (
          <Link key={i} href={part.href} style={PROSE_LINK}>
            {part.label}
          </Link>
        );
      })}
    </>
  );
}

/**
 * Artigo de critérios na raiz. O grafo segue o artigo de preço: WebPage,
 * Article (autor = #founder), FAQPage do mesmo array visível e BreadcrumbList.
 * Server component: o HTML sai pronto, sem depender de JS no cliente.
 */
export default function ComoEscolherEmpresaPage() {
  const published = ESCOLHER_DATE.split("-").reverse().join("/");

  return (
    <ProseShell label="Guia" current={ESCOLHER_PATH}>
      <JsonLd
        data={graph(
          webPageSchema({
            path: ESCOLHER_PATH,
            name: ESCOLHER_TITLE,
            description: ESCOLHER_DESCRIPTION,
          }),
          articleSchema({
            path: ESCOLHER_PATH,
            title: ESCOLHER_H1,
            description: ESCOLHER_DESCRIPTION,
            datePublished: ESCOLHER_DATE,
            dateModified: ESCOLHER_DATE,
          }),
          faqPageSchema(ESCOLHER_PATH, ESCOLHER_FAQ),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: ESCOLHER_CRUMB, path: ESCOLHER_PATH },
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
          <span>{ESCOLHER_CRUMB}</span>
        </nav>

        <h1 style={{ ...PROSE_H1, marginTop: 22 }}>{ESCOLHER_H1}</h1>
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
          <time dateTime={ESCOLHER_DATE}>{published}</time>
        </p>
        <p style={{ ...PROSE_P, color: cbm("gray-100") }}>{ESCOLHER_LEAD}</p>

        <h2 style={PROSE_H2}>{ESCOLHER_CHECKLIST_HEADING}</h2>
        {ESCOLHER_CRITERIOS.map((item) => (
          <section key={item.title}>
            <h3 style={PROSE_H3}>{item.title}</h3>
            <p style={PROSE_P}>{item.body}</p>
            <p style={PROSE_P}>
              <strong style={STRONG}>Como verificar:</strong>
              {` ${item.verificar}`}
            </p>
          </section>
        ))}

        <h2 style={PROSE_H2}>{ESCOLHER_TABLE_HEADING}</h2>
        <div className="site-price-scroll">
          <table className="site-price-table site-compare-table">
            <caption className="sr-only">{ESCOLHER_TABLE_HEADING}</caption>
            <thead>
              <tr>
                {ESCOLHER_TABLE_COLS.map((col) => (
                  <th key={col} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ESCOLHER_ROWS.map((row) => (
                <tr key={row.criterio}>
                  <td data-label={ESCOLHER_TABLE_COLS[0]}>{row.criterio}</td>
                  <td data-label={ESCOLHER_TABLE_COLS[1]}>
                    <Copy parts={row.parts} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={PROSE_H2}>{ESCOLHER_PROXIMO_HEADING}</h2>
        <p style={PROSE_P}>
          <Copy parts={ESCOLHER_PROXIMO} waId="escolher-whatsapp" />
        </p>
        <FillButton
          href={ESCOLHER_CTA_HREF}
          target="_blank"
          data-cm-role="whatsapp"
          data-cm-id="escolher-whatsapp-cta"
          style={{ marginTop: 28 }}
        >
          {ESCOLHER_CTA}
        </FillButton>

        <section>
          <h2 style={PROSE_H2}>Perguntas frequentes</h2>
          {ESCOLHER_FAQ.map((item) => (
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

