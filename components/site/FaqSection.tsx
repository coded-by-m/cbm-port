import { HOME_FAQ, SECTIONS } from "@/data/home";
import { SECTION, SectionHead } from "./shared";
import { FaqList } from "@/components/service/FaqList";
import { FillButton } from "@/components/ui/FillButton";
import { contextualWaLink } from "@/lib/contact";

const FAQ_WA = contextualWaLink("question");

/**
 * Perguntas frequentes da home, antes do convite. Responde o que quem chega
 * pela busca pergunta antes de chamar — e alimenta o `FAQPage` da página.
 */
export function FaqSection() {
  return (
    <section id="duvidas" data-cm-section="faq" style={SECTION}>
      <SectionHead heading={SECTIONS.faq.heading} />
      <div style={{ maxWidth: 860 }}>
        <FaqList items={HOME_FAQ} />
        <FillButton
          href={FAQ_WA}
          target="_blank"
          data-cm-role="whatsapp"
          data-cm-id="faq-whatsapp"
          style={{ marginTop: 32 }}
        >
          Tirar uma dúvida no WhatsApp
        </FillButton>
      </div>
    </section>
  );
}
