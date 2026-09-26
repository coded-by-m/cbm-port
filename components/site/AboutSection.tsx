import { ABOUT, VALUES } from "@/data/about";
import {
  Diamond,
  LogoMarkSvg,
  PANCHANG,
  SATOSHI,
  SECTION,
  SURFACE,
} from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Sobre — o símbolo ampliado à esquerda, o manifesto e a assinatura à direita,
 * os valores embaixo.
 *
 * O quadro do símbolo é grande de propósito: enquanto não há retrato do
 * fundador (`ABOUT.founder.photo`), ele é o objeto da seção, e um selo pequeno
 * ao lado de um bloco de texto longo não sustenta esse papel. Quando a foto
 * entrar, ela ocupa exatamente este quadro.
 *
 * As capacidades saíram daqui e viraram seção própria: espremidas na coluna
 * da direita, competiam com a bio pela mesma leitura.
 */
export function AboutSection() {
  return (
    <section id="sobre" data-cm-section="about" style={SECTION}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
          gap: "clamp(36px,6vw,96px)",
          alignItems: "center",
        }}
      >
        <Reveal variant="scale" className="site-cell">
          <div
            style={{
              position: "relative",
              minWidth: 0,
              aspectRatio: "1/1",
              maxWidth: 520,
              border: "1px solid rgba(245,242,237,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                width: 18,
                height: 18,
                borderLeft: "1px solid rgba(251,54,64,0.55)",
                borderTop: "1px solid rgba(251,54,64,0.55)",
              }}
            />
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                width: 18,
                height: 18,
                borderRight: "1px solid rgba(251,54,64,0.55)",
                borderBottom: "1px solid rgba(251,54,64,0.55)",
              }}
            />

            <LogoMarkSvg size="52%" stroke={8} />

            <span
              style={{
                position: "absolute",
                left: 16,
                bottom: 16,
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#8E8A84",
              }}
            >
              Coded by M
            </span>
          </div>
        </Reveal>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "clamp(24px,3vh,34px)" }}>
          <Reveal variant="wipe">
            <h2
              style={{
                margin: 0,
                maxWidth: "38ch",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: "clamp(22px,2.8vw,38px)",
                letterSpacing: "-0.008em",
                lineHeight: 1.28,
                color: "#F5F2ED",
                textWrap: "pretty",
              }}
            >
              {ABOUT.manifesto}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <div
              style={{
                maxWidth: "56ch",
                borderLeft: "2px solid rgba(251,54,64,0.45)",
                paddingLeft: 24,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <p style={{ margin: 0, fontFamily: PANCHANG, fontWeight: 600, fontSize: 18, color: "#F5F2ED" }}>
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
                  margin: "8px 0 0",
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
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
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
          </Reveal>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
          gap: 1,
          background: "rgba(245,242,237,0.12)",
          border: "1px solid rgba(245,242,237,0.12)",
          marginTop: "clamp(44px,8vh,80px)",
        }}
      >
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 110} variant="side" className="site-cell">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minWidth: 0,
                background: SURFACE.base,
                padding: "clamp(22px,2.4vw,30px)",
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
                  fontSize: "clamp(19px,1.9vw,23px)",
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
