import Image from "next/image";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { TriArrow } from "@/components/ui/TriArrow";
import { CLIENT_PLATES, CTA_LABEL, HERO, WA_MESSAGE } from "@/data/criacaoDeSites";
import { WaCta } from "./Cta";

/**
 * Abertura. A primeira tela responde quatro coisas: o que é vendido (linha
 * acima do título), para quem (título e apoio), por que considerar (o site de
 * um cliente, no computador e no celular, com resultado medido) e como avançar
 * (o botão e a frase que diz o que acontece ao tocar).
 *
 * Nada aqui usa `Reveal`: ele esconde o conteúdo até o JavaScript rodar, e
 * título e botão são o que a pessoa veio ver. A captura do computador é
 * `priority` porque no desktop ela é o maior elemento da dobra.
 */
export function Hero() {
  const plate = CLIENT_PLATES.find((p) => p.slug === HERO.figureSlug) ?? CLIENT_PLATES[0];

  return (
    <section className="cs-hero" data-cm-section="hero">
      <div className="cs-wrap cs-hero-grid">
        <div className="cs-hero-text">
          <p className="cs-kicker">
            <strong>{HERO.kicker}</strong>
            <span>{HERO.place}</span>
          </p>
          <h1 className="cs-h1">
            {HERO.headline.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h1>
          <p className="cs-lead">{HERO.sub}</p>

          <div className="cs-hero-cta">
            <WaCta id="lp-hero" message={WA_MESSAGE} label={CTA_LABEL} />
            <p className="cs-small">{HERO.ctaNote}</p>
          </div>

          <ul className="cs-hero-links">
            {HERO.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="cs-link" data-cm-cta={`lp-hero-${link.href.slice(1)}`}>
                  {link.label}
                  <TriArrow />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <figure className="cs-hero-fig">
          <div className="cs-hero-stage">
            <BrowserFrame url={plate.siteUrl}>
              <div className="cs-shot">
                <Image
                  src={plate.shots.desktop}
                  alt={`Primeira tela do site da ${plate.title} no computador`}
                  width={1440}
                  height={900}
                  priority
                  sizes="(max-width: 999px) 88vw, 600px"
                />
              </div>
            </BrowserFrame>
            <div className="cs-phone cs-hero-phone">
              <Image
                src={plate.shots.mobile}
                alt={`O mesmo site da ${plate.title} no celular`}
                width={plate.shots.mobileSize.width}
                height={plate.shots.mobileSize.height}
                sizes="(max-width: 999px) 24vw, 160px"
              />
            </div>
          </div>
          <figcaption className="cs-hero-cap">
            <p className="cs-cap-name">
              {plate.title}: {plate.business.toLowerCase()}, {plate.place}.
            </p>
            {plate.metric && (
              <p className="cs-small">
                <span className="cs-metric-n">{plate.metric.value}</span> {plate.metric.label}{" "}
                {plate.metric.period}.
              </p>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
