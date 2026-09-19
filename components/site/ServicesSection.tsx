import { SERVICES } from "@/data/services";
import { SECTIONS } from "@/data/home";
import { Diamond, INK, PANCHANG, SATOSHI } from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Os 3 serviços — a lasca de luz que corta o escuro.
 *
 * É a única seção invertida da página, e isso é o ponto: seis seções escuras
 * em fila achatam o ritmo, e um bloco claro no meio quebra mais que qualquer
 * animação. Fica aqui, e não em outra, porque é onde a pessoa avalia "como eu
 * compro" — lista densa (3 serviços × 5 itens) lê melhor no claro.
 *
 * Sangra de ponta a ponta, rompendo o container de 1440 das outras seções.
 * Cantos retos: `border-radius: 0` é regra dura da marca.
 */
export function ServicesSection() {
  return (
    <section id="servicos" style={{ background: INK.base }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "clamp(84px,12vh,140px) clamp(24px,5vw,80px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: "clamp(44px,6vh,68px)",
          }}
        >
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden style={{ display: "block", width: 24, height: 1, background: "#FB3640" }} />
              <span
                style={{
                  fontFamily: SATOSHI,
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: INK.signal,
                }}
              >
                {SECTIONS.servicos.label}
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2
              style={{
                margin: 0,
                maxWidth: "20ch",
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: "clamp(30px,4vw,52px)",
                letterSpacing: "-0.012em",
                lineHeight: 1.04,
                color: INK.ink,
                textWrap: "balance",
              }}
            >
              {SECTIONS.servicos.heading}
            </h2>
          </Reveal>

          <Reveal delay={240}>
            <p
              style={{
                margin: 0,
                maxWidth: "60ch",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: "clamp(15px,1.4vw,17px)",
                lineHeight: 1.7,
                color: INK.body,
                textWrap: "pretty",
              }}
            >
              {SECTIONS.servicos.sub}
            </p>
          </Reveal>
        </div>

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
                className="site-service-card-light"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  minWidth: 0,
                  border: `1px solid ${INK.border}`,
                  background: INK.card,
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
                      color: INK.signal,
                    }}
                  >
                    {s.index}
                  </span>
                  <span aria-hidden style={{ display: "block", flex: 1, height: 1, background: INK.border }} />
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontFamily: PANCHANG,
                    fontWeight: 700,
                    fontSize: "clamp(22px,2.3vw,27px)",
                    letterSpacing: "-0.005em",
                    color: INK.ink,
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
                    color: INK.body,
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
                        color: INK.body,
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
                    borderTop: `1px solid ${INK.border}`,
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
                      color: INK.muted,
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
                      color: INK.body,
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
