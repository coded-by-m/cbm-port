import { Fragment } from "react";
import Link from "next/link";
import { isFilled, type FaqItem } from "@/data/servicePages";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Perguntas frequentes em `<details>` nativo — mesmo acordeão das landings.
 *
 * O texto sai no HTML do servidor mesmo fechado, e é o mesmo que vai pro
 * `FAQPage` (ver `faqPageSchema`). Rascunhos com PREENCHER não renderizam.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div>
      {items.filter(isFilled).map((f, i) => (
        <Reveal key={f.q} delay={i * 70}>
          <details className="lp-faq">
            <summary>
              {f.q}
              <span aria-hidden className="lp-faq-mark" />
            </summary>
            <p>
              {f.a}
              {f.links?.length ? (
                <>
                  {" "}Veja:{" "}
                  {f.links.map((l, j) => (
                    <Fragment key={l.href}>
                      {j > 0 && " e "}
                      <Link href={l.href}>{l.label}</Link>
                    </Fragment>
                  ))}
                  .
                </>
              ) : null}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
