import type { SectionRuleCopy } from "@/data/criacaoDeSites";

/**
 * Régua de seção: o pré-título da marca virado estrutura. Uma linha fina com
 * a posição e o nome à esquerda e a contagem à direita, no lugar do filete
 * que separava as seções. É decorativa para leitor de tela: o `h2` logo
 * abaixo já diz o que a seção é.
 */
export function SectionRule({ rule }: { rule: SectionRuleCopy }) {
  return (
    <div className="cs-rule" aria-hidden>
      <span className="cs-rule-label">
        <b>{rule.n}</b>
        {rule.label}
      </span>
      {rule.aside && <span className="cs-rule-aside">{rule.aside}</span>}
    </div>
  );
}
