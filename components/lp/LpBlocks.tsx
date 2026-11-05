import Image from "next/image";
import { cases } from "@/data/cases";
import { PROCESS_STEPS } from "@/data/process";
import type { LandingConfig } from "@/data/landings";
import { isFilled } from "@/data/servicePages";
import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/ui/Reveal";
import {
  Diamond,
  PANCHANG,
  SATOSHI,
  SURFACE,
} from "@/components/site/shared";
import { LpCta } from "./LpCta";
import { cbm } from "@/lib/palette";

/** Largura útil da landing — mais estreita que a home: um corredor, não uma vitrine. */
const WRAP: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "clamp(64px,9vh,104px) clamp(20px,4vw,48px)",
};

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

/**
 * Hero: headline dirigida a quem clicou. A captura fica fora do `Reveal` para
 * não atrasar o LCP esperando JavaScript.
 */
export function LpHero({ lp }: { lp: LandingConfig }) {
  const shot = lp.heroCaseSlug ? cases.find((c) => c.slug === lp.heroCaseSlug) : undefined;
  const src = shot?.preview?.top;

  return (
    <section data-cm-section="hero" style={{ ...WRAP, paddingTop: "clamp(48px,7vh,84px)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: src ? "repeat(auto-fit,minmax(min(100%,400px),1fr))" : "1fr",
          gap: "clamp(36px,5vw,64px)",
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Reveal variant="wipe">
            <h1
              style={{
                ...H2,
                marginTop: 24,
                maxWidth: "17ch",
                /* Com a captura ao lado, a coluna é menos da metade da página. */
                fontSize: src ? "clamp(30px,3.8vw,52px)" : "clamp(34px,5.4vw,66px)",
                lineHeight: 1.02,
              }}
            >
              {lp.headline}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p
              style={{
                margin: "26px 0 0",
                maxWidth: "58ch",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: "clamp(15px,1.5vw,18px)",
                lineHeight: 1.72,
                color: cbm("gray-200"),
                textWrap: "pretty",
              }}
            >
              {lp.sub}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ marginTop: 38 }}>
              <LpCta label={lp.ctaLabel} message={lp.waMessage} size="lg" source="lp-hero" />
            </div>
          </Reveal>
        </div>

        {src && shot && (
          <Image
            src={src}
            alt={`Site da ${shot.title}`}
            width={1440}
            height={900}
            priority
            sizes="(max-width: 900px) 92vw, 46vw"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              border: "1px solid rgba(245,242,237,0.12)",
            }}
          />
        )}
      </div>
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
  if (!lp.pains?.length) return null;

  return (
    <section data-cm-section="pains" style={{ background: SURFACE.raised, borderTop: `1px solid ${cbm("border")}` }}>
      <div style={WRAP}>
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
                  color: cbm("gray-100"),
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
  if (!lp.promise) return null;

  return (
    <section data-cm-section="promise" style={{ borderTop: `1px solid ${cbm("border")}` }}>
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

/** Grade de cards de case. */
function ProofGrid({ list }: { list: CaseProject[] }) {
  return (
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
                alt={`${c.title}: ${c.meta.tipo}`}
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
                  background: `linear-gradient(to bottom,${cbm("sunken", 0)},${cbm("sunken", 0.95)})`,
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
                  color: cbm("gray-400"),
                }}
              >
                {c.meta.setor} · {c.concept ? "Projeto conceitual · " : ""}{c.meta.ano}
              </span>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Prova: clientes reais primeiro e conceitos em grupo próprio, com rótulo
 * visível, para não sugerir que conceito foi cliente. Sem link pra fora: a
 * prova acontece aqui.
 */
export function LpProof({ lp }: { lp: LandingConfig }) {
  const list = lp.caseSlugs
    .map((s) => cases.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const real = list.filter((c) => !c.concept);
  const concept = list.filter((c) => c.concept);

  return (
    <section data-cm-section="social-proof" style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div style={WRAP}>
        <Reveal variant="wipe">
          <h2 style={{ ...H2, marginTop: 22, maxWidth: "18ch" }}>{lp.proofHeading}</h2>
        </Reveal>

        {real.length > 0 && <ProofGrid list={real} />}

        {real.length > 0 && concept.length > 0 && lp.conceptHeading && (
          <Reveal variant="wipe">
            <p
              style={{
                margin: "clamp(48px,7vh,72px) 0 0",
                maxWidth: "34ch",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: "clamp(18px,2vw,24px)",
                lineHeight: 1.25,
                color: cbm("gray-100"),
                textWrap: "balance",
              }}
            >
              {lp.conceptHeading}
            </p>
          </Reveal>
        )}

        {concept.length > 0 && <ProofGrid list={concept} />}
      </div>
    </section>
  );
}

/** Diferenciais: a resposta ao problema, e o que justifica o preço. */
export function LpDifferentials({ lp }: { lp: LandingConfig }) {
  if (!lp.differentials) return null;

  return (
    <section data-cm-section="differentials" style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div style={WRAP}>
        <Reveal variant="wipe">
          <h2 style={{ ...H2, maxWidth: "18ch" }}>{lp.differentials.heading}</h2>
        </Reveal>
        <div
          style={{
            marginTop: "clamp(30px,4vh,46px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
            gap: "clamp(24px,3vw,36px)",
          }}
        >
          {lp.differentials.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} variant="side">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h3
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontFamily: PANCHANG,
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#F5F2ED",
                  }}
                >
                  <Diamond />
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: cbm("gray-300"),
                    textWrap: "pretty",
                  }}
                >
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Oferta: o que está incluso, preço e prazo, sem ninguém precisar perguntar. */
export function LpOffer({ lp }: { lp: LandingConfig }) {
  if (!lp.offer) return null;
  const { heading, includes, price, deadline, note, alternative } = lp.offer;

  return (
    <section data-cm-section="offer" style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div
        style={{
          ...WRAP,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))",
          gap: "clamp(36px,5vw,64px)",
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Reveal variant="wipe">
            <h2 style={{ ...H2, maxWidth: "16ch" }}>{heading}</h2>
          </Reveal>
          <ul
            style={{
              margin: "clamp(26px,4vh,38px) 0 0",
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {includes.map((item, i) => (
              <Reveal key={item} delay={i * 70} variant="side">
                <li
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: cbm("gray-100"),
                  }}
                >
                  <span style={{ marginTop: "0.4em", flex: "none" }}>
                    <Diamond />
                  </span>
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal variant="scale">
          <div
            style={{
              padding: "clamp(24px,3vw,36px)",
              background: SURFACE.raised,
              border: "1px solid rgba(245,242,237,0.12)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: "clamp(26px,3.2vw,40px)",
                lineHeight: 1.1,
                color: "#F5F2ED",
              }}
            >
              {/* O valor nunca quebra entre "R$" e o número. */}
              {price.replace("R$ ", "R$ ")}
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 17,
                color: cbm("gray-100"),
              }}
            >
              {deadline}
            </p>
            <p
              style={{
                margin: "16px 0 0",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.65,
                color: cbm("gray-300"),
              }}
            >
              {note}
            </p>
            <div style={{ marginTop: 26 }}>
              <LpCta label={lp.ctaLabel} message={lp.waMessage} size="lg" source="lp-offer" />
            </div>
            {alternative && (
              <p
                style={{
                  margin: "22px 0 0",
                  paddingTop: 18,
                  borderTop: "1px solid rgba(245,242,237,0.12)",
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: cbm("gray-300"),
                }}
              >
                {alternative}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Como funciona — tira o medo de "quanto tempo isso vai tomar de mim". */
export function LpProcess({ lp }: { lp: LandingConfig }) {
  return (
    <section data-cm-section="process" style={{ background: SURFACE.raised, borderTop: `1px solid ${cbm("border")}` }}>
      <div style={WRAP}>
        <Reveal variant="wipe">
          <h2 style={{ ...H2, marginTop: 22, maxWidth: "18ch" }}>{lp.processHeading}</h2>
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
                    color: cbm("gray-300"),
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
 * Rascunhos com PREENCHER ficam de fora: melhor uma pergunta a menos.
 */
export function LpFaq({ lp }: { lp: LandingConfig }) {
  return (
    <section data-cm-section="faq" style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div style={{ ...WRAP, maxWidth: 860 }}>
        <div style={{ marginTop: 32 }}>
          {lp.faq.filter(isFilled).map((f, i) => (
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
    <section data-cm-section="contact" style={{ background: SURFACE.raised, borderTop: `1px solid ${cbm("border")}` }}>
      <div style={{ ...WRAP, textAlign: "center", paddingBlock: "clamp(72px,12vh,128px)" }}>
        <Reveal variant="wipe">
          <h2 style={{ ...H2, margin: "0 auto", maxWidth: "16ch" }}>{lp.final.heading}</h2>
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
              color: cbm("gray-200"),
            }}
          >
            {lp.final.text}
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
