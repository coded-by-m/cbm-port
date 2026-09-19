import { INSTAGRAM_URL, waLink } from "@/lib/contact";
import { PANCHANG, SATOSHI } from "./shared";

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");

const LINKS = [
  { label: "Início", href: "#top", external: false },
  { label: "Projetos", href: "#projetos", external: false },
  { label: "A Experiência", href: "/experiencia", external: false },
  { label: "Instagram", href: INSTAGRAM_URL, external: true },
  { label: "Contato", href: WA, external: true },
];

const linkStyle: React.CSSProperties = {
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#B4B0AA",
  textDecoration: "none",
  transition: "color 160ms ease",
};

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid #111511" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "32px clamp(24px,5vw,80px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: 14,
            color: "#F5F2ED",
            whiteSpace: "nowrap",
          }}
        >
          Coded <span style={{ color: "#FB3640" }}>by</span> M
        </span>
        <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 22 }}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="site-footer-link"
              style={linkStyle}
              {...(l.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <span
          style={{
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9B9791",
            whiteSpace: "nowrap",
          }}
        >
          Florianópolis · SC · 2026
        </span>
      </div>
    </footer>
  );
}
