import Link from "next/link";
import { waLink } from "@/lib/contact";
import { TriArrow } from "@/components/ui/TriArrow";
import { FOOTER_LINKS, PORTFOLIO_WA_MESSAGE } from "./GalleryFooter";

/**
 * Fecho da `/projetos`: a pergunta em corpo de título, o WhatsApp, o
 * "Salvar contato" (vCard) e a navegação do rodapé.
 *
 * Tem fundo sólido e fica acima da cena: é ele que encerra a capa em tela
 * cheia. Os `data-cm-*` são os mesmos do `GalleryFooter`, pra o histórico do
 * tracker desta página não quebrar.
 */
export function IndexClosing() {
  return (
    <footer data-cm-section="contact" className="pi-closing">
      <div className="pi-closing-inner">
        <p className="pi-closing-title">Tem um projeto em mente?</p>
        <div className="pi-closing-ctas">
        <a
          href={waLink(PORTFOLIO_WA_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          data-cm-role="whatsapp"
          data-cm-id="gallery-footer-whatsapp"
          className="pi-closing-cta"
        >
          Falar no WhatsApp
          <TriArrow dir="up-right" />
        </a>
        <a
          href="/contato.vcf"
          data-cm-role="secondary-cta"
          data-cm-id="gallery-footer-vcard"
          className="pi-closing-cta is-quiet"
        >
          Salvar contato
        </a>
        </div>
      </div>
      <nav aria-label="Navegação do rodapé" className="pi-closing-nav">
        <span className="pi-closing-label">Navegação</span>
        {FOOTER_LINKS.filter((l) => l.href !== "/projetos").map((l) => (
          <Link key={l.href} href={l.href} className="pi-closing-link">
            {l.label}
          </Link>
        ))}
        <span className="pi-closing-label pi-closing-place">Coded by M · Florianópolis - SC</span>
      </nav>
    </footer>
  );
}
