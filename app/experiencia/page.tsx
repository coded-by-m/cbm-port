import type { Metadata } from "next";
import Link from "next/link";
import { HomeExperience } from "@/components/home/HomeExperience";
import { OG, OG_SIZE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "A Experiência",
  description:
    "A experiência WebGL da Coded by M — nove capítulos navegáveis, do símbolo ao convite. Design, tecnologia e pensamento estrutural em movimento.",
  alternates: { canonical: "/experiencia" },
  openGraph: {
    title: "A Experiência · Coded by M",
    description:
      "Nove capítulos em WebGL, navegáveis um a um — o site da Coded by M montado camada por camada.",
    url: "/experiencia",
    type: "website",
    images: [{ url: OG.experiencia, ...OG_SIZE, alt: "A Experiência — Coded by M" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Experiência · Coded by M",
    description:
      "Nove capítulos em WebGL, navegáveis um a um — o site da Coded by M montado camada por camada.",
    images: [OG.experiencia],
  },
};

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/projetos", label: "Projetos" },
  { href: "/landing-page", label: "Criação de landing page" },
  { href: "/site-institucional", label: "Site institucional" },
];

/**
 * A experiência é canvas: sem este bloco o HTML do servidor não teria texto
 * nem link pra busca seguir. Fica no fim da página, visível e pequeno — nada
 * de `display: none`, que o Google trata como texto escondido.
 */
function AboutExperience() {
  return (
    <aside
      aria-labelledby="sobre-experiencia"
      style={{
        background: "#000F08",
        borderTop: "1px solid rgba(245,242,237,0.08)",
        padding: "40px clamp(20px,4vw,48px) 48px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <h2
          id="sobre-experiencia"
          style={{
            margin: 0,
            fontFamily: '"Panchang", sans-serif',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.04em",
            color: "rgba(245,242,237,0.75)",
          }}
        >
          Uma experiência interativa da Coded by M
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: "70ch",
            fontFamily: '"Satoshi", sans-serif',
            fontSize: 13,
            lineHeight: 1.7,
            color: "rgba(245,242,237,0.5)",
          }}
        >
          Nove capítulos em WebGL que montam o site do estúdio camada por camada.
          É uma demonstração do que a Coded by M cria com código próprio, sem
          template — o mesmo cuidado que vai para cada landing page e site
          institucional.
        </p>
        <nav aria-label="Páginas do site" style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: '"Satoshi", sans-serif',
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(245,242,237,0.65)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default function ExperienciaPage() {
  return (
    <>
      <HomeExperience />
      <AboutExperience />
    </>
  );
}
