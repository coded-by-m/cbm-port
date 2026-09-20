import { AVAILABILITY, HERO } from "@/data/home";
import { waLink } from "@/lib/contact";
import { Diamond, PANCHANG, SATOSHI, SURFACE, TriangleMark } from "./shared";
import { StrokeText } from "@/components/ui/StrokeText";
import { STROKE_LINE_HEIGHT } from "@/components/ui/strokeMetrics";
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
          <span style={META}>{HERO.eyebrow}</span>
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
                  fontSize: "clamp(38px, min(15.5cqw, 15vh), 190px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.84,
                  color: "#F5F2ED",
                  ...enter(0.16),
                }}
              >
                {/* A marca se desenha. Uma instância por linha, encadeadas
                    pelo `delay`, com a caixa vertical fixa do StrokeText pra
                    as duas saírem no mesmo corpo.

                    O contorno entra no vermelho do sinal e o osso inunda
                    depois — o vermelho aqui é gesto, não elemento fixo, então
                    não gasta a cota de raridade da dobra. */}
                {HERO.brand.map((word, i) => (
                  <span
                    key={word}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.06em",
                      /* Reencosta as linhas: a caixa do StrokeText tem a
                         altura da métrica, o desenho pede o entrelinha
                         apertado que a marca sempre teve. */
                      marginTop: i === 0 ? 0 : `${0.84 - STROKE_LINE_HEIGHT}em`,
                    }}
                  >
                    <StrokeText
                      text={word}
                      fontFamily={PANCHANG}
                      fontWeight={800}
                      letterSpacing={-0.04 * 128}
                      strokeColor="#FB3640"
                      fillColor="#F5F2ED"
                      strokeWidth={1.8}
                      drawDuration={1.05}
                      stagger={0.06}
                      fillDelay={0.1}
                      delay={0.2 + i * 0.34}
                      /* O cursor redesenha a palavra: é o gesto de hover da
                         marca, no lugar do realce letra a letra. */
                      replayOnHover
                    />

                    {i === 0 && (
                      <TriangleMark
                        strokeWidth={6}
                        /* Entra junto com a última letra de "Coded". */
                        drawDelay={0.2 + 5 * 0.06}
                        style={{ width: "0.3em", marginTop: "0.06em" }}
                      />
                    )}
                  </span>
                ))}

                {/* A categoria, abaixo da marca e em corpo bem menor */}
                <span
                  className="site-letter"
                  style={{
                    display: "block",
                    /* Em do PRÓPRIO corpo (0.3em do h1), então o número é
                       grande de propósito: 0.9em aqui dá ~35px no desktop e
                       encolhe junto com a marca. */
                    marginTop: "0.9em",
                    fontSize: "0.3em",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                    color: "#B4B0AA",
                    animationDelay: "0.72s",
                  }}
                >
                  {HERO.lead}
                </span>
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
