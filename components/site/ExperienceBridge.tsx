import { SECTIONS } from "@/data/home";
import { HOME_CHAPTERS } from "@/lib/homeChapters";
import { PANCHANG, SATOSHI, SectionLabel } from "./shared";

const COPY = SECTIONS.experiencia;

/** Bracket de canto em vermelho — vocabulário que o bloco Sobre já usa. */
function Bracket({
  corner,
}: {
  corner: "tl" | "br";
}) {
  const tl = corner === "tl";
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: tl ? 12 : undefined,
        left: tl ? 12 : undefined,
        bottom: tl ? undefined : 12,
        right: tl ? undefined : 12,
        width: 12,
        height: 12,
        borderLeft: tl ? "1px solid rgba(251,54,64,0.5)" : undefined,
        borderTop: tl ? "1px solid rgba(251,54,64,0.5)" : undefined,
        borderRight: tl ? undefined : "1px solid rgba(251,54,64,0.5)",
        borderBottom: tl ? undefined : "1px solid rgba(251,54,64,0.5)",
      }}
    />
  );
}

/**
 * Ponte para `/experiencia` — a credencial técnica do estúdio.
 *
 * Faixa de largura total em `forest`, rompendo o container de 1440 das outras
 * seções pra ler como um objeto diferente. Link em <a> e não next/link: o
 * Link faria prefetch da rota WebGL pesada a partir da home, e a navegação
 * limpa é desejável — a experiência é outro modo de aplicação. À direita, os
 * 9 capítulos reais
 * (lidos de lib/homeChapters.ts) desenhados como estrutura: sem screenshot,
 * porque o valor da experiência é o movimento e uma imagem parada vende mal —
 * e porque zero imagem é zero peso numa página que vai receber anúncio.
 */
export function ExperienceBridge() {
  return (
    <section
      id="experiencia"
      style={{
        background: "#070B08",
        borderTop: "1px solid #111511",
        borderBottom: "1px solid #111511",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "clamp(72px,10vh,120px) clamp(24px,5vw,80px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          gap: "clamp(40px,5vw,72px)",
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <SectionLabel>{COPY.label}</SectionLabel>

          <h2
            style={{
              margin: 0,
              maxWidth: "18ch",
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: "clamp(28px,3.6vw,46px)",
              letterSpacing: "-0.012em",
              lineHeight: 1.06,
              color: "#F5F2ED",
              textWrap: "balance",
            }}
          >
            {COPY.heading}
          </h2>

          <p
            style={{
              margin: 0,
              maxWidth: "54ch",
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: "clamp(15px,1.4vw,17px)",
              lineHeight: 1.7,
              color: "#C8C4BE",
              textWrap: "pretty",
            }}
          >
            {COPY.sub}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 20,
              marginTop: 8,
            }}
          >
            <a
              href="/experiencia"
              className="site-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                border: "1px solid rgba(245,242,237,0.55)",
                color: "#F5F2ED",
                padding: "15px 28px",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "border-color 150ms ease, background 150ms ease",
              }}
            >
              {COPY.cta}
              <span style={{ color: "#FB3640" }}>↗</span>
            </a>
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#9B9791",
              }}
            >
              {COPY.note}
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            minWidth: 0,
            border: "1px solid rgba(245,242,237,0.1)",
            padding: "clamp(28px,3vw,40px) clamp(22px,2.6vw,36px)",
          }}
        >
          <Bracket corner="tl" />
          <Bracket corner="br" />
          <ol
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))",
              gap: "2px 28px",
            }}
          >
            {HOME_CHAPTERS.map((ch, i) => (
              <li
                key={ch.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 0",
                  borderBottom: "1px solid rgba(245,242,237,0.07)",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: PANCHANG,
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#FB3640",
                    flex: "none",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    color: "#B4B0AA",
                    overflowWrap: "anywhere",
                  }}
                >
                  {ch.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
