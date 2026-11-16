import { HERO } from "@/data/home";
import { WA_TEXT, waLink } from "@/lib/contact";
import { PANCHANG, SATOSHI, SURFACE, TriangleMark, Diamond } from "./shared";
import { HeroLandscape } from "./HeroLandscape";
import { cbm } from "@/lib/palette";
import { FillButton } from "@/components/ui/FillButton";

const WA = waLink(WA_TEXT.projeto);

/**
 * Hero da home.
 *
 * A promessa (o que se vende e onde) é o título. O nome da marca fica numa
 * linha curta, menor que o título. O CTA vermelho e a linha de confiança
 * ficam na mesma coluna do benefício, acima da faixa de cookies.
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
          "clamp(88px,11vh,124px) clamp(24px,5vw,80px) calc(clamp(20px,3vh,36px) + var(--cbm-consent-bar, 0px))",
      }}
    >
      <HeroLandscape />

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
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px 20px",
            paddingBottom: "clamp(14px,2vh,20px)",
            borderBottom: "1px solid rgba(245,242,237,0.16)",
          }}
        >
          <span style={META}>{HERO.eyebrow}</span>
          <span style={{ ...META, color: "#F5F2ED", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Diamond size={6} />
            {HERO.ownership}
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "clamp(22px,4vh,52px) 0",
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
            <div style={{ flex: "1 1 340px", minWidth: 0 }}>
              <p style={BRAND} aria-label="Coded by M">
                <span aria-hidden="true">Coded</span>
                <span aria-hidden="true" style={{ color: "#FB3640" }}>by</span>
                <span aria-hidden="true">M</span>
                <TriangleMark
                  strokeWidth={8}
                  drawDelay={0.15}
                  style={{ width: "0.7em" }}
                />
              </p>
              <h1 style={LEAD}>{HERO.lead}</h1>
            </div>

            <div className="hero-copy">
              <p style={BENEFIT}>{HERO.benefit}</p>

              <a
                href="#projetos"
                data-cm-role="primary-cta"
                data-cm-id="hero-projects"
                className="site-link-underline"
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  marginTop: "clamp(18px,2.4vh,26px)",
                  fontFamily: PANCHANG,
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#F5F2ED",
                  paddingBottom: 5,
                  textDecoration: "none",
                }}
              >
                {HERO.ctaSecondary}
              </a>

              <FillButton
                href={WA}
                target="_blank"
                full
                data-cm-role="whatsapp"
                data-cm-id="hero-whatsapp"
                style={{ marginTop: "clamp(14px,2vh,18px)", padding: "16px 26px", fontSize: 13, letterSpacing: "0.12em" }}
              >
                {HERO.ctaPrimary}
              </FillButton>

              <p style={TRUST}>
                {HERO.trustLead}{" "}
                <span style={{ color: "#F5F2ED", fontWeight: 500 }}>{HERO.trustProof}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Legenda do topo. 14px e cinza 200: contraste acima de 4,5:1 no fundo #0A0A0A. */
const META: React.CSSProperties = {
  fontFamily: SATOSHI,
  fontWeight: 500,
  fontSize: 14,
  letterSpacing: "0.06em",
  lineHeight: 1.45,
  textTransform: "uppercase",
  color: cbm("gray-200"),
};

/** Nome da marca. O teto (26px) fica abaixo do piso do título (32px). */
const BRAND: React.CSSProperties = {
  margin: "0 0 16px",
  display: "flex",
  alignItems: "center",
  gap: "0.28em",
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: "clamp(18px, 2vw, 26px)",
  letterSpacing: "-0.03em",
  lineHeight: 1,
  color: "#F5F2ED",
};

const LEAD: React.CSSProperties = {
  margin: 0,
  maxWidth: "16ch",
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: "clamp(32px, 4.4vw, 58px)",
  letterSpacing: "-0.03em",
  lineHeight: 1.02,
  color: "#F5F2ED",
  textWrap: "balance",
};

const BENEFIT: React.CSSProperties = {
  margin: 0,
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: "clamp(16px, 1.45vw, 20px)",
  letterSpacing: "0",
  lineHeight: 1.5,
  color: "#F5F2ED",
  textWrap: "pretty",
};

const TRUST: React.CSSProperties = {
  margin: "14px 0 0",
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 15,
  lineHeight: 1.5,
  color: cbm("gray-200"),
  textWrap: "pretty",
};
