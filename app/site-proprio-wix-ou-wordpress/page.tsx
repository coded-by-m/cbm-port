import type { CSSProperties } from "react";
import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT } from "@/data/about";
import { faqAnswerSegments } from "@/data/servicePages";
import {
  SITE_PROPRIO_CASO,
  SITE_PROPRIO_CASO_HEADING,
  SITE_PROPRIO_CONTRATAR,
  SITE_PROPRIO_CONTROLE_CODIGO,
  SITE_PROPRIO_CONTROLE_HEADING,
  SITE_PROPRIO_CONTROLE_WIX,
  SITE_PROPRIO_CONTROLE_WP,
  SITE_PROPRIO_CRUMB,
  SITE_PROPRIO_CUSTO,
  SITE_PROPRIO_CUSTO_HEADING,
  SITE_PROPRIO_DATE,
  SITE_PROPRIO_DECIDIR,
  SITE_PROPRIO_DECIDIR_HEADING,
  SITE_PROPRIO_DECIDIR_LABELS,
  SITE_PROPRIO_DESCRIPTION,
  SITE_PROPRIO_FAQ,
  SITE_PROPRIO_H1,
  SITE_PROPRIO_MODIFIED,
  SITE_PROPRIO_MUDAR_HEADING,
  SITE_PROPRIO_MUDAR_ITEMS,
  SITE_PROPRIO_MUDAR_LEAD,
  SITE_PROPRIO_OQUE,
  SITE_PROPRIO_OQUE_HEADING,
  SITE_PROPRIO_PATH,
  SITE_PROPRIO_RAPIDA,
  SITE_PROPRIO_RAPIDA_HEADING,
  SITE_PROPRIO_RAPIDA_ITEMS,
  SITE_PROPRIO_TITLE,
  SITE_PROPRIO_VELOCIDADE,
  SITE_PROPRIO_VELOCIDADE_HEADING,
  SITE_PROPRIO_VELOCIDADE_MAIS,
  SITE_PROPRIO_WHATSAPP,
  SITE_PROPRIO_WHATSAPP_HEADING,
  type CopyPart,
} from "@/data/siteProprioWix";
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
import { cbm } from "@/lib/palette";

const LIST: CSSProperties = {
  ...PROSE_P,
  paddingLeft: "1.25em",
};

const STRONG = { color: "#F5F2ED", fontWeight: 600 } as const;

export const metadata: Metadata = {
  title: { absolute: SITE_PROPRIO_TITLE },
  description: SITE_PROPRIO_DESCRIPTION,
  alternates: { canonical: SITE_PROPRIO_PATH },
  openGraph: {
    type: "article",
    locale: "pt_BR",
    siteName: "Coded by M",
    url: SITE_PROPRIO_PATH,
    title: SITE_PROPRIO_TITLE,
    description: SITE_PROPRIO_DESCRIPTION,
    publishedTime: SITE_PROPRIO_DATE,
    modifiedTime: SITE_PROPRIO_MODIFIED,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M, estúdio de web design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_PROPRIO_TITLE,
    description: SITE_PROPRIO_DESCRIPTION,
    images: [OG.home],
  },
};

