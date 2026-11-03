import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT } from "@/data/about";
import {
  CALC_CRUMB,
  CALC_DESCRIPTION,
  CALC_ESCOPO,
  CALC_FAQ,
  CALC_H1,
  CALC_PATH,
  CALC_PLANO_LABEL,
  CALC_TIPOS,
  CALC_TITLE,
} from "@/data/calculadoraPreco";
import { QUANTO_CUSTA_CRUMB, QUANTO_CUSTA_PATH } from "@/data/quantoCusta";
import { isFilled } from "@/data/servicePages";
import { CalculadoraForm } from "@/components/calculadora/CalculadoraForm";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_H3, PROSE_LINK, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  OG,
  OG_SIZE,
  breadcrumbSchema,
  faqPageSchema,
  graph,
  webApplicationSchema,
  webPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: CALC_H1,
  description: CALC_DESCRIPTION,
  authors: [{ name: ABOUT.founder.name }],
  alternates: { canonical: CALC_PATH },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Coded by M",
    url: CALC_PATH,
    title: CALC_TITLE,
    description: CALC_DESCRIPTION,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M, estúdio de web design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: CALC_TITLE,
    description: CALC_DESCRIPTION,
    images: [OG.home],
  },
};

/**
 * Calculadora de faixa. H1, faixas e FAQ saem no HTML do servidor.
 * A escolha (tipo, plano, texto) fica no client component.
 */
export default function CalculadoraPrecoPage() {
  return (
    <ProseShell label="Calculadora" current={CALC_PATH}>
      <JsonLd
        data={graph(
          webPageSchema({
            path: CALC_PATH,
            name: CALC_TITLE,
            description: CALC_DESCRIPTION,
          }),
          webApplicationSchema({
            path: CALC_PATH,
            name: CALC_H1,
            description: CALC_DESCRIPTION,
          }),
          faqPageSchema(CALC_PATH, CALC_FAQ),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: CALC_CRUMB, path: CALC_PATH },
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
          <span>{CALC_CRUMB}</span>
        </nav>

        <h1 style={{ ...PROSE_H1, marginTop: 22 }}>{CALC_H1}</h1>
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
        </p>
        <p style={{ ...PROSE_P, color: "#E8E4DE" }}>{CALC_DESCRIPTION}</p>

        <h2 style={PROSE_H2}>Faixas de partida</h2>
        <p style={PROSE_P}>
          O resultado mostra só &quot;a partir de&quot;, para landing page ou site institucional.
        </p>
        <ul style={{ ...PROSE_P, paddingLeft: "1.25em", listStyle: "disc" }}>
          {CALC_TIPOS.map((tipo) => (
            <li key={tipo.id} style={{ marginTop: 8 }}>
              <strong style={{ color: "#F5F2ED", fontWeight: 600 }}>{tipo.label}:</strong>{" "}
              {tipo.preco} e {tipo.prazo}.
            </li>
          ))}
        </ul>
        <p style={PROSE_P}>{CALC_ESCOPO}</p>
        <p style={PROSE_P}>
          {`O único extra é um ${CALC_PLANO_LABEL.toLowerCase()}, sem preço. Marque se quiser incluí-lo na mensagem.`}
        </p>
        <p style={PROSE_P}>
          {"A tabela completa, com o que muda o preço, está no artigo "}
          <Link href={QUANTO_CUSTA_PATH} style={PROSE_LINK}>
            {QUANTO_CUSTA_CRUMB}
          </Link>
          .
        </p>

        <h2 style={PROSE_H2}>Monte seu pedido</h2>
        <CalculadoraForm />

        <section>
          <h2 style={PROSE_H2}>Perguntas frequentes</h2>
          {CALC_FAQ.filter(isFilled).map((item) => (
            <div key={item.q}>
              <h3 style={PROSE_H3}>{item.q}</h3>
              <p style={{ ...PROSE_P, marginTop: 8 }}>{item.a}</p>
            </div>
          ))}
        </section>

        <p style={{ ...PROSE_P, marginTop: 48 }}>
          <Link href={QUANTO_CUSTA_PATH} style={PROSE_LINK}>
            {QUANTO_CUSTA_CRUMB}
          </Link>
          {" · "}
          <Link href="/landing-page" style={PROSE_LINK}>
            Landing page
          </Link>
          {" · "}
          <Link href="/site-institucional" style={PROSE_LINK}>
            Site institucional
          </Link>
          {" · "}
          <Link href="/contato" style={PROSE_LINK}>
            Contato
          </Link>
        </p>
      </article>
    </ProseShell>
  );
}
