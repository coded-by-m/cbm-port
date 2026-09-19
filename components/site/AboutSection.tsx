import { ABOUT, VALUES } from "@/data/about";
import { SECTIONS } from "@/data/home";
import {
  Diamond,
  LogoMarkSvg,
  PANCHANG,
  SATOSHI,
  SECTION,
  SectionLabel,
  SURFACE,
} from "./shared";

/** Símbolo à esquerda, manifesto e assinatura à direita, valores embaixo. */
export function AboutSection() {
  return (
    <section id="sobre" style={SECTION}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
          gap: "clamp(36px,5vw,64px)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            minWidth: 0,
            aspectRatio: "1/1",
            maxWidth: 320,
            border: "1px solid rgba(245,242,237,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 12,
              height: 12,
              borderLeft: "1px solid rgba(251,54,64,0.5)",
              borderTop: "1px solid rgba(251,54,64,0.5)",
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              width: 12,
              height: 12,
              borderRight: "1px solid rgba(251,54,64,0.5)",
              borderBottom: "1px solid rgba(251,54,64,0.5)",
            }}
          />
          <LogoMarkSvg size={112} stroke={8} />
        </div>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 26 }}>
          <SectionLabel>{SECTIONS.sobre.label}</SectionLabel>
          <h2
            style={{
              margin: 0,
              maxWidth: "38ch",
              fontFamily: PANCHANG,
              fontWeight: 600,
              fontSize: "clamp(20px,2.4vw,32px)",
              letterSpacing: "-0.008em",
              lineHeight: 1.32,
              color: "#F5F2ED",
              textWrap: "pretty",
            }}
          >
            {ABOUT.manifesto}
          </h2>
          <div
            style={{
              maxWidth: "52ch",
              borderLeft: "2px solid rgba(251,54,64,0.45)",
              paddingLeft: 22,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <p style={{ margin: 0, fontFamily: PANCHANG, fontWeight: 600, fontSize: 17, color: "#F5F2ED" }}>
              {ABOUT.founder.name}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#9B9791",
              }}
            >
              {ABOUT.founder.role}
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.7,
                color: "#C8C4BE",
                textWrap: "pretty",
              }}
            >
              {ABOUT.founder.bio}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <Diamond />
              <span
                style={{
                  fontFamily: SATOSHI,
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#B4B0AA",
                }}
              >
                {ABOUT.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
          gap: 1,
          background: "rgba(245,242,237,0.1)",
          border: "1px solid rgba(245,242,237,0.1)",
          marginTop: "clamp(40px,6vh,64px)",
        }}
      >
        {VALUES.map((v, i) => (
          <div
            key={v.title}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minWidth: 0,
              background: SURFACE.base,
              padding: 26,
            }}
          >
            <span
              style={{
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "#FB3640",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: PANCHANG,
                fontWeight: 500,
                fontSize: "clamp(18px,1.8vw,23px)",
                letterSpacing: "-0.005em",
                color: "#F5F2ED",
              }}
            >
              {v.title}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1.65,
                color: "#B4B0AA",
              }}
            >
              {v.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
