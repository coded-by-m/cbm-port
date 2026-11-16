import { SATOSHI, SECTION } from "./shared";
import { cbm } from "@/lib/palette";

/**
 * Painel de visitas. Só o que o produto faz de fato: contagem e origem,
 * sem dado pessoal e sem número de exemplo.
 */
export function InsightsSection() {
  return (
    <section id="visitas" data-cm-section="insights" style={SECTION}>
      <p
        style={{
          margin: 0,
          fontFamily: SATOSHI,
          fontWeight: 500,
          fontSize: 14,
          letterSpacing: "0.08em",
          lineHeight: 1.4,
          textTransform: "uppercase",
          color: cbm("gray-200"),
        }}
      >
        Coded Insights
      </p>
      <h2
        style={{
          margin: "14px 0 0",
          maxWidth: "18ch",
          fontFamily: '"Panchang", sans-serif',
          fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 44px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          color: "#F5F2ED",
          textWrap: "balance",
        }}
      >
        Painel de visitas
      </h2>
      <p
        style={{
          margin: "18px 0 0",
          maxWidth: "58ch",
          fontFamily: SATOSHI,
          fontWeight: 400,
          fontSize: "clamp(16px, 1.4vw, 18px)",
          lineHeight: 1.6,
          color: cbm("gray-200"),
          textWrap: "pretty",
        }}
      >
        O Coded Insights é um painel próprio. Nele você acompanha quantas pessoas entram no site e de onde vêm, sem dado pessoal.
      </p>
    </section>
  );
}
