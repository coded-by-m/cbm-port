import Image from "next/image";
import Link from "next/link";
import { TriArrow } from "@/components/ui/TriArrow";
import { status, type BbOther } from "./shared";

/**
 * "Ver mais": os outros sites, fechados num <details>. A página continua
 * curada (três em destaque), mas quem quer mais abre a lista sem sair dela.
 * Sem JS: o <details> abre sozinho, e o conteúdo fica no HTML pro Google.
 */
/** "2 clientes no ar e 5 estudos conceituais": número de verdade, não "outros". */
function hint(others: BbOther[]) {
  const live = others.filter((o) => !o.concept).length;
  const study = others.length - live;
  const parts = [
    live && `${live} ${live === 1 ? "cliente" : "clientes"} no ar`,
    study &&
      `${study} ${study === 1 ? "estudo conceitual" : "estudos conceituais"}`,
  ].filter(Boolean);
  return parts.join(" e ");
}

export function Outros({ others }: { others: BbOther[] }) {
  if (others.length === 0) return null;
  return (
    <section
      className="bb-others"
      data-cm-section="projetos-outros"
      aria-labelledby="bb-others-h"
    >
      <details className="bb-others-box">
        <summary
          className="bb-others-sum"
          data-cm-role="secondary-cta"
          data-cm-id="projetos-ver-mais"
        >
          <span className="bb-others-title" id="bb-others-h">
            Ver mais sites <span>({others.length})</span>
          </span>
          <span className="bb-others-hint">{hint(others)}</span>
          <span className="bb-others-icon" aria-hidden />
        </summary>

        <ul className="bb-others-list">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/cases/${o.slug}`}
                className="bb-other"
                data-cm-role="secondary-cta"
                data-cm-id={`case-${o.slug}`}
              >
                <span className="bb-other-thumb">
                  <Image
                    src={o.thumb}
                    alt=""
                    fill
                    sizes="(min-width: 960px) 240px, 132px"
                    quality={70}
                  />
                </span>
                <span className="bb-other-text">
                  <b>{o.title}</b>
                  <span>
                    {o.setor} · <span className="bb-keep">{status(o)}</span>
                  </span>
                </span>
                <span className="bb-other-go" aria-hidden>
                  <TriArrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
