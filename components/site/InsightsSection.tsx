import { SECTIONS } from "@/data/home";
import { cbm } from "@/lib/palette";
import { PANCHANG, SATOSHI, SECTION } from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/** Coded Insights, valor de acompanhamento sem inventar uma tela ou métricas. */
export function InsightsSection() {
  return (
    <section
      id="insights"
      data-cm-section="insights"
      style={{
        ...SECTION,
        background: cbm("raised"),
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          alignItems: "end",
          gap: "clamp(28px,5vw,72px)",
        }}
      >
        <Reveal variant="wipe">
          <div>
            <p
              style={{
                margin: "0 0 18px",
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: cbm("gray-400"),
              }}
            >
              {SECTIONS.insights.label}
            </p>
            <h2
              style={{
                margin: 0,
                maxWidth: "18ch",
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: "clamp(30px,4vw,52px)",
                letterSpacing: "-0.012em",
                lineHeight: 1.04,
                color: cbm("white"),
                textWrap: "balance",
              }}
            >
              {SECTIONS.insights.heading}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p
            style={{
              margin: 0,
              maxWidth: "58ch",
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: "clamp(16px,1.5vw,19px)",
              lineHeight: 1.7,
              color: cbm("gray-100"),
              textWrap: "pretty",
            }}
          >
            {SECTIONS.insights.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
