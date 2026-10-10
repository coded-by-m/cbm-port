import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT, SKILLS, VALUES } from "@/data/about";
import { PROCESS_STEPS } from "@/data/process";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_LINK, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { FOUNDER_ID, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";

const TITLE = "Sobre o estúdio — web design em Florianópolis";
const DESCRIPTION =
  "Quem está por trás da Coded by M: Matheus Mendes, web designer e desenvolvedor em Florianópolis. Como o estúdio trabalha, com que tecnologias e para quem.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sobre" },
};

const STRONG = { color: "#F5F2ED", fontWeight: 600 } as const;

/**
 * Sobre — só copy que já existe em `data/about.ts` e `data/process.ts`, a
 * mesma da home. Nada aqui é escrito pela primeira vez.
 */
export default function SobrePage() {
  return (
    <ProseShell label="Sobre" current="/sobre">
      <JsonLd
        data={graph(
          {
            ...webPageSchema({ path: "/sobre", name: TITLE, description: DESCRIPTION, type: "AboutPage" }),
            mainEntity: { "@id": FOUNDER_ID },
          },
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Sobre", path: "/sobre" },
          ]),
        )}
      />
      <h1 style={PROSE_H1}>Sobre a Coded by M</h1>
      <p style={{ ...PROSE_P, color: "#E8E4DE" }}>{ABOUT.manifesto}</p>

      <h2 style={PROSE_H2}>Quem faz</h2>
      <p style={PROSE_P}>
        <strong style={STRONG}>{ABOUT.founder.name}</strong>, fundador. {ABOUT.founder.bio}
      </p>
      <p style={PROSE_P}>
        O estúdio fica em Florianópolis - SC e atende empresas de todo o Brasil de forma remota.
      </p>

      <h2 style={PROSE_H2}>Como trabalho</h2>
      {PROCESS_STEPS.map((s) => (
        <p key={s.num} style={PROSE_P}>
          <strong style={STRONG}>
            {s.num} · {s.title}.
          </strong>{" "}
          {s.desc}
        </p>
      ))}

      <h2 style={PROSE_H2}>O que guia cada projeto</h2>
      {VALUES.map((v) => (
        <p key={v.title} style={PROSE_P}>
          <strong style={STRONG}>{v.title}.</strong> {v.desc}
        </p>
      ))}

      <h2 style={PROSE_H2}>Tecnologias e capacidades</h2>
      <p style={PROSE_P}>{SKILLS.map((s) => s.label).join(" · ")}.</p>

      <p style={{ ...PROSE_P, marginTop: 48 }}>
        Conheça os serviços:{" "}
        <Link href="/landing-page" style={PROSE_LINK}>
          criação de landing page
        </Link>
        {", "}
        <Link href="/site-institucional" style={PROSE_LINK}>
          site institucional
        </Link>
        {" e "}
        <Link href="/sites-para-arquitetura" style={PROSE_LINK}>
          sites para arquitetura
        </Link>
        . Ou veja os{" "}
        <Link href="/projetos" style={PROSE_LINK}>
          projetos
        </Link>
        .
      </p>
    </ProseShell>
  );
}
