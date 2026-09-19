import { AVAILABILITY, HERO } from "@/data/home";
import { waLink } from "@/lib/contact";
import { Diamond, PANCHANG, SATOSHI, SURFACE } from "./shared";
import { HeroLandscape } from "./HeroLandscape";

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");

/** Entrada em stagger, rodando uma vez. Não é scroll-driven. */
const enter = (delay: number): React.CSSProperties => ({
  opacity: 0,
  animation: `cbmIn 0.8s cubic-bezier(0.33,1,0.68,1) ${delay}s both`,
});

/**
 * Hero — tipo em escala grande sobre os fragmentos triangulados da marca.
 *
 * Sem mockup e sem foto: a imagem de fundo é a própria geometria da CbM, o
 * único ativo visual autoral que o estúdio tem. As duas palavras do `lead`
 * são a CATEGORIA, não a frase — é isso que permite a escala, porque duas
 * palavras aguentam 168px e uma sentença não.
 */
export function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100dvh",
        maxWidth: 1440,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding:
          "clamp(92px,12vh,132px) clamp(24px,5vw,80px) clamp(48px,7vh,80px)",
      }}
    >
      <HeroLandscape />

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {/* Linha de topo: categoria à esquerda, praça à direita */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingBottom: 26,
            borderBottom: "1px solid rgba(245,242,237,0.1)",
            ...enter(0.05),
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: SATOSHI,
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#FB3640",
            }}
          >
            <span
              aria-hidden
              style={{ display: "block", width: 24, height: 1, background: "rgba(251,54,64,0.5)" }}
            />
            {HERO.eyebrow}
          </span>
          <span
            style={{
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#9B9791",
            }}
          >
            {HERO.meta}
          </span>
        </div>

        {/* Tudo alinhado à direita: a metade esquerda fica pra paisagem */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "clamp(32px,6vh,64px)",
          }}
        >
          <div
            style={{
              width: "min(100%, 820px)",
              containerType: "inline-size",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: PANCHANG,
                fontWeight: 800,
                /** Amarrado ao container, não à viewport: a palavra mais
                 *  larga encosta nas margens sem nunca ser cortada. */
                fontSize: "clamp(58px,20.4cqw,230px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.82,
                color: "#F5F2ED",
                ...enter(0.16),
              }}
            >
              {HERO.lead.map((word, i) => (
                <span key={word} style={{ display: "block", whiteSpace: "nowrap" }}>
                  {word}
                  {i === 0 && (
                    <span
                      aria-hidden
                      style={{
                        color: "#FB3640",
                        fontSize: "0.3em",
                        verticalAlign: "super",
                        marginLeft: "0.06em",
                        letterSpacing: 0,
                      }}
                    >
                      ✳
                    </span>
                  )}
                </span>
              ))}
            </h1>

            <p
              style={{
                margin: "clamp(26px,4vh,40px) 0 0",
                maxWidth: "26ch",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: "clamp(18px,2.1vw,27px)",
                letterSpacing: "-0.012em",
                lineHeight: 1.22,
                color: "#F5F2ED",
                textWrap: "balance",
                ...enter(0.3),
              }}
            >
              {HERO.headline}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 20,
                marginTop: 30,
                ...enter(0.42),
              }}
            >
              <a
                href="#projetos"
                className="site-link-underline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: PANCHANG,
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#F5F2ED",
                  borderBottom: "1px solid #FB3640",
                  paddingBottom: 4,
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
              >
                {HERO.ctaSecondary}
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="site-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#FB3640",
                  color: SURFACE.base,
                  padding: "16px 30px",
                  fontFamily: PANCHANG,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "background 150ms ease",
                }}
              >
                {HERO.ctaPrimary}
              </a>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                marginTop: "clamp(28px,4vh,44px)",
                ...enter(0.54),
              }}
            >
              {AVAILABILITY.map((a) => (
                <span
                  key={a.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: a.filled ? "#B4B0AA" : "#9B9791",
                  }}
                >
                  <span className={a.filled ? "site-pulse" : undefined} style={{ display: "flex" }}>
                    <Diamond filled={a.filled} color={a.filled ? "#FB3640" : "#9B9791"} />
                  </span>
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
