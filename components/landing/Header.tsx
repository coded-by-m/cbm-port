import Link from "next/link";
import { LogoMarkSvg } from "@/components/site/shared";
import { CTA_LABEL, NAV, WA_MESSAGE } from "@/data/criacaoDeSites";
import { WaCta } from "./Cta";

/**
 * Cabeçalho fixo: marca, âncoras da própria página e o CTA.
 *
 * As âncoras não são saída: levam para seções desta página. Quem compara
 * fornecedores quer ir direto a projetos, processo e investimento. No celular
 * elas somem (a abertura tem os dois atalhos) e o CTA fica sempre à mão, o
 * que resolve os 4.600px sem botão que a crítica da versão anterior apontou.
 */
export function Header() {
  return (
    <header className="cs-header">
      <div className="cs-wrap cs-header-in">
        <Link href="/" className="cs-logo" aria-label="Coded by M, página inicial">
          <LogoMarkSvg size={15} />
          <span>
            Coded <b>by</b> M
          </span>
        </Link>

        <nav className="cs-nav" aria-label="Seções desta página">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <WaCta id="lp-header" message={WA_MESSAGE} label={CTA_LABEL} shortLabel="Orçamento" size="sm" />
      </div>
    </header>
  );
}
