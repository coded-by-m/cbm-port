import { PROCESS_STEPS } from "@/data/process";
import { SECTIONS } from "@/data/home";
import { PANCHANG, SATOSHI, SECTION, SectionHead } from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/**
 * As 4 etapas do método como um percurso contínuo.
 *
 * A régua do topo é uma só, atravessando as colunas. Por isso elas não têm
 * `gap` horizontal e sim `padding-right`: com gap, a linha quebraria em cada
 * vão e o percurso deixaria de ser um. O efeito colateral é bom — quando as
 * colunas quebram em telas estreitas, cada fileira ganha a sua régua inteira
 * sem precisar de media query.
 *
 * Os losangos ficam a cavalo sobre a régua: uma caixa de 9px girada 45°,
 * recuada 4px, tem o centro em cima da linha.
 *
 * Os numerais são grandes e quase apagados — presença sem leitura. Só o
 * último acende, porque é o único que não termina no deploy.
 */
export function ProcessSection() {
  const last = PROCESS_STEPS.length - 1;

  return (
    <section id="processo" style={SECTION}>
      <SectionHead
        heading={SECTIONS.processo.heading}
        sub={SECTIONS.processo.sub}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,210px),1fr))",
        }}
      >
        {PROCESS_STEPS.map((step, i) => (
          <Reveal key={step.num} delay={i * 110} variant="side" className="site-cell">
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minWidth: 0,
                borderTop: "1px solid rgba(245,242,237,0.16)",
                paddingTop: "clamp(38px,5vh,58px)",
                paddingRight: "clamp(20px,3vw,48px)",
                paddingBottom: "clamp(20px,3vh,32px)",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: -4,
                  left: 0,
                  width: 9,
                  height: 9,
                  background: "#FB3640",
                  transform: "rotate(45deg)",
                }}
              />

              <span
                aria-hidden
                style={{
                  fontFamily: PANCHANG,
                  fontWeight: 800,
                  fontSize: "clamp(46px,4.6vw,64px)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.03em",
                  color: i === last ? "#FB3640" : "#1E2721",
                }}
              >
                {step.num}
              </span>

              <h3
                style={{
                  margin: 0,
                  fontFamily: PANCHANG,
                  fontWeight: 700,
                  fontSize: "clamp(21px,2.2vw,26px)",
                  letterSpacing: "-0.005em",
                  color: "#F5F2ED",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#B4B0AA",
                  textWrap: "pretty",
                }}
              >
                {step.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
