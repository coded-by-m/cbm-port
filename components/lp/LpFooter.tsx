import Link from "next/link";
import { LpWaLink } from "./LpCta";
import { SATOSHI } from "@/components/site/shared";
import { PRIVACY_PATH } from "@/data/privacidade";
import { WHATSAPP_DISPLAY } from "@/lib/contact";
import { cbm } from "@/lib/palette";

const TEXT: React.CSSProperties = {
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 13,
  color: cbm("gray-300"),
  textDecoration: "none",
};

/** Quem está por trás da página: quem chega por anúncio ainda não conhece o estúdio. */
export function LpFooter({ message }: { message: string }) {
  return (
    <footer style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "28px clamp(20px,4vw,48px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px 28px",
        }}
      >
        <span style={TEXT}>Coded by M · Florianópolis, SC</span>
        <LpWaLink message={message} source="lp-footer" style={TEXT}>
          WhatsApp {WHATSAPP_DISPLAY}
        </LpWaLink>
        <Link href={PRIVACY_PATH} className="site-footer-link" style={TEXT}>
          Política de privacidade
        </Link>
      </div>
    </footer>
  );
}
