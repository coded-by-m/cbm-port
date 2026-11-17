import Link from "next/link";
import { cases } from "@/data/cases";
import { CLIENT_PROOF } from "@/data/clientProof";
import { SECTIONS } from "@/data/home";
import { PANCHANG, SATOSHI, SECTION, SectionHead } from "./shared";
import { Reveal } from "@/components/ui/Reveal";
import { TriArrow } from "@/components/ui/TriArrow";
import { cbm } from "@/lib/palette";

const META: React.CSSProperties = {
  margin: 0,
  fontFamily: SATOSHI,
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: cbm("gray-300"),
};

const BODY: React.CSSProperties = {
  margin: 0,
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 15,
  lineHeight: 1.65,
  color: cbm("gray-200"),
  textWrap: "pretty",
};

const LINK: React.CSSProperties = {
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  paddingBottom: 4,
  fontFamily: SATOSHI,
  fontWeight: 500,
  fontSize: 14,
  color: "#F5F2ED",
  textDecoration: "none",
};

/**
 * Clientes reais: a resposta a "só vejo projeto conceitual" e "nunca ouvi
 * falar do estúdio". Um card por cliente, com o endereço no ar, o resultado
 * medido quando existe e o depoimento quando o cliente mandar.
 *
 * Só texto, de propósito: as capturas dos sites estão no muro logo acima.
 * A lista vem de `CLIENT_PROOF`; conceito nunca entra (filtro por `concept`).
 */
export function ClientsSection() {
  const clients = CLIENT_PROOF.flatMap((proof) => {
    const c = cases.find((x) => x.slug === proof.slug && !x.concept);
    return c ? [{ ...proof, c }] : [];
  });
  if (!clients.length) return null;

  return (
    <section id="clientes" data-cm-section="clients" style={SECTION}>
      <SectionHead heading={SECTIONS.clientes.heading} sub={SECTIONS.clientes.sub} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
          gap: "clamp(20px,2.4vw,28px)",
        }}
      >
        {clients.map(({ c, fact, quote, author }, i) => (
          <Reveal key={c.slug} delay={i * 110} variant="scale" className="site-cell">
            <article
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minWidth: 0,
                height: "100%",
                border: "1px solid rgba(245,242,237,0.12)",
                background: cbm("sunken"),
                padding: "clamp(22px,2.4vw,30px)",
              }}
            >
              <p style={META}>
                {c.meta.tipo} · {c.meta.ano}
              </p>
              <h3
                style={{
                  margin: 0,
                  fontFamily: PANCHANG,
                  fontWeight: 700,
                  fontSize: "clamp(20px,2.1vw,25px)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.15,
                  color: "#F5F2ED",
                }}
              >
                {c.title}
              </h3>
              <p style={BODY}>{c.meta.setor}</p>

              {fact && (
                <p
                  style={{
                    ...BODY,
                    paddingTop: 14,
                    borderTop: "1px solid rgba(245,242,237,0.12)",
                    color: "#F5F2ED",
                  }}
                >
                  {fact}
                </p>
              )}

              {quote && (
                <figure style={{ margin: 0, paddingTop: 14, borderTop: "1px solid rgba(245,242,237,0.12)" }}>
                  <blockquote style={{ ...BODY, color: "#F5F2ED" }}>“{quote}”</blockquote>
                  {author && <figcaption style={{ ...META, marginTop: 10 }}>{author}</figcaption>}
                </figure>
              )}

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {c.siteUrl && (
                  <a
                    href={`https://${c.siteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-link-underline"
                    data-cm-id={`clients-site-${c.slug}`}
                    style={{ ...LINK, overflowWrap: "anywhere" }}
                  >
                    {c.siteUrl}
                    <span aria-hidden style={{ color: "#FB3640" }}>
                      <TriArrow dir="up-right" />
                    </span>
                  </a>
                )}
                <Link
                  href={`/cases/${c.slug}`}
                  className="site-link-underline"
                  data-cm-role="secondary-cta"
                  data-cm-id={`clients-case-${c.slug}`}
                  style={LINK}
                >
                  Ver o case
                  <span aria-hidden style={{ color: "#FB3640" }}>
                    <TriArrow dir="right" />
                  </span>
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
