import Image from "next/image";
import { TriArrow } from "@/components/ui/TriArrow";
import { CLIENT_PLATES, CONCEPTS, CTA_LABEL, PROJECTS, SECTION_RULES, WA_MESSAGE } from "@/data/criacaoDeSites";
import { WaCta } from "./Cta";
import { ProjectPlate } from "./ProjectPlate";
import { SectionRule } from "./SectionRule";

/**
 * Projetos. Clientes reais primeiro, cada um com o endereço no ar para a
 * pessoa abrir. Conceitos vêm depois, em tamanho menor e com o rótulo dito no
 * título do grupo e em cada imagem: o site nunca apresenta estudo como entrega.
 */
export function Projects() {
  return (
    <section id="projetos" className="cs-section" data-cm-section="projetos" aria-labelledby="projetos-titulo">
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.projetos} />
        <div className="cs-section-head">
          <h2 id="projetos-titulo" className="cs-h2">
            {PROJECTS.heading}
          </h2>
          <p className="cs-lead">{PROJECTS.sub}</p>
        </div>

        <div className="cs-plates">
          {CLIENT_PLATES.map((plate, i) => (
            <ProjectPlate key={plate.slug} plate={plate} index={i} flip={i % 2 === 1} />
          ))}
        </div>

        <div className="cs-proj-cta">
          <div>
            <p className="cs-h3">{PROJECTS.cta.text}</p>
            <p className="cs-small">{PROJECTS.cta.note}</p>
          </div>
          <WaCta id="lp-projetos" message={WA_MESSAGE} label={CTA_LABEL} />
        </div>

        <div className="cs-concepts" aria-labelledby="conceitos-titulo">
          <div className="cs-concepts-head">
            <h3 id="conceitos-titulo" className="cs-h3">
              {CONCEPTS.heading}
            </h3>
            <p className="cs-p">{CONCEPTS.text}</p>
          </div>
          <ul className="cs-concept-row">
            {CONCEPTS.cards.map((card) => (
              <li key={card.slug} className="cs-concept">
                <div className="cs-concept-shot">
                  <Image
                    src={card.image}
                    alt={`Estudo conceitual ${card.title}: ${card.format.toLowerCase()}`}
                    width={760}
                    height={874}
                    sizes="(max-width: 759px) 76vw, 380px"
                  />
                  <span className="cs-concept-tag">{CONCEPTS.label}</span>
                </div>
                <h4>{card.title}</h4>
                <p>
                  {card.sector} · {card.format}
                </p>
                <a
                  href={`https://${card.siteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-link"
                  data-cm-project={card.slug}
                  data-cm-id={`lp-conceito-${card.slug}`}
                >
                  Abrir o estudo
                  <TriArrow dir="up-right" />
                  <span className="sr-only"> {card.title} (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
