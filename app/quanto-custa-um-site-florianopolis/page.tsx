import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT } from "@/data/about";
import { CALC_PATH } from "@/data/calculadoraPreco";
import {
  ESCOLHER_BACKLINK_BEFORE,
  ESCOLHER_BACKLINK_LABEL,
  ESCOLHER_PATH,
} from "@/data/comoEscolherEmpresa";
import {
  QUANTO_CUSTA_CRUMB,
  QUANTO_CUSTA_CTA,
  QUANTO_CUSTA_DATE,
  QUANTO_CUSTA_DESCRIPTION,
  QUANTO_CUSTA_FAQ,
  QUANTO_CUSTA_FATORES,
  QUANTO_CUSTA_H1,
  QUANTO_CUSTA_INCLUSO,
  QUANTO_CUSTA_INCLUSO_HEADING,
  QUANTO_CUSTA_LEAD,
  QUANTO_CUSTA_ORCAMENTO,
  QUANTO_CUSTA_PASSOS,
  QUANTO_CUSTA_PATH,
  QUANTO_CUSTA_ROWS,
  QUANTO_CUSTA_TABLE_NOTE,
  QUANTO_CUSTA_TITLE,
} from "@/data/quantoCusta";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_H3, PROSE_LINK, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { PANCHANG, SURFACE } from "@/components/site/shared";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/contact";
import {
  OG,
  OG_SIZE,
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  graph,
  webPageSchema,
} from "@/lib/seo";

/** wa.me sem texto pré-preenchido: é o href publicado no copy. */
const WA = `https://wa.me/${WHATSAPP_NUMBER}`;

const LIST: CSSProperties = {
  ...PROSE_P,
  paddingLeft: "1.25em",
};

const STRONG = { color: "#F5F2ED", fontWeight: 600 } as const;

const COLS = ["Tipo de site", "Para quem serve", "O que está incluso", "Investimento"] as const;

export const metadata: Metadata = {
  title: { absolute: QUANTO_CUSTA_TITLE },
  description: QUANTO_CUSTA_DESCRIPTION,
  alternates: { canonical: QUANTO_CUSTA_PATH },
  openGraph: {
    type: "article",
    locale: "pt_BR",
    siteName: "Coded by M",
    url: QUANTO_CUSTA_PATH,
    title: QUANTO_CUSTA_TITLE,
    description: QUANTO_CUSTA_DESCRIPTION,
    publishedTime: QUANTO_CUSTA_DATE,
    modifiedTime: QUANTO_CUSTA_DATE,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M, estúdio de web design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: QUANTO_CUSTA_TITLE,
    description: QUANTO_CUSTA_DESCRIPTION,
    images: [OG.home],
  },
};

/**
 * Artigo de preço na raiz. O grafo segue /sobre e /contato: WebPage,
 * Article (autor = #founder), FAQPage do mesmo array visível e BreadcrumbList.
 */
