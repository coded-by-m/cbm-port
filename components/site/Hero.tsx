import { cases } from "@/data/cases";
import { AVAILABILITY, FEATURED_SLUG, HERO } from "@/data/home";
import { waLink } from "@/lib/contact";
import { Diamond, PANCHANG, SATOSHI, SURFACE } from "./shared";
import { HeroShowcase } from "./HeroShowcase";
import { HeroLandscape } from "./HeroLandscape";

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");

/** Entrada em stagger, rodando uma vez. Não é scroll-driven. */
const enter = (delay: number, frame = false): React.CSSProperties => ({
  opacity: 0,
  animation: frame
    ? `cbmFrameIn 1s cubic-bezier(0.22,1,0.36,1) ${delay}s both`
    : `cbmIn 0.8s cubic-bezier(0.33,1,0.68,1) ${delay}s both`,
});

export function Hero() {
  const featured = cases.find((c) => c.slug === FEATURED_SLUG) ?? cases[0];

  return (
    <section
      id="top"
      style={{
        position: "relative",
        maxWidth: 1440,
        margin: "0 auto",
        padding:
          "clamp(116px,14vh,164px) clamp(24px,5vw,80px) clamp(72px,10vh,120px)",
      }}
    >
      <HeroLandscape />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))",
          gap: "clamp(40px,5vw,72px)",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
              ...enter(0.05),
            }}
          >
            <span aria-hidden style={{ display: "block", width: 24, height: 1, background: "rgba(251,54,64,0.5)" }} />
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#FB3640",
              }}
            >
              {HERO.eyebrow}
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: "clamp(44px,6.4vw,80px)",
              letterSpacing: "-0.012em",
              lineHeight: 0.96,
              color: "#F5F2ED",
              textWrap: "balance",
              ...enter(0.18),
            }}
          >
            {HERO.headline}
          </h1>

          <p
            style={{
              margin: "28px 0 0",
              maxWidth: 680,
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: "clamp(15px,1.5vw,17px)",
              lineHeight: 1.75,
              color: "#D2CFC9",
              textWrap: "pretty",
              ...enter(0.32),
            }}
          >
            {HERO.sub}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 20,
              marginTop: 40,
              ...enter(0.46),
            }}
          >
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
            <a
              href={`/cases/${featured.slug}`}
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
              {HERO.ctaSecondary} <span style={{ color: "#FB3640" }}>↗</span>
            </a>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 24,
              marginTop: 48,
              ...enter(0.6),
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
                  fontSize: 10,
                  letterSpacing: "0.3em",
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

        <div style={{ ...enter(0.55, true) }}>
          <HeroShowcase project={featured} />
        </div>

      </div>
    </section>
  );
}
