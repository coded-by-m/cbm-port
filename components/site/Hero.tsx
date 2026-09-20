import { AVAILABILITY, HERO } from "@/data/home";
import { waLink } from "@/lib/contact";
import { Diamond, LogoMarkSvg, PANCHANG, SATOSHI, SURFACE } from "./shared";
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
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: "#9B9791",
  whiteSpace: "nowrap",
};

/**
 * Hero — a marca ancorada à esquerda, a categoria abaixo dela.
 *
 * Três faixas em 100dvh: régua de topo com a marca, o miolo com o par
 * tipo/texto, e régua de rodapé com o estado da agenda. O miolo cresce pra
 * ocupar a sobra, então as réguas ficam presas nos extremos.
 *
 * As duas colunas do miolo assentam na MESMA linha inferior.
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

      {/* Véu que leva o pé do hero de volta ao fundo da página. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          width: "100vw",
          transform: "translateX(-50%)",
          bottom: 0,
          height: "38%",
          zIndex: 0,
          pointerEvents: "none",
          background: `linear-gradient(to bottom, rgba(4,8,6,0) 0%, rgba(4,8,6,0.75) 62%, ${SURFACE.base} 100%)`,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Régua de topo: a marca à esquerda, a disciplina à direita */}
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
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: "clamp(19px,2.2vw,30px)",
              letterSpacing: "-0.01em",
              color: "#F5F2ED",
              whiteSpace: "nowrap",
            }}
          >
            <LogoMarkSvg size={20} stroke={11} />
            Coded <span style={{ color: "#FB3640" }}>by</span> M
          </span>
          <span style={META}>{HERO.meta}</span>
        </div>

        {/* Miolo: categoria à esquerda, texto à direita, mesma base */}
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
            <div
              style={{ flex: "1 1 300px", minWidth: 0, containerType: "inline-size" }}
            >
              <h1
                /* Liga o cursor-triângulo da marca sobre a palavra. */
                data-cursor="triangle"
                style={{
                  margin: 0,
                  cursor: "none",
                  fontFamily: PANCHANG,
                  fontWeight: 800,
                  /* Amarrado à largura do container E à altura da tela, pra
                     nunca cortar a palavra nem estourar a dobra. */
                  fontSize: "clamp(42px, min(14.5cqw, 16vh), 190px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.84,
                  color: "#F5F2ED",
                  ...enter(0.16),
                }}
              >
                {HERO.lead.map((word, i) => (
                  <span key={word} style={{ display: "block", whiteSpace: "nowrap" }}>
                    {word.split("").map((ch, j) => (
                      <span
                        key={`${word}-${j}`}
                        className="site-letter"
                        /* Cascata: cada letra entra 38ms depois da anterior,
                           e a segunda palavra começa onde a primeira terminou. */
                        style={{ animationDelay: `${0.18 + i * 0.24 + j * 0.038}s` }}
                      >
                        {ch}
                      </span>
                    ))}
                    {i === 0 && (
                      <span
                        aria-hidden
                        className="site-letter"
                        style={{
                          display: "inline-block",
                          color: "#FB3640",
                          fontSize: "0.46em",
                          lineHeight: 1,
                          verticalAlign: "top",
                          transform: "translateY(-0.06em)",
                          marginLeft: "0.02em",
                          letterSpacing: 0,
                          animationDelay: `${0.18 + word.length * 0.038}s`,
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
                flex: "0 1 400px",
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
                  fontSize: "clamp(17px,1.7vw,24px)",
                  letterSpacing: "-0.014em",
                  lineHeight: 1.24,
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
                  marginTop: "clamp(20px,2.6vh,28px)",
                  fontFamily: PANCHANG,
                  fontWeight: 600,
                  fontSize: 10.5,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#F5F2ED",
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
                  marginTop: "clamp(14px,2vh,20px)",
                  background: "#FB3640",
                  color: SURFACE.base,
                  padding: "16px 26px",
                  fontFamily: PANCHANG,
                  fontWeight: 700,
                  fontSize: 12,
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
