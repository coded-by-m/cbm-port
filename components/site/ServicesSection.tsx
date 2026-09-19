import { SERVICES } from "@/data/services";
import { SECTIONS } from "@/data/home";
import { Diamond, PANCHANG, SATOSHI, SECTION, SURFACE, ScaleMark, SectionHead } from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/** Os 3 serviços como cards de texto. Sem as mini-cenas 3D da experiência. */
export function ServicesSection() {
  return (
    <section id="servicos" style={{ ...SECTION, position: "relative", overflow: "hidden" }}>
      <ScaleMark>03</ScaleMark>
      <div style={{ position: "relative", zIndex: 1 }}>
      <SectionHead
        label={SECTIONS.servicos.label}
        heading={SECTIONS.servicos.heading}
        sub={SECTIONS.servicos.sub}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))",
          gap: "clamp(20px,2.4vw,28px)",
        }}
      >
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={i * 110} className="site-cell">
          <article
            className="site-service-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              minWidth: 0,
              border: "1px solid rgba(245,242,237,0.12)",
              background: SURFACE.sunken,
              padding: "clamp(22px,2.4vw,30px)",
              transition: "border-color 300ms ease, background 300ms ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontFamily: PANCHANG,
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  color: "#FB3640",
                }}
              >
                {s.index}
              </span>
              <span aria-hidden style={{ display: "block", flex: 1, height: 1, background: "rgba(245,242,237,0.14)" }} />
            </div>

            <h3
              style={{
                margin: 0,
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: "clamp(22px,2.3vw,27px)",
                letterSpacing: "-0.005em",
                color: "#F5F2ED",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.7,
                color: "#C8C4BE",
                textWrap: "pretty",
              }}
            >
              {s.description}
            </p>

            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 9,
              }}
            >
              {s.includes.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 13,
                    color: "#B4B0AA",
                  }}
                >
                  <Diamond size={5} />
                  {item}
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: "auto",
                borderTop: "1px solid rgba(245,242,237,0.1)",
                paddingTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 7,
              }}
            >
              <span
                style={{
                  fontFamily: SATOSHI,
                  fontWeight: 500,
                  fontSize: 9,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#9B9791",
                }}
              >
                Indicado para
              </span>
              <p
                style={{
                  margin: 0,
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "#B4B0AA",
                  textWrap: "pretty",
                }}
              >
                {s.indicatedFor}
              </p>
            </div>
          </article>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
