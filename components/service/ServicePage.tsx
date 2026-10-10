import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cases } from "@/data/cases";
import { PROCESS_STEPS } from "@/data/process";
import { SHOW_PRICES, type ServicePageConfig } from "@/data/servicePages";
import { Reveal } from "@/components/ui/Reveal";
import { Diamond, PANCHANG, SATOSHI, SUNKEN_RGB, SURFACE } from "@/components/site/shared";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { GalleryFooter } from "@/components/projetos/GalleryFooter";
import { LpCta } from "@/components/lp/LpCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "./FaqList";
import {
  OG,
  OG_SIZE,
  breadcrumbSchema,
  faqPageSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo";

/** Metadata de uma página de serviço — canonical próprio, OG redeclarado inteiro. */
export function serviceMetadata(page: ServicePageConfig): Metadata {
  const path = `/${page.slug}`;
  const { title, description } = page.meta;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Coded by M",
      url: path,
      title: `${title} · Coded by M`,
      description,
      images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M — estúdio de web design" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Coded by M`,
      description,
      images: [OG.home],
    },
  };
}

const WRAP: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "clamp(56px,8vh,96px) clamp(20px,4vw,48px)",
};

const H2: React.CSSProperties = {
  margin: 0,
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: "clamp(25px,3.2vw,40px)",
  letterSpacing: "-0.014em",
  lineHeight: 1.1,
  color: "#F5F2ED",
  textWrap: "balance",
};

const BODY: React.CSSProperties = {
  margin: 0,
  maxWidth: "62ch",
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: "clamp(15px,1.4vw,17px)",
  lineHeight: 1.72,
  color: "#B4B0AA",
  textWrap: "pretty",
};

const BAND = { borderTop: "1px solid #111511" } as const;

