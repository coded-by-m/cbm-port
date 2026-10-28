import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT, SKILLS, VALUES } from "@/data/about";
import { SOBRE_FAQ, SOBRE_LEAD } from "@/data/sobre";
import { PROCESS_STEPS } from "@/data/process";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_H3, PROSE_LINK, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import { GOOGLE_MAPS_URL, WHATSAPP_DISPLAY } from "@/lib/contact";
import { FOUNDER_ID, ORG_ID, breadcrumbSchema, faqPageSchema, graph, webPageSchema } from "@/lib/seo";

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
 * Sobre — bio, processo, pilares e tecnologias vêm dos mesmos dados da home.
 * O lead, o NAP (telefone visível + Maps) e o FAQ são desta página (AEO-4).
 */
export default function SobrePage() {
  return (
    <ProseShell label="Sobre" current="/sobre">
      <JsonLd
        data={graph(
          {
            ...webPageSchema({ path: "/sobre", name: TITLE, description: DESCRIPTION, type: "AboutPage" }),
            mainEntity: [{ "@id": ORG_ID }, { "@id": FOUNDER_ID }],
          },
          faqPageSchema("/sobre", SOBRE_FAQ),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Sobre", path: "/sobre" },
          ]),
        )}
      />
      <h1 style={PROSE_H1}>Sobre a Coded by M</h1>
      <p style={{ ...PROSE_P, color: "#E8E4DE" }}>{SOBRE_LEAD}</p>

      <h2 style={PROSE_H2}>Quem faz</h2>
      <p style={PROSE_P}>
        <strong style={STRONG}>{ABOUT.founder.name}</strong>, fundador. {ABOUT.founder.bio}
      </p>
      <p style={PROSE_P}>
        {`O estúdio fica em Florianópolis (SC) e atende empresas de todo o Brasil de forma remota. WhatsApp: ${WHATSAPP_DISPLAY}. Perfil no Google Maps: `}<a href={GOOGLE_MAPS_URL} rel="noopener noreferrer" target="_blank" style={PROSE_LINK}>Coded by M no Maps</a>.
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

      <section>
        <h2 style={PROSE_H2}>Perguntas frequentes</h2>
        {SOBRE_FAQ.map((item) => (
          <div key={item.q}>
            <h3 style={PROSE_H3}>{item.q}</h3>
            <p style={{ ...PROSE_P, marginTop: 8 }}>{item.a}</p>
          </div>
        ))}
      </section>

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
