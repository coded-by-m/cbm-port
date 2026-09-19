import { cases } from "@/data/cases";
import { SECTIONS } from "@/data/home";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import { BASE_RGB, PANCHANG, SATOSHI, SECTION, SUNKEN_RGB, SURFACE, SectionHead } from "./shared";

/**
 * Grade dos 6 projetos publicados. Cada card mostra a fatia de topo do
 * `desktop-tall`, a tag colorida por tipo e o link para o site no ar.
 */
export function ProjectsSection() {
  const published = cases.filter((c) => c.status === "published");

  return (
    <section id="projetos" style={SECTION}>
      <SectionHead
        label={SECTIONS.projetos.label}
        heading={SECTIONS.projetos.heading}
        sub={SECTIONS.projetos.sub}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          gap: "clamp(20px,2.4vw,32px)",
        }}
      >
        {published.map((c) => (
          <article
            key={c.slug}
            className="site-card"
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              border: "1px solid rgba(245,242,237,0.12)",
              background: SURFACE.sunken,
              transition: "border-color 300ms ease",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "clamp(200px,24vh,260px)",
                overflow: "hidden",
                borderBottom: "1px solid rgba(245,242,237,0.1)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.preview?.desktop ?? ""}
                alt={`${c.title} — ${c.meta.tipo}`}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  height: 90,
                  background:
                    `linear-gradient(to bottom,rgba(${SUNKEN_RGB},0),rgba(${SUNKEN_RGB},0.95))`,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: `rgba(${BASE_RGB},0.82)`,
                  padding: "5px 10px",
                  fontFamily: SATOSHI,
                  fontWeight: 500,
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#F5F2ED",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    width: 6,
                    height: 6,
                    flex: "none",
                    background: c.type
                      ? PROJECT_TYPE_COLOR[c.type]
                      : "#FB3640",
                    transform: "rotate(45deg)",
                  }}
                />
                {c.eyebrow.replace(" / Case Study", "").replace(" Premium", "")}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "22px 22px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: PANCHANG,
                    fontWeight: 700,
                    fontSize: "clamp(19px,1.9vw,23px)",
                    letterSpacing: "-0.005em",
                    color: "#F5F2ED",
                  }}
                >
                  {c.title}
                </h3>
                <span
                  style={{
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#9B9791",
                  }}
                >
                  {c.meta.ano}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "#B4B0AA",
                  textWrap: "pretty",
                }}
              >
                {c.description}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  borderTop: "1px solid rgba(245,242,237,0.1)",
                  paddingTop: 14,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#9B9791",
                  }}
                >
                  {c.meta.setor}
                </span>
                {c.siteUrl && (
                  <a
                    href={`https://${c.siteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-link-underline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      fontFamily: SATOSHI,
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#F5F2ED",
                      textDecoration: "none",
                      transition: "color 160ms ease",
                    }}
                  >
                    {c.siteUrl}
                    <span style={{ color: "#FB3640" }}>↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
