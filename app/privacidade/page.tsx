import type { Metadata } from "next";
import { ConsentChoice } from "@/components/analytics/ConsentChoice";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  PRIVACY_CHOICE_HEADING,
  PRIVACY_CHOICE_TEXT,
  PRIVACY_DESCRIPTION,
  PRIVACY_LEAD,
  PRIVACY_PATH,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
  PRIVACY_UPDATED,
} from "@/data/privacidade";
import { WHATSAPP_DISPLAY } from "@/lib/contact";
import { cbm } from "@/lib/palette";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: PRIVACY_TITLE,
  description: PRIVACY_DESCRIPTION,
  alternates: { canonical: PRIVACY_PATH },
};

export default function PrivacidadePage() {
  return (
    <ProseShell label="Privacidade" current={PRIVACY_PATH}>
      <JsonLd
        data={graph(
          webPageSchema({ path: PRIVACY_PATH, name: PRIVACY_TITLE, description: PRIVACY_DESCRIPTION }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: PRIVACY_TITLE, path: PRIVACY_PATH },
          ]),
        )}
      />
      <h1 style={PROSE_H1}>{PRIVACY_TITLE}</h1>
      <p style={{ ...PROSE_P, color: cbm("gray-100") }}>{PRIVACY_LEAD}</p>

      {PRIVACY_SECTIONS.map((section) => (
        <section key={section.heading}>
          <h2 style={PROSE_H2}>{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} style={PROSE_P}>
              {text.replace("{whatsapp}", WHATSAPP_DISPLAY)}
            </p>
          ))}
        </section>
      ))}

      <section>
        <h2 style={PROSE_H2}>{PRIVACY_CHOICE_HEADING}</h2>
        <p style={PROSE_P}>{PRIVACY_CHOICE_TEXT}</p>
        <ConsentChoice />
      </section>

      <p style={{ ...PROSE_P, marginTop: 48, color: cbm("gray-400") }}>
        Última atualização: {PRIVACY_UPDATED}.
      </p>
    </ProseShell>
  );
}
