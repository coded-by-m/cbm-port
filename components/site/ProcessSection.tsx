import { PROCESS_STEPS } from "@/data/process";
import { SECTIONS } from "@/data/home";
import { Diamond, PANCHANG, SATOSHI, SECTION, SectionHead } from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/** As 4 etapas do método — horizontal no desktop, empilhado no mobile. */
export function ProcessSection() {
  return (
    <section id="processo" style={SECTION}>
      <SectionHead
        label={SECTIONS.processo.label}
        heading={SECTIONS.processo.heading}
        sub={SECTIONS.processo.sub}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
          gap: "clamp(24px,3vw,40px)",
        }}
      >
        {PROCESS_STEPS.map((step, i) => (
          <Reveal key={step.num} delay={i * 110} className="site-cell">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              minWidth: 0,
              borderTop: "1px solid rgba(245,242,237,0.16)",
              paddingTop: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Diamond />
              <span
                style={{
                  fontFamily: PANCHANG,
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: "#FB3640",
                }}
              >
                {step.num}
              </span>
            </div>
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
