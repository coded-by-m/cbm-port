import Image from "next/image";
import { cases } from "@/data/cases";
import { PROCESS_STEPS } from "@/data/process";
import type { LandingConfig } from "@/data/landings";
import { Reveal } from "@/components/ui/Reveal";
import {
  Diamond,
  PANCHANG,
  SATOSHI,
  SUNKEN_RGB,
  SURFACE,
} from "@/components/site/shared";
import { LpCta } from "./LpCta";

/** Largura útil da landing — mais estreita que a home: um corredor, não uma vitrine. */
const WRAP: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "clamp(64px,9vh,104px) clamp(20px,4vw,48px)",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontFamily: SATOSHI,
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "#FB3640",
      }}
    >
      <span aria-hidden style={{ display: "block", width: 24, height: 1, background: "#FB3640" }} />
      {children}
    </span>
  );
}

const H2: React.CSSProperties = {
  margin: 0,
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: "clamp(27px,3.6vw,46px)",
  letterSpacing: "-0.014em",
  lineHeight: 1.08,
  color: "#F5F2ED",
  textWrap: "balance",
};

/** Hero — headline dirigida ao segmento, não à marca. */
export function LpHero({ lp }: { lp: LandingConfig }) {
  return (
    <section style={{ ...WRAP, paddingTop: "clamp(48px,7vh,84px)" }}>
      <Reveal variant="side">
        <Label>{lp.eyebrow}</Label>
      </Reveal>
      <Reveal delay={110} variant="wipe">
        <h1
          style={{
            ...H2,
            marginTop: 24,
            maxWidth: "17ch",
            fontSize: "clamp(34px,5.4vw,66px)",
            lineHeight: 1.02,
          }}
        >
          {lp.headline}
        </h1>
      </Reveal>
      <Reveal delay={220}>
        <p
          style={{
            margin: "26px 0 0",
            maxWidth: "58ch",
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: "clamp(15px,1.5vw,18px)",
            lineHeight: 1.72,
            color: "#C8C4BE",
            textWrap: "pretty",
          }}
        >
          {lp.sub}
        </p>
      </Reveal>
      <Reveal delay={330}>
        <div style={{ marginTop: 38 }}>
          <LpCta label={lp.ctaLabel} message={lp.waMessage} size="lg" source="lp-hero" />
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Dor — o bloco que a home não tem, e o que faz a campanha funcionar.
 *
 * Fundo próprio pra separar visualmente: é aqui que o visitante frio decide
 * se a página é sobre ele. Se não se reconhecer, sai.
 */
export function LpPains({ lp }: { lp: LandingConfig }) {
  return (
    <section style={{ background: SURFACE.raised, borderTop: "1px solid #111511" }}>
      <div style={WRAP}>
        <Reveal variant="side">
          <Label>Soa familiar?</Label>
        </Reveal>
        <ul
          style={{
            margin: "34px 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {lp.pains.map((p, i) => (
            <Reveal key={p} delay={i * 90} variant="side">
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "20px 0",
                  borderBottom: "1px solid rgba(245,242,237,0.08)",
                  fontFamily: PANCHANG,
                  fontWeight: 500,
                  fontSize: "clamp(17px,1.9vw,24px)",
                  lineHeight: 1.34,
                  color: "#E8E4DE",
                  textWrap: "pretty",
                }}
              >
                <span style={{ marginTop: "0.5em", flex: "none" }}>
                  <Diamond />
                </span>
                {p}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Promessa — uma frase. O que muda depois. */
export function LpPromise({ lp }: { lp: LandingConfig }) {
  return (
    <section style={{ borderTop: "1px solid #111511" }}>
      <div style={{ ...WRAP, textAlign: "center" }}>
        <Reveal variant="wipe">
          <p
            style={{
              ...H2,
              margin: "0 auto",
              maxWidth: "20ch",
              fontSize: "clamp(26px,4vw,52px)",
            }}
          >
            {lp.promise}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Prova — só os cases do segmento. Sem link pra fora: a prova acontece aqui. */
export function LpProof({ lp }: { lp: LandingConfig }) {
  const list = lp.caseSlugs
    .map((s) => cases.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <section style={{ borderTop: "1px solid #111511" }}>
      <div style={WRAP}>
        <Reveal variant="side">
          <Label>Trabalho no ar</Label>
        </Reveal>
        <Reveal delay={110} variant="wipe">
          <h2 style={{ ...H2, marginTop: 22, maxWidth: "18ch" }}>
            Escritórios que já estão apresentados assim.
          </h2>
        </Reveal>

        <div
          style={{
            marginTop: "clamp(34px,5vh,52px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
            gap: "clamp(18px,2.4vw,28px)",
          }}
        >
          {list.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100} variant="scale" className="site-cell">
              <article
                className="site-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  border: "1px solid rgba(245,242,237,0.12)",
                  background: SURFACE.sunken,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "clamp(180px,22vh,230px)",
                    overflow: "hidden",
                    borderBottom: "1px solid rgba(245,242,237,0.1)",
                  }}
                >
                  <Image
                    src={c.preview?.card ?? ""}
                    alt={`${c.title} — ${c.meta.tipo}`}
                    width={760}
                    height={874}
                    sizes="(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 30vw"
                    className="site-shot"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: "auto 0 0 0",
                      height: 80,
                      background: `linear-gradient(to bottom,rgba(${SUNKEN_RGB},0),rgba(${SUNKEN_RGB},0.95))`,
                    }}
                  />
                </div>
                <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: PANCHANG,
                      fontWeight: 700,
                      fontSize: 19,
                      color: "#F5F2ED",
                    }}
                  >
                    {c.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: SATOSHI,
                      fontWeight: 400,
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#9B9791",
                    }}
                  >
                    {c.meta.setor} · {c.meta.ano}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Como funciona — tira o medo de "quanto tempo isso vai tomar de mim". */
export function LpProcess() {
  return (
    <section style={{ background: SURFACE.raised, borderTop: "1px solid #111511" }}>
      <div style={WRAP}>
        <Reveal variant="side">
          <Label>Como funciona</Label>
        </Reveal>
        <Reveal delay={110} variant="wipe">
          <h2 style={{ ...H2, marginTop: 22, maxWidth: "18ch" }}>
            Quatro etapas, e você sabe onde está em cada uma.
          </h2>
        </Reveal>
        <div
          style={{
            marginTop: "clamp(30px,4vh,46px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,210px),1fr))",
            gap: "clamp(20px,3vw,36px)",
          }}
        >
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 100} variant="side">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span
                  style={{
                    fontFamily: PANCHANG,
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: "#FB3640",
                  }}
                >
                  {s.num}
                </span>
                <h3 style={{ margin: 0, fontFamily: PANCHANG, fontWeight: 700, fontSize: 20, color: "#F5F2ED" }}>
                  {s.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#B4B0AA",
                    textWrap: "pretty",
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Objeções em `<details>` nativo: acordeão acessível por teclado, anunciado
 * por leitor de tela e com zero JavaScript. O marcador padrão sai pelo CSS.
 */
export function LpFaq({ lp }: { lp: LandingConfig }) {
  return (
    <section style={{ borderTop: "1px solid #111511" }}>
      <div style={{ ...WRAP, maxWidth: 860 }}>
        <Reveal variant="side">
          <Label>Antes de você perguntar</Label>
        </Reveal>
        <div style={{ marginTop: 32 }}>
          {lp.faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 70}>
              <details className="lp-faq">
                <summary>
                  {f.q}
                  <span aria-hidden className="lp-faq-mark" />
                </summary>
                <p>{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Fechamento — a única porta no fim do corredor. */
export function LpFinal({ lp }: { lp: LandingConfig }) {
  return (
    <section style={{ background: SURFACE.raised, borderTop: "1px solid #111511" }}>
      <div style={{ ...WRAP, textAlign: "center", paddingBlock: "clamp(72px,12vh,128px)" }}>
        <Reveal variant="wipe">
          <h2 style={{ ...H2, margin: "0 auto", maxWidth: "16ch" }}>
            Vamos conversar sobre o seu escritório.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p
            style={{
              margin: "20px auto 0",
              maxWidth: "48ch",
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.7,
              color: "#C8C4BE",
            }}
          >
            Você conta o contexto, eu digo o que faria e em quanto tempo entrego.
            Sem formulário e sem proposta automática.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div style={{ marginTop: 36 }}>
            <LpCta label={lp.ctaLabel} message={lp.waMessage} size="lg" source="lp-final" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
