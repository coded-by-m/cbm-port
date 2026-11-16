import { HERO } from "@/data/home";
import { contextualWaLink } from "@/lib/contact";
import { PANCHANG, SATOSHI, SURFACE, TriangleMark } from "./shared";
import { HeroLandscape } from "./HeroLandscape";
import { cbm } from "@/lib/palette";
import { FillButton } from "@/components/ui/FillButton";

const WA = contextualWaLink("general");

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
  color: cbm("gray-400"),
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
      data-cm-section="hero"
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
          background: `linear-gradient(to bottom, ${cbm("base", 0)} 0%, ${cbm("base", 0.75)} 62%, ${SURFACE.base} 100%)`,
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
        {/* Régua de topo: marca pequena e localização. */}
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
              gap: 10,
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.01em",
              color: cbm("white"),
            }}
          >
            {HERO.brand}
            <TriangleMark
              strokeWidth={7}
              drawDelay={0.2}
              style={{ width: 12 }}
            />
          </span>
          <span style={META}>{HERO.eyebrow}</span>
        </div>

        {/* Miolo: serviço, benefício, CTA e confiança em uma única leitura. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "clamp(32px,6vh,72px) 0",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 980,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <h1
              style={{
                margin: 0,
                maxWidth: "18ch",
                fontFamily: PANCHANG,
                fontWeight: 800,
                fontSize: "clamp(38px,7.2vw,92px)",
                letterSpacing: "-0.035em",
                lineHeight: 0.96,
                color: cbm("white"),
                textWrap: "balance",
                ...enter(0.16),
              }}
            >
              {HERO.lead}
            </h1>

            <p
              style={{
                margin: "clamp(22px,3vh,32px) 0 0",
                maxWidth: "62ch",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: "clamp(17px,1.8vw,23px)",
                lineHeight: 1.5,
                color: cbm("gray-100"),
                textWrap: "balance",
                ...enter(0.32),
              }}
            >
              {HERO.headline}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "14px 24px",
                marginTop: "clamp(26px,4vh,38px)",
                ...enter(0.42),
              }}
            >
              <FillButton
                href={WA}
                target="_blank"
                data-cm-role="whatsapp"
                data-cm-id="hero-whatsapp"
                style={{ padding: "17px 28px", fontSize: 12, letterSpacing: "0.14em" }}
              >
                {HERO.ctaPrimary}
              </FillButton>
              <a
                href="#projetos"
                data-cm-role="primary-cta"
                data-cm-id="hero-projects"
                className="site-link-underline"
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
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
            </div>

            <p
              style={{
                margin: "clamp(18px,2.5vh,24px) 0 0",
                maxWidth: "72ch",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 13,
                lineHeight: 1.6,
                color: cbm("gray-200"),
                textWrap: "pretty",
                ...enter(0.52),
              }}
            >
              {HERO.trust}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
