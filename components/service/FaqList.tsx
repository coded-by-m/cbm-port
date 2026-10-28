import { Fragment } from "react";
import Link from "next/link";
import { faqAnswerSegments, isFilled, type FaqItem } from "@/data/servicePages";
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
              {faqAnswerSegments(f).map((segment, j) =>
                segment.type === "link" ? (
                  <Link key={j} href={segment.href}>
                    {segment.label}
                  </Link>
                ) : (
                  <Fragment key={j}>{segment.text}</Fragment>
                ),
              )}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
