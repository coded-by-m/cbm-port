import type { Metadata } from "next";
import Link from "next/link";
import { PANCHANG, SATOSHI, SURFACE } from "@/components/site/shared";
import { waLink } from "@/lib/contact";

/**
 * 404 — responde com status 404 (o Next garante) e devolve a pessoa a um
 * lugar útil: a home, os projetos ou o contato. Sem WebGL e sem rodapé
 * showpiece: quem caiu aqui quer sair rápido, não ser impressionado.
 *
 * Sem `robots` no metadata: o Next já injeta `noindex` na resposta 404, e
 * declarar de novo duplica a tag.
 */
export const metadata: Metadata = {
  title: "Página não encontrada",
};

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/projetos", label: "Projetos" },
];

export default function NotFound() {
  return (
    <main
      className="site-home"
      style={{
        minHeight: "100dvh",
        background: SURFACE.base,
        color: "#F5F2ED",
        display: "flex",
        alignItems: "center",
        padding: "clamp(24px,5vw,80px)",
      }}
    >
      <div style={{ maxWidth: 720 }}>
        <p
          style={{
            margin: 0,
            fontFamily: SATOSHI,
            fontSize: 10,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#FB3640",
          }}
        >
          Erro 404
        </p>
        <h1
          style={{
            margin: "18px 0 0",
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: "clamp(32px,5.4vw,64px)",
            letterSpacing: "-0.012em",
            lineHeight: 1.02,
            textWrap: "balance",
          }}
        >
          Esta página não existe.
        </h1>
        <p
          style={{
            margin: "20px 0 0",
            maxWidth: "52ch",
            fontFamily: SATOSHI,
            fontSize: "clamp(15px,1.4vw,17px)",
            lineHeight: 1.7,
            color: "#C8C4BE",
          }}
        >
          O endereço pode ter mudado ou o link estava errado. Os projetos e o
          contato continuam a um clique.
        </p>
        <nav
          aria-label="Páginas principais"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, marginTop: 36 }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="site-link-underline"
              style={{
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#F5F2ED",
                paddingBottom: 5,
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-cm-role="whatsapp"
            data-cm-id="404-whatsapp"
            className="site-cta"
            style={{
              background: "#FB3640",
              color: SURFACE.base,
              padding: "14px 24px",
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </main>
  );
}
