import Link from "next/link";
import { CONTACT, CONTACT_CHOICES, SECTION_RULES, WA_MESSAGE } from "@/data/criacaoDeSites";
import { PRIVACY_PATH } from "@/data/privacidade";
import { WHATSAPP_DISPLAY } from "@/lib/contact";
import { LEGAL, SITE_NAME } from "@/lib/site";
import { ContactPicker } from "./ContactPicker";
import { WaLink } from "./Cta";
import { SectionRule } from "./SectionRule";
import { Terrain } from "./Terrain";

/**
 * Contato final. Diz o que acontece depois do clique, em três passos, e deixa
 * a pessoa escolher o tipo de projeto para a conversa começar com contexto.
 * Não há formulário: o canal de venda é a conversa no WhatsApp, e um
 * formulário sem backend seria um retorno falso.
 */
export function Contact() {
  return (
    <section
      id="contato"
      className="cs-section cs-section--raised cs-closing"
      data-cm-section="contato"
      aria-labelledby="contato-titulo"
    >
      <Terrain className="cs-closing-terrain" />
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.contato} />
        <h2 id="contato-titulo" className="cs-h2 cs-display">
          {CONTACT.heading}
        </h2>
        <div className="cs-contact">
          <div>
            <ol className="cs-contact-steps">
              {CONTACT.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="cs-picker-col">
            <ContactPicker choices={CONTACT_CHOICES} legend={CONTACT.choiceLegend} cta={CONTACT.cta} />
            <p className="cs-number">
              {CONTACT.numberLabel}
              <WaLink id="lp-contato-numero" message={WA_MESSAGE}>
                {WHATSAPP_DISPLAY}
              </WaLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Rodapé com a identificação de quem está por trás da página. Quem chega por
 * anúncio ainda não conhece o estúdio. Razão social e CNPJ entram quando
 * forem informados em `lib/site.ts` (`LEGAL`); até lá, a linha não existe.
 */
export function Footer() {
  const legalLine = [LEGAL.razaoSocial, LEGAL.cnpj ? `CNPJ ${LEGAL.cnpj}` : null].filter(Boolean).join(" · ");

  return (
    <footer className="cs-footer">
      <div className="cs-wrap cs-footer-in">
        <div>
          <p>
            <strong>{SITE_NAME}</strong>, estúdio de {LEGAL.owner}. {LEGAL.city}.
          </p>
          {legalLine && <p>{legalLine}</p>}
        </div>
        <ul>
          <li>
            <WaLink id="lp-footer" message={WA_MESSAGE}>
              WhatsApp {WHATSAPP_DISPLAY}
            </WaLink>
          </li>
          <li>
            <Link href={PRIVACY_PATH} className="cs-link">
              Privacidade e cookies
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