function BulletList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        margin: "28px 0 0",
        padding: 0,
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
        gap: "0 clamp(20px,3vw,40px)",
      }}
    >
      {items.map((item) => (
        <li
          key={item}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "16px 0",
            borderBottom: "1px solid rgba(245,242,237,0.08)",
            fontFamily: SATOSHI,
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.5,
            color: "#E8E4DE",
          }}
        >
          <span style={{ marginTop: "0.45em", flex: "none" }}>
            <Diamond size={6} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Página de serviço indexável.
 *
 * Mesma linguagem das landings (corredor, um CTA repetido), mas com saídas:
 * cabeçalho, cases linkados e rodapé com os outros serviços — quem chega pela
 * busca ainda não decidiu, e precisa poder conferir antes.
 *
 * Exatamente um H1. Todo o texto sai no HTML do servidor; só o CTA hidrata.
 */
export function ServicePage({ page }: { page: ServicePageConfig }) {
  const path = `/${page.slug}`;
  const projects = page.caseSlugs
    .map((s) => cases.find((c) => c.slug === s && c.status === "published"))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const schema = graph(
    webPageSchema({ path, name: page.meta.title, description: page.meta.description }),
    serviceSchema({ path, name: page.serviceName, description: page.meta.description }),
    faqPageSchema(path, page.faq),
    breadcrumbSchema([
      { name: "Início", path: "/" },
      { name: page.label, path },
    ]),
  );

  return (
    <div className="site-home min-h-dvh" style={{ background: SURFACE.base, color: "#F5F2ED" }}>
      <JsonLd data={schema} />
      <GalleryHeader label={page.label} />
      <main data-cm-section="service" data-cm-id={page.slug}>
        {/* Hero */}
        <section style={{ ...WRAP, paddingTop: "clamp(44px,7vh,80px)" }}>
          <nav aria-label="Trilha" style={{ ...BODY, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7E7A74" }}>
            <Link href="/" style={{ color: "inherit" }}>Início</Link>
            <span aria-hidden style={{ margin: "0 10px", color: "#FB3640" }}>/</span>
            <span>{page.label}</span>
          </nav>
          <Reveal variant="wipe">
            <h1
              style={{
                ...H2,
                marginTop: 26,
                maxWidth: "18ch",
                fontSize: "clamp(32px,5vw,62px)",
                lineHeight: 1.03,
              }}
            >
              {page.h1}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ ...BODY, marginTop: 24, color: "#C8C4BE", fontSize: "clamp(15px,1.5vw,18px)" }}>
              {page.intro}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ marginTop: 34 }}>
              <LpCta
                label="Pedir orçamento no WhatsApp"
                message={page.waMessage}
                size="lg"
                source={page.ctaSource}
              />
            </div>
          </Reveal>
        </section>

        {/* Resumo direto — o trecho que a busca com IA cita. */}
        <section style={{ ...BAND, background: SURFACE.raised }}>
          <div style={WRAP}>
            <p
              style={{
                margin: 0,
                maxWidth: "48ch",
                fontFamily: PANCHANG,
                fontWeight: 500,
                fontSize: "clamp(17px,1.9vw,23px)",
                lineHeight: 1.45,
                color: "#E8E4DE",
                textWrap: "pretty",
              }}
            >
              {page.summary}
            </p>
          </div>
        </section>

        {page.extraSections?.map((sec) => (
          <section key={sec.heading} style={BAND}>
            <div style={WRAP}>
              <Reveal variant="wipe">
                <h2 style={{ ...H2, maxWidth: "20ch" }}>{sec.heading}</h2>
              </Reveal>
              {sec.body?.map((para) => (
                <p key={para} style={{ ...BODY, marginTop: 20 }}>{para}</p>
              ))}
              {sec.list && <BulletList items={sec.list} />}
            </div>
          </section>
        ))}

        <section style={BAND}>
          <div style={WRAP}>
            <Reveal variant="wipe">
              <h2 style={H2}>{page.includesHeading}</h2>
            </Reveal>
            <BulletList items={page.includes} />
          </div>
        </section>

        <section style={{ ...BAND, background: SURFACE.raised }}>
          <div style={WRAP}>
            <Reveal variant="wipe">
              <h2 style={H2}>Prazo e investimento</h2>
            </Reveal>
            <p style={{ ...BODY, marginTop: 20 }}>
              {SHOW_PRICES && page.price
                ? page.price
                : "Orçamento sob medida e sem compromisso: você conta o projeto pelo WhatsApp e recebe valor e prazo antes de decidir qualquer coisa."}
            </p>
          </div>
        </section>

        <section style={BAND}>
          <div style={WRAP}>
            <Reveal variant="wipe">
              <h2 style={H2}>Como funciona</h2>
            </Reveal>
            <ol
              style={{
                margin: "clamp(28px,4vh,42px) 0 0",
                padding: 0,
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,210px),1fr))",
                gap: "clamp(20px,3vw,36px)",
              }}
            >
              {PROCESS_STEPS.map((s) => (
                <li key={s.num} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontFamily: PANCHANG, fontWeight: 600, fontSize: 11, letterSpacing: "0.2em", color: "#FB3640" }}>
                    {s.num}
                  </span>
                  <h3 style={{ margin: 0, fontFamily: PANCHANG, fontWeight: 700, fontSize: 20, color: "#F5F2ED" }}>
                    {s.title}
                  </h3>
                  <p style={{ ...BODY, fontSize: 14 }}>{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {projects.length > 0 && (
          <section style={{ ...BAND, background: SURFACE.raised }}>
            <div style={WRAP}>
              <Reveal variant="wipe">
                <h2 style={H2}>{page.projectsHeading}</h2>
              </Reveal>
              <div
                style={{
                  marginTop: "clamp(30px,4vh,46px)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
                  gap: "clamp(16px,2.2vw,26px)",
                }}
              >
                {projects.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cases/${c.slug}`}
                    className="site-card"
                    data-cm-role="secondary-cta"
                    data-cm-id={`case-${c.slug}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                      border: "1px solid rgba(245,242,237,0.12)",
                      background: SURFACE.sunken,
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        height: "clamp(170px,20vh,210px)",
                        overflow: "hidden",
                        borderBottom: "1px solid rgba(245,242,237,0.1)",
                      }}
                    >
                      {c.preview?.card && (
                        <Image
                          src={c.preview.card}
                          alt={`${c.title} — ${c.meta.tipo}`}
                          width={760}
                          height={874}
                          sizes="(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 25vw"
                          className="site-shot"
                          style={{ display: "block", width: "100%", height: "auto" }}
                        />
                      )}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: "auto 0 0 0",
                          height: 70,
                          background: `linear-gradient(to bottom,rgba(${SUNKEN_RGB},0),rgba(${SUNKEN_RGB},0.95))`,
                        }}
                      />
                    </div>
                    <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <h3 style={{ margin: 0, fontFamily: PANCHANG, fontWeight: 700, fontSize: 18, color: "#F5F2ED" }}>
                        {c.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: SATOSHI,
                          fontSize: 10,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "#9B9791",
                        }}
                      >
                        {c.meta.setor} · {c.concept ? "Projeto conceitual" : c.meta.ano}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <p style={{ ...BODY, marginTop: 26, fontSize: 14 }}>
                <Link href="/projetos" className="site-link-underline" style={{ color: "#F5F2ED" }}>
                  Ver todos os projetos
                </Link>
              </p>
            </div>
          </section>
        )}

        <section style={BAND}>
          <div style={{ ...WRAP, maxWidth: 860 }}>
            <Reveal variant="wipe">
              <h2 style={{ ...H2, marginBottom: 22 }}>Perguntas frequentes</h2>
            </Reveal>
            <FaqList items={page.faq} />
          </div>
        </section>

        <section style={{ ...BAND, background: SURFACE.raised }}>
          <div style={{ ...WRAP, textAlign: "center", paddingBlock: "clamp(64px,10vh,112px)" }}>
            <p style={{ ...H2, margin: "0 auto", maxWidth: "18ch" }}>
              Vamos conversar sobre o seu projeto.
            </p>
            <p style={{ ...BODY, margin: "18px auto 0", maxWidth: "46ch" }}>
              Você conta o contexto, eu digo o que faria e em quanto tempo entrego.
            </p>
            <div style={{ marginTop: 32 }}>
              <LpCta
                label="Pedir orçamento no WhatsApp"
                message={page.waMessage}
                size="lg"
                source={`${page.ctaSource}-final`}
              />
            </div>
          </div>
        </section>
      </main>
      <GalleryFooter current={path} />
    </div>
  );
}
