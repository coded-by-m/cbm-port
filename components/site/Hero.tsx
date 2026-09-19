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

/** Régua fina das linhas de topo e de rodapé. */
const RULE = "1px solid rgba(245,242,237,0.12)";

const META: React.CSSProperties = {
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 10,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "#9B9791",
  whiteSpace: "nowrap",
};

/**
 * Hero "split alinhado" — wordmark e texto na mesma base.
 *
 * Três faixas empilhadas em 100dvh: régua de topo com a praça, o miolo com
 * o par tipo/texto, e régua de rodapé com o estado da agenda. O miolo cresce
 * pra ocupar a sobra, então as duas réguas ficam presas nos extremos.
 *
 * No miolo, as duas colunas assentam na MESMA linha inferior
 * (`align-items: flex-end`) — é o que o mockup chama de "mesma base".
 *
 * O fundo é a geometria da marca, sangrando a viewport inteira.
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
        padding:
          "clamp(88px,11vh,124px) clamp(24px,5vw,80px) clamp(28px,4vh,44px)",
      }}
    >
      <HeroLandscape />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Régua de topo */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingBottom: "clamp(14px,2vh,20px)",
            borderBottom: RULE,
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
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#FB3640",
            }}
          >
            <span
              aria-hidden
              style={{ display: "block", width: 26, height: 1, background: "#FB3640" }}
            />
            {HERO.eyebrow}
          </span>
          <span style={META}>{HERO.meta}</span>
        </div>

        {/* Miolo: tipo e texto na mesma base */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "clamp(28px,5vh,64px) 0",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "clamp(28px,4vw,72px)",
            }}
          >
            {/* Wordmark */}
            <div
              style={{ flex: "1 1 320px", minWidth: 0, containerType: "inline-size" }}
            >
              <h1
                style={{
                  margin: 0,
                  fontFamily: PANCHANG,
                  fontWeight: 800,
                  /* Amarrado à largura do container E à altura da tela, pra
                     nunca cortar a palavra nem estourar a dobra. */
                  fontSize: "clamp(52px, min(20.4cqw, 23vh), 300px)",
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
                          display: "inline-block",
                          color: "#FB3640",
                          fontSize: "0.46em",
                          lineHeight: 1,
                          verticalAlign: "top",
                          transform: "translateY(-0.06em)",
                          marginLeft: "0.02em",
                          letterSpacing: 0,
                        }}
                      >
                        ✳
                      </span>
                    )}
                  </span>
                ))}
              </h1>
            </div>

            {/* Texto, link e CTA em bloco */}
            <div
              style={{
                flex: "0 1 430px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                ...enter(0.32),
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: PANCHANG,
                  fontWeight: 600,
                  fontSize: "clamp(18px,1.85vw,26px)",
                  letterSpacing: "-0.014em",
                  lineHeight: 1.22,
                  color: "#F5F2ED",
                  textWrap: "balance",
                }}
              >
                {HERO.headline}
              </p>

              <a
                href="#projetos"
                className="site-link-underline"
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  marginTop: "clamp(22px,3vh,32px)",
                  fontFamily: PANCHANG,
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#F5F2ED",
                  borderBottom: "1px solid #FB3640",
                  paddingBottom: 5,
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "clamp(16px,2.4vh,24px)",
                  background: "#FB3640",
                  color: SURFACE.base,
                  padding: "19px 28px",
                  fontFamily: PANCHANG,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  textDecoration: "none",
                  transition: "background 150ms ease",
                }}
              >
                {HERO.ctaPrimary}
              </a>
            </div>
          </div>
        </div>

        {/* Régua de rodapé */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingTop: "clamp(14px,2vh,20px)",
            borderTop: RULE,
            ...enter(0.5),
          }}
        >
          {AVAILABILITY.map((a) => (
            <span
              key={a.label}
              style={{
                ...META,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                color: a.filled ? "#B4B0AA" : "#9B9791",
              }}
            >
              {a.filled && (
                <span className="site-pulse" style={{ display: "flex" }}>
                  <Diamond />
                </span>
              )}
              {a.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