function Copy({ parts }: { parts: readonly CopyPart[] }) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.text}</span>;
        const offsite = part.type === "external";
        return (
          <a
            key={i}
            href={part.href}
            style={PROSE_LINK}
            {...(offsite
              ? { target: "_blank" as const, rel: "noopener noreferrer" }
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
 * Artigo de comparação na raiz. O grafo segue o artigo de formato:
 * WebPage, Article (autor = #founder), FAQPage do mesmo array visível e
 * BreadcrumbList. Server component: o HTML sai pronto, sem depender de JS.
 */
export default function SiteProprioWixPage() {
  const published = SITE_PROPRIO_DATE.split("-").reverse().join("/");

  return (
    <ProseShell label="Guia" current={SITE_PROPRIO_PATH}>
      <JsonLd
        data={graph(
          webPageSchema({
            path: SITE_PROPRIO_PATH,
            name: SITE_PROPRIO_TITLE,
            description: SITE_PROPRIO_DESCRIPTION,
          }),
          articleSchema({
            path: SITE_PROPRIO_PATH,
            title: SITE_PROPRIO_H1,
            description: SITE_PROPRIO_DESCRIPTION,
            datePublished: SITE_PROPRIO_DATE,
            dateModified: SITE_PROPRIO_MODIFIED,
          }),
          faqPageSchema(SITE_PROPRIO_PATH, SITE_PROPRIO_FAQ),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: SITE_PROPRIO_CRUMB, path: SITE_PROPRIO_PATH },
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
          <span>{SITE_PROPRIO_CRUMB}</span>
        </nav>

        <h1 style={{ ...PROSE_H1, marginTop: 22 }}>{SITE_PROPRIO_H1}</h1>
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
          <time dateTime={SITE_PROPRIO_DATE}>{published}</time>
        </p>

        <h2 style={PROSE_H2}>{SITE_PROPRIO_RAPIDA_HEADING}</h2>
        <p style={PROSE_P}>{SITE_PROPRIO_RAPIDA}</p>
        <ul style={{ ...LIST, listStyle: "disc" }}>
          {SITE_PROPRIO_RAPIDA_ITEMS.map((item) => (
            <li key={item.label} style={{ marginTop: 8 }}>
              <strong style={STRONG}>{item.label}:</strong> {item.text}
            </li>
          ))}
        </ul>

        <h2 style={PROSE_H2}>{SITE_PROPRIO_OQUE_HEADING}</h2>
        {SITE_PROPRIO_OQUE.map((item) => (
          <p key={item.label} style={PROSE_P}>
            <strong style={STRONG}>{item.label}</strong> {item.text}
          </p>
        ))}

        <h2 style={PROSE_H2}>{SITE_PROPRIO_VELOCIDADE_HEADING}</h2>
        <p style={PROSE_P}>
          <Copy parts={SITE_PROPRIO_VELOCIDADE} />
        </p>
        <p style={PROSE_P}>{SITE_PROPRIO_VELOCIDADE_MAIS}</p>

        <h2 style={PROSE_H2}>{SITE_PROPRIO_MUDAR_HEADING}</h2>
        <p style={PROSE_P}>{SITE_PROPRIO_MUDAR_LEAD}</p>
        <ul style={{ ...LIST, listStyle: "disc" }}>
          {SITE_PROPRIO_MUDAR_ITEMS.map((item) => (
            <li key={item.label} style={{ marginTop: 8 }}>
              <strong style={STRONG}>{item.label}:</strong> <Copy parts={item.parts} />
            </li>
          ))}
        </ul>

        <h2 style={PROSE_H2}>{SITE_PROPRIO_CONTROLE_HEADING}</h2>
        <p style={PROSE_P}>
          <Copy parts={SITE_PROPRIO_CONTROLE_WIX} />
        </p>
        <p style={PROSE_P}>{SITE_PROPRIO_CONTROLE_WP}</p>
        <p style={PROSE_P}>{SITE_PROPRIO_CONTROLE_CODIGO}</p>

        <h2 style={PROSE_H2}>{SITE_PROPRIO_CUSTO_HEADING}</h2>
        <p style={PROSE_P}>
          <Copy parts={SITE_PROPRIO_CUSTO} />
        </p>

        <h2 style={PROSE_H2}>{SITE_PROPRIO_WHATSAPP_HEADING}</h2>
        <p style={PROSE_P}>
          <Copy parts={SITE_PROPRIO_WHATSAPP} />
        </p>

        <h2 style={PROSE_H2}>{SITE_PROPRIO_CASO_HEADING}</h2>
        {SITE_PROPRIO_CASO.map((para) => (
          <p key={para} style={PROSE_P}>
            {para}
          </p>
        ))}

        <h2 style={PROSE_H2}>{SITE_PROPRIO_DECIDIR_HEADING}</h2>
        <ol style={{ ...LIST, listStyle: "decimal" }}>
          {SITE_PROPRIO_DECIDIR.map((parts, i) => (
            <li key={SITE_PROPRIO_DECIDIR_LABELS[i]} style={{ marginTop: 8 }}>
              <strong style={STRONG}>{SITE_PROPRIO_DECIDIR_LABELS[i]}</strong>{" "}
              <Copy parts={parts} />
            </li>
          ))}
        </ol>
        <p style={PROSE_P}>
          <Copy parts={SITE_PROPRIO_CONTRATAR} />
        </p>

        <section>
          <h2 style={PROSE_H2}>Perguntas frequentes</h2>
          {SITE_PROPRIO_FAQ.map((item) => (
            <div key={item.q}>
              <h3 style={PROSE_H3}>{item.q}</h3>
              <p style={{ ...PROSE_P, marginTop: 8 }}>
                {faqAnswerSegments(item).map((segment, j) =>
                  segment.type === "link" ? (
                    <a
                      key={j}
                      href={segment.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={PROSE_LINK}
                    >
                      {segment.label}
                    </a>
                  ) : (
                    <Fragment key={j}>{segment.text}</Fragment>
                  ),
                )}
              </p>
            </div>
          ))}
        </section>
      </article>
    </ProseShell>
  );
}
