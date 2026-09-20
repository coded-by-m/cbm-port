import { SECTIONS } from "@/data/home";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  waLink,
} from "@/lib/contact";
import { PANCHANG, SATOSHI, SECTION, SURFACE } from "./shared";

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");

/** Fechamento: convite + WhatsApp + Instagram. */
export function ContactSection() {
  return (
    <section id="contato" style={SECTION}>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "flex-start" }}>
        <h2
          style={{
            margin: 0,
            maxWidth: "16ch",
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: "clamp(34px,5.4vw,68px)",
            letterSpacing: "-0.012em",
            lineHeight: 1,
            color: "#F5F2ED",
            textWrap: "balance",
          }}
        >
          {SECTIONS.contato.heading}
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: "56ch",
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: "clamp(15px,1.4vw,17px)",
            lineHeight: 1.7,
            color: "#C8C4BE",
            textWrap: "pretty",
          }}
        >
          {SECTIONS.contato.sub}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
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
              padding: "18px 34px",
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 150ms ease",
            }}
          >
            {WHATSAPP_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-link-underline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: SATOSHI,
              fontWeight: 500,
              fontSize: 15,
              color: "#F5F2ED",
              borderBottom: "1px solid rgba(251,54,64,0.6)",
              paddingBottom: 4,
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
          >
            {INSTAGRAM_HANDLE}
            <span style={{ color: "#FB3640" }}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