export default function QuantoCustaPage() {
  const published = QUANTO_CUSTA_DATE.split("-").reverse().join("/");

  return (
    <ProseShell label="Preço" current={QUANTO_CUSTA_PATH}>
      <JsonLd
        data={graph(
          webPageSchema({
            path: QUANTO_CUSTA_PATH,
            name: QUANTO_CUSTA_TITLE,
            description: QUANTO_CUSTA_DESCRIPTION,
          }),
          articleSchema({
            path: QUANTO_CUSTA_PATH,
            title: QUANTO_CUSTA_H1,
            description: QUANTO_CUSTA_DESCRIPTION,
            datePublished: QUANTO_CUSTA_DATE,
            dateModified: QUANTO_CUSTA_DATE,
          }),
          faqPageSchema(QUANTO_CUSTA_PATH, QUANTO_CUSTA_FAQ),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: QUANTO_CUSTA_CRUMB, path: QUANTO_CUSTA_PATH },
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
            color: "#7E7A74",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Início
          </Link>
          <span aria-hidden style={{ margin: "0 10px", color: "#FB3640" }}>
            /
          </span>
          <span>{QUANTO_CUSTA_CRUMB}</span>
        </nav>

        <h1 style={{ ...PROSE_H1, marginTop: 22 }}>{QUANTO_CUSTA_H1}</h1>
        <p
          style={{
            ...PROSE_P,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7E7A74",
          }}
        >
          {ABOUT.founder.name}
          {" · "}
          <time dateTime={QUANTO_CUSTA_DATE}>{published}</time>
        </p>
        <p style={{ ...PROSE_P, color: "#E8E4DE" }}>{QUANTO_CUSTA_LEAD[0]}</p>
        <p style={PROSE_P}>{QUANTO_CUSTA_LEAD[1]}</p>

        <h2 style={PROSE_H2}>Tabela de preços 2026</h2>
        <div className="site-price-scroll">
          <table className="site-price-table">
            <caption className="sr-only">Tabela de preços 2026</caption>
            <thead>
              <tr>
                {COLS.map((col) => (
                  <th key={col} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUANTO_CUSTA_ROWS.map((row) => (
                <tr key={row.tipo}>
                  <td data-label={COLS[0]}>
                    {row.href ? (
                      <Link href={row.href} style={PROSE_LINK}>
                        {row.tipo}
                      </Link>
                    ) : (
                      row.tipo
                    )}
                  </td>
                  <td data-label={COLS[1]}>{row.para}</td>
                  <td data-label={COLS[2]}>{row.incluso}</td>
                  <td data-label={COLS[3]} className="site-price-value">
                    {row.preco}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={PROSE_P}>{QUANTO_CUSTA_TABLE_NOTE}</p>
        <p style={PROSE_P}>
          {"Para ver a faixa do seu caso, use a "}
          <Link href={CALC_PATH} style={PROSE_LINK}>
            calculadora de preço de site
          </Link>
          .
        </p>

        <h2 style={PROSE_H2}>O que faz o preço de um site variar</h2>
        <ul style={{ ...LIST, listStyle: "disc" }}>
          {QUANTO_CUSTA_FATORES.map((item) => (
            <li key={item.label} style={{ marginTop: 8 }}>
              <strong style={STRONG}>{item.label}:</strong> {item.text}
            </li>
          ))}
        </ul>

        <h2 style={PROSE_H2}>{QUANTO_CUSTA_INCLUSO_HEADING}</h2>
        {QUANTO_CUSTA_INCLUSO.map((para) => (
          <p key={para} style={PROSE_P}>
            {para}
          </p>
        ))}
        <p style={PROSE_P}>
          {"O prazo de cada serviço está na página da "}
          <Link href="/landing-page" style={PROSE_LINK}>
            landing page
          </Link>
          {" e na página do "}
          <Link href="/site-institucional" style={PROSE_LINK}>
            site institucional
          </Link>
          .
        </p>

        <h2 style={PROSE_H2}>Landing page ou site institucional: qual escolher?</h2>
        <p style={PROSE_P}>
          {"Escolha a "}
          <Link href="/landing-page" style={PROSE_LINK}>
            landing page
          </Link>
          {
            " quando o objetivo é um só, como divulgar um serviço ou uma campanha e levar a pessoa a chamar no WhatsApp. Escolha o "
          }
          <Link href="/site-institucional" style={PROSE_LINK}>
            site institucional
          </Link>
          {
            " quando a empresa precisa de presença completa, com páginas para cada serviço e para contar a própria história. Se ficar em dúvida, descreva o objetivo no orçamento e eu indico o formato."
          }
        </p>

        <h2 style={PROSE_H2}>Como pedir orçamento</h2>
        <ol style={{ ...LIST, listStyle: "decimal" }}>
          <li style={{ marginTop: 8 }}>
            {"Chame no WhatsApp "}
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              style={PROSE_LINK}
              data-cm-role="whatsapp"
              data-cm-id="preco-whatsapp"
            >
              {WHATSAPP_DISPLAY}
            </a>
            {" ou acesse a página de "}
            <Link href="/contato" style={PROSE_LINK}>
              contato
            </Link>
            .
          </li>
          {QUANTO_CUSTA_PASSOS.map((step) => (
            <li key={step} style={{ marginTop: 8 }}>
              {step}
            </li>
          ))}
        </ol>
        <p style={PROSE_P}>{QUANTO_CUSTA_ORCAMENTO}</p>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="site-cta"
          data-cm-role="whatsapp"
          data-cm-id="preco-whatsapp-cta"
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
          {QUANTO_CUSTA_CTA}
        </a>

        <section>
          <h2 style={PROSE_H2}>Perguntas frequentes</h2>
          {QUANTO_CUSTA_FAQ.map((item) => (
            <div key={item.q}>
              <h3 style={PROSE_H3}>{item.q}</h3>
              <p style={{ ...PROSE_P, marginTop: 8 }}>{item.a}</p>
            </div>
          ))}
        </section>

        <p style={{ ...PROSE_P, marginTop: 48 }}>
          <Link href="/landing-page" style={PROSE_LINK}>
            Landing page
          </Link>
          {" · "}
          <Link href="/site-institucional" style={PROSE_LINK}>
            Site institucional
          </Link>
          {" · "}
          <Link href={CALC_PATH} style={PROSE_LINK}>
            Calculadora de preço de site
          </Link>
          {" · "}
          <Link href="/contato" style={PROSE_LINK}>
            Contato
          </Link>
        </p>
        <p style={PROSE_P}>
          {ESCOLHER_BACKLINK_BEFORE}
          <Link href={ESCOLHER_PATH} style={PROSE_LINK}>
            {ESCOLHER_BACKLINK_LABEL}
          </Link>
          .
        </p>
      </article>
    </ProseShell>
  );
}
