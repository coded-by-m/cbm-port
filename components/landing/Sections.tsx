import Image from "next/image";
import { TriArrow } from "@/components/ui/TriArrow";
import { ABOUT } from "@/data/about";
import {
  ABOUT_LP,
  CTA_LABEL,
  DELIVERABLES,
  FAQ,
  INVESTMENT,
  PROCESS,
  SECTION_RULES,
  SITUATIONS,
  WA_MESSAGE,
} from "@/data/criacaoDeSites";
import { GOOGLE_MAPS_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/contact";
import { WaCta } from "./Cta";
import { SectionRule } from "./SectionRule";

/**
 * Situações. Não é lista de dores: cada linha junta o que o dono vive hoje
 * com o que muda, lado a lado. A composição é uma tabela de duas colunas, e
 * não cartões, porque a informação é uma comparação.
 */
export function Situations() {
  return (
    <section className="cs-section cs-section--raised" data-cm-section="situacoes" aria-labelledby="situacoes-titulo">
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.situacoes} />
        <h2 id="situacoes-titulo" className="cs-h2">
          {SITUATIONS.heading}
        </h2>
        <div className="cs-sit-cols" aria-hidden>
          <span>{SITUATIONS.before}</span>
          <span>{SITUATIONS.after}</span>
        </div>
        <ul className="cs-sit">
          {SITUATIONS.rows.map((row) => (
            <li key={row.before}>
              <p className="cs-sit-before">
                <span className="sr-only">{SITUATIONS.before}: </span>
                {row.before}
              </p>
              <p className="cs-sit-after">
                <TriArrow />
                <span>
                  <span className="sr-only">{SITUATIONS.after}: </span>
                  {row.after}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** O que entra em todo projeto, em linguagem de quem contrata, e o que fica de fora. */
export function Deliverables() {
  return (
    <section className="cs-section" data-cm-section="entregas" aria-labelledby="entregas-titulo">
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.entregas} />
        <div className="cs-deliv">
          <div className="cs-deliv-side">
            <h2 id="entregas-titulo" className="cs-h2">
              {DELIVERABLES.heading}
            </h2>
            <p className="cs-p">{DELIVERABLES.text}</p>
            <div className="cs-out">
              <h3 className="cs-h3">{DELIVERABLES.excluded.title}</h3>
              <p className="cs-p">{DELIVERABLES.excluded.text}</p>
            </div>
          </div>
          <div>
            <ol className="cs-deliv-list">
              {DELIVERABLES.items.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
            <ul className="cs-extras">
              {DELIVERABLES.extras.map((extra) => (
                <li key={extra}>{extra}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Processo. Cada etapa diz o que acontece e qual é a parte do cliente: é a
 * resposta para "quanto do meu tempo isso toma" e "onde eu aprovo".
 */
export function Process() {
  return (
    <section
      id="processo"
      className="cs-section cs-section--raised"
      data-cm-section="processo"
      aria-labelledby="processo-titulo"
    >
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.processo} />
        <h2 id="processo-titulo" className="cs-h2">
          {PROCESS.heading}
        </h2>
        <ol className="cs-steps">
          {PROCESS.steps.map((step, i) => (
            <li key={step.title} className="cs-step">
              <span className="cs-numeral cs-step-n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="cs-h3">{step.title}</h3>
              <p>{step.text}</p>
              <p className="cs-step-yours">
                <b>{PROCESS.yourPart}</b>
                {step.yours}
              </p>
            </li>
          ))}
        </ol>
        <div className="cs-deadline">
          <h3 className="cs-h3">{PROCESS.deadline.title}</h3>
          <dl>
            {PROCESS.deadline.rows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}:</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="cs-small">{PROCESS.deadline.note}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * Quem faz. Responde a objeção do estúdio solo de frente: quem é a pessoa,
 * o que ela não tem (anos de mercado) e o que protege o cliente mesmo assim.
 * A foto só aparece quando `ABOUT.founder.photo` existir.
 */
export function About() {
  const photo = ABOUT.founder.photo;

  return (
    <section className="cs-section" data-cm-section="quem-faz" aria-labelledby="quem-titulo">
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.quemFaz} />
        <div className="cs-about">
          <div className="cs-about-main">
            <h2 id="quem-titulo" className="cs-h2">
              {ABOUT_LP.heading}
            </h2>
            {photo && (
              <Image
                src={photo}
                alt="Matheus Mendes, fundador da Coded by M"
                width={640}
                height={800}
                sizes="(max-width: 999px) 80vw, 320px"
                className="cs-about-photo"
              />
            )}
            {ABOUT_LP.paragraphs.map((text) => (
              <p key={text} className="cs-p">
                {text}
              </p>
            ))}
            <p className="cs-p">{ABOUT_LP.honest}</p>
          </div>

          <div className="cs-guards">
            <h3 className="cs-h3">{ABOUT_LP.guardTitle}</h3>
            <dl>
              {ABOUT_LP.guards.map((guard) => (
                <div key={guard.title}>
                  <dt>{guard.title}</dt>
                  <dd>{guard.text}</dd>
                </div>
              ))}
            </dl>
            <div className="cs-verify">
              <p className="cs-small">{ABOUT_LP.verifyTitle}</p>
              <ul>
                <li>
                  <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="cs-link" data-cm-id="lp-quem-google">
                    Perfil da empresa no Google
                    <TriArrow dir="up-right" />
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="cs-link" data-cm-id="lp-quem-instagram">
                    Instagram {INSTAGRAM_HANDLE}
                    <TriArrow dir="up-right" />
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "R$ 800" sem quebra entre o símbolo e o número. */
function nobreak(price: string) {
  return price.replace("R$ ", "R$ ");
}

/**
 * Investimento. A superfície inverte para o off-white da marca: é o momento
 * de "proposta impressa" da página, e o único. O piso nunca aparece sozinho:
 * vem com o tamanho do projeto, o prazo, o que muda o valor e o que custa
 * depois, que é a pergunta "quanto vou gastar no total?".
 */
export function Investment() {
  return (
    <section
      id="investimento"
      className="cs-section cs-light"
      data-cm-section="investimento"
      aria-labelledby="investimento-titulo"
    >
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.investimento} />
        <h2 id="investimento-titulo" className="cs-h2">
          {INVESTMENT.heading}
        </h2>

        <div className="cs-formats">
          {INVESTMENT.formats.map((format) => (
            <article key={format.name} className="cs-format">
              <h3 className="cs-h3">{format.name}</h3>
              <p className="cs-p">{format.when}</p>
              <dl>
                <div>
                  <dt>{INVESTMENT.rowLabels.price}</dt>
                  <dd className="cs-price">
                    <small>{INVESTMENT.from}</small>
                    <b>{nobreak(format.price)}</b>
                  </dd>
                </div>
                <div>
                  <dt>{INVESTMENT.rowLabels.size}</dt>
                  <dd>{format.size}</dd>
                </div>
                <div>
                  <dt>{INVESTMENT.rowLabels.deadline}</dt>
                  <dd>{format.deadline}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="cs-terms">
          <section>
            <h3 className="cs-h3">{INVESTMENT.changes.title}</h3>
            <p className="cs-p">{INVESTMENT.changes.text}</p>
          </section>
          <section>
            <h3 className="cs-h3">{INVESTMENT.after.title}</h3>
            <dl>
              {INVESTMENT.after.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="cs-invest-cta">
          <p className="cs-p">{INVESTMENT.filter}</p>
          <div>
            <WaCta id="lp-investimento" message={WA_MESSAGE} label={CTA_LABEL} />
            <p className="cs-small">{INVESTMENT.ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Dúvidas em `<details>` nativo: teclado e leitor de tela de graça, zero
 * JavaScript, e o texto está no HTML mesmo fechado. Só entra aqui o que as
 * seções acima não responderam.
 */
export function Faq() {
  return (
    <section id="duvidas" className="cs-section" data-cm-section="duvidas" aria-labelledby="duvidas-titulo">
      <div className="cs-wrap">
        <SectionRule rule={SECTION_RULES.duvidas} />
        <div className="cs-faq">
          <h2 id="duvidas-titulo" className="cs-h2">
            {FAQ.heading}
          </h2>
          <div className="cs-faq-list">
            {FAQ.items.map((item) => (
              <details key={item.q} className="lp-faq">
                <summary>
                  {item.q}
                  <span aria-hidden className="lp-faq-mark" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
