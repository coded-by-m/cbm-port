import { AVAILABILITY, HERO } from "@/data/home";
import { SERVICES } from "@/data/services";
import { waLink } from "@/lib/contact";
import { Diamond, PANCHANG, SATOSHI, SURFACE } from "./shared";
import { HeroLandscape } from "./HeroLandscape";

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");

/** Entrada em stagger, rodando uma vez. Não é scroll-driven. */
const enter = (delay: number): React.CSSProperties => ({
  opacity: 0,
  animation: `cbmIn 0.8s cubic-bezier(0.33,1,0.68,1) ${delay}s both`,
});

/**
 * Hero — tipo em escala grande sobre os fragmentos triangulados da marca.
 *
 * Sem mockup e sem foto: a imagem de fundo é a própria geometria da CbM, o
 * único ativo visual autoral que o estúdio tem. As duas palavras do `lead`
 * são a CATEGORIA, não a frase — é isso que permite a escala, porque duas
 * palavras aguentam 168px e uma sentença não.
 */
export function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        maxWidth: 1440,
        margin: "0 auto",
        padding:
          "clamp(104px,13vh,150px) clamp(24px,5vw,80px) clamp(64px,9vh,104px)",
      }}
    >
      <HeroLandscape />

      <div style={{ position: "relative", zIndex: 1, containerType: "inline-size" }}>
        {/* Linha de topo: categoria à esquerda, praça à direita */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingBottom: 26,
            borderBottom: "1px solid rgba(245,242,237,0.1)",
            ...enter(0.05),
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: SATOSHI,
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#FB3640",
            }}
          >
            <span
              aria-hidden
              style={{ display: "block", width: 24, height: 1, background: "rgba(251,54,64,0.5)" }}
            />
            {HERO.eyebrow}
          </span>
          <span
            style={{
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#9B9791",
            }}
          >
            {HERO.meta}
          </span>
        </div>

        {/* O bloco gigante */}
        <h1
          style={{
            margin: "clamp(28px,4vh,44px) 0 0",
            fontFamily: PANCHANG,
            fontWeight: 800,
            /**
             * Medido: "Websoftware" ocupa ~10em. Com `vw` não havia relação
             * com o container (que trava em 1440), e a palavra era cortada em
             * toda largura. `cqw` amarra o corpo à largura real disponível —
             * o tipo encosta nas duas margens sem transbordar.
             */
            fontSize: "clamp(30px,9.6cqw,150px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.84,
            color: "#F5F2ED",
            ...enter(0.16),
          }}
        >
          {HERO.lead.map((word, i) => (
            <span key={word} style={{ display: "block", whiteSpace: "nowrap" }}>
              {word}
              {i === 0 && (
                <span
                  aria-hidden
                  style={{
                    color: "#FB3640",
                    fontSize: "0.34em",
                    verticalAlign: "super",
                    marginLeft: "0.08em",
                    letterSpacing: 0,
                  }}
                >
                  ✳
                </span>
              )}
            </span>
          ))}
        </h1>

        {/* Frase + apoio + ações, e o bloco de informação à direita */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
            gap: "clamp(32px,5vw,72px)",
            alignItems: "end",
            marginTop: "clamp(36px,5vh,56px)",
          }}
        >
          <div style={{ minWidth: 0, ...enter(0.3) }}>
            <p
              style={{
                margin: 0,
                maxWidth: "24ch",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: "clamp(21px,2.5vw,34px)",
                letterSpacing: "-0.012em",
                lineHeight: 1.18,
                color: "#F5F2ED",
                textWrap: "balance",
              }}
            >
              {HERO.headline}
            </p>
            <p
              style={{
                margin: "20px 0 0",
                maxWidth: "46ch",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: "clamp(14px,1.4vw,16px)",
                lineHeight: 1.75,
                color: "#C8C4BE",
                textWrap: "pretty",
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
                marginTop: 34,
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
          </div>

          {/* Informação: o que se faz, e o estado da agenda */}
          <div
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 22,
              ...enter(0.44),
            }}
          >
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {SERVICES.map((s) => (
                <li
                  key={s.slug}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "11px 0",
                    borderTop: "1px solid rgba(245,242,237,0.1)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: PANCHANG,
                      fontWeight: 600,
                      fontSize: "clamp(14px,1.4vw,17px)",
                      color: "#F5F2ED",
                    }}
                  >
                    {s.title}
                  </span>
                  <span
                    style={{
                      fontFamily: SATOSHI,
                      fontWeight: 400,
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      color: "#9B9791",
                      flex: "none",
                    }}
                  >
                    {s.index}
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {AVAILABILITY.map((a) => (
                <span
                  key={a.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 9,
                    letterSpacing: "0.28em",
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
        </div>
      </div>
    </section>
  );
}
