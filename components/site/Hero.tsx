import { cases } from "@/data/cases";
import { AVAILABILITY, FEATURED_SLUG, HERO } from "@/data/home";
import { waLink } from "@/lib/contact";
import { BASE_RGB, Diamond, PANCHANG, SATOSHI, SURFACE } from "./shared";

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
        maxWidth: 1440,
        margin: "0 auto",
        padding:
          "clamp(116px,14vh,164px) clamp(24px,5vw,80px) clamp(72px,10vh,120px)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))",
          gap: "clamp(40px,5vw,72px)",
          alignItems: "center",
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

        <div style={{ minWidth: 0, position: "relative", ...enter(0.55, true) }}>
          <div
            style={{
              position: "relative",
              border: "1px solid rgba(245,242,237,0.15)",
              background: SURFACE.frame,
              boxShadow: "0 24px 60px -12px rgba(0,0,0,0.85)",
              overflow: "hidden",
              transform:
                "perspective(1600px) rotateY(-3deg) translateX(clamp(0px,1.4vw,22px))",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: "1px solid rgba(245,242,237,0.1)",
                background: SURFACE.frameBar,
                padding: "10px 16px",
              }}
            >
              <span style={{ display: "flex", gap: 6 }} aria-hidden>
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: "#FB3640" }} />
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: "rgba(245,242,237,0.25)" }} />
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: "rgba(245,242,237,0.25)" }} />
              </span>
              <span
                style={{
                  marginLeft: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(245,242,237,0.08)",
                  padding: "4px 12px",
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 10,
                  letterSpacing: "0.05em",
                  color: "#C8C4BE",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="3" y="7" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                {featured.siteUrl}
              </span>
            </div>
            <div style={{ position: "relative", height: "clamp(320px,52vh,520px)", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.preview?.desktop ?? ""}
                alt={`${featured.title} — ${featured.eyebrow}`}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  height: 120,
                  background:
                    `linear-gradient(to bottom,rgba(${BASE_RGB},0),rgba(${BASE_RGB},0.92))`,
                }}
              />
            </div>
            <span
              aria-hidden
              style={{
                pointerEvents: "none",
                position: "absolute",
                bottom: 6,
                right: 6,
                width: 12,
                height: 12,
                borderBottom: "1px solid #FB3640",
                borderRight: "1px solid #FB3640",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginTop: 16,
              paddingRight: "clamp(0px,1.4vw,22px)",
            }}
          >
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#FB3640",
              }}
            >
              {featured.eyebrow.replace(" / Case Study", "")}
            </span>
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#9B9791",
              }}
            >
              {featured.title} · {featured.meta.setor}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
